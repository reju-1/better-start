terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.10.0"
    }
  }

  # Remote backend
  backend "s3" {
    bucket = "tf-state-archive"
    key    = "better-start/terraform.tfstate"
    region = "ap-southeast-1"
  }
}

provider "aws" {
  # Configuration options
  region = var.region
}
