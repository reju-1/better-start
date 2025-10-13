## --------------Target Group for WWW (Frontend)--------------------
resource "aws_lb_target_group" "www" {
  name     = "bs-www-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  deregistration_delay = 30

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200"
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "bs-www-target-group"
    Environment = var.environment
  }
}

## --------------Target Group for API (Backend)--------------------
resource "aws_lb_target_group" "api" {
  name     = "bs-api-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  deregistration_delay = 30

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/" # API health endpoint
    protocol            = "HTTP"
    matcher             = "200"
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "bs-api-target-group"
    Environment = var.environment
  }
}

## --------------Target Group Attachments for WWW--------------------
resource "aws_lb_target_group_attachment" "www_attachment" {
  count            = length(var.www_instance_ids)
  target_group_arn = aws_lb_target_group.www.arn
  target_id        = var.www_instance_ids[count.index]
  port             = 80
}

## --------------Target Group Attachments for API--------------------
resource "aws_lb_target_group_attachment" "api_attachment" {
  count            = length(var.api_instance_ids)
  target_group_arn = aws_lb_target_group.api.arn
  target_id        = var.api_instance_ids[count.index]
  port             = 80
}
