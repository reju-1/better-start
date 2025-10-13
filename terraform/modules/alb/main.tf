locals {
  ssl_policy_name = "ELBSecurityPolicy-TLS13-1-2-Res-2021-06"
}

## --------------Application Load Balancer--------------------
resource "aws_lb" "main" {
  name               = "bs-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnet_ids

  enable_deletion_protection = false

  tags = {
    Name        = "bs-alb"
    Environment = var.environment
  }
}

## --------------HTTP Listener with Redirect--------------------
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

## --------------HTTPS Listener with Host-Based Routing--------------------
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = local.ssl_policy_name
  certificate_arn   = var.certificate_arn

  # Default action - forward to WWW target group
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.www.arn
  }
}

## --------------Listener Rule for Base-domain & www sub-domain--------------------
resource "aws_lb_listener_rule" "www" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.www.arn
  }

  condition {
    host_header {
      values = [var.base_domain_name, "www.${var.base_domain_name}"]
    }
  }
}

## --------------Listener Rule for api. sub-domain (backend)--------------------
resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 200

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }

  condition {
    host_header {
      values = ["api.${var.base_domain_name}"]
    }
  }
}
