# 🚀 MindCare Deployment Guide

## Backend Deployment on Render

### Step 1: MongoDB Atlas Setup
1. Create free MongoDB Atlas account
2. Create cluster (M0 Free tier)
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/mindcare`
4. Whitelist all IPs (0.0.0.0/0) in Network Access

### Step 2: Render Configuration
1. Go to https://render.com and sign up with GitHub
2. Create new Web Service
3. Connect your repository
4. Configure:
   - **Name**: mindcare-backend
   - **Branch**: main or master
   - **Root Directory**: backend (if in subfolder)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Step 3: Environment Variables
Add these environment variables in Render:

```bash
PORT=5000
NODE_ENV=production
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://your-frontend-url.vercel.app
API_URL=https://your-backend-url.onrender.com
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### Step 4: OAuth Configuration
After deployment, update OAuth redirect URIs:

**Google Cloud Console:**
- Authorized Redirect URI: `https://your-backend-url.onrender.com/auth/google/callback`

**GitHub OAuth App:**
- Authorization Callback URL: `https://your-backend-url.onrender.com/auth/github/callback`

## Frontend Deployment on Vercel

### Step 1: Vercel Setup
1. Go to https://vercel.com and sign up with GitHub
2. Import your repository
3. Configure build settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: frontend (if in subfolder)

### Step 2: Environment Variables
Add in Vercel dashboard:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key
```

## Testing Deployment

### Backend Health Check
```bash
curl https://your-backend-url.onrender.com/api/health
```

### Frontend Access
Visit your Vercel URL and test:
- User registration/login
- OAuth login (Google/GitHub)
- AI chat functionality
- Dynamic assessments

## Troubleshooting

### Common Issues:
1. **OAuth Callback Errors**: Verify redirect URIs match deployment URLs
2. **Database Connection**: Check MongoDB Atlas IP whitelist and connection string
3. **CORS Errors**: Ensure frontend URL is added to CORS configuration
4. **Environment Variables**: Verify all required variables are set correctly

### Logs:
- **Render**: Check service logs in dashboard
- **Vercel**: Check function logs in dashboard
- **MongoDB**: Check Atlas monitoring

## Security Notes

- Never commit `.env` files to GitHub
- Use GitHub Secrets for sensitive data in CI/CD
- Regularly rotate API keys and secrets
- Enable GitHub secret scanning alerts
- Use environment-specific configurations

## Post-Deployment Checklist

- [ ] Backend health endpoint responds
- [ ] Database connection successful
- [ ] OAuth providers configured
- [ ] Frontend connects to backend
- [ ] All features working end-to-end
- [ ] Error monitoring set up
- [ ] SSL certificates active
- [ ] Domain configured (if custom)

## Monitoring & Maintenance

### Performance Monitoring:
- Render: Built-in metrics dashboard
- Vercel: Analytics and performance insights
- MongoDB Atlas: Database performance monitoring

### Regular Tasks:
- Monitor error logs
- Update dependencies
- Backup database
- Review security alerts
- Performance optimization

---

**Happy Deploying! 🚀**