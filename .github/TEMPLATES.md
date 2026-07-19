# Templates index

Issue, work-item, PR, and infrastructure templates for this monorepo.

## GitHub issue picker (forms + markdown)

| Template       | Form (`.yml`)                                             | Markdown (`.md`)                                        |
| -------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| Bug            | [bug_report.yml](ISSUE_TEMPLATE/bug_report.yml)           | [bug_report.md](ISSUE_TEMPLATE/bug_report.md)           |
| Feature        | [feature_request.yml](ISSUE_TEMPLATE/feature_request.yml) | [feature_request.md](ISSUE_TEMPLATE/feature_request.md) |
| Work item      | [work_item.yml](ISSUE_TEMPLATE/work_item.yml)             | [work_item.md](ISSUE_TEMPLATE/work_item.md)             |
| Dev / test     | [dev_test.yml](ISSUE_TEMPLATE/dev_test.yml)               | [dev_test.md](ISSUE_TEMPLATE/dev_test.md)               |
| Infrastructure | [infrastructure.yml](ISSUE_TEMPLATE/infrastructure.yml)   | [infrastructure.md](ISSUE_TEMPLATE/infrastructure.md)   |

Config: [ISSUE_TEMPLATE/config.yml](ISSUE_TEMPLATE/config.yml) — links to live app, markdown templates, and `infra/`.

## Markdown flavor library (copy-paste)

Full bodies in [templates/](templates/):

- [issue-bug.md](templates/issue-bug.md)
- [issue-feature.md](templates/issue-feature.md)
- [issue-work-item.md](templates/issue-work-item.md)
- [issue-dev-test.md](templates/issue-dev-test.md)
- [issue-infrastructure.md](templates/issue-infrastructure.md) — **Terraform & OpenTofu**
- [pull-request.md](templates/pull-request.md)

## Pull requests

Auto-applied: [pull_request_template.md](pull_request_template.md)

## Labels

| Label                         | Use                                         |
| ----------------------------- | ------------------------------------------- |
| `status:*`                    | Kanban columns — see [KANBAN.md](KANBAN.md) |
| `type: bug` / `type: feature` | Issue kind                                  |
| `area: shiritori-online`      | React production app                        |
| `area: kawaii-shiritori`      | React prototype                             |
| `area: flutter`               | `shiritori_flutter/`                        |
| `area: infra`                 | `infra/terraform/`, `infra/opentofu/`       |
| `area: ci/cd`                 | Workflows & scripts                         |

Synced from [labels.yml](labels.yml). Path auto-labels: [labeler.yml](labeler.yml).

## Infrastructure (Terraform / OpenTofu)

```
infra/
├── terraform/          # terraform CLI
│   ├── environments/dev/
│   └── modules/_template/
└── opentofu/           # tofu CLI (same HCL)
    ├── environments/dev/
    └── modules/_template/
```

Docs: [../infra/README.md](../infra/README.md)

**Workflow for infra issues:**

1. Open issue with **Infrastructure** template
2. Run `terraform plan` or `tofu plan`
3. Paste plan summary into issue
4. PR with `area: infra` label; validate before merge

## Hashtags (optional in issues)

`#bug` `#feature` `#work-item` `#qa` `#infra` `#terraform` `#opentofu` `#kanban`
