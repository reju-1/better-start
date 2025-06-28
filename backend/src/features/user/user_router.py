from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

# Internal imports
from src.core import get_session
from src.security import oauth2
from src import models
from src.schemas import Message, Token, TokenData
from . import user_schemas as schema
from . import user_services as service

router = APIRouter(prefix="/user")
DBSession = Annotated[Session, Depends(get_session)]


@router.post("/register", response_model=Message)
def create_user(info: schema.UserCreate, session: DBSession):
    """
    Register a new user with hashed password.
    """
    return service.create_user(info, session)


@router.post("/login", response_model=Token)
def login(session: DBSession, form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate user and return JWT access token.
    """
    return service.authenticate_user(form_data, session)


@router.get("/me")
def read_current_user(current_user: TokenData = Depends(oauth2.get_current_user)):
    """
    Return the authenticated user's information from the access token.
    """
    return current_user


@router.get("/details", response_model=schema.UserRead)
def read_user_details(
    session: DBSession,
    current_user: TokenData = Depends(oauth2.get_current_user)

):
    """
    Read user details for the authenticated user (without password).
    """
    user = session.exec(
        select(models.User).where(models.User.email == current_user.email)
    ).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
