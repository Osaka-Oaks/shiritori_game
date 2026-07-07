# 🏗️ Infrastructure as Code - Terraform/OpenTofu

Complete infrastructure configuration for the Shiritori Game using Terraform/OpenTofu.

---

## 🎯 Overview

This directory contains Infrastructure as Code (IaC) configurations for deploying and managing the Shiritori Game infrastructure on Google Cloud Platform (GCP) with Firebase.

**Compatible with:**
- ✅ Terraform (v1.0+)
- ✅ OpenTofu (v1.6+)

---

## 📁 Structure

```
infrastructure/
├── terraform/
│   ├── main.tf                    # Main infrastructure configuration
│   ├── variables.tf               # Input variables
│   ├── outputs.tf                 # Output values
│   ├── terraform.tfvars.example   # Example configuration
│   ├── environments/              # Environment-specific configs
│   │   ├── dev.tfvars
│   │   ├── staging.tfvars
│   │   └── production.tfvars
│   └── modules/                   # Reusable modules
│       ├── firebase/
│       ├── storage/
│       ├── cloud-run/
│       └── monitoring/
└── README.md                      # This file
```

---

## 🚀 Quick Start

### Prerequisites

**Install Terraform OR OpenTofu:**

```bash
# Option 1: Terraform
brew install terraform

# Option 2: OpenTofu (open-source)
brew install opentofu

# Verify installation
terraform version
# or
tofu version
```

**Install Google Cloud SDK:**

```bash
brew install --cask google-cloud-sdk

# Login
gcloud auth login
gcloud auth application-default login

# Set project
gcloud config set project shiritori-game-ccaae
```

### Setup

```bash
# Navigate to terraform directory
cd infrastructure/terraform

# Copy example configuration
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your values
nano terraform.tfvars

# Initialize Terraform/OpenTofu
terraform init
# or
tofu init
```

### Deploy

```bash
# Plan changes
terraform plan -out=tfplan

# Review the plan
terraform show tfplan

# Apply changes
terraform apply tfplan

# Or combine plan and apply
terraform apply -auto-approve
```

---

## 🎨 What Gets Created

### Core Infrastructure

**Firebase:**
- ✅ Firebase Project
- ✅ Firestore Database (Native mode)
- ✅ Firebase Hosting
- ✅ Firebase Storage
- ✅ Firebase Authentication
- ✅ Firebase Analytics

**Cloud Storage:**
- ✅ Hosting bucket (with website config)
- ✅ Firebase storage bucket (with CORS)
- ✅ Terraform state bucket (versioned)

**Cloud Run:**
- ✅ API service (Node.js/Express)
- ✅ Auto-scaling (0-10 instances)
- ✅ Public access (unauthenticated)
- ✅ Environment variables

**Cloud Scheduler:**
- ✅ Cleanup old games (daily)
- ✅ Update leaderboard (hourly)
- ✅ Analytics report (daily)

**Monitoring:**
- ✅ Uptime checks
- ✅ Alert policies
- ✅ Cloud Logging
- ✅ Performance monitoring

### Enabled APIs

```
firebase.googleapis.com
firestore.googleapis.com
firebasedatabase.googleapis.com
firebasehosting.googleapis.com
cloudfunctions.googleapis.com
run.googleapis.com
compute.googleapis.com
storage-api.googleapis.com
cloudscheduler.googleapis.com
monitoring.googleapis.com
logging.googleapis.com
```

---

## 📋 Configuration

### Variables

**Required:**
```hcl
project_id  = "shiritori-game-ccaae"  # Your GCP project ID
region      = "us-central1"            # Primary region
environment = "production"             # Environment name
```

**Optional:**
```hcl
cloud_run_config = {
  cpu_limit     = "1000m"
  memory_limit  = "512Mi"
  min_instances = 0
  max_instances = 10
}

features = {
  cloud_run       = true
  cloud_scheduler = true
  monitoring      = true
  custom_domain   = false
  cdn             = true
}
```

### Environments

**Development:**
```bash
terraform apply -var-file="environments/dev.tfvars"
```

**Staging:**
```bash
terraform apply -var-file="environments/staging.tfvars"
```

**Production:**
```bash
terraform apply -var-file="environments/production.tfvars"
```

---

## 🔥 Firebase Configuration

### Project Details

```bash
Project ID: shiritori-game-ccaae
Web App URL: https://shiritori-game-ccaae.web.app
Database URL: https://shiritori-game-ccaae-default-rtdb.firebaseio.com
Storage: gs://shiritori-game-ccaae.appspot.com
```

