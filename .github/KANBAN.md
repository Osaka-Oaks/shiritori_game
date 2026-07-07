# Kanban board (label-based)

GitHub Issues use **status labels** as columns. Filter issues by label in the Issues tab, or connect a [GitHub Project](https://docs.github.com/en/issues/planning-and-tracking-with-projects) board.

## Columns

| Label | Meaning |
|-------|---------|
| `status: triage` | New — needs prioritization |
| `status: backlog` | Accepted, not started |
| `status: ready` | Ready to pick up |
| `status: in progress` | Someone is working on it |
| `status: review` | PR open / in code review |
| `status: done` | Shipped or resolved |
| `status: blocked` | Waiting on dependency |
| `status: stale` | Inactive 30+ days |

## Automation

| Event | Workflow | Action |
|-------|----------|--------|
| Issue opened | `kanban.yml` | → `status: triage` |
| PR opened | `kanban.yml` | → `status: in progress` |
| PR ready for review | `kanban.yml` | → `status: review` |
| PR merged | `kanban.yml` | → `status: done` + comment on linked issues |
| Push with `#123` | `commit-tracker.yml` | Comment on issue #123 |
| PR path changed | `labels.yml` | Auto `area:*` labels |
| Weekly Monday | `cron-jobs.yml` | Open digest issue |
| Daily | `stale.yml` | Mark inactive items stale |
| Every 15 min | `uptime.yml` | Ping live site |

## GitHub Project (optional)

1. Create a **Project** board in the repo/org.
2. Set repository variable `PROJECT_URL` (Settings → Secrets and variables → Actions → Variables).
3. Add secret `ADD_TO_PROJECT_PAT` (PAT with `project` scope).
4. `labels.yml` workflow will auto-add new issues/PRs to the board.

## Quick filters

- **My backlog:** `is:issue is:open label:"status: backlog"`
- **In flight:** `is:open label:"status: in progress"`
- **Solo/levels:** `label:"game: solo" OR label:"game: levels"`
- **CI failures:** `label:"action: ci"`
