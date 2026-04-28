# Frontend-Backend Connection Setup ✅

## Backend Deployed: `https://mindcare-7ljj.onrender.com`

---

## ✅ Frontend Updated

### File: `frontend/.env.local`

```bash
NEXT_PUBLIC_API_URL=https://mindcare-7ljj.onrender.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

**Status:** ✅ Done!

---

## ⚠️ Backend Environment Variables (Render)

**IMPORTANT:** Update these in Render Dashboard:

1. Go to: https://dashboard.render.com
2. Select your service: `mindcare-7ljj`
3. Go to **Environment** tab
4. Update/Add these variables:

```bash
# CRITICAL - Update this!
FRONTEND_URL=https://your-frontend-url.vercel.app

# Or if testing locally:
FRONTEND_URL=http://localhost:3000

# Backend URL (already correct)
API_URL=https://mindcare-7ljj.onrender.com
```

---

## 🔄 CORS Configuration

Your backend already has dynamic CORS:

```typescript
cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
})
```

So just update `FRONTEND_URL` in Render environment variables!

---

## 🧪 Test Connection

### 1. Test Backend Health:
```bash
curl https://mindcare-7ljj.onrender.com/health
```

Expected: `{"status":"ok","message":"Server is running"}`

### 2. Test API Endpoint:
```bash
curl https://mindcare-7ljj.onrender.com/api/users
```

### 3. Test from Frontend:
```javascript
// In browser console
fetch('https://mindcare-7ljj.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 📋 Deployment Checklist

### Frontend:
- [x] `.env.local` updated with backend URL
- [ ] Restart dev server: `npm run dev`
- [ ] Test API calls
- [ ] Deploy to Vercel (optional)

### Backend (Render):
- [x] Service deployed
- [ ] Update `FRONTEND_URL` in environment variables
- [ ] Redeploy if needed
- [ ] Check logs for CORS errors

---

## 🚀 Next Steps

### If Testing Locally:

1. **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Opens: `http://localhost:3000`

2. **Backend:** Already running on Render
   URL: `https://mindcare-7ljj.onrender.com`

3. **Test:** Login, assessment, AI chat

---

### If Deploying Frontend to Vercel:

1. Push code to GitHub
2. Go to: https://vercel.com
3. Import repository
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://mindcare-7ljj.onrender.com/api
   ```
5. Deploy!
6. Update `FRONTEND_URL` in Render with Vercel URL

---

## ⚠️ Important Notes

### Free Tier Limitations:
- Backend sleeps after 15 min inactivity
- First request after sleep = slow (30-60 seconds)
- Subsequent requests = fast

### Solution:
- Upgrade to Starter plan ($7/month) for always-on
- OR use cron job to ping every 10 minutes

### CORS Issues:
If you see CORS errors:
1. Check `FRONTEND_URL` in Render matches your frontend URL
2. Redeploy backend after changing env vars
3. Clear browser cache

---

## 🎯 Quick Test Commands

```bash
# Test backend health
curl https://mindcare-7ljj.onrender.com/health

# Test API endpoint
curl https://mindcare-7ljj.onrender.com/api/health

# Check if backend is awake
curl -I https://mindcare-7ljj.onrender.com
```

---

## ✅ Connection Status

- Frontend API URL: ✅ Updated
- Backend URL: ✅ `https://mindcare-7ljj.onrender.com`
- CORS: ⚠️ Update `FRONTEND_URL` in Render
- Ready to test: ✅ Yes!

---

**Bhai, ab:**
1. Render mein `FRONTEND_URL` update karo
2. Frontend restart karo: `npm run dev`
3. Test karo!

**All set! 🚀💙**
