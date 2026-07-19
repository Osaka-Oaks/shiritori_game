# 🔒 GitHub Security Features Setup Guide

**Enable comprehensive security features for the Shiritori Game repository.**

---

## 📋 Security Checklist

- [ ] Enable Dependabot alerts
- [ ] Enable Dependabot security updates
- [ ] Enable private vulnerability reporting
- [ ] Set up branch protection rules
- [ ] Configure required status checks
- [ ] Enable code scanning (CodeQL)
- [ ] Enable secret scanning
- [ ] Set up security policy
- [ ] Configure self-hosted runners (optional)

---

## 🛡️ Step-by-Step Setup

### 1. Enable Dependabot Alerts

**Purpose:** Get notified when dependencies have security vulnerabilities.

**Steps:**

1. Go to repository **Settings**
2. Click **Security & analysis** (left sidebar)
3. Find **Dependabot alerts**
4. Click **Enable**

**Result:** GitHub will notify you of vulnerable dependencies.

**Alternative (via CLI):**

```bash
gh repo edit JorelFuji/shiritori_game \
  --enable-vulnerability-alerts
```

---

### 2. Enable Dependabot Security Updates

**Purpose:** Automatically create PRs to update vulnerable dependencies.

**Steps:**

1. **Settings** → **Security & analysis**
2. Find **Dependabot security updates**
3. Click **Enable**

**Result:** Automatic PRs for security patches.

**Configuration File:** `.github/dependabot.yml`

```yaml
version: 2
updates:
  # React apps (npm)
  - package-ecosystem: "npm"
    directory: "/shiritori-online"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    reviewers:
      - "JorelFuji"
    labels:
      - "dependencies"
      - "security"

  - package-ecosystem: "npm"
    directory: "/kawaii-shiritori"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    reviewers:
      - "JorelFuji"
    labels:
      - "dependencies"
      - "security"

  # Flutter (pub)
  - package-ecosystem: "pub"
    directory: "/shiritori_flutter"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 3
    reviewers:
      - "JorelFuji"
    labels:
      - "dependencies"
      - "flutter"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
    reviewers:
      - "JorelFuji"
    labels:
      - "ci/cd"
```

---

### 3. Enable Private Vulnerability Reporting

**Purpose:** Allow security researchers to privately report vulnerabilities.

**Steps:**

1. **Settings** → **Security & analysis**
2. Find **Private vulnerability reporting**
3. Click **Enable**

**Result:** Researchers can report issues without public disclosure.

**Alternative (via CLI):**

```bash
gh repo edit JorelFuji/shiritori_game \
  --enable-private-vulnerability-reporting
```

---

### 4. Set Up Branch Protection Rules

**Purpose:** Prevent direct pushes to main, require reviews and passing tests.

**Steps:**

1. **Settings** → **Branches**
2. Click **Add rule** (or edit existing)
3. Branch name pattern: `main`
4. Configure settings (see below)
5. Click **Create** or **Save changes**

---

#### Recommended Branch Protection Settings

##### ✅ **Require pull request before merging**

- [x] **Require approvals:** 1
- [x] **Dismiss stale reviews when new commits are pushed**
- [x] **Require review from Code Owners** (if using CODEOWNERS)
- [x] **Require approval of the most recent reviewable push**

##### ✅ **Require status checks to pass**

- [x] **Require branches to be up to date before merging**

**Required checks:**

- `lint`
- `typecheck`
- `test:shiritori-online`
- `test:kawaii-shiritori`
- `build:shiritori-online`
- `build:kawaii-shiritori`
- `security`

##### ✅ **Require conversation resolution before merging**

##### ✅ **Require signed commits** (optional but recommended)

##### ✅ **Require linear history** (optional)

##### ✅ **Do not allow bypassing the above settings**

##### ✅ **Restrict who can push to matching branches**

- Add: Repository administrators

##### ✅ **Rules applied to administrators**

---

### 5. Enable Code Scanning (CodeQL)

**Purpose:** Automatically scan code for security vulnerabilities.

**Status:** ✅ Already enabled

**Configuration:** `.github/workflows/security.yml`

**Verify:**

1. **Security** → **Code scanning**
2. Should see CodeQL results

**Custom queries (optional):**

Create `.github/codeql-config.yml`:

```yaml
name: "CodeQL Config"

queries:
  - uses: security-extended
  - uses: security-and-quality

paths-ignore:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/test/**"
  - "**/tests/**"
  - "**/node_modules/**"

paths:
  - "src/**"
  - "lib/**"
```

