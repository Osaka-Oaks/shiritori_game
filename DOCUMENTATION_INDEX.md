# 📚 Complete Documentation Index

**Comprehensive guide to all documentation, features, and tools in the Shiritori Game project.**

---

## 🎯 Quick Navigation

<table>
<tr>
<td width="25%" align="center">
<h3>🚀 Getting Started</h3>
<a href="#-getting-started-guides">Start Here</a>
</td>
<td width="25%" align="center">
<h3>⚡ Build Tools</h3>
<a href="#-build--optimization">Optimization</a>
</td>
<td width="25%" align="center">
<h3>📊 Monitoring</h3>
<a href="#-monitoring--observability">Observability</a>
</td>
<td width="25%" align="center">
<h3>🚀 Deployment</h3>
<a href="#-deployment--cicd">CI/CD</a>
</td>
</tr>
</table>

---

## 📖 Table of Contents

- [Getting Started Guides](#-getting-started-guides)
- [Build & Optimization](#-build--optimization)
- [Monitoring & Observability](#-monitoring--observability)
- [Deployment & CI/CD](#-deployment--cicd)
- [Infrastructure & Tools](#-infrastructure--tools)
- [Application Documentation](#-application-documentation)
- [Development Guides](#-development-guides)
- [All Files Reference](#-all-documentation-files)

---

## 🚀 Getting Started Guides

> **Start here if you're new to the project!**

### Quick Start (< 5 minutes)

| Guide | What You'll Learn | Time |
|-------|------------------|------|
| **[Main README](README.md)** | Complete project overview, setup, and usage | 5 min |
| **[Quick Start](#quick-commands)** | Run the game locally in 3 commands | 1 min |
| **[Port Management](PORT_MANAGEMENT_GUIDE.md)** | Kill ports to prevent errors | 2 min |

### Essential Commands

```bash
# Get started in 3 commands
npm run install:app
npm run dev
# Open http://localhost:3000
```

**Common issues?** → [Port Management Guide](PORT_MANAGEMENT_GUIDE.md)

---

## ⚡ Build & Optimization

> **Reduce build time by 60%** (10 min → 4 min)

### Documentation

| Guide | Description | For Who |
|-------|-------------|---------|
| **[Build Optimization Quick Start](BUILD_OPTIMIZATION_QUICKSTART.md)** ⭐ | Get 60% faster builds in 60 seconds | Everyone |
| **[Build Performance Summary](BUILD_PERFORMANCE_SUMMARY.md)** | Complete optimization techniques explained | Developers |
| **[Build Tracking Summary](BUILD_TRACKING_SUMMARY.md)** | Analytics and tracking system details | DevOps |

### Quick Commands

```bash
# Fast build (30-40% faster)
npm run build:fast

# Track build time
npm run build:track

# Analyze performance
npm run build:analyze

# Export report
npm run build:report
```

### Key Features

- ✅ **60% faster builds** - 10 min → 4 min
- ✅ **Build time tracking** - Complete analytics
- ✅ **Performance recommendations** - Actionable insights
- ✅ **Historical analysis** - Trend detection
- ✅ **Automated optimization** - GitHub Actions integration

### Files Created

- `vite.config.build-optimized.ts` - Optimized build configuration
- `scripts/track-build-time.sh` - Build time tracking script
- `scripts/analyze-build-times.js` - Analytics and reporting
- `.github/workflows/build-optimization.yml` - CI/CD workflow

---

## 📊 Monitoring & Observability

> **99.9% uptime with comprehensive monitoring**

### Documentation

| Guide | Description | For Who |
|-------|-------------|---------|
| **[Monitoring Quick Start](monitoring/QUICKSTART.md)** ⭐ | Start monitoring in 5 minutes | Everyone |
| **[Monitoring & Observability Guide](MONITORING_OBSERVABILITY_GUIDE.md)** | Complete monitoring stack setup | DevOps |
| **[Build Performance Summary](BUILD_PERFORMANCE_SUMMARY.md)** | Includes monitoring integration | Developers |

### Monitoring Tools

<table>
<tr>
<th width="20%">Tool</th>
<th width="40%">Purpose</th>
<th width="20%">Port</th>
<th width="20%">Docs</th>
</tr>
<tr>
<td>🔍 <b>Grafana</b></td>
<td>Metrics visualization & dashboards</td>
<td>3000</td>
<td><a href="monitoring/grafana/">Config</a></td>
</tr>
<tr>
<td>📊 <b>Datadog</b></td>
<td>APM, RUM, synthetic monitoring</td>
<td>-</td>
<td><a href="monitoring/datadog/">Config</a></td>
</tr>
<tr>
<td>📈 <b>Kibana</b></td>
<td>Log visualization (ELK Stack)</td>
<td>5601</td>
<td><a href="monitoring/elk/">Config</a></td>
</tr>
<tr>
<td>🔍 <b>Elasticsearch</b></td>
<td>Log storage & search</td>
<td>9200</td>
<td><a href="monitoring/elk/">Config</a></td>
</tr>
<tr>
<td>⚙️ <b>Logstash</b></td>
<td>Log processing pipeline</td>
<td>5044</td>
<td><a href="monitoring/elk/">Config</a></td>
</tr>
<tr>
<td>💓 <b>Heartbeat</b></td>
<td>Uptime monitoring</td>
<td>-</td>
<td><a href="monitoring/elk/heartbeat/">Config</a></td>
</tr>
</table>

### Quick Commands

```bash
# Start all monitoring
npm run monitor:all:start

# Start individual tools
npm run monitor:elk:start      # ELK Stack
npm run monitor:grafana:start  # Grafana

# Stop all
npm run monitor:all:stop

# View logs
npm run monitor:elk:logs
```

### Monitored Metrics

- ⏱️ Response time (p50, p95, p99)
- 📈 Request rate & throughput
- ❌ Error rate & 5xx errors
- 👥 Active users & games
- 💾 Database latency
- 🖥️ CPU & memory usage
- ⚡ Build time

### Files Created

- `monitoring/grafana/dashboard.json` - Grafana dashboard
- `monitoring/datadog/datadog.yaml` - Datadog configuration
- `monitoring/elk/docker-compose.yml` - ELK stack setup
- `monitoring/elk/logstash/pipeline/` - Log processing
- `monitoring/elk/heartbeat/heartbeat.yml` - Uptime checks
- `monitoring/health-checks/health-endpoint.ts` - Health endpoints

---

## 🚀 Deployment & CI/CD

> **Automatic deployment with status checking and time tracking**

### Documentation

| Guide | Description | For Who |
|-------|-------------|---------|
| **[Flutter Deploy Quick Start](FLUTTER_DEPLOY_QUICKSTART.md)** ⭐ | Deploy Flutter in 3 commands | Everyone |
| **[Flutter Deployment Guide](FLUTTER_DEPLOYMENT_GUIDE.md)** | Complete deployment documentation | Developers |
| **[CI/CD Summary](DEPLOYMENT_CI_CD_SUMMARY.md)** | All workflows explained | DevOps |

### Deployment Workflows

<table>
<tr>
<th width="25%">App</th>
<th width="25%">Trigger</th>
<th width="25%">Workflow File</th>
<th width="25%">Deploy Time</th>
</tr>
<tr>
<td>🎮 Shiritori Online</td>
<td>Push to <code>main</code></td>
<td><a href=".github/workflows/deploy.yml">deploy.yml</a></td>
<td>~4 min</td>
</tr>
<tr>
<td>🎨 Kawaii Shiritori</td>
<td>Push to <code>main</code></td>
<td><a href=".github/workflows/deploy.yml">deploy.yml</a></td>
<td>~4 min</td>
</tr>
<tr>
<td>📱 Flutter App</td>
<td>Push to <code>main</code>/<code>develop</code></td>
<td><a href=".github/workflows/deploy-flutter.yml">deploy-flutter.yml</a></td>
<td>~4 min</td>
</tr>
</table>

### Quick Commands

```bash
# Deploy React apps
npm run deploy              # shiritori-online
npm run deploy:kawaii       # kawaii-shiritori

# Deploy Flutter app
npm run deploy:flutter              # Production
npm run deploy:flutter:staging     # Staging
npm run deploy:flutter:test        # Test deployment

# Test existing deployment
npm run deploy:flutter:test
```

### Deployment Features

- ✅ **Automatic deployment** - Push to deploy
- ✅ **10 health checks** - Comprehensive verification
- ✅ **Time tracking** - Build, deploy, verify times
- ✅ **Multiple environments** - Prod, staging, preview
- ✅ **Status reporting** - Full transparency
- ✅ **Rollback support** - Via Firebase Console

### Live URLs

| App | Environment | URL |
|-----|-------------|-----|
| 🎮 Shiritori Online | Production | https://shiritori-game-ccaae.web.app |
| 🎨 Kawaii Shiritori | Production | https://kawaii-shiritori.web.app |
| 📱 Flutter App | Production | https://shiritori-game-ccaae.web.app |
| 📱 Flutter App | Staging | https://shiritori-game-ccaae--develop.web.app |

### Files Created

- `.github/workflows/deploy-flutter.yml` - Flutter CI/CD
- `.github/workflows/build-optimization.yml` - Build optimizations
- `scripts/test-flutter-deployment.sh` - Deployment testing

---

## 🛠️ Infrastructure & Tools

> **Infrastructure as Code, port management, and utilities**

### Documentation

| Guide | Description | For Who |
|-------|-------------|---------|
| **[Port Management Guide](PORT_MANAGEMENT_GUIDE.md)** ⭐ | Kill ports, prevent errors | Everyone |
| **[Infrastructure Guide](infra/README.md)** | Terraform/OpenTofu setup | DevOps |

### Port Management

**Problem:** "Port already in use" errors

**Solution:** Kill processes on ports

```bash
# Kill specific ports
npm run port:kill:5601      # Kibana
npm run port:kill:3000      # React dev
npm run port:kill:5173      # Vite dev

# Kill all dev ports
npm run port:kill:all

# Kill any custom port
npm run port:kill -- 8080
```

### Scripts Reference

<table>
<tr>
<th width="40%">Script</th>
<th width="60%">Purpose</th>
</tr>
<tr>
<td><code>scripts/kill-port.sh</code></td>
<td>Kill process on specific port</td>
</tr>
<tr>
<td><code>scripts/kill-all-ports.sh</code></td>
<td>Kill all development server ports</td>
</tr>
<tr>
<td><code>scripts/track-build-time.sh</code></td>
<td>Track and log build times</td>
</tr>
<tr>
<td><code>scripts/analyze-build-times.js</code></td>
<td>Analyze build performance</td>
</tr>
<tr>
<td><code>scripts/test-flutter-deployment.sh</code></td>
<td>Test Flutter deployment health</td>
</tr>
</table>

### Infrastructure as Code

```bash
# Validate IaC
npm run validate:iac

# Initialize Terraform/OpenTofu
npm run tofu:init

# Plan changes
npm run tofu:plan

# Apply infrastructure
npm run tofu:apply
```

---

## 📱 Application Documentation

> **Individual app documentation and APIs**

### React Applications

<table>
<tr>
<th width="30%">App</th>
<th width="40%">Description</th>
<th width="30%">Documentation</th>
</tr>
<tr>
<td>🚀 <b>Shiritori Online</b></td>
<td>Production React app with Firebase</td>
<td><a href="shiritori-online/README.md">README</a></td>
</tr>
<tr>
<td>🎨 <b>Kawaii Shiritori</b></td>
<td>Enhanced React implementation</td>
<td><a href="kawaii-shiritori/README.md">README</a></td>
</tr>
</table>

### Flutter Application

| App | Description | Documentation |
|-----|-------------|---------------|
| 📱 **Flutter App** | Cross-platform app (Web, iOS, Android) | [README](shiritori-flutter/README.md) |

### Game Documentation

- **[How to Play Shiritori (EN)](How%20to%20Play%20Shiritori.md)** - English rules
- **[How to Play Shiritori (JP)](How%20to%20Play%20Shiritori%20JP.md)** - Japanese rules

---

## 💻 Development Guides

> **Best practices and workflows**

### Development Workflow

1. **Setup**
   ```bash
   git clone https://github.com/JorelFuji/shiritori_game.git
   cd shiritori_game
   npm run install:all
   ```

2. **Start Development**
   ```bash
   npm run dev
   ```

3. **Build & Test**
   ```bash
   npm run build:fast
   npm run test
   npm run lint
   ```

4. **Track Performance**
   ```bash
   npm run build:track
   npm run build:analyze
   ```

5. **Deploy**
   ```bash
   git push origin main  # Auto-deploys via CI/CD
   ```

### Code Quality

```bash
# Lint all code
npm run lint

# Format with Prettier
npm run format

# Check formatting
npm run format:check

# Run tests
npm run test

# Full validation
npm run validate
```

### Common Tasks

<details>
<summary><b>🐛 Fix "Port Already in Use"</b></summary>

```bash
npm run port:kill:3000  # Kill React dev server
npm run port:kill:5601  # Kill Kibana
npm run port:kill:all   # Kill all dev ports
```

</details>

<details>
<summary><b>⚡ Speed Up Builds</b></summary>

```bash
# Use fast build
npm run build:fast

# Track to see improvements
npm run build:track

# Analyze for recommendations
npm run build:analyze
```

</details>

<details>
<summary><b>📊 Check App Health</b></summary>

```bash
# Start monitoring
npm run monitor:all:start

# Check health endpoints
curl http://localhost:3000/health

# Test deployment
npm run deploy:flutter:test
```

</details>

<details>
<summary><b>🚀 Deploy to Production</b></summary>

```bash
# Automatic (recommended)
git push origin main

# Manual
npm run deploy              # React
npm run deploy:flutter      # Flutter
```

</details>

---

## 📋 All Documentation Files

### 📚 Main Documentation

- **[README.md](README.md)** - Project overview and quick start
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - This file (complete docs index)

### ⚡ Build & Optimization

- **[BUILD_OPTIMIZATION_QUICKSTART.md](BUILD_OPTIMIZATION_QUICKSTART.md)** - Fast build guide
- **[BUILD_PERFORMANCE_SUMMARY.md](BUILD_PERFORMANCE_SUMMARY.md)** - Performance improvements
- **[BUILD_TRACKING_SUMMARY.md](BUILD_TRACKING_SUMMARY.md)** - Tracking system details

### 📊 Monitoring & Observability

- **[MONITORING_OBSERVABILITY_GUIDE.md](MONITORING_OBSERVABILITY_GUIDE.md)** - Complete monitoring guide
- **[monitoring/QUICKSTART.md](monitoring/QUICKSTART.md)** - Quick start guide
- `monitoring/grafana/dashboard.json` - Grafana configuration
- `monitoring/datadog/datadog.yaml` - Datadog configuration
- `monitoring/elk/docker-compose.yml` - ELK stack setup

### 🚀 Deployment & CI/CD

- **[FLUTTER_DEPLOYMENT_GUIDE.md](FLUTTER_DEPLOYMENT_GUIDE.md)** - Complete Flutter deploy guide
- **[FLUTTER_DEPLOY_QUICKSTART.md](FLUTTER_DEPLOY_QUICKSTART.md)** - Quick deploy guide
- **[DEPLOYMENT_CI_CD_SUMMARY.md](DEPLOYMENT_CI_CD_SUMMARY.md)** - CI/CD workflows explained

### 🛠️ Tools & Utilities

- **[PORT_MANAGEMENT_GUIDE.md](PORT_MANAGEMENT_GUIDE.md)** - Port management guide
- **[infra/README.md](infra/README.md)** - Infrastructure as Code guide

### 📱 Application Docs

- **[shiritori-online/README.md](shiritori-online/README.md)** - Main app documentation
- **[kawaii-shiritori/README.md](kawaii-shiritori/README.md)** - Alternative app docs
- **[shiritori-flutter/README.md](shiritori-flutter/README.md)** - Flutter app docs

### 🎮 Game Rules

- **[How to Play Shiritori.md](How%20to%20Play%20Shiritori.md)** - English rules
- **[How to Play Shiritori JP.md](How%20to%20Play%20Shiritori%20JP.md)** - Japanese rules

---

## 🎯 Documentation by Use Case

### "I want to..."

<table>
<tr>
<th width="40%">Use Case</th>
<th width="60%">Documentation</th>
</tr>
<tr>
<td><b>Get started quickly</b></td>
<td><a href="README.md#-quick-start">Quick Start</a></td>
</tr>
<tr>
<td><b>Speed up builds</b></td>
<td><a href="BUILD_OPTIMIZATION_QUICKSTART.md">Build Optimization</a></td>
</tr>
<tr>
<td><b>Fix port errors</b></td>
<td><a href="PORT_MANAGEMENT_GUIDE.md">Port Management</a></td>
</tr>
<tr>
<td><b>Monitor the app</b></td>
<td><a href="monitoring/QUICKSTART.md">Monitoring Quick Start</a></td>
</tr>
<tr>
<td><b>Deploy Flutter app</b></td>
<td><a href="FLUTTER_DEPLOY_QUICKSTART.md">Flutter Deploy</a></td>
</tr>
<tr>
<td><b>Set up CI/CD</b></td>
<td><a href="DEPLOYMENT_CI_CD_SUMMARY.md">CI/CD Summary</a></td>
</tr>
<tr>
<td><b>Track build performance</b></td>
<td><a href="BUILD_TRACKING_SUMMARY.md">Build Tracking</a></td>
</tr>
<tr>
<td><b>Configure infrastructure</b></td>
<td><a href="infra/README.md">Infrastructure Guide</a></td>
</tr>
<tr>
<td><b>Understand the game</b></td>
<td><a href="shiritori-online/README.md">App Documentation</a></td>
</tr>
<tr>
<td><b>Learn Shiritori rules</b></td>
<td><a href="How%20to%20Play%20Shiritori.md">Game Rules</a></td>
</tr>
</table>

---

## 📊 Documentation Stats

<table>
<tr>
<td align="center" width="25%">
<h3>📚 15+</h3>
<p>Documentation Files</p>
</td>
<td align="center" width="25%">
<h3>⚡ 5</h3>
<p>Quick Start Guides</p>
</td>
<td align="center" width="25%">
<h3>🛠️ 50+</h3>
<p>npm Scripts</p>
</td>
<td align="center" width="25%">
<h3>🔧 10+</h3>
<p>Utility Scripts</p>
</td>
</tr>
</table>

---

## 🚀 Quick Commands Reference

### Most Used Commands

```bash
# Development
npm run dev                     # Start dev server
npm run build:fast              # Fast build
npm run test                    # Run tests

# Port Management
npm run port:kill:all           # Kill all dev ports

# Monitoring
npm run monitor:all:start       # Start monitoring

# Deployment
npm run deploy                  # Deploy React
npm run deploy:flutter          # Deploy Flutter
npm run deploy:flutter:test     # Test deployment

# Build Analysis
npm run build:track             # Track build time
npm run build:analyze           # Analyze performance
```

---

## 💡 Tips

> **💡 Bookmark this page** for quick access to all documentation!

### Recommended Reading Order

1. **[Main README](README.md)** - Understand the project
2. **[Quick Start](#-getting-started-guides)** - Get running locally
3. **[Build Optimization](BUILD_OPTIMIZATION_QUICKSTART.md)** - Speed up your workflow
4. **[Port Management](PORT_MANAGEMENT_GUIDE.md)** - Prevent common errors
5. **[Monitoring](monitoring/QUICKSTART.md)** - Set up observability
6. **[Deployment](FLUTTER_DEPLOY_QUICKSTART.md)** - Deploy your changes

### Search Tips

- Use **Ctrl+F** or **Cmd+F** to search this page
- Look for the 🚀 emoji for quick start guides
- Look for the ⭐ emoji for most important docs

---

<div align="center">

**📚 Complete Documentation Coverage**

All tools, features, and workflows documented with GitHub-flavored markdown.

**Need help?** [Open an issue](https://github.com/JorelFuji/shiritori_game/issues)

---

**Last Updated:** Jul 6, 2026  
**Total Docs:** 15+ files  
**Coverage:** Complete

</div>
