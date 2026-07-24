output "alb_dns_name" {
  value       = aws_lb.alb.dns_name
  description = "Public Load Balancer DNS Endpoint for Texas Real Estate App"
}

output "cluster_name" {
  value = aws_ecs_cluster.cluster.name
}

output "frontend_service_name" {
  value = aws_ecs_service.frontend.name
}

output "backend_service_name" {
  value = aws_ecs_service.backend.name
}
