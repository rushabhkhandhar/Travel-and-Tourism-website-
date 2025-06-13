import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  StarIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/solid';
import { destinationsAPI } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';

const FeaturedDestinations = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchFeaturedDestinations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await destinationsAPI.getFeatured();
        setDestinations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching featured destinations:', err);
        setError('Failed to load featured destinations');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedDestinations();
  }, []);

  const handleDestinationClick = (destination) => {
    navigate(`/destinations/${destination.id}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <LoadingSpinner size="large" text="Loading featured destinations..." />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <StarIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Featured Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our handpicked selection of extraordinary destinations that promise 
            unforgettable experiences and breathtaking memories.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.length > 0 ? (
            destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                onClick={() => handleDestinationClick(destination)}
                className="group cursor-pointer bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100"
              >
                {destination.main_image_url && (
                  <div className="relative overflow-hidden">
                    <img
                      src={destination.main_image_url}
                      alt={destination.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Enhanced badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        ⭐ Featured
                      </div>
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-medium">
                        {destination.duration_days} days
                      </div>
                    </div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{destination.city}, {destination.country}</span>
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-semibold">
                      {destination.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {destination.name}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{destination.short_description}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(destination.average_rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600 font-semibold">
                        {destination.average_rating || 'New'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({destination.total_reviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                      <span className="text-3xl font-bold text-gray-900">
                        {destination.price_per_person}
                      </span>
                      <span className="text-gray-500 text-sm">per person</span>
                    </div>
                    <button className="group/btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105 shadow-lg">
                      <span className="font-semibold">View Details</span>
                      <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🌟</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No featured destinations yet</h3>
              <p className="text-gray-600 text-lg">Check back soon for amazing featured destinations!</p>
            </div>
          )}
        </div>

        {destinations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <button 
              onClick={() => navigate('/destinations')}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg px-10 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>View All Destinations</span>
              <ArrowRightIcon className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDestinations;