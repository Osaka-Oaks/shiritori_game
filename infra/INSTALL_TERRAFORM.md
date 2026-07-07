# 🔧 Installing Terraform & OpenTofu

Quick installation guide for Terraform and OpenTofu on macOS.

---

## ✅ Option 1: Install Terraform (HashiCorp)

### Using Homebrew (Recommended)

```bash
# Install Terraform
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Verify installation
terraform version
```

### Manual Installation

```bash
# Download from official site
# https://www.terraform.io/downloads

# Or use tfenv for version management
brew install tfenv
tfenv install latest
tfenv use latest
```

### Verify

```bash
terraform --version
# Should show: Terraform v1.x.x
```

---

## ✅ Option 2: Install OpenTofu (Open Source)

### Using Homebrew (Recommended)

```bash
# Install OpenTofu
brew install opentofu

# Verify installation
tofu version
```

### Manual Installation

```bash
# Download from GitHub
# https://github.com/opentofu/opentofu/releases

# Extract and move to PATH
wget https://github.com/opentofu/opentofu/releases/download/v1.6.0/tofu_1.6.0_darwin_amd64.zip
unzip tofu_1.6.0_darwin_amd64.zip
sudo mv tofu /usr/local/bin/
```

### Verify

```bash
tofu --version
# Should show: OpenTofu v1.x.x
```

---

## 🎯 Which Should You Install?

### Terraform (HashiCorp)
**Pros:**
- ✅ Original, well-established
- ✅ Large community
- ✅ Extensive documentation
- ✅ Enterprise support

**Cons:**
- ❌ Proprietary license (BSL 1.1)
- ❌ Some restrictions on commercial use

### OpenTofu (Linux Foundation)
**Pros:**
- ✅ Open-source (MPL 2.0)
- ✅ No licensing restrictions
- ✅ Community-driven
- ✅ Compatible with Terraform

**Cons:**
- ❌ Newer project (fork of Terraform 1.5)
- ❌ Smaller community (growing)

### Recommendation

**For this project:** Either works! Both are compatible with our configuration.

```bash
# Install Terraform (most common)
brew install hashicorp/tap/terraform

# OR install OpenTofu (open-source)
brew install opentofu

# Both work with the same files!
```

---

## 🚀 Quick Setup

### After Installing Terraform

```bash
# Navigate to dev environment
cd infra/terraform/environments/dev

# Copy example config
cp dev.tfvars.example dev.tfvars

# Edit with your project ID
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

### After Installing OpenTofu

```bash
# Same commands, just use 'tofu' instead of 'terraform'
cd infra/terraform/environments/dev
cp dev.tfvars.example dev.tfvars
nano dev.tfvars

tofu init
tofu validate
tofu plan -var-file=dev.tfvars
tofu apply -var-file=dev.tfvars
```

---

## 🔄 Switch Between Them

You can install both and use either:

```bash
# Use Terraform
terraform init
terraform plan

# Use OpenTofu (same state!)
tofu init
tofu plan

# They're compatible!
```

---

## 📦 Install Google Cloud SDK

Also install gcloud CLI for authentication:

```bash
# Install gcloud
brew install --cask google-cloud-sdk

# Initialize
gcloud init

# Authenticate
gcloud auth login
gcloud auth application-default login

# Set project
gcloud config set project shiritori-game-ccaae
```

---

## ✅ Verify Everything

```bash
# Check Terraform/OpenTofu
terraform version
tofu version

# Check gcloud
gcloud version

# Check authentication
gcloud auth list

# Test access
gcloud projects list
```

---

## 🎉 You're Ready!

Once installed, run:

```bash
cd infra/terraform/environments/dev
cp dev.tfvars.example dev.tfvars
terraform init && terraform validate
```

Or with OpenTofu:

```bash
cd infra/terraform/environments/dev
cp dev.tfvars.example dev.tfvars
tofu init && tofu validate
```

---

**Quick Install:**
```bash
# Terraform
brew install hashicorp/tap/terraform

# OpenTofu
brew install opentofu

# Google Cloud SDK
brew install --cask google-cloud-sdk
```

---

*Last updated: July 2026*  
*Status: ✅ Ready to Install*
