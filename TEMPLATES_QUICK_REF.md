# 📋 Templates Quick Reference

Fast reference for all issue templates and infrastructure templates in the Shiritori Game project.

---

## 🎯 Issue Templates

### Create Issues

```bash
# Bug Report
gh issue create --template bug_report.md \
  --title "[BUG] Description here" \
  --label "bug,needs-triage"

# Feature Request
gh issue create --template feature_request.md \
  --title "[FEATURE] New feature name" \
  --label "enhancement,needs-review"

# Work Item
gh issue create --template work_item.md \
  --title "[WORK] Task description" \
  --label "work-item,task"
```

### Issue Hashtags

```bash
# Bug Reports
#bug #needs-fix #critical #high-priority

# Features
#feature #enhancement #new-feature

# Work Items
#work-item #task #development #sprint
```

---

## 🏗️ Infrastructure Commands

### Terraform

```bash
# Initialize
npm run infra:init

# Plan changes
npm run infra:plan

# Apply changes
npm run infra:apply

# View outputs
npm run infra:output

# Validate config
npm run infra:validate

# Destroy (careful!)
npm run infra:destroy
```

### OpenTofu

```bash
# Initialize
npm run tofu:init

# Plan changes
npm run tofu:plan

# Apply changes
npm run tofu:apply
```

### Direct Commands

```bash
cd infrastructure/terraform

# Terraform
terraform init
terraform plan
terraform apply
terraform output

# OpenTofu
tofu init
tofu plan
tofu apply
tofu output
```

---

## 🚀 Flutter Commands

```bash
# Development
npm run dev:flutter

# Build
npm run build:flutter

# Or direct
cd shiritori-flutter
flutter run -d chrome
flutter build web --wasm
```

---

## 🎨 Full Workflow Example

### Deploy New Feature with Infrastructure

```bash
# 1. Create feature issue
gh issue create --template feature_request.md \
  --title "[FEATURE] Add caching layer" \
  --label "enhancement,infrastructure"

# 2. Create infrastructure work item
gh issue create --template work_item.md \
  --title "[WORK] Deploy Redis for caching" \
  --label "work-item,infrastructure"

# 3. Update infrastructure
cd infrastructure/terraform
# Edit main.tf to add Redis

# 4. Plan infrastructure
npm run infra:plan

# 5. Apply infrastructure
npm run infra:apply

# 6. Build app
npm run build:kawaii

# 7. Deploy app
npm run deploy:kawaii

# 8. Test deployment
npm run test:firebase

# 9. Close issues
gh issue close <issue-number> --comment "✅ Feature deployed"
```

---

## 📊 Project Scripts Summary

### Development
```bash
npm run dev              # React (shiritori-online)
npm run dev:kawaii       # React (kawaii-shiritori)
npm run dev:flutter      # Flutter (web)
```

### Building
```bash
npm run build            # Build React app
npm run build:kawaii     # Build Kawaii app
npm run build:flutter    # Build Flutter app
```

### Deployment
```bash
npm run deploy:production    # Deploy to production
npm run deploy:staging       # Deploy to staging
npm run deploy:with-tags     # Deploy with hashtags
```

### Infrastructure
```bash
npm run infra:init       # Initialize Terraform
npm run infra:plan       # Plan infrastructure
npm run infra:apply      # Apply infrastructure
npm run tofu:init        # Initialize OpenTofu
npm run tofu:apply       # Apply with OpenTofu
```

### Testing
```bash
npm test                 # Run tests
npm run test:firebase    # Test Firebase deployment
npm run test:deployment  # Test deployment
```

### Quality
```bash
npm run lint             # Lint all code
npm run format           # Format code
npm run security:check   # Security scan
npm run ci:full          # Full CI pipeline
```

---

## 🎯 Templates Location

```
shiritori-game/
├── .github/ISSUE_TEMPLATE/
│   ├── bug_report.md          # 🐛 Bug template
│   ├── feature_request.md     # ✨ Feature template
│   └── work_item.md           # 📋 Work item template
│
└── infrastructure/terraform/
    ├── main.tf                # Main infrastructure
    ├── variables.tf           # Variables
    ├── outputs.tf             # Outputs
    └── terraform.tfvars.example  # Example config
```

---

## 📚 Documentation

### Guides
- `INFRASTRUCTURE_TEMPLATING_GUIDE.md` - Complete guide
- `infrastructure/README.md` - Infrastructure docs
- `FILE_ORGANIZATION_GUIDE.md` - Project structure
- `FLUTTER_PROJECT_SUMMARY.md` - Flutter details

### Quick Access
```bash
# View infrastructure docs
cat infrastructure/README.md

# View issue templates
ls -la .github/ISSUE_TEMPLATE/

# View all guides
ls -la *.md
```

---

## 🎉 Common Tasks

### Report a Bug
```bash
gh issue create --template bug_report.md \
  --title "[BUG] Game freezes on word submit" \
  --label "bug,critical,kawaii-shiritori"
```

### Request a Feature
```bash
gh issue create --template feature_request.md \
  --title "[FEATURE] Add voice input" \
  --label "enhancement,ui"
```

### Deploy Infrastructure
```bash
npm run infra:plan
npm run infra:apply
```

### Deploy Application
```bash
npm run build:kawaii
npm run deploy:production
npm run test:firebase
```

### Full CI/CD
```bash
npm run ci:full           # Validate, test, build
npm run deploy:production # Deploy
npm run infra:output      # Get URLs
```

---

## 🔗 Quick Links

**Firebase Console:** https://console.firebase.google.com/project/shiritori-game-ccaae

**URLs:**
- Production: `https://shiritori-game-ccaae.web.app`
- Staging: `https://shiritori-game-ccaae--develop.web.app`
- Database: `https://shiritori-game-ccaae-default-rtdb.firebaseio.com`

**GitHub:**
```bash
gh repo view --web              # Open repo
gh issue list                   # List issues
gh pr list                      # List PRs
gh run list                     # List workflows
```

---

*Quick Reference: Templates, Infrastructure, Deployment*  
*Status: ✅ Complete*
