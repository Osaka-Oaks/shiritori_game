# 📚 Shiritori Game Wiki

**Complete documentation hub for developers, DevOps, and contributors.**

---

## 🏠 Home

Welcome to the Shiritori Game documentation! This wiki provides comprehensive guides for development, deployment, security, and operations.

### Quick Links

<table>
<tr>
<td align="center" width="25%">
<h3>🚀 Getting Started</h3>
<a href="#-getting-started">Setup Guide</a>
</td>
<td align="center" width="25%">
<h3>💻 Development</h3>
<a href="#-development">Dev Guide</a>
</td>
<td align="center" width="25%">
<h3>🔒 Security</h3>
<a href="#-security">Security Docs</a>
</td>
<td align="center" width="25%">
<h3>🚢 Deployment</h3>
<a href="#-deployment">Deploy Guide</a>
</td>
</tr>
</table>

---

## 📖 Wiki Structure

### 1. Getting Started

#### [Installation](docs/Installation.md)

- Prerequisites
- Environment setup
- First build

#### [Quick Start](README.md#quick-start)

- Run locally in 3 commands
- Access apps
- Verify setup

#### [Project Structure](docs/ProjectStructure.md)

- Monorepo layout
- Package organization
- Key directories

---

### 2. Development

#### [Development Guide](docs/Development.md)

- Local development
- Hot reload
- Debug tools

#### [Code Style](docs/CodeStyle.md)

- ESLint configuration
- Prettier formatting
- TypeScript conventions

#### [Testing](docs/Testing.md)

- Unit tests
- Integration tests
- E2E tests
- Coverage

#### [Git Workflow](docs/GitWorkflow.md)

- Branch strategy
- Commit conventions
- Pull request process

---

### 3. Architecture

#### [System Architecture](docs/Architecture.md)

- High-level overview
- Component diagram
- Data flow

#### [Frontend Architecture](docs/Frontend.md)

- React structure
- State management
- Routing

#### [Flutter Architecture](shiritori_flutter/README.md)

- Widget tree
- State management
- Platform support

#### [Backend Architecture](docs/Backend.md)

- Firebase services
- Realtime Database
- Authentication
- Security rules

---

### 4. Features

#### [Game Logic](docs/GameLogic.md)

- Shiritori rules
- Word validation
- Dictionary system

#### [Multiplayer](docs/Multiplayer.md)

- Real-time sync
- Room management
- Player matching

#### [Japanese Input](JAPANESE_INPUT_GUIDE.md)

- Hiragana/Katakana/Kanji
- IME support
- Word conversion

#### [LINE Integration](PERFORMANCE_GUIDE.md#line-characters)

- LINE characters
- Stickers
- Sound effects

---

### 5. Build & Optimization

#### [Build Optimization](BUILD_OPTIMIZATION_QUICKSTART.md)

- Fast builds (60% faster)
- Bundle optimization
- Code splitting

#### [Build Tracking](BUILD_TRACKING_SUMMARY.md)

- Performance metrics
- Build time analysis
- Historical data

#### [Performance](PERFORMANCE_GUIDE.md)

- Caching strategies
- Lag prevention
- Response time optimization

---

### 6. Deployment

#### [GitHub CI/CD](.github/workflows/)

- Automated pipelines
- Branch protection
- Status checks

#### [GitLab CI/CD](GITLAB_SETUP.md)

- Pipeline configuration
- Runners setup
- Environment variables

#### [Firebase Deployment](FLUTTER_FIREBASE_SETUP.md)

- Hosting setup
- Database rules
- Security configuration

#### [Flutter Deployment](FLUTTER_DEPLOY_QUICKSTART.md)

- Multi-platform build
- Web deployment
- App stores (future)

---

### 7. Infrastructure

#### [Infrastructure as Code](infra/README.md)

- Terraform setup
- OpenTofu support
- Environment management

#### [Monitoring](MONITORING_OBSERVABILITY_GUIDE.md)

- ELK Stack
- Grafana
- Datadog
- Health checks

#### [Port Management](PORT_MANAGEMENT_GUIDE.md)

- Kill ports
- Prevent conflicts
- Debug tools

---

### 8. Security

#### [Security Policy](SECURITY.md)

- Responsible disclosure
- Supported versions
- Contact information

#### [Security Fixes](SECURITY_FIXES.md)

- Fixed vulnerabilities
- False positives
- Pending issues

#### [Authentication](docs/Authentication.md)

- Firebase Auth
- Anonymous users
- User profiles

---

### 9. Operations

#### [Monitoring Setup](monitoring/QUICKSTART.md)

- 5-minute setup
- Dashboard access
- Alert configuration

#### [Docker Troubleshooting](DOCKER_TROUBLESHOOTING.md)

- Common issues
- Authentication problems
- Lite stack option

#### [Debugging](docs/Debugging.md)

- Debug tools
- Error tracking
- Log analysis

---

### 10. API Reference

#### [Firebase API](docs/FirebaseAPI.md)

