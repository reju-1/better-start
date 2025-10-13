variable "alb_security_group_id" {
  description = "Security group ID for ALB"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs"
  type        = list(string)
}

variable "www_instance_ids" {
  description = "List of EC2 instance IDs for WWW (frontend)"
  type        = list(string)
  default     = []
}

variable "api_instance_ids" {
  description = "List of EC2 instance IDs for API (backend)"
  type        = list(string)
  default     = []
}

variable "base_domain_name" {
  description = "Base domain name e.g. example.com"
  type        = string
}

variable "certificate_arn" {
  description = "ARN of SSL certificate"
  type        = string
}

variable "environment" {
  description = "Environment name"
  default     = "dev-env"
}
