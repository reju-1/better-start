from pydantic import BaseModel
from typing import Optional
from src.enums import MemberRole


class CompanyCreate(BaseModel):
    name: str
    location: str
    industry_type: str
    founding_year: int
    problem_solve: Optional[str] = None
    how_work: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    website_url: Optional[str] = None
    monthly_target: Optional[int] = None
    logo_url: Optional[str] = None


class InvitationToken(BaseModel):
    company_id: int
    role: MemberRole
    position: str