- Realtime Database
- Authentication
- Cloud Functions

#### [Game API](docs/GameAPI.md)

- Room creation
- Move validation
- State management

#### [Dictionary API](MULTI_DICTIONARY_GUIDE.md)

- Word lookup
- Validation
- Kanji support

---

## 🎯 By Use Case

### "I want to..."

| Use Case                   | Documentation                                                     |
| -------------------------- | ----------------------------------------------------------------- |
| **Get started quickly**    | [README.md](README.md) → [Quick Start](#quick-start)              |
| **Understand the project** | [Project Structure](docs/ProjectStructure.md)                     |
| **Run locally**            | [Installation](docs/Installation.md)                              |
| **Contribute code**        | [Development Guide](docs/Development.md)                          |
| **Run tests**              | [Testing Guide](docs/Testing.md)                                  |
| **Speed up builds**        | [Build Optimization](BUILD_OPTIMIZATION_QUICKSTART.md)            |
| **Deploy to Firebase**     | [Firebase Setup](FLUTTER_FIREBASE_SETUP.md)                       |
| **Set up CI/CD**           | [GitHub Actions](.github/workflows/) or [GitLab](GITLAB_SETUP.md) |
| **Monitor the app**        | [Monitoring Guide](monitoring/QUICKSTART.md)                      |
| **Fix port conflicts**     | [Port Management](PORT_MANAGEMENT_GUIDE.md)                       |
| **Report security issue**  | [Security Policy](SECURITY.md)                                    |
| **Add new feature**        | [Development](docs/Development.md) + [Testing](docs/Testing.md)   |
| **Fix a bug**              | [Debugging Guide](docs/Debugging.md)                              |
| **Deploy Flutter app**     | [Flutter Deploy](FLUTTER_DEPLOY_QUICKSTART.md)                    |
| **Optimize performance**   | [Performance Guide](PERFORMANCE_GUIDE.md)                         |

---

## 📂 Documentation Files

### Root Documentation

```
├── README.md                          # Project overview & quick start
├── WIKI.md                            # This file (documentation hub)
├── DOCUMENTATION_INDEX.md             # Complete file index
├── UPDATES_SUMMARY.md                 # Recent changes
├── SECURITY.md                        # Security policy
├── SECURITY_FIXES.md                  # Security audit results
├── GITLAB_SETUP.md                    # GitLab CI/CD guide
├── DOCKER_TROUBLESHOOTING.md          # Docker issues & solutions
└── CONTRIBUTING.md                    # Contribution guidelines
```

### Build & Optimization

```
├── BUILD_OPTIMIZATION_QUICKSTART.md   # Fast builds guide
├── BUILD_PERFORMANCE_SUMMARY.md       # Performance improvements
├── BUILD_TRACKING_SUMMARY.md          # Build metrics
└── PERFORMANCE_GUIDE.md               # Performance optimization
```

### Flutter Documentation

```
├── FLUTTER_FIREBASE_SETUP.md          # Firebase integration
├── FLUTTER_FIREBASE_QUICKSTART.md     # Quick Firebase setup
├── FLUTTER_DEPLOYMENT_GUIDE.md        # Complete deploy guide
└── FLUTTER_DEPLOY_QUICKSTART.md       # Quick deploy guide
```

### Monitoring & Infrastructure

```
├── MONITORING_OBSERVABILITY_GUIDE.md  # Monitoring setup
├── monitoring/
│   ├── QUICKSTART.md                  # 5-minute setup
│   ├── README.md                      # Monitoring overview
│   └── elk/
│       ├── docker-compose.yml         # ELK stack
│       └── docker-compose.lite.yml    # Lite version
└── infra/
    ├── README.md                      # IaC guide
    └── terraform/                     # Terraform configs
```

### Features & Guides

```
├── JAPANESE_INPUT_GUIDE.md            # Japanese input support
├── MULTI_DICTIONARY_GUIDE.md          # Dictionary system
├── PORT_MANAGEMENT_GUIDE.md           # Port utilities
└── DEPLOYMENT_CI_CD_SUMMARY.md        # CI/CD overview
```

### App-Specific Docs

```
├── shiritori-online/
│   └── README.md                      # React app docs
├── kawaii-shiritori/
│   └── README.md                      # Kawaii app docs
└── shiritori_flutter/
    └── README.md                      # Flutter app docs
```

---

## 🔍 Search Guide

### By Topic

**Getting Started**

- [README.md](README.md)
- [Installation](docs/Installation.md)
- [Quick Start](#quick-start)

**Development**

- [Development Guide](docs/Development.md)
- [Testing](docs/Testing.md)
- [Debugging](docs/Debugging.md)

**Deployment**

- [GitHub CI/CD](.github/workflows/)
- [GitLab CI/CD](GITLAB_SETUP.md)
- [Firebase Deploy](FLUTTER_FIREBASE_SETUP.md)

**Performance**

- [Build Optimization](BUILD_OPTIMIZATION_QUICKSTART.md)
- [Performance Guide](PERFORMANCE_GUIDE.md)
- [Caching](PERFORMANCE_GUIDE.md#advanced-caching)

**Security**

- [Security Policy](SECURITY.md)
- [Security Fixes](SECURITY_FIXES.md)
- [Authentication](docs/Authentication.md)

**Monitoring**

- [Monitoring Guide](MONITORING_OBSERVABILITY_GUIDE.md)
- [Docker Setup](monitoring/QUICKSTART.md)
- [Troubleshooting](DOCKER_TROUBLESHOOTING.md)

---

## 🎓 Learning Paths

### For New Developers

1. **Read:** [README.md](README.md) - Understand the project
2. **Setup:** [Installation](docs/Installation.md) - Get running
3. **Explore:** [Project Structure](docs/ProjectStructure.md) - Learn layout
4. **Code:** [Development Guide](docs/Development.md) - Start developing
5. **Test:** [Testing Guide](docs/Testing.md) - Write tests

### For DevOps Engineers

1. **Infrastructure:** [IaC Guide](infra/README.md) - Terraform setup
2. **CI/CD:** [GitHub Actions](.github/workflows/) or [GitLab](GITLAB_SETUP.md)
3. **Monitoring:** [Monitoring Guide](monitoring/QUICKSTART.md)
4. **Security:** [Security Fixes](SECURITY_FIXES.md)
5. **Deployment:** [Deployment Guide](DEPLOYMENT_CI_CD_SUMMARY.md)

### For Contributors

1. **Guidelines:** [CONTRIBUTING.md](CONTRIBUTING.md)
2. **Git Workflow:** [Git Guide](docs/GitWorkflow.md)
3. **Code Style:** [Style Guide](docs/CodeStyle.md)
4. **Testing:** [Test Guide](docs/Testing.md)
5. **Security:** [Security Policy](SECURITY.md)

---

## 📊 Documentation Status

### Coverage by Category

| Category             | Files | Status         |
| -------------------- | ----- | -------------- |
| Getting Started      | 5     | ✅ Complete    |
| Development          | 8     | ✅ Complete    |
| Build & Optimization | 4     | ✅ Complete    |
| Deployment           | 6     | ✅ Complete    |
| Infrastructure       | 5     | ✅ Complete    |
| Monitoring           | 4     | ✅ Complete    |
| Security             | 3     | ✅ Complete    |
| Features             | 5     | ✅ Complete    |
| API Reference        | 3     | ⏳ In Progress |
| Troubleshooting      | 3     | ✅ Complete    |

**Total:** 46+ documentation files

---

## 🤝 Contributing to Docs

### Improve Documentation

1. **Find gaps:** What's missing or unclear?
2. **Create issue:** Describe the needed documentation
3. **Write docs:** Follow existing format
4. **Submit PR:** Link to the issue

### Documentation Standards

#### File Naming

```
UPPERCASE_WITH_UNDERSCORES.md  # Guide documents
lowercase-with-dashes.md       # App-specific docs
```

#### Structure

```markdown
# Title with Emoji

**Brief description**

---

## Section

Content...

---

## Resources

Links...
```

#### Formatting

- Use **bold** for emphasis
- Use `code` for commands/files
- Use tables for comparisons
- Use emojis for visual navigation
- Include code examples
- Add "copy" code blocks

---

## 🔗 External Resources

### Official Docs

- **React:** https://react.dev/
- **Flutter:** https://docs.flutter.dev/
- **Firebase:** https://firebase.google.com/docs
- **Vite:** https://vite.dev/
- **TypeScript:** https://www.typescriptlang.org/docs/

### Tools

- **GitHub Actions:** https://docs.github.com/actions
- **GitLab CI/CD:** https://docs.gitlab.com/ee/ci/
- **Docker:** https://docs.docker.com/
- **Terraform:** https://www.terraform.io/docs

### Community

- **Issues:** https://github.com/JorelFuji/shiritori_game/issues
- **Discussions:** https://github.com/JorelFuji/shiritori_game/discussions
- **Pull Requests:** https://github.com/JorelFuji/shiritori_game/pulls

---

## 📈 Documentation Metrics

### Recent Updates

- **2026-07-06:** Added GitLab CI/CD documentation
- **2026-07-06:** Created security fixes summary
- **2026-07-06:** Added wiki structure
- **2026-07-06:** Documented Docker troubleshooting

### Most Viewed

1. README.md
2. BUILD_OPTIMIZATION_QUICKSTART.md
3. FLUTTER_FIREBASE_SETUP.md
4. MONITORING_OBSERVABILITY_GUIDE.md
5. PORT_MANAGEMENT_GUIDE.md

---

<div align="center">

**📚 Documentation Hub Complete!**

46+ guides | 8 categories | Always up-to-date

**Need help?** Check the [Use Case Guide](#-by-use-case)

**Can't find something?** [Open an issue](https://github.com/JorelFuji/shiritori_game/issues/new)

</div>
