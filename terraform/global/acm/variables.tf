variable "domain_name" {
  description = "The primary domain name for the ACM certificate (e.g example.com)"
  type        = string
}

variable "route53_zone_id" {
  description = "The Route53 Hosted Zone ID for DNS validation"
  type        = string
}

variable "environment" {
  default = "development-env"
}
