from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


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

    class Config:
        orm_mode = True  # allows using ORM objects directly


class JobApply(BaseModel):
    """What the candidate fills in when applying for a job"""

    name: str              # Full name of the applicant
    email: EmailStr        # Validated email
    phone: str             # Contact number
    cv_pdf: str            # Link or filename for uploaded CV (PDF)


class JobApplyResponse(BaseModel):
    """The response sent after a candidate successfully applies"""

    message: str = "Application submitted successfully"  # Status message
    applicant_name: str                                   # For display
    job_id: int                                            # Job they applied to
