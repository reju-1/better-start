## ACM Certificate Module

This module issues an SSL/TLS certificate for a given domain including 2 subdomains (www and api).

### Required Input
- Route53 hosted zone
- Domain name

### Outputs
- Certificate ARN
- Certificate domain name

### What it creates
- ACM certificate with DNS validation
- Route53 validation records
- Certificate validation resource

### Usage
```hcl
module "acm_certificate" {
  source = "./path-to-module"
  
  domain_name      = "example.com"
  route53_zone_id  = "ABC123456XYZ"
}
```
