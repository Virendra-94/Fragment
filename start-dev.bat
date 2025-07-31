@echo off
echo Starting CodeShare Development Environment...
echo.

echo Starting backend server on port 5000...
start "Backend Server" cmd /k "npm run server"

echo.
echo Starting frontend development server on port 3000...
start "Frontend Server" cmd /k "cd client && npm start"

echo.
echo Both servers are starting...
echo.
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:5000
echo.
echo Press any key to close this window...
pause > nul 