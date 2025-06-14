from typing import Annotated
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

# Internal imports
from src.core import get_session
from src import schemas as gs  # Global Schemas
from . import hr_schemas as schema
from . import hr_controllers as controller

DBSession = Annotated[Session, Depends(get_session)]
router = APIRouter(prefix="/hr")


@router.get("/job-posts")
def get_job_posts(session: DBSession):
    return controller.get_jobs(session)


@router.post("/job-posts", status_code=status.HTTP_201_CREATED)
def create_job_post(job_data: schema.JobPost, session: DBSession):
    return controller.create_job(job_data, session)


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
    return controller.handle_cv_rating(rating, session)
