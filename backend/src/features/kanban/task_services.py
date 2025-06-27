from fastapi import HTTPException, status
from sqlmodel import Session, select
from src.models.task_models import Task, TaskMember
from .task_schemas import TaskCreate, TaskUpdate, TaskResponse
from src.schemas import TokenData
from src.enums import KanbanStatus
from typing import List

def create_task(project_id: int, task_data: TaskCreate, session: Session) -> Task:
    data = task_data.dict()
    data['project_id'] = project_id
    new_task = Task(**data)
    session.add(new_task)
    session.commit()
    session.refresh(new_task)
    return new_task

def get_task(task_id: int, session: Session, user: TokenData) -> Task:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

def get_tasks(project_id: int, session: Session, user: TokenData) -> List[Task]:
    tasks = session.exec(select(Task).where(Task.project_id == project_id)).all()
    return tasks

def update_task(task_id: int, task_data: TaskUpdate, session: Session, user: TokenData) -> Task:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    task_data_dict = task_data.dict(exclude_unset=True)
    for key, value in task_data_dict.items():
        setattr(task, key, value)
    session.commit()
    session.refresh(task)
    return task

def delete_task(task_id: int, session: Session, user: TokenData) -> None:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    session.delete(task)
    session.commit()

def update_task_status(task_id: int, new_status: KanbanStatus, session: Session) -> Task:
    task = session.get(Task, task_id)
    if not task:
        return None
    task.status = new_status
    session.commit()
    session.refresh(task)
    return task


# --- Task Member Management ---

def add_member_to_task(task_id: int, user_id: int, work: str, session: Session, user: TokenData) -> None:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    existing = session.exec(
        select(TaskMember).where(TaskMember.task_id == task_id, TaskMember.user_id == user_id)
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User is already a member of this task.")
    new_member = TaskMember(task_id=task_id, user_id=user_id, work=work)
    session.add(new_member)
    session.commit()

def remove_member_from_task(task_id: int, user_id: int, session: Session, user: TokenData) -> None:
    member = session.exec(
        select(TaskMember).where(TaskMember.task_id == task_id, TaskMember.user_id == user_id)
    ).first()
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found in this task.")
    session.delete(member)
    session.commit()

def get_task_members(task_id: int, session: Session, user: TokenData):
    members = session.exec(
        select(TaskMember).where(TaskMember.task_id == task_id)
    ).all()
    return [{"user_id": m.user_id, "work": m.work} for m in members]