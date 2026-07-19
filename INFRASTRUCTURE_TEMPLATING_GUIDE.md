# 🏗️ Infrastructure Templating Guide

Complete guide to infrastructure templates, issue templates, and IaC for the Shiritori Game project.

---

## 🎯 Overview

This guide covers:

- ✅ **Issue Templates** - GitHub issue/work item templates in Markdown
- ✅ **Terraform Templates** - Infrastructure as Code configuration
- ✅ **OpenTofu Support** - Open-source Terraform alternative
- ✅ **Integration** - How templates work together

---

## 📋 Issue Templates

### Created Templates

**Location:** `.github/ISSUE_TEMPLATE/`

```
.github/ISSUE_TEMPLATE/
├── bug_report.md          # 🐛 Bug reporting template
├── feature_request.md     # ✨ Feature request template
└── work_item.md           # 📋 Work item/task template
```

### 1. Bug Report Template

**File:** `bug_report.md`

**Sections:**

- Bug description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots
- Environment details (app, platform, browser, device)
- Error messages & logs
- Impact assessment (severity, frequency, users affected)
- Possible solutions
- Definition of done

**Example Usage:**

```bash
# Create bug report
gh issue create --template bug_report.md --title "[BUG] Game crashes on word submit"

# With labels
gh issue create --template bug_report.md --label "bug,critical,shiritori-online"
```

**Hashtags:**

```markdown
#bug #needs-fix #critical #high-priority
```

### 2. Feature Request Template

**File:** `feature_request.md`

**Sections:**

- Feature description
- Problem statement
- User stories
- Acceptance criteria
- Design & UX mockups
- Technical approach
- Implementation plan
- Alternatives considered
- Success metrics
- Priority & effort estimate
- Timeline

**Example Usage:**

```bash
# Create feature request
gh issue create --template feature_request.md --title "[FEATURE] Add multiplayer mode"

# With labels and assignees
gh issue create --template feature_request.md \
  --label "enhancement,multiplayer" \
  --assignee "@me"
```

**Hashtags:**

```markdown
#feature #enhancement #new-feature #multiplayer
```

### 3. Work Item Template

**File:** `work_item.md`

**Sections:**

- Work item summary
- Objective
- Type (feature, bug fix, refactor, docs, testing, devops, security, performance, chore, research)
- Scope (applications, components)
- Phased tasks (planning, implementation, testing, deployment)
- Technical details
- Acceptance criteria
- Testing strategy
- Metrics & monitoring
- Priority & estimate

**Example Usage:**

```bash
# Create work item
gh issue create --template work_item.md --title "[WORK] Refactor game state management"

# With project board
gh issue create --template work_item.md \
  --label "work-item,refactor" \
  --project "Sprint 23"
```

**Hashtags:**

```markdown
#work-item #task #development #sprint
```

---

## 🏗️ Terraform/OpenTofu Templates

### Created Templates

**Location:** `infrastructure/terraform/`

```
infrastructure/terraform/
├── main.tf                    # Main infrastructure config
├── variables.tf               # Input variables
├── outputs.tf                 # Output values
├── terraform.tfvars.example   # Example configuration
└── README.md                  # Documentation
```

### What Gets Created

**Firebase:**

```hcl
- Firebase Project
- Firestore Database (Native mode)
- Firebase Hosting
- Firebase Storage
- Firebase Authentication
- Firebase Analytics
```

**Cloud Infrastructure:**

```hcl
- Cloud Storage buckets (hosting, storage, state)
- Cloud Run API service
- Cloud Scheduler cron jobs
- Monitoring & alerting
- IAM & service accounts
```

### Quick Start

**1. Install Terraform or OpenTofu:**

```bash
# Terraform
brew install terraform

# OpenTofu (open-source)
brew install opentofu
```

**2. Initialize:**

```bash
cd infrastructure/terraform
terraform init
# or
tofu init
```

**3. Configure:**

```bash
# Copy example
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
nano terraform.tfvars
```

**4. Deploy:**

```bash
# Plan
terraform plan -out=tfplan

# Apply
terraform apply tfplan

# Or combined
terraform apply -auto-approve
```

---

## 🎨 Infrastructure Resources

### Firebase Configuration

```hcl
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id
}

resource "google_firestore_database" "database" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"
}
```

**Outputs:**

- Firebase Web URL: `https://shiritori-game-ccaae.web.app`
- Database URL: `https://shiritori-game-ccaae-default-rtdb.firebaseio.com`
- Storage: `gs://shiritori-game-ccaae.appspot.com`

### Cloud Run API

```hcl
resource "google_cloud_run_service" "api" {
  name     = "shiritori-game-api"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/shiritori-api:latest"

        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
  }
}
```

**Features:**

