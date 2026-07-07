# 📦 Dependency Management - Quick Reference

## 🚀 **Quick Commands**

```bash
# Check health
npm run deps:check

# List all packages
npm run deps:list

# Update safely
npm run deps:update

# Check outdated
npm run deps:outdated

# Security audit
npm run deps:audit
```

---

## 📊 **Your Current Stack**

### **Core** (Must Have)

- React 19.0.1 - UI Framework
- TypeScript 5.8.2 - Type Safety
- Vite 6.2.3 - Build Tool
- TailwindCSS 4.1.14 - Styling
- Firebase 11.0.2 - Backend

### **UI/UX** (Keep)

- Lucide React - Icons
- Motion (Framer) - Animations

### **Optional** (Can Remove)

- Phaser - 2D game mode
- Express - Server
- Testing libraries - Tests
- Husky - Git hooks

---

## 🔄 **Update Strategy**

| When      | What          | Command                            |
| --------- | ------------- | ---------------------------------- |
| Weekly    | Security      | `npm audit fix --legacy-peer-deps` |
| Monthly   | Minor updates | `npm run deps:update` → option 2   |
| Quarterly | Major updates | `npm run deps:update` → option 3   |

---

## 🛡️ **Safety Rules**

1. ✅ **Always** use `--legacy-peer-deps` with npm install
2. ✅ **Always** test after updates:
   ```bash
   npm run type-check
   npm run lint
   npm run build
   npm run dev
   ```
3. ✅ **Always** commit working state before updates
4. ❌ **Never** update during production deploy
5. ❌ **Never** skip testing

---

## 📝 **Version Constraints**

```json
"^19.0.1"  → Allows 19.x.x (safe)
"~5.8.2"   → Allows 5.8.x only (safest)
"19.0.1"   → Exact version (strict)
```

**Your current:**

- React: `^19.0.1` ✅ Good
- TypeScript: `~5.8.2` ✅ Safe
- Vite: `^6.2.3` ✅ Good

---

## 🔍 **Check Commands**

```bash
# See all versions
npm list --depth=0

# Check one package
npm list react

# Find outdated
npm outdated

# Security check
npm audit

# Bundle size
du -sh dist/
```

---

## 📦 **Package Count**

**Total:** 34 packages

- **Production:** 12 (8 critical)
- **Development:** 22 (6 critical)

**Can remove:** ~15 packages if not testing/linting

---

## 💡 **Common Tasks**

### Add Package

```bash
npm install <package> --legacy-peer-deps
```

### Remove Package

```bash
npm uninstall <package>
```

### Update One Package

```bash
npm install <package>@latest --legacy-peer-deps
```

### Clean Install

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 🚨 **If Something Breaks**

```bash
# 1. Restore backup
mv package.json.backup package.json

# 2. Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# 3. Test
npm run build
```

---

## 📚 **Full Documentation**

- **DEPENDENCIES.md** - Complete package list
- **VERSION_MANAGEMENT.md** - Update strategies
- **FIX_DEPENDENCY_ERRORS.md** - Troubleshooting

---

## 🎯 **Your Scripts**

```bash
npm run dev               # Start dev server
npm run build             # Build for production
npm run deploy            # Deploy to Firebase
npm run type-check        # Check TypeScript
npm run lint              # Check code quality
npm run test              # Run tests
npm run deps:check        # Health check ⭐
npm run deps:list         # Show all packages ⭐
npm run deps:update       # Safe updates ⭐
```

---

## ✨ **Remember**

- 📦 Check weekly: `npm run deps:check`
- 🔄 Update monthly: `npm run deps:update`
- 🔒 Security first: `npm audit`
- 📊 Track size: `du -sh dist/`
- 💾 Commit lock file: `git add package-lock.json`

---

**Need help?** Run `npm run deps:list` to see everything!