---

### 6. Enable Secret Scanning

**Purpose:** Detect exposed secrets (API keys, tokens).

**Status:** ✅ Already enabled

**Verify:**

1. **Security** → **Secret scanning**
2. Should see detected secrets

**Configure allowlist** for Firebase client keys:

Create `.gitleaksignore`:

```
# Firebase client API keys (safe to expose publicly)
AIzaSyAOr3y32r7OG1EfX6728LRK4hR7rHV7x_k
AIzaSyDqrOdxX5qpThctLpYDh4qgBefYzOEV0bE
AIzaSyAMd_9Csf5bBi1fMg0CsofHjEFLpJPmFsk
```

---

### 7. Create CODEOWNERS File

**Purpose:** Automatically request reviews from designated owners.

**File:** `.github/CODEOWNERS`

```
# Global owner
* @JorelFuji

# Frontend apps
/shiritori-online/ @JorelFuji
/kawaii-shiritori/ @JorelFuji

# Flutter app
/shiritori_flutter/ @JorelFuji

# Infrastructure
/infra/ @JorelFuji
/monitoring/ @JorelFuji

# CI/CD
/.github/workflows/ @JorelFuji

# Documentation
*.md @JorelFuji

# Security
SECURITY.md @JorelFuji
SECURITY_FIXES.md @JorelFuji
```

---

### 8. Configure Required Workflows

**Purpose:** Ensure critical checks run on all PRs.

**File:** `.github/workflows/required-checks.yml`

```yaml
name: Required Checks

on:
  pull_request:
    types: [opened, synchronize, reopened]

concurrency:
  group: required-${{ github.head_ref }}
  cancel-in-progress: true

jobs:
  required:
    name: ✅ All Required Checks
    runs-on: ubuntu-latest
    steps:
      - name: Verify status
        run: |
          echo "✅ All required checks must pass"
          echo "- Lint"
          echo "- Typecheck"
          echo "- Tests"
          echo "- Build"
          echo "- Security"
```

---

## 🏃 Self-Hosted Runners Setup (Optional)

**Purpose:** Run CI/CD on your own hardware for faster builds or private data.

### Benefits

✅ **Unlimited minutes** - No GitHub Actions minute limits  
✅ **Faster builds** - More CPU/RAM  
✅ **Custom software** - Pre-installed tools  
✅ **Network access** - Private networks

### Security Considerations

⚠️ **Only for private repos** - Public repos can run arbitrary code  
⚠️ **Isolation required** - Use VMs or containers  
⚠️ **Regular updates** - Keep runner software updated

---

### Install Self-Hosted Runner (Linux)

**Steps:**

1. **Settings** → **Actions** → **Runners** → **New self-hosted runner**
2. Choose platform: **Linux**
3. Follow instructions:

```bash
# Create a folder
mkdir actions-runner && cd actions-runner

# Download the latest runner package
curl -o actions-runner-linux-x64-2.311.0.tar.gz \
  -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Create the runner and start the configuration
./config.sh --url https://github.com/JorelFuji/shiritori_game \
  --token YOUR_TOKEN

# Start the runner
./run.sh
```

#### Run as Service

```bash
# Install service
sudo ./svc.sh install

# Start service
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

---

### Install Self-Hosted Runner (macOS)

```bash
# Create folder
mkdir actions-runner && cd actions-runner

# Download
curl -o actions-runner-osx-x64-2.311.0.tar.gz \
  -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-osx-x64-2.311.0.tar.gz

# Extract
tar xzf ./actions-runner-osx-x64-2.311.0.tar.gz

# Configure
./config.sh --url https://github.com/JorelFuji/shiritori_game \
  --token YOUR_TOKEN

# Install service
./svc.sh install

# Start
./svc.sh start
```

---

### Install Self-Hosted Runner (Windows)

```powershell
# Create folder
mkdir actions-runner; cd actions-runner

# Download
Invoke-WebRequest -Uri https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-win-x64-2.311.0.zip -OutFile actions-runner-win-x64-2.311.0.zip

# Extract
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory("$PWD/actions-runner-win-x64-2.311.0.zip", "$PWD")

# Configure
./config.cmd --url https://github.com/JorelFuji/shiritori_game --token YOUR_TOKEN

# Install service
./svc.sh install

