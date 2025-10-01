output "backend_public_ip" {
  value       = aws_instance.backend.public_ip
  description = "Public IP of backend instance"
}

output "frontend_public_ip" {
  value       = aws_instance.frontend.public_ip
  description = "Public IP of frontend instance"
}

output "worker_private_ip" {
  value       = aws_instance.worker.private_ip
  description = "Private IP of worker instance"
}
