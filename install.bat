@echo off
echo Installing CodeShare Application...
echo.

echo Installing backend dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd client
npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Installation completed successfully!
echo.
echo To start the application, run: npm run dev
echo.
echo The application will be available at:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5000
echo.
pause 