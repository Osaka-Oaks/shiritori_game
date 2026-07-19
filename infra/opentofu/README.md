# OpenTofu

[OpenTofu](https://opentofu.org/) is an open-source Terraform fork. HCL modules here mirror `infra/terraform/` — keep them in sync.

## CLI

Use `tofu` instead of `terraform`:

```bash
cd environments/dev
tofu init
tofu fmt -recursive ../..
tofu validate
tofu plan
```

## Create a new module

```bash
cp -r modules/_template modules/<name>
```

## Backend

See `modules/_template/backend.tf.example` — OpenTofu supports the same backends as Terraform.

## Issue template

`.github/templates/issue-infrastructure.md` — select **OpenTofu** as IaC tool.
