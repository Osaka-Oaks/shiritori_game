# 🦊 GitLab CI/CD Setup Guide

**Complete guide for running Shiritori Game on GitLab with CI/CD pipelines.**

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Quick Setup](#-quick-setup)
- [GitLab CI/CD Configuration](#-gitlab-cicd-configuration)
- [Pipeline Stages](#-pipeline-stages)
- [Environment Variables](#-environment-variables)
- [Runners](#-runners)
- [Deployment](#-deployment)
- [Monitoring](#-monitoring)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Prerequisites

### Required

- GitLab account (gitlab.com or self-hosted)
- Firebase project (`shiritori-game-ccaae`)
- Node.js 24+
- Flutter SDK 3.44+

### Optional

- GitLab Runner (for self-hosted)
- Docker (for custom runners)

---

## ⚡ Quick Setup

### 1. Import Repository to GitLab

```bash
# Create new GitLab project
# Settings → Repository → Mirroring repositories

# Add GitHub as mirror source
Repository URL: https://github.com/JorelFuji/shiritori_game.git
Mirror direction: Pull
Authentication: Personal access token
```

### 2. Add Required CI/CD Variables

**Settings → CI/CD → Variables**

| Variable              | Value                      | Protected | Masked |
| --------------------- | -------------------------- | --------- | ------ |
| `FIREBASE_TOKEN`      | (from `firebase login:ci`) | ✅        | ✅     |
| `FIREBASE_PROJECT_ID` | shiritori-game-ccaae       | ✅        | ❌     |
| `NODE_VERSION`        | 24                         | ❌        | ❌     |
| `FLUTTER_VERSION`     | 3.44.4                     | ❌        | ❌     |

**Get Firebase token:**

```bash
firebase login:ci
# Copy the token and add to GitLab variables
```

### 3. Enable GitLab CI/CD

```bash
# .gitlab-ci.yml is already in the repository
# Push to trigger first pipeline
git push gitlab main
```

---

## 🔧 GitLab CI/CD Configuration

### Pipeline File

**File:** `.gitlab-ci.yml`

### Stages

```yaml
stages:
  - validate # Lint, format, typecheck
  - test # Unit tests, coverage
  - build # Build apps
  - deploy # Deploy to Firebase
  - verify # Health checks
```

### Key Features

✅ **Multi-app support** - Separate jobs for each app  
✅ **Smart caching** - npm + Flutter caches  
✅ **Coverage reports** - Integrated with GitLab  
✅ **Manual deployment** - Production requires approval  
✅ **Health verification** - Post-deploy checks  
✅ **Build tracking** - Performance metrics

---

## 📊 Pipeline Stages

### Stage 1: Validate

**Jobs:**

- `lint` - ESLint + Prettier
- `typecheck` - TypeScript validation
- `security` - Security audit

**Duration:** ~2 minutes

```bash
# Runs on: merge requests, main, develop
npm run lint
npm run format:check
npm run validate:json
```

---

### Stage 2: Test

**Jobs:**

- `test:shiritori-online` - React app tests
- `test:kawaii-shiritori` - Kawaii app tests

**Duration:** ~3 minutes

**Features:**

- Coverage reports
- Cobertura format
- GitLab integration

```bash
npm test -- --coverage
```

**View coverage:**  
Settings → CI/CD → Pipelines → Coverage

---

### Stage 3: Build

**Jobs:**

- `build:shiritori-online` - React build
- `build:kawaii-shiritori` - Kawaii build
- `build:flutter` - Flutter web build
- `build:track` - Build metrics

**Duration:** ~5 minutes

**Artifacts:**

- `shiritori-online/dist` (7 days)
- `kawaii-shiritori/dist` (7 days)
- `shiritori_flutter/build/web` (7 days)

```bash
npm run build
npm run build:kawaii
flutter build web --release
```

---

### Stage 4: Deploy

**Jobs:**

- `deploy:production` - Deploy to production (manual)
- `deploy:flutter` - Deploy Flutter app (manual)
- `deploy:staging` - Deploy to staging (auto on develop)

**Duration:** ~2 minutes

**Environments:**

- **Production:** https://shiritori-game-ccaae.web.app
- **Flutter:** https://shiritori-flutter.web.app
- **Staging:** https://shiritori-game-ccaae--develop.web.app

```bash
firebase deploy --only hosting --project shiritori-game-ccaae
```

---

### Stage 5: Verify

**Jobs:**

- `verify:production` - HTTP 200 check
- `verify:flutter` - Flutter site check
- `monitor:health` - Scheduled health check
- `analyze:lighthouse` - Performance analysis (manual)

**Duration:** ~30 seconds

```bash
curl -f https://shiritori-game-ccaae.web.app/
```

---

## 🔑 Environment Variables

### Required Variables

Add in **Settings → CI/CD → Variables**

#### FIREBASE_TOKEN

**Description:** Firebase deployment token

**Get it:**

```bash
firebase login:ci
```

**Settings:**

- ✅ Protected
- ✅ Masked
- ✅ Expand variable reference

---

#### FIREBASE_PROJECT_ID

**Description:** Firebase project ID

**Value:** `shiritori-game-ccaae`

**Settings:**

- ✅ Protected
- ❌ Masked

---

### Optional Variables

#### NODE_VERSION

**Default:** `24`  
**Description:** Node.js version for builds

---

#### FLUTTER_VERSION

**Default:** `3.44.4`  
**Description:** Flutter SDK version

---

## 🏃 Runners

### Shared Runners (gitlab.com)

**Default setup** - No configuration needed.

**Features:**

- 400 CI/CD minutes/month (free tier)
- 2,000 minutes/month (Premium)
- Unlimited (Ultimate)

**Enable:**  
Settings → CI/CD → Runners → Enable shared runners

---

### Specific Runners (Self-hosted)

**For unlimited minutes or private infra.**

#### Install Runner (Linux)

```bash
# Download
curl -LJO "https://gitlab-runner-downloads.s3.amazonaws.com/latest/deb/gitlab-runner_amd64.deb"

# Install
sudo dpkg -i gitlab-runner_amd64.deb

# Register
sudo gitlab-runner register
# URL: https://gitlab.com/
# Token: (from Settings → CI/CD → Runners)
# Executor: docker
# Default image: node:24
```

#### Install Runner (macOS)

```bash
# Install
brew install gitlab-runner

# Start service
brew services start gitlab-runner

# Register
gitlab-runner register
```

#### Install Runner (Docker)

```bash
docker run -d --name gitlab-runner --restart always \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest

docker exec -it gitlab-runner gitlab-runner register
```

---

### Runner Tags

**Configure tags for specific jobs:**

```yaml
build:flutter:
  tags:
    - flutter
    - linux
```

**Settings → CI/CD → Runners → Edit runner → Tags**

---

## 🚀 Deployment

### Production Deployment

**Trigger:** Manual (requires approval)

**Branch:** `main`

**Steps:**

1. Push to `main`
2. Pipeline runs validate → test → build
3. Go to **CI/CD → Pipelines**
4. Click **▶ deploy:production**
5. Confirm deployment
6. Wait for verification

**URL:** https://shiritori-game-ccaae.web.app

---

### Staging Deployment

**Trigger:** Automatic

**Branch:** `develop`

**Steps:**

1. Push to `develop`
2. Pipeline auto-deploys

**URL:** https://shiritori-game-ccaae--develop.web.app

---

### Flutter Deployment

**Trigger:** Manual

**Branch:** `main`

**Steps:**

1. Push to `main`
2. Pipeline builds Flutter app
3. Go to **CI/CD → Pipelines**
4. Click **▶ deploy:flutter**
5. Confirm deployment

**URL:** https://shiritori-flutter.web.app

---

## 📊 Monitoring

### Pipeline Status

**View:** CI/CD → Pipelines

**Metrics:**

- Success rate
- Average duration
- Failed jobs

---

### Coverage Reports

**View:** Settings → CI/CD → General pipelines

**Enable:**

```yaml
coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
```

**View reports:**  
Merge requests → Changes → Coverage

---

### Deployment History

**View:** Deployments → Environments

**Features:**

- Environment URL
- Deployment status
- Rollback option

---

### Scheduled Pipelines

**Setup:** CI/CD → Schedules → New schedule

**Example:**

```
Name: Nightly health check
Interval: 0 2 * * * (daily at 2 AM)
Target: main
Variables: SCHEDULE_TYPE=health
```

---

## 🐛 Troubleshooting

### Pipeline Fails at Validation

**Error:**

```
npm ERR! Lifecycle script `lint` failed
```

**Fix:**

```bash
# Run locally first
npm run lint
npm run format

# Fix issues
npm run lint:fix
npm run format

# Commit fixes
git add .
git commit -m "fix: lint errors"
git push
```

---

### Build Artifacts Not Found

**Error:**

```
ERROR: Job `deploy:production` failed: artifact not found
```

**Fix:**
Check `dependencies:` in deploy job:

```yaml
deploy:production:
  dependencies:
    - build:shiritori-online # Must match build job name
```

---

### Firebase Deployment Fails

**Error:**

```
Error: FIREBASE_TOKEN not set
```

**Fix:**

1. Generate token: `firebase login:ci`
2. Add to GitLab: Settings → CI/CD → Variables
3. Name: `FIREBASE_TOKEN`
4. Value: (paste token)
5. ✅ Protected
6. ✅ Masked

---

### Runner Out of Disk Space

**Error:**

```
ERROR: Job failed: exit code 1
No space left on device
```

**Fix:**

```bash
# SSH into runner
docker exec -it gitlab-runner bash

# Clean Docker
docker system prune -af

# Clean cache
rm -rf /cache/*
```

---

### Coverage Not Showing

**Fix:**

```yaml
test:
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

Settings → CI/CD → General pipelines → Test coverage parsing: (leave regex)

---

## 📚 Additional Resources

### GitLab Docs

- **CI/CD:** https://docs.gitlab.com/ee/ci/
- **Runners:** https://docs.gitlab.com/runner/
- **Variables:** https://docs.gitlab.com/ee/ci/variables/
- **Environments:** https://docs.gitlab.com/ee/ci/environments/

### Project Docs

- **Main README:** [README.md](README.md)
- **Security:** [SECURITY_FIXES.md](SECURITY_FIXES.md)
- **GitHub CI/CD:** [.github/workflows/](. github/workflows/)
- **Documentation Index:** [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

---

## 🎯 Best Practices

### 1. Use Job Templates

```yaml
.node_job:
  image: node:24
  before_script:
    - npm ci
  cache:
    key: npm-cache
    paths:
      - .npm

lint:
  extends: .node_job
  script:
    - npm run lint
```

### 2. Parallelize Tests

```yaml
test:
  parallel: 4
  script:
    - npm test -- --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
```

### 3. Use Artifacts Wisely

```yaml
artifacts:
  paths:
    - dist/
  expire_in: 7 days # Don't keep forever
```

### 4. Manual Gates for Production

```yaml
deploy:production:
  when: manual
  only:
    - main
```

### 5. Health Checks After Deploy

```yaml
verify:
  script:
    - curl -f https://your-site.web.app/
```

---

<div align="center">

**🦊 GitLab CI/CD Ready!**

Push to `main` or `develop` to trigger your first pipeline.

**Pipeline URL:** https://gitlab.com/your-username/shiritori_game/-/pipelines

</div>
