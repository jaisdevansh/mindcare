#!/bin/bash

echo "========================================"
echo "  MindCare Development Server Startup"
echo "========================================"
echo ""

# Check if MongoDB is running
echo "[1/4] Checking MongoDB..."
if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✓ MongoDB is already running"
else
    echo "Starting MongoDB..."
    if command -v brew &> /dev/null; then
        brew services start mongodb-community
    elif command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
    else
        echo "⚠ Please start MongoDB manually"
    fi
    sleep 2
fi
echo ""

# Start Backend
echo "[2/4] Starting Backend Server..."
if command -v osascript &> /dev/null; then
    # macOS
    osascript -e "tell app \"Terminal\" to do script \"cd $(pwd)/backend && npm run dev\""
elif command -v gnome-terminal &> /dev/null; then
    # Linux with GNOME
    gnome-terminal -- bash -c "cd $(pwd)/backend && npm run dev; exec bash"
else
    # Fallback
    cd backend && npm run dev &
    cd ..
fi
echo "✓ Backend starting on http://localhost:5000"
sleep 3
echo ""

# Start Frontend
echo "[3/4] Starting Frontend Server..."
if command -v osascript &> /dev/null; then
    # macOS
    osascript -e "tell app \"Terminal\" to do script \"cd $(pwd)/frontend && npm run dev\""
elif command -v gnome-terminal &> /dev/null; then
    # Linux with GNOME
    gnome-terminal -- bash -c "cd $(pwd)/frontend && npm run dev; exec bash"
else
    # Fallback
    cd frontend && npm run dev &
    cd ..
fi
echo "✓ Frontend starting on http://localhost:3000"
echo ""

# Wait and open browser
echo "[4/4] Waiting for servers to start..."
sleep 5
echo ""

echo "========================================"
echo "  Servers Started Successfully!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Opening browser..."

# Open browser
if command -v open &> /dev/null; then
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
else
    echo "Please open http://localhost:3000 in your browser"
fi

echo ""
echo "✓ Development environment ready!"
echo ""
