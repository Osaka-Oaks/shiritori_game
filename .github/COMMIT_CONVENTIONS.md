# 📝 Commit Conventions & Git Workflow

Complete guide to commit conventions, branching, and project management for Shiritori Game.

---

## 🎯 Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

**Must** be one of the following:

| Type       | Description                           | Example                                     |
| ---------- | ------------------------------------- | ------------------------------------------- |
| `feat`     | New feature                           | `feat: add floating dictionary widget`      |
| `fix`      | Bug fix                               | `fix: resolve deployment script error`      |
| `docs`     | Documentation only                    | `docs: update README with deployment guide` |
| `style`    | Code style changes (formatting, etc.) | `style: format code with prettier`          |
| `refactor` | Code refactoring                      | `refactor: simplify game logic`             |
| `perf`     | Performance improvements              | `perf: optimize build time with caching`    |
| `test`     | Adding or updating tests              | `test: add unit tests for dictionary`       |
| `build`    | Build system or dependencies          | `build: upgrade vite to v8`                 |
| `ci`       | CI/CD changes                         | `ci: add automated deployment`              |
| `chore`    | Maintenance tasks                     | `chore: update dependencies`                |
| `revert`   | Revert previous commit                | `revert: revert "feat: add feature X"`      |
| `security` | Security fixes                        | `security: patch XSS vulnerability`         |

### Scope

**Optional** but recommended. Indicates what part of the codebase is affected.

**Common scopes:**

- `online` - shiritori-online app
- `kawaii` - kawaii-shiritori app
- `ci` - CI/CD pipeline
- `deps` - Dependencies
- `firebase` - Firebase configuration
- `docs` - Documentation
- `ui` - User interface
- `api` - API changes
- `auth` - Authentication
- `db` - Database

### Subject

- Use imperative, present tense: "add" not "added" nor "adds"
- Don't capitalize first letter
- No period (.) at the end
- Limit to 50 characters

### Body

**Optional** - Provide additional context:

- Wrap at 72 characters
- Explain what and why, not how
- Use bullet points for multiple items

### Footer

**Optional** - Reference issues and breaking changes:

- Reference issues: `Closes #123`, `Fixes #456`, `Resolves #789`
- Breaking changes: `BREAKING CHANGE: <description>`

---

## ✅ Examples

### Good Commits

```bash
# Feature with scope
feat(online): add real-time multiplayer mode

# Bug fix with issue reference
fix(kawaii): resolve game freeze on word submission

Fixes #234

# Security fix
security(auth): patch JWT token validation vulnerability

# Documentation
docs: add deployment guide to README

# Performance improvement with details
perf(build): reduce build time by 40%

- Added Vite build caching
- Parallelized ESLint checks
- Optimized dependency installation

Closes #156

# Breaking change
feat(api): change game state API structure

BREAKING CHANGE: Game state now uses flat structure instead of nested.
Migration guide added to MIGRATION.md

Closes #178
```

### Bad Commits ❌

```bash
# Too vague
fix: bug fix

# No type
add dictionary feature

# Wrong tense
feat: added new feature

# Too long subject
feat: add a really cool new feature that does a lot of things and is super awesome

# Missing issue reference for bug fix
fix: fixed the thing
```

---

## 🌿 Branching Strategy

### Branch Types

```
main
  └── production (protected)
       └── Auto-deploys to https://shiritori-game-ccaae.web.app

develop
  └── staging (protected)
       └── Auto-deploys to preview channel

feature/<name>
  └── New features
       └── Merged into develop via PR

fix/<name>
  └── Bug fixes
       └── Merged into develop via PR

hotfix/<name>
  └── Critical production fixes
       └── Merged into main via PR, then backported to develop

release/<version>
  └── Release preparation
       └── Merged into main and develop
```

### Branch Naming

**Format:** `<type>/<issue-number>-<short-description>`

**Examples:**

```bash
feature/123-floating-dictionary
fix/456-game-freeze
hotfix/789-security-patch
chore/update-dependencies
docs/improve-readme
```

**Rules:**

- Use lowercase
- Use hyphens for spaces
- Keep it short but descriptive
- Include issue number when applicable

---

## 🔄 Workflow

### Feature Development

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/123-awesome-feature

# 2. Make changes and commit
git add .
git commit -m "feat(kawaii): add awesome feature

Implements the awesome feature that does X, Y, and Z.

Closes #123"

# 3. Push and create PR
git push origin feature/123-awesome-feature
# Open PR: feature/123-awesome-feature → develop

# 4. After approval, squash and merge
# GitHub will auto-close #123

# 5. Delete branch
git branch -d feature/123-awesome-feature
git push origin --delete feature/123-awesome-feature
```

### Bug Fix

```bash
# 1. Create fix branch
git checkout develop
git pull origin develop
git checkout -b fix/456-game-freeze

# 2. Fix the bug
git add .
git commit -m "fix(kawaii): resolve game freeze on word submission

The game was freezing when submitting certain Unicode characters.
Added proper validation and error handling.

Fixes #456"

