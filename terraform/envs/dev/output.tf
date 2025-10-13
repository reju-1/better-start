# -------------------VPC-Related--------------------
output "vpc_id" {
  value       = module.vpc.vpc_id
  description = "The ID of the VPC"
}

output "vpc_cidr" {
  value       = module.vpc.vpc_cidr
  description = "The CIDR block of the VPC"
}

# ----------------EC2 Related----------------------
output "backend_private_ip" {
  value       = module.ec2.backend_private_ip
  description = "Public IP of backend instance"
}

output "frontend_private_ip" {
  value       = module.ec2.frontend_private_ip
  description = "Public IP of frontend instance"
}

output "worker_private_ip" {
  value       = module.ec2.worker_private_ip
  description = "Private IP of RabbitMQ worker instance"
}

output "bastion_host_public_ip" {
  value       = module.ec2.bastion_host_public_ip
  description = "Public IP of bastion host instance"
}

# --------------------URLs----------------------
output "ULRs" {
  value = {
    backend  = module.route53.backend_url
    frontend = module.route53.frontend_url
  }
}
