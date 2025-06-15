import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toastify-custom.css';

// Import all pages and components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Tours from './pages/Tours';
import About from './pages/About';
import Contact from './pages/Contact';
import Favorites from './pages/Favorites';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import MyBookings from './pages/MyBookings';
import BookingDetails from './pages/BookingDetails';
import ProfileSettings from './pages/ProfileSettings';
import DestinationDetail from './pages/DestinationDetail';

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/booking-details/:bookingId" element={<BookingDetails />} />
            <Route path="/profile" element={<ProfileSettings />} />
          </Routes>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            limit={3}
            toastStyle={{
              fontSize: '14px',
              fontWeight: '500'
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
