from typing import Optional
from datetime import date
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    # Required fields
    name: str = Field(..., max_length=255, example="Adnan Sarkar")
    email: EmailStr = Field(..., max_length=255, example="adnan@example.com")
    password: str = Field(..., min_length=4, max_length=255, example="StrongP@ssw0rd")

    # Optional fields
    phone_no: Optional[str] = Field(None, max_length=20, example="+8801701234678")
    dob: Optional[date] = Field(None, example="1990-05-15")


class UserRead(BaseModel):
    name: str
    email: EmailStr
    phone_no: Optional[str] = None
    dob: Optional[date] = None
    bio: Optional[str] = None
    photo: Optional[str] = None

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    phone_no: Optional[str] = Field(None, max_length=20)
    dob: Optional[date] = None
    bio: Optional[str] = None
    photo: Optional[str] = None
