import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  HeartIcon as HeartOutline,
  ShareIcon,
  PhotoIcon,
  CloudIcon,
  SunIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { destinationsAPI, weatherAPI, reviewsAPI, favoritesAPI } from '../services/api';
import { useAuth } from '../components/Auth/AuthContext';
import BookingForm from '../components/BookingForm';

// Add the same fallback images array
const fallbackImages = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1464822759844-d150baec93c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
];

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // State management
  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDestinationData();
  }, [id]);

  const loadDestinationData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load destination details
      const destinationData = await destinationsAPI.getDestination(id);
      setDestination(destinationData);

      // Load reviews
      const reviewsData = await reviewsAPI.getReviews({ destination: id, limit: 5 });
      setReviews(reviewsData.results || reviewsData);

      // Load weather data if city is available
      if (destinationData.city && destinationData.country) {
        try {
          const weatherData = await weatherAPI.getCurrentWeather(
            destinationData.city, 
            destinationData.country
          );
          setWeather(weatherData);
        } catch (error) {
          console.error('Weather data not available:', error);
        }
      }

    } catch (error) {
      setError('Failed to load destination details. Please try again.');
      console.error('Failed to load destination:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await favoritesAPI.toggleFavorite(destination.id);
      if (response.success) {
        setIsFavorite(response.is_favorited);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Optionally show error message to user
    }
  };

  // Load favorite status when destination loads
  const loadFavoriteStatus = async () => {
    if (!isAuthenticated || !destination) return;
    
    try {
      const response = await favoritesAPI.checkFavoritesStatus([destination.id]);
      if (response.success) {
        setIsFavorite(response.favorites_status[destination.id] || false);
      }
    } catch (error) {
      console.error('Error loading favorite status:', error);
    }
  };

  // Load favorite status when destination changes
  useEffect(() => {
    loadFavoriteStatus();
  }, [destination, isAuthenticated]);

  const handleShare = async () => {
    const shareData = {
      title: destination.name,
      text: destination.short_description || destination.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Could not copy link:', error);
      }
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/destinations/${id}` } } });
      return;
    }
    setShowBookingModal(true);
  };

  // Function to get fallback image
  const getFallbackImage = () => {
    const index = destination?.id ? destination.id % fallbackImages.length : 0;
    return fallbackImages[index];
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Destination not found'}
          </h2>
          <div className="space-x-4">
            <button
              onClick={() => loadDestinationData()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/destinations"
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Destinations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = destination.images || [destination.main_image_url].filter(Boolean);
  // If no images, use fallback
  const displayImages = images.length > 0 ? images : [getFallbackImage()];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/destinations')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to destinations</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleFavorite}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {isFavorite ? (
                  <HeartSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartOutline className="h-6 w-6 text-gray-600" />
                )}
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ShareIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src={displayImages[selectedImage] || getFallbackImage()}
                  alt={destination.name}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.src = getFallbackImage();
                  }}
                />
                {displayImages.length > 1 && (
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    {displayImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          selectedImage === index ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {displayImages.length > 1 && (
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {displayImages.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative rounded-lg overflow-hidden ${
                          selectedImage === index ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${destination.name} ${index + 1}`}
                          className="w-full h-20 object-cover hover:opacity-75 transition-opacity"
                          onError={(e) => {
                            e.target.src = getFallbackImage();
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Destination Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{destination.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="h-4 w-4" />
                      <span>
                        {destination.city && destination.country 
                          ? `${destination.city}, ${destination.country}`
                          : destination.country || destination.location
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{destination.duration_days ? `${destination.duration_days} days` : destination.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold">{destination.average_rating || 'N/A'}</span>
                  </div>
                  <p className="text-sm text-gray-600">({destination.total_reviews || 0} reviews)</p>
                </div>
              </div>

              {/* Weather Info */}
              {weather && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {weather.is_sunny ? (
                        <SunIcon className="h-8 w-8 text-yellow-500" />
                      ) : (
                        <CloudIcon className="h-8 w-8 text-gray-500" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">Current Weather</p>
                        <p className="text-sm text-gray-600">{weather.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{Math.round(weather.temperature)}°C</p>
                      <p className="text-sm text-gray-600">Feels like {Math.round(weather.feels_like)}°C</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'overview', name: 'Overview' },
                    { id: 'itinerary', name: 'Itinerary' },
                    { id: 'reviews', name: 'Reviews' },
                    { id: 'gallery', name: 'Gallery' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About this destination</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {destination.description || destination.long_description}
                    </p>
                  </div>

                  {destination.highlights && destination.highlights.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {destination.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {destination.best_time_to_visit && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Best Time to Visit</h3>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-blue-500" />
                        <span className="text-gray-700">{destination.best_time_to_visit}</span>
                      </div>
                    </div>
                  )}

                  {destination.activities && destination.activities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Activities</h3>
                      <div className="flex flex-wrap gap-2">
                        {destination.activities.map((activity, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'itinerary' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {destination.duration_days}-Day Itinerary
                  </h3>
                  {destination.itinerary && destination.itinerary.length > 0 ? (
                    <div className="space-y-6">
                      {destination.itinerary.map((day, index) => (
                        <div key={index} className="flex space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                              {day.day}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">{day.title}</h4>
                            <p className="text-gray-700">{day.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Detailed itinerary will be provided upon booking.</p>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Reviews</h3>
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <img
                              src={review.user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                              alt={review.user?.name || 'User'}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-gray-900">
                                  {review.user?.first_name && review.user?.last_name 
                                    ? `${review.user.first_name} ${review.user.last_name}`
                                    : review.user?.username || 'Anonymous'
                                  }
                                </span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No reviews yet. Be the first to review this destination!</p>
                  )}
                </div>
              )}

              {activeTab === 'gallery' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Photo Gallery</h3>
                  {images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className="relative group rounded-lg overflow-hidden"
                        >
                          <img
                            src={image}
                            alt={`${destination.name} ${index + 1}`}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                            <PhotoIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No additional photos available.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <CurrencyDollarIcon className="h-6 w-6 text-gray-600" />
                  <span className="text-3xl font-bold text-gray-900">
                    {destination.price_per_person || destination.price || 'N/A'}
                  </span>
                  <span className="text-gray-600">per person</span>
                </div>
                <p className="text-sm text-gray-500">Starting from</p>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 mb-4"
              >
                {isAuthenticated ? 'Book Now' : 'Sign in to Book'}
              </button>

              <div className="space-y-4">
                {destination.inclusions && destination.inclusions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">What's Included</h4>
                    <ul className="space-y-1">
                      {destination.inclusions.slice(0, 6).map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <span className="text-green-500">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {destination.exclusions && destination.exclusions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Not Included</h4>
                    <ul className="space-y-1">
                      {destination.exclusions.slice(0, 4).map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <span className="text-red-500">✗</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center text-sm text-gray-600">
                  <div className="flex flex-col items-center">
                    <span>🛡️</span>
                    <span>Free cancellation</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>📞</span>
                    <span>24/7 support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Book Your Trip</h3>
            <p className="text-gray-600 mb-6">
              Complete booking functionality will be available soon. For now, please contact us directly to book this amazing destination.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Thank you for your interest! We will contact you soon.');
                  setShowBookingModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingForm
          destination={destination}
          onBookingSuccess={(booking) => {
            console.log('Booking successful:', booking);
            setShowBookingModal(false);
            alert('Booking confirmed! Check your email for details.');
            // Optionally redirect to My Bookings
            // navigate('/my-bookings');
          }}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

export default DestinationDetail;