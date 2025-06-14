from pydantic import BaseModel, conint, constr


# === CV Request and Response Schemas ===
class CvReportRequest(BaseModel):
    applicant_id: int
    job_prompt: str
    cv_pdf_url: str  # S3 URL


class CvReport(BaseModel):
    applicant_id: int
    rating: conint(ge=1, le=5)  # type: ignore
    remarks: constr(strip_whitespace=True, max_length=300)  # type: ignore
