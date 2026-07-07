# 🚀 Infrastructure Quick Start

Fix for: `zsh: command not found: terraform` and directory issues.

---

## ⚠️ Issue: Terraform/OpenTofu Not Installed

You need to install either Terraform or OpenTofu first!

---

## ✅ Quick Fix (5 minutes)

### Step 1: Install Terraform (Recommended)

```bash
# Install Terraform via Homebrew
brew install hashicorp/tap/terraform

# Verify
terraform version
```

**OR install OpenTofu (open-source alternative):**

```bash
# Install OpenTofu via Homebrew
brew install opentofu

# Verify
tofu version
```

### Step 2: Install Google Cloud SDK

```bash
# Install gcloud
brew install --cask google-cloud-sdk

# Authenticate
gcloud auth login
gcloud auth application-default login

# Set project
gcloud config set project shiritori-game-ccaae
```

### Step 3: Run Setup Script

```bash
# From project root
cd ~/Documents/Github/shiritori_game

# Run interactive setup
npm run infra:setup

# Or manual
bash infra/setup.sh
```

The script will:
1. ✅ Check if Terraform/OpenTofu is installed
2. ✅ Select environment (dev/staging/production)
3. ✅ Copy example configuration
4. ✅ Initialize and validate
5. ✅ Optionally apply changes

---

## 🎯 Or Use npm Scripts

### After Installing Terraform

```bash
# Development environment
npm run infra:dev

# Staging environment
npm run infra:staging

# Production environment
npm run infra:production
```

### Or Direct Commands

```bash
# Navigate to dev environment
cd infra/terraform/environments/dev

# Copy config
cp dev.tfvars.example dev.tfvars

# Edit config (set your project ID)
nano dev.tfvars

# Initialize
terraform init

# Validate
terraform validate

# Plan
terraform plan -var-file=dev.tfvars

# Apply
terraform apply -var-file=dev.tfvars
```

---

## 📁 Fixed Directory Structure

The correct paths are now:

```
infra/                           # ← Use this (short path)
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── environments/
│       ├── dev/
│       │   └── dev.tfvars.example
│       ├── staging/
│       │   └── staging.tfvars.example
│       └── production/
│           └── production.tfvars.example
├── setup.sh                     # Interactive setup
├── INSTALL_TERRAFORM.md         # Installation guide
└── QUICKSTART.md               # This file
```

**Note:** Both `infra/` and `infrastructure/` exist for compatibility. Use `infra/` (shorter).

---

## 🔧 Your Commands Fixed

### What You Tried (didn't work):

```bash
cd infra/terraform/environments/dev && terraform init && terraform validate
# ❌ Error: terraform not found
```

### What To Do Now:

```bash
# 1. Install Terraform
brew install hashicorp/tap/terraform

# 2. Use the fixed path
cd infra/terraform/environments/dev

# 3. Copy config
cp dev.tfvars.example dev.tfvars

# 4. Edit config
nano dev.tfvars

# 5. Initialize
terraform init

# 6. Validate
terraform validate

# ✅ Success!
```

### Or Use npm Script:

```bash
# After installing Terraform
npm run infra:dev
```

---

## 🎨 Environment Configs

### Development (dev.tfvars.example)
- Smaller resources (500m CPU, 256Mi RAM)
- No monitoring/alerts
- Allow destroy
- Budget: $10/month

### Staging (staging.tfvars.example)
- Medium resources (1000m CPU, 512Mi RAM)
- Basic monitoring
- Budget: $25/month

### Production (production.tfvars.example)
- Full resources (2000m CPU, 1Gi RAM)
- All monitoring enabled
- Keep-alive instance
- Budget: $50/month

---

## 💡 Quick Commands

```bash
# Setup (interactive)
npm run infra:setup

# Development
npm run infra:dev

# Staging  
npm run infra:staging

# Production
npm run infra:production

# View outputs
npm run infra:output

# Destroy (careful!)
npm run infra:destroy
```

---

## 🐛 Troubleshooting

### "command not found: terraform"

**Solution:** Install Terraform first!

```bash
brew install hashicorp/tap/terraform
terraform version
```

### "command not found: tofu"

**Solution:** Install OpenTofu!

```bash
brew install opentofu
tofu version
```

### "no such file or directory"

**Solution:** Use correct path:

```bash
cd infra/terraform/environments/dev    # ✅ Correct
# NOT: cd infrastructure/terraform/...  # ❌ Old path
```

### "Access denied"

**Solution:** Authenticate with Google Cloud:

```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project shiritori-game-ccaae
```

### "Backend configuration required"

**Solution:** Initialize first:

```bash
terraform init
```

---

## ✅ Complete Setup Example

```bash
# 1. Install tools
brew install hashicorp/tap/terraform
brew install --cask google-cloud-sdk

# 2. Authenticate
gcloud auth login
gcloud auth application-default login
gcloud config set project shiritori-game-ccaae

# 3. Navigate to project
cd ~/Documents/Github/shiritori_game

# 4. Run setup
npm run infra:setup

# 5. Select "1" for dev environment

# 6. Edit dev.tfvars when prompted

# 7. Follow prompts to apply

# ✅ Done!
```

---

## 🎉 You're Ready!

After installation:

```bash
# Quick start
npm run infra:setup

# Or manual
cd infra/terraform/environments/dev
cp dev.tfvars.example dev.tfvars
nano dev.tfvars
terraform init
terraform validate
terraform plan -var-file=dev.tfvars
terraform apply -var-file=dev.tfvars
```

---

## 📚 More Help

- **Installation:** See `INSTALL_TERRAFORM.md`
- **Full docs:** See `infrastructure/README.md`
- **Templates:** See `INFRASTRUCTURE_TEMPLATING_GUIDE.md`

---

**The fix:** Install Terraform first, then use `infra/` directory!

```bash
brew install hashicorp/tap/terraform
npm run infra:setup
```

✅ **That's it!**
