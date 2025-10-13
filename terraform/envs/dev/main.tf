# module "s3" {
#   source          = "../../modules/s3"
#   bucket_name     = var.bucket_name
#   allowed_origins = var.allowed_origins
# }

module "vpc" {
  source      = "../../modules/vpc"
  environment = "dev"
  az_count    = 2
  tags = {
    Project = "Better-Start"
  }
}

module "security_group" {
  source         = "../../modules/security-group"
  vpc_id         = module.vpc.vpc_id
  vpc_cidr_block = module.vpc.vpc_cidr
}

module "ec2" {
  source             = "../../modules/ec2"
  key_name           = var.key_name
  vpc_id             = module.vpc.vpc_id
  vpc_cidr           = module.vpc.vpc_cidr
  public_subnet_ids  = module.vpc.public_subnet_ids
  private_subnet_ids = module.vpc.private_subnet_ids
  # Security groups
  alb_sg_id          = module.security_group.alb_security_sg_id
  ec2_sg_id          = module.security_group.ec2_security_sg_id
  bastion_host_sg_id = module.security_group.bastion_security_sg_id
  worker_sg_id       = module.security_group.worker_security_sg_id
}

module "alb" {
  source                = "../../modules/alb"
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnet_ids
  alb_security_group_id = module.security_group.alb_security_sg_id
  base_domain_name      = var.base_domain_name

  # HTTPS
  certificate_arn = module.acm.certificate_arn

  # instances
  www_instance_ids = [module.ec2.frontend_instance_id]
  api_instance_ids = [module.ec2.backend_instance_id]
}

module "route53" {
  source         = "../../global/route53"
  domain_name    = var.base_domain_name
  hosted_zone_id = var.route53_zone_id

  # alb dns info
  alb_dns_name = module.alb.alb_dns_name
  alb_zone_id  = module.alb.alb_zone_id
}

module "acm" {
  source          = "../../global/acm"
  domain_name     = var.base_domain_name
  route53_zone_id = var.route53_zone_id
}
