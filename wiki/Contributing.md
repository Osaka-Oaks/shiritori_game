# 🤝 Contributing Guide

Thank you for contributing to the Shiritori Game project!

---

## 📋 Ways to Contribute

- 🐛 **Report bugs** - File issues
- ✨ **Suggest features** - Share ideas
- 📝 **Improve documentation** - Fix typos, add examples
- 🔧 **Submit pull requests** - Fix bugs or add features
- 💬 **Help others** - Answer questions in Discussions

---

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork on GitHub (click Fork button)

# Clone your fork
git clone https://github.com/YOUR_USERNAME/shiritori_game.git
cd shiritori_game

# Add upstream remote
git remote add upstream https://github.com/JorelFuji/shiritori_game.git
```

### 2. Set Up Development Environment

See [Getting Started](Getting-Started) for full setup instructions.

**Quick setup:**

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with Firebase credentials

# Run dev server
npm run dev:online
```

### 3. Create a Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/amazing-feature

# Or for bug fixes
git checkout -b fix/bug-description
```

---

## 📝 Making Changes

### Code Style

We use ESLint and Prettier for consistent code style.

```bash
# Check linting
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format
```

**Style guidelines:**

- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use meaningful variable names

### Testing

```bash
# Run all tests
npm test

# Run tests for specific app
cd shiritori-online && npm test
cd kawaii-shiritori && npm test

# Watch mode
npm test -- --watch
```

**Testing requirements:**

- Add tests for new features
- Update tests for bug fixes
- Maintain or improve code coverage
- All tests must pass before PR

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature
git commit -m "feat: add multiplayer chat feature"

# Bug fix
git commit -m "fix: resolve word validation issue"

# Documentation
git commit -m "docs: update installation guide"

# Refactor
git commit -m "refactor: improve game state management"

# Test
git commit -m "test: add tests for dictionary lookup"

# Chore
git commit -m "chore: update dependencies"
```

**Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, no code change
- `refactor` - Code change that neither fixes nor adds
- `test` - Adding tests
- `chore` - Maintenance

---

## 🔄 Submitting Pull Requests

### 1. Push Your Changes

```bash
# Add and commit changes
git add .
git commit -m "feat: your feature description"

# Push to your fork
git push origin feature/amazing-feature
```

### 2. Create Pull Request

1. Go to your fork on GitHub
2. Click **Compare & pull request**
3. Fill in the PR template:
   - **Title** - Clear, concise description
   - **Description** - What and why
   - **Related Issues** - Link issues (#123)
   - **Testing** - How you tested
   - **Screenshots** - For UI changes

**PR Template:**

```markdown
## Description
Brief description of changes

## Related Issues
Closes #123

## Changes Made
- Added feature X
- Fixed bug Y
- Updated docs for Z

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] CI/CD passes

## Screenshots
(If applicable)
```

### 3. Review Process

**What happens next:**

1. **Automated checks run** - Linting, tests, builds
2. **Maintainers review** - Code review and feedback
3. **Address feedback** - Make requested changes
4. **Approval** - Maintainer approves PR
5. **Merge** - PR merged to main

**Tips for faster review:**

- Keep PRs focused and small
- Write clear descriptions
- Add tests
- Respond to feedback promptly
- Keep CI passing

---

## 🐛 Reporting Bugs

### Before Submitting

1. **Search existing issues** - Check if already reported
2. **Verify bug exists** - Can you reproduce it?
3. **Gather information** - Logs, screenshots, steps

### Bug Report Template

```markdown
**Describe the bug**
Clear description of what the bug is

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 22]

**Additional context**
Any other relevant information
```

[Create Bug Report](https://github.com/JorelFuji/shiritori_game/issues/new?template=bug_report.md)

---

## ✨ Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other solutions you thought about

**Additional context**
Mockups, examples, etc.
```

[Request Feature](https://github.com/JorelFuji/shiritori_game/issues/new?template=feature_request.md)

---

## 📚 Documentation

### Improving Docs

Documentation improvements are always welcome:

- Fix typos and grammar
- Add examples
- Clarify confusing sections
- Add missing documentation
- Update outdated information

**Documentation locations:**

- **Wiki** - `wiki/` directory
- **Docs Site** - `docs/` directory  
- **README** - Root and app-specific
- **Code Comments** - JSDoc/TSDoc

---

## 🔒 Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead:
1. Email: [security email]
2. Or use GitHub Security Advisory

See [Security Policy](https://jorelfuji.github.io/shiritori_game/security/policy.html) for details.

---

## 🎯 Good First Issues

Looking for something to work on?

- Check [Good First Issue](https://github.com/JorelFuji/shiritori_game/labels/good%20first%20issue) label
- Check [Help Wanted](https://github.com/JorelFuji/shiritori_game/labels/help%20wanted) label
- Ask in [Discussions](https://github.com/JorelFuji/shiritori_game/discussions)

---

## 📞 Getting Help

Need help contributing?

- **Discussions** - [Ask questions](https://github.com/JorelFuji/shiritori_game/discussions)
- **Issues** - [Existing issues](https://github.com/JorelFuji/shiritori_game/issues)
- **Documentation** - [Full docs](https://jorelfuji.github.io/shiritori_game)

---

## ✅ Checklist

Before submitting PR:

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No console errors
- [ ] Commit messages follow convention
- [ ] PR description is clear

---

## 🙏 Thank You!

Your contributions make this project better. We appreciate your time and effort!

---

**Previous:** [Deployment Guide](Deployment)

**Home:** [Wiki Home](Home)
