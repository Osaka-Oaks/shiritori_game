# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| `main`  | ✅        |

## Reporting a Vulnerability

We take security issues seriously. If you discover a vulnerability, please report it responsibly.

**Do not** open a public GitHub issue for security-sensitive findings.

### How to report

1. Email the maintainers with a description of the issue, steps to reproduce, and impact assessment.
2. Allow up to **72 hours** for an initial response.
3. Work with us on a fix before public disclosure.

### What to include

- Affected app (`shiritori-online`, `kawaii-shiritori`, `shiritori_flutter`, etc.)
- Environment (production URL, local dev, browser/OS)
- Proof of concept or reproduction steps
- Suggested fix (optional)

### Our commitment

- Acknowledge receipt within 72 hours
- Provide a status update within 7 days
- Credit researchers in release notes when fixes ship (unless you prefer anonymity)

## Security Practices

- Client Firebase API keys are public by design; access is enforced via Firebase security rules.
- Local demo auth in `kawaii-shiritori` stores **SHA-256 password hashes** only — not plaintext passwords.
- Express dev servers use an in-memory rate limiter on API routes.

## Scope

In scope: authentication flaws, injection, data exposure, privilege escalation, and denial-of-service in project-owned code and deployments.

Out of scope: social engineering, physical attacks, and issues in third-party services outside our control.
