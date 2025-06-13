import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';
import { 
  MagnifyingGlassIcon,
  UserIcon,
  ChevronDownIcon,
  MapPinIcon,
  HeartIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchInputRef, setSearchInputRef] = useState(null);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef) {
          searchInputRef.focus();
        }
      }
      // Escape to clear search
      if (e.key === 'Escape' && searchInputRef === document.activeElement) {
        setSearchQuery('');
        searchInputRef.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchInputRef]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Destinations', href: '/destinations', icon: '🌎' },
    { name: 'About', href: '/about', icon: 'ℹ️' },
    { name: 'Contact', href: '/contact', icon: '📞' },
    ...(isAuthenticated ? [{ name: 'My Bookings', href: '/my-bookings', icon: '📅' }] : []),
  ];

  const isActiveLink = (href) => {
    return location.pathname === href;
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleClickOutside = (e) => {
    if (isUserMenuOpen && !e.target.closest('.user-menu-container')) {
      setIsUserMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  return (
    <nav className={`bg-white shadow-lg sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-xl bg-white/95 backdrop-blur-md' : 'shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group transition-transform duration-200 hover:scale-105"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-white font-bold text-lg">🌍</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TravelTour
                </span>
                <span className="text-xs text-gray-500 -mt-1">Discover Amazing Places</span>
              </div>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-shrink-0">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isActiveLink(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </span>
                {isActiveLink(item.href) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Enhanced Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-lg mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-200" />
                <input
                  ref={setSearchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations, cities, countries..."
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-2xl bg-gray-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
                {!searchQuery && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md hidden xl:block">
                    ⌘K
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Medium Screen Search Button */}
          <div className="hidden md:flex lg:hidden items-center">
            <button
              onClick={() => searchInputRef?.focus()}
              className="p-3 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Enhanced User Menu */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {isAuthenticated ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="relative">
                    <img
                      src={user?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.first_name || 'User')}&background=3b82f6&color=fff&size=40`}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-gray-200 group-hover:border-blue-300 transition-colors duration-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.first_name || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email || 'user@example.com'}
                    </div>
                  </div>
                  <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">{user?.first_name || 'User'}</div>
                      <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        to="/my-bookings"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <MapPinIcon className="h-4 w-4 mr-3 text-gray-400" />
                        My Bookings
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
                        Profile Settings
                      </Link>
                      <Link
                        to="/favorites"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <HeartIcon className="h-4 w-4 mr-3 text-gray-400" />
                        Favorites
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {/* Mobile Search */}
            <div className="pb-4 border-b border-gray-100">
              <form onSubmit={handleSearch} className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations, cities, countries..."
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </form>
            </div>

            {/* Mobile Navigation Links */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActiveLink(item.href)
                    ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-100">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <img
                      src={user?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.first_name || 'User')}&background=3b82f6&color=fff&size=40`}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user?.first_name || 'User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon className="h-5 w-5" />
                    <span>Profile Settings</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;