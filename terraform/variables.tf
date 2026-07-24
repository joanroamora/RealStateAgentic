variable "aws_region" {
  description = "AWS region for deployment (dev environment restricted to us-east-1)"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name identifier"
  type        = string
  default     = "texas-realestate-agent"
}

variable "target_branch" {
  description = "Target Git branch for DevSecOps governance"
  type        = string
  default     = "Feature1-FirstApproachInfraConfig"
}

variable "frontend_image" {
  description = "Docker image URI for Frontend Worker Container"
  type        = string
  default     = "public.ecr.aws/docker/library/nginx:alpine"
}

variable "backend_image" {
  description = "Docker image URI for OpenClaw Backend Container"
  type        = string
  default     = "public.ecr.aws/docker/library/python:3.11-slim"
}



