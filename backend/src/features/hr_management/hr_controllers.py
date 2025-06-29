import uuid
from fastapi import status, HTTPException
from sqlmodel import Session, select


from src import models
from src.core import settings
from src.services.s3 import create_presigned_url

from src import schemas as gs  # Global schemas
from . import hr_schemas as schema
from .hr_services import publish_to_rabbitmq


def get_jobs(user: gs.TokenData, session: Session):
    results = session.exec(
        select(models.JobListing).where(models.JobListing.company_id == user.company_id)
    )
    return results.all()


def create_job(job_data: schema.JobCreate, user: gs.TokenData, session: Session):
    new_job = models.JobListing(**job_data.model_dump(), company_id=user.company_id)
    session.add(new_job)
    session.commit()
    session.refresh(new_job)

    return {
        "message": "New job post created",
        "job_id": new_job.id,
        "company_id": user.company_id,
    }


def handle_job_application(application: schema.JobApply, session: Session):
    # Up in MQ
    job_info = session.exec(
        select(models.JobListing).where(models.JobListing.id == application.job_id)
    ).first()

    if not job_info:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Job not found")

    cv_entry = models.CVSubmit(
        **application.model_dump(),
        cv_feedback="Processing",
        cv_rating=None,
    )
    session.add(cv_entry)
    session.commit()
    session.refresh(cv_entry)

    payload = schema.CvReportRequest(
        applicant_id=cv_entry.id,
        job_prompt=job_info.job_description,
        cv_pdf_url=application.cv_pdf,
    )
    # publish_to_rabbitmq(payload.model_dump())
    print(payload.model_dump())

    # DB

    return {"message": "You have successfully applied"}


def update_cv_review(rating_data: schema.CvReport, session: Session):
    # Fetch the record
    cv_entry = session.exec(
        select(models.CVSubmit).where(models.CVSubmit.id == rating_data.applicant_id)
    ).first()

    if not cv_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant not found",
        )

    # Update fields
    cv_entry.cv_rating = rating_data.rating
    cv_entry.cv_feedback = rating_data.remarks

    # Commit changes
    session.add(cv_entry)
    session.commit()
    session.refresh(cv_entry)

    return {"message": "CV review updated successfully."}


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
