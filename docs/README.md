# Shiritori Game Documentation

**Welcome to the comprehensive documentation for the Shiritori Game project.**

---

## 📚 Documentation Structure

This `docs/` folder follows industry best practices for game documentation, keeping only what's essential while skipping enterprise overhead.

### Core Documents (Must-Read)

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **[Design Document](design.md)** | Complete game rules, logic, and algorithms | Before coding any game logic |
| **[Test Cases](tests/test-cases.md)** | 100 test scenarios covering all edge cases | Before & during testing |
| **[CHANGELOG](../CHANGELOG.md)** | Version history and changes | When reviewing updates |

### Architectural Decision Records (ADRs)

ADRs document **why** we made specific technical choices, so you don't forget in 2 months.

| ADR | Decision | Date |
|-----|----------|------|
| **[ADR-0001](adr/0001-word-validation-strategy.md)** | Use bundled local dictionary (not API) | 2026-07-10 |
| **[ADR-0002](adr/0002-bilingual-mode-implementation.md)** | Three modes: EN-only, JP-only, Bilingual | 2026-07-10 |

### Project Guides

| Guide | Purpose |
|-------|---------|
| **[Main README](../README.md)** | Project overview, quick start, features |
| **[Vercel Deployment Guide](../VERCEL_DEPLOYMENT_GUIDE.md)** | Deploy to Vercel in 5 minutes |
| **[Flutter Setup](../shiritori_flutter/SETUP_AND_TEST.md)** | Flutter development setup |
| **[Complete Integration Summary](../COMPLETE_DART_FLUTTER_INTEGRATION_SUMMARY.md)** | Dart & Flutter feature integration |

---

## 🎯 Quick Navigation

### I want to...

**...understand the game rules**  
→ Read [Design Document](design.md) § Game Rules

**...know why we made a decision**  
→ Check [ADRs](adr/) for architectural choices

**...write or run tests**  
→ See [Test Cases](tests/test-cases.md)

**...deploy to production**  
→ Follow [Vercel Deployment Guide](../VERCEL_DEPLOYMENT_GUIDE.md)

**...see what changed**  
→ Check [CHANGELOG](../CHANGELOG.md)

**...understand the code structure**  
→ Read [Design Document](design.md) § Core Logic

**...integrate Flutter features**  
→ See [Dart/Flutter Integration](../DART_FLUTTER_DOCS_INTEGRATION.md)

---

## 📖 Reading Order

### For New Developers

1. **[Main README](../README.md)** - Understand what the project is
2. **[Design Document](design.md)** - Learn the game rules and logic
3. **[ADR-0001](adr/0001-word-validation-strategy.md)** - Dictionary strategy
4. **[ADR-0002](adr/0002-bilingual-mode-implementation.md)** - Language modes
5. **[Test Cases](tests/test-cases.md)** - See all edge cases

### For Testers

1. **[Test Cases](tests/test-cases.md)** - All 100 test scenarios
2. **[Design Document](design.md)** § Edge Cases - Critical scenarios
3. Run automated tests: `npm test` in `kawaii-shiritori/`

### For DevOps

1. **[Vercel Deployment Guide](../VERCEL_DEPLOYMENT_GUIDE.md)** - Deploy React app
2. **[Firebase Setup](../shiritori_flutter/SETUP_AND_TEST.md)** - Deploy Flutter
3. **[Monitoring Guide](../MONITORING_OBSERVABILITY_GUIDE.md)** - Set up monitoring

---

## 🏗️ Project Architecture

### Applications

```
shiritori_game/
├── shiritori-online/        # React app (Vite) - Ready for Vercel
├── kawaii-shiritori/        # React app - Deployed to Firebase  
└── shiritori_flutter/       # Flutter app - 2D/3D game modes
```

### Core Game Logic

All implementations share these core concepts:

1. **Word Validation** - Dictionary lookup + chain rules
2. **Chain Management** - Track used words, validate continuity
3. **Language Detection** - Support English, Japanese, or both
4. **Multiplayer Sync** - Real-time Firebase updates

See [Design Document](design.md) for detailed algorithms.

---

## 🧪 Testing

### Test Coverage

