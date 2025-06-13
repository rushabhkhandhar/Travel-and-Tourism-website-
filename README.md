# Travel Tourism Web Application

A full-stack travel and tourism web application built with React frontend and Django backend, featuring destination browsing, user authentication, bookings, and a favorites system.

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
├── frontend/                   # React frontend application
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   └── services/         # API services
│   ├── package.json
│   └── tailwind.config.js
└── travel_backend/            # Django backend application
    ├── destinations/          # Destinations app
    ├── bookings/             # Bookings app
    ├── favorites/            # Favorites app
    ├── reviews/              # Reviews app
    ├── users/                # Users app
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

4. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

5. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser** (optional):
   ```bash
   python manage.py createsuperuser
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

3. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start development server**:
   ```bash
   npm start
   ```

The frontend will be running at `http://localhost:3000`

##  Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (.env)
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
```

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
