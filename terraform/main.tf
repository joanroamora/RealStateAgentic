# Root Terraform Configuration for Texas Real Estate Agent Infrastructure

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source       = "./modules/vpc"
  environment  = var.environment
  project_name = var.project_name
}

module "secrets" {
  source       = "./modules/secrets"
  environment  = var.environment
  project_name = var.project_name
}

module "ec2" {
  source           = "./modules/ec2"
  environment      = var.environment
  project_name     = var.project_name
  vpc_id           = module.vpc.vpc_id
  public_subnet_id = module.vpc.public_subnet_ids[0]
  instance_type    = "t3.micro"
}
