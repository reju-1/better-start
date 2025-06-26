from typing import Optional
from pydantic import BaseModel, Field
from datetime import date
from src.enums import Status, PriorityLevel


class TaskCreate(BaseModel):
    project_id: int
    title: str = Field(..., max_length=255)
    description: Optional[str] = Field(None)
    status: Status = Status.ACTIVE
    priority_level: PriorityLevel = PriorityLevel.HIGH
    assignee: Optional[int] = Field(None)
    datestamp: date
    completed_date: Optional[date] = Field(None)


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = Field(None)
    status: Optional[Status]
    priority_level: Optional[PriorityLevel]
    assignee: Optional[int] = Field(None)
    completed_date: Optional[date] = Field(None)


class TaskResponse(BaseModel):
    id: int
    project_id: int
    title: str
    description: Optional[str]
    status: Status
    priority_level: PriorityLevel
    assignee: Optional[int]
    datestamp: date
    completed_date: Optional[date] = None

    class Config:
        orm_mode = True