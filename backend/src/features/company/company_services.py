from sqlmodel import Session
from fastapi import HTTPException, status
from src import models
from . import company_schemas as schema

def get_company_by_id(session: Session, user):
    # Use company_id from user token
    if not user.company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not associated with any company."
        )
    company = session.get(models.Company, user.company_id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found."
        )
    return company

def update_company_by_id(session: Session, update_data: schema.CompanyCreate, user):
    # Use company_id from user token
    if not user.company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not associated with any company."
        )
    company = session.get(models.Company, user.company_id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found."
        )
    # Only allow update if user is the owner/admin
    if company.user_id != user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this company."
        )
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(company, field, value)
    session.add(company)
    session.commit()
    session.refresh(company)
    return company