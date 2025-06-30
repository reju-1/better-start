import json
from tenacity import (
    retry,
    wait_exponential,
    stop_after_attempt,
    retry_if_exception_type,
)
from google import generativeai as gemini
import google.api_core.exceptions as ga_exceptions  # Import Google API exceptions

from ..config import settings

gemini.configure(api_key=settings.gemini_api_key)
model = gemini.GenerativeModel(model_name="gemini-2.0-flash")


def analyze_cv_with_prompt_gemini(cv_text: str, job_prompt: str) -> dict:
    full_prompt = f"""You are a helpful HR assistant.
    You will receive a CV and a job description.
    Evaluate how well the CV matches the job description.
    
    Job Description: {job_prompt}
    Candidate CV: {cv_text}
    
    Return a JSON with 'rating' (integer from 1 to 5) and 'remarks' (max 2 lines or at max 200 character string).
    
    Ensure your response is strictly in JSON format, like this:
    {{
        "rating": (integer from 1 to 5),
        "remarks": "2 line summary or at max 200 character string"
    }}
    """

    try:
        response = model.generate_content(
            full_prompt,
            generation_config=gemini.GenerationConfig(
                temperature=0.3,
                response_mime_type="application/json",  # <--- This is the key change!
            ),
        )

        result_text = response.text.strip()
        print(result_text)
        result = json.loads(result_text)
        return result

    except json.JSONDecodeError:
        return {
            "rating": 1,
            "remarks": "Response could not be parsed. Review CV and job prompt.",
        }
    except Exception as e:
        print(f"[Unexpected error] {e}")
        return {"rating": 1, "remarks": "Unexpected error occurred during analysis."}


RETRY_EXCEPTIONS = (
    ga_exceptions.DeadlineExceeded,
    ga_exceptions.InternalServerError,
    json.JSONDecodeError,
)


@retry(
    wait=wait_exponential(
        multiplier=1, min=2, max=10
    ),  # Exponential backoff: 2s, 4s, 8s
    stop=stop_after_attempt(3),  # Try up to 3 times
    retry=retry_if_exception_type(RETRY_EXCEPTIONS),
)
def analyze_cv_with_prompt_v2_gemini(cv_text: str, job_prompt: str) -> dict:
    full_prompt = f"""You are a helpful HR assistant.
    You will receive a CV and a job description.
    Evaluate how well the CV matches the job description.

    Job Description: {job_prompt}
    Candidate CV: {cv_text}

    Return a JSON with 'rating' (integer from 1 to 5) and 'remarks' (max 2 lines or at max 200 character string).

    Ensure your response is strictly in JSON format, like this:
    {{
        "rating": (integer from 1 to 5),
        "remarks": "2 line summary or at max 200 character string"
    }}
    """

    try:
        response = model.generate_content(
            full_prompt,
            generation_config=gemini.GenerationConfig(
                temperature=0.3,
                response_mime_type="application/json",
            ),
        )

        result_text = response.text.strip()
        print(f"Attempt successful. Raw response: {result_text}")
        result = json.loads(result_text)
        return result

    except json.JSONDecodeError as e:
        print(f"JSON Decode Error on attempt: {e}. Raw response: {result_text}")
        raise e
    except ga_exceptions.GoogleAPIError as e:
        print(f"Google API Error on attempt: {e}")
        raise e
    except Exception as e:
        print(f"[Unexpected error] {e}")
        raise e


def analyze_cv_robustly(cv_text: str, job_prompt: str) -> dict:
    try:
        return analyze_cv_with_prompt_v2_gemini(cv_text, job_prompt)
    except RETRY_EXCEPTIONS as e:
        # This block catches the exception if all retries fail
        print(f"All retry attempts failed due to: {type(e).__name__} - {e}")
        return {
            "rating": 1,
            "remarks": "Failed to get a valid response after multiple attempts.",
        }
    except Exception as e:
        # Catch any other unhandled exceptions that might slip through
        print(f"An unhandled error occurred: {e}")
        return {"rating": 1, "remarks": "An unhandled error occurred during analysis."}
