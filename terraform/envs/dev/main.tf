module "s3" {
  source          = "../../modules/s3"
  bucket_name     = var.bucket_name
  allowed_origins = var.allowed_origins
}

module "vpc" {
  source      = "../../modules/vpc"
  environment = "dev"
  az_count    = 2
  tags = {
    Project = "Better-Start"
  }
}
