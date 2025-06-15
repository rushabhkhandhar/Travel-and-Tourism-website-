@echo off
REM Travel Tourism Application - Setup Script (Windows)
echo 🚀 Setting up Travel Tourism Application...
echo ==========================================

REM Check if we're in the right directory
if not exist "travel_backend" (
    echo ❌ Error: Please run this script from the root directory of the project
    echo    (where travel_backend and frontend directories are located^)
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Error: Please run this script from the root directory of the project
    echo    (where travel_backend and frontend directories are located^)
    pause
    exit /b 1
)

echo 📂 Setting up Backend...
cd travel_backend

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo 🐍 Creating virtual environment...
python -m venv venv

echo 🔧 Activating virtual environment...
call venv\Scripts\activate

echo 📦 Installing Python dependencies...
pip install -r requirements.txt

echo 🗄️ Running database migrations...
python manage.py migrate

echo 🌟 Adding sample data (IMPORTANT!)...
python add_sample_data.py

echo ✅ Backend setup complete!
echo.

REM Setup Frontend
echo 📂 Setting up Frontend...
cd ..\frontend

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: npm is not installed. Please install Node.js and npm.
    pause
    exit /b 1
)

echo 📦 Installing Node.js dependencies...
npm install

echo ✅ Frontend setup complete!
echo.

echo 🎉 Setup Complete!
echo ==================
echo.
echo To start the application:
echo.
echo 1. Start Backend (in one command prompt):
echo    cd travel_backend
echo    venv\Scripts\activate
echo    python manage.py runserver
echo.
echo 2. Start Frontend (in another command prompt):
echo    cd frontend
echo    npm start
echo.
echo 3. Open http://localhost:3000 in your browser
echo.
echo 🚨 Note: Both servers need to be running for the application to work properly!
pause
