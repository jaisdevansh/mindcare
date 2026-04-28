# 🚨 URGENT: OAuth Redirect URI Fix

## Problem
OAuth providers (Google & GitHub) are rejecting login because redirect URIs don't match.

## Current Backend URL
`https://mindcare-7ljj.onrender.com`

## Required OAuth Settings

### 1. Google Cloud Console
**Go to**: https://console.cloud.google.com/apis/credentials

**Find your OAuth 2.0 Client ID**: `1057720435880-j60lrdhukk076dqht13lukljmaltkkv0.apps.googleusercontent.com`

**Add these Authorized Redirect URIs**:
```
https://mindcare-7ljj.onrender.com/auth/google/callback
```

### 2. GitHub OAuth App
**Go to**: https://github.com/settings/developers

**Find your OAuth App**: `Ov23liSypL2bfWNkRX6U`

**Update Authorization Callback URL**:
```
https://mindcare-7ljj.onrender.com/auth/github/callback
```

## Step-by-Step Fix

### Google OAuth:
1. Go to https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. In "Authorized redirect URIs" section, click "ADD URI"
4. Add: `https://mindcare-7ljj.onrender.com/auth/google/callback`
5. Click "SAVE"

### GitHub OAuth:
1. Go to https://github.com/settings/developers
2. Click on your OAuth App
3. In "Authorization callback URL" field, enter: `https://mindcare-7ljj.onrender.com/auth/github/callback`
4. Click "Update application"

## Test After Update
1. Wait 2-3 minutes for changes to propagate
2. Try OAuth login again
3. Should work without redirect errors

## Current Error Messages:
- **GitHub**: "redirect_uri is not associated with this application"
- **Google**: "Error 400: redirect_uri_mismatch"

These will be fixed once you update the OAuth provider settings with the correct callback URLs.

---
**Fix these OAuth settings immediately to enable social login! 🔧**