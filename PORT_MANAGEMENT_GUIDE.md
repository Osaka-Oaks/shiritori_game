# 🔌 Port Management Guide

**Kill processes using ports to prevent "port already in use" errors.**

---

## 🚀 Quick Commands

### Kill Specific Port

```bash
# Kibana (5601)
npm run port:kill:5601

# React Dev Server (3000)
npm run port:kill:3000

# Vite Dev Server (5173)
npm run port:kill:5173

# Any port
npm run port:kill -- 8080
```

### Kill All Development Ports

```bash
# Kill all common development server ports
npm run port:kill:all
```

---

## 📋 Common Ports

| Port | Service | Command |
|------|---------|---------|
| **3000** | React/Vite Dev Server | `npm run port:kill:3000` |
| **5173** | Vite Dev Server | `npm run port:kill:5173` |
| **5601** | Kibana | `npm run port:kill:5601` |
| **9200** | Elasticsearch | `npm run port:kill -- 9200` |
| **5000** | Firebase Emulator | `npm run port:kill -- 5000` |
| **8080** | Dev Server | `npm run port:kill -- 8080` |

---

## 🔧 Usage Examples

### Example 1: Kibana Port Conflict

```bash
# Problem: "Error: Port 5601 is already in use"
npm run monitor:elk:start
# Error: Kibana can't start

# Solution:
npm run port:kill:5601
npm run monitor:elk:start
# ✅ Success!
```

### Example 2: React Dev Server

```bash
# Problem: "Port 3000 is already in use"
npm run dev
# Error

# Solution:
npm run port:kill:3000
npm run dev
# ✅ Success!
```

### Example 3: Clean All Ports

```bash
# Kill all development server ports at once
npm run port:kill:all

# Then start fresh
npm run dev
npm run monitor:elk:start
# ✅ All services start cleanly
```

---

## 📊 Script Features

### kill-port.sh

**Features:**
- ✅ Finds process using specific port
- ✅ Shows process details (PID, command, user)
- ✅ Asks for confirmation
- ✅ Graceful shutdown (SIGTERM) first
- ✅ Force kill (SIGKILL) if needed
- ✅ Verifies port is free

**Usage:**
```bash
# Kill specific port
bash scripts/kill-port.sh 5601

# Or with npm
npm run port:kill -- 5601
```

**Output:**
```
🔪 Kill Process on Port 5601
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking port 5601...

Found process(es) using port 5601:

PID    COMMAND          USER
12345  node             username

Kill these process(es)? (y/N): y

Sending SIGTERM to PID 12345...
✅ Successfully killed process(es) on port 5601
✅ Port 5601 is now free

✅ Done!
```

### kill-all-ports.sh

**Features:**
- ✅ Scans 20+ common development ports
- ✅ Shows all processes found
- ✅ Batch kills with confirmation
- ✅ Reports success/failure

**Ports Checked:**
- React/Vite (3000, 3001, 5173, 5174, 4173)
- Firebase (5000, 5001, 9000-9399)
- ELK Stack (5601, 9200, 9300, 5044)
- Monitoring (8125, 8126)
- Other Dev Servers (8080, 8081)

**Usage:**
```bash
# Kill all dev ports
bash scripts/kill-all-ports.sh

# Or with npm
npm run port:kill:all
```

**Output:**
```
🔪 Kill All Development Server Ports
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scanning for processes...

Found 3 process(es) on development ports

Kill all found processes? (y/N): y

Killing processes...

Port 3000 (React Dev Server): Found PID 12345
  ✅ Killed
Port 5601 (Kibana): Found PID 12346
  ✅ Killed
Port 9200 (Elasticsearch): Found PID 12347
  ✅ Killed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Killed 3 process(es)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 Common Scenarios

### Scenario 1: Starting ELK Stack

**Problem:**
```bash
npm run monitor:elk:start
# Error: Port 5601 already in use
# Error: Port 9200 already in use
```

**Solution:**
```bash
# Kill Kibana
npm run port:kill:5601

# Kill Elasticsearch
npm run port:kill -- 9200

# Or kill all at once
npm run port:kill:all

# Restart
npm run monitor:elk:start
```

### Scenario 2: Running Multiple Dev Servers

**Problem:**
```bash
npm run dev        # Port 3000
npm run dev:kawaii # Port 3000 already in use!
```

**Solution:**
```bash
# Kill port 3000
npm run port:kill:3000

