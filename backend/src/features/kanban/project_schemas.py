from typing import Optional
from pydantic import BaseModel, Field
from datetime import date
from src.enums import Status, PriorityLevel


class ProjectCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: str
    company_id: int
    status: Status = Status.ACTIVE
    priority_level: PriorityLevel = PriorityLevel.HIGH
    due_date: date
    category: str


class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str]
    status: Optional[Status]
    priority_level: Optional[PriorityLevel]
    due_date: Optional[date]
    category: Optional[str]


class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    company_id: int
    status: Status
    priority_level: PriorityLevel
    due_date: date
    category: Optional[str]

    class Config:
         from_attributes = True