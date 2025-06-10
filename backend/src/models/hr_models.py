from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, date
from enum import Enum


class ApplicationStatus(str, Enum):
    PENDING = "Pending"
    ACCEPTED = "Accepted"
    REJECTED = "Rejected"


class JobListing(SQLModel, table=True):
    """Represents a job post created by a company"""

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)

    # Foreign Key
    company_id: int = Field(foreign_key="company.id")

    # Job Details
    title: str = Field(max_length=255)
    job_description: str
    role_apply: str
    skill_require: str = Field(max_length=255)
    skill_prefer: str = Field(max_length=255)
    experience_level: str = Field(max_length=255)

    # Optional Work Details
    prefered_engagement: Optional[str] = Field(default=None, max_length=255)
    location: str = Field(max_length=255)
    salary: Optional[str] = Field(default=None, max_length=255)
    employement_type: str = Field(max_length=255)

    # Timestamps
    created_at: datetime
    end_date: date


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
    status: ApplicationStatus = Field(default=ApplicationStatus.PENDING)
