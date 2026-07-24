output "public_ip" {
  value       = aws_eip.web_eip.public_ip
  description = "Elastic Public IP of the EC2 Instance"
}

output "public_dns" {
  value       = aws_eip.web_eip.public_dns
  description = "Public DNS of the Elastic IP"
}

output "instance_id" {
  value       = aws_instance.web.id
  description = "EC2 Instance ID"
}
