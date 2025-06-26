from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from pydantic import BaseModel
from .task_schemas import TaskCreate, TaskResponse, TaskUpdate
from .task_services import (
    create_task, get_task, update_task, delete_task, get_tasks,
    add_member_to_task, remove_member_from_task, get_task_members, update_task_status
)
from src.core.db import get_session
from src.security import oauth2
from src.schemas import TokenData
from src.enums import Status  # Assuming Status is an enum defined in your project

router = APIRouter(prefix="/tasks")
DBSession = Depends(get_session)

class TaskMemberAddRequest(BaseModel):
    position: str

@router.post("/project/{project_id}", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_new_task(
    project_id: int,
    task: TaskCreate,
    session: Session = DBSession,
    user: TokenData = Depends(oauth2.get_current_user)
):
    return create_task(project_id, task, session)

@router.get("/{task_id}", response_model=TaskResponse)
def read_task(task_id: int, session: Session = DBSession, user: TokenData = Depends(oauth2.get_current_user)):
    task = get_task(task_id, session, user)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=TaskResponse)
def update_existing_task(task_id: int, task: TaskUpdate, session: Session = DBSession, user: TokenData = Depends(oauth2.get_current_user)):
    updated_task = update_task(task_id, task, session, user)
    if not updated_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return updated_task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_task(task_id: int, session: Session = DBSession, user: TokenData = Depends(oauth2.get_current_user)):
    delete_task(task_id, session, user)

@router.get("/project/{project_id}", response_model=list[TaskResponse])
def read_tasks_by_project(project_id: int, session: Session = DBSession, user: TokenData = Depends(oauth2.get_current_user)):
    tasks = get_tasks(project_id, session, user)
    return tasks


@router.patch("/tasks/{task_id}/status", status_code=status.HTTP_200_OK)
def change_task_status(
    task_id: int,
    status: Status,
    session: Session = Depends(get_session),
    user: TokenData = Depends(oauth2.get_current_user),
):
    updated = update_task_status(task_id, status, session)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return {"message": "Task status updated successfully"}



# --- Task Member Management ---

@router.post("/{task_id}/members/{user_id}", status_code=status.HTTP_200_OK)
def add_member(
    task_id: int,
    user_id: int,
    position: str,
    session: Session = DBSession,
    user: TokenData = Depends(oauth2.get_current_user)
):
    add_member_to_task(task_id, user_id, position, session, user)
    return {"detail": "Member added to task successfully."}

@router.delete("/{task_id}/members/{user_id}", status_code=status.HTTP_200_OK)
def remove_member(task_id: int, user_id: int, session: Session = DBSession, user: TokenData = Depends(oauth2.get_current_user)):
    remove_member_from_task(task_id, user_id, session, user)
    return {"detail": "Member removed from task successfully."}

@router.get("/{task_id}/members", status_code=status.HTTP_200_OK)
def get_members(task_id: int, session: Session = DBSession, user: TokenData = Depends(oauth2.get_current_user)):
    return get_task_members(task_id, session, user)