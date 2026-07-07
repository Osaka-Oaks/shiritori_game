---
name: 🏗️ Infrastructure (markdown)
about: Terraform / OpenTofu / cloud IaC — markdown flavor
title: "[Infra]: "
labels: ["area: infra", "status: triage"]
assignees: ""
---

<!-- Full template: .github/templates/issue-infrastructure.md -->

## IaC tool

- [ ] Terraform (`infra/terraform/`)
- [ ] OpenTofu (`infra/opentofu/`)

## Environment

- [ ] dev / staging / production

## What to change

| Resource | Action                    | Notes |
| -------- | ------------------------- | ----- |
|          | create / update / destroy |       |

## Module path

`infra/terraform/modules/<name>`

## Plan output

```text
(paste terraform plan / tofu plan summary)
```

## Checklist

- [ ] `terraform fmt` / `tofu fmt`
- [ ] `terraform validate` / `tofu validate`
- [ ] No secrets in `.tf` files

---

**Hashtags:** #infra #terraform #opentofu
