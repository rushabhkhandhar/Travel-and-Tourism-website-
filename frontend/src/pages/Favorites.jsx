import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext';
import { favoritesAPI } from '../services/api';
import {
  HeartIcon,
  MapPinIcon,
  StarIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  FolderIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('destinations');
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListData, setNewListData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (user) {
      loadFavorites();
      loadFavoriteLists();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesAPI.getFavoriteDestinations();
      if (response.success) {
        setFavorites(response.favorites || []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const loadFavoriteLists = async () => {
    try {
      const lists = await favoritesAPI.getFavoriteLists();
      setFavoriteLists(lists);
    } catch (error) {
      console.error('Error loading favorite lists:', error);
    }
  };

  const handleRemoveFavorite = async (destinationId) => {
    try {
      const response = await favoritesAPI.toggleFavorite(destinationId);
      if (response.success && !response.is_favorited) {
        setFavorites(prev => prev.filter(fav => fav.id !== destinationId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    try {
      const newList = await favoritesAPI.createFavoriteList(newListData);
      setFavoriteLists(prev => [...prev, newList]);
      setNewListData({ name: '', description: '' });
      setShowCreateList(false);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      try {
        await favoritesAPI.deleteFavoriteList(listId);
        setFavoriteLists(prev => prev.filter(list => list.id !== listId));
      } catch (error) {
        console.error('Error deleting list:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-4"
        >
          <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view and manage your favorite destinations.
          </p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 via-red-500 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <HeartSolidIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Favorite Destinations
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Keep track of the places that captured your heart and plan your next adventure
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl mb-8 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'destinations'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Destinations
          </button>
          <button
            onClick={() => setActiveTab('lists')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'lists'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            My Lists
          </button>
        </div>

        {/* Destinations Tab */}
        {activeTab === 'destinations' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Failed to Load Favorites
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={loadFavorites}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : favorites.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <HeartIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  No Favorites Yet
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start exploring destinations and click the heart icon to save your favorites here.
                </p>
                <Link
                  to="/destinations"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  Explore Destinations
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {favorites.map((destination, index) => (
                    <motion.div
                      key={destination.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={destination.main_image_url || destination.image_url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'}
                          alt={destination.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400';
                          }}
                        />
                        
                        {/* Remove from favorites button */}
                        <button
                          onClick={() => handleRemoveFavorite(destination.id)}
                          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white hover:scale-110 transition-all duration-200 group/heart"
                          title="Remove from favorites"
                        >
                          <HeartSolidIcon className="w-5 h-5 group-hover/heart:scale-110 transition-transform" />
                        </button>

                        {/* Favorited date */}
                        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {new Date(destination.favorited_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {destination.name}
                          </h3>
                          <div className="flex items-center text-yellow-500 ml-2">
                            <StarIcon className="w-4 h-4 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{destination.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          <span className="text-sm">{destination.location}, {destination.country}</span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {destination.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-blue-600">
                            {destination.price_range}
                          </span>
                          <Link
                            to={`/destinations/${destination.id}`}
                            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                          >
                            <EyeIcon className="w-4 h-4 mr-1" />
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {/* Lists Tab */}
        {activeTab === 'lists' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Create List Button */}
            <div className="text-center mb-8">
              <button
                onClick={() => setShowCreateList(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create New List
              </button>
            </div>

            {/* Create List Modal */}
            <AnimatePresence>
              {showCreateList && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                  onClick={() => setShowCreateList(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Create New List</h3>
                    <form onSubmit={handleCreateList}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          List Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newListData.name}
                          onChange={(e) => setNewListData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Summer 2025 Trip"
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description (optional)
                        </label>
                        <textarea
                          value={newListData.description}
                          onChange={(e) => setNewListData(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="Describe your list..."
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowCreateList(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Create List
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lists Grid */}
            {favoriteLists.length === 0 ? (
              <div className="text-center py-16">
                <FolderIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  No Lists Created
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Create custom lists to organize your favorite destinations by theme, season, or trip plans.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteLists.map((list, index) => (
                  <motion.div
                    key={list.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{list.name}</h3>
                        {list.description && (
                          <p className="text-gray-600 text-sm">{list.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete list"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      {list.destinations_count} destination{list.destinations_count !== 1 ? 's' : ''}
                    </div>

                    {/* Preview destinations */}
                    {list.destinations && list.destinations.length > 0 && (
                      <div className="flex -space-x-2 mb-4">
                        {list.destinations.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.destination.main_image_url || item.destination.image_url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=100'}
                            alt={item.destination.name}
                            className="w-10 h-10 rounded-full border-2 border-white object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=100';
                            }}
                          />
                        ))}
                        {list.destinations_count > 3 && (
                          <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium">
                            +{list.destinations_count - 3}
                          </div>
                        )}
                      </div>
                    )}

                    <Link
                      to={`/favorites/lists/${list.id}`}
                      className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View List
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
