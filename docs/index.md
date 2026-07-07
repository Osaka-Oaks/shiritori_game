---
layout: default
title: Home
---

# 🎮 Shiritori Game Documentation

Welcome to the comprehensive documentation for the Shiritori Game project - a multiplayer word chain game with React, Flutter, and Firebase.

---

## 🚀 Quick Links

<div class="quick-links">
  <a href="getting-started" class="button">🏁 Getting Started</a>
  <a href="security/" class="button">🔒 Security Setup</a>
  <a href="deployment/" class="button">🚢 Deployment</a>
  <a href="build/" class="button">⚡ Build Optimization</a>
</div>

---

## 📚 Documentation Sections

### Getting Started

- [Quick Start Guide](getting-started.html) - Run locally in minutes
- [Project Structure](../README.md) - Repository layout
- [Installation](getting-started.html#installation) - Prerequisites & setup

### Security

- [Security Fixes](security/fixes.html) - Resolved vulnerabilities
- [Security Policy](security/policy.html) - Responsible disclosure
- [GitHub Secrets Setup](security/github-secrets.html) - CI/CD credentials
- [Security Audit Report](security/audit.html) - Latest scan results

### Deployment

- [GitHub Actions CI/CD](deployment/github.html) - Automated pipelines
- [GitLab CI/CD](deployment/gitlab.html) - Alternative platform
- [Firebase Deployment](deployment/firebase.html) - Firebase setup
- [Flutter Deployment](deployment/flutter.html) - Flutter web/mobile

### Build & Optimization

- [Build Optimization](build/optimization.html) - 60% faster builds
- [Build Tracking](build/tracking.html) - Performance metrics
- [Performance Guide](build/performance.html) - Speed improvements

### Monitoring

- [Monitoring Setup](monitoring/setup.html) - ELK, Grafana, Datadog
- [Docker Troubleshooting](monitoring/docker.html) - Common issues
- [Observability Guide](monitoring/observability.html) - Complete setup

### Features

- [Japanese Input Guide](../JAPANESE_INPUT_GUIDE.md) - Hiragana/Katakana/Kanji
- [Multi-Dictionary System](../MULTI_DICTIONARY_GUIDE.md) - Word validation
- [Port Management](../PORT_MANAGEMENT_GUIDE.md) - Development utilities

---

## 🏗️ Project Overview

### Applications

**React Apps**

- **shiritori-online** - Realtime Database multiplayer
- **kawaii-shiritori** - Firestore + AI features
- **shiritori-word-chain** - Tournament mode

**Flutter App**

- **shiritori_flutter** - Cross-platform (Web, iOS, Android)

### Infrastructure

- Firebase (Hosting, Realtime Database, Firestore, Auth)
- GitHub Actions CI/CD
- GitLab CI/CD (alternative)
- Monitoring (ELK, Grafana, Datadog)
- Terraform/OpenTofu IaC

---

## 🎯 Key Features

✅ **Real-time multiplayer** - WebSocket synchronization  
✅ **AI opponent** - Gemini/Ollama integration  
✅ **Japanese language support** - Full IME support  
✅ **Cross-platform** - Web, iOS, Android  
✅ **Fast builds** - 60% faster with optimization  
✅ **Comprehensive monitoring** - ELK + Grafana + Datadog  
✅ **Security hardened** - Zero critical vulnerabilities  
✅ **Well-documented** - 46+ guide files

---

## 🚀 Quick Start

### Prerequisites

- Node.js 24+
- npm 10+
- Firebase CLI
- Flutter SDK 3.44+ (for Flutter app)

### Run Locally

```bash
# Clone repository
git clone https://github.com/JorelFuji/shiritori_game.git
cd shiritori_game

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your Firebase credentials

# Start React app
npm run dev:online
# Open http://localhost:5173

# Or start Flutter app
npm run dev:flutter
# Opens in Chrome
```

### Deploy to Firebase

```bash
# Login to Firebase
firebase login

# Deploy
npm run deploy
```

See [Getting Started Guide](getting-started.html) for detailed instructions.

---

## 📖 Documentation Index

### Core Documentation

- [README.md](../README.md) - Project overview
- [WIKI.md](../WIKI.md) - Documentation hub
- [UPDATES_SUMMARY.md](../UPDATES_SUMMARY.md) - Recent changes

### Setup & Configuration

- [FLUTTER_FIREBASE_SETUP.md](../FLUTTER_FIREBASE_SETUP.md) - Firebase integration
- [GITHUB_SECRETS_SETUP.md](security/github-secrets.html) - CI/CD secrets
- [GITLAB_SETUP.md](deployment/gitlab.html) - GitLab CI/CD

### Build & Performance

- [BUILD_OPTIMIZATION_QUICKSTART.md](build/optimization.html) - Fast builds
- [BUILD_TRACKING_SUMMARY.md](build/tracking.html) - Metrics
- [PERFORMANCE_GUIDE.md](build/performance.html) - Optimization

### Security

- [SECURITY.md](security/policy.html) - Security policy
- [SECURITY_FIXES.md](security/fixes.html) - Vulnerability audit
- [GITHUB_SECURITY_SETUP.md](../GITHUB_SECURITY_SETUP.md) - Security features

### Deployment & CI/CD

- [DEPLOYMENT_CI_CD_SUMMARY.md](deployment/) - CI/CD overview
- [FLUTTER_DEPLOYMENT_GUIDE.md](deployment/flutter.html) - Flutter deploy
- [COMPLETE_CI_CD_SETUP.md](../COMPLETE_CI_CD_SETUP.md) - Full setup

### Monitoring & Operations

- [MONITORING_OBSERVABILITY_GUIDE.md](monitoring/observability.html) - Observability
- [DOCKER_TROUBLESHOOTING.md](monitoring/docker.html) - Docker issues
- [PORT_MANAGEMENT_GUIDE.md](../PORT_MANAGEMENT_GUIDE.md) - Dev utilities

---

## 🤝 Contributing

We welcome contributions! Please see:

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [CODE_STYLE.md](../CODE_STYLE.md) - Code conventions
- [GIT_WORKFLOW.md](../GIT_WORKFLOW.md) - Branch strategy

### Reporting Issues

- **Bug reports:** [GitHub Issues](https://github.com/JorelFuji/shiritori_game/issues)
- **Security vulnerabilities:** See [Security Policy](security/policy.html)
- **Feature requests:** [GitHub Discussions](https://github.com/JorelFuji/shiritori_game/discussions)

---

## 📊 Project Stats

- **Documentation files:** 46+
- **Lines of code:** ~50,000
- **Apps:** 4 (3 React + 1 Flutter)
- **CI/CD platforms:** 2 (GitHub + GitLab)
- **Languages:** TypeScript, Dart, JavaScript
- **Security score:** 85%+ (GitHub Security)

---

## 🔗 External Resources

### Official Documentation

- [React](https://react.dev/)
- [Flutter](https://docs.flutter.dev/)
- [Firebase](https://firebase.google.com/docs)
- [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Tools

- [GitHub Actions](https://docs.github.com/actions)
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)
- [Docker](https://docs.docker.com/)
- [Terraform](https://www.terraform.io/docs)

### Community

- [Repository](https://github.com/JorelFuji/shiritori_game)
- [Issues](https://github.com/JorelFuji/shiritori_game/issues)
- [Discussions](https://github.com/JorelFuji/shiritori_game/discussions)

---

## 📞 Support

Need help? Check:

1. **Documentation** - Search this site
2. **FAQ** - Common questions answered
3. **Issues** - Existing bug reports
4. **Discussions** - Community Q&A

---

<div align="center">

**📚 Comprehensive Documentation**

46+ guides | 8 categories | Always up-to-date

**Built with ❤️ by the Shiritori Game team**

[View on GitHub](https://github.com/JorelFuji/shiritori_game) |
[Report Issue](https://github.com/JorelFuji/shiritori_game/issues/new) |
[Contribute](../CONTRIBUTING.md)

</div>
