# MindCare - Quick Start Guide

## 🚨 Fix "Failed to fetch" Error

This error means the **backend server is not running**!

---

## ⚡ Quick Start (Easiest Way)

### Windows:
```bash
start-dev.bat
```

### Mac/Linux:
```bash
chmod +x start-dev.sh
./start-dev.sh
```

This will:
1. ✅ Start MongoDB
2. ✅ Start Backend (port 5000)
3. ✅ Start Frontend (port 3000)
4. ✅ Open browser automatically

---

## 📋 Manual Start (Step by Step)

### Step 1: Start MongoDB
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Verify
mongosh
```

### Step 2: Start Backend (Terminal 1)
```bash
cd backend
npm install  # First time only
npm run dev
```

**Wait for:**
```
MongoDB Connected: localhost
Server running on port 5000
```

### Step 3: Start Frontend (Terminal 2)
```bash
cd frontend
npm install  # First time only
npm run dev
```

**Wait for:**
```
✓ Ready in 2.3s
```

### Step 4: Open Browser
```
http://localhost:3000
```

---

## ✅ Verify Everything Works

### Check Backend:
```bash
curl http://localhost:5000
# OR open in browser
```

### Check Frontend:
Open http://localhost:3000 in browser

### Check Console:
Press F12 in browser - should see NO "Failed to fetch" errors

---

## 🔧 Troubleshooting

### Error: "Failed to fetch"
**Solution:** Backend is not running
```bash
cd backend
npm run dev
```

### Error: "Port 5000 already in use"
**Solution:** Kill the process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Error: "Cannot connect to MongoDB"
**Solution:** Start MongoDB
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community
```

### Error: "Module not found"
**Solution:** Install dependencies
```bash
cd backend && npm install
cd frontend && npm install
```

---

## 📁 Project Structure

```
mindcare/
├── backend/          # Express + TypeScript API
│   ├── src/
│   ├── .env         # Backend config
│   └── package.json
├── frontend/        # Next.js + React
│   ├── app/
│   ├── components/
│   └── package.json
├── start-dev.bat    # Windows startup script
├── start-dev.sh     # Mac/Linux startup script
└── README.md
```

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| MongoDB | mongodb://localhost:27017 |

---

## 🎯 Development Workflow

### Daily:
1. Run `start-dev.bat` (Windows) or `./start-dev.sh` (Mac/Linux)
2. Code!
3. Changes auto-reload

### When Done:
- Press `Ctrl+C` in both terminals
- Optionally stop MongoDB

---

## 📝 Environment Variables

### Backend (.env)
Already configured in `backend/.env`

### Frontend (.env.local)
Create if needed:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🚀 Features to Test

1. **Landing Page** - http://localhost:3000
2. **Sign Up** - Create account
3. **Login** - Test authentication
4. **Dashboard** - View mental health stats
5. **AI Chat** - Talk to AI therapist
6. **Assessment** - Take mental health test
7. **Helpers** - Browse mental health professionals

---

## 📊 Debug Logs

Backend console will show detailed logs:
```
🔵 ===== AI CHAT REQUEST START =====
📨 User Message: "I'm feeling stressed"
😊 Mood Detected: { mood: 'stressed', score: 85 }
📊 Depression Analysis: { depressionScore: 45, riskLevel: 'Moderate' }
🧠 ===== CONTEXT SUMMARY =====
💬 AI Response: "What's been causing you stress?"
✅ ===== AI CHAT REQUEST COMPLETE =====
```

---

## 🆘 Need Help?

1. Check `START_SERVERS.md` for detailed guide
2. Check `DEBUG_LOGS_GUIDE.md` for debugging
3. Check both terminal outputs for errors
4. Check browser console (F12) for errors

---

## ✨ You're Ready!

Backend + Frontend + MongoDB = 🚀

Happy coding! 💻
