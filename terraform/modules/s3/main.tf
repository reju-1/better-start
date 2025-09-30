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

## Get current AWS account and region info
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

## KMS Key for Bucket Encryption
resource "aws_kms_key" "bucket_key" {
  description             = "KMS key for S3 bucket encryption in BetterStart project"
  enable_key_rotation     = true
  rotation_period_in_days = 180 # Default is 365 days
  deletion_window_in_days = 10

  tags = {
    Project = "BetterStart"
    Purpose = "S3BucketEncryption"
  }
}

## KMS Key Policy
resource "aws_kms_key_policy" "bucket_key_policy" {
  key_id = aws_kms_key.bucket_key.id
  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "key-policy-s3-bucket"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow S3 Service"
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action = [
          "kms:Decrypt",
          "kms:GenerateDataKey",
          "kms:CreateGrant"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "kms:ViaService" = "s3.${data.aws_region.current.id}.amazonaws.com"
          }
        }
      }
    ]
  })
}

## KMS Key Alias
resource "aws_kms_alias" "app_bucket_key_alias" {
  name          = "alias/betterStart-s3-bucket-key"
  target_key_id = aws_kms_key.bucket_key.key_id
}

## S3 Bucket Server-Side Encryption Configuration
resource "aws_s3_bucket_server_side_encryption_configuration" "app_bucket_encryption" {
  bucket = aws_s3_bucket.app_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.bucket_key.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}
