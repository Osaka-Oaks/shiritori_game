# Commit conventions

Link every commit and PR to work items so the kanban board stays accurate.

## Format

```
<type>(<scope>): <short summary>

[optional body]

Refs #123
Closes #456
```

### Types

| Type | Use for |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `test` | Tests / QA |
| `chore` | Tooling, deps, CI |
| `docs` | Documentation only |
| `refactor` | Code change, no behavior change |

### Scopes (optional)

`online`, `kawaii`, `solo`, `levels`, `ci`, `deploy`, `dict`

### Examples

```
feat(solo): add level 5 expert mode with dictionary check

Closes #42
```

```
fix(online): RTDB rules allow seated rematch

Refs #38
```

## PR → issue linking

In the PR description use:

- `Closes #123` — auto-closes issue on merge
- `Refs #123` — links without closing

The **commit-tracker** workflow comments on issues when commits mention `#123`.
The **kanban** workflow marks linked issues `status: done` when the PR merges.

## Branch names

```
feature/<short-description>   → new work
fix/<short-description>       → bug fixes
chore/<short-description>     → maintenance
```

See `.github/BRANCHING.md` for deploy branches (`main`, `develop`).
