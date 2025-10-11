output "frontend_url" {
  description = "Frontend URL"
  value       = aws_route53_record.www.fqdn
}

output "backend_url" {
  description = "Backend URL"
  value       = aws_route53_record.api.fqdn
}
