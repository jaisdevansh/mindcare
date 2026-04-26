# How to Start MindCare Servers

## Error: "Failed to fetch"
This means the backend server is not running!

---

## Prerequisites

### 1. MongoDB Running
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# Windows:
net start MongoDB

# Mac/Linux:
sudo systemctl start mongod
# OR
brew services start mongodb-community
```

### 2. Node Modules Installed
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

---

## Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

**Expected Output:**
```
[nodemon] starting `ts-node src/server.ts`
MongoDB Connected: localhost
Server running on port 5000

🔵 ===== AI CHAT REQUEST START ===== (when you use AI chat)
```

**If you see errors:**

### Error: "Cannot connect to MongoDB"
```bash
# Start MongoDB first
mongosh
# If connection fails, check MongoDB installation
```

### Error: "Port 5000 already in use"
```bash
# Kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

---

## Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Starting...
✓ Ready in 2.3s
```

---

## Verify Everything is Running

### 1. Check Backend
Open browser: http://localhost:5000

**Expected:** Some response (even if error page, means server is running)

### 2. Check Frontend
Open browser: http://localhost:3000

**Expected:** MindCare landing page loads

### 3. Check API Connection
Open browser console (F12) on http://localhost:3000

**Expected:** No "Failed to fetch" errors

---

## Quick Start Script

### Windows (PowerShell)
Create `start.ps1`:
```powershell
# Start MongoDB
net start MongoDB

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait 3 seconds
Start-Sleep -Seconds 3

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "✅ Servers starting..."
Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:3000"
```

Run:
```bash
powershell -ExecutionPolicy Bypass -File start.ps1
```

### Mac/Linux (Bash)
Create `start.sh`:
```bash
#!/bin/bash

# Start MongoDB
brew services start mongodb-community

# Start Backend in new terminal
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/backend && npm run dev"'

# Wait 3 seconds
sleep 3

# Start Frontend in new terminal
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/frontend && npm run dev"'

echo "✅ Servers starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
```

Run:
```bash
chmod +x start.sh
./start.sh
```

---

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mindcare
JWT_SECRET=your_secret_here
GEMINI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000
```

### Frontend (.env.local)
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Troubleshooting

### Issue 1: "Failed to fetch" on Frontend
**Cause:** Backend not running

**Solution:**
1. Open Terminal 1
2. `cd backend`
3. `npm run dev`
4. Wait for "Server running on port 5000"
5. Refresh frontend

---

### Issue 2: "Cannot GET /"
**Cause:** Wrong URL or backend not started

**Solution:**
- Backend should be: http://localhost:5000
- Frontend should be: http://localhost:3000
- Don't mix them up!

---

### Issue 3: "CORS Error"
**Cause:** Frontend URL not in backend CORS config

**Solution:**
Check `backend/src/app.ts`:
```typescript
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
```

---

### Issue 4: MongoDB Connection Failed
**Cause:** MongoDB not running

**Solution:**
```bash
# Check MongoDB status
mongosh

# If fails, start MongoDB:
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

---

## Development Workflow

### Daily Startup:
1. Start MongoDB (if not auto-start)
2. Terminal 1: `cd backend && npm run dev`
3. Terminal 2: `cd frontend && npm run dev`
4. Open http://localhost:3000

### When Making Changes:
- **Backend changes:** Server auto-restarts (nodemon)
- **Frontend changes:** Page auto-refreshes (Next.js HMR)

### When Done:
- Press `Ctrl+C` in both terminals
- Optionally stop MongoDB:
  ```bash
  # Windows:
  net stop MongoDB
  
  # Mac:
  brew services stop mongodb-community
  ```

---

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 5000 | http://localhost:5000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

---

## Health Check

### Backend Health:
```bash
curl http://localhost:5000/auth/health
# OR open in browser
```

### Frontend Health:
```bash
curl http://localhost:3000
# OR open in browser
```

### MongoDB Health:
```bash
mongosh --eval "db.adminCommand('ping')"
```

---

## Common Commands

### Backend:
```bash
cd backend
npm run dev      # Development
npm run build    # Build for production
npm start        # Run production build
```

### Frontend:
```bash
cd frontend
npm run dev      # Development
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Lint code
```

---

## Status Indicators

### ✅ Everything Working:
- Backend terminal shows: "Server running on port 5000"
- Frontend terminal shows: "Ready in X.Xs"
- Browser loads http://localhost:3000 without errors
- No "Failed to fetch" in console

### ❌ Something Wrong:
- Backend terminal shows errors
- Frontend shows "Failed to fetch"
- Browser console has errors
- Pages don't load

---

## Quick Fix Checklist

- [ ] MongoDB is running
- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend terminal shows "Ready"
- [ ] No port conflicts (5000, 3000)
- [ ] .env files exist and have correct values
- [ ] node_modules installed in both folders
- [ ] No firewall blocking localhost

---

## Need Help?

1. Check both terminal outputs for errors
2. Check browser console (F12) for errors
3. Verify MongoDB is running: `mongosh`
4. Verify ports are free: `netstat -ano | findstr :5000`
5. Check logs in `backend/backend_log.txt`

---

## Ready to Start! 🚀

1. Open Terminal 1: `cd backend && npm run dev`
2. Open Terminal 2: `cd frontend && npm run dev`
3. Open Browser: http://localhost:3000
4. Start coding! 💻
