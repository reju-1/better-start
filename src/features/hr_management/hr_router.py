from typing import Annotated
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

# Internal imports
from src.core import get_session
from . import hr_schemas as schema
from . import hr_controllers as controler

DBSession = Annotated[Session, Depends(get_session)]
router = APIRouter(prefix="/hr")


@router.get("/job-posts")
def get_job_posts(session: DBSession):
    return controler.get_jobs(session)


@router.post("/job-posts", status_code=status.HTTP_201_CREATED)
def create_job_post(job_data: schema.JobPost, session: DBSession):
    return controler.create_job(job_data, session)


@router.post("/job-apply", status_code=status.HTTP_201_CREATED)
def apply_to_job(application_data, session: DBSession):
    return controler.handle_job_application(application_data, session)


@router.post("/cv-rating")
def update_cv_rating(rating_data, session: DBSession):
    return controler.handle_cv_rating(rating_data, session)
