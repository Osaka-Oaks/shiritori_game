# Firebase Deployment Guide

## Prerequisites

1. Install Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Login to Firebase:

```bash
firebase login
```

## Setup

### 1. Configure Firebase Project

Edit `.firebaserc` and replace `your-firebase-project-id` with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "shiritori-game-12345"
  }
}
```

### 2. Configure Firebase App

Update `src/lib/firebase-applet-config.json` with your Firebase configuration:

```json
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abcdef",
  "firestoreDatabaseId": "(default)"
}
```

### 3. Initialize Firebase (First Time Only)

```bash
firebase init
```

Select:

- ✅ Firestore
- ✅ Hosting
- ✅ Storage

## Deployment Commands

### Deploy Everything

```bash
npm run deploy
```

### Deploy Only Hosting (Frontend)

```bash
npm run deploy:hosting
```

### Deploy Only Firestore Rules & Indexes

```bash
npm run deploy:firestore
```

### Deploy Only Storage Rules

```bash
npm run deploy:storage
```

## Manual Deployment Steps

### 1. Build the Project

```bash
npm run build
```

### 2. Deploy to Firebase

```bash
firebase deploy
```

## Firestore Indexes

The following indexes are automatically created:

1. **Leaderboard Query**: Sort by `totalScore` (desc) and `lastPlayedAt` (desc)
2. **User Games**: Filter by `userId` and sort by `playedAt` (desc)
3. **Difficulty Games**: Filter by `difficulty` and sort by `playedAt` (desc)

## Security Rules

### Firestore Rules (`firestore.rules`)

- Users can read all leaderboard entries
- Users can only write/update their own scores
- Game results are readable by all
- Admin operations require authentication

### Storage Rules (`storage.rules`)

- Anyone can read avatars
- Users can only upload to their own avatar folder
- Game screenshots are public read, authenticated write

## Environment Variables

Create a `.env` file (optional for local development):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## Monitoring

After deployment, monitor your app at:

- **Console**: https://console.firebase.google.com
- **Hosting URL**: https://your-project-id.web.app
- **Analytics**: Firebase Console > Analytics
- **Firestore**: Firebase Console > Firestore Database

## Rollback

To rollback to a previous deployment:

```bash
firebase hosting:clone SOURCE_SITE_ID:SOURCE_VERSION TARGET_SITE_ID
```

## Custom Domain

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration steps
4. Wait for SSL certificate provisioning (24-48 hours)

## Performance Tips

1. **Enable Caching**: Already configured in `firebase.json`
2. **Use CDN**: Firebase Hosting automatically uses CDN
3. **Compress Assets**: Vite automatically compresses during build
4. **Lazy Loading**: React components are code-split automatically

## Troubleshooting

### Build Fails

```bash
npm run clean
npm install
npm run build
```

### Deployment Fails

- Check Firebase CLI version: `firebase --version`
- Verify project ID in `.firebaserc`
- Ensure you're logged in: `firebase login`
- Check quota limits in Firebase Console

### Firestore Permission Denied

- Deploy Firestore rules: `npm run deploy:firestore`
- Check rules in Firebase Console
- Verify user authentication

## Cost Optimization

**Free Tier Limits (Spark Plan):**

- Hosting: 10 GB storage, 360 MB/day transfer
- Firestore: 1 GB storage, 50K reads, 20K writes, 20K deletes per day
- Cloud Functions: Not used (no cost)
- Storage: 5 GB, 1 GB/day downloads, 20K uploads per day

**Monitor Usage:**

- Firebase Console > Usage and billing
- Set up budget alerts

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: "${{ secrets.GITHUB_TOKEN }}"
          firebaseServiceAccount: "${{ secrets.FIREBASE_SERVICE_ACCOUNT }}"
          channelId: live
          projectId: your-project-id
```

## Support

For issues, check:

- Firebase Documentation: https://firebase.google.com/docs
- Firebase Support: https://firebase.google.com/support
- Project Issues: GitHub repository
