from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, TYPE_CHECKING
from datetime import date
from src.enums import Status, PriorityLevel

if TYPE_CHECKING:
    from .task_models import Task

class Project(SQLModel, table=True):
    """Represents a project entity."""
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: int = Field(foreign_key="company.id")
    title: str = Field(max_length=255)
    description: Optional[str] = None
    datastamp: date = Field(default_factory=date.today)
    status: Status = Field(default=Status.ACTIVE)
    priority_level: PriorityLevel = Field(default=PriorityLevel.HIGH)
    due_date: date
    category: str

    tasks: List["Task"] = Relationship(back_populates="project")


