@echo off
chcp 65001 >nul
echo ============================================
echo 🚀 Study Garden - Backend Server
echo ============================================
echo.

REM Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found!
    echo.
    echo Please install Node.js first:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version
echo.

REM Check backend folder
if not exist "backend" (
    echo ❌ Backend folder not found!
    pause
    exit /b 1
)

REM Check if dependencies installed
if not exist "backend\node_modules" (
    echo ⚠️  Dependencies not installed!
    echo.
    echo Running setup first...
    echo.
    call setup-backend.bat
    if %ERRORLEVEL% NEQ 0 exit /b 1
)

echo ✅ Dependencies found
echo.

echo 🔌 Starting backend server...
echo.
echo 📍 Server: http://localhost:8000
echo 📍 API: http://localhost:8000/api/
echo.
echo 💡 Press Ctrl+C to stop
echo.
echo ============================================
echo.

cd backend
node server.js
