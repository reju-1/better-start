# AWS VPC Terraform Module

A Terraform module for creating a multi-AZ VPC with public and private subnets on AWS.

## Architecture

```
VPC (10.0.0.0/16)
├── Public Subnets (10.0.0.0/24, 10.0.1.0/24, ...)
│   └── Internet Gateway → Internet
└── Private Subnets (10.0.100.0/24, 10.0.101.0/24, ...)
    └── NAT Gateway → Internet
```

## Features

- Multi-AZ deployment with configurable availability zone count
- Public subnets with direct internet access via Internet Gateway
- Private subnets with outbound internet access via NAT Gateway
- DNS hostnames and DNS support enabled
- Automatic public IP assignment for instances in public subnets

## Important Notes

⚠️ **Single NAT Gateway**: This module deploys only one NAT Gateway in the first availability zone for cost optimization. This creates a single point of failure - if that AZ fails, private subnets in all AZs will lose internet access.
