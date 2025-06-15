# Travel Tourism Web Application

A full-stack travel and tourism web application built with React frontend and Django backend, featuring destination browsing, user authentication, bookings, and a favorites system.

##  Quick Start

### Option 1: Automated Setup 

**For Mac/Linux:**
```bash
# 1. Clone the repository
git clone https://github.com/rushabhkhandhar/Travel-and-Tourism-website-.git
cd Travel-and-Tourism-website-

# 2. Run the setup script
chmod +x setup.sh
./setup.sh
```

**For Windows:**
```cmd
# 1. Clone the repository
git clone https://github.com/rushabhkhandhar/Travel-and-Tourism-website-.git
cd Travel-and-Tourism-website-

# 2. Run the setup script
setup.bat
```

**After setup, start the servers:**
```bash
# Terminal 1 - Backend:
cd travel_backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver

# Terminal 2 - Frontend:
cd frontend
npm install
npm start

# Open http://localhost:3000 in your browser
```

### Option 2: Manual Setup
```bash
# 1. Clone the repository
git clone https://github.com/rushabhkhandhar/Travel-and-Tourism-website-.git
cd Travel-and-Tourism-website-

# 2. Backend Setup
cd travel_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python add_sample_data.py  # ⚠️ IMPORTANT: Don't skip this step!
python manage.py runserver

# 3. Frontend Setup (in a new terminal)
cd frontend
npm install
npm start

# 4. Open http://localhost:3000 in your browser
```

**⚠️ Critical Step**: Don't forget to run `python add_sample_data.py` or the application will be empty!

## 📱 What You'll See After Setup

After successful setup and running both servers, you should see:

1. **Home Page** - Featured destinations carousel with Bali, Santorini, Tokyo, Paris, and Swiss Alps
2. **Destinations Page** - Grid of 6 destinations with filtering by category (Beach, City, Cultural, Adventure, Nature)
3. **Authentication** - Working login/register functionality
4. **Bookings** - Ability to book trips and view booking history
5. **Profile** - User profile management with update capabilities
6. **Responsive Design** - Modern UI that works on desktop and mobile

If you see an empty page or no destinations, make sure you ran the `add_sample_data.py` script!

##  Features

- **User Authentication**: Login, registration, and JWT-based authentication
- **Destination Management**: Browse, search, and filter travel destinations
- **Favorites System**: Save and manage favorite destinations with custom lists
- **Booking System**: Book trips and manage bookings
- **Reviews System**: Rate and review destinations
- **Responsive Design**: Modern, mobile-friendly UI with Tailwind CSS
- **Real-time Updates**: Dynamic favorites and booking status updates

##  Tech Stack

### Frontend
- **React** - User interface library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Heroicons** - SVG icons
- **Axios** - HTTP client

### Backend
- **Django** - Web framework
- **Django REST Framework** - API framework
- **SQLite** - Database (development)
- **JWT** - Authentication tokens
- **Pillow** - Image processing

##  Project Structure

```
Travel_Tourism_new/
├── setup.sh                   # Setup script for Mac/Linux
├── setup.bat                  # Setup script for Windows
├── frontend/                  # React frontend application
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   └── services/        # API services
│   ├── package.json
│   └── tailwind.config.js
└── travel_backend/           # Django backend application
    ├── add_sample_data.py    # Script to populate database with sample data
    ├── destinations/         # Destinations app
    ├── bookings/            # Bookings app
    ├── favorites/           # Favorites app
    ├── reviews/             # Reviews app
    ├── users/               # Users app
    ├── manage.py
    └── requirements.txt
```

##  Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd travel_backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser** (optional):
   ```bash
   python manage.py createsuperuser
   ```

6. **⚠️  IMPORTANT: Add Sample Data**:
   The database is empty by default. Run the sample data script to populate it with destinations:
   ```bash
   python add_sample_data.py
   ```
   This will create:
   - **5 Categories**: Beach, Adventure, Cultural, City, Nature
   - **6 Destinations**: 
     - Bali Paradise Getaway (Indonesia) - Beach destination
     - Santorini Sunset Romance (Greece) - Beach destination  
     - Tokyo Modern Culture (Japan) - City destination
     - Paris Cultural Heritage (France) - Cultural destination
     - Swiss Alps Adventure (Switzerland) - Adventure destination
     - Yellowstone Wildlife Safari (USA) - Nature destination
   - All necessary data for the frontend to work properly
   
   **Sample Data Output**: You should see messages like:
   ```
   Creating categories...
   Creating destinations...
   🎉 Sample data creation completed!
   🚀 Your Django backend is ready!
   ```

