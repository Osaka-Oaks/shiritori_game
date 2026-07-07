# Kanban board (label-based)

GitHub Issues use **status labels** as columns. See also [COMMITS.md](COMMITS.md) for linking work to pushes.

## Cron schedule (UTC)

| Schedule | Workflow | Job |
|----------|----------|-----|
| `*/15 * * * *` | `uptime.yml` | Ping live site |
| `0 5 * * *` | `stale.yml` | Mark stale issues/PRs |
| `0 6 * * 1` | `security.yml` | CodeQL weekly |
| `0 8 * * 1` | `cron-jobs.yml` | Weekly work digest |
| `0 9 * * 1` | `deps-monitor.yml` | Dependency report |
| `0 9 1 * *` | `cron-jobs.yml` | Monthly workflow health + label sync |

Manual runs: Actions → **Cron jobs** → Run workflow.

## Columns

| Label                 | Meaning                    |
| --------------------- | -------------------------- |
| `status: triage`      | New — needs prioritization |
| `status: backlog`     | Accepted, not started      |
| `status: ready`       | Ready to pick up           |
| `status: in progress` | Someone is working on it   |
| `status: review`      | PR open / in code review   |
| `status: done`        | Shipped or resolved        |
| `status: blocked`     | Waiting on dependency      |
| `status: stale`       | Inactive 30+ days          |

## Automation

| Event               | Workflow             | Action                                      |
| ------------------- | -------------------- | ------------------------------------------- |
| Issue opened        | `kanban.yml`         | → `status: triage`                          |
| PR opened           | `kanban.yml`         | → `status: in progress`                     |
| PR ready for review | `kanban.yml`         | → `status: review`                          |
| PR merged           | `kanban.yml`         | → `status: done` + comment on linked issues |
| Push with `#123`    | `commit-tracker.yml` | Comment on issue #123                       |
| PR path changed     | `labels.yml`         | Auto `area:*` labels                        |
| Weekly Monday       | `cron-jobs.yml`      | Open digest issue                           |
| Daily               | `stale.yml`          | Mark inactive items stale                   |
| Every 15 min        | `uptime.yml`         | Ping live site                              |

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
