@echo off
echo ========================================
echo   MindCare Development Server Startup
echo ========================================
echo.

REM Check if MongoDB is running
echo [1/4] Checking MongoDB...
mongosh --eval "db.adminCommand('ping')" >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB is not running. Starting MongoDB...
    net start MongoDB
    timeout /t 2 >nul
) else (
    echo MongoDB is already running
)
echo.

REM Start Backend
echo [2/4] Starting Backend Server...
start "MindCare Backend" cmd /k "cd backend && npm run dev"
echo Backend starting on http://localhost:5000
timeout /t 3 >nul
echo.

REM Start Frontend
echo [3/4] Starting Frontend Server...
start "MindCare Frontend" cmd /k "cd frontend && npm run dev"
echo Frontend starting on http://localhost:3000
echo.

REM Wait and open browser
echo [4/4] Waiting for servers to start...
timeout /t 5 >nul
echo.

echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Opening browser...
start http://localhost:3000
echo.
echo Press any key to exit this window...
echo (Backend and Frontend will keep running)
pause >nul