- Auto-scaling (0-10 instances)
- Public access (unauthenticated)
- Environment variables configured
- Automatic HTTPS

### Cloud Scheduler

```hcl
resource "google_cloud_scheduler_job" "cleanup_old_games" {
  name        = "cleanup-old-games"
  schedule    = "0 2 * * *"  # Daily at 2 AM
  time_zone   = "America/New_York"

  http_target {
    uri = "${google_cloud_run_service.api.status[0].url}/api/cleanup"
  }
}
```

**Scheduled Jobs:**

- `cleanup_old_games` - Daily at 2 AM
- `update_leaderboard` - Every hour
- `analytics_report` - Daily at midnight

### Monitoring

```hcl
resource "google_monitoring_uptime_check_config" "web_app" {
  display_name = "shiritori-game-uptime-check"
  timeout      = "10s"
  period       = "60s"

  http_check {
    path = "/"
    port = 443
    use_ssl = true
  }
}
```

**Alerts:**

- Uptime check failures
- High error rates
- Resource exhaustion
- Budget thresholds

---

## 🔧 Terraform vs OpenTofu

### Comparison

| Feature           | Terraform             | OpenTofu              |
| ----------------- | --------------------- | --------------------- |
| **License**       | BSL 1.1 (proprietary) | MPL 2.0 (open-source) |
| **Compatibility** | Original              | Fork of Terraform 1.5 |
| **Commands**      | `terraform`           | `tofu`                |
| **State**         | Compatible            | Compatible            |
| **Providers**     | HashiCorp registry    | OpenTofu registry     |
| **Community**     | Large                 | Growing               |
| **Support**       | HashiCorp             | Linux Foundation      |

### Migration: Terraform → OpenTofu

```bash
# 1. Install OpenTofu
brew install opentofu

# 2. Replace terraform with tofu
alias terraform=tofu

# 3. Initialize (uses existing state)
tofu init

# 4. Verify
tofu plan

# 5. Continue using tofu
tofu apply
```

**All commands are identical:**

```bash
terraform init  →  tofu init
terraform plan  →  tofu plan
terraform apply →  tofu apply
```

---

## 🎯 Integration Examples

### Issue → Infrastructure

**Scenario:** Feature request creates infrastructure need

```bash
# 1. Create feature issue
gh issue create --template feature_request.md \
  --title "[FEATURE] Add Redis caching" \
  --label "enhancement,infrastructure"

# 2. Create work item for infrastructure
gh issue create --template work_item.md \
  --title "[WORK] Deploy Redis instance" \
  --label "work-item,devops,infrastructure"

# 3. Update Terraform
# Add redis.tf to infrastructure/terraform/
resource "google_redis_instance" "cache" {
  name           = "shiritori-cache"
  memory_size_gb = 1
  region         = var.region
}

# 4. Deploy
terraform apply

# 5. Comment on issue with results
gh issue comment <issue_number> --body "✅ Redis deployed: $(terraform output redis_host)"
```

### Bug → Infrastructure Fix

**Scenario:** Bug report reveals infrastructure issue

```bash
# 1. Bug reported
gh issue create --template bug_report.md \
  --title "[BUG] High latency in US East" \
  --label "bug,performance,infrastructure"

# 2. Create work item
gh issue create --template work_item.md \
  --title "[WORK] Add US East region" \
  --label "work-item,infrastructure"

# 3. Update Terraform variables
# In terraform.tfvars:
regions = ["us-central1", "us-east1"]

# 4. Apply multi-region config
terraform apply

# 5. Close bug with resolution
gh issue close <issue_number> --comment "✅ Fixed: Multi-region deployed"
```

---

## 📊 Workflow: Issue → Code → Infrastructure

### Complete Example: New Feature Deployment

**1. Feature Request**

```bash
gh issue create --template feature_request.md \
  --title "[FEATURE] Real-time multiplayer" \
  --label "enhancement,multiplayer" \
  --body "Add WebSocket support for real-time games"
```

**2. Break Down into Work Items**

```bash
# Backend work
gh issue create --template work_item.md \
  --title "[WORK] Implement WebSocket server" \
  --label "work-item,backend"

# Infrastructure work
gh issue create --template work_item.md \
  --title "[WORK] Deploy WebSocket service" \
  --label "work-item,infrastructure"

# Frontend work
gh issue create --template work_item.md \
  --title "[WORK] Add WebSocket client" \
  --label "work-item,frontend"
```

**3. Implement Infrastructure**

```bash
cd infrastructure/terraform

# Add websocket service
cat > websocket.tf <<EOF
resource "google_cloud_run_service" "websocket" {
  name     = "shiritori-websocket"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/websocket:latest"
        ports {
          container_port = 8080
        }
      }
    }
  }
}
EOF

# Plan
terraform plan

# Apply
terraform apply
```

