# AWS EC2 Infrastructure for Texas Real Estate Agent Platform

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_security_group" "ec2_sg" {
  name        = "${var.project_name}-${var.environment}-ec2-sg"
  description = "Security Group for Texas Real Estate EC2 Web Server & OpenClaw Agent"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP Inbound"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS Inbound"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH Access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-ec2-sg"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Branch      = "Feature1-FirstApproachInfraConfig"
  }
}

resource "aws_instance" "web" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  subnet_id                   = var.public_subnet_id
  vpc_security_group_ids      = [aws_security_group.ec2_sg.id]
  associate_public_ip_address = true

  user_data = <<-EOF
              #!/bin/bash
              set -e
              apt-get update -y
              apt-get install -y git nginx python3 python3-pip python3-venv

              # Clone application repository on EC2
              mkdir -p /app
              git clone -b Feature1-FirstApproachInfraConfig https://github.com/joanroamora/RealStateAgentic.git /app || git clone https://github.com/joanroamora/RealStateAgentic.git /app || true

              # Copy frontend files to Nginx web root
              mkdir -p /var/www/html
              if [ -d "/app/frontend/src" ]; then
                cp -r /app/frontend/src/* /var/www/html/
              fi

              # Configure Nginx as reverse proxy to OpenClaw Backend on port 8000
              cat <<'NGINX' > /etc/nginx/sites-available/default
              server {
                  listen 80 default_server;
                  listen [::]:80 default_server;

                  root /var/www/html;
                  index index.html index.htm;

                  server_name _;

                  location / {
                      try_files $uri $uri/ /index.html;
                  }

                  location /api/openclaw/ {
                      proxy_pass http://127.0.0.1:8000/;
                      proxy_set_header Host $host;
                      proxy_set_header X-Real-IP $remote_addr;
                  }
              }
              NGINX

              systemctl restart nginx

              # Setup OpenClaw Python virtual environment & Systemd Service
              if [ -d "/app/backend_openclaw" ]; then
                cd /app/backend_openclaw
                python3 -m venv venv
                ./venv/bin/pip install --upgrade pip
                ./venv/bin/pip install fastapi uvicorn pydantic requests

                cat <<'SERVICE' > /etc/systemd/system/openclaw.service
              [Unit]
              Description=OpenClaw FastAPI Multi-Agent Service
              After=network.target

              [Service]
              User=root
              WorkingDirectory=/app/backend_openclaw
              ExecStart=/app/backend_openclaw/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
              Restart=always

              [Install]
              WantedBy=multi-user.target
              SERVICE

                systemctl daemon-reload
                systemctl enable openclaw
                systemctl start openclaw
              fi
              EOF

  tags = {
    Name        = "${var.project_name}-${var.environment}-web-server"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Branch      = "Feature1-FirstApproachInfraConfig"
  }
}

resource "aws_eip" "web_eip" {
  instance = aws_instance.web.id
  domain   = "vpc"

  tags = {
    Name        = "${var.project_name}-${var.environment}-eip"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Branch      = "Feature1-FirstApproachInfraConfig"
  }
}
