output "gemini_secret_arn" {
  value = aws_secretsmanager_secret.gemini_api.arn
}

output "veracode_secret_arn" {
  value = aws_secretsmanager_secret.veracode_creds.arn
}
