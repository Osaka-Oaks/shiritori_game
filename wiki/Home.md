# 🎮 Welcome to the Shiritori Game Wiki

**Official documentation and guides for the Shiritori Game multiplayer project.**

---

## 📚 Quick Navigation

- [Getting Started](Getting-Started) - Setup and first run
- [Security Setup](Security-Setup) - Configure secrets and credentials
- [Deployment Guide](Deployment) - Deploy to Firebase via CI/CD
- [Contributing](Contributing) - How to contribute to the project

---

## 🌐 Full Documentation Site

Visit our **[complete documentation website](https://jorelfuji.github.io/shiritori_game)** for comprehensive guides, tutorials, and API references.

The documentation site includes:
- 📖 46+ detailed guides
- 🔒 Security best practices
- 🚀 Deployment tutorials
- ⚡ Build optimization guides
- 📊 Monitoring setup
- 🐛 Troubleshooting tips

---

## 🏗️ Project Overview

### Applications

**React Apps:**
- **shiritori-online** - Realtime Database multiplayer game
- **kawaii-shiritori** - Firestore + AI-powered opponent
- **shiritori-word-chain** - Tournament mode with rooms

**Flutter App:**
- **shiritori_flutter** - Cross-platform (Web, iOS, Android)

### Technology Stack

- **Frontend:** React, TypeScript, Vite, Flutter
- **Backend:** Firebase (Realtime Database, Firestore, Auth, Hosting)
- **AI:** Gemini API, Ollama (optional local)
- **CI/CD:** GitHub Actions, GitLab CI/CD
- **Monitoring:** ELK Stack, Grafana, Datadog
- **Infrastructure:** Terraform, Docker

---

## 📂 Repository Structure

```
shiritori_game/
├── shiritori-online/       # React app (Realtime Database)
├── kawaii-shiritori/       # React app (Firestore + AI)
├── shiritori-word-chain/   # Tournament mode
├── shiritori_flutter/      # Flutter app
├── .github/workflows/      # CI/CD pipelines
├── monitoring/             # Observability stack
├── infra/                  # Infrastructure as Code
├── scripts/                # Utility scripts
└── docs/                   # Documentation site
```

---

## 🚀 Key Features

✅ **Real-time multiplayer** - WebSocket synchronization  
✅ **AI opponent** - Gemini/Ollama integration  
✅ **Japanese language support** - Hiragana, Katakana, Kanji, ON-YOMI  
✅ **Cross-platform** - Web, iOS, Android  
✅ **Fast builds** - 60% faster with optimization  
✅ **Comprehensive monitoring** - ELK + Grafana + Datadog  
✅ **Security hardened** - Zero critical vulnerabilities  
✅ **Well-documented** - 46+ comprehensive guides  

---

## 📋 Quick Start

### Prerequisites

- Node.js 24+
- npm 10.9+
- Firebase CLI
- Flutter SDK 3.44+ (for Flutter app)

### Run Locally

```bash
# Clone
git clone https://github.com/JorelFuji/shiritori_game.git
cd shiritori_game

# Install
npm install

# Configure
cp .env.example .env
# Edit .env with Firebase credentials

# Run React app
npm run dev:online
# Open http://localhost:5173

# Or run Flutter app
npm run dev:flutter
```

See [Getting Started](Getting-Started) for detailed instructions.

---

## 📖 Documentation Sections

### Setup & Configuration
- [Getting Started](Getting-Started) - First-time setup
- [Firebase Setup](https://jorelfuji.github.io/shiritori_game/deployment/firebase.html) - Firebase integration
- [Environment Variables](https://jorelfuji.github.io/shiritori_game/security/github-secrets.html) - Configure .env files

### Security
- [Security Setup](Security-Setup) - CI/CD secrets and credentials
- [Security Policy](https://jorelfuji.github.io/shiritori_game/security/policy.html) - Responsible disclosure
- [Security Fixes](https://jorelfuji.github.io/shiritori_game/security/fixes.html) - Vulnerability audit

### Deployment
- [Deployment Guide](Deployment) - Firebase deployment
- [GitHub Actions](https://jorelfuji.github.io/shiritori_game/deployment/github.html) - CI/CD with GitHub
- [GitLab CI/CD](https://jorelfuji.github.io/shiritori_game/deployment/gitlab.html) - Alternative platform

### Build & Performance
- [Build Optimization](https://jorelfuji.github.io/shiritori_game/build/optimization.html) - Faster builds
- [Performance Guide](https://jorelfuji.github.io/shiritori_game/build/performance.html) - Speed improvements
- [Build Tracking](https://jorelfuji.github.io/shiritori_game/build/tracking.html) - Metrics

### Monitoring
- [Monitoring Setup](https://jorelfuji.github.io/shiritori_game/monitoring/setup.html) - Observability
- [Docker Troubleshooting](https://jorelfuji.github.io/shiritori_game/monitoring/docker.html) - Common issues

### Contributing
- [Contributing Guide](Contributing) - How to contribute
- [Code Style](https://jorelfuji.github.io/shiritori_game/code-style.html) - Code conventions
- [Git Workflow](https://jorelfuji.github.io/shiritori_game/git-workflow.html) - Branch strategy

---

## 🔗 External Links

### Repository
- [GitHub Repository](https://github.com/JorelFuji/shiritori_game)
- [Issues](https://github.com/JorelFuji/shiritori_game/issues)
- [Pull Requests](https://github.com/JorelFuji/shiritori_game/pulls)
- [Discussions](https://github.com/JorelFuji/shiritori_game/discussions)

### Live Demos
- [React App (Production)](https://shiritori-game-ccaae.web.app)
- [Flutter App](https://shiritori-flutter.web.app)

### Documentation
- [Full Documentation Site](https://jorelfuji.github.io/shiritori_game)
- [README](https://github.com/JorelFuji/shiritori_game/blob/main/README.md)
- [Wiki Home](Home) - This page

---

## 🤝 Contributing

We welcome contributions! To get started:

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Make** your changes
5. **Test** thoroughly
6. **Submit** a Pull Request

See [Contributing Guide](Contributing) for detailed instructions.

---

## 📞 Support

Need help?

1. **Documentation** - Check the [full docs site](https://jorelfuji.github.io/shiritori_game)
2. **Search Issues** - Someone may have had the same problem
3. **Ask in Discussions** - Community Q&A
4. **Open an Issue** - Report bugs or request features

---

## 📊 Project Stats

- **Lines of Code:** ~50,000
- **Documentation Files:** 46+
- **Applications:** 4 (3 React + 1 Flutter)
- **CI/CD Pipelines:** 16 GitHub Actions workflows
- **Languages:** TypeScript, Dart, JavaScript
- **Security Score:** 85%+ (GitHub Security)

---

<div align="center">

**📚 Comprehensive Documentation | 🎮 Multiplayer Fun | 🔒 Security First**

Built with ❤️ by the Shiritori Game team

[Documentation Site](https://jorelfuji.github.io/shiritori_game) | 
[GitHub](https://github.com/JorelFuji/shiritori_game) | 
[Issues](https://github.com/JorelFuji/shiritori_game/issues)

</div>
