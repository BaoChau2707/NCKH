@echo off
chcp 65001 >nul
echo ============================================
echo 🗄️ Study Garden - Database Initialization
echo ============================================
echo.

REM Find MySQL
set MYSQL_PATH=
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
) else if exist "C:\Program Files\MySQL\MySQL Server 8.3\bin\mysql.exe" (
    set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.3\bin\mysql.exe
) else (
    echo ❌ MySQL not found!
    pause
    exit /b 1
)

echo ✅ MySQL found
echo.

echo 📝 Enter MySQL root password:
set /p MYSQL_PASS=Password: 

echo.
echo 🔌 Testing connection...
"%MYSQL_PATH%" -u root -p%MYSQL_PASS% -e "SELECT 1;" >nul 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Connection failed! Check password.
    pause
    exit /b 1
)

echo ✅ Connected!
echo.

echo 📦 Creating database...
"%MYSQL_PATH%" -u root -p%MYSQL_PASS% -e "CREATE DATABASE IF NOT EXISTS study_garden CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo ✅ Database created!
echo.

echo 📥 Importing schema...
"%MYSQL_PATH%" -u root -p%MYSQL_PASS% study_garden < database-schema.sql

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Import failed!
    pause
    exit /b 1
)

echo ✅ Schema imported!
echo.

echo 🧪 Verifying...
"%MYSQL_PATH%" -u root -p%MYSQL_PASS% study_garden -e "SHOW TABLES;"

echo.
echo 🎉 Database ready!
echo.
echo 📝 Now update backend/.env with your password:
echo    DB_PASS=%MYSQL_PASS%
echo.
pause
