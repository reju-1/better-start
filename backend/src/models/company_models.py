from sqlmodel import SQLModel, Field, Relationship
from typing import List
from pydantic import EmailStr
from typing import Optional
from datetime import datetime
from src.enums import MemberRole


class Company(SQLModel, table=True):
    """Represents a company entity"""

    # Primary Key & Foreign Key
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: EmailStr = Field(foreign_key="user.email")

    # Basic Info
    name: str = Field(max_length=255)
    location: str = Field(max_length=255)
    industry_type: str = Field(max_length=255)
    founding_year: int

    # Optional
    problem_solve: Optional[str]
    how_work: Optional[str]
    primary_color: Optional[str] = Field(max_length=255)
    secondary_color: Optional[str] = Field(max_length=255)
    website_url: Optional[str] = Field(max_length=255)
    monthly_target: Optional[int] = None
    logo_url: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.now)
    
    sales: List["Sales"] = Relationship(back_populates="company")



class CompanyMember(SQLModel, table=True):
    """Links a user to a company with a role and status"""

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)

    # Foreign Keys
    user_id: EmailStr = Field(foreign_key="user.email")
    company_id: int = Field(foreign_key="company.id")

    # Role & Position
    role: MemberRole = Field(...)
    position: str = Field(max_length=255)

    # Optional Compensation
    salary: Optional[float] = None
