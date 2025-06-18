from typing import Optional
from pydantic import BaseModel, HttpUrl, Field, EmailStr


# Generic response message
class Message(BaseModel):
    message: str = Field(..., example="Operation successful")


# S3
class PresignedURLResponse(BaseModel):
    presigned_url: HttpUrl
    object_name: str


# JWT
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Token data payload
class TokenData(BaseModel):
    email: EmailStr
    company_id: Optional[int] = None
    role: Optional[str] = None
