terraform {
  backend "s3" {
    bucket = "tf-state-archive"
    key    = "better-start/terraform.tfstate"
    region = "ap-southeast-1"
  }
}
