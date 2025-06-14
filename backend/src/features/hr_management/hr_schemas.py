from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict, Field, conint, constr


class JobPost(BaseModel):
    """Represents how a job post looks to the frontend/client"""

    # Unique identifier for the job post
    id: int

    # The company that created the job post
    company_id: int

    # Basic job info
    title: str
    job_description: str
    role_apply: str

    # Work format (e.g., Remote, Hybrid, On-site)
    prefered_engagement: Optional[str]

    # Required and preferred skills
    skill_require: str
    skill_prefer: str

    # Candidate profile
    experience_level: str
    location: str
    salary: Optional[str]
    employement_type: Optional[str]

    # Dates
    created_at: datetime
    end_date: datetime

    model_config = ConfigDict(from_attributes=True)


class JobApply(BaseModel):
    """What the candidate fills in when applying for a job"""

    job_id: int = Field(..., description="ID of the job the candidate is applying to")
    name: str = Field(..., description="Full name of the candidate")
    email: EmailStr
    phone: str
    cv_pdf: str = Field(..., description="S3 object key of the uploaded CV")


class JobApplyResponse(BaseModel):
    """The response sent after a candidate successfully applies"""

    message: str = "Application submitted successfully"  # Status message
    applicant_name: str  # For display
    job_id: int  # Job they applied to


# === CV Request and Response Schemas ===
class CvReportRequest(BaseModel):
    applicant_id: int
    job_prompt: str
    cv_pdf_url: str  # S3 URL


class CvReport(BaseModel):
    applicant_id: int
    rating: conint(ge=1, le=5)  # type: ignore
    remarks: constr(strip_whitespace=True, max_length=300)  # type: ignore
