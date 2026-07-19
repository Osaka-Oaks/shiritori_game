# 🐳 Docker Troubleshooting Guide

**Fix common Docker and Docker Desktop issues for monitoring and development.**

---

## 🚨 Common Issues

### Issue 1: Docker Desktop Authentication Required

**Error:**

```
Error response from daemon: Sign in to continue using Docker Desktop.
Membership in the [organization] organization is required.
Sign in enforced by your administrators (via registry.json).
```

#### Solutions

<details>
<summary><b>Solution 1: Use Lite Version (Recommended)</b></summary>

Use the lite version of ELK stack that doesn't require authentication:

```bash
# Use lite version
npm run monitor:elk:lite

# Or directly
cd monitoring/elk
docker compose -f docker-compose.lite.yml up -d
```

This version includes:

- ✅ Elasticsearch
- ✅ Kibana
- ✅ Logstash
- ❌ APM Server (removed - causes auth issues)
- ❌ Beats (removed - optional)

</details>

<details>
<summary><b>Solution 2: Sign in to Docker Desktop</b></summary>

If you have Docker Desktop access:

1. Open Docker Desktop
2. Click "Sign in" in the top right
3. Enter your Docker credentials
4. Restart the services:
   ```bash
   npm run monitor:elk:start
   ```

</details>

<details>
<summary><b>Solution 3: Use Docker CLI (Bypass Docker Desktop)</b></summary>

If you don't need Docker Desktop GUI:

```bash
# On macOS with Homebrew
brew install docker
brew install docker-compose

# Use Docker CLI directly
docker compose up -d
```

</details>

<details>
<summary><b>Solution 4: Use Alternative Images</b></summary>

Edit `docker-compose.yml` to use public images that don't require auth:

```yaml
# Replace elastic images with opensearch (open source alternative)
# Example in docker-compose.opensearch.yml
```

</details>

---

### Issue 2: Obsolete Version Attribute Warning

**Warning:**

```
WARN[0000] docker-compose.yml: the attribute `version` is obsolete
```

#### Solution

✅ **Already Fixed!**

The `version` attribute has been removed from `docker-compose.yml`. This is just a warning and doesn't affect functionality.

If you still see this in custom files:

```yaml
# Remove this line
version: "3.8"

# Just start with
services: ...
```

---

### Issue 3: Port Already in Use

**Error:**

```
Error: Port 5601 is already in use
Error: Port 9200 is already in use
```

#### Solution

```bash
# Kill specific ports
npm run port:kill:5601      # Kibana
npm run port:kill -- 9200   # Elasticsearch

# Or kill all dev ports
npm run port:kill:all

# Then restart
npm run monitor:elk:start
```

**📚 [Complete Port Management Guide](PORT_MANAGEMENT_GUIDE.md)**

---

### Issue 4: Cannot Connect to Docker Daemon

**Error:**

```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

#### Solutions

<details>
<summary><b>macOS</b></summary>

```bash
# Start Docker Desktop
open -a Docker

# Or if using colima
colima start
```

</details>

<details>
<summary><b>Linux</b></summary>

```bash
# Start Docker service
sudo systemctl start docker

# Enable auto-start
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

</details>

---

### Issue 5: Insufficient Memory

**Error:**

```
Elasticsearch: max virtual memory areas vm.max_map_count [65530] is too low
```

#### Solution

<details>
<summary><b>macOS</b></summary>

```bash
# Increase Docker Desktop memory
# Docker Desktop → Settings → Resources → Memory
# Set to at least 4GB

# For Elasticsearch specifically
screen ~/Library/Containers/com.docker.docker/Data/vms/0/tty

# Inside the VM
sysctl -w vm.max_map_count=262144
```

</details>

<details>
<summary><b>Linux</b></summary>

```bash
# Temporary fix
sudo sysctl -w vm.max_map_count=262144

# Permanent fix
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

</details>

---

### Issue 6: Containers Keep Restarting

**Error:**

```
Container shiritori-elasticsearch is unhealthy
Container shiritori-kibana restarting
```

#### Solution

```bash
# Check logs
npm run monitor:elk:logs

# Or specific container
docker logs shiritori-elasticsearch
docker logs shiritori-kibana

# Check container status
npm run monitor:elk:status

# Common fixes:
# 1. Increase memory (see Issue 5)
# 2. Clear volumes and restart
npm run monitor:elk:stop
docker volume rm elk_elasticsearch-data
npm run monitor:elk:start
```

---

### Issue 7: Images Won't Pull

**Error:**

```
Error pulling image
```

#### Solution

```bash
# Check internet connection
ping docker.elastic.co

# Try pulling manually
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.11.0

# Use lite version (fewer images)
npm run monitor:elk:lite

# Or pull all images first
docker compose -f monitoring/elk/docker-compose.yml pull
```

---

## 🔧 Quick Fixes

### Reset Everything

```bash
# Stop all containers
npm run monitor:elk:stop

