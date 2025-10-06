variable "vpc_id" {
  description = "VPC ID where security groups will be created"
  type        = string
}

variable "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "admin_ip_cidr" {
  description = "Trusted admin IP for SSH access"
  type        = string
  default     = "0.0.0.0/0" # Security risk !!!
}
