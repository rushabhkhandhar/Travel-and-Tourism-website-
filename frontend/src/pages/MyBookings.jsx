import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/Auth/AuthContext';
import { bookingsAPI } from '../services/api';
import {
  TicketIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ClockIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import './MyBookings.css';

const MyBookings = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    console.log('MyBookings component mounted');
    console.log('User authenticated:', isAuthenticated);
    console.log('Access token exists:', !!localStorage.getItem('accessToken'));
    
    if (isAuthenticated) {
      fetchBookings();
    } else {
      setError('Please log in to view your bookings');
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await bookingsAPI.getBookings();
      console.log('Bookings data received:', data);
      const bookingsArray = Array.isArray(data) ? data : [];
      setBookings(bookingsArray);
      
      if (bookingsArray.length === 0) {
        console.log('No bookings found for this user');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <ExclamationCircleIcon className="w-5 h-5" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'status-badge status-confirmed';
      case 'pending':
        return 'status-badge status-pending';
      case 'cancelled':
        return 'status-badge status-cancelled';
      default:
        return 'status-badge status-confirmed';
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'payment-badge payment-paid';
      case 'pending':
        return 'payment-badge payment-pending';
      case 'failed':
        return 'payment-badge payment-failed';
      default:
        return 'payment-badge payment-pending';
    }
  };

  const filteredAndSortedBookings = bookings
    .filter(booking => {
      const matchesSearch = searchTerm === '' || 
        booking.destination?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.booking_id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'departure-soon':
          return new Date(a.start_date) - new Date(b.start_date);
        case 'departure-later':
          return new Date(b.start_date) - new Date(a.start_date);
        default:
          return 0;
      }
    });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalSpent = bookings.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

  if (loading) {
    return (
      <div className="my-bookings-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-bookings-container">
        <div className="error-container">
          <ExclamationCircleIcon className="error-icon" />
          <h3 className="error-title">Error Loading Bookings</h3>
          <p className="error-message">{error}</p>
          <button onClick={fetchBookings} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-container">
      {/* Header */}
      <div className="my-bookings-header">
        <div className="header-content">
          <h1>My Bookings</h1>
          <p>Manage and track all your travel bookings in one place</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <h3>{totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
            <div className="stat-icon">
              <TicketIcon className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <h3>{confirmedBookings}</h3>
              <p>Confirmed</p>
            </div>
            <div className="stat-icon">
              <CheckCircleIcon className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <h3>{pendingBookings}</h3>
              <p>Pending</p>
            </div>
            <div className="stat-icon">
              <ClockIcon className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <h3>{formatCurrency(totalSpent)}</h3>
              <p>Total Spent</p>
            </div>
            <div className="stat-icon">
              <CurrencyDollarIcon className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {bookings.length > 0 && (
        <div className="filters-section">
          <div className="filters-card">
            <div className="filters-grid">
              <div className="search-box">
                <MagnifyingGlassIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="Search bookings by destination or booking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="departure-soon">Departure Soon</option>
                <option value="departure-later">Departure Later</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div className="bookings-list">
        {filteredAndSortedBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <TicketIcon className="w-16 h-16 text-blue-600" />
            </div>
            <h3>No Bookings Yet</h3>
            <p>
              You haven't made any bookings yet. Start exploring amazing destinations and create your first booking!
            </p>
            <button
              onClick={() => navigate('/destinations')}
              className="btn-primary"
            >
              <PlusIcon className="w-5 h-5" />
              Browse Destinations
            </button>
          </div>
        ) : (
          filteredAndSortedBookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              {/* Header */}
              <div className="booking-header">
                <div className="booking-title-section">
                  <div className="booking-icon">
                    <TicketIcon className="w-6 h-6" />
                  </div>
                  <div className="booking-title">
                    <h3>{booking.destination?.name || 'Unknown Destination'}</h3>
                    <div className="booking-id">Booking ID: {booking.booking_id}</div>
                  </div>
                </div>
                <div className="booking-badges">
                  <div className={getStatusClass(booking.status)}>
                    {getStatusIcon(booking.status)}
                    <span>{booking.status || 'Unknown'}</span>
                  </div>
                  <div className={getPaymentStatusClass(booking.payment_status)}>
                    {booking.payment_status || 'pending'}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="booking-details-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <CalendarDaysIcon className="w-5 h-5" />
                  </div>
                  <div className="detail-content">
                    <h4>Departure</h4>
                    <p>{formatDate(booking.start_date)}</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">
                    <CalendarDaysIcon className="w-5 h-5" />
                  </div>
                  <div className="detail-content">
                    <h4>Return</h4>
                    <p>{formatDate(booking.end_date)}</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">
                    <UsersIcon className="w-5 h-5" />
                  </div>
                  <div className="detail-content">
                    <h4>Travelers</h4>
                    <p>{booking.number_of_travelers}</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">
                    <CurrencyDollarIcon className="w-5 h-5" />
                  </div>
                  <div className="detail-content">
                    <h4>Total Price</h4>
                    <p className="price-text">{formatCurrency(booking.total_price)}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="contact-section">
                <h4>Contact Information</h4>
                <div className="contact-grid">
                  <div className="contact-item">
                    <span className="contact-text">{booking.primary_contact_name}</span>
                  </div>
                  <div className="contact-item">
                    <EnvelopeIcon className="contact-icon" />
                    <span className="contact-text">{booking.primary_contact_email}</span>
                  </div>
                  <div className="contact-item">
                    <PhoneIcon className="contact-icon" />
                    <span className="contact-text">{booking.primary_contact_phone}</span>
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              {(booking.special_requirements || booking.dietary_restrictions) && (
                <div className="requirements-section">
                  <h4>Special Requirements</h4>
                  {booking.special_requirements && (
                    <div className="requirement-item">
                      <span className="requirement-label">Special Requirements:</span> {booking.special_requirements}
                    </div>
                  )}
                  {booking.dietary_restrictions && (
                    <div className="requirement-item">
                      <span className="requirement-label">Dietary Restrictions:</span> {booking.dietary_restrictions}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="booking-actions">
                <div className="booking-date">
                  Booked on {formatDate(booking.created_at)}
                </div>
                <div className="action-buttons">
                  <button
                    onClick={() => navigate(`/destinations/${booking.destination?.id}`)}
                    className="btn-secondary"
                  >
                    <EyeIcon className="w-4 h-4" />
                    View Destination
                  </button>
                  <button
                    onClick={() => navigate(`/booking-details/${booking.id}`)}
                    className="btn-primary"
                  >
                    View Details
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;
