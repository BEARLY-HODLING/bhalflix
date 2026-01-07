#!/bin/bash

# WatchPicker Launcher
# Double-click this file to start the app

cd "$(dirname "$0")"

echo "🎬 Starting WatchPicker..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (first time only)..."
    npm install
fi

# Open browser after a short delay (gives server time to start)
(sleep 2 && open http://localhost:5173) &

# Start the dev server
echo "🚀 Server starting at http://localhost:5173"
echo "   Press Ctrl+C to stop"
echo ""
npm run dev
