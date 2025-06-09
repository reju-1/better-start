from sqlmodel import SQLModel, Field
from typing import Optional


class CVSubmit(SQLModel, table=True):
    """Represents a candidate's application to a job post"""

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)

    # Foreign Key
    job_listing_id: int = Field(foreign_key="joblisting.id")

    # Applicant Info
    name: str = Field(max_length=255)
    email: str = Field(max_length=255)
    phone: str = Field(max_length=255)
    cv_pdf: str = Field(max_length=255)

    # Review/Feedback
    cv_rating: Optional[float] = None
    cv_feedback: Optional[str] = None

    # Status Tracking
    status: str = Field(max_length=255)
