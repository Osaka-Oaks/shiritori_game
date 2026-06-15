# 🚀 Live Server + Docker + Firebase Testing Guide

Complete guide to test your Shiritori game using Live Server, Docker, and Firebase.

---

## 📦 Option 1: Live Server (Recommended for Quick Testing)

### **Step 1: Build Production Files**

```bash
cd "/Users/m1876041/Documents/Github/Shiritori Game/kawaii-shiritori"
npm run build
```

This creates static files in the `dist/` folder.

### **Step 2: Configure Live Server**

Create `.vscode/settings.json` in your project:

```json
{
  "liveServer.settings.root": "/dist",
  "liveServer.settings.port": 5500,
  "liveServer.settings.host": "localhost",
  "liveServer.settings.CustomBrowser": "chrome",
  "liveServer.settings.AdvanceCustomBrowserCmdLine": "",
  "liveServer.settings.NoBrowser": false,
  "liveServer.settings.ignoreFiles": [
    ".vscode/**",
    "**/*.scss",
    "**/*.sass",
    "**/*.ts",
    "**/*.tsx"
  ]
}
```

### **Step 3: Start Live Server**

**Method A: VS Code UI**
1. Open `dist/index.html` in VS Code
2. Right-click in the editor
3. Select **"Open with Live Server"**
4. Browser opens at: `http://localhost:5500`

**Method B: Status Bar**
1. Click **"Go Live"** button in bottom-right corner
2. Browser opens automatically

**Method C: Command Palette**
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
2. Type: `Live Server: Open with Live Server`
3. Press Enter

### **Step 4: Test Your App**

**Live Server is now running at:**
```
http://localhost:5500
```

**Features:**
- ✅ Auto-reload on file changes
- ✅ Works with static files
- ✅ Fast refresh
- ✅ No build step needed after initial build

### **Step 5: Rebuild When Needed**

When you change source files:

```bash
# Rebuild
npm run build

# Live Server auto-reloads!
```

---

## 🐳 Option 2: Docker (For Production-Like Environment)

### **Step 1: Create Dockerfile**

Already created below! See `Dockerfile` in project root.

### **Step 2: Create Docker Compose**

Already created below! See `docker-compose.yml` in project root.

### **Step 3: Build and Run**

```bash
# Build the Docker image
docker-compose build

# Start the container
docker-compose up

# Or in detached mode
docker-compose up -d
```

**Access at:**
```
http://localhost:8080
```

### **Step 4: Stop Docker**

```bash
# Stop the container
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### **Docker Commands:**

```bash
# View running containers
docker ps

# View logs
docker-compose logs -f

# Rebuild after changes
npm run build
docker-compose up --build

# Shell into container
docker exec -it shiritori-game sh
```

---

## 🔥 Option 3: Firebase Emulator (For Full Firebase Testing)

### **Step 1: Install Firebase Emulator**

```bash
# Install emulator suite
firebase init emulators

