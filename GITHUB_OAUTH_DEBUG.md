# 🔍 GitHub OAuth Debug Guide

## Current Configuration ✅
- **GitHub Client ID**: `Ov23liSypL2bfWNkRX6U`
- **Callback URL**: `https://mindcare-7ljj.onrender.com/auth/github/callback` ✅
- **Frontend API URL**: `https://mindcare-7ljj.onrender.com` ✅
- **Backend Routes**: `/auth/github` and `/auth/github/callback` ✅

## Debug Steps

### 1. Test Backend Health
```bash
curl https://mindcare-7ljj.onrender.com/api/health
```

### 2. Test GitHub OAuth Route
```bash
curl -I https://mindcare-7ljj.onrender.com/auth/github
```
Should return 302 redirect to GitHub

### 3. Check Backend Logs
- Go to Render dashboard
- Check service logs for errors
- Look for OAuth-related errors

### 4. Test OAuth Flow Manually
1. Open: `https://mindcare-7ljj.onrender.com/auth/github`
2. Should redirect to GitHub authorization
3. After authorization, should redirect back to callback

## Possible Issues

### Issue 1: Backend Not Running
- Check Render service status
- Verify deployment is successful
- Check for build/runtime errors

### Issue 2: Route Not Mounted
- Verify auth routes are properly mounted in app.ts
- Check if `/auth` prefix is correct

### Issue 3: Environment Variables
- Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set in Render
- Check if `API_URL` and `FRONTEND_URL` are correct

### Issue 4: CORS Issues
- Verify CORS is configured for frontend domain
- Check if preflight requests are handled

## Quick Test Commands

### Test from Browser Console:
```javascript
// Test if backend is accessible
fetch('https://mindcare-7ljj.onrender.com/auth/github')
  .then(response => console.log('Status:', response.status))
  .catch(error => console.error('Error:', error));
```

### Test OAuth Redirect:
```javascript
// This should redirect to GitHub
window.location.href = 'https://mindcare-7ljj.onrender.com/auth/github';
```

## Expected OAuth Flow

1. **User clicks GitHub button**
   ```
   Frontend: https://mindcare-frontend.vercel.app
   ```

2. **Redirects to backend OAuth route**
   ```
   Backend: https://mindcare-7ljj.onrender.com/auth/github
   ```

3. **Backend redirects to GitHub**
   ```
   GitHub: https://github.com/login/oauth/authorize?client_id=...
   ```

4. **User authorizes on GitHub**
   ```
   User clicks "Authorize" on GitHub
   ```

5. **GitHub redirects back to callback**
   ```
   Backend: https://mindcare-7ljj.onrender.com/auth/github/callback?code=...
   ```

6. **Backend processes and redirects to frontend**
   ```
   Frontend: https://mindcare-frontend.vercel.app/login?token=...
   ```

## Immediate Actions

1. **Check Render Service Status**
2. **Verify Environment Variables**
3. **Test Backend OAuth Route Directly**
4. **Check Backend Logs for Errors**

---

**If backend is down or not responding, that's the root cause! 🚨**