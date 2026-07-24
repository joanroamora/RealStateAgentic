output "alb_public_url" {
  value       = "http://${module.ecs_fargate.alb_dns_name}"
  description = "Public URL for Texas Real Estate Agent Platform"
}

output "ecs_cluster_name" {
  value = module.ecs_fargate.cluster_name
}

output "gemini_secret_arn" {
  value = module.secrets.gemini_secret_arn
}

output "target_branch" {
  value = var.target_branch
}
