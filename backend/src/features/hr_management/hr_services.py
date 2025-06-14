import pika
import json

from src.core import settings


def publish_to_rabbitmq(payload: dict):
    try:
        connection = pika.BlockingConnection(pika.URLParameters(settings.rabbitmq_url))
        channel = connection.channel()
        channel.queue_declare(queue="cv_queue", durable=True)

        message = json.dumps(payload)
        channel.basic_publish(
            exchange="",
            routing_key="cv_queue",
            body=message,
            properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
            ),
        )
        connection.close()
    except Exception as e:
        raise RuntimeError(f"Failed to publish to RabbitMQ: {e}")
