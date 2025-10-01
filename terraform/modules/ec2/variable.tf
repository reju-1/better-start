variable "vpc_id" {
  description = "ID of the VPC where resources will be created"
  type        = string
}
variable "vpc_cidr" {
  description = "The CIDR block of the VPC"
  type        = string
}

variable "public_subnet_ids" {
  description = "IDs of public subnets for frontend and backend servers"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "IDs of private subnets for worker instances"
  type        = list(string)
}

variable "key_name" {
  description = "Name of the SSH key pair to use for EC2 instances"
  type        = string
}
variable "instance_type" {
  description = "EC2 instance type (e.g t2.micro, t3.small)"
  type        = string
  default     = "t2.micro"
}
