import uuid
from fastapi import status, HTTPException

from src.core import settings
from src.services.s3 import create_presigned_url


def get_jobs(session):
    return ["job1", "job2"]


def create_job(job_data, session):
    return "Job Created Successfully"


def handle_job_application(application, session):
    return "Successfully applied"


def handle_cv_rating(rating_dat, session):
    return "Rating updated Successfully"


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
