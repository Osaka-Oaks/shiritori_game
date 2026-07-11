# Quick Commands Cheatsheet

Essential commands for development, testing, and deployment.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with JUnit output (for CI)
npm run test:junit

# Run tests with coverage
npm --prefix kawaii-shiritori run test:coverage

# Watch mode (auto-rerun on changes)
npm --prefix kawaii-shiritori run test:watch

# Interactive test UI
npm --prefix kawaii-shiritori run test:ui

# Run specific test file
cd kawaii-shiritori
npx vitest run src/lib/__tests__/wordValidator.test.ts
```

## 🔍 Linting

```bash
# Lint all projects
npm run lint

# Lint specific projects
npm run lint:kawaii
npm run lint:online

# Fix linting issues automatically
cd kawaii-shiritori && npm run lint:fix
cd shiritori-online && npm run lint:fix

# Check formatting
npm run format:check

# Auto-fix formatting
npm run format
```

## 🎨 Code Quality

```bash
# Full validation (format, lint, test, build)
npm run validate

# Type checking only
cd kawaii-shiritori && npm run type-check
cd shiritori-online && npm run type-check

# Security check
npm run security:check
npm run security:audit
```

## 🚀 Development

```bash
# Start kawaii-shiritori dev server
npm run dev:kawaii

# Start shiritori-online dev server
npm run dev

# Start Flutter app
npm run dev:flutter

# Kill port if already in use
npm run port:kill:5173  # Vite default
npm run port:kill:3000  # React default
npm run port:kill:all   # Kill all common ports
```

## 🏗️ Building

```bash
# Build kawaii-shiritori
npm run build:kawaii

# Build shiritori-online
npm run build

# Build with time tracking
npm run build:track

# Fast build (no sourcemaps)
npm run build:fast

# Build all projects
npm run ci:build
```

## 📦 Dependencies

```bash
# Install all dependencies
npm run install:all

# Check for outdated packages
npm run deps:outdated

# Check for dependency mismatches
npm run deps:sync

# Fix dependency mismatches
npm run deps:fix

# Generate dependency report
npm run deps:report
```

## 🔥 Firebase

```bash
# Deploy kawaii-shiritori
npm run deploy:kawaii

# Deploy shiritori-online
npm run deploy

# Deploy only hosting
npm run deploy:hosting
npm run deploy:kawaii:hosting

# Deploy only Firestore rules
npm run deploy:firestore

# Deploy database rules
npm run deploy:rules

# Test Firebase locally
cd kawaii-shiritori && npm run emulators
```

## 🐛 Analysis & Debugging

```bash
# Analyze dead files
bash scripts/analyze-dead-files.sh

# Check health status
npm run health:pulse

# View build metrics
npm run build:analyze
npm run build:report

# Debug module issues
npm run debug:module
npm run check:modules
```

## 📊 Monitoring

```bash
# Start ELK stack (Elasticsearch, Logstash, Kibana)
npm run monitor:elk:start
npm run monitor:elk:logs
npm run monitor:elk:stop

# Start Grafana
npm run monitor:grafana:start
npm run monitor:grafana:stop

# Start all monitoring
npm run monitor:all:start
npm run monitor:all:stop

# Push observability metrics
npm run observability:push
```

## 🎯 Git Hooks (Automatic)

```bash
# Pre-commit hook runs automatically on:
git commit

# Manually run pre-commit checks
cd kawaii-shiritori && npx lint-staged

# Skip hooks (NOT recommended)
git commit --no-verify -m "message"

# Valid commit message format
git commit -m "feat(game): add multiplayer mode"
git commit -m "fix(ui): resolve button alignment"
git commit -m "docs: update README"
```

## 🧹 Cleanup

```bash
# Clean build artifacts
cd kawaii-shiritori && npm run clean

# Clean Flutter build
npm run flutter:clean

# Remove node_modules (manual)
rm -rf node_modules
rm -rf kawaii-shiritori/node_modules
rm -rf shiritori-online/node_modules
```

## 🔐 Security

```bash
# Run security checks
npm run security:check

# Audit dependencies
npm run security:audit

# Check environment variables
npm run env:check

# Validate Infrastructure as Code
npm run validate:iac
```

## 🏗️ Infrastructure (Terraform/OpenTofu)

```bash
# Initialize Terraform
npm run infra:init

# Plan infrastructure changes
npm run infra:plan

# Apply infrastructure changes
npm run infra:apply

# Validate Terraform files
npm run infra:validate

# Environment-specific
npm run infra:dev
npm run infra:staging
npm run infra:production
```

## 📱 Flutter

```bash
# Run Flutter doctor
npm run flutter:doctor

# Setup Flutter Firebase
npm run flutter:setup

# Build Flutter web
npm run build:flutter

# Deploy Flutter to Firebase
npm run deploy:flutter

# Test Flutter deployment
npm run deploy:flutter:test
```

## 🚢 CI/CD

```bash
# Run CI validation locally
npm run ci:validate

# Run fast CI build
npm run ci:fast

# Run full CI pipeline
npm run ci:full

# Deploy to production (via GitHub Actions)
npm run deploy:production

# Deploy to staging (via GitHub Actions)
npm run deploy:staging

# Deploy with tags
npm run deploy:with-tags
```

## 🎓 Common Workflows

### Starting Development
```bash
# First time setup
npm install
npm run install:all
npm run flutter:doctor  # If using Flutter

# Start development
npm run dev:kawaii
# or
npm run dev
```

### Before Committing
```bash
# Check your changes
npm run lint
npm test
npm run format:check

# Or run full validation
npm run validate
```

### Preparing for Deployment
```bash
# Run pre-deploy checks
npm run pre-deploy

# Build and test
npm run build:kawaii
npm run test

# Deploy
npm run deploy:kawaii
```

### Troubleshooting
```bash
# Port already in use
npm run port:kill:5173

# Module issues
npm run check:modules

# Clean and reinstall
cd kawaii-shiritori
npm run clean
rm -rf node_modules
npm install
```

## 📚 Documentation

- **Testing:** See `TESTING_GUIDE.md`
- **Routing:** See `ROUTING_ANALYSIS.md`
- **Setup Summary:** See `SETUP_COMPLETE_SUMMARY.md`
- **CI/CD:** See `CI_CD_PIPELINE.md`
- **Main README:** See `README.md`

## 🆘 Getting Help

1. Check relevant documentation files
2. Run `npm run` to see all available commands
3. Check GitHub Actions logs for CI/CD issues
4. Review Firebase console for deployment issues

---

**Tip:** Add these aliases to your `.bashrc` or `.zshrc`:

```bash
alias shiritori-dev="cd ~/path/to/shiritori_game && npm run dev:kawaii"
alias shiritori-test="cd ~/path/to/shiritori_game && npm test"
alias shiritori-build="cd ~/path/to/shiritori_game && npm run build:kawaii"
```
