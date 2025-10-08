output "alb_security_sg_id" {
  description = "Security group ID for ALB"
  value       = aws_security_group.alb_sg.id
}

output "ec2_security_sg_id" {
  description = "Security group ID for EC2"
  value       = aws_security_group.ec2_sg.id
}

output "bastion_security_sg_id" {
  description = "Bastion host ID for ssh into EC2"
  value       = aws_security_group.bastion_sg.id
}

output "worker_security_sg_id" {
  description = "Security group ID for worker instance"
  value       = aws_security_group.worker_sg.id
}
