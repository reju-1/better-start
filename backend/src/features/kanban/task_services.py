from fastapi import HTTPException, status
from sqlmodel import Session, select, delete
from src.models.task_models import Task, TaskMember
from .task_schemas import TaskCreate, TaskUpdate, TaskResponse
from src.schemas import TokenData
from src.enums import KanbanStatus
from typing import List
from src.models.company_models import CompanyMember
from src.models.user_models import User

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
    task_data_dict = task_data.dict(exclude_unset=True, exclude={"members"})
    for key, value in task_data_dict.items():
        setattr(task, key, value)
    session.commit()
    session.refresh(task)
    # Handle members update if provided
    if task_data.members is not None:
        # Remove all current members
        session.exec(
            delete(TaskMember).where(TaskMember.task_id == task_id)
        )
        # Add new members
        for member in task_data.members:
            session.add(TaskMember(task_id=task_id, user_id=member.id, work=""))
        session.commit()
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

def get_member_refs(task_id: int, session: Session) -> list[dict]:
    members = session.exec(
        select(TaskMember).where(TaskMember.task_id == task_id)
    ).all()
    member_refs = []
    for m in members:
        company_member = session.exec(
            select(CompanyMember).where(CompanyMember.user_id == m.user_id)
        ).first()
        user_obj = session.exec(
            select(User).where(User.id == m.user_id)
        ).first()
        member_refs.append({
            "id": m.user_id,
            "name": user_obj.name if user_obj else "",
            "work": company_member.work if company_member else m.work,
            "photo": user_obj.photo if user_obj and hasattr(user_obj, "photo") else None
        })
    return member_refs
