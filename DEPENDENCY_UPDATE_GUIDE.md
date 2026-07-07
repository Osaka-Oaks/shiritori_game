# 🔄 Dependency Update Guide

Complete guide for safely updating dependencies in the Shiritori monorepo.

---

## 🎯 Before You Start

### Prerequisites

- ✅ Clean working directory (`git status` shows no changes)
- ✅ All tests passing
- ✅ Create backup branch: `git checkout -b deps-update-backup`

### Check Current State

```bash
# Generate full report
npm run deps:report

# Check outdated packages
npm run deps:outdated

# Check for version mismatches
npm run deps:sync
```

---

## 📋 Update Workflow

### Step 1: Security Updates (Priority)

**Always apply security updates first!**

```bash
# Check for vulnerabilities
npm --prefix shiritori-online audit
npm --prefix kawaii-shiritori audit

# Auto-fix (non-breaking)
npm --prefix shiritori-online audit fix
npm --prefix kawaii-shiritori audit fix

# Commit
git add .
git commit -m "fix: apply security patches"
```

---

### Step 2: Patch Updates (Safe)

**Patch versions (x.x.X) are generally safe to apply.**

```bash
# Update patch versions only
cd shiritori-online
npm update --save

cd ../kawaii-shiritori
npm update --save

# Return to root
cd ..

# Test everything
npm run build
npm --prefix kawaii-shiritori test

# Commit if all tests pass
git add .
git commit -m "chore: update patch versions"
```

---

### Step 3: Minor Updates (Review)

**Minor versions (x.X.x) may have new features but should be backward compatible.**

#### Option A: Interactive (Recommended)

```bash
cd shiritori-online
npx npm-check-updates --interactive --target minor

cd ../kawaii-shiritori
npx npm-check-updates --interactive --target minor
```

#### Option B: Automatic

```bash
cd shiritori-online
npx npm-check-updates --target minor -u
npm install

cd ../kawaii-shiritori
npx npm-check-updates --target minor -u
npm install
```

#### Test After Each Update

```bash
# Build both apps
npm run build
npm run build:kawaii

# Run tests
npm --prefix kawaii-shiritori test

# Test dev servers
npm run dev  # Test shiritori-online
npm run dev:kawaii  # Test kawaii-shiritori

# If everything works, commit
git add .
git commit -m "chore: update minor versions"
```

---

### Step 4: Major Updates (Careful!)

**Major versions (X.x.x) may have breaking changes. Update one at a time.**

#### General Process

1. **Research First**
   - Read changelog/migration guide
   - Check for breaking changes
   - Review GitHub issues for problems

2. **Update One Package at a Time**

   ```bash
   cd kawaii-shiritori
   npm install typescript@latest
   ```

3. **Test Immediately**

   ```bash
   npm run build
   npm test
   ```

4. **Fix Breaking Changes**
   - Update code as needed
   - Fix type errors
   - Update configs

5. **Commit Per Package**

   ```bash
   git add .
   git commit -m "chore: upgrade typescript 5 → 6"
   ```

6. **Repeat for Next Package**

---

## 🔥 Specific Package Guides

### TypeScript 5 → 6

**Breaking Changes:**

- Module resolution changes
- New strict checks
- Configuration updates

**Steps:**

```bash
cd kawaii-shiritori

# Update TypeScript
npm install typescript@^6.0.0

# Update types packages
npm update @types/node @types/react @types/react-dom

# Fix tsconfig.json if needed
# Run build to see errors
npm run build

# Fix type errors in code
# Commit when working
git commit -am "chore: upgrade to TypeScript 6"
```

**Test Checklist:**

- [ ] `npm run build` succeeds
- [ ] No type errors
- [ ] Dev server works
- [ ] Tests pass

---

### Vite 6 → 8

**Breaking Changes:**

- Plugin API changes
- Config format updates
- Build output changes

**Steps:**

```bash
cd kawaii-shiritori

# Update Vite and plugins
npm install vite@^8.0.0
npm install @vitejs/plugin-react@latest

# Update vite.config.ts
# Check migration guide: https://vite.dev/guide/migration

# Test build
npm run build
npm run preview

# Commit if working
git commit -am "chore: upgrade to Vite 8"
```

**Test Checklist:**

- [ ] Build output looks correct
- [ ] HMR works in dev mode
- [ ] Production build optimized
- [ ] Assets load correctly

---

### ESLint 8 → 10

**Breaking Changes:**

- **Flat config required** (biggest change)
- Plugin API changes
- Rule updates

**Steps:**

```bash
cd kawaii-shiritori

# Update ESLint and plugins
npm install eslint@^10.0.0
npm install @typescript-eslint/eslint-plugin@latest
npm install @typescript-eslint/parser@latest

# Convert config to flat format
# Rename .eslintrc.cjs → eslint.config.js
# Use new flat config syntax

# Test linting
npm run lint

# Fix issues
npm run lint:fix

# Commit
git commit -am "chore: migrate to ESLint 10 flat config"
```

**Migration Guide:** https://eslint.org/docs/latest/use/configure/migration-guide

---

### Firebase 11 → 12

**Breaking Changes:**

- API changes (review carefully)
- Auth flow updates
- Database SDK changes

**Steps:**

```bash
cd kawaii-shiritori

# Update Firebase
npm install firebase@^12.0.0

# Check breaking changes
# https://firebase.google.com/support/release-notes/js

# Update imports and API calls
# Test auth flow
# Test database reads/writes
# Test hosting deploy

# Commit when working
git commit -am "chore: upgrade to Firebase 12"
```

**Test Checklist:**

- [ ] Auth login works
- [ ] Database reads work
- [ ] Database writes work
- [ ] Hosting deploy succeeds
- [ ] No console errors

---

### Phaser 3 → 4

**Breaking Changes:**

- **Major rewrite** - extensive changes
- New API surface
- Scene system changes

**Recommendation:**
⚠️ **Wait for stable release and community adoption**

**If proceeding:**

```bash
cd kawaii-shiritori

# Backup Game2D component first!
cp src/components/Game2D.tsx src/components/Game2D.backup.tsx

# Update Phaser
npm install phaser@^4.0.0

# Rewrite game logic per v4 docs
# https://phaser.io/phaser4

# Extensive testing required
npm run dev  # Test 2D game mode

# Only commit after thorough testing
git commit -am "chore: upgrade to Phaser 4"
```

---

## 🔍 Troubleshooting

### Build Fails After Update

```bash
# Clear caches
rm -rf node_modules
rm -rf .next .vite dist
npm install

# Try legacy peer deps
npm install --legacy-peer-deps

# Check for peer dependency conflicts
npm list
```

### Type Errors After TypeScript Update

```bash
# Update all @types packages
npm update @types/node @types/react @types/react-dom

# Regenerate types if using codegen
npm run generate-types  # if applicable

# Check tsconfig.json settings
```

### Tests Fail After Update

```bash
# Update test dependencies
npm install vitest@latest @vitest/ui@latest jsdom@latest

# Clear test cache
npx vitest run --clearCache

# Check for breaking changes in test API
```

### Firebase Deploy Fails

```bash
# Update Firebase CLI
npm install -g firebase-tools@latest

# Re-login
firebase logout
firebase login

# Check firebase.json config
# Ensure rules files exist
firebase deploy --only hosting  # Test hosting first
```

---

## 🎯 Best Practices

### DO ✅

- Update security patches immediately
- Update one major version at a time
- Read changelogs before updating
- Test thoroughly after each update
- Commit after each successful update
- Keep lockfiles committed
- Run full test suite

### DON'T ❌

- Update all packages at once
- Skip reading breaking changes
- Deploy without testing
- Ignore deprecation warnings
- Force updates without understanding
- Delete lockfiles
- Update in production directly

---

## 📊 Verification Checklist

After any update, verify:

### Build & Tests

- [ ] `npm run build` succeeds (both apps)
- [ ] `npm test` passes (kawaii-shiritori)
- [ ] `npm run lint` passes (kawaii-shiritori)
- [ ] No TypeScript errors
- [ ] No console errors

### Development

- [ ] Dev server starts (`npm run dev`)
- [ ] Hot reload works
- [ ] No runtime errors
- [ ] Features work as expected

### Production

- [ ] Production build works
- [ ] Firebase deploy succeeds
- [ ] App loads in browser
- [ ] No broken features
- [ ] Performance acceptable

### Git

- [ ] Changes committed
- [ ] Descriptive commit message
- [ ] Lockfiles included
- [ ] Branch pushed to GitHub

---

## 🔄 Rollback Procedure

If update causes issues:

```bash
# Revert last commit
git revert HEAD

# Or reset to before update
git reset --hard HEAD~1

# Or switch to backup branch
git checkout deps-update-backup

# Clean install
rm -rf node_modules
npm install

# Verify working state
npm run build
npm test
```

---

## 📅 Update Schedule

### Daily

- ✅ Review Dependabot PRs
- ✅ Merge security patches

### Weekly (Monday)

- 📊 Review dependency report (automated)
- 🔍 Check for outdated packages
- 🔄 Apply patch/minor updates
- ✅ Merge non-breaking updates

### Monthly

- 📋 Review major version updates
- 🎯 Plan update strategy
- 📚 Read migration guides
- 🧪 Test major updates in dev

### Quarterly

- 🔥 Major framework updates
- 🗂️ Dependency audit
- 📊 Bundle size review
- 🧹 Remove unused dependencies

---

## 🔗 Resources

### Official Docs

- [React Releases](https://react.dev/blog)
- [TypeScript Releases](https://devblogs.microsoft.com/typescript/)
- [Vite Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)
- [Firebase Release Notes](https://firebase.google.com/support/release-notes/js)
- [ESLint Migration Guide](https://eslint.org/docs/latest/use/configure/migration-guide)

### Tools

- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)
- [Syncpack](https://www.npmjs.com/package/syncpack)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)

### Helpful Commands

```bash
# See what would be updated
npx npm-check-updates

# Interactive update selection
npx npm-check-updates --interactive

# Doctor (check for issues)
npm doctor

# Verify package integrity
npm audit signatures
```

---

## 💡 Pro Tips

1. **Use Semantic Versioning Knowledge**
   - `^1.2.3` = 1.2.3 to <2.0.0
   - `~1.2.3` = 1.2.3 to <1.3.0
   - `1.2.3` = exact version

2. **Check GitHub Issues Before Updating**
   - Search for package name + "breaking change"
   - Look for migration issues
   - Check closed issues for solutions

3. **Test in Development Environment First**
   - Never update directly in production
   - Use staging branch
   - Get team approval for major updates

4. **Keep Dependencies Minimal**
   - Remove unused packages
   - Use built-in alternatives when possible
   - Evaluate necessity of new deps

5. **Monitor Bundle Size**
   - Large updates may increase bundle
   - Use `npx vite-bundle-visualizer`
   - Consider alternatives for heavy deps

---

## 📞 Need Help?

**Stuck on an update?**

1. Check the specific package guide above
2. Search GitHub issues for the package
3. Read the official migration guide
4. Ask in project discussions
5. Create an issue with `dependencies` label

---

**Last updated:** July 2026  
**Next review:** October 2026

---

_Keep dependencies fresh, but update responsibly!_ 🚀
