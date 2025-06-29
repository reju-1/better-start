from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel, EmailStr, ConfigDict, Field, conint, constr
from src import enums


class JobListingResponse(BaseModel):
    id: int
    company_id: int
    title: str
    job_description: str
    role_apply: str
    skill_require: str
    skill_prefer: str
    experience_level: str
    prefered_engagement: Optional[str] = None
    location: str
    salary: Optional[str] = None
    employement_type: str
    created_at: datetime
    end_date: date


class JobCreate(BaseModel):
    """Represents how a job post looks to the frontend/client"""

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


class JobCreateResponse(BaseModel):
    message: str
    job_id: int
    company_id: int


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


class CVSubmitResponse(BaseModel):
    id: int
    job_id: int
    name: str
    email: str
    phone: str
    cv_pdf: str
    cv_rating: Optional[float]
    cv_feedback: Optional[str]
    status: enums.ApplicationStatus


# === CV Request and Response Schemas ===
class CvReportRequest(BaseModel):
    applicant_id: int
    job_prompt: str
    cv_pdf_url: str  # S3 URL


class CvReport(BaseModel):
    applicant_id: int
    rating: conint(ge=1, le=5)  # type: ignore
    remarks: constr(strip_whitespace=True, max_length=300)  # type: ignore
