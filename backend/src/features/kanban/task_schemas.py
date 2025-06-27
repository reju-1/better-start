from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import date
from src.enums import PriorityLevel, KanbanStatus


class TaskCreate(BaseModel):
    project_id: int
    title: str = Field(..., max_length=255)
    description: Optional[str] = Field(None)
    status: KanbanStatus = KanbanStatus.PENDING
    priority_level: PriorityLevel = PriorityLevel.HIGH
    assignee: Optional[int] = Field(None)
    due_date: Optional[date] = Field(None)


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = Field(None)
    status: Optional[KanbanStatus]
    priority_level: Optional[PriorityLevel]
    due_date: Optional[date] = Field(None)


class TaskResponse(BaseModel):
    id: int
    project_id: int
    title: str
    description: Optional[str]
    status: KanbanStatus
    priority_level: PriorityLevel
    assignee: Optional[int]
    start_date: date
    due_date: Optional[date] = None

    class Config:
        orm_mode = True