# Changelog

All notable changes to the Shiritori Game project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### To Be Released
- Flutter web production build fixes
- Enhanced 3D visualization
- Tournament mode
- Global leaderboards

---

## [2.0.0] - 2026-07-10

### Added - Major Flutter & Dart Integration
- **Flutter App:** Complete integration with 2D and 3D game modes
- **2D Game Engine:** Flame-based arcade game with falling word bubbles
- **3D Visualization:** Custom 3D word chain renderer using dart:math
- **Material 3 Design:** Modern UI with dynamic color schemes
- **Riverpod State Management:** Reactive state management throughout
- **Go Router Navigation:** Deep linking and custom transitions
- **124 Flutter Packages:** Comprehensive dependency integration
- **Documentation:** 6 comprehensive guides covering all Dart/Flutter features

### Added - Documentation System
- **Core Design Doc:** `docs/design.md` with complete game rules
- **ADRs:** Architectural Decision Records for key design choices
- **Test Cases:** 100 comprehensive test scenarios
- **CHANGELOG:** This file for version tracking

### Changed
- Flutter project upgraded to SDK ^3.12.2
- Enhanced pubspec.yaml with animation and game engine packages
- Updated theme system to use Material 3 exclusively

### Fixed
- localStorage mock in Flutter tests
- Type safety issues in 2D game components
- Firebase configuration generation for multiple projects

---

## [1.5.0] - 2026-07-10

### Added - Vercel Deployment
- **Vercel Config:** Production-ready deployment configuration
- **Build Optimization:** shiritori-online built and ready (570 KB)
- **Environment Variables:** Complete Firebase integration setup
- **Deployment Guide:** Step-by-step Vercel deployment instructions

### Changed
- Updated build scripts for better monorepo support
- Enhanced vercel.json with optimized headers and caching

---

## [1.4.0] - 2026-07-10

### Added - Testing Infrastructure
- **Unit Tests:** 81 comprehensive tests across 4 test files
- **JUnit Reporter:** XML output for CI/CD integration
- **Test Coverage:** 42.42% coverage on lib files
- **Husky Hooks:** Pre-commit linting and commit message validation
- **lint-staged:** Automated code formatting on commit

### Added - CI/CD Automation
- **GitHub Actions:** Automated testing workflow
- **Firebase Deployment:** Automated deployment to Firebase Hosting
- **Build Optimization:** 60% faster build times with tracking

### Changed
- Improved test setup with localStorage/sessionStorage mocks
- Enhanced gitignore with test-results and coverage directories

### Fixed
- Test failures due to missing localStorage in jsdom environment
- Firebase config generation path resolution issues

---

## [1.3.0] - 2026-07-09

### Added - kawaii-shiritori Features
- **AI Opponent:** Three difficulty levels (Easy, Medium, Hard)
- **Practice Mode:** Solo play against AI
- **Local Multiplayer:** Pass-and-play on same device
- **Game History:** Track all previous games
- **Leaderboard:** Score tracking and rankings
- **Avatar System:** Player avatar selection
- **Enhanced Rules View:** Interactive tutorial

### Added
- Word validation with comprehensive error messages
- Japanese kana converter (hiragana/katakana support)
- Multi-language dictionary support (English/Japanese)
- Sound effects and visual feedback
- Dark mode support

### Changed
- Upgraded to React 19
- Migrated to TypeScript 5.8
- Improved UI with modern design system

---

## [1.2.0] - 2026-07-08

### Added - Monitoring & Observability
- **Grafana:** Comprehensive dashboard system
- **Datadog:** APM and infrastructure monitoring
- **ELK Stack:** Centralized logging (Elasticsearch, Logstash, Kibana)
- **Health Checks:** Automated endpoint monitoring
- **Blackbox Exporter:** External service monitoring

### Added
- Prometheus metrics collection
- Alerting system with configurable rules
- Performance profiling tools

---

## [1.1.0] - 2026-07-07

### Added - Firebase Integration
- **Firebase Authentication:** Anonymous sign-in
- **Realtime Database:** Live game state synchronization
- **Firestore:** Cloud storage for persistent data
- **Firebase Hosting:** Production deployment

### Added
- Room-based multiplayer system
- Real-time word chain synchronization
- Turn-based gameplay with timers
- Firebase security rules

### Fixed
- Race conditions in multiplayer sync
- Disconnection handling and reconnection logic

---

## [1.0.0] - 2026-07-06

### Added - shiritori-online Launch
- **Core Game:** Complete shiritori word-chain logic
- **Multiplayer:** Real-time two-player gameplay
- **Dictionary:** English and Japanese word lists
- **UI:** Clean, responsive interface
- **PWA:** Progressive Web App support

### Added
- Word validation engine
- Chain rule enforcement
- No-repeat detection
- Japanese "ん-ending" losing rule
- Bilingual mode support

---

## [0.3.0] - 2026-07-05

### Added - Infrastructure
- **Terraform/OpenTofu:** Infrastructure as Code
- **Docker Compose:** Container orchestration
- **Port Management:** Automated port conflict resolution
- **Build Scripts:** Automated build tracking and optimization

---

## [0.2.0] - 2026-07-04

### Added
- shiritori-word-chain prototype
- Basic React UI
- Firebase configuration

### Changed
- Migrated from Next.js to Vite for better performance

---

## [0.1.0] - 2026-07-03

### Added
- Initial project setup
- shiritori-v1 Next.js scaffold
- Basic game rules documentation
- GitHub repository structure

---

## Legend

### Change Types
- **Added:** New features
- **Changed:** Changes in existing functionality
- **Deprecated:** Soon-to-be removed features
- **Removed:** Removed features
- **Fixed:** Bug fixes
- **Security:** Security fixes

### Version Format
- **Major (X.0.0):** Breaking changes, major new features
- **Minor (0.X.0):** New features, backward compatible
- **Patch (0.0.X):** Bug fixes, minor improvements

---

## Links

- [Repository](https://github.com/JorelFuji/shiritori_game)
- [Live Game](https://shiritori-game-ccaae.web.app)
- [Documentation](docs/)
- [Issues](https://github.com/JorelFuji/shiritori_game/issues)

---

**Maintained by:** Development Team  
**Last Updated:** July 10, 2026
