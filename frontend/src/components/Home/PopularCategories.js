import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const PopularCategories = () => {
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleImageError = (categoryId) => {
    setImageErrors(prev => ({
      ...prev,
      [categoryId]: true
    }));
    setImageLoading(prev => ({
      ...prev,
      [categoryId]: false
    }));
  };

  const handleImageLoad = (categoryId) => {
    setImageLoading(prev => ({
      ...prev,
      [categoryId]: false
    }));
    // Reset error state if image loads successfully
    if (imageErrors[categoryId]) {
      setImageErrors(prev => ({
        ...prev,
        [categoryId]: false
      }));
    }
  };

  const handleImageLoadStart = (categoryId) => {
    setImageLoading(prev => ({
      ...prev,
      [categoryId]: true
    }));
  };

  const categories = [
    {
      id: 1,
      name: 'Adventure',
      description: 'Thrilling outdoor experiences',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      count: '45 destinations',
      icon: '🏔️',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 2,
      name: 'Beach',
      description: 'Relax by crystal clear waters',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      count: '38 destinations',
      icon: '🏖️',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 3,
      name: 'Cultural',
      description: 'Immerse in local traditions',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0b01f?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      count: '52 destinations',
      icon: '🏛️',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 4,
      name: 'Mountain',
      description: 'Breathtaking alpine adventures',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1464822759356-8d6106e78f86?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      count: '31 destinations',
      icon: '⛰️',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 5,
      name: 'City',
      description: 'Urban exploration and nightlife',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      count: '67 destinations',
      icon: '🏙️',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      id: 6,
      name: 'Wildlife',
      description: 'Close encounters with nature',
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      count: '24 destinations',
      icon: '🦁',
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  const handleCategoryClick = (category) => {
    navigate(`/destinations?category=${category.name.toLowerCase()}`);
  };

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <span className="text-2xl">🌟</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Popular Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover amazing destinations tailored to your travel style and preferences. 
            From thrilling adventures to peaceful retreats, find your perfect escape.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              onClick={() => handleCategoryClick(category)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] bg-white">
                <div className="aspect-w-16 aspect-h-12 relative">
                  {/* Loading skeleton */}
                  {imageLoading[category.id] && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="text-gray-400 text-4xl">{category.icon}</div>
                    </div>
                  )}
                  
                  <img
                    src={imageErrors[category.id] ? category.fallbackImage : category.image}
                    alt={category.name}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    onLoadStart={() => handleImageLoadStart(category.id)}
                    onError={() => handleImageError(category.id)}
                    onLoad={() => handleImageLoad(category.id)}
                  />
                  
                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                  
                  {/* Color-specific gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                </div>
                
                {/* Icon Badge */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-3xl font-bold mb-3 group-hover:text-white transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-200 mb-4 text-lg">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-white/90 font-semibold">
                      {category.count}
                    </p>
                    <div className="flex items-center space-x-2 text-white/80 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium">Explore</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/30 transition-colors duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => navigate('/destinations')}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg px-10 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Explore All Destinations</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCategories;