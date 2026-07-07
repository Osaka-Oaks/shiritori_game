# 📋 Dependency Commands - Quick Reference

## 🚀 Most Used Commands

```bash
# Check everything at once
npm run deps:report && npm run deps:outdated && npm run deps:sync

# Fix version mismatches
npm run deps:fix

# Update all apps safely
npm run deps:outdated:online && npm run deps:outdated:kawaii
```

---

## 📊 Status Commands

| Command                 | What It Does                   | When to Use    |
| ----------------------- | ------------------------------ | -------------- |
| `npm run deps:report`   | Full inventory + version drift | Weekly check   |
| `npm run deps:outdated` | List outdated packages         | Before updates |
| `npm run deps:sync`     | Show version mismatches        | After changes  |
| `npm run deps:lint`     | Check semver ranges            | Code review    |

---

## 🔧 Fix Commands

| Command                 | What It Does              | Safe?         |
| ----------------------- | ------------------------- | ------------- |
| `npm run deps:fix`      | Auto-fix mismatches       | ✅ Yes        |
| `npm update`            | Update to wanted versions | ✅ Yes        |
| `npm audit fix`         | Fix security issues       | ✅ Yes        |
| `npm audit fix --force` | Force fix (breaking)      | ⚠️ Test first |

---

## 📦 Per-App Commands

### Shiritori Online

```bash
cd shiritori-online

npm outdated              # Check outdated
npm update               # Update patch/minor
npm audit                # Security check
npm audit fix            # Fix vulnerabilities

npx npm-check-updates -i # Interactive update
```

### Kawaii Shiritori

```bash
cd kawaii-shiritori

npm outdated              # Check outdated
npm update               # Update patch/minor
npm audit                # Security check
npm audit fix            # Fix vulnerabilities

npx npm-check-updates -i # Interactive update
```

---

## 🔍 Investigation Commands

```bash
# See what would be updated
npx npm-check-updates

# Check specific package
npm outdated typescript

# View dependency tree
npm list

# Find duplicates
npm dedupe

# Check package info
npm view packagename versions
```

---

## 🧪 Testing After Updates

```bash
# Build all apps
npm run build && npm run build:kawaii

# Run tests
npm --prefix kawaii-shiritori test

# Lint code
npm --prefix kawaii-shiritori run lint

# Start dev servers
npm run dev              # shiritori-online
npm run dev:kawaii       # kawaii-shiritori
```

---

## 🚨 Emergency Commands

### Rollback Update

```bash
git reset --hard HEAD~1  # Undo last commit
npm install              # Reinstall from lockfile
```

### Clean Install

```bash
rm -rf node_modules package-lock.json
npm install
```

### Fix Broken Dependencies

```bash
npm install --legacy-peer-deps
# or
npm install --force  # Last resort!
```

---

## 📊 Current Status (Your System)

### Version Drift Detected

- ⚠️ React: 18.3.1 (online) vs 19.0.1 (kawaii)
- ⚠️ Firebase: 10.13.0 (online) vs 11.0.2 (kawaii)
- ⚠️ ESLint: 9.39.4 (online) vs 8.57.0 (kawaii)
- ⚠️ Prettier: 3.9.4 (online) vs 3.2.0 (kawaii)

### Major Updates Available (Kawaii)

- TypeScript: 5.8.3 → 6.0.3 ⚠️
- Vite: 6.4.3 → 8.1.3 ⚠️
- Vitest: 1.6.1 → 4.1.10 ⚠️
- Firebase: 11.10.0 → 12.15.0 ⚠️
- Phaser: 3.90.0 → 4.2.0 ⚠️

---

## 🔗 Full Docs

- [Setup Guide](./DEPENDENCY_MONITORING_SETUP.md)
- [Update Guide](./DEPENDENCY_UPDATE_GUIDE.md)
- [Dashboard](./DEPENDENCIES_DASHBOARD.md)

---

## 💡 Quick Tips

1. **Always run `deps:report` first**
2. **Update one major version at a time**
3. **Test after every update**
4. **Commit frequently**
5. **Read changelogs for major updates**

---

_Keep this file handy for quick command lookup!_ 📌
