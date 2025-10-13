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

## ----------------DNS---------------------
variable "route53_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
}

variable "base_domain_name" {
  description = "Base domain name of Route 53 hosted zone (e.g example.com)  Used for creating subdomains such as www or api."
  type        = string
}
