# Infrastructure (IaC)

Terraform and OpenTofu templates for cloud resources that complement Firebase hosting.

| Tool | Path | CLI |
|------|------|-----|
| **Terraform** | `infra/terraform/` | `terraform` |
| **OpenTofu** | `infra/opentofu/` | `tofu` |

Both use the same HCL syntax. Keep module interfaces aligned when changing either tree.

## Layout

```
infra/
├── README.md                 # This file
├── terraform/
│   ├── README.md
│   ├── environments/
│   │   └── dev/              # Root module per environment
│   └── modules/
│       └── _template/        # Copy to create new modules
└── opentofu/
    ├── README.md
    ├── environments/
    │   └── dev/
    └── modules/
        └── _template/
```

## Quick start

**From repo root** (not from inside `environments/dev`):

```bash
# One command — both stacks
bash infra/validate-iac.sh

# Or manually (after installing CLIs):
cd infra/terraform/environments/dev && terraform init -backend=false && terraform validate
cd ../../../../opentofu/environments/dev && tofu init -backend=false && tofu validate
```

### Install CLIs (macOS)

```bash
brew install hashicorp/tap/terraform opentofu
```

### Terraform only

```bash
cd infra/terraform/environments/dev
terraform init
terraform fmt -recursive ../..
terraform validate
terraform plan
```

### OpenTofu

```bash
cd infra/opentofu/environments/dev
tofu init
tofu fmt -recursive ../..
tofu validate
tofu plan
```

## Issues & PRs

Use the **Infrastructure** issue template (form or markdown):

- `.github/ISSUE_TEMPLATE/infrastructure.yml`
- `.github/templates/issue-infrastructure.md`

Label: `area: infra`

## Secrets

Never commit `.tfvars` with secrets. Use:

- GitHub Actions secrets for CI
- `TF_VAR_*` environment variables locally
- Remote state with encrypted backend (configure in `backend.tf`)
