# 🚀 Vercel Deployment Guide

## ✅ Deploy shiritori-online (React App)

The shiritori-online app is **ready to deploy** and has been successfully built.

### Quick Deploy to Vercel

#### Option 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /Users/jarrel/Documents/Github/shiritori_game
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Link to existing project? No (or Yes if exists)
# - Project name: shiritori-online
# - Directory: ./
# - Build settings: Use vercel.json

# Production deployment
vercel --prod
```

#### Option 2: Vercel Dashboard
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `.` (use vercel.json)
   - **Build Command:** `npm run build`
   - **Output Directory:** `shiritori-online/dist`
5. Click "Deploy"

### Current Configuration (`@/Users/jarrel/Documents/Github/shiritori_game/vercel.json:1-25`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "shiritori-online/dist",
  "framework": null,
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=shiritori-game-ccaae.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://shiritori-game-ccaae-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=shiritori-game-ccaae
VITE_FIREBASE_STORAGE_BUCKET=shiritori-game-ccaae.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 🔧 Flutter Web Deployment (In Progress)

The Flutter app has some compilation errors that need fixing before deployment. Here's the status:

### Issues to Fix

1. **Flame API Updates** - Particle system API changed
2. **Router Configuration** - Needs uid parameter fix  
3. **Type Safety** - Some double/num conversions needed

### Once Fixed, Deploy Flutter Web

```bash
# Build for web
cd shiritori_flutter
flutter build web --release

# Deploy to Vercel
vercel --cwd=. --name=shiritori-flutter-web
```

**Flutter Vercel Config:** `@/Users/jarrel/Documents/Github/shiritori_game/shiritori_flutter/vercel.json:1-43`

---

## 🎯 Deployment Status

| Project | Status | URL |
|---------|--------|-----|
| **shiritori-online** | ✅ Ready to Deploy | TBD |
| **kawaii-shiritori** | ✅ Deployed to Firebase | https://shiritori-game-ccaae.web.app |
| **shiritori_flutter** | ⚠️ Needs fixes | TBD |

---

## 📝 Post-Deployment Steps

### 1. Test the Deployment
```bash
# Visit your Vercel URL
# Test all features:
- Home page loads
- Game creation works
- Firebase connection OK
- Realtime sync functional
```

###2. Configure Custom Domain (Optional)
1. Go to Vercel Dashboard → Domains
2. Add your domain
3. Update DNS records
4. Wait for SSL certificate

### 3. Monitor Performance
- Check Vercel Analytics
- Monitor Firebase usage
- Review error logs

---

## 🚀 Quick Deploy Command

```bash
# From project root
vercel --prod
```

That's it! Your Shiritori game will be live on Vercel! 🎉

---

## 🔍 Troubleshooting

### Build Fails
```bash
# Check build locally first
npm run build

# Check logs
vercel logs [deployment-url]
```

### Environment Variables Not Working
- Ensure they're prefixed with `VITE_`
- Redeploy after adding variables
- Check capitalization

### Firebase Connection Issues
- Verify all Firebase environment variables
- Check Firebase console for API restrictions
- Ensure domain is whitelisted in Firebase

---

## ✅ Ready to Deploy!

**shiritori-online is production-ready.** Run `vercel` to deploy now!

