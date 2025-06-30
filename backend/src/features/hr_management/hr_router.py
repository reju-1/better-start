from typing import Annotated, List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session, select
from pydantic import EmailStr

# Internal imports
from src.core import get_session, settings
from src.security import oauth2
from src.services.email import send_mail
from src.services.s3 import presigned_url_get_object

from src import models
from src import schemas as gs  # Global Schemas
from . import hr_schemas as schema
from . import hr_controllers as controller

DBSession = Annotated[Session, Depends(get_session)]
router = APIRouter(prefix="/hr")


@router.get(
    "/job-posts",
    response_model=List[schema.JobListingResponse],
)
def get_job_posts(
    session: DBSession,
    user: gs.TokenData = Depends(oauth2.get_current_user),
):
    """Return all the job circular of a company"""
    return controller.get_jobs(user, session)


@router.post(
    "/job-posts",
    status_code=status.HTTP_201_CREATED,
    response_model=schema.JobCreateResponse,
)
def create_job_post(
    job_data: schema.JobCreate,
    session: DBSession,
    user: gs.TokenData = Depends(oauth2.get_current_user),
):
    """Create a New Job circular"""
    return controller.create_job(job_data, user, session)


@router.post("/job-apply", response_model=gs.Message)
def apply_to_job(data: schema.JobApply, session: DBSession):
    """
    Handles job application submission by a candidate.
    """
    return controller.handle_job_application(data, session)


@router.get("/cv/upload-url", response_model=gs.PresignedURLResponse)
def get_cv_upload_url(file_name: str = "cv.pdf"):
    """
    Returns a pre-signed S3 URL to upload a CV.
    """
    return controller.generate_url(file_name)


@router.post("/cv/rating", response_model=gs.Message)
def update_cv_rating(rating: schema.CvReport, session: DBSession):
    """
    Receives CV rating data from RabbitMQ and updates the candidate's report in the database.
    """
    print(f"[✔] Received CV Report: {rating}")
    return controller.update_cv_review(rating, session)


@router.post(
    "/application-received/{job_id}",
    response_model=List[schema.CVSubmitResponse],
)
def update_cv_rating(
    job_id: int,
    session: DBSession,
    user: gs.TokenData = Depends(oauth2.get_current_user),
):
    """
    Return all the application received for a particular job circular
    """
    job_applications = session.exec(
        select(models.CVSubmit).where(models.CVSubmit.job_id == job_id)
    ).all()

    for app in job_applications:
        object_key = app.cv_pdf  # Access attribute, not dictionary
        app.cv_pdf = presigned_url_get_object(settings.s3_bucket_name, object_key)

    return job_applications


@router.post(
    "/send-email",
    response_model=gs.Message,
)
async def send_email_to_candidate(
    email_data: schema.EmailSchema,
    user: gs.TokenData = Depends(oauth2.get_current_user),
):
    await send_mail(email_data.subject, email_data.body, email_data.receivers)
    return {"message": "Email send successfully!"}
