# Pull request template (markdown)

Copy into PR description if the auto-template does not appear.

---

## What & why

<!-- What does this change and why? -->

Closes #

## Work item

- [ ] Linked to an issue (`Closes #` or `Refs #`)
- [ ] Correct `type:` / `area:` labels applied

## Type of change

- [ ] Bug fix (`fix`)
- [ ] Feature (`feat`)
- [ ] Solo / levels / dev test
- [ ] Infrastructure (Terraform / OpenTofu)
- [ ] Refactor / chore
- [ ] Docs
- [ ] CI/CD

## Checklist

- [ ] `npm run validate` passes (or `flutter analyze` + `flutter test` for Flutter-only)
- [ ] `terraform validate` / `tofu validate` if IaC changed
- [ ] No secrets / keys committed
- [ ] Commit messages reference issues (`Refs #123`)

## Screenshots / plan output

<!-- Optional -->