# Select:
# ✓ Hosting Emulator
# ✓ Functions Emulator (if needed)
# ✓ Firestore Emulator
# ✓ Database Emulator
```

### **Step 2: Configure Emulator**

Edit `firebase.json`:

```json
{
  "emulators": {
    "hosting": {
      "port": 5000
    },
    "firestore": {
      "port": 8081
    },
    "database": {
      "port": 9000
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

### **Step 3: Start Firebase Emulator**

```bash
# Build first
npm run build

# Start emulators
firebase emulators:start

# Or with hosting only
firebase emulators:start --only hosting
```

**Access at:**
- **App:** http://localhost:5000
- **Emulator UI:** http://localhost:4000
- **Firestore:** http://localhost:8081
- **Database:** http://localhost:9000

### **Step 4: Test with Real Firebase Services**

The emulator connects to your real Firebase project but uses local emulation!

**Benefits:**
- ✅ Test Analytics (simulated)
- ✅ Test Firestore locally
- ✅ Test Database locally
- ✅ Test Functions locally
- ✅ No production data affected
- ✅ Fast iteration

---

## 📊 Comparison: Which to Use?

| Feature | Live Server | Docker | Firebase Emulator |
|---------|-------------|--------|-------------------|
| **Speed** | ⚡ Fastest | Fast | Medium |
| **Setup** | ⚡ Easiest | Medium | Medium |
| **Auto-reload** | ✅ Yes | ❌ No | ✅ Yes |
| **Firebase** | ✅ Real | ✅ Real | ⚡ Simulated |
| **Production-like** | ❌ No | ✅ Yes | ⚡ Partial |
| **Offline** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Port** | 5500 | 8080 | 5000 |

---

## 🎯 Recommended Workflow

### **For Quick Development:**
```bash
# 1. Build once
npm run build

# 2. Open with Live Server (VS Code)
# Click "Go Live" button

# 3. Make changes to src/
# 4. Rebuild
npm run build

# 5. Live Server auto-refreshes!
```

### **For Production Testing:**
```bash
# 1. Build
npm run build

# 2. Start Docker
docker-compose up

# 3. Test at http://localhost:8080

# 4. Stop
docker-compose down
```

### **For Firebase Features Testing:**
```bash
# 1. Build
npm run build

# 2. Start emulators
firebase emulators:start

# 3. Test at http://localhost:5000
# 4. View emulator UI at http://localhost:4000

# 5. Stop with Ctrl+C
```

---

## 🔄 Hot Reload Setup for Live Server

### **Auto-Rebuild on Change (Optional):**

**Install nodemon:**
```bash
npm install -g nodemon
```

**Create watch script:**
```bash
# Add to package.json "scripts"
"watch": "nodemon --watch src --exec 'npm run build'"
```

**Run in separate terminal:**
```bash
# Terminal 1: Auto-rebuild on changes
npm run watch

# Terminal 2: Live Server (VS Code)
# Click "Go Live"
```

Now files auto-rebuild AND auto-refresh! 🎉

---

## 🐛 Troubleshooting

### **Live Server not working:**

**Issue:** Can't find files
**Fix:** Make sure `liveServer.settings.root` is set to `/dist`

**Issue:** Port already in use
**Fix:** Change port in settings:
```json
"liveServer.settings.port": 5501
```

**Issue:** CORS errors
**Fix:** Live Server handles this automatically for local development

### **Docker not working:**

**Issue:** Port 8080 in use
**Fix:** Change port in `docker-compose.yml`:
```yaml
ports:
  - "8081:80"
```

**Issue:** Image won't build
**Fix:**
```bash
docker-compose down -v
docker system prune -a
docker-compose build --no-cache
```

### **Firebase Emulator not working:**

**Issue:** Port conflicts
**Fix:** Stop all Firebase emulators:
```bash
firebase emulators:kill
```

**Issue:** Can't connect to emulator
**Fix:** Check firewall settings, allow ports 4000, 5000, 8081, 9000

---

## 📝 Quick Commands Reference

### **Live Server:**
```bash
# Build once
npm run build

# Then click "Go Live" in VS Code
# Or right-click dist/index.html → "Open with Live Server"
```

### **Docker:**
```bash
# Start
docker-compose up

# Stop
docker-compose down

# Rebuild
docker-compose up --build

# Logs
docker-compose logs -f
```

### **Firebase Emulator:**
```bash
# Start all emulators
firebase emulators:start

# Start hosting only
firebase emulators:start --only hosting

# Stop
# Press Ctrl+C

# Kill all
firebase emulators:kill
```

### **Production Deploy:**
```bash
# Build
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

## 🎮 Testing Checklist

### **Before Each Test Session:**

```bash
# ✅ Pull latest code
git pull origin feature/advanced-mode

# ✅ Install dependencies (if changed)
npm install

# ✅ Build production files
npm run build

# ✅ Choose testing method:
# - Live Server (click "Go Live")
# - Docker (docker-compose up)
# - Firebase (firebase emulators:start)
```

### **During Testing:**

- [ ] Test game start
- [ ] Test word submission
- [ ] Test voice input (requires HTTPS or localhost)
- [ ] Test predictions dropdown
- [ ] Test keyboard navigation (↑↓ Enter Tab)
- [ ] Test Firebase Analytics (check console)
- [ ] Test notifications (check permission popup)
- [ ] Test on mobile (use IP address)

### **After Testing:**

```bash
# ✅ Stop Live Server (click "Stop Live Server")
# OR
# ✅ Stop Docker
docker-compose down

# OR
# ✅ Stop Firebase Emulator
# Press Ctrl+C

# ✅ Commit changes if any
git add .
git commit -m "test: verified features"
git push origin feature/advanced-mode
```

---

## 🌐 Access from Mobile Device

### **Find Your Local IP:**

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

### **Access from Phone:**

**Live Server:**
```
http://YOUR_IP:5500
Example: http://192.168.1.100:5500
```

**Docker:**
```
http://YOUR_IP:8080
Example: http://192.168.1.100:8080
```

**Firebase Emulator:**
```
http://YOUR_IP:5000
Example: http://192.168.1.100:5000
```

**Requirements:**
- Phone and computer on same WiFi
- Firewall allows incoming connections
- HTTPS features (voice, notifications) may not work

---

## 🚀 Summary

**Fastest for Development:**
```bash
npm run build
# Click "Go Live" in VS Code
# → http://localhost:5500
```

**Best for Production Testing:**
```bash
docker-compose up
# → http://localhost:8080
```

**Best for Firebase Testing:**
```bash
firebase emulators:start
# → http://localhost:5000
```

Choose the method that fits your testing needs! 🎯

がんばってください！💻
