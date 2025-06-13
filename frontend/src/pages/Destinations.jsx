import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { destinationsAPI, favoritesAPI } from '../services/api';
import { useAuth } from '../components/Auth/AuthContext';
import DestinationCard from '../components/DestinationCard';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  StarIcon,
  GlobeAltIcon,
  UsersIcon,
  TrophyIcon,
  FunnelIcon,
  HeartIcon,
  EyeIcon,
  ShareIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import './Destinations.css';

const Destinations = () => {
  const { user } = useAuth();
  
  // Core state
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStartTime, setLoadingStartTime] = useState(null);
  const [error, setError] = useState(null);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState('all');
  const [minRating, setMinRating] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [duration, setDuration] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // View and interaction state
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  const itemsPerPage = 12;

  // Filter configurations
  const priceRanges = [
    { value: 'all', label: 'Any Price' },
    { value: '0-1000', label: 'Under $1,000' },
    { value: '1000-2000', label: '$1,000 - $2,000' },
    { value: '2000-3000', label: '$2,000 - $3,000' },
    { value: '3000+', label: 'Above $3,000' }
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'duration', label: 'Duration' },
    { value: 'newest', label: 'Newest First' }
  ];

  const difficultyLevels = [
    { value: '', label: 'Any Difficulty' },
    { value: 'easy', label: 'Easy' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'challenging', label: 'Challenging' },
    { value: 'extreme', label: 'Extreme' }
  ];

  // Safe string matching helper
  const safeStringMatch = useCallback((value, searchTerm) => {
    if (!value) return false;
    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoadingStartTime(Date.now());
      
      try {
        setLoading(true);
        console.log('Fetching destinations and categories...');
        
        const [destinationsData, categoriesData] = await Promise.all([
          destinationsAPI.getDestinations(),
          destinationsAPI.getCategories()
        ]);
        
        console.log('Destinations response:', destinationsData);
        console.log('Categories response:', categoriesData);
        
        const destinationsArray = destinationsData.results || destinationsData || [];
        setDestinations(destinationsArray);
        setCategories(categoriesData || []);
        
        // Ensure minimum loading time for better UX
        const elapsedTime = Date.now() - loadingStartTime;
        const remainingTime = Math.max(0, 1500 - elapsedTime);
        
        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        
        const elapsedTime = Date.now() - loadingStartTime;
        const remainingTime = Math.max(0, 1500 - elapsedTime);
        
        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      }
    };

    fetchData();

    // Handle URL search params
    const searchParams = new URLSearchParams(location.search);
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [location.search, loadingStartTime]);

  // Advanced filtering and sorting logic
  const filteredAndSortedDestinations = useMemo(() => {
    let filtered = [...destinations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(dest =>
        safeStringMatch(dest.name, searchTerm) ||
        safeStringMatch(dest.city, searchTerm) ||
        safeStringMatch(dest.country, searchTerm) ||
        safeStringMatch(dest.short_description, searchTerm) ||
        safeStringMatch(dest.category_name, searchTerm)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(dest => 
        safeStringMatch(dest.category_name, selectedCategory)
      );
    }

    // Price range filter
    if (priceRange && priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
      filtered = filtered.filter(dest => {
        const price = parseFloat(dest.price_per_person || 0);
        if (priceRange === '3000+') {
          return price >= 3000;
        }
        return price >= parseFloat(min || 0) && price <= parseFloat(max || Infinity);
      });
    }

    // Rating filter
    if (minRating) {
      filtered = filtered.filter(dest => 
        parseFloat(dest.average_rating || 0) >= parseFloat(minRating)
      );
    }

    // Difficulty filter
    if (difficulty) {
      filtered = filtered.filter(dest =>
        safeStringMatch(dest.difficulty, difficulty)
      );
    }

    // Duration filter
    if (duration) {
      filtered = filtered.filter(dest => {
        const destDuration = parseInt(dest.duration_days || 0);
        const filterDuration = parseInt(duration);
        return Math.abs(destDuration - filterDuration) <= 1;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price_per_person || 0) - parseFloat(b.price_per_person || 0);
        case 'price-high':
          return parseFloat(b.price_per_person || 0) - parseFloat(a.price_per_person || 0);
        case 'rating':
          return parseFloat(b.average_rating || 0) - parseFloat(a.average_rating || 0);
        case 'duration':
          return parseInt(a.duration_days || 0) - parseInt(b.duration_days || 0);
        case 'newest':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        default: // popularity
          return (b.total_reviews || 0) - (a.total_reviews || 0);
      }
    });

    return filtered;
  }, [destinations, searchTerm, selectedCategory, priceRange, minRating, difficulty, duration, sortBy, safeStringMatch]);

  // Pagination
  const paginatedDestinations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedDestinations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedDestinations, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedDestinations.length / itemsPerPage);

  // Event handlers
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const toggleFavorite = useCallback(async (destinationId) => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    try {
      const response = await favoritesAPI.toggleFavorite(destinationId);
      if (response.success) {
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (response.is_favorited) {
            newFavorites.add(destinationId);
          } else {
            newFavorites.delete(destinationId);
          }
          return newFavorites;
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Show error message to user
    }
  }, [user, navigate]);

  // Load favorites status for current destinations
  const loadFavoritesStatus = useCallback(async () => {
    if (!user || destinations.length === 0) {
      return;
    }

    try {
      const destinationIds = destinations.map(dest => dest.id);
      const response = await favoritesAPI.checkFavoritesStatus(destinationIds);
      if (response.success) {
        const favoriteIds = new Set(
          Object.keys(response.favorites_status).filter(
            id => response.favorites_status[id]
          ).map(id => parseInt(id))
        );
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Error loading favorites status:', error);
    }
  }, [user, destinations]);

  // Load favorites when user or destinations change
  useEffect(() => {
    loadFavoritesStatus();
  }, [loadFavoritesStatus]);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('popularity');
    setMinRating('');
    setDifficulty('');
    setDuration('');
    setCurrentPage(1);
  }, []);

  const handleViewDetails = useCallback((destinationId) => {
    navigate(`/destinations/${destinationId}`);
  }, [navigate]);

  // Enhanced loading component
  const LoadingComponent = useMemo(() => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="destinations-header">
        <div className="header-content">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover Amazing Destinations
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore breathtaking locations and create unforgettable memories
          </motion.p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-16 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="mb-8">
            {/* Animated travel icons */}
            <div className="flex justify-center space-x-8 mb-6">
              <motion.div 
                className="text-4xl"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ✈️
              </motion.div>
              <motion.div 
                className="text-4xl"
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                🌍
              </motion.div>
              <motion.div 
                className="text-4xl"
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                📍
              </motion.div>
            </div>
            
            {/* Loading dots */}
            <div className="flex justify-center space-x-2 mb-6">
              {[0, 1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-blue-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                />
              ))}
            </div>
          </div>
          
          <motion.h3 
            className="text-2xl font-semibold text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Curating Perfect Destinations
          </motion.h3>
          <motion.p 
            className="text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Searching through thousands of incredible places worldwide...
          </motion.p>
          
          {/* Progress steps */}
          <div className="space-y-4">
            {[
              { icon: MagnifyingGlassIcon, text: 'Scanning destinations' },
              { icon: StarIcon, text: 'Analyzing reviews' },
              { icon: MapPinIcon, text: 'Mapping locations' }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-center space-x-3 text-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
              >
                <step.icon className="w-5 h-5 text-blue-500" />
                <span>{step.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Loading stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          {[
            { icon: GlobeAltIcon, value: '200+', label: 'Destinations' },
            { icon: MapPinIcon, value: '50+', label: 'Countries' },
            { icon: UsersIcon, value: '10K+', label: 'Happy Travelers' },
            { icon: TrophyIcon, value: '4.8★', label: 'Average Rating' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1 }}
            >
              <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Skeleton cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 + index * 0.1 }}
            >
              <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-300, 300] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                  <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  ), []);

  if (loading) {
    return LoadingComponent;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 text-white py-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/10 rounded-full"
              style={{
                width: Math.random() * 100 + 20,
                height: Math.random() * 100 + 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover Amazing Destinations
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Explore breathtaking locations and create unforgettable memories around the world
          </motion.p>
          
          {/* Enhanced Search Bar */}
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-2">
              <div className="flex items-center">
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search destinations, cities, countries, experiences..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="flex-1 px-4 py-4 text-lg text-gray-800 bg-transparent focus:outline-none"
                />
                <motion.button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Quick stats */}
          <motion.div 
            className="flex justify-center space-x-8 mt-12 text-blue-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold">{destinations.length}+</div>
              <div className="text-sm">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">4.8★</div>
              <div className="text-sm">Rating</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Advanced Filters and Controls */}
      <div className="container mx-auto px-4 py-12">
        {/* Category Filter Pills */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              onClick={() => handleCategoryChange('all')}
              className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:scale-105 shadow-md'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All Destinations
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryChange(category.name.toLowerCase())}
                className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.name.toLowerCase()
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:scale-105 shadow-md'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.icon} {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Advanced Controls Bar */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left side - Sorting and view controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <div className="w-4 h-4 flex flex-col space-y-0.5">
                      <div className="h-0.5 bg-current rounded"></div>
                      <div className="h-0.5 bg-current rounded"></div>
                      <div className="h-0.5 bg-current rounded"></div>
                      <div className="h-0.5 bg-current rounded"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Center - Results count */}
            <div className="text-center">
              <span className="text-lg font-semibold text-gray-800">
                {filteredAndSortedDestinations.length}
              </span>
              <span className="text-gray-600 ml-1">
                destination{filteredAndSortedDestinations.length !== 1 ? 's' : ''} found
              </span>
            </div>

            {/* Right side - Advanced filters toggle */}
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  showAdvancedFilters 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                <span>Filters</span>
              </motion.button>

              {(searchTerm || selectedCategory !== 'all' || priceRange !== 'all' || minRating || difficulty || duration) && (
                <motion.button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear all
                </motion.button>
              )}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-200 pt-6 mt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <CurrencyDollarIcon className="w-4 h-4 inline mr-2" />
                      Price Range
                    </label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {priceRanges.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Minimum Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <StarIcon className="w-4 h-4 inline mr-2" />
                      Minimum Rating
                    </label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <TrophyIcon className="w-4 h-4 inline mr-2" />
                      Difficulty
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {difficultyLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <CalendarDaysIcon className="w-4 h-4 inline mr-2" />
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      placeholder="Any duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="30"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-800">
            {searchTerm ? `Search results for "${searchTerm}"` : 
             selectedCategory !== 'all' ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Destinations` : 
             'All Destinations'}
          </h2>
          
          {totalPages > 1 && (
            <div className="text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </motion.div>

        {/* Destinations Grid/List */}
        <AnimatePresence mode="wait">
          {filteredAndSortedDestinations.length > 0 ? (
            <motion.div
              key={viewMode + selectedCategory + searchTerm + sortBy}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
              }
            >
              {paginatedDestinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  isLiked={favorites.has(destination.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="text-8xl mb-6"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🏝️
              </motion.div>
              <h3 className="text-3xl font-semibold text-gray-700 mb-4">
                No destinations found
              </h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto mb-8">
                {searchTerm 
                  ? `No destinations match your search for "${searchTerm}". Try different keywords or filters.`
                  : 'Try adjusting your filters to discover more amazing destinations.'
                }
              </p>
              <motion.button
                onClick={clearAllFilters}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear All Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            className="flex justify-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-white hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
                whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
              >
                Previous
              </motion.button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <motion.button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 shadow-md ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-white hover:text-blue-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
              
              <motion.button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-white hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
                whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Destinations;