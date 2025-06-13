import re
import logging
import boto3
from botocore.exceptions import ClientError
from src.core import settings


def create_presigned_url(
    bucket_name: str,
    obj_name: str,
    size_MB: int = 10,
    expire_sec: int = 60 * 60,
) -> str | None:
    """
    Generate a presigned URL to upload a file to an S3 bucket. If error or invalid, returns None.
    Default size limit is 10MB, and default expiry 1hours.
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

    try:
        response = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": bucket_name,
                "Key": obj_name,
                "ContentLength": size_MB * 1024 * 1024,
            },
            ExpiresIn=expire_sec,
        )
        return response

    except ClientError as e:
        logging.error(f"ClientError generating presigned URL: {e}")
        return None


def is_valid_object_name(obj_name: str, max_length: int = 256) -> bool:
    """
    Validate object name:
    - Only allows safe characters
    - No path traversal
    - Max length 256
    - No double slashes or hidden directory attacks
    """
    if not obj_name or len(obj_name) > max_length:
        return False

    if ".." in obj_name or obj_name.startswith(("/", "\\")) or "//" in obj_name:
        return False

    # Allow only safe characters (alphanum, _, -, /, .)
    if not re.fullmatch(r"[a-zA-Z0-9_\-./]+", obj_name):
        return False

    return True