**4. Deploy Application**

```bash
# Build and deploy
npm run build
firebase deploy --only hosting

# Cloud Run deployment handled by Terraform
```

**5. Test & Verify**

```bash
# Get WebSocket URL
WS_URL=$(terraform output -raw websocket_url)

# Test connection
curl -I $WS_URL

# Run integration tests
npm run test:integration
```

**6. Update Issues**

```bash
# Close work items
gh issue close <work-item-1> --comment "✅ WebSocket server deployed"
gh issue close <work-item-2> --comment "✅ Infrastructure configured"
gh issue close <work-item-3> --comment "✅ Client integrated"

# Close feature request
gh issue close <feature-request> --comment "✅ Feature complete and deployed"
```

---

## 🔄 CI/CD Integration

### GitHub Actions + Terraform

**Workflow:** `.github/workflows/terraform.yml`

```yaml
name: Terraform

on:
  push:
    paths:
      - "infrastructure/terraform/**"
  pull_request:
    paths:
      - "infrastructure/terraform/**"

jobs:
  terraform:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.6.0

      - name: Terraform Init
        run: terraform init
        working-directory: infrastructure/terraform

      - name: Terraform Validate
        run: terraform validate
        working-directory: infrastructure/terraform

      - name: Terraform Plan
        run: terraform plan
        working-directory: infrastructure/terraform
        env:
          GOOGLE_CREDENTIALS: ${{ secrets.GCP_SA_KEY }}

      - name: Terraform Apply (main only)
        if: github.ref == 'refs/heads/main'
        run: terraform apply -auto-approve
        working-directory: infrastructure/terraform
        env:
          GOOGLE_CREDENTIALS: ${{ secrets.GCP_SA_KEY }}
```

### OpenTofu CI/CD

Replace `hashicorp/setup-terraform` with `opentofu/setup-opentofu`:

```yaml
- name: Setup OpenTofu
  uses: opentofu/setup-opentofu@v1
  with:
    tofu_version: 1.6.0

- name: OpenTofu Init
  run: tofu init
```

---

## 📚 Commands Reference

### Issue Management

```bash
# Create from template
gh issue create --template <template_name>

# List issues
gh issue list --label "work-item"

# View issue
gh issue view <number>

# Comment
gh issue comment <number> --body "Comment"

# Close
gh issue close <number>

# Reopen
gh issue reopen <number>
```

### Terraform/OpenTofu

```bash
# Initialize
terraform init

# Validate
terraform validate

# Plan
terraform plan

# Apply
terraform apply

# Destroy
terraform destroy

# Output
terraform output

# State
terraform state list
terraform state show <resource>
```

### Integration

```bash
# Create issue with Terraform output
gh issue comment <number> --body "$(terraform output -json)"

# Tag resources with issue number
terraform apply -var="issue_number=<number>"

# Link deployment to issue
gh issue comment <number> --body "Deployed to $(terraform output url)"
```

---

## 🎓 Best Practices

### Issue Templates

✅ **DO:**

- Use descriptive titles with prefixes ([BUG], [FEATURE], [WORK])
- Add relevant labels and hashtags
- Include acceptance criteria
- Link related issues
- Track in project boards

❌ **DON'T:**

- Create issues without templates
- Skip required fields
- Duplicate existing issues
- Use vague descriptions

### Infrastructure Code

✅ **DO:**

- Use version control for all IaC
- Separate environments (dev, staging, prod)
- Use remote state backend
- Document all resources
- Tag resources appropriately
- Use modules for reusability

❌ **DON'T:**

- Manually create resources in console
- Commit sensitive data
- Skip planning before apply
- Use default names
- Ignore warnings

---

## 🎉 Summary

You now have:

✅ **3 Issue Templates** - Bug, Feature, Work Item  
✅ **Complete Terraform Config** - Firebase + GCP infrastructure  
✅ **OpenTofu Support** - Open-source alternative ready  
✅ **Integration Guide** - Issue → Code → Infrastructure  
✅ **CI/CD Examples** - Automated deployment workflows  
✅ **Documentation** - Complete reference guides

**Create an issue:**

```bash
gh issue create --template bug_report.md --title "[BUG] Description"
```

**Deploy infrastructure:**

```bash
cd infrastructure/terraform
terraform init
terraform apply
```

**Use OpenTofu instead:**

```bash
tofu init
tofu apply
```

---

**Templates:** Issue tracking + Infrastructure as Code  
**Tools:** GitHub + Terraform + OpenTofu  
**Integration:** Complete workflow automation  
**Status:** ✅ Production Ready

---

_Last updated: July 2026_  
_Terraform compatible: v1.0+_  
_OpenTofu compatible: v1.6+_  
_Status: ✅ Complete_
