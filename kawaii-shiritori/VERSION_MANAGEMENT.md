# 📊 Version Management & Tracking Guide

## 🎯 **Quick Commands**

```bash
# Check dependency health
npm run deps:check

# List all packages with descriptions
npm run deps:list

# Update dependencies safely
npm run deps:update

# Check for outdated packages
npm run deps:outdated

# Security audit
npm run deps:audit
```

---

## 📦 **Package Versioning Strategy**

### Current Versions

| Package     | Version | Update Strategy       |
| ----------- | ------- | --------------------- |
| React       | 19.0.1  | Hold (latest, stable) |
| TypeScript  | 5.8.2   | Patch only (~5.8.x)   |
| Vite        | 6.2.3   | Minor (^6.x.x)        |
| Firebase    | 11.0.2  | Minor (^11.x.x)       |
| TailwindCSS | 4.1.14  | Minor (^4.x.x)        |

### Version Constraints Explained

```json
{
  "react": "^19.0.1", // ✅ Allows 19.x.x (safe minor updates)
  "typescript": "~5.8.2", // ✅ Allows 5.8.x only (patch only)
  "vite": "^6.2.3", // ✅ Allows 6.x.x (safe minor updates)
  "firebase": "^11.0.2", // ✅ Allows 11.x.x (safe minor updates)
  "@testing-library/react": "^16.0.0" // ✅ React 19 compatible
}
```

**Symbols:**

- `^` = Compatible with (minor + patch)
- `~` = Patch updates only
- No symbol = Exact version
- `>=` = Greater than or equal

---

## 🔄 **Update Workflow**

### Weekly (Automated)

```bash
# Check for issues
npm run deps:check

# Check security
npm run deps:audit
```

### Monthly (Manual)

```bash
# Check for updates
npm run deps:outdated

# Safe update (patch + minor)
npm run deps:update
# Choose option 2: Minor updates
```

### Quarterly (Careful)

```bash
# Major version updates
npm run deps:update
# Choose option 3: Major updates (test thoroughly!)
```

---

## 🛡️ **Safety Checklist**

Before updating:

- [ ] Backup package.json
- [ ] Check changelog for breaking changes
- [ ] Test in development first
- [ ] Run full test suite
- [ ] Build and verify
- [ ] Deploy to staging (if available)

After updating:

- [ ] `npm run type-check` ✅
- [ ] `npm run lint` ✅
- [ ] `npm run test` ✅
- [ ] `npm run build` ✅
- [ ] `npm run dev` (manual testing) ✅
- [ ] Commit changes
- [ ] Deploy

---

## 📝 **Version History Tracking**

### Git Tags for Releases

```bash
# Create version tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag
git push origin v1.0.0

# List all tags
git tag -l
```

### CHANGELOG.md Format

```markdown
# Changelog

## [1.0.0] - 2026-07-06

### Added

- Multi-script Japanese input (hiragana, katakana, kanji)
- Expanded dictionary (1000+ words)
- LINE characters and stickers
- Sound effects system

### Changed

- Updated React to v19
- Improved performance monitoring

### Fixed

- Dependency conflict with @testing-library/react

### Security

- Updated packages with vulnerabilities
```

---

## 🔍 **Dependency Analysis**

### Bundle Size Tracking

```bash
# Build
npm run build

# Check size
du -sh dist/*

# Analyze bundle
npx vite-bundle-visualizer

# Track over time
echo "$(date): $(du -sh dist | cut -f1)" >> .bundle-size-history
```

### Dependency Tree

```bash
# Full tree
npm list

# Production only
npm list --prod

# Specific package
npm list react

# To depth 2
npm list --depth=2

# Save to file
npm list > dependency-tree.txt
```

---

## 🚨 **Breaking Change Detection**

### Check Before Major Updates

```bash
# Check package homepage
npm info react

# Check changelog
npm info react --json | jq '.versions'

# Visit repository
npm repo react
```

### Known Breaking Changes

**React 18 → 19:**

- Automatic batching changes
- Strict mode updates
- useEffect timing

**TypeScript 5.7 → 5.8:**

- Stricter type checking
- New compiler options

**Vite 5 → 6:**

- ESM changes
- Plugin API updates

---

## 📊 **Dependency Health Metrics**

### Key Indicators

