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

module "ecs_fargate" {
  source             = "./modules/ecs_fargate"
  environment        = var.environment
  project_name       = var.project_name
  vpc_id             = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnet_ids
  private_subnet_ids = module.vpc.private_subnet_ids
  gemini_secret_arn  = module.secrets.gemini_secret_arn
  frontend_image     = var.frontend_image
  backend_image      = var.backend_image
}
