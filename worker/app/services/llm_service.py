from openai import OpenAI
import json
from tenacity import (
    retry,
    wait_exponential,
    stop_after_attempt,
    retry_if_exception_type,
)
from ..config import settings
from openai import OpenAIError

print(f"{settings=} xx")
client = OpenAI(api_key=settings.openai_api_key)

ATTEMPT = 1


# wait =min(max(min, multiplier×2^attempt), max) # wait <= max
@retry(
    wait=wait_exponential(multiplier=1, min=5, max=10),
    stop=stop_after_attempt(ATTEMPT),  # for n,  1 original attempt and n-1 retry
    retry=retry_if_exception_type(OpenAIError),
    reraise=True,
)
def analyze_cv_with_prompt_V1(cv_text: str, job_prompt: str) -> dict:
    system_prompt = """You are a helpful HR assistant.
    You will receive a CV and a job description.
    Evaluate how well the CV matches the job description.
    Return a JSON with 'rating' (1-5) and 'remarks' (max 3 lines)."""

    user_prompt = f"""
        Job Description: {job_prompt}
        Candidate CV: {cv_text}
        Respond in JSON format:
            {{
            "rating": (integer from 1 to 5),
            "remarks": "3 line summary"
            }}
    """

    try:
        # print("-------------------\n")
        # print(
        #     f"{len(system_prompt) = } {len(user_prompt)= } {len(cv_text) = } {len(job_prompt)=}"
        # )
        # print(f"{system_prompt} \n\n {cv_text = }")
        # print("-------------------\n")
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
        )

        result = json.loads(response.choices[0].message.content.strip())
        return result

    except json.JSONDecodeError:
        return {
            "rating": 1,
            "remarks": "Response could not be parsed. Review CV and job prompt.",
        }
    except OpenAIError as e:
        print(f"[OpenAI API error] {e}")
        raise  # will be retried by @retry
    except Exception as e:
        print(f"[Unexpected error] {e}")
        return {"rating": 1, "remarks": "Unexpected error occurred during analysis."}
