import React, { useState } from 'react';
import { useAuth } from './Auth/AuthContext';
import BookingForm from './BookingForm';
import { 
  MapPinIcon, 
  StarIcon, 
  CalendarDaysIcon, 
  UsersIcon,
  ArrowRightIcon,
  HeartIcon as HeartIconOutline,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import './DestinationCard.css';

// Add fallback images array
const fallbackImages = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
  'https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
  'https://images.unsplash.com/photo-1464822759844-d150baec93c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
];

const DestinationCard = ({ destination, isLiked = false, onToggleFavorite }) => {
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // Function to get fallback image based on destination ID or name
  const getFallbackImage = () => {
    const index = destination.id ? destination.id % fallbackImages.length : 
                  destination.name ? destination.name.length % fallbackImages.length : 0;
    return fallbackImages[index];
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(destination.id);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: destination.name,
        text: destination.description,
        url: window.location.href
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleBookNow = (e) => {
    e.stopPropagation();
    if (!user) {
      alert('Please log in to book a destination');
      // You might want to redirect to login page
      return;
    }
    setShowBookingForm(true);
  };

  const handleBookingSuccess = (booking) => {
    console.log('Booking successful:', booking);
    setShowBookingForm(false);
    alert('Booking confirmed! Check your email for details.');
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  const features = destination.features || [];
  const displayFeatures = features.slice(0, 3);

  return (
    <>
      <div className="destination-card">
        <div className="destination-image-container">
          {!imageLoaded && (
            <div className="image-placeholder">
              <div className="placeholder-icon">📍</div>
              <span>Loading...</span>
            </div>
          )}
          
          <img
            src={imageError ? getFallbackImage() : (destination.image_url || destination.image || destination.main_image_url || getFallbackImage())}
            alt={destination.name}
            className={`destination-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          <div className="gradient-overlay"></div>
          
          <div className="image-overlay">
            <div className="overlay-top">
              <div className="category-badge">
                {destination.category?.name || destination.category || 'Adventure'}
              </div>
              <div className="action-buttons">
                <button 
                  className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
                  onClick={handleLike}
                  aria-label={isLiked ? 'Unlike' : 'Like'}
                >
                  {isLiked ? (
                    <HeartIconSolid className="heart-icon filled" />
                  ) : (
                    <HeartIconOutline className="heart-icon" />
                  )}
                </button>
                <button 
                  className="action-btn share-btn"
                  onClick={handleShare}
                  aria-label="Share"
                >
                  <ShareIcon className="share-icon" />
                </button>
              </div>
            </div>
            
            <div className="overlay-bottom">
              <div className="price-overlay">
                <span className="price-from">From</span>
                <span className="price-amount">
                  ${(destination.price_per_person || destination.price || 1299).toLocaleString()}
                </span>
                <span className="price-per">per person</span>
              </div>
            </div>
          </div>
        </div>

        <div className="destination-content">
          <div className="content-header">
            <h3 className="destination-title">{destination.name}</h3>
            <div className="destination-location">
              <MapPinIcon className="location-icon" />
              <span>{destination.city}, {destination.country}</span>
            </div>
          </div>

          <p className="destination-description">
            {destination.short_description || destination.description || 'Discover this amazing destination with unique experiences and breathtaking views.'}
          </p>

          <div className="quick-info">
            <div className="info-item rating">
              <StarIcon className="info-icon star" />
              <span>{destination.average_rating || destination.rating || '4.5'}</span>
              <small>({destination.total_reviews || destination.reviews_count || 42})</small>
            </div>
            <div className="info-item duration">
              <CalendarDaysIcon className="info-icon" />
              <span>{destination.duration_days || 7} days</span>
            </div>
            <div className="info-item difficulty">
              <UsersIcon className="info-icon" />
              <span>{destination.difficulty || 'Moderate'}</span>
            </div>
          </div>

          {displayFeatures.length > 0 && (
            <div className="features-container">
              {displayFeatures.map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                </span>
              ))}
            </div>
          )}

          <div className="card-footer">
            <div className="price-section">
              <div className="price-details">
                <span className="current-price">
                  ${(destination.price_per_person || destination.price || 1299).toLocaleString()}
                </span>
                <span className="price-label">per person</span>
              </div>
            </div>
            
            <button 
              className="book-now-button"
              onClick={handleBookNow}
            >
              Book Now
              <ArrowRightIcon className="button-arrow" />
            </button>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          destination={destination}
          onBookingSuccess={handleBookingSuccess}
          onClose={handleCloseBookingForm}
        />
      )}
    </>
  );
};

export default DestinationCard;