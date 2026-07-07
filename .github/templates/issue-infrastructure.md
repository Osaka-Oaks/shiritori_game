# Infrastructure template (markdown)

**Title:** `[Infra]: <short summary>`

**Labels:** `area: infra`, `status: triage`

---

## IaC tool

- [ ] Terraform (`infra/terraform/`)
- [ ] OpenTofu (`infra/opentofu/`)
- [ ] Both (keep modules in sync)
- [ ] Firebase / hosting only (no IaC change)

## Environment

- [ ] dev
- [ ] staging
- [ ] production

## What to change

Describe resources, modules, or config to add/update/destroy.

| Resource | Action                    | Notes |
| -------- | ------------------------- | ----- |
|          | create / update / destroy |       |

## Module path (if applicable)

`infra/terraform/modules/<name>` or `infra/opentofu/modules/<name>`

## Variables / secrets

List new variables. **Do not paste secret values** — name the secret store (GitHub Actions, Firebase, etc.).

## Plan output (paste after `terraform plan` / `tofu plan`)

```text
(paste plan summary)
```

## Rollback

How to revert if this fails in production.

## Checklist

- [ ] `terraform fmt` / `tofu fmt` run
- [ ] `terraform validate` / `tofu validate` pass
- [ ] State backend configured (remote state)
- [ ] No secrets in `.tf` files
- [ ] README updated in `infra/terraform/` or `infra/opentofu/`

---

**Hashtags:** #infra #terraform #opentofu #iac
