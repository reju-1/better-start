import json
from tenacity import retry, wait_exponential
from tenacity import stop_after_attempt, retry_if_exception_type
from google import generativeai as gemini
from ..config import settings

gemini.configure(api_key=settings.gemini_api_key)

# Create and export model instance
model = gemini.GenerativeModel(model_name="gemini-2.0-flash")


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