# 3. Push and PR
git push origin fix/456-game-freeze
# PR: fix/456-game-freeze → develop
```

### Hotfix (Production)

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/789-critical-bug

# 2. Fix immediately
git add .
git commit -m "fix(online): patch critical security vulnerability

SECURITY FIX: Patched XSS vulnerability in user input.

Fixes #789"

# 3. PR to main (urgent)
git push origin hotfix/789-critical-bug
# PR: hotfix/789-critical-bug → main

# 4. After merge, backport to develop
git checkout develop
git pull origin develop
git merge main
git push origin develop
```

---

## 📊 Issue & PR Management

### Labels

#### Type Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `feature` - New feature implementation
- `documentation` - Documentation improvements
- `security` - Security issues or improvements
- `performance` - Performance improvements
- `dependencies` - Dependency updates

#### Priority Labels

- `priority:critical` - Drop everything and fix
- `priority:high` - Fix ASAP
- `priority:medium` - Normal priority
- `priority:low` - Nice to have

#### Status Labels

- `status:in-progress` - Currently being worked on
- `status:blocked` - Blocked by something
- `status:review` - Needs review
- `status:testing` - In testing
- `stale` - No recent activity

#### Component Labels

- `app:online` - shiritori-online
- `app:kawaii` - kawaii-shiritori
- `ci/cd` - CI/CD pipeline
- `firebase` - Firebase related
- `ui` - User interface

#### Size Labels (Auto-added)

- `size/XS` - <10 lines changed
- `size/S` - <50 lines
- `size/M` - <200 lines
- `size/L` - <500 lines
- `size/XL` - 500+ lines

### Issue Templates

Use appropriate template when creating issues:

1. **Bug Report** - For bugs
2. **Feature Request** - For new features
3. **Work Item** - For tasks/chores
4. **Dev Test** - For testing tasks

### PR Best Practices

**Title:** Follow commit convention

```
feat(kawaii): add floating dictionary
fix(online): resolve connection timeout
```

**Description:** Use the template

```markdown
## Changes

- Added floating dictionary widget
- Integrated Jisho.org API
- Added tests

## Testing

- [ ] Local build passes
- [ ] Tests pass
- [ ] Manually tested on mobile

## Screenshots

[Add if UI changes]

## Related Issues

Closes #123
```

**Reviews:**

- Request review from team member
- Address all comments
- Update branch if needed
- Squash commits before merging

---

## 🤖 Automation

### Auto-Labeling

Issues and PRs are automatically labeled based on:

- Title prefix (feat:, fix:, docs:, etc.)
- Content keywords
- File paths changed
- PR size

### Auto-Assignment

- Issue creators are auto-assigned
- PR authors are auto-assigned

### Auto-Linking

- PRs are linked to issues (Closes #123)
- Cross-references are created

### Stale Management

- Issues inactive for 60 days → marked stale
- PRs inactive for 60 days → marked stale
- Stale items closed after 7-14 days
- Exempt: pinned, security, critical priority

---

## 📈 Project Board

### Columns

1. **📋 Backlog** - Not started
2. **🎯 Todo** - Ready to work on
3. **🚧 In Progress** - Currently being worked on
4. **👀 Review** - In code review
5. **🧪 Testing** - Being tested
6. **✅ Done** - Completed

### Automation

Issues/PRs automatically move between columns:

- **Opened** → Backlog
- **Assigned** → Todo
- **PR opened** → In Progress → Review
- **PR approved** → Testing
- **Closed** → Done

---

## 🎯 Quick Reference

### Common Commands

```bash
# Start new feature
git checkout develop && git pull && git checkout -b feature/123-name

# Commit with convention
git commit -m "feat(scope): subject"

# Push and create PR
git push origin feature/123-name

# Update from develop
git checkout develop && git pull
git checkout feature/123-name
git rebase develop

# Squash commits before merge
git rebase -i HEAD~3  # Interactive rebase last 3 commits

# Amend last commit
git commit --amend

# Revert a commit
git revert <commit-hash>
```

### Commit Message Template

Save to `.gitmessage`:

```
<type>(<scope>): <subject>

# Why this change?
<body>

# What does it affect?
<footer>

# Examples:
# feat(kawaii): add floating dictionary
# fix(online): resolve timeout issue
# docs: update README
#
# Closes #123
```

Set as default:

```bash
git config commit.template .gitmessage
```

---

## 📚 Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

## ✅ Checklist

### Before Commit

- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console.logs or debug code
- [ ] Commit message follows convention

### Before PR

- [ ] Branch up to date with develop
- [ ] All tests pass locally
- [ ] PR template filled out
- [ ] Linked to issue(s)
- [ ] Labels added
- [ ] Reviewer assigned

### Before Merge

- [ ] All CI checks pass
- [ ] Code reviewed and approved
- [ ] No merge conflicts
- [ ] Squash commits if needed
- [ ] Delete branch after merge

---

**Following these conventions helps:**

- 📝 Generate changelogs automatically
- 🔍 Search commits by type
- 🤖 Automate workflows
- 📊 Track project metrics
- 👥 Improve team collaboration

---

_Last updated: July 2026_  
_Enforced by: CI/CD automation_  
_Questions? Create an issue!_
