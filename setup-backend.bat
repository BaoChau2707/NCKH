@echo off
chcp 65001 >nul
echo ============================================
echo 🚀 Study Garden - Backend Setup
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
npm --version
echo.

REM Check backend folder
if not exist "backend" (
    echo ❌ Backend folder not found!
    pause
    exit /b 1
)

echo ✅ Backend folder found
echo.

echo 📦 Installing dependencies...
echo.

cd backend
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Installation failed!
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed!
echo.
echo 🎉 Setup complete!
echo.
echo 📝 Next steps:
echo    1. Update backend/.env with your MySQL password
echo    2. Run: start-backend.bat
echo.
pause