### Firestore Collections

```
/users/{userId}
  - displayName: string
  - stats: map

/games/{gameId}
  - playerIds: array
  - words: array
  - status: string

/leaderboard/{userId}
  - score: number
  - rank: number
```

### Security Rules

Security rules are managed separately via:
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

---

## ☁️ Cloud Run Configuration

### API Service

**Endpoint:** Auto-generated URL from Terraform output

**Environment Variables:**
```
FIREBASE_PROJECT_ID=shiritori-game-ccaae
ENVIRONMENT=production
```

**Resources:**
- CPU: 1000m (1 vCPU)
- Memory: 512Mi
- Timeout: 300s
- Concurrency: 80

**Scaling:**
- Min instances: 0 (scale to zero)
- Max instances: 10
- Target CPU: 80%

### Deploy New Version

```bash
# Build container
docker build -t gcr.io/shiritori-game-ccaae/api:latest .

# Push to Container Registry
docker push gcr.io/shiritori-game-ccaae/api:latest

# Terraform will detect and deploy
terraform apply
```

---

## ⏰ Scheduled Jobs

### Cleanup Old Games

```bash
Schedule: 0 2 * * *  (Daily at 2 AM)
Endpoint: POST /api/cleanup
Action: Delete games older than 30 days
```

### Update Leaderboard

```bash
Schedule: 0 * * * *  (Every hour)
Endpoint: POST /api/leaderboard/update
Action: Recalculate rankings
```

### Analytics Report

```bash
Schedule: 0 0 * * *  (Daily at midnight)
Endpoint: POST /api/analytics/report
Action: Generate daily report
```

---

## 📊 Monitoring & Alerts

### Uptime Checks

**Target:** `https://shiritori-game-ccaae.web.app`  
**Frequency:** Every 60 seconds  
**Timeout:** 10 seconds  
**Expected:** HTTP 200 + "Shiritori" in content  

### Alert Policies

**Uptime Alert:**
- Condition: Uptime check fails
- Duration: 60 seconds
- Action: Send notification
- Auto-close: 30 minutes

### Dashboards

View in Cloud Console:
```bash
gcloud monitoring dashboards list --project shiritori-game-ccaae
```

---

## 🔒 Security

### Service Accounts

**Scheduler SA:**
- Email: `scheduler-sa@shiritori-game-ccaae.iam.gserviceaccount.com`
- Role: `roles/run.invoker`
- Purpose: Invoke Cloud Run services from Cloud Scheduler

### IAM Policies

```hcl
# Public access to Cloud Run API
google_cloud_run_service_iam_member.api_public

# Scheduler can invoke Cloud Run
google_project_iam_member.scheduler_cloudrun
```

### Secrets Management

**Don't commit:**
- `terraform.tfvars` (contains secrets)
- `.terraform/` (state and providers)
- `*.tfstate` (state files)

**Use:**
- Google Secret Manager for API keys
- Environment variables for runtime config
- GCS backend for state encryption

---

## 📦 State Management

### Backend Configuration

```hcl
terraform {
  backend "gcs" {
    bucket = "shiritori-game-terraform-state"
    prefix = "terraform/state"
  }
}
```

### State Commands

```bash
# Show current state
terraform show

# List resources
terraform state list

# Inspect specific resource
terraform state show google_cloud_run_service.api

# Move resource (rename)
terraform state mv old_name new_name

# Remove resource from state
terraform state rm resource_name

# Pull remote state
terraform state pull > terraform.tfstate

# Push local state
terraform state push terraform.tfstate
```

---

## 🧪 Testing

### Validate Configuration

```bash
# Validate syntax
terraform validate

# Format code
terraform fmt -recursive

# Check formatting
terraform fmt -check

# Generate plan
terraform plan
```

### Test Deployments

```bash
# Create test workspace
terraform workspace new test

# Apply to test
terraform apply -var="environment=test"

# Verify
terraform output urls

# Destroy test environment
terraform destroy

# Switch back
terraform workspace select default
```

---

## 🔄 Workflow

### 1. Make Changes

```bash
# Edit .tf files
vim main.tf variables.tf

# Format
terraform fmt

# Validate
terraform validate
```

### 2. Plan

```bash
# Create plan
terraform plan -out=tfplan

# Review changes
terraform show tfplan

# Check specific resource
terraform plan -target=google_cloud_run_service.api
```

