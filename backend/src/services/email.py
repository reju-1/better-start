from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from typing import List, Literal
from src.core import settings

# Configuration
conf = ConnectionConfig(
    MAIL_USERNAME=settings.mail_address,
    MAIL_PASSWORD=settings.mail_password,
    MAIL_FROM=settings.mail_address,
    MAIL_PORT=587,
    MAIL_SERVER=settings.mail_server,
    MAIL_FROM_NAME=settings.app_name,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


async def send_mail(
    subject: str,
    body: str,
    emails: List[EmailStr],
    body_type: Literal["html", "plain"] = "html",
) -> None:
    message = MessageSchema(
        subject=subject,
        recipients=emails,
        body=body,
        subtype=MessageType.html if body_type == "html" else MessageType.plain,
    )
    fm = FastMail(conf)
    await fm.send_message(message)
