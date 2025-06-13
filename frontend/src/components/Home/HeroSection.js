import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  CalendarDaysIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchData.destination) queryParams.append('search', searchData.destination);
    if (searchData.checkIn) queryParams.append('date_from', searchData.checkIn);
    if (searchData.checkOut) queryParams.append('date_to', searchData.checkOut);
    
    navigate(`/destinations?${queryParams.toString()}`);
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Beautiful landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow-lg">
            Discover Your Next
            <span className="text-primary-400 block">Adventure</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-2xl mx-auto">
            Explore breathtaking destinations, create unforgettable memories, 
            and experience the world like never before.
          </p>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/98 backdrop-blur-md rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto border border-white/30"
          >
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Destination Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Where to?
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    className="hero-input appearance-none block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white font-medium shadow-sm"
                  />
                </div>
              </div>

              {/* Check-in Date */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Check In
                </label>
                <div className="relative">
                  <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => handleInputChange('checkIn', e.target.value)}
                    className="hero-input appearance-none block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white font-medium shadow-sm"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Check-out Date */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Check Out
                </label>
                <div className="relative">
                  <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => handleInputChange('checkOut', e.target.value)}
                    className="hero-input appearance-none block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white font-medium shadow-sm"
                    min={searchData.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Guests
                </label>
                <div className="relative">
                  <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <select
                    value={searchData.guests}
                    onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                    className="hero-input appearance-none block w-full pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white font-medium cursor-pointer shadow-sm"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-4 flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg px-10 py-4 rounded-xl flex items-center space-x-3 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <MagnifyingGlassIcon className="h-6 w-6" />
                  <span>Search Adventures</span>
                </button>
              </div>
            </form>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12"
          >
            <p className="text-gray-300 mb-4">Popular destinations:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Bali', 'Paris', 'Tokyo', 'New York', 'London'].map((destination) => (
                <button
                  key={destination}
                  onClick={() => navigate(`/destinations?search=${destination}`)}
                  className="px-6 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white hover:bg-opacity-30 transition-all"
                >
                  {destination}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full animate-bounce mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;