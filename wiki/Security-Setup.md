# 🔒 Security Setup

Configure secrets and environment variables for CI/CD deployment.

---

## 📋 Overview

The Shiritori Game project requires:
- **Firebase deployment token** (for CI/CD)
- **Firebase client configuration** (for building apps)
- **Optional observability credentials** (Datadog, Grafana)

---

## 🔑 Required: Firebase Token

### Generate Token

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login and generate CI token
firebase login:ci

# Output example:
# ✔ Success! Use this token to login on a CI server:
# 1//0gABCdefGHIjklMNOpqrSTUvwxyz...
```

**Copy the token** - you'll need it in the next step.

### Add to GitHub Secrets

**Option 1: GitHub CLI**

```bash
gh secret set FIREBASE_TOKEN
# Paste token when prompted
```

**Option 2: GitHub Web UI**

1. Go to repository **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `FIREBASE_TOKEN`
5. Secret: (paste your token)
6. Click **Add secret**

---

## 📊 Required: Firebase Configuration

### Get Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `shiritori-game-ccaae`
3. Click ⚙️ **Settings** → **Project settings**
4. Scroll to **Your apps** → Click your **Web app**
5. Copy the config object

### Add as GitHub Variables

These can be **Repository Variables** (not secrets) since they're client-side config.

**Using GitHub CLI:**

```bash
gh secret set VITE_FIREBASE_API_KEY
gh secret set VITE_FIREBASE_AUTH_DOMAIN
gh secret set VITE_FIREBASE_DATABASE_URL
gh secret set VITE_FIREBASE_PROJECT_ID
gh secret set VITE_FIREBASE_STORAGE_BUCKET
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID
gh secret set VITE_FIREBASE_APP_ID
gh secret set VITE_FIREBASE_MEASUREMENT_ID
```

**Using GitHub Web UI:**

Settings → Secrets and variables → Actions → **Variables** tab

Add each variable:

| Name | Value Source |
|------|--------------|
| `VITE_FIREBASE_API_KEY` | From Firebase Console config |
| `VITE_FIREBASE_AUTH_DOMAIN` | `shiritori-game-ccaae.firebaseapp.com` |
| `VITE_FIREBASE_DATABASE_URL` | `https://shiritori-game-ccaae-default-rtdb.firebaseio.com` |
| `VITE_FIREBASE_PROJECT_ID` | `shiritori-game-ccaae` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `shiritori-game-ccaae.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | From Firebase Console |
| `VITE_FIREBASE_APP_ID` | From Firebase Console |
| `VITE_FIREBASE_MEASUREMENT_ID` | From Firebase Console (optional) |

---

## 🔧 Optional: Observability Secrets

### Datadog

If using Datadog for metrics:

```bash
gh secret set DATADOG_API_KEY
gh secret set DATADOG_SITE  # e.g., datadoghq.com
```

### Grafana Cloud

If using Grafana Cloud:

```bash
gh secret set GRAFANA_CLOUD_API_KEY
gh secret set GRAFANA_CLOUD_STACK_URL
gh secret set GRAFANA_CLOUD_METRICS_URL
gh secret set GRAFANA_CLOUD_INSTANCE_ID
```

### Elasticsearch

If using ELK stack:

```bash
gh secret set ELASTICSEARCH_URL
```

**Note:** All observability secrets are optional. Workflows skip the push if unset.

---

## ✅ Verification

### Check Secrets Are Set

```bash
# List all secrets (values are hidden)
gh secret list
```

Expected output:
```
FIREBASE_TOKEN                Updated 2026-07-06
VITE_FIREBASE_API_KEY        Updated 2026-07-06
VITE_FIREBASE_APP_ID         Updated 2026-07-06
...
```

### Test Firebase Token

```bash
# Verify token works
firebase projects:list --token "$FIREBASE_TOKEN"
```

Should list `shiritori-game-ccaae`.

### Test CI Build

```bash
# Trigger CI workflow
git commit --allow-empty -m "test: verify CI secrets"
git push

# Watch run
gh run watch

# Or view logs
gh run list
gh run view --log
```

---

## 🦊 GitLab Setup

If using GitLab CI/CD instead of GitHub Actions:

**GitLab Settings → CI/CD → Variables**

Add the same secrets:

| Variable | Type | Protected | Masked |
|----------|------|-----------|--------|
| `FIREBASE_TOKEN` | Variable | ✅ Yes | ✅ Yes |
| `VITE_FIREBASE_API_KEY` | Variable | ❌ No | ❌ No |
| All other `VITE_*` | Variable | ❌ No | ❌ No |

See full guide: [GITLAB_SETUP.md](https://jorelfuji.github.io/shiritori_game/deployment/gitlab.html)

---

## 🐛 Troubleshooting

### "Missing Firebase environment variables"

**Error in build:**
```
Error: Missing Firebase environment variables: VITE_FIREBASE_API_KEY
```

**Solution:**
1. Check secrets: `gh secret list`
2. Verify all `VITE_FIREBASE_*` are set
3. Check workflow has `env:` block in build job

### "FIREBASE_TOKEN not set"

**Error in deploy:**
```
Error: FIREBASE_TOKEN not set
```

**Solution:**
```bash
# Regenerate token
firebase login:ci

# Update secret
gh secret set FIREBASE_TOKEN
```

### "HTTP 401 Unauthorized"

**Cause:** Firebase token expired or invalid

**Solution:**
```bash
# Logout and re-login
firebase logout
firebase login:ci

# Update secret
gh secret set FIREBASE_TOKEN
```

---

## 🔒 Security Best Practices

### ✅ Do

- **Use secrets for `FIREBASE_TOKEN`** - It's a deployment credential
- **Rotate tokens every 90 days** - Generate new token regularly
- **Never commit `.env` files** - Use `.env.example` only
- **Use GitHub Actions variables for Firebase config** - They're public by design
- **Test in staging first** - Before deploying to production

### ❌ Don't

- **Don't share tokens in Slack/email** - Use secure channels
- **Don't commit real secrets** - Only templates
- **Don't use personal credentials** - Use project service accounts
- **Don't skip Firebase Security Rules** - Client keys need rule enforcement

---

## 📚 Complete Guide

For the full secrets setup guide with all options:

**[GITHUB_SECRETS_SETUP.md](https://jorelfuji.github.io/shiritori_game/security/github-secrets.html)**

Includes:
- Detailed setup instructions
- All optional secrets
- Bulk import methods
- Troubleshooting guides
- Security best practices

---

## 📞 Need Help?

- **Full Setup Guide:** [GITHUB_SECRETS_SETUP.md](https://github.com/JorelFuji/shiritori_game/blob/main/GITHUB_SECRETS_SETUP.md)
- **Security Policy:** [SECURITY.md](https://jorelfuji.github.io/shiritori_game/security/policy.html)
- **Issues:** [GitHub Issues](https://github.com/JorelFuji/shiritori_game/issues)

---

**Next:** [Deployment Guide](Deployment) - Deploy your configured project
