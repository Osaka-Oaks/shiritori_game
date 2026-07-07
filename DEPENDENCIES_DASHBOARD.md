# 📊 Dependencies Dashboard

> Last updated: Auto-updated by GitHub Actions

## 🎯 Quick Status

| App              | Dependencies                                              | Dev Dependencies                                                | Node Version | Status    |
| ---------------- | --------------------------------------------------------- | --------------------------------------------------------------- | ------------ | --------- |
| Shiritori Online | [![deps](https://img.shields.io/badge/deps-check-blue)]() | [![devdeps](https://img.shields.io/badge/devdeps-check-blue)]() | 20+          | ✅ Active |
| Kawaii Shiritori | [![deps](https://img.shields.io/badge/deps-check-blue)]() | [![devdeps](https://img.shields.io/badge/devdeps-check-blue)]() | 20+          | ✅ Active |

---

## 🔧 Management Commands

### Check Status

```bash
# Generate full dependency report
npm run deps:report

# Check for outdated packages (both apps)
npm run deps:outdated

# Check version mismatches across apps
npm run deps:sync

# Lint semver ranges
npm run deps:lint
```

### Update Dependencies

```bash
# Fix version mismatches automatically
npm run deps:fix

# Update specific app
cd shiritori-online && npm update
cd kawaii-shiritori && npm update

# Update major versions (carefully!)
npx npm-check-updates -u
```

### Security

```bash
# Run security audit
npm --prefix shiritori-online audit
npm --prefix kawaii-shiritori audit

# Auto-fix vulnerabilities
npm --prefix shiritori-online audit fix
npm --prefix kawaii-shiritori audit fix
```

---

## 📦 Core Framework Versions

### Shiritori Online

- **React**: 19.0.x
- **TypeScript**: 5.x
- **Vite**: 6.x
- **Firebase**: 11.x

### Kawaii Shiritori

- **React**: 19.0.x
- **TypeScript**: 5.x
- **Vite**: 6.x
- **Firebase**: 11.x
- **Phaser**: 3.x
- **Vitest**: 1.x
- **ESLint**: 8.x

---

## ⚠️ Known Issues

### Current Outdated Packages (Kawaii Shiritori)

**Major Version Updates Available:**

- `typescript`: 5.8.3 → 6.0.3 (breaking changes expected)
- `vite`: 6.4.3 → 8.1.3 (major version jump)
- `vitest`: 1.6.1 → 4.1.10 (major version jump)
- `eslint`: 8.57.1 → 10.6.0 (flat config required)
- `phaser`: 3.90.0 → 4.2.0 (breaking changes expected)
- `firebase`: 11.10.0 → 12.15.0 (review breaking changes)

**Action Required:**

- ⚠️ Review breaking changes before updating major versions
- ✅ Minor/patch updates can be applied safely
- 🔄 Test thoroughly after each major update

---

## 🔒 Security Status

### Last Audit: _Run `npm run deps:report` for latest_

**Vulnerabilities:**

- 🟢 Critical: 0
- 🟢 High: 0
- 🟡 Moderate: 0
- ⚪ Low: 0

**Action:** Run `npm audit` in each workspace for current status.

---

## 📈 Update Strategy

### Safe Updates (Automated)

✅ **Patch versions** (x.x.X) - Auto-update via Dependabot
✅ **Minor versions** (x.X.x) - Review & merge weekly
✅ **Security fixes** - Priority updates

### Manual Updates (Review Required)

⚠️ **Major versions** (X.x.x) - Quarterly review
⚠️ **Framework updates** - Test in dev environment first
⚠️ **Breaking changes** - Document migration steps

### Testing Checklist

- [ ] Build passes (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Dev server works (`npm run dev`)
- [ ] Production build tested (`npm run preview`)
- [ ] Firebase deploys successfully

---

## 🔄 Dependabot Configuration

Dependabot is configured to:

- ✅ Check for updates **weekly** (Monday 9 AM UTC)
- ✅ Group related updates (vite ecosystem, types, testing)
- ✅ Limit to **5 PRs per workspace** at once
- ✅ Auto-label PRs by workspace

See [`.github/dependabot.yml`](.github/dependabot.yml) for full configuration.

---

## 📋 Version Sync Policy

### Must Be Synchronized

These packages **must match** across all workspaces:

- `react` / `react-dom`
- `typescript`
- `vite` (major version)
- `firebase` (major version)

### Can Differ

These packages may differ:

- Development tools (eslint, prettier, vitest)
- App-specific deps (phaser, express, etc.)
- Build plugins

**Check sync status:** `npm run deps:sync`

---

## 🎯 Upgrade Roadmap

### Q3 2026 (Current)

- [x] Setup automated dependency monitoring
- [x] Configure Dependabot
- [ ] Upgrade TypeScript 5 → 6 (breaking)
- [ ] Upgrade Vite 6 → 8 (breaking)
- [ ] Review ESLint 8 → 10 migration

### Q4 2026 (Planned)

- [ ] Upgrade Firebase 11 → 12
- [ ] Upgrade Vitest 1 → 4
- [ ] Upgrade Phaser 3 → 4 (evaluate)
- [ ] Major dependency audit

### 2027 Goals

- [ ] Maintain <30 day update lag for security patches
- [ ] Keep major frameworks within 1 major version of latest
- [ ] Zero critical vulnerabilities

---

## 🔗 Related Documentation

- [Dependency Check Script](./scripts/deps-report.mjs)
- [Syncpack Config](./syncpack.config.cjs)
- [GitHub Actions Workflow](.github/workflows/deps-monitor.yml)
- [Dependabot Config](.github/dependabot.yml)

---

## 💡 Tips

### Find Duplicate Dependencies

```bash
npm dedupe
npm --prefix shiritori-online dedupe
npm --prefix kawaii-shiritori dedupe
```

### Check Bundle Size Impact

```bash
npm run build
npx vite-bundle-visualizer
```

### Lock File Integrity

```bash
npm ci  # Clean install from lockfile
```

### Interactive Update Tool

```bash
npx npm-check-updates --interactive
```

---

## 📞 Support

**Issues with dependencies?**

1. Check this dashboard first
2. Run `npm run deps:report` for current state
3. Review [GitHub Issues](https://github.com/JorelFuji/shiritori_game/issues?q=label%3Adependencies)
4. Create new issue with `dependencies` label

---

**Last manual review:** December 2026  
**Next scheduled review:** March 2027  
**Automated checks:** Weekly (Monday 9 AM UTC)

---

_This dashboard is automatically updated by GitHub Actions._  
_Manual updates should be committed with a note in the commit message._
