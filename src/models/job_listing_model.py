from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, date


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
