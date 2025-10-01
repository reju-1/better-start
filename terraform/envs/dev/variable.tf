variable "region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "ap-southeast-1"
}

variable "bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
  default     = "better-start-bucket"
}

variable "allowed_origins" {
  description = "List of allowed origins for CORS configuration"
  type        = list(string)
  default     = ["*"]
}

variable "key_name" {
  description = "Name of the SSH key pair to use for EC2 instances"
  type        = string
}
