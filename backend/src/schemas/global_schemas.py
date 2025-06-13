from pydantic import BaseModel, HttpUrl


class PresignedURLResponse(BaseModel):
    presigned_url: HttpUrl
    object_name: str
