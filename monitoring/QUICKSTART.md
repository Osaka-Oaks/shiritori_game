# 🚀 Monitoring Quick Start

Get monitoring up and running in 5 minutes!

---

## ⚡ Quick Setup (One Command)

```bash
# Start all monitoring tools
npm run monitor:all:start

# Access dashboards:
# - Grafana: http://localhost:3000 (admin/admin)
# - Kibana: http://localhost:5601
# - Elasticsearch: http://localhost:9200
```

---

## 📊 Individual Tools

### ELK Stack (Elasticsearch, Logstash, Kibana)

```bash
# Start ELK stack
npm run monitor:elk:start

# Check status
npm run monitor:elk:status

# View logs
npm run monitor:elk:logs

# Stop ELK stack
npm run monitor:elk:stop
```

**Access:**
- Kibana: http://localhost:5601
- Elasticsearch: http://localhost:9200
- Logstash: http://localhost:9600

### Grafana

```bash
# Start Grafana
npm run monitor:grafana:start

# Stop Grafana
npm run monitor:grafana:stop
```

**Access:** http://localhost:3000  
**Credentials:** admin / admin (change on first login)

**Import Dashboard:**
1. Login to Grafana
2. Go to Dashboards → Import
3. Upload `monitoring/grafana/dashboard.json`

### Datadog

```bash
# Install Datadog Agent
npm run monitor:datadog:install

# Configure
cp monitoring/datadog/datadog.yaml /etc/datadog-agent/datadog.yaml

# Set API key
export DD_API_KEY=<your-api-key>

# Start agent
sudo datadog-agent start
```

**Access:** https://app.datadoghq.com

---

## 🏥 Health Checks

Test your application health:

```bash
# Detailed health check
curl http://localhost:3000/health | jq

# Liveness probe
curl http://localhost:3000/health/live

# Readiness probe
curl http://localhost:3000/health/ready

# Simple ping
curl http://localhost:3000/ping
```

---

## 📈 What Each Tool Does

### ELK Stack
**Purpose:** Log aggregation, search, and analysis

**What you get:**
- ✅ Centralized logs from all services
- ✅ Full-text search across logs
- ✅ Log visualization dashboards
- ✅ Alerting on log patterns
- ✅ Historical log analysis

**Best for:**
- Debugging errors
- Analyzing user behavior
- Security monitoring
- Compliance/auditing

### Grafana
**Purpose:** Metrics visualization and alerting

**What you get:**
- ✅ Real-time metrics dashboards
- ✅ Beautiful visualizations
- ✅ Alert configuration
- ✅ Data from multiple sources
- ✅ Custom dashboard creation

**Best for:**
- Real-time monitoring
- Performance tracking
- Infrastructure health
- Business metrics

### Datadog
**Purpose:** All-in-one observability platform

**What you get:**
- ✅ Application Performance Monitoring (APM)
- ✅ Real User Monitoring (RUM)
- ✅ Infrastructure monitoring
- ✅ Log management
- ✅ Synthetic monitoring
- ✅ Incident management

**Best for:**
- Complete observability
- User experience tracking
- APM and tracing
- Proactive monitoring

---

## 🎯 What to Monitor

### Critical Metrics

**Uptime:**
```
Target: 99.9% (43 min downtime/month)
Alert: Down for >2 minutes
```

**Response Time:**
```
Target: <500ms (p95)
Alert: >2 seconds
```

**Error Rate:**
```
Target: <0.1%
Alert: >10 errors/minute
```

**Build Time:**
```
Target: <5 minutes
Alert: >10 minutes
```

### Application Metrics

- Active users (real-time)
- Games in progress
- Words submitted per minute
- Database queries per second
- Memory usage
- CPU usage
- API latency

### Business Metrics

- Daily active users (DAU)
- Games started
- Games completed
- Average game duration
- User retention rate
- Conversion funnel

---

## 🚨 Alerting

### Slack Integration

**Grafana:**
```
1. Settings → Notification channels
2. Add Slack webhook
3. Configure alert rules
```

**Datadog:**
```
1. Integrations → Slack
2. Add webhook URL
3. Mention @slack in monitors
```

**ELK:**
```
1. Stack Management → Watcher
2. Create new watch
3. Add Slack action
```

### PagerDuty Integration

**For critical alerts:**
- Application down
- Database unreachable
- High error rate
- Security incidents

**Setup:**
```
1. Create PagerDuty service
2. Get integration key
3. Add to monitoring tools
4. Configure on-call schedule
```

---

## 📊 Dashboards

### Pre-built Dashboards

**Grafana:** `monitoring/grafana/dashboard.json`
- Application health
- Request rate
- Response time
- Error rate
- Active users
- System resources

**Kibana:** Auto-created by Filebeat/Metricbeat
- Log analysis
- System metrics
- APM dashboard
- Uptime monitoring

**Datadog:** Configured in `monitoring/datadog/datadog.yaml`
- Application overview
- Infrastructure health
- Build metrics
- User analytics

---

## 🔧 Troubleshooting

### ELK Stack Issues

**Elasticsearch won't start:**
```bash
# Check memory
docker stats

# Increase memory limit
# Edit docker-compose.yml:
environment:
  - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
```

**No logs appearing:**
```bash
# Check Logstash
curl http://localhost:9600/_node/stats/pipelines

# Test connection
echo '{"test": "message"}' | nc localhost 5000
```

**Kibana can't connect:**
```bash
# Check Elasticsearch
curl http://localhost:9200

# Restart Kibana
docker-compose restart kibana
```

### Grafana Issues

**Can't login:**
```bash
# Reset admin password
docker exec -it grafana grafana-cli admin reset-admin-password admin
```

**Dashboard not loading:**
```bash
# Check Grafana logs
docker logs grafana
```

### Datadog Issues

**Agent not sending data:**
```bash
# Check agent status
sudo datadog-agent status

# Test API key
curl -X POST "https://api.datadoghq.com/api/v1/validate" \
  -H "DD-API-KEY: ${DD_API_KEY}"
```

---

## 🎉 You're Done!

Your monitoring stack is now running!

**Access your dashboards:**
```bash
# Grafana
open http://localhost:3000

# Kibana  
open http://localhost:5601

# Datadog
open https://app.datadoghq.com
```

**Stop everything:**
```bash
npm run monitor:all:stop
```

---

## 📚 Next Steps

1. **Import dashboards** - Load pre-built visualizations
2. **Configure alerts** - Set up Slack/PagerDuty notifications
3. **Add custom metrics** - Track business KPIs
4. **Set up SLOs** - Define service level objectives
5. **Create runbooks** - Document incident response

---

**Monitoring:** ELK + Grafana + Datadog  
**Setup Time:** 5 minutes  
**Status:** ✅ Ready to Monitor!

For detailed documentation, see `MONITORING_OBSERVABILITY_GUIDE.md`
