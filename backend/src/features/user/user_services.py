from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from src import models
from src.security import hashing, oauth2
from src.schemas import Token
from . import user_schemas as schema


def create_user(info: schema.UserCreate, session: Session):
    # Check for existing user
    statement = select(models.User).where(models.User.email == info.email)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    # Hash password
    info.password = hashing.hash(info.password)

    # Create user model
    new_user = models.User(**info.model_dump())
    session.add(new_user)
    session.commit()
    new_user = session.refresh(new_user)
    print(new_user)
    return {"message": "User created Successfully"}


def authenticate_user(form_data: OAuth2PasswordRequestForm, session: Session) -> Token:
    statement = select(models.User).where(models.User.email == form_data.username)
    user = session.exec(statement).first()

    if not user or not hashing.verify(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    member = session.exec(
        select(models.CompanyMember).where(models.CompanyMember.user_id == user.id)
    ).first()

    token_data = {
        "email": user.email,
        "company_id": member.company_id if member else None,
        "role": member.role if member else None,
    }

    access_token = oauth2.create_access_token(token_data)

    return Token(access_token=access_token, token_type="bearer")
