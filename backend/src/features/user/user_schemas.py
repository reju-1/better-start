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
