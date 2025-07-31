#!/bin/bash

echo "Starting CodeShare Development Environment..."
echo

echo "Starting backend server on port 5000..."
npm run server &
BACKEND_PID=$!

echo
echo "Starting frontend development server on port 3000..."
cd client && npm start &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API will be available at: http://localhost:5000"
echo
echo "Press Ctrl+C to stop both servers..."

# Wait for user to stop
wait

# Cleanup
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null 