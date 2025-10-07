output "backend_private_ip" {
  value       = aws_instance.backend.private_ip
  description = "Public IP of backend instance"
}

output "frontend_private_ip" {
  value       = aws_instance.frontend.private_ip
  description = "Public IP of frontend instance"
}

output "worker_private_ip" {
  value       = aws_instance.worker.private_ip
  description = "Private IP of worker instance"
}

output "bastion_host_public_ip" {
  value       = aws_instance.bastion.public_ip
  description = "Public ip of Bastion host"
}
