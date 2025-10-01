locals {
  # Security group configurations
  security_groups = {
    backend = {
      name        = "backend-sg"
      description = "Security group for backend instance"
      ingress_rules = [
        { port = 22, cidr = ["0.0.0.0/0"], desc = "SSH access" },
        { port = 80, cidr = ["0.0.0.0/0"], desc = "HTTP access" },
        { port = 443, cidr = ["0.0.0.0/0"], desc = "HTTPS access" }
      ]
    }
    frontend = {
      name        = "frontend-sg"
      description = "Security group for frontend instance"
      ingress_rules = [
        { port = 22, cidr = ["0.0.0.0/0"], desc = "SSH access" },
        { port = 80, cidr = ["0.0.0.0/0"], desc = "HTTP access" },
        { port = 443, cidr = ["0.0.0.0/0"], desc = "HTTPS access" }
      ]
    }
  }
}

# Backend and Frontend Security Groups (public access)
resource "aws_security_group" "public_sg" {
  for_each = local.security_groups

  name        = each.value.name
  description = each.value.description
  vpc_id      = var.vpc_id

  dynamic "ingress" {
    for_each = each.value.ingress_rules
    content {
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = "tcp"
      cidr_blocks = ingress.value.cidr
      description = ingress.value.desc
    }
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
    Name = each.value.name
  }
}

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