# Remove all containers and volumes
cd monitoring/elk
docker compose down -v

# Remove images (optional)
docker rmi $(docker images 'docker.elastic.co/*' -q)

# Start fresh with lite version
npm run monitor:elk:lite
```

### Check Docker Health

```bash
# Check Docker is running
docker ps

# Check Docker version
docker --version
docker compose version

# Check available resources
docker system df

# Clean up unused resources
docker system prune -a
```

---

## 📦 npm Scripts

### Normal ELK Stack

```bash
npm run monitor:elk:start       # Start full stack
npm run monitor:elk:stop        # Stop stack
npm run monitor:elk:logs        # View logs
npm run monitor:elk:status      # Check status
```

### Lite Version (No Auth Required)

```bash
npm run monitor:elk:lite        # Start lite version
npm run monitor:elk:lite:stop   # Stop lite version
npm run monitor:elk:lite:logs   # View logs
```

### Monitoring Commands

```bash
npm run monitor:all:start       # Start all monitoring
npm run monitor:all:stop        # Stop all monitoring
npm run monitor:grafana:start   # Just Grafana
npm run monitor:grafana:stop    # Stop Grafana
```

---

## 🐋 Docker Alternatives

### Option 1: Use Lite Stack (Recommended)

```bash
# Fewer services, no authentication issues
npm run monitor:elk:lite
```

**Includes:**

- ✅ Elasticsearch (search & storage)
- ✅ Kibana (visualization)
- ✅ Logstash (log processing)

**Excludes:**

- ❌ APM Server (requires auth)
- ❌ Beats (optional)
- ❌ Heartbeat (optional)

### Option 2: Use Grafana Only

```bash
# Lightweight, no authentication
npm run monitor:grafana:start

# Access at http://localhost:3000
# Default credentials: admin/admin
```

### Option 3: Use Native Tools

```bash
# macOS Console app
open -a Console

# System logs
tail -f /var/log/system.log

# Application logs
tail -f app.log
```

---

## 🔍 Debugging Commands

### Check Container Status

```bash
# List all containers
docker ps -a

# Check specific container
docker inspect shiritori-elasticsearch

# View container logs
docker logs -f shiritori-kibana

# Execute command in container
docker exec -it shiritori-elasticsearch bash
```

### Network Issues

```bash
# List networks
docker network ls

# Inspect elk network
docker network inspect elk_elk

# Test connectivity
docker exec shiritori-kibana ping elasticsearch
```

### Volume Issues

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect elk_elasticsearch-data

# Remove all volumes (WARNING: deletes data)
docker volume prune
```

---

## 📚 Documentation

- **Main Monitoring Guide:** [MONITORING_OBSERVABILITY_GUIDE.md](MONITORING_OBSERVABILITY_GUIDE.md)
- **Quick Start:** [monitoring/QUICKSTART.md](monitoring/QUICKSTART.md)
- **Port Management:** [PORT_MANAGEMENT_GUIDE.md](PORT_MANAGEMENT_GUIDE.md)
- **Docker Compose:** [monitoring/elk/docker-compose.yml](monitoring/elk/docker-compose.yml)
- **Lite Version:** [monitoring/elk/docker-compose.lite.yml](monitoring/elk/docker-compose.lite.yml)

---

## 🎯 Recommended Setup

### For Development

```bash
# Use lite version to avoid authentication issues
npm run monitor:elk:lite

# Access Kibana
open http://localhost:5601

# View logs
npm run monitor:elk:lite:logs
```

### For Production

```bash
# Use full stack with authentication
docker login
npm run monitor:elk:start

# Or use Datadog (cloud-based, no Docker)
npm run monitor:datadog:install
```

---

## 💡 Pro Tips

### 1. Check Before Starting

```bash
# Kill ports first
npm run port:kill:all

# Check Docker is running
docker ps

# Check available resources
docker system df
```

### 2. Use Lite Version by Default

```bash
# Add to your workflow
alias elk-start="npm run monitor:elk:lite"
alias elk-stop="npm run monitor:elk:lite:stop"
alias elk-logs="npm run monitor:elk:lite:logs"
```

### 3. Monitor Docker Resources

```bash
# Check memory usage
docker stats

# Check disk usage
docker system df -v

# Clean up regularly
docker system prune -a --volumes
```

---

## 🚀 Quick Commands

```bash
# Fix authentication issues
npm run monitor:elk:lite

# Fix port issues
npm run port:kill:all

# Reset everything
cd monitoring/elk && docker compose down -v

# Start fresh
npm run monitor:elk:lite
```

---

<div align="center">

**🐳 Docker Issues Resolved!**

Use `npm run monitor:elk:lite` to avoid authentication issues.

**Need help?** [Open an issue](https://github.com/JorelFuji/shiritori_game/issues)

</div>
