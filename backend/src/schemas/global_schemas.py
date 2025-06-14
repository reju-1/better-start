from pydantic import BaseModel, HttpUrl, Field


# Generic response message
class Message(BaseModel):
    message: str = Field(..., example="Operation successful")


class PresignedURLResponse(BaseModel):
    presigned_url: HttpUrl
    object_name: str
