from typing import Annotated, List  # Add List to imports
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select
from src.models.project_models import Project
from src.models.task_models import Task
from src.core import get_session
from src.security import oauth2
from src.schemas import Message, TokenData
from src.utils.jwt_utils import create_jwt_token, decode_jwt_token
from .project_schemas import ProjectCreate, ProjectResponse, ProjectUpdate
from .project_services import (
    create_project, get_project, update_project, delete_project, manage_project_status,
    get_projects_by_company_id, manage_project_priority_level  # Add this import (implement in services if not present)
) # Add this import (implement if not present)
from src.enums import Status, PriorityLevel  # Assuming Status is an enum defined in your project


router = APIRouter(prefix="/projects")
DBSession = Annotated[Session, Depends(get_session)]

# 1. CREATE
@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_new_project(
    project: ProjectCreate,
    session: Session = Depends(get_session),
    user: TokenData = Depends(oauth2.get_current_user),
):
    if user.role != "Admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can create tasks.")
    
    """Create a new project."""
    return create_project(project, session, user)

# 2. READ (single)
@router.get("/{project_id}", response_model=ProjectResponse)
def read_project(
    project_id: int,
    session: Session = Depends(get_session),
    user: TokenData = Depends(oauth2.get_current_user),
):
    project = get_project(project_id, session, user)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project

# 2. READ (multiple)
@router.get("/by_company/", response_model=List[ProjectResponse])
def read_projects_by_company(
    session: Session = Depends(get_session),
    user: TokenData = Depends(oauth2.get_current_user),
):
    projects = get_projects_by_company_id(session, user)
    return projects

# 3. UPDATE (full update)
@router.put("/{project_id}", response_model=ProjectResponse)
def update_existing_project(
    project_id: int,
    project: ProjectUpdate,
    session: Session = Depends(get_session),
    user: TokenData = Depends(oauth2.get_current_user),
):
    if user.role != "Admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can create tasks.")
    
    updated_project = update_project(project_id, project, session, user)
    if not updated_project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return updated_project

# 3. UPDATE (status)
@router.patch("/{project_id}/status", status_code=status.HTTP_200_OK)
def change_project_status(
    project_id: int,
    status: Status,
    session: Session = Depends(get_session),
    user: TokenData = Depends(oauth2.get_current_user),
):
    if user.role != "Admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can create tasks.")
    
    if not manage_project_status(project_id, status, session, user):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return {"detail": "Project status updated successfully."}

# 3. UPDATE (priority)
@router.patch("/{project_id}/priority", status_code=status.HTTP_200_OK)
def change_project_priority(
    project_id: int,
    priority_level: PriorityLevel,
    session: Session = Depends(get_session),
    user: TokenData = Depends(oauth2.get_current_user),
):
    if user.role != "Admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can update priority.")
    
    updated_project = manage_project_priority_level(project_id, priority_level, session, user)
    if not updated_project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return {"detail": "Project priority updated successfully."}

# 4. DELETE
@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_project(
    project_id: int, 
    session: Session = Depends(get_session),
    user: TokenData = Depends(oauth2.get_current_user),
):
    if user.role != "Admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can create tasks.")
    
    if not delete_project(project_id, session, user):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")