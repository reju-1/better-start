import re
import logging
import mimetypes
import boto3
from botocore.exceptions import ClientError
from src.core import settings


def create_presigned_url(
    bucket_name: str,
    obj_name: str,
    # max_size_mb: int = 10,
    expire_sec: int = 60 * 60,
) -> str | None:
    """
    Generate a presigned URL to upload a file to an S3 bucket. with default expiry 1 hours.
    If error or invalid, returns None.
    """
    if not is_valid_object_name(obj_name):
        logging.warning(f"Invalid object name: {obj_name}")
        return None

    s3_client = boto3.client(
        "s3",
        aws_access_key_id=settings.aws_access_key_id,
        aws_secret_access_key=settings.aws_secret_access_key,
        region_name=settings.aws_region,
    )

    content_type = mimetypes.guess_type(obj_name)[0] or "application/octet-stream"

    try:
        # NOTE: S3 presigned PUT URLs do not enforce a maximum file size apply `generate_presigned_post()`
        response = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": bucket_name,
                "Key": obj_name,
                "ContentType": content_type,
            },
            ExpiresIn=expire_sec,
        )
        return response

    except ClientError as e:
        logging.error(f"ClientError generating presigned URL: {e}")
        return None


def is_valid_object_name(obj_name: str) -> bool:
    """
    Validate object name:
    - Only allows safe characters
    - No path traversal
    - No double slashes or hidden directory attacks
    """
    obj_name = obj_name.replace(" ", "-")

    if ".." in obj_name or obj_name.startswith(("/", "\\")) or "//" in obj_name:
        return False

    # Allow only safe characters (alphanum, _, -, /, .)
    if not re.fullmatch(r"[a-zA-Z0-9_\-./]+", obj_name):
        return False

    return True
