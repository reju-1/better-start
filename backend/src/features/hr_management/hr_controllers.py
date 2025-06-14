import uuid
from fastapi import status, HTTPException
from sqlmodel import Session

from src.core import settings
from src.services.s3 import create_presigned_url

from src import schemas as gs  # Global schemas
from . import hr_schemas as schema
from .hr_services import publish_to_rabbitmq


def get_jobs(session):
    return ["job1", "job2"]


def create_job(job_data, session):
    return "Job Created Successfully"


count = 0


def handle_job_application(application: schema.JobApply, session: Session):
    # Up in MQ
    job_description = "Query from db"
    global count
    count += 1
    applicant_id = count
    payload = schema.CvReportRequest(
        applicant_id=applicant_id,
        job_prompt=job_description,
        cv_pdf_url=application.cv_pdf,
    )
    publish_to_rabbitmq(payload.model_dump())

    # DB

    return {"message": "You have successfully applied"}


def handle_cv_rating(rating_dat, session):
    return {"message": "Successfully added"}


def generate_url(file_name):
    # Generate a unique object name to avoid overwriting files
    object_name = f"cvs/{uuid.uuid4()}-{file_name}"

    presigned_url = create_presigned_url(settings.s3_bucket_name, object_name)

    if presigned_url is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not generate presigned URL.",
        )

    return {"presigned_url": presigned_url, "object_name": object_name}
