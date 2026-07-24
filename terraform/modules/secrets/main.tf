# AWS Secrets Manager Module for DevSecOps Secret Management

resource "aws_secretsmanager_secret" "gemini_api" {
  name        = "${var.environment}/${var.project_name}/gemini-api-key"
  description = "Gemini API Token for OpenClaw Real Estate Agent in ${var.environment}"

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_secretsmanager_secret_version" "gemini_api_val" {
  secret_id     = aws_secretsmanager_secret.gemini_api.id
  secret_string = jsonencode({
    GEMINI_API_KEY = "DUMMY_SECRET_MANAGED_BY_AWS_SECRETS_MANAGER"
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_secretsmanager_secret" "veracode_creds" {
  name        = "${var.environment}/${var.project_name}/veracode-credentials"
  description = "Veracode SAST/SCA API Credentials for DevSecOps CI/CD"

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_secretsmanager_secret_version" "veracode_creds_val" {
  secret_id     = aws_secretsmanager_secret.veracode_creds.id
  secret_string = jsonencode({
    VERACODE_API_KEY_ID     = "DUMMY_VERACODE_ID",
    VERACODE_API_KEY_SECRET = "DUMMY_VERACODE_SECRET"
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}