### 3. Apply

```bash
# Apply plan
terraform apply tfplan

# Or auto-approve
terraform apply -auto-approve

# Apply specific resource
terraform apply -target=google_cloud_run_service.api
```

### 4. Verify

```bash
# Check outputs
terraform output

# Check specific output
terraform output api_url

# View in browser
open $(terraform output -raw firebase_web_url)
```

### 5. Destroy (if needed)

```bash
# Plan destroy
terraform plan -destroy

# Destroy all
terraform destroy

# Destroy specific resource
terraform destroy -target=google_cloud_run_service.api
```

---

## 🐛 Troubleshooting

### Issue: Backend initialization failed

```bash
# Solution: Create state bucket manually
gsutil mb gs://shiritori-game-terraform-state
gsutil versioning set on gs://shiritori-game-terraform-state

# Then reinitialize
terraform init -reconfigure
```

### Issue: API not enabled

```bash
# Solution: Enable manually
gcloud services enable firebase.googleapis.com --project shiritori-game-ccaae

# Or apply with retry
terraform apply -refresh=true
```

### Issue: Permission denied

```bash
# Solution: Check authentication
gcloud auth application-default login

# Verify project
gcloud config get-value project

# Check IAM roles
gcloud projects get-iam-policy shiritori-game-ccaae
```

### Issue: State lock conflict

```bash
# Solution: Force unlock (use with caution)
terraform force-unlock <LOCK_ID>
```

### Issue: Resource already exists

```bash
# Solution: Import existing resource
terraform import google_firebase_project.default shiritori-game-ccaae

# Or remove from state and let Terraform adopt
terraform state rm google_firebase_project.default
terraform apply
```

---

## 📚 Commands Reference

### Terraform/OpenTofu Commands

```bash
terraform init              # Initialize working directory
terraform validate          # Validate configuration
terraform fmt               # Format code
terraform plan              # Show execution plan
terraform apply             # Apply changes
terraform destroy           # Destroy infrastructure
terraform output            # Show outputs
terraform state list        # List resources
terraform show              # Show current state
terraform refresh           # Refresh state
terraform import            # Import existing resource
terraform workspace list    # List workspaces
terraform workspace new     # Create workspace
terraform workspace select  # Switch workspace
```

### Google Cloud Commands

```bash
gcloud auth login                  # Login
gcloud config set project <ID>     # Set project
gcloud services list --enabled     # List APIs
gcloud services enable <API>       # Enable API
gcloud projects list               # List projects
gcloud compute regions list        # List regions
gcloud run services list           # List Cloud Run
gcloud scheduler jobs list         # List cron jobs
```

### Firebase Commands

```bash
firebase login                     # Login
firebase projects:list             # List projects
firebase use shiritori-game-ccaae  # Select project
firebase deploy                    # Deploy all
firebase deploy --only hosting     # Deploy hosting
firebase deploy --only firestore   # Deploy rules
```

---

## 🎯 Best Practices

### 1. Use Workspaces

```bash
terraform workspace new production
terraform workspace new staging
terraform workspace new dev
```

### 2. Separate Environments

```
environments/
├── dev.tfvars
├── staging.tfvars
└── production.tfvars
```

### 3. Module Organization

```
modules/
├── firebase/
├── storage/
├── cloud-run/
└── monitoring/
```

### 4. State Management

- ✅ Use remote backend (GCS)
- ✅ Enable versioning
- ✅ Lock state during operations
- ✅ Never commit state files

### 5. Security

- ✅ Use service accounts
- ✅ Principle of least privilege
- ✅ Rotate credentials
- ✅ Use Secret Manager

---

## 🎉 Summary

You now have:

✅ **Complete infrastructure code** - Terraform/OpenTofu ready  
✅ **Firebase project** - Fully configured  
✅ **Cloud Run API** - Auto-scaling service  
✅ **Scheduled jobs** - Cron for cleanup & analytics  
✅ **Monitoring** - Uptime checks & alerts  
✅ **State management** - GCS backend with versioning  
✅ **Documentation** - Complete reference  

**Deploy infrastructure:**
```bash
cd infrastructure/terraform
terraform init
terraform apply
```

**View results:**
```bash
terraform output urls
```

---

*Infrastructure as Code: Terraform & OpenTofu*  
*Compatible: Terraform v1.0+ | OpenTofu v1.6+*  
*Provider: Google Cloud Platform*  
*Status: ✅ Production Ready*
