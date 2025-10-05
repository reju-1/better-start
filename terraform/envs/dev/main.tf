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
}
