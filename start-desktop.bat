@echo off
REM Quick Start Script for Clinic Desktop App
REM Run this script to set up and start the desktop app

echo.
echo ====================================
echo Clinic Desktop App - Quick Start
echo ====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found
node --version

echo.
echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ✗ Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo Step 2: Starting development mode...
echo.
echo This will:
echo - Start Angular dev server (http://localhost:4200)
echo - Launch Electron desktop app
echo - Support hot-reload on file changes
echo.
pause

call npm run electron-dev

pause
