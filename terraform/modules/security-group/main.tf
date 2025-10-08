## --------------ALB Security Group--------------------
resource "aws_security_group" "alb_sg" {
  name        = "bs-alb-sg"
  description = "Allow HTTP and HTTPS inbound traffic to load balancer, all outbound traffic"
  vpc_id      = var.vpc_id

  tags = {
    Name = "bs-alb-sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "alb_allow_http" {
  security_group_id = aws_security_group.alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  ip_protocol       = "tcp"
  to_port           = 80
  description       = "Allow HTTP from anywhere"
}

resource "aws_vpc_security_group_ingress_rule" "alb_allow_https" {
  security_group_id = aws_security_group.alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  ip_protocol       = "tcp"
  to_port           = 443
  description       = "Allow HTTPS from anywhere"
}

resource "aws_vpc_security_group_egress_rule" "alb_allow_all_traffic" {
  security_group_id = aws_security_group.alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
  description       = "Allow all outbound traffic"
}


## --------------EC2 Security Group--------------------
resource "aws_security_group" "ec2_sg" {
  name        = "bs-ec2-sg"
  description = "Allow HTTP and HTTPS from ALB, all outbound traffic"
  vpc_id      = var.vpc_id

  tags = {
    Name = "bs-ec2-sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "ec2_allow_http_from_alb" {
  security_group_id            = aws_security_group.ec2_sg.id
  referenced_security_group_id = aws_security_group.alb_sg.id
  from_port                    = 80
  ip_protocol                  = "tcp"
  to_port                      = 80
  description                  = "Allow HTTP from ALB"
}

resource "aws_vpc_security_group_ingress_rule" "ec2_allow_https_from_alb" {
  security_group_id            = aws_security_group.ec2_sg.id
  referenced_security_group_id = aws_security_group.alb_sg.id
  from_port                    = 443
  ip_protocol                  = "tcp"
  to_port                      = 443
  description                  = "Allow HTTPS from ALB"
}
resource "aws_vpc_security_group_ingress_rule" "ec2_allow_ssh_from_bastion" {
  security_group_id            = aws_security_group.ec2_sg.id
  referenced_security_group_id = aws_security_group.bastion_sg.id
  from_port                    = 22
  ip_protocol                  = "tcp"
  to_port                      = 22
  description                  = "Allow SSH from bastion host"
}

resource "aws_vpc_security_group_egress_rule" "ec2_allow_all_traffic" {
  security_group_id = aws_security_group.ec2_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
  description       = "Allow all outbound traffic"
}


## --------------Bastion Host Security Group--------------------
resource "aws_security_group" "bastion_sg" {
  name        = "bs-bastion-sg"
  description = "Allow SSH access from trusted IP, allow outbound traffic"
  vpc_id      = var.vpc_id

  tags = {
    Name = "bs-bastion-sg"
  }
}

## Inbound: Allow SSH only from admin ip
resource "aws_vpc_security_group_ingress_rule" "bastion_allow_ssh_from_admin" {
  security_group_id = aws_security_group.bastion_sg.id
  cidr_ipv4         = var.admin_ip_cidr
  from_port         = 22
  ip_protocol       = "tcp"
  to_port           = 22
  description       = "Allow SSH from admin workstation"
}

## Outbound: Allow SSH to private EC2 instances
resource "aws_vpc_security_group_egress_rule" "bastion_allow_ssh_to_ec2" {
  security_group_id            = aws_security_group.bastion_sg.id
  referenced_security_group_id = aws_security_group.ec2_sg.id
  from_port                    = 22
  ip_protocol                  = "tcp"
  to_port                      = 22
  description                  = "Allow SSH to EC2 instances"
}

## Outbound: Allow all other traffic
resource "aws_vpc_security_group_egress_rule" "bastion_allow_all_outbound" {
  security_group_id = aws_security_group.bastion_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
  description       = "Allow all outbound traffic"
}

## --------------Worker Instance Security Group--------------------

resource "aws_security_group" "worker_sg" {
  name        = "worker-sg"
  description = "Security group for worker instance"
  vpc_id      = var.vpc_id

  tags = {
    Name = "worker-sg"
  }
}

# SSH ingress rule
resource "aws_vpc_security_group_ingress_rule" "worker_ssh" {
  security_group_id = aws_security_group.worker_sg.id

  from_port   = 22
  to_port     = 22
  ip_protocol = "tcp"
  cidr_ipv4   = var.vpc_cidr_block
  description = "SSH access from inside the VPC"

  tags = {
    Name = "worker-ssh-ingress"
  }
}

# Allow all outbound traffic
resource "aws_vpc_security_group_egress_rule" "worker_egress_all" {
  security_group_id = aws_security_group.worker_sg.id

  ip_protocol = "-1"
  cidr_ipv4   = "0.0.0.0/0"
  description = "Allow all outbound"

  tags = {
    Name = "worker-egress-all"
  }
}
