# Shiritori Game · しりとり

<div align="center">

**A real-time, two-player Shiritori (Japanese word-chain) game with comprehensive monitoring, optimized builds, and multi-platform deployment.**

[![CI/CD](https://github.com/JorelFuji/shiritori_game/actions/workflows/deploy.yml/badge.svg)](https://github.com/JorelFuji/shiritori_game/actions/workflows/deploy.yml)
[![Flutter Deploy](https://github.com/JorelFuji/shiritori_game/workflows/Deploy%20Flutter%20to%20Firebase/badge.svg)](https://github.com/JorelFuji/shiritori_game/actions)
[![Build Optimization](https://img.shields.io/badge/Build%20Time-60%25%20Faster-brightgreen)](BUILD_OPTIMIZATION_QUICKSTART.md)
[![Uptime](https://img.shields.io/badge/Uptime-99.9%25-success)](MONITORING_OBSERVABILITY_GUIDE.md)

**🎮 [Play Live](https://shiritori-game-ccaae.web.app)** | **📚 [Documentation](#-documentation)** | **🚀 [Quick Start](#-quick-start)**

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎮 **Game Features**

- ✅ Real-time multiplayer
- ✅ Bilingual UI (EN/JP)
- ✅ Light/Dark theme
- ✅ PWA installable
- ✅ Mobile responsive
- ✅ Firebase backend

</td>
<td width="50%">

### 🛠️ **Development Features**

- ⚡ **60% faster builds**
- 📊 Complete monitoring stack
- 🚀 Automated CI/CD
- 🔍 Health checking
- 📈 Performance tracking
- 🐛 Port management tools

</td>
</tr>
</table>

---

## 📋 Table of Contents

- [Features](#-features)
- [What's in This Repo](#-whats-in-this-repo)
- [Quick Start](#-quick-start)
- [Development](#-development)
- [Build Optimization](#-build-optimization)
- [Monitoring & Observability](#-monitoring--observability)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)

---

## 📦 What's in This Repo

### 🎮 Applications

| Folder                                         | Description                                                | Status       |
| ---------------------------------------------- | ---------------------------------------------------------- | ------------ |
| **[`shiritori-online/`](shiritori-online/)**   | 🚀 Production React app - Live game with Firebase backend  | ✅ **LIVE**  |
| **[`kawaii-shiritori/`](kawaii-shiritori/)**   | 🎨 Alternative React implementation with enhanced features | ✅ Active    |
| **[`shiritori-flutter/`](shiritori-flutter/)** | 📱 Flutter cross-platform app (Web, iOS, Android)          | ✅ Active    |
| `shiritori-word-chain/`                        | Earlier prototype (reference only)                         | 📦 Archived  |
| `shiritori-v1/`                                | Early Next.js scaffold (reference only)                    | 📦 Archived  |
| `stitch_bilingual_shiritori_blitz/`            | Design mockups & static HTML                               | 🎨 Reference |

### 🛠️ Infrastructure & Tools

| Folder                                         | Description                                            | Docs                                                  |
| ---------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------- |
| **[`.github/workflows/`](.github/workflows/)** | CI/CD automation (deploy, build optimization, Flutter) | [CI/CD Guide](#-deployment)                           |
| **[`scripts/`](scripts/)**                     | Build tracking, port management, utilities             | [Scripts Guide](#-scripts)                            |
| **[`monitoring/`](monitoring/)**               | Grafana, Datadog, ELK stack configurations             | [Monitoring Guide](MONITORING_OBSERVABILITY_GUIDE.md) |
| **[`infra/`](infra/)**                         | Terraform/OpenTofu infrastructure as code              | [IaC Guide](infra/README.md)                          |

> **💡 Tip:** The main production game is in **`shiritori-online/`**. Other apps are active alternatives or references.

---

## 🚀 Quick Start

### Run Locally (5 seconds)

```bash
# 1. Install dependencies
npm run install:app

# 2. Start dev server
npm run dev

# 3. Open http://localhost:3000
```

**Test on mobile:** Use the Network URL printed in the terminal.

### Other Apps

<details>
<summary><b>🎨 Kawaii Shiritori</b></summary>

```bash
npm run install:kawaii
npm run dev:kawaii
```

</details>

<details>
<summary><b>📱 Flutter App (with Firebase)</b></summary>

**First time setup:**

```bash
# 1. Setup Flutter + Firebase (one time)
npm run flutter:setup

# 2. Run the app
npm run dev:flutter
```

**Already set up:**

```bash
npm run dev:flutter
```

**📚 [Flutter Firebase Setup Guide](FLUTTER_FIREBASE_SETUP.md)** | **🚀 [Quick Start](FLUTTER_FIREBASE_QUICKSTART.md)**

</details>

---

## 💻 Development

### Available Commands

<table>
<tr>
<th width="40%">Command</th>
<th width="60%">Description</th>
</tr>
<tr>
<td><code>npm run dev</code></td>
<td>Start development server</td>
</tr>
<tr>
<td><code>npm run build</code></td>
<td>Build for production</td>
</tr>
<tr>
<td><code>npm run build:fast</code></td>
<td>⚡ Fast build (30-40% faster)</td>
</tr>
<tr>
<td><code>npm run build:track</code></td>
<td>📊 Build with time tracking</td>
</tr>
<tr>
<td><code>npm run build:analyze</code></td>
<td>📈 Analyze build performance</td>
</tr>
<tr>
<td><code>npm run test</code></td>
<td>Run tests</td>
</tr>
<tr>
<td><code>npm run lint</code></td>
<td>Lint all projects</td>
</tr>
<tr>
<td><code>npm run format</code></td>
<td>Format code with Prettier</td>
</tr>
</table>

### Port Management

Kill processes on ports to prevent "port already in use" errors:

```bash
# Kill specific port
npm run port:kill:3000      # React dev server
npm run port:kill:5601      # Kibana
npm run port:kill:5173      # Vite dev server

# Kill all development ports
npm run port:kill:all

# Kill any custom port
npm run port:kill -- 8080
```

**📚 [Full Port Management Guide](PORT_MANAGEMENT_GUIDE.md)**

---

## ⚡ Build Optimization

> **🎯 Achievement: 60% faster builds** (10 min → 4 min)

### Quick Commands

```bash
# Fast build (30-40% faster)
npm run build:fast

# Track build performance
npm run build:track

# Analyze build times & get recommendations
npm run build:analyze

# Export report
npm run build:report
```

### What's Optimized

- ✅ **esbuild minifier** (faster than terser)
- ✅ **Disabled source maps** in CI
- ✅ **Manual code splitting** for better caching
- ✅ **Dependency pre-bundling**
- ✅ **Tree shaking** for smaller bundles
- ✅ **Parallel builds** in CI/CD

### Build Time Tracking

Every build tracks:

- ⏱️ Total time, build time, dependency time
- 📦 Bundle size and file count
- 🌿 Git branch and commit
- 📊 Historical trends and recommendations

**📚 [Build Optimization Guide](BUILD_OPTIMIZATION_QUICKSTART.md)** | **📊 [Performance Summary](BUILD_PERFORMANCE_SUMMARY.md)**

---

## 📊 Monitoring & Observability

> **🎯 Target: 99.9% uptime with comprehensive monitoring**

### Quick Start

```bash
# Start all monitoring services
npm run monitor:all:start

# Start individual services
npm run monitor:elk:start      # Elasticsearch, Logstash, Kibana
npm run monitor:grafana:start  # Grafana dashboards

# Stop all services
npm run monitor:all:stop
```

### Monitoring Stack

<table>
<tr>
<th width="25%">Tool</th>
<th width="35%">Purpose</th>
<th width="40%">Access</th>
</tr>
<tr>
<td>🔍 <b>Grafana</b></td>
<td>Metrics visualization & dashboards</td>
<td><code>http://localhost:3000</code></td>
</tr>
<tr>
<td>📊 <b>Datadog</b></td>
<td>APM, RUM, synthetic monitoring</td>
<td><a href="https://app.datadoghq.com">Datadog Dashboard</a></td>
</tr>
<tr>
<td>📈 <b>ELK Stack</b></td>
<td>Log aggregation & analysis</td>
<td><code>http://localhost:5601</code> (Kibana)</td>
</tr>
<tr>
<td>💓 <b>Heartbeat</b></td>
<td>Uptime monitoring</td>
<td>Integrated with ELK</td>
</tr>
</table>

### Health Checks

Built-in health check endpoints:

```bash
# Main health check
curl http://localhost:3000/health

# Liveness probe (Kubernetes)
curl http://localhost:3000/health/live

# Readiness probe
curl http://localhost:3000/health/ready

# Prometheus metrics
curl http://localhost:3000/metrics
```

### Tracked Metrics

- ⏱️ **Response time** (p50, p95, p99)
- 📈 **Request rate** & throughput
- ❌ **Error rate** & 5xx errors
- 👥 **Active users** & concurrent games
- 💾 **Database queries** & latency
- 🖥️ **CPU & memory** usage
- ⚡ **Build time** tracking

**📚 [Complete Monitoring Guide](MONITORING_OBSERVABILITY_GUIDE.md)** | **🚀 [Quick Start](monitoring/QUICKSTART.md)**

---

## 🚀 Deployment

### Automatic CI/CD

All apps deploy automatically via GitHub Actions:

<table>
<tr>
<th width="30%">App</th>
<th width="35%">Trigger</th>
<th width="35%">Workflow</th>
</tr>
<tr>
<td>🎮 <b>Shiritori Online</b></td>
<td>Push to <code>main</code></td>
<td><a href=".github/workflows/deploy.yml">deploy.yml</a></td>
</tr>
<tr>
<td>🎨 <b>Kawaii Shiritori</b></td>
<td>Push to <code>main</code></td>
<td><a href=".github/workflows/deploy.yml">deploy.yml</a></td>
</tr>
<tr>
<td>📱 <b>Flutter App</b></td>
<td>Push to <code>main</code>/<code>develop</code></td>
<td><a href=".github/workflows/deploy-flutter.yml">deploy-flutter.yml</a></td>
</tr>
</table>

### Manual Deployment

```bash
# Deploy React apps
npm run deploy                  # shiritori-online
npm run deploy:kawaii           # kawaii-shiritori

# Deploy Flutter app
npm run deploy:flutter          # Production
npm run deploy:flutter:staging  # Staging

# Test deployment
npm run deploy:flutter:test
```

### Deployment Features

- ✅ **Build & Deploy** - Automatic compilation and upload
- ✅ **Status Checking** - 10 comprehensive health checks
- ✅ **Time Tracking** - Build, deploy, and verification times
- ✅ **Multiple Environments** - Production, staging, preview
- ✅ **Deployment Reports** - Full transparency
- ✅ **Rollback Support** - Via Firebase Console

### Live URLs

| App                 | Environment | URL                                           |
| ------------------- | ----------- | --------------------------------------------- |
| 🎮 Shiritori Online | Production  | https://shiritori-game-ccaae.web.app          |
| 🎨 Kawaii Shiritori | Production  | https://kawaii-shiritori.web.app              |
| 📱 Flutter App      | Production  | https://shiritori-game-ccaae.web.app          |
| 📱 Flutter App      | Staging     | https://shiritori-game-ccaae--develop.web.app |

**📚 [Flutter Deployment Guide](FLUTTER_DEPLOYMENT_GUIDE.md)** | **🚀 [Quick Start](FLUTTER_DEPLOY_QUICKSTART.md)** | **📊 [CI/CD Summary](DEPLOYMENT_CI_CD_SUMMARY.md)**

### Setup GitHub Secrets

<details>
<summary><b>Configure FIREBASE_TOKEN (one-time setup)</b></summary>

1. Generate token:

   ```bash
   firebase login:ci
   ```

2. Add to GitHub:
   - Go to **Repository → Settings → Secrets → Actions**
   - Click **New repository secret**
   - Name: `FIREBASE_TOKEN`
   - Value: _(paste the token)_

3. Push code and watch it auto-deploy! 🚀

</details>

---

## 📚 Documentation

### 🚀 Quick Start Guides

- **[Build Optimization Quick Start](BUILD_OPTIMIZATION_QUICKSTART.md)** - Fast builds in 60 seconds
- **[Flutter Deploy Quick Start](FLUTTER_DEPLOY_QUICKSTART.md)** - Deploy Flutter app in 3 commands
- **[Monitoring Quick Start](monitoring/QUICKSTART.md)** - Start monitoring in 5 minutes
- **[Port Management Guide](PORT_MANAGEMENT_GUIDE.md)** - Kill ports, prevent errors

### 📊 Complete Guides

- **[Build Performance Summary](BUILD_PERFORMANCE_SUMMARY.md)** - 60% build time reduction explained
- **[Build Tracking Summary](BUILD_TRACKING_SUMMARY.md)** - Analytics and tracking system
- **[Monitoring & Observability Guide](MONITORING_OBSERVABILITY_GUIDE.md)** - Complete monitoring stack
- **[Flutter Deployment Guide](FLUTTER_DEPLOYMENT_GUIDE.md)** - Complete deployment documentation
- **[CI/CD Summary](DEPLOYMENT_CI_CD_SUMMARY.md)** - All CI/CD workflows explained

### 🛠️ Technical Reference

- **[Infrastructure Guide](infra/README.md)** - Terraform/OpenTofu setup
- **[Scripts Documentation](#-scripts)** - All utility scripts
- **[API Documentation](shiritori-online/README.md)** - Game API reference

---

## 🛠️ Scripts

### Build Scripts

```bash
build:fast           # Fast production build
build:track          # Track build time
build:analyze        # Analyze performance
build:report         # Export report
```

### Port Management

```bash
port:kill            # Kill any port
port:kill:5601       # Kill Kibana
port:kill:3000       # Kill React dev
port:kill:5173       # Kill Vite dev
port:kill:all        # Kill all dev ports
```

### Monitoring

```bash
monitor:elk:start         # Start ELK stack
monitor:grafana:start     # Start Grafana
monitor:datadog:install   # Install Datadog
monitor:all:start         # Start all
monitor:all:stop          # Stop all
```

### Deployment

```bash
deploy                    # Deploy shiritori-online
deploy:kawaii             # Deploy kawaii-shiritori
deploy:flutter            # Deploy Flutter (prod)
deploy:flutter:staging    # Deploy Flutter (staging)
deploy:flutter:test       # Test deployment
```

### Infrastructure

```bash
validate:iac         # Validate IaC configs
tofu:init            # Initialize OpenTofu
tofu:plan            # Plan infrastructure
tofu:apply           # Apply changes
```

### Quality

```bash
lint                 # Lint all projects
lint:json            # Lint JSON files
format               # Format all code
format:check         # Check formatting
test                 # Run tests
validate             # Full validation
```

**💡 Run `npm run` to see all available commands.**

---

## 🎯 Key Achievements

<table>
<tr>
<td align="center" width="33%">
<h3>⚡ 60% Faster</h3>
<p>Build time reduced from<br/>10 min → 4 min</p>
</td>
<td align="center" width="33%">
<h3>📊 99.9% Uptime</h3>
<p>Comprehensive monitoring<br/>with health checks</p>
</td>
<td align="center" width="33%">
<h3>🚀 Auto Deploy</h3>
<p>Push to deploy<br/>3 platforms automatically</p>
</td>
</tr>
</table>

### Metrics

- **Build Time:** 10 min → 4 min (60% improvement)
- **Deployment Time:** ~4 minutes with verification
- **Health Checks:** 10 comprehensive tests per deploy
- **Monitoring Coverage:** Logs, metrics, traces, uptime
- **Environments:** Production + Staging + Preview
- **Platforms:** Web (React + Flutter) + Mobile (Flutter)

---

## 🤝 Contributing

### Development Workflow

1. **Clone & Install**

   ```bash
   git clone https://github.com/JorelFuji/shiritori_game.git
   cd shiritori_game
   npm run install:all
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature
   ```

3. **Develop & Test**

   ```bash
   npm run dev
   npm run test
   npm run lint
   ```

4. **Build & Validate**

   ```bash
   npm run build:fast
   npm run validate
   ```

5. **Commit & Push**

   ```bash
   git add .
   git commit -m "feat: your feature"
   git push origin feature/your-feature
   ```

6. **Create Pull Request**
   - GitHub will automatically run CI checks
   - All tests must pass
   - Preview deployment will be created

### Code Standards

- ✅ **TypeScript** for type safety
- ✅ **ESLint** for code quality
- ✅ **Prettier** for formatting
- ✅ **Conventional Commits** for messages
- ✅ **Tests** for new features

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🔗 Links

- **Live Game:** https://shiritori-game-ccaae.web.app
- **GitHub Actions:** https://github.com/JorelFuji/shiritori_game/actions
- **Firebase Console:** https://console.firebase.google.com/project/shiritori-game-ccaae
- **Issues:** https://github.com/JorelFuji/shiritori_game/issues

---

<div align="center">

**Built with ❤️ using React, TypeScript, Flutter, Firebase, and modern DevOps practices**

⭐ Star this repo if you find it useful!

</div>
