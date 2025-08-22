resource "random_id" "bucket_suffix" {
  byte_length = 8
}

## Create S3 Bucket
resource "aws_s3_bucket" "app_bucket" {
  bucket = format("%s-%s", var.bucket_name, random_id.bucket_suffix.hex)

  tags = {
    Project     = "BetterStart"
    Environment = "Dev"
  }
}

## Block All Public Access
resource "aws_s3_bucket_public_access_block" "app_bucket_block" {
  bucket = aws_s3_bucket.app_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

## Enable Bucket Versioning
resource "aws_s3_bucket_versioning" "app_bucket_versioning" {
  bucket = aws_s3_bucket.app_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

## CORS Configuration
resource "aws_s3_bucket_cors_configuration" "example" {
  bucket = aws_s3_bucket.app_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = var.allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = var.allowed_origins
  }
}

## Add Lifecycle Rules
resource "aws_s3_bucket_lifecycle_configuration" "app_bucket_lifecycle" {
  bucket = aws_s3_bucket.app_bucket.id

  depends_on = [aws_s3_bucket_versioning.app_bucket_versioning]

  rule {
    id     = "cv-archive-lifecycle"
    status = "Enabled"

    # scope 
    filter {
      prefix = "cvs/"
    }

    # Current versions transition
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 60
      storage_class = "GLACIER_IR"
    }

    # Noncurrent versions transition
    noncurrent_version_transition {
      noncurrent_days = 30
      storage_class   = "STANDARD_IA"
    }

    noncurrent_version_transition {
      noncurrent_days = 60
      storage_class   = "GLACIER_IR"
    }

    # Expire noncurrent versions
    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }
}
