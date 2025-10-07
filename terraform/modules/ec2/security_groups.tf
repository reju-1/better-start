# Worker Instance Security Group
resource "aws_security_group" "worker_sg" {
  name        = "worker-sg"
  description = "Security group for worker instance"
  vpc_id      = var.vpc_id

  # Allow SSH from inside the VPC
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr] # e.g "10.0.0.0/16"
    description = "SSH access from inside the VPC"
  }

  # Allow all outbound 
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound"
  }

  tags = {
    Name = "worker-sg"
  }
}
