from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class MemberRole(str, Enum):
    ADMIN = "Admin"
    MEMBER = "Member"


class Status(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    PENDING = "Pending"


class Company(SQLModel, table=True):
    """Represents a company entity"""

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)

    # Foreign Key
    user_id: int = Field(foreign_key="user.id")

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

    status: Status = Field(default=Status.PENDING)


class CompanyMember(SQLModel, table=True):
    """Links a user to a company with a role and status"""

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)

    # Foreign Keys
    user_id: int = Field(foreign_key="user.id")
    company_id: int = Field(foreign_key="company.id")

    # Role & Position
    role: MemberRole = Field(...)
    position: str = Field(max_length=255)

    # Optional Compensation
    salary: Optional[float] = None

    # Membership Status
    status: Status = Field(default=Status.PENDING)
