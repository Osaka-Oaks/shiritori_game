# Terraform

HashiCorp Terraform layout for Shiritori Game infrastructure.

## Create a new module

```bash
cp -r modules/_template modules/<name>
# Edit variables.tf, main.tf, outputs.tf
```

## Dev environment

```bash
cd environments/dev
terraform init
terraform plan -var="project_id=shiritori-game-ccaae"
```

## Files

| File           | Purpose                                           |
| -------------- | ------------------------------------------------- |
| `versions.tf`  | Terraform & provider pins                         |
| `variables.tf` | Input variables                                   |
| `main.tf`      | Resources (start commented — uncomment as needed) |
| `outputs.tf`   | Exported values                                   |
| `backend.tf`   | Remote state (uncomment & configure)              |

## Issue template

File infra work with `.github/ISSUE_TEMPLATE/infrastructure.yml` or `issue-infrastructure.md`.
