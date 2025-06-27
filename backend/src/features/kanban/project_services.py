from fastapi import HTTPException, status
from sqlmodel import Session, select
from src.models import CompanyMember
from src.features.kanban.project_schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from src.schemas import TokenData
from typing import List
from src.models.project_models import Project

def create_project(project_data: ProjectCreate, session: Session, user: TokenData) -> ProjectResponse:
    if not user.company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not associated with any company."
        )
    # Create project with user's company_id
    new_project = Project(**project_data.model_dump(exclude={"company_id"}), company_id=user.company_id)
    session.add(new_project)
    session.commit()
    session.refresh(new_project)
    return ProjectResponse.from_orm(new_project)

def get_project(project_id: int, session: Session, user: TokenData) -> ProjectResponse:
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found."
        )
    if project.company_id != user.company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this project."
        )
    return ProjectResponse.from_orm(project)

def get_projects_by_company_id(session: Session, user: TokenData) -> List[ProjectResponse]:
    if not user.company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not associated with any company."
        )
    statement = select(Project).where(Project.company_id == user.company_id)
    projects = session.exec(statement).all()
    return [ProjectResponse.from_orm(project) for project in projects]

def update_project(project_id: int, project_data: ProjectUpdate, session: Session, user: TokenData) -> ProjectResponse:
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found."
        )
    # Ensure user can only update projects in their company
    if project.company_id != user.company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this project."
        )
    update_data = project_data.model_dump(exclude_unset=True)
    update_data.pop("company_id", None)  # Prevent changing company_id
    for key, value in update_data.items():
        setattr(project, key, value)
    session.add(project)
    session.commit()
    session.refresh(project)
    return ProjectResponse.from_orm(project)

def delete_project(project_id: int, session: Session, user: TokenData) -> dict:
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found."
        )
    if project.company_id != user.company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this project."
        )
    session.delete(project)
    session.commit()
    return {"detail": "Project deleted successfully."}

def manage_project_status(project_id: int, status: str, session: Session, user: TokenData) -> ProjectResponse:
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found."
        )
    if project.company_id != user.company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this project."
        )
    project.status = status
    session.add(project)
    session.commit()
    session.refresh(project)
    return ProjectResponse.from_orm(project)

def manage_project_priority_level(project_id: int, priority_level: str, session: Session, user: TokenData) -> ProjectResponse:
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found."
        )
    if project.company_id != user.company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this project."
        )
    project.priority_level = priority_level
    session.add(project)
    session.commit()
    session.refresh(project)
    return ProjectResponse.from_orm(project)

# def add_member_to_project(project_id: int, user_id: int, session: Session, user: TokenData) -> None:
#     project = session.get(Project, project_id)
#     if not project:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Project not found."
#         )
#     if project.company_id != user.company_id:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="You do not have permission to add members to this project."
#         )
#     # Check if the user is already a member of the project
#     from src.models.project_models import ProjectMember  # Import here to avoid circular import
#     existing_member = session.exec(
#         select(ProjectMember).where(
#             (ProjectMember.project_id == project_id) &
#             (ProjectMember.user_id == user_id)
#         )
#     ).first()
#     if existing_member:
#         raise HTTPException(
#             status_code=status.HTTP_409_CONFLICT,
#             detail="User is already a member of this project."
#         )
#     # Add the new member
#     new_member = ProjectMember(project_id=project_id, user_id=user_id)
#     session.add(new_member)
#     session.commit()
    
#     return {"detail": "Member added to project successfully."}