from sqlmodel import SQLModel, Field
from typing import Optional


class CompanyMember(SQLModel, table=True):
    """Links a user to a company with a role and status"""

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)

    # Foreign Keys
    user_id: int = Field(foreign_key="user.id")
    company_id: int = Field(foreign_key="company.id")

    # Role & Position
    role: str = Field(max_length=255)
    position: str = Field(max_length=255)

    # Optional Compensation
    salary: Optional[float] = None

    # Membership Status
    status: str = Field(max_length=255)
