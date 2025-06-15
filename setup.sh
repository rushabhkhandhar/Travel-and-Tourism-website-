#!/bin/bash

# Travel Tourism Application - Setup Script
echo "🚀 Setting up Travel Tourism Application..."
echo "=========================================="

# Check if we're in the right directory
if [ ! -d "travel_backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the root directory of the project"
    echo "   (where travel_backend and frontend directories are located)"
    exit 1
fi

echo "📂 Setting up Backend..."
cd travel_backend

# Check if Python is available
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Use python3 if python is not available
PYTHON_CMD="python"
if ! command -v python &> /dev/null; then
    PYTHON_CMD="python3"
fi

echo "🐍 Creating virtual environment..."
$PYTHON_CMD -m venv venv

echo "🔧 Activating virtual environment..."
source venv/bin/activate

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "🗄️ Running database migrations..."
$PYTHON_CMD manage.py migrate

echo "🌟 Adding sample data (IMPORTANT!)..."
$PYTHON_CMD add_sample_data.py

echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
echo "📂 Setting up Frontend..."
cd ../frontend

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install Node.js and npm."
    exit 1
fi

echo "📦 Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start Backend (in one terminal):"
echo "   cd travel_backend"
echo "   source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "   python manage.py runserver"
echo ""
echo "2. Start Frontend (in another terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "🚨 Note: Both servers need to be running for the application to work properly!"