| Metric                   | Good | Warning | Critical |
| ------------------------ | ---- | ------- | -------- |
| Outdated packages        | <5   | 5-10    | >10      |
| Security vulnerabilities | 0    | 1-3     | >3       |
| Bundle size              | <2MB | 2-5MB   | >5MB     |
| Unused dependencies      | 0    | 1-2     | >2       |

### Monitoring Script

```bash
#!/bin/bash
# Add to cron for weekly checks

echo "📊 Weekly Dependency Health - $(date)"
echo "========================================"

# Outdated
OUTDATED=$(npm outdated --json | jq 'length')
echo "Outdated packages: $OUTDATED"

# Security
VULN=$(npm audit --json | jq '.metadata.vulnerabilities.total')
echo "Vulnerabilities: $VULN"

# Bundle size
BUILD_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
echo "Bundle size: ${BUILD_SIZE:-N/A}"

echo ""
```

---

## 🎯 **Specific Package Update Guides**

### React

```bash
# Check current version
npm list react

# Check latest
npm info react version

# Update (careful with major versions)
npm install react@latest react-dom@latest --legacy-peer-deps

# Test thoroughly!
npm run type-check
npm run test
npm run build
```

### TypeScript

```bash
# Update to latest patch
npm update typescript --save-dev --legacy-peer-deps

# Or specific version
npm install typescript@5.8.2 --save-dev --legacy-peer-deps

# Always run type-check after
npm run type-check
```

### Vite

```bash
# Update Vite
npm install vite@latest --save-dev --legacy-peer-deps

# Update plugins
npm install @vitejs/plugin-react@latest --legacy-peer-deps

# Test dev server
npm run dev
```

### Firebase

```bash
# Update Firebase
npm install firebase@latest --legacy-peer-deps

# Check breaking changes
npm info firebase

# Test authentication and database
```

---

## 🔗 **Useful Resources**

### Package Registries

- **npm**: https://www.npmjs.com
- **GitHub**: https://github.com
- **Bundle Phobia**: https://bundlephobia.com (check package size)
- **Can I Use**: https://caniuse.com (browser compatibility)

### Version Checkers

- **npm outdated**: Built-in
- **npm-check-updates**: `npx ncu`
- **depcheck**: `npx depcheck`
- **npm-check**: `npx npm-check`

### Changelogs

- **React**: https://react.dev/blog
- **TypeScript**: https://devblogs.microsoft.com/typescript
- **Vite**: https://vitejs.dev/guide/migration
- **Firebase**: https://firebase.google.com/support/release-notes

---

## 📋 **Package.json Best Practices**

### Well-Structured Example

```json
{
  "name": "kawaii-shiritori",
  "version": "1.0.0",
  "description": "Feature-rich Shiritori game",
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=9.0.0"
  },
  "scripts": {
    "// Development": "",
    "dev": "npx tsx server.ts",
    "build": "npx vite build",

    "// Testing": "",
    "test": "npx vitest run",
    "type-check": "npx tsc --noEmit",

    "// Dependency Management": "",
    "deps:check": "bash scripts/check-deps.sh",
    "deps:update": "bash scripts/update-deps.sh",
    "deps:list": "node scripts/list-packages.js"
  },
  "dependencies": {
    "// Core Framework": "",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",

    "// Build Tools": "",
    "vite": "^6.2.3"
  }
}
```

**Note:** JSON doesn't support comments, but you can use `"//"` keys for organization.

---

## 🎊 **Summary**

### Daily

- ✅ Check console for warnings
- ✅ Monitor build times

### Weekly

- ✅ Run `npm run deps:check`
- ✅ Check security: `npm run deps:audit`

### Monthly

- ✅ Update packages: `npm run deps:update`
- ✅ Check outdated: `npm run deps:outdated`
- ✅ Review bundle size

### Quarterly

- ✅ Major version updates
- ✅ Remove unused dependencies
- ✅ Refactor deprecated APIs

---

## 💡 **Pro Tips**

1. **Always read changelogs** before major updates
2. **Test in dev first**, never update in production
3. **Use `--legacy-peer-deps`** for React 19 projects
4. **Keep package-lock.json** in version control
5. **Document breaking changes** in your CHANGELOG
6. **Monitor bundle size** - smaller is better
7. **Security first** - update vulnerabilities immediately
8. **Automate checks** with CI/CD pipelines

---

**Your dependencies are now tracked and managed!** 📦✅

Run `npm run deps:list` to see everything!