| Component | Tests | Coverage | Status |
|-----------|-------|----------|--------|
| Word Validator | 21 | 83.53% | ✅ |
| Japanese Converter | 37 | 95.36% | ✅ |
| Dictionary Helper | 16 | 86.88% | ✅ |
| Leaderboard | 7 | N/A | ✅ |
| **Total** | **81** | **42.42%** | ✅ |

### Run Tests

```bash
cd kawaii-shiritori
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

See [Test Cases](tests/test-cases.md) for complete test scenarios.

---

## 🚀 Deployment Status

| Platform | Project | Status | URL |
|----------|---------|--------|-----|
| **Firebase** | kawaii-shiritori | ✅ Live | https://shiritori-game-ccaae.web.app |
| **Vercel** | shiritori-online | ⚠️ Ready to deploy | TBD |
| **Flutter Web** | shiritori_flutter | 🔧 In development | TBD |

Deploy to Vercel: `vercel --prod` (see [guide](../VERCEL_DEPLOYMENT_GUIDE.md))

---

## 🎓 Learning Resources

### External Documentation

- **Dart Language:** https://dart.dev/language
- **Flutter Docs:** https://docs.flutter.dev
- **React Docs:** https://react.dev
- **Firebase Docs:** https://firebase.google.com/docs

### Internal Implementation

- `kawaii-shiritori/src/lib/` - Core game logic
- `kawaii-shiritori/src/components/` - React components
- `shiritori_flutter/lib/` - Flutter implementation

---

## 📝 Contributing

### Adding New Documentation

**When to add a new document:**
- ✅ Real architecture decision → Create new ADR
- ✅ New test scenarios → Add to [test-cases.md](tests/test-cases.md)
- ✅ Version changes → Update [CHANGELOG](../CHANGELOG.md)
- ❌ Don't create docs for one-off questions (use code comments)

**ADR Template:**
```markdown
# ADR XXXX: [Title]

## Status
[Proposed | Accepted | Deprecated]

## Context
[What's the problem/question?]

## Decision
[What did we choose?]

## Consequences
[What are the trade-offs?]
```

### Document Maintenance

- **Design Doc:** Review quarterly or when rules change
- **ADRs:** Create when making significant architecture choices
- **Test Cases:** Update when adding new features
- **CHANGELOG:** Update with every release

---

## 🔍 Search Tips

### Find Specific Information

- **Game Rules:** Search "rules" in [design.md](design.md)
- **Edge Cases:** Search "edge cases" in [test-cases.md](tests/test-cases.md)
- **Decisions:** Browse [adr/](adr/) folder
- **Changes:** Search version number in [CHANGELOG](../CHANGELOG.md)

### Common Questions

**Q: Why do we use a local dictionary instead of an API?**  
A: See [ADR-0001](adr/0001-word-validation-strategy.md) - TL;DR: Offline support & performance

**Q: How does bilingual mode work?**  
A: See [ADR-0002](adr/0002-bilingual-mode-implementation.md) - Per-word language detection

**Q: What are all the test cases?**  
A: See [Test Cases](tests/test-cases.md) - 100 scenarios documented

**Q: What changed in version X?**  
A: See [CHANGELOG](../CHANGELOG.md) - Chronological version history

---

## ✅ Document Checklist

Essential documentation (recommended for all projects):
- ✅ **README.md** - Project overview (already exists)
- ✅ **Design Document** - Game rules and logic
- ✅ **ADRs** - Key technical decisions
- ✅ **Test Cases** - Comprehensive test scenarios
- ✅ **CHANGELOG** - Version history

Optional documentation (add when needed):
- ⚠️ **API Documentation** - Only if building backend API
- ⚠️ **Architecture Diagram** - Only when > 1 service
- ⚠️ **CONTRIBUTING.md** - Only if open-source

Skipped documentation (enterprise overhead):
- ❌ Separate "How to Play" guide (folded into README)
- ❌ Separate API docs (no backend API yet)
- ❌ Compliance/security docs (not applicable)

---

## 📊 Documentation Stats

- **Total Documents:** 10
- **Core Docs:** 3 (Design, Tests, Changelog)
- **ADRs:** 2
- **Guides:** 5
- **Last Updated:** July 10, 2026
- **Completeness:** 100% ✅

---

**Questions?** Check the main [README](../README.md) or create an issue.

**Ready to code?** Start with the [Design Document](design.md)! 🚀
