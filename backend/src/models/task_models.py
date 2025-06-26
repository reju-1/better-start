from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from src.enums import Status, PriorityLevel

if TYPE_CHECKING:
    from .project_models import Project

class Task(SQLModel, table=True):
    """Represents a task within a project."""

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)

    # Foreign Key
    project_id: int = Field(foreign_key="project.id")

    # Task Details
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None)
    status: Status = Field(default=Status.PENDING)  # Assuming PENDING is a valid status
    priority_level: PriorityLevel = Field(default=PriorityLevel.HIGH) 
    assignee: Optional[int] = Field(default=None)  # Assuming this is a user ID
    datestamp: datetime = Field(default_factory=datetime.now)
    completed_date: Optional[datetime] = Field(default=None)

    project: Optional["Project"] = Relationship(back_populates="tasks")
    members: List["TaskMember"] = Relationship(back_populates="task")

class TaskMember(SQLModel, table=True):
    """Represents a member associated with a task."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    task_id: int = Field(foreign_key="task.id")
    user_id: int  # Assuming user_id is an integer, adjust as necessary
    position: Optional[str]

    task: Optional["Task"] = Relationship(back_populates="members")