variable "hosted_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
}

variable "alb_zone_id" {
  description = "Zone ID of the load balancer"
  type        = string
}

variable "alb_dns_name" {
  description = "DNS name of frontend ALB"
  type        = string
}

variable "domain_name" {
  description = "The base domain name (e.g example.com)"
  type        = string
}
