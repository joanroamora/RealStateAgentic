output "ec2_public_ip" {
  value       = module.ec2.public_ip
  description = "Elastic Public IP for Texas Real Estate Agent Platform"
}

output "ec2_public_url" {
  value       = "http://${module.ec2.public_ip}"
  description = "Public HTTP URL for Texas Real Estate Agent Platform"
}

output "instance_id" {
  value = module.ec2.instance_id
}

output "gemini_secret_arn" {
  value = module.secrets.gemini_secret_arn
}

output "target_branch" {
  value = var.target_branch
}
