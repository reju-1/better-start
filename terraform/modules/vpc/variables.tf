variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default     = {}
}

variable "az_count" {
  description = "Requested number of availability zones to use"
  type        = number
  default     = 2
  validation {
    condition     = var.az_count > 0
    error_message = "AZ count must be greater than 0"
  }
}
