import React, { useState } from 'react';
import { useAuth } from './Auth/AuthContext';
import { bookingsAPI } from '../services/api';
import { 
  XMarkIcon, 
  CalendarDaysIcon, 
  UserGroupIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import './BookingForm.css';

const BookingForm = ({ destination, onBookingSuccess, onClose }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingResponse, setBookingResponse] = useState(null);
  
  // Extract first and last name from user data
  const userFirstName = user?.first_name || user?.name?.split(' ')[0] || '';
  const userLastName = user?.last_name || user?.name?.split(' ').slice(1).join(' ') || '';
  
  const [bookingData, setBookingData] = useState({
    departure_date: '',
    return_date: '',
    number_of_travelers: 1,
    special_requests: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_email: user?.email || '',
    dietary_requirements: '',
    travelers: [
      {
        first_name: userFirstName,
        last_name: userLastName,
        email: user?.email || '',
        phone: '',
        age: 25,
        gender: 'M',
        date_of_birth: '',
        nationality: '',
        passport_number: '',
        dietary_restrictions: '',
        special_requirements: ''
      }
    ]
  });

  const totalPrice = (destination.price_per_person || destination.price || 1299) * bookingData.number_of_travelers;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleTravelerChange = (index, field, value) => {
    setBookingData(prev => ({
      ...prev,
      travelers: prev.travelers.map((traveler, i) => 
        i === index ? { ...traveler, [field]: value } : traveler
      )
    }));
  };

  const updateTravelersCount = (count) => {
    const currentTravelers = bookingData.travelers;
    const newTravelers = [];
    
    for (let i = 0; i < count; i++) {
      if (i < currentTravelers.length) {
        // Keep existing traveler data
        newTravelers.push(currentTravelers[i]);
      } else {
        // Add new traveler with default data
        newTravelers.push({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          age: 25,
          gender: 'M',
          date_of_birth: '',
          nationality: '',
          passport_number: '',
          dietary_restrictions: '',
          special_requirements: ''
        });
      }
    }
    
    setBookingData(prev => ({
      ...prev,
      number_of_travelers: count,
      travelers: newTravelers
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!bookingData.departure_date || !bookingData.return_date) {
          setError('Please select both departure and return dates');
          return false;
        }
        if (new Date(bookingData.departure_date) >= new Date(bookingData.return_date)) {
          setError('Return date must be after departure date');
          return false;
        }
        if (new Date(bookingData.departure_date) <= new Date()) {
          setError('Departure date must be in the future');
          return false;
        }
        return true;
      case 2:
        if (bookingData.number_of_travelers < 1 || bookingData.number_of_travelers > 20) {
          setError('Number of travelers must be between 1 and 20');
          return false;
        }
        // Validate all travelers have required fields
        for (let i = 0; i < bookingData.travelers.length; i++) {
          const traveler = bookingData.travelers[i];
          if (!traveler.first_name.trim()) {
            setError(`Please enter first name for traveler ${i + 1}`);
            return false;
          }
          if (!traveler.last_name.trim()) {
            setError(`Please enter last name for traveler ${i + 1}`);
            return false;
          }
          if (!traveler.email.trim()) {
            setError(`Please enter email for traveler ${i + 1}`);
            return false;
          }
          if (!traveler.date_of_birth) {
            setError(`Please enter date of birth for traveler ${i + 1}`);
            return false;
          }
          if (!traveler.nationality.trim()) {
            setError(`Please enter nationality for traveler ${i + 1}`);
            return false;
          }
        }
        return true;
      case 3:
        if (!bookingData.emergency_contact_name || !bookingData.emergency_contact_phone) {
          setError('Emergency contact information is required');
          return false;
        }
        if (!bookingData.emergency_contact_email) {
          setError('Contact email is required');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setIsLoading(true);
    setError('');

    try {
      // Prepare booking data for Django backend with correct field names
      const bookingPayload = {
        destination: destination.id,
        start_date: bookingData.departure_date,
        end_date: bookingData.return_date,
        number_of_travelers: parseInt(bookingData.number_of_travelers),
        primary_contact_name: bookingData.emergency_contact_name,
        primary_contact_phone: bookingData.emergency_contact_phone,
        primary_contact_email: bookingData.emergency_contact_email,
        special_requirements: bookingData.special_requests,
        dietary_restrictions: bookingData.dietary_requirements,
        travelers: bookingData.travelers.map(traveler => ({
          first_name: traveler.first_name,
          last_name: traveler.last_name,
          date_of_birth: traveler.date_of_birth,
          passport_number: traveler.passport_number || '',
          nationality: traveler.nationality
        }))
      };

      console.log('Submitting booking:', bookingPayload);

      const response = await bookingsAPI.createBooking(bookingPayload);
      console.log('Booking created:', response);

      setBookingResponse(response);
      setCurrentStep(4); // Success step
      
      // Call success callback after a short delay
      setTimeout(() => {
        if (onBookingSuccess) {
          onBookingSuccess(response);
        }
      }, 2000);

    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-header">
              <CalendarDaysIcon className="step-icon" />
              <h3>When would you like to travel?</h3>
            </div>
            
            <div className="date-inputs">
              <div className="input-group">
                <label htmlFor="departure_date">
                  <CalendarDaysIcon className="input-icon" />
                  Departure Date
                </label>
                <input
                  type="date"
                  id="departure_date"
                  name="departure_date"
                  value={bookingData.departure_date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="return_date">
                  <CalendarDaysIcon className="input-icon" />
                  Return Date
                </label>
                <input
                  type="date"
                  id="return_date"
                  name="return_date"
                  value={bookingData.return_date}
                  onChange={handleInputChange}
                  min={bookingData.departure_date || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="step-header">
              <UserGroupIcon className="step-icon" />
              <h3>Travelers Information</h3>
            </div>
            
            <div className="travelers-input">
              <label htmlFor="number_of_travelers">
                <UserGroupIcon className="input-icon" />
                Number of Travelers
              </label>
              <select
                id="number_of_travelers"
                name="number_of_travelers"
                value={bookingData.number_of_travelers}
                onChange={(e) => updateTravelersCount(parseInt(e.target.value))}
                required
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Person' : 'People'}
                  </option>
                ))}
              </select>
            </div>

            {/* Travelers Details */}
            <div className="travelers-details">
              <h4>Traveler Details</h4>
              {bookingData.travelers.map((traveler, index) => (
                <div key={index} className="traveler-form">
                  <div className="traveler-header">
                    <UserIcon className="traveler-icon" />
                    <h5>Traveler {index + 1} {index === 0 && '(Primary)'}</h5>
                  </div>
                  
                  <div className="traveler-grid">
                    <div className="input-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        value={traveler.first_name}
                        onChange={(e) => handleTravelerChange(index, 'first_name', e.target.value)}
                        placeholder="First Name"
                        required
                      />
                    </div>
                    
                    <div className="input-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        value={traveler.last_name}
                        onChange={(e) => handleTravelerChange(index, 'last_name', e.target.value)}
                        placeholder="Last Name"
                        required
                      />
                    </div>
                    
                    <div className="input-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={traveler.email}
                        onChange={(e) => handleTravelerChange(index, 'email', e.target.value)}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    
                    <div className="input-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={traveler.phone}
                        onChange={(e) => handleTravelerChange(index, 'phone', e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                    
                    <div className="input-group">
                      <label>Date of Birth *</label>
                      <input
                        type="date"
                        value={traveler.date_of_birth}
                        onChange={(e) => handleTravelerChange(index, 'date_of_birth', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    
                    <div className="input-group">
                      <label>Nationality *</label>
                      <select
                        value={traveler.nationality}
                        onChange={(e) => handleTravelerChange(index, 'nationality', e.target.value)}
                        required
                      >
                        <option value="">Select Nationality</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="IN">India</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                        <option value="CN">China</option>
                        <option value="BR">Brazil</option>
                        <option value="MX">Mexico</option>
                        <option value="IT">Italy</option>
                        <option value="ES">Spain</option>
                        <option value="NL">Netherlands</option>
                        <option value="SE">Sweden</option>
                        <option value="NO">Norway</option>
                        <option value="DK">Denmark</option>
                        <option value="FI">Finland</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    
                    <div className="input-group">
                      <label>Gender</label>
                      <select
                        value={traveler.gender}
                        onChange={(e) => handleTravelerChange(index, 'gender', e.target.value)}
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>
                    
                    <div className="input-group">
                      <label>Passport Number</label>
                      <input
                        type="text"
                        value={traveler.passport_number}
                        onChange={(e) => handleTravelerChange(index, 'passport_number', e.target.value)}
                        placeholder="Passport number (optional)"
                      />
                    </div>
                    
                    <div className="input-group full-width">
                      <label>Dietary Restrictions</label>
                      <textarea
                        value={traveler.dietary_restrictions}
                        onChange={(e) => handleTravelerChange(index, 'dietary_restrictions', e.target.value)}
                        placeholder="Any dietary restrictions for this traveler..."
                        rows="2"
                      />
                    </div>
                    
                    <div className="input-group full-width">
                      <label>Special Requirements</label>
                      <textarea
                        value={traveler.special_requirements}
                        onChange={(e) => handleTravelerChange(index, 'special_requirements', e.target.value)}
                        placeholder="Any special requirements for this traveler..."
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="price-breakdown">
              <div className="price-item">
                <span>Price per person:</span>
                <span>${(destination.price_per_person || destination.price || 1299).toLocaleString()}</span>
              </div>
              <div className="price-item">
                <span>Number of travelers:</span>
                <span>{bookingData.number_of_travelers}</span>
              </div>
              <div className="price-total">
                <span>Total Price:</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="step-header">
              <CreditCardIcon className="step-icon" />
              <h3>Contact & Additional Information</h3>
            </div>
            
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="emergency_contact_name">Primary Contact Name *</label>
                <input
                  type="text"
                  id="emergency_contact_name"
                  name="emergency_contact_name"
                  value={bookingData.emergency_contact_name}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  required
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="emergency_contact_email">Contact Email *</label>
                <input
                  type="email"
                  id="emergency_contact_email"
                  name="emergency_contact_email"
                  value={bookingData.emergency_contact_email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  required
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="emergency_contact_phone">Contact Phone *</label>
                <input
                  type="tel"
                  id="emergency_contact_phone"
                  name="emergency_contact_phone"
                  value={bookingData.emergency_contact_phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              
              <div className="input-group full-width">
                <label htmlFor="dietary_requirements">General Dietary Requirements</label>
                <textarea
                  id="dietary_requirements"
                  name="dietary_requirements"
                  value={bookingData.dietary_requirements}
                  onChange={handleInputChange}
                  placeholder="General dietary requirements for the group..."
                  rows="3"
                />
              </div>
              
              <div className="input-group full-width">
                <label htmlFor="special_requests">Special Requests</label>
                <textarea
                  id="special_requests"
                  name="special_requests"
                  value={bookingData.special_requests}
                  onChange={handleInputChange}
                  placeholder="Any special accommodations or requests..."
                  rows="3"
                />
              </div>
            </div>

            <div className="booking-summary">
              <h4>Booking Summary</h4>
              <div className="summary-item">
                <span>Destination:</span>
                <span>{destination.name}</span>
              </div>
              <div className="summary-item">
                <span>Departure:</span>
                <span>{new Date(bookingData.departure_date).toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <span>Return:</span>
                <span>{new Date(bookingData.return_date).toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <span>Travelers:</span>
                <span>{bookingData.number_of_travelers}</span>
              </div>
              <div className="summary-item">
                <span>Primary Traveler:</span>
                <span>{bookingData.travelers[0]?.first_name} {bookingData.travelers[0]?.last_name}</span>
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content success-step">
            <div className="success-icon">
              <CheckCircleIcon />
            </div>
            <h3>Booking Confirmed!</h3>
            <p>Your adventure to <strong>{destination.name}</strong> has been successfully booked.</p>
            <div className="confirmation-details">
              <p><strong>Booking ID:</strong> {bookingResponse?.booking?.booking_id || `TB${Date.now()}`}</p>
              <p><strong>Total Amount:</strong> ${totalPrice.toLocaleString()}</p>
              <p><strong>Status:</strong> {bookingResponse?.booking?.status || 'Confirmed'}</p>
              <p><strong>Travelers:</strong> {bookingData.number_of_travelers}</p>
              <p>A confirmation email will be sent to <strong>{bookingData.emergency_contact_email}</strong></p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="booking-form-overlay">
      <div className="booking-form-container">
        <div className="booking-form-header">
          <h2>Book Your Adventure</h2>
          <button onClick={onClose} className="close-button">
            <XMarkIcon />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
          {[1, 2, 3, 4].map((step) => (
            <div 
              key={step}
              className={`step-indicator ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
            >
              {currentStep > step ? <CheckCircleIcon /> : step}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          {error && (
            <div className="error-message">
              <ExclamationTriangleIcon className="error-icon" />
              {error}
            </div>
          )}

          {renderStepContent()}

          {currentStep < 4 && (
            <div className="form-actions">
              {currentStep > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Previous
                </button>
              )}
              
              {currentStep < 3 ? (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="btn-primary"
                  disabled={isLoading}
                >
                  Next
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : `Confirm Booking - $${totalPrice.toLocaleString()}`}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookingForm;