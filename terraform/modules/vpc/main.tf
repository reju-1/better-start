/*
## Network Architecture Flow
1. VPC creation
2. Create public and private subnets
3. Create public and private route tables
4. Internet gateway for public internet access
5. Single NAT gateway (in first public subnet) for private subnet outbound access

## Component Connectivity:
- public-subnet -> public-route-table -> internet-gateway
- private-subnets (all AZs) -> private-route-table -> single nat-gateway (deployed in first public subnet)
*/

## ---------------- Data Sources ------------------------
data "aws_availability_zones" "available" {
  state = "available"
}

## ---------------- Locals ------------------------
locals {
  az_count = min(var.az_count, length(data.aws_availability_zones.available.names))
}

## ----------------VPC Creation------------------------
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  instance_tenancy     = "default"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(
    {
      Name        = "bs-${var.environment}-vpc"
      Environment = var.environment
    },
    var.tags
  )
}

## ---------------------Internet Gateway------------------------------
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "bs-${var.environment}-igw"
    Environment = var.environment
  }
}

## ---------------------- Public Subnets ------------------------
resource "aws_subnet" "public" {
  count                   = local.az_count
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet("10.0.0.0/16", 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "bs-${var.environment}-public-${count.index + 1}"
    Environment = var.environment
    Type        = "Public"
  }
}

## ---------------------- Private Subnets ------------------------
resource "aws_subnet" "private" {
  count             = local.az_count
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet("10.0.0.0/16", 8, count.index + 100)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name        = "bs-${var.environment}-private-${count.index + 1}"
    Environment = var.environment
    Type        = "Private"
  }
}

## ---------------------- Route Tables ------------------------
# Public RT (shared across all public subnets)
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "bs-${var.environment}-public-rt"
    Environment = var.environment
    Type        = "Public"
  }
}

# Private RT (single route table shared across all AZs)
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "bs-${var.environment}-private-rt"
    Environment = var.environment
    Type        = "Private"
  }
}

## ---------------------Routes----------------------------
resource "aws_route" "to_igw" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route" "to_nat_gateway" {
  route_table_id         = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat.id
}

##-------------------- Route Table Associations------------------------
resource "aws_route_table_association" "public" {
  for_each       = { for idx, subnet in aws_subnet.public : idx => subnet }
  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  for_each       = { for idx, subnet in aws_subnet.private : idx => subnet }
  subnet_id      = each.value.id
  route_table_id = aws_route_table.private.id
}

## Single NAT Gateway (deployed in first public subnet)

# Elastic IP
resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name        = "bs-${var.environment}-nat-eip"
    Environment = var.environment
  }

  depends_on = [aws_internet_gateway.igw]
}

# NAT Gateway
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name        = "bs-${var.environment}-nat-gateway"
    Environment = var.environment
  }

  depends_on = [aws_internet_gateway.igw]
}
