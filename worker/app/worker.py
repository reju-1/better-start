import pika
import httpx
from io import BytesIO
from .config import settings
from .utilities.pdf_reader import extract_text_from_pdf
from .services.llm_service import analyze_cv_with_prompt_V1
from .services.s3 import create_presigned_url
from .utilities.schemas import CvReport, CvReportRequest


def callback(ch, method, properties, body):
    try:
        data = CvReportRequest.model_validate_json(body)
        task_id = data.applicant_id
        job_prompt = data.job_prompt

        # Fetch and extract text from PDF
        url = create_presigned_url(settings.s3_bucket_name, data.cv_pdf_url)
        if url is None:
            raise Exception("Error generating presigned url")
        pdf_response = httpx.get(url)
        pdf_response.raise_for_status()
        cv_text = extract_text_from_pdf(BytesIO(pdf_response.content))

        # Analyze with via LLM
        result_dict = analyze_cv_with_prompt_V1(cv_text, job_prompt)
        # result_dict = {
        #     "rating": 4,
        #     "remarks": "Very suitable candidate (^_^)",
        # }
        report = CvReport(**result_dict, applicant_id=task_id)  # validate response
        print(f"LLM {report =}")

        # Post result to FastAPI
        response = httpx.post(settings.result_post_url, json=report.model_dump())
        response.raise_for_status()

        ch.basic_ack(delivery_tag=method.delivery_tag)
        print(f"Processed task: {task_id}")

    except Exception as e:
        print(f"[!] Error: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)


def worker():
    params = pika.URLParameters(settings.rabbitmq_url)
    with pika.BlockingConnection(params) as connection:
        channel = connection.channel()
        channel.queue_declare(queue="cv_queue", durable=True)
        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue="cv_queue", on_message_callback=callback)

        print("[*] Waiting for messages. To exit press CTRL+C")
        channel.start_consuming()
