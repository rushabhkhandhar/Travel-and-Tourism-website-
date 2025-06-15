import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookingsAPI } from '../services/api';
import { 
  CalendarDaysIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  GlobeAltIcon,
  IdentificationIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import './BookingDetails.css';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // First try to get booking from navigation state
    if (location.state?.booking) {
      setBooking(location.state.booking);
      setLoading(false);
    } else if (bookingId) {
      // Fallback: fetch booking by ID
      fetchBookingDetails();
    } else {
      setError('No booking information available');
      setLoading(false);
    }
  }, [bookingId, location.state]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getBooking(bookingId);
      setBooking(response.data || response);
      setError(null);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase() || '';
    switch (normalizedStatus) {
      case 'confirmed':
        return 'linear-gradient(135deg, #10b981, #059669)';
      case 'pending':
        return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'cancelled':
        return 'linear-gradient(135deg, #ef4444, #dc2626)';
      case 'completed':
        return 'linear-gradient(135deg, #6366f1, #4f46e5)';
      default:
        return 'linear-gradient(135deg, #64748b, #475569)';
    }
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = status?.toLowerCase() || '';
    switch (normalizedStatus) {
      case 'confirmed':
        return <CheckCircleIcon className="w-6 h-6" />;
      case 'pending':
        return <ClockIcon className="w-6 h-6" />;
      case 'cancelled':
        return <XMarkIcon className="w-6 h-6" />;
      case 'completed':
        return <CheckCircleIcon className="w-6 h-6" />;
      default:
        return <InformationCircleIcon className="w-6 h-6" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, '')) : price;
    return `$${numPrice.toLocaleString()}`;
  };

  const getTravelersCount = (booking) => {
    if (booking.travelers) {
      if (typeof booking.travelers === 'number') return booking.travelers;
      if (Array.isArray(booking.travelers)) return booking.travelers.length;
      if (typeof booking.travelers === 'object') return Object.keys(booking.travelers).length || 1;
    }
    if (booking.guests && typeof booking.guests === 'number') return booking.guests;
    if (booking.passengers && typeof booking.passengers === 'number') return booking.passengers;
    if (booking.number_of_travelers && typeof booking.number_of_travelers === 'number') return booking.number_of_travelers;
    return 1;
  };

  const getDuration = (booking) => {
    if (booking.duration) {
      if (typeof booking.duration === 'number') return booking.duration;
      if (typeof booking.duration === 'string') {
        const parsed = parseInt(booking.duration);
        return isNaN(parsed) ? booking.duration : parsed;
      }
    }
    if (booking.days && typeof booking.days === 'number') return booking.days;
    if (booking.start_date && booking.end_date) {
      try {
        const start = new Date(booking.start_date);
        const end = new Date(booking.end_date);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      } catch {
        return 'N/A';
      }
    }
    return 'N/A';
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await bookingsAPI.cancelBooking(booking.id || booking.booking_id);
      setBooking(prev => ({ ...prev, status: 'cancelled' }));
      toast.success('Booking cancelled successfully');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error('Failed to cancel booking: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="booking-details-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="booking-details-container">
        <div className="error-message">
          <ExclamationTriangleIcon className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3>Error Loading Booking</h3>
          <p>{error || 'Booking not found'}</p>
          <button onClick={() => navigate('/my-bookings')} className="btn-primary">
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-details-container">
      {/* Header */}
      <div className="booking-details-header">
        <button onClick={() => navigate('/my-bookings')} className="back-button">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to My Bookings
        </button>
        
        <div className="header-content">
          <div className="booking-title-section">
            <h1>{String(booking.destination_name || booking.package_name || booking.title || 'Booking Details')}</h1>
            <div className="booking-meta">
              <span className="booking-id">Booking #{String(booking.id || booking.booking_id || 'N/A')}</span>
              <div 
                className="status-badge"
                style={{ background: getStatusColor(booking.status) }}
              >
                {getStatusIcon(booking.status)}
                {String(booking.status?.toUpperCase() || 'UNKNOWN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="booking-details-content">
        <div className="details-grid">
          {/* Left Column */}
          <div className="details-left">
            {/* Destination Info */}
            <div className="detail-card">
              <h2>
                <MapPinIcon className="w-6 h-6" />
                Destination Information
              </h2>
              <div className="card-content">
                <div className="info-row">
                  <span className="label">Destination:</span>
                  <span className="value">{String(booking.destination_name || booking.package_name || booking.title || 'N/A')}</span>
                </div>
                <div className="info-row">
                  <span className="label">Location:</span>
                  <span className="value">{String(booking.location || booking.destination || 'Not specified')}</span>
                </div>
                {booking.description && (
                  <div className="info-row">
                    <span className="label">Description:</span>
                    <span className="value">{String(booking.description)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Travel Details */}
            <div className="detail-card">
              <h2>
                <CalendarDaysIcon className="w-6 h-6" />
                Travel Details
              </h2>
              <div className="card-content">
                <div className="info-row">
                  <span className="label">Start Date:</span>
                  <span className="value">{formatDate(booking.start_date || booking.check_in)}</span>
                </div>
                <div className="info-row">
                  <span className="label">End Date:</span>
                  <span className="value">{formatDate(booking.end_date || booking.check_out)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Duration:</span>
                  <span className="value">{getDuration(booking)} days</span>
                </div>
                <div className="info-row">
                  <span className="label">Travelers:</span>
                  <span className="value">{getTravelersCount(booking)} travelers</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {(booking.contact_name || booking.email || booking.phone) && (
              <div className="detail-card">
                <h2>
                  <IdentificationIcon className="w-6 h-6" />
                  Contact Information
                </h2>
                <div className="card-content">
                  {booking.contact_name && (
                    <div className="info-row">
                      <span className="label">Contact Name:</span>
                      <span className="value">{String(booking.contact_name)}</span>
                    </div>
                  )}
                  {booking.email && (
                    <div className="info-row">
                      <span className="label">Email:</span>
                      <span className="value">{String(booking.email)}</span>
                    </div>
                  )}
                  {booking.phone && (
                    <div className="info-row">
                      <span className="label">Phone:</span>
                      <span className="value">{String(booking.phone)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="details-right">
            {/* Pricing Information */}
            <div className="detail-card pricing-card">
              <h2>
                <CurrencyDollarIcon className="w-6 h-6" />
                Pricing Details
              </h2>
              <div className="card-content">
                <div className="price-breakdown">
                  <div className="price-row total">
                    <span className="label">Total Amount:</span>
                    <span className="value">{formatPrice(booking.total_price || booking.price || booking.amount)}</span>
                  </div>
                  {booking.base_price && (
                    <div className="price-row">
                      <span className="label">Base Price:</span>
                      <span className="value">{formatPrice(booking.base_price)}</span>
                    </div>
                  )}
                  {booking.taxes && (
                    <div className="price-row">
                      <span className="label">Taxes & Fees:</span>
                      <span className="value">{formatPrice(booking.taxes)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Special Requirements */}
            {booking.special_requirements && (
              <div className="detail-card">
                <h2>
                  <DocumentTextIcon className="w-6 h-6" />
                  Special Requirements
                </h2>
                <div className="card-content">
                  <p>{String(booking.special_requirements)}</p>
                </div>
              </div>
            )}

            {/* Booking Information */}
            <div className="detail-card">
              <h2>
                <InformationCircleIcon className="w-6 h-6" />
                Booking Information
              </h2>
              <div className="card-content">
                <div className="info-row">
                  <span className="label">Booking Date:</span>
                  <span className="value">{formatDate(booking.booking_date || booking.created_at)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span className="value status-text" style={{ color: booking.status?.toLowerCase() === 'confirmed' ? '#10b981' : '#f59e0b' }}>
                    {String(booking.status?.toUpperCase() || 'UNKNOWN')}
                  </span>
                </div>
                {booking.confirmation_number && (
                  <div className="info-row">
                    <span className="label">Confirmation #:</span>
                    <span className="value">{String(booking.confirmation_number)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="detail-card actions-card">
              <h2>Actions</h2>
              <div className="card-content">
                {booking.status?.toLowerCase() === 'confirmed' && (
                  <button onClick={handleCancelBooking} className="btn-cancel-full">
                    <XMarkIcon className="w-5 h-5" />
                    Cancel Booking
                  </button>
                )}
                <button onClick={() => window.print()} className="btn-print">
                  <DocumentTextIcon className="w-5 h-5" />
                  Print Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;