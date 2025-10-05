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

resource "aws_vpc_security_group_egress_rule" "ec2_allow_all_traffic" {
  security_group_id = aws_security_group.ec2_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
  description       = "Allow all outbound traffic"
}