7. **Start development server**:
   ```bash
   python manage.py runserver
   ```

The backend will be running at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

The frontend will be running at `http://localhost:3000`

## 🚨 **First-Time Setup Checklist**

After cloning the repository, make sure to:

1. ✅ **Backend Setup Complete** - Follow all backend setup steps above
2. ✅ **Migrations Applied** - Run `python manage.py migrate`
3. ✅ **Sample Data Added** - Run `python add_sample_data.py` (CRITICAL STEP)
4. ✅ **Frontend Dependencies** - Run `npm install` in frontend directory
5. ✅ **Both Servers Running** - Backend on :8000, Frontend on :3000
6. ✅ **Clear Browser Data** - Use incognito mode or clear localStorage to avoid cached login data

**⚠️ Without sample data, the application will appear empty with no destinations to browse!**

**💡 Tip**: Use incognito/private browsing mode for a completely fresh experience without cached authentication data.

##  Environment Variables

### Backend
The backend is configured to work out of the box with default settings. No .env file is required for basic functionality.

Optional environment variables:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend
The frontend is configured to connect to the local backend automatically. No .env file is required for basic functionality.

Optional environment variables:
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
```

##  Troubleshooting

### Common Issues

1. **Empty Application / No Destinations Showing**
   - **Cause**: Sample data not loaded
   - **Solution**: Run `python add_sample_data.py` in the travel_backend directory

2. **FieldError: Invalid field name(s) for model Destination**
   - **Cause**: Outdated sample data script with incorrect field names
   - **Solution**: Make sure you have the latest version of `add_sample_data.py`
   - **Error Example**: `django.core.exceptions.FieldError: Invalid field name(s) for model Destination: 'description'`

3. **Backend Not Starting**
   - **Cause**: Missing dependencies or database not set up
   - **Solution**: 
     ```bash
     pip install -r requirements.txt
     python manage.py migrate
     ```

4. **Frontend Not Connecting to Backend**
   - **Cause**: Backend not running or wrong URL
   - **Solution**: Ensure backend is running on http://localhost:8000

5. **Authentication Issues**
   - **Cause**: Database not migrated or corrupted
   - **Solution**: 
     ```bash
     python manage.py migrate
     python add_sample_data.py
     ```

6. **Profile Update Errors**
   - **Cause**: User not authenticated or invalid data
   - **Solution**: Make sure you're logged in and provide valid profile data

7. **Pre-existing Account Logged In After Fresh Clone**
   - **Cause**: Browser localStorage contains old authentication tokens
   - **Solution**: Clear browser localStorage or use incognito/private mode
   - **Steps**: 
     1. Open browser Developer Tools (F12)
     2. Go to Application/Storage tab
     3. Clear Local Storage for localhost:3000
     4. Refresh the page

### Database Reset (if needed)
If you need to start fresh with a clean database:
```bash
cd travel_backend
rm db.sqlite3  # Remove existing database
python manage.py migrate  # Create fresh database
python add_sample_data.py  # Add sample data
```

### Clear Browser Authentication Data
If you see a pre-existing account after cloning:

**Option 1: Use Development Utility (Easiest)**
```javascript
// Open browser console (F12) and run:
clearAuthData()  // This function is available in development mode
```

**Option 2: Manual Clearing**
```javascript
// Open browser console (F12) and run:
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token'); 
localStorage.removeItem('user');
location.reload(); // Refresh the page
```

**Option 3: Use Incognito Mode**
Simply use incognito/private browsing mode for testing.

##  API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh JWT token

### Destinations
- `GET /api/destinations/` - List all destinations
- `GET /api/destinations/{id}/` - Get destination details
- `GET /api/destinations/featured/` - Get featured destinations

### Favorites
- `POST /api/favorites/toggle/` - Toggle favorite status
- `POST /api/favorites/status/` - Check favorites status
- `GET /api/favorites/destinations/` - Get user's favorites
- `GET /api/favorites/lists/` - Get user's favorite lists

### Bookings
- `GET /api/bookings/` - List user bookings
- `POST /api/bookings/` - Create new booking
- `GET /api/bookings/{id}/` - Get booking details

##  Key Features Implementation

### Favorites System
- Real-time favorite toggling on destination cards
- Dedicated favorites page with list management
- Backend API with proper authentication
- Persistent storage in database

### Authentication
- JWT-based authentication
- Protected routes and components
- Automatic token refresh
- User context throughout the application

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Smooth animations with Framer Motion
- Modern UI components and layouts