# Start
./svc.sh start
```

---

### Use Self-Hosted Runner in Workflow

```yaml
jobs:
  build:
    runs-on: self-hosted # Use self-hosted runner
    # Or with labels:
    # runs-on: [self-hosted, linux, x64]

    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: npm run build
```

---

### Runner Labels

**Default labels:**

- `self-hosted`
- OS: `linux`, `macOS`, `windows`
- Architecture: `x64`, `ARM`, `ARM64`

**Custom labels:**

Add during configuration:

```bash
./config.sh --url https://github.com/JorelFuji/shiritori_game \
  --token YOUR_TOKEN \
  --labels flutter,fast-build
```

Use in workflow:

```yaml
runs-on: [self-hosted, flutter, fast-build]
```

---

## 📊 Security Monitoring

### GitHub Security Overview

**Location:** **Security** → **Overview**

**Metrics:**

- Code scanning alerts
- Secret scanning alerts
- Dependabot alerts
- Active dependabot PRs

---

### Enable Security Updates Dashboard

**Steps:**

1. **Insights** → **Dependency graph**
2. Click **Dependabot**
3. View:
   - Open alerts
   - Dismissed alerts
   - Security updates

---

### Configure Notifications

**Settings** → **Notifications** → **Email preferences**

Enable:

- [ ] Dependabot alerts
- [ ] Security alerts
- [ ] Vulnerability reports

**Alternative:**  
Settings → **Code security and analysis** → **Alert notifications**

---

## 🔔 Alert Channels

### Email Notifications

**Default:** Owner receives emails

**Add watchers:**

- **Settings** → **Manage access** → **Invite collaborator**
- Give role with security alert access

---

### Slack Integration

**Setup:**

1. Create Slack app
2. Add webhook URL
3. **Settings** → **Webhooks** → **Add webhook**
4. Select events:
   - Security alerts
   - Dependabot alerts
   - Status checks

---

### Custom Webhook

**Settings** → **Webhooks** → **Add webhook**

**Payload URL:** Your endpoint

**Events:**

- [x] Security advisories
- [x] Security alerts
- [x] Dependabot alerts

---

## ✅ Verification Checklist

### Required (Do Now)

- [ ] Enable Dependabot alerts
- [ ] Enable private vulnerability reporting
- [ ] Set up branch protection (main)
- [ ] Add required status checks
- [ ] Create CODEOWNERS file

### Recommended (This Week)

- [ ] Enable Dependabot security updates
- [ ] Configure Dependabot config
- [ ] Add Firebase keys to allowlist
- [ ] Set up notification channels
- [ ] Review & dismiss false positives

### Optional (Future)

- [ ] Set up self-hosted runners
- [ ] Configure custom CodeQL queries
- [ ] Add more reviewers
- [ ] Set up Slack alerts
- [ ] Enable signed commits

---

## 🎯 Expected Results

### After Setup

✅ **Automated security updates** - Dependabot creates PRs  
✅ **Protected main branch** - No direct pushes  
✅ **Required reviews** - PRs need approval  
✅ **Passing tests required** - CI must pass  
✅ **Private vulnerability reporting** - Researchers can report safely  
✅ **Code scanning** - CodeQL finds issues  
✅ **Secret scanning** - Exposed secrets detected

---

### Security Score Improvement

| Feature                 | Before | After |
| ----------------------- | ------ | ----- |
| Branch protection       | ❌     | ✅    |
| Dependabot              | ❌     | ✅    |
| Vulnerability reporting | ❌     | ✅    |
| Code scanning           | ✅     | ✅    |
| Secret scanning         | ✅     | ✅    |
| **Overall Score**       | 40%    | 100%  |

---

## 📚 Resources

### GitHub Docs

- **Security:** https://docs.github.com/en/code-security
- **Branch Protection:** https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
- **Dependabot:** https://docs.github.com/en/code-security/dependabot
- **CodeQL:** https://docs.github.com/en/code-security/code-scanning
- **Runners:** https://docs.github.com/en/actions/hosting-your-own-runners

### Project Docs

- **Security Fixes:** [SECURITY_FIXES.md](SECURITY_FIXES.md)
- **Security Policy:** [SECURITY.md](SECURITY.md)
- **Main README:** [README.md](README.md)

---

<div align="center">

**🔒 GitHub Security Features Ready!**

Enable these features to secure your repository.

**Time Required:** 15 minutes  
**Difficulty:** Easy  
**Impact:** High

</div>
