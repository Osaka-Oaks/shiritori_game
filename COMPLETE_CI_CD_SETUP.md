# 🚀 Complete CI/CD Setup - Security, Path-Based Deployment & Branching

Complete guide to your production-ready CI/CD pipeline with security scanning, smart deployment, and branching strategy.

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SHIRITORI CI/CD SYSTEM                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔒 Security Layer                                          │
│  ├─ Gitleaks (Secret scanning)                             │
│  ├─ CodeQL (Code analysis)                                 │
│  ├─ npm audit (Dependency vulnerabilities)                 │
│  ├─ Dependency Review (PR checks)                          │
│  └─ Firebase Rules Validation                              │
│                                                             │
│  📋 Code Quality Layer                                      │
│  ├─ JSON Validation (Syntax checks)                        │
│  ├─ Prettier (Format checking)                             │
│  ├─ ESLint (Code linting)                                  │
│  ├─ TypeScript (Type checking)                             │
│  └─ Vitest (Unit tests)                                    │
│                                                             │
│  🚀 Deployment Layer (Path-based)                          │
│  ├─ shiritori-online/** → Hosting + RTDB rules            │
│  ├─ kawaii-shiritori/firestore.rules → Firestore rules    │
│  └─ .github/workflows/** → Full redeploy                  │
│                                                             │
│  🌿 Branching Strategy                                     │
│  ├─ main → Production                                      │
│  ├─ develop → Staging/Preview                             │
│  ├─ feature/* → Validation only                           │
│  └─ fix/* → Validation only                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔒 Security Scanning

### Active Security Workflows

| Scan Type             | Tool      | Frequency          | Blocking          |
| --------------------- | --------- | ------------------ | ----------------- |
| **Secret Detection**  | Gitleaks  | Every push, weekly | ✅ Yes            |
| **Code Analysis**     | CodeQL    | Every push, weekly | ✅ Yes            |
| **Dependency Audit**  | npm audit | Every push, weekly | ✅ Critical only  |
| **Dependency Review** | GitHub    | PRs only           | ✅ High+ severity |
| **Rules Validation**  | Custom    | Every push         | ✅ Yes            |
| **JSON Validation**   | Python    | Every push         | ✅ Yes            |

### Security Workflow Files

**`.github/workflows/security.yml`** - Comprehensive security scanning

- CodeQL analysis for JavaScript/TypeScript
- npm audit for both apps (critical vulnerabilities block)
- Gitleaks secret scanning
- Dependency review on PRs
- Firebase rules validation

**`scripts/security-check.sh`** - Local security validation

- Blocks committed `.env` files
- Validates Firebase rules JSON
- Checks for hardcoded API keys
- Runs npm audit (production deps)

### How Security Works in Pipeline

```
Push to GitHub
      │
      ▼
┌─────────────┐
│  Security   │ ◄── Runs in parallel
│   Checks    │     with other jobs
└──────┬──────┘
       │
       ├─ Gitleaks (secrets)
       ├─ CodeQL (code)
       ├─ npm audit (deps)
       └─ Rules validation
       │
       ▼
   All Pass?
       │
       ├─ ✅ Yes → Continue to build
       └─ ❌ No  → Stop pipeline, notify

```

---

## 🎯 Path-Based Deployment

### Why Path-Based?

**Efficiency:**

- Deploy only what changed
- Faster deployment times
- Reduced Firebase quota usage
- Less risk of unintended changes

**Safety:**

- Documentation changes don't trigger deploys
- Test changes don't affect production
- Clear separation of concerns

### Path Detection Logic

**File:** `.github/workflows/ci.yml` (changes job)

```yaml
changes:
  name: Detect path changes
  outputs:
    online: ${{ steps.filter.outputs.online }}
    kawaii-rules: ${{ steps.filter.outputs.kawaii-rules }}
    ci-config: ${{ steps.filter.outputs.ci-config }}
  steps:
    - uses: dorny/paths-filter@v3
      with:
        filters: |
          online:
            - 'shiritori-online/**'
          kawaii-rules:
            - 'kawaii-shiritori/firestore.rules'
            - 'kawaii-shiritori/firestore.indexes.json'
          ci-config:
            - '.github/workflows/**'
```

### Deployment Matrix

| Changed Paths                          | What Gets Deployed       | Example Use Case      |
| -------------------------------------- | ------------------------ | --------------------- |
| `shiritori-online/src/**`              | Hosting + RTDB rules     | New game features     |
| `shiritori-online/database.rules.json` | RTDB rules only          | Security updates      |
| `kawaii-shiritori/firestore.rules`     | Firestore rules only     | Data model changes    |
| `kawaii-shiritori/src/**`              | Nothing (hosting manual) | App development       |
| `README.md`, `docs/**`                 | Nothing                  | Documentation updates |
| `.github/workflows/**`                 | Full redeploy            | CI/CD changes         |

### Conditional Deployment

**Shiritori Online Deploy (main branch):**

```yaml
deploy-online:
  name: Deploy shiritori-online
  needs: [changes, build-online]
  if: |
    github.ref == 'refs/heads/main' && 
    needs.changes.outputs.online == 'true'
  steps:
    - run: firebase deploy --only hosting,database
```

**Firestore Rules Deploy (main branch):**

```yaml
deploy-firestore-rules:
  name: Deploy Firestore rules
  needs: [changes]
  if: |
    github.ref == 'refs/heads/main' && 
    needs.changes.outputs.kawaii-rules == 'true'
  steps:
    - run: firebase deploy --only firestore
```

---

## 🌿 Branching Strategy

### Branch Model

```
main (production)
  ↑
  │ PR (production deploy)
  │
develop (staging)
  ↑
  │ PR (preview channel)
  │
feature/awesome-feature ──┐
feature/cool-game    ──────┤ PR (validation only)
fix/critical-bug     ──────┘
```

### Branch Rules

| Branch      | Protection   | Required Checks        | Deploy Target       |
| ----------- | ------------ | ---------------------- | ------------------- |
| `main`      | ✅ Protected | All checks must pass   | **Production**      |
| `develop`   | ✅ Protected | All checks must pass   | **Preview channel** |
| `feature/*` | ⚠️ Optional  | All checks recommended | None                |
| `fix/*`     | ⚠️ Optional  | All checks recommended | None                |

### Workflow Examples

#### Feature Development

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/floating-dictionary

# 2. Make changes
# ... code code code ...

# 3. Commit and push
git add .
git commit -m "feat: add floating dictionary widget"
git push origin feature/floating-dictionary

# 4. Open PR to develop
# GitHub → New Pull Request
# base: develop ← compare: feature/floating-dictionary

# 5. CI runs validation (no deploy)
# - Security checks
# - JSON validation
# - Linting
# - Type checking
# - Tests
# - Build

# 6. Merge to develop
# CI runs again + deploys to preview channel

# 7. Test on preview URL (14-day expiry)
# https://shiritori-game-ccaae--develop.web.app

# 8. When ready, PR develop → main
# GitHub → New Pull Request
# base: main ← compare: develop

# 9. Merge to main → Production deploy!
```

#### Hotfix

```bash
# 1. Create fix branch from main
git checkout main
git pull origin main
git checkout -b fix/critical-security-issue

# 2. Fix the bug
# ... fix fix fix ...

# 3. Commit and push
git add .
git commit -m "fix: patch security vulnerability"
git push origin fix/critical-security-issue

# 4. PR directly to main (urgent)
# base: main ← compare: fix/critical-security-issue

# 5. After merge, backport to develop
git checkout develop
git merge main
git push origin develop
```

---

## 📋 Pipeline Stages

### Stage 1: Path Detection (10s)

**Purpose:** Determine what changed

**Outputs:**

- `online`: true/false
- `kawaii-rules`: true/false
- `ci-config`: true/false

**Uses:** `dorny/paths-filter@v3`

---

### Stage 2: Security Scans (2-3 min)

**Runs in parallel:**

1. **Gitleaks** - Secret scanning
   - Scans entire git history
   - Blocks on leaked secrets
   - Artifacts: None

2. **Security Script** - Custom checks
   - Env file detection
   - Rules validation
   - API key patterns
   - npm audit (critical)

3. **npm Audit** - Dependency vulnerabilities
   - Runs per app (shiritori-online, kawaii-shiritori)
   - Blocks on critical production vulnerabilities
   - Artifacts: `audit-online.json`, `audit-kawaii.json`

---

### Stage 3: JSON Validation (30s)

**Validates all JSON files:**

1. **Syntax Validation** - Python json.tool
   - Checks: All `.json` files
   - Blocks on: Syntax errors
   - Artifacts: None

2. **Format Check** - Prettier
   - Checks: Formatting consistency
   - Blocks on: Unformatted files
   - Artifacts: `json-validation-report/`

---

### Stage 4: Code Quality (2 min)

**Runs in parallel per app:**

1. **Prettier** - Format checking
   - All source files
   - Blocks on format issues

2. **ESLint** - Code linting
   - TypeScript/TSX files
   - Blocks on errors (warnings OK)

3. **TypeScript** - Type checking
   - `tsc --noEmit`
   - Blocks on type errors

---

### Stage 5: Testing (1-2 min)

**kawaii-shiritori only:**

1. **Vitest** - Unit tests
   - Component tests
   - Integration tests
   - Coverage reports
   - Artifacts: `test-results-kawaii/`

---

### Stage 6: Build (2-3 min)

**Runs in parallel per app:**

1. **Vite Build** - Production bundles
   - Code splitting
   - Minification
   - Asset optimization
   - Artifacts: `dist-shiritori-online/`, `dist-kawaii-shiritori/`

---

### Stage 7: Deploy (1-2 min)

**Conditional based on paths:**

1. **Deploy shiritori-online** (if changed)
   - Firebase Hosting
   - Realtime Database rules
   - Only on `main` branch

2. **Deploy Firestore rules** (if changed)
   - Firestore rules
   - Firestore indexes
   - Only on `main` branch

3. **Deploy preview channel** (develop branch)
   - Hosting only
   - 14-day expiry URL
   - Testing environment

---

### Stage 8: Testing (1 min)

**Post-deployment validation:**

1. **Smoke Tests**
   - HTTP 200 check
   - Content verification
   - Performance metrics
   - Database connectivity

2. **Integration Tests**
   - SPA routing
   - Firebase connection
   - Critical user flows

---

## 🔧 Required Configuration

### GitHub Secrets

| Secret           | Purpose               | How to Get          |
| ---------------- | --------------------- | ------------------- |
| `FIREBASE_TOKEN` | Deploy authentication | `firebase login:ci` |
| `GITHUB_TOKEN`   | Automatic (no setup)  | Provided by GitHub  |

### GitHub Settings

**Branch Protection (main):**

- ✅ Require pull request before merging
- ✅ Require approvals: 1
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Required checks:
  - `security / Secret scan`
  - `security / CodeQL`
  - `json-validation`
  - `format`
  - `lint`
  - `test`
  - `build`

**Branch Protection (develop):**

- ✅ Require pull request before merging
- ✅ Require status checks to pass
- ⚠️ Approvals: Optional (for speed)

---

## 📊 Artifacts & Reports

### Available Artifacts (30-day retention)

| Artifact Name            | Contents               | When Created             |
| ------------------------ | ---------------------- | ------------------------ |
| `security-audit-reports` | npm audit JSON         | Every run                |
| `audit-online`           | shiritori-online audit | Every run                |
| `audit-kawaii`           | kawaii-shiritori audit | Every run                |
| `json-validation-report` | All JSON files         | Every run                |
| `test-results-kawaii`    | Test coverage          | After tests              |
| `dist-shiritori-online`  | Production build       | After build              |
| `dist-kawaii-shiritori`  | Production build       | After build              |
| `validation-report`      | Validation logs        | deploy-and-test workflow |

### Downloading Artifacts

```bash
# Via GitHub UI
1. Go to Actions → Workflow run
2. Scroll to "Artifacts" section
3. Click artifact name to download

# Via GitHub CLI
gh run download <run-id> -n security-audit-reports
```

---

## 🚨 Troubleshooting

### Security Check Fails

**Problem:** Gitleaks detects potential secret

**Solution:**

```bash
# Check what was detected
cat gitleaks-report.json

# If false positive, add to .gitleaks.toml:
[[rules]]
  description = "Allow specific pattern"
  regex = '''your-pattern-here'''
  [rules.allowlist]
    paths = ['''path/to/file''']
```

**Problem:** npm audit fails with critical vulnerability

**Solution:**

```bash
# Update vulnerable package
npm update <package-name>

# Or force update
npm install <package-name>@latest

# If no fix available, document and accept risk
npm audit --json > audit-report.json
# Review and create issue to track
```

---

### Path-Based Deploy Not Working

**Problem:** Changes detected but not deploying

**Check:**

```yaml
# Verify path filters in ci.yml
filters: |
  online:
    - 'shiritori-online/**'  # Correct
    - shiritori-online/**    # Wrong (no quotes)
```

**Problem:** Wrong paths being deployed

**Debug:**

```bash
# Test path filter locally
npx path-filter \
  --filters .github/workflows/ci.yml \
  --ref HEAD~1..HEAD
```

---

### Branch Deploy Not Triggering

**Problem:** Pushed to develop but no preview deploy

**Check:**

1. Branch name matches exactly: `develop` not `dev` or `development`
2. Firebase project supports preview channels
3. Check workflow file `on:` triggers include branch

**Manual trigger:**

```bash
# Use workflow_dispatch
gh workflow run ci.yml --ref develop
```

---

## 📈 Metrics & Monitoring

### Pipeline Performance

**Target Times:**

- Security: <3 min
- JSON Validation: <1 min
- Code Quality: <3 min
- Testing: <2 min
- Build: <3 min
- Deploy: <2 min
- **Total: ~10-12 min**

### Success Rates

**Track in GitHub:**

- Actions → Workflows → Success rate %
- Target: >95% success rate
- Monitor failing checks

### Cost Monitoring

**GitHub Actions (Free tier):**

- 2,000 minutes/month (public repos: unlimited)
- Current usage: ~12 min/run
- Typical runs: 50-100/month
- Cost: $0 (within free tier)

**Firebase (Spark plan):**

- Deploy quota: Not counted
- Hosting bandwidth: Monitor in Console
- Database operations: Monitor in Console

---

## 🎯 Best Practices

### Commits

```bash
# Use conventional commits
git commit -m "feat: add new feature"    # New feature
git commit -m "fix: bug description"     # Bug fix
git commit -m "docs: update README"      # Documentation
git commit -m "chore: update deps"       # Maintenance
git commit -m "security: patch vuln"     # Security fix
```

### Pull Requests

**Title format:**

```
feat: Add floating dictionary widget
fix: Resolve deployment script error
docs: Update CI/CD documentation
```

**Description template:**

```markdown
## Changes

- Added X feature
- Fixed Y bug
- Updated Z documentation

## Testing

- [ ] Local build passes
- [ ] Tests pass
- [ ] Manually tested on device

## Screenshots

[If applicable]

## Breaking Changes

None / [Describe if any]
```

### Code Reviews

**Checklist:**

- ✅ All CI checks pass
- ✅ Code follows style guide
- ✅ Tests added for new features
- ✅ Documentation updated
- ✅ No security issues
- ✅ Performance acceptable

---

## 📚 Quick Reference

### Common Commands

```bash
# Security
npm run security:check          # Local security scan
npm run security:audit          # Dependency audit

# JSON
npm run validate:json           # Syntax check
npm run format:json:check       # Format check
npm run lint:json               # Both checks

# Quality
npm run lint                    # Lint all apps
npm run format:check            # Format check
npm run test                    # Run tests

# Build
npm run build                   # Build shiritori-online
npm run build:kawaii            # Build kawaii-shiritori
npm run ci:full                 # Full CI locally

# Deploy
npm run pre-deploy              # Pre-flight checks
npm run deploy                  # Deploy online
npm run deploy:kawaii           # Deploy kawaii
npm run test:deployment         # Test live site

# Dependencies
npm run deps:report             # Dependency inventory
npm run deps:outdated           # Check outdated
npm run deps:sync               # Version sync
```

### Important URLs

| Resource             | URL                                                              |
| -------------------- | ---------------------------------------------------------------- |
| **Live Site**        | https://shiritori-game-ccaae.web.app                             |
| **Firebase Console** | https://console.firebase.google.com/project/shiritori-game-ccaae |
| **GitHub Actions**   | https://github.com/JorelFuji/shiritori_game/actions              |
| **Security Alerts**  | https://github.com/JorelFuji/shiritori_game/security             |
| **Dependabot**       | https://github.com/JorelFuji/shiritori_game/security/dependabot  |

---

## 🎉 Summary

Your CI/CD pipeline now includes:

✅ **Comprehensive Security**

- Secret scanning (Gitleaks)
- Code analysis (CodeQL)
- Dependency auditing (npm audit)
- PR dependency review
- Firebase rules validation

✅ **Smart Deployment**

- Path-based deployment
- Only deploy what changed
- Conditional workflows
- Preview channels for staging

✅ **Clear Branching Strategy**

- main → Production
- develop → Staging
- feature/* → Validation only
- fix/* → Validation only

✅ **Complete Validation**

- JSON linting & formatting
- Code quality checks
- Automated testing
- Security scanning

✅ **Full Documentation**

- Setup guides
- Troubleshooting
- Best practices
- Quick reference

**Your pipeline is production-ready and enterprise-grade!** 🚀

---

_Last updated: July 7, 2026_  
_Pipeline version: 3.0_  
_Status: ✅ Production Ready_
