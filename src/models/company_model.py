from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Company(SQLModel, table=True):
    """Represents a company entity"""

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)

    # Basic Info
    name: str = Field(max_length=255)
    logo_url: str = Field(max_length=255)
    location: str = Field(max_length=255)
    industry_type: str = Field(max_length=255)
    founding_year: int
    created_at: datetime

    # Branding
    primary_color: str = Field(max_length=255)
    secondary_color: str = Field(max_length=255)

    # Web & Marketing
    website_url: str = Field(max_length=255)

    # Company Philosophy
    problem_solve: str
    how_work: str

    # Optional Metrics
    monthly_target: Optional[int] = None