# Or modify one server to use different port
cd kawaii-shiritori
PORT=3001 npm run dev
```

### Scenario 3: Zombie Processes

**Problem:**
```bash
# Server crashed but port still in use
npm run dev
# Error: Port already in use
```

**Solution:**
```bash
# Kill the zombie process
npm run port:kill:3000

# Start fresh
npm run dev
```

---

## 🐛 Troubleshooting

### Issue: Permission Denied

```bash
# Error: Operation not permitted

# Solution: Use sudo
sudo bash scripts/kill-port.sh 5601
```

### Issue: Process Won't Die

```bash
# If process persists after SIGKILL

# Solution 1: Check if running in Docker
docker ps
docker stop <container>

# Solution 2: Restart system (last resort)
sudo reboot
```

### Issue: Port Still Shows as Used

```bash
# Wait a moment and check again
sleep 5
lsof -i :5601

# If still used, find the PID manually
lsof -ti :5601
sudo kill -9 <PID>
```

---

## 📚 Manual Commands

### Check What's Using a Port

```bash
# macOS/Linux
lsof -i :5601

# Shows:
# COMMAND   PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
# node    12345  user   23u  IPv4 123456      0t0  TCP *:5601
```

### Kill Process by PID

```bash
# Graceful kill
kill -15 12345

# Force kill
kill -9 12345
```

### Check All Listening Ports

```bash
# Show all ports in use
lsof -i -P -n | grep LISTEN

# Or with netstat
netstat -an | grep LISTEN
```

---

## 🎯 npm Scripts Reference

```json
{
  "port:kill": "Kill any port (pass port as argument)",
  "port:kill:5601": "Kill Kibana port",
  "port:kill:3000": "Kill React dev server port",
  "port:kill:5173": "Kill Vite dev server port",
  "port:kill:all": "Kill all common dev ports"
}
```

**Usage:**
```bash
# Predefined ports
npm run port:kill:5601
npm run port:kill:3000
npm run port:kill:5173

# Custom port
npm run port:kill -- 8080

# All ports
npm run port:kill:all
```

---

## 🔄 Integration with Workflows

### Before Starting Servers

```bash
# In package.json, add prestart script
{
  "scripts": {
    "predev": "npm run port:kill:3000",
    "dev": "vite"
  }
}

# Now running npm run dev automatically clears the port
```

### In CI/CD

```yaml
# .github/workflows/test.yml
- name: Clean ports before tests
  run: npm run port:kill:all

- name: Start test servers
  run: npm run dev &
```

---

## 💡 Pro Tips

**1. Create aliases:**
```bash
# Add to ~/.zshrc or ~/.bashrc
alias killport='bash ~/path/to/scripts/kill-port.sh'
alias killports='bash ~/path/to/scripts/kill-all-ports.sh'

# Then use:
killport 5601
killports
```

**2. Check before starting:**
```bash
# Check if port is free
lsof -i :5601 || npm run dev
```

**3. Use different ports:**
```bash
# Start on alternative port instead of killing
PORT=3001 npm run dev
```

**4. Stop all servers cleanly:**
```bash
# Kill all dev processes at end of day
npm run port:kill:all
```

---

## 🎉 Summary

### What You Can Do

✅ **Kill specific port** - `npm run port:kill:5601`  
✅ **Kill any port** - `npm run port:kill -- 8080`  
✅ **Kill all dev ports** - `npm run port:kill:all`  
✅ **Check processes** - Shows PID, command, user  
✅ **Graceful shutdown** - Tries SIGTERM first  
✅ **Force kill** - Uses SIGKILL if needed  
✅ **Verification** - Confirms port is free  

### Quick Reference

```bash
# Common use cases
npm run port:kill:5601      # Kibana
npm run port:kill:3000      # React
npm run port:kill:5173      # Vite
npm run port:kill:all       # Everything

# Custom port
npm run port:kill -- 8080

# Direct script
bash scripts/kill-port.sh 5601
```

---

**Port Management:** Automated & Easy  
**Commands:** 5 npm scripts  
**Scripts:** 2 utility scripts  
**Status:** ✅ Ready to Use!

**Kill port now:** `npm run port:kill:5601` 🔪
