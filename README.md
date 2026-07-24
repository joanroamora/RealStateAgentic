# Texas Real Estate Agent Platform - DevSecOps Infrastructure & Architecture

[![Branch: Feature1-FirstApproachInfraConfig](https://img.shields.io/badge/Branch-Feature1--FirstApproachInfraConfig-blue.svg)](https://github.com/joanr/agentic-platforms/tree/Feature1-FirstApproachInfraConfig)
[![DevSecOps: Compliant](https://img.shields.io/badge/DevSecOps-Veracode%20%7C%20Trivy%20%7C%20SCA-green.svg)](#1-ci-pipeline-devsecops)
[![AWS: ECS Fargate](https://img.shields.io/badge/AWS-ECS%20Fargate-orange.svg)](#2-cd-pipeline--infrastructure)

Architecture design and DevSecOps continuous integration and delivery (CI/CD) pipelines for the **Texas Real Estate Platform**, featuring an **OpenClaw AI Agent** core running securely inside an AWS ECS Fargate private subnet, and a modern frontend in a public subnet.

All repository assets, modules, pipelines, and scripts are associated specifically with the working branch: **`Feature1-FirstApproachInfraConfig`**.

---

## 🏛️ Architecture Overview

```
                          ┌────────────────────────────────────────────────────────┐
                          │               AWS Cloud (us-east-1)                    │
                          │                                                        │
                          │  ┌──────────────────────────────────────────────────┐  │
                          │  │           Public Subnets (Multi-AZ)              │  │
                          │  │                                                  │  │
                          │  │    [ Application Load Balancer (ALB) ]          │  │
                          │  │                     │                            │  │
                          │  │                     ▼                            │  │
                          │  │     [ Frontend Container (Nginx:8080) ]          │  │
                          │  └─────────────────────┬────────────────────────────┘  │
                          │                        │                               │
                          │  ┌─────────────────────▼────────────────────────────┐  │
                          │  │           Private Subnets (Multi-AZ)             │  │
                          │  │                                                  │  │
                          │  │    [ OpenClaw AI Backend (FastAPI:8000) ]        │  │
                          │  │                     │                            │  │
                          │  │                     ▼                            │  │
                          │  │    [ AWS Secrets Manager (Gemini API Key) ]      │  │
                          │  └──────────────────────────────────────────────────┘  │
                          └────────────────────────────────────────────────────────┘
```

---

## 🔒 1. DevSecOps CI Pipeline (`ci.yml`)

The CI pipeline runs automatically on every `push` and `pull_request` targeting `Feature1-FirstApproachInfraConfig`:

1. **Code Style & Formatting (Strict Linters):**
   - **Python Backend & Scripts:** Validated with `Flake8` and `Black --check` (`.flake8` & `pyproject.toml`).
   - **Frontend (HTML/CSS/JS):** Validated with `ESLint` and `Prettier --check` (`.eslintrc.json` & `.prettierrc`).
2. **Security Analysis & Vulnerability Scans:**
   - **SAST (Static Application Security Testing):** Integrated Veracode SAST Pipeline Scan step (with fallback Bandit scan for python source code).
   - **SCA (Software Composition Analysis):** Dependency vulnerability scanning via `pip-audit` and `npm audit`.
3. **Container Vulnerability Scanning & GHCR Artifact Registry:**
   - Multi-stage Docker image compilation for Frontend and OpenClaw Backend.
   - **Trivy Vulnerability Scan:** Images are audited for `HIGH` and `CRITICAL` vulnerabilities before publishing.
   - **Artifact Registry:** Images are pushed to **GitHub Container Registry (GHCR)** (`ghcr.io`) **only if all linter and security stages pass**.

---

## 🚀 2. DevSecOps CD Pipeline & Infrastructure (`cd.yml`)

The CD pipeline automates deployment to AWS ECS Fargate:

- **Strict Environment Isolation:** Deployment is locked **exclusively to the `dev` environment** in AWS region `us-east-1` and branch `Feature1-FirstApproachInfraConfig`.
- **Progressive & Safe Deployment:** Utilizes **AWS ECS Native Rolling Updates** (`minimum_healthy_percent = 100`, `maximum_percent = 200`) to guarantee zero downtime.
- **Secrets Injection:** API keys (e.g., `GEMINI_API_KEY`, Veracode credentials) are injected directly into container task definitions via **AWS Secrets Manager** without hardcoding.
- **Automation Tools:** Configured via **Terraform** (`terraform/`) and **Ansible Playbooks** (`ansible/`).

---

## 📜 3. Commit Governance Hook

Commit messages must follow the prefix rules enforced by `.githooks/commit-msg`:

- `feature/...` (e.g., `feature/add-vpc-module`)
- `fix/...` (e.g., `fix/ecs-task-definition-secrets`)
- `agentcore/...` (e.g., `agentcore/implement-openclaw-handler`)

### Enabling Commit Hooks Locally:
```bash
chmod +x scripts/install-hooks.sh
./scripts/install-hooks.sh
```

---

## 🧪 Local Testing & Linters

Run code style and security checks locally:

```bash
# Python Backend Linters
cd backend_openclaw
flake8 app/ --config=.flake8
black --check app/

# Frontend Linters
cd ../frontend
npm run lint
npm run format

# Git Commit Hook Validation Test
./.githooks/commit-msg .git/COMMIT_EDITMSG
```

---

## 📁 Repository Structure

```
realStateAgentic/
├── .github/
│   ├── hooks/
│   └── workflows/
│       ├── ci.yml                  # DevSecOps CI Workflow (Linter, SAST/Veracode, SCA, Trivy, GHCR)
│       └── cd.yml                  # DevSecOps CD Workflow (AWS ECS Fargate Dev us-east-1)
├── frontend/
│   ├── src/                        # Texas Real Estate UI & OpenClaw Agent Chat panel
│   ├── package.json                # Frontend ESLint & Prettier scripts
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── nginx.conf                  # Security headers & proxy settings
│   └── Dockerfile                  # Hardened Nginx non-root Docker container
├── backend_openclaw/               # OpenClaw AI Agent Core
│   ├── app/
│   │   ├── agent.py                # Gemini AI agent processing module
│   │   └── main.py                 # FastAPI microservice
│   ├── requirements.txt
│   ├── .flake8                     # Flake8 configuration
│   ├── pyproject.toml              # Black formatter configuration
│   └── Dockerfile                  # Hardened Python 3.11 slim non-root container
├── terraform/
│   ├── main.tf                     # Root Terraform module
│   ├── variables.tf                # Dev environment & us-east-1 configuration
│   ├── terraform.tfvars
│   ├── outputs.tf
│   └── modules/
│       ├── vpc/                    # Multi-AZ VPC with Public & Private Subnets
│       ├── secrets/                # AWS Secrets Manager for Gemini & Veracode
│       └── ecs_fargate/            # ECS Cluster, ALB & Rolling Update Services
├── ansible/
│   ├── inventory/
│   │   └── dev.ini                 # Dev environment inventory
│   ├── playbook.yml                # Continuous Deployment playbook
│   └── roles/
│       └── ecs_deploy/             # Zero-downtime rolling update tasks
└── scripts/
    ├── install-hooks.sh            # Git hooks installer
    └── .githooks/commit-msg        # Commit message governance validator
```
