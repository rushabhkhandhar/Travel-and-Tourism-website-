import axios from 'axios';

// Make sure this matches your backend URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

console.log('API_BASE_URL:', API_BASE_URL); // Debug log

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      baseURL: config.baseURL
    });
    
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken
          });
          
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  test: async () => {
    try {
      console.log('Testing API connection...');
      const response = await apiClient.get('/auth/test/');
      console.log('API test successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('API test failed:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      console.log('Registering user:', userData);
      const response = await apiClient.post('/auth/register/', userData);
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('Logging in user:', credentials);
      const response = await apiClient.post('/auth/login/', credentials);
      console.log('Login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: async (refreshToken) => {
    try {
      const response = await apiClient.post('/auth/logout/', { refresh: refreshToken });
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile/');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
};

export const destinationsAPI = {
  getDestinations: async (params = {}) => {
    try {
      const response = await apiClient.get('/destinations/', { params });
      console.log('Destinations API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching destinations:', error);
      return { results: [] };
    }
  },

  getDestination: async (id) => {
    try {
      const response = await apiClient.get(`/destinations/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching destination:', error);
      throw error;
    }
  },

  getFeatured: async () => {
    try {
      const response = await apiClient.get('/destinations/featured/');
      console.log('Featured destinations response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured destinations:', error);
      return [];
    }
  },

  getCategories: async () => {
    try {
      const response = await apiClient.get('/destinations/categories/');
      console.log('Categories API response:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  searchDestinations: async (query) => {
    try {
      const response = await apiClient.get('/destinations/search/', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching destinations:', error);
      return [];
    }
  }
};

export const bookingsAPI = {
  getBookings: async () => {
    try {
      const response = await apiClient.get('/bookings/');
      console.log('Bookings response:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  getBooking: async (id) => {
    try {
      const response = await apiClient.get(`/bookings/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  createBooking: async (bookingData) => {
    try {
      const response = await apiClient.post('/bookings/', bookingData);
      console.log('Create booking response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  updateBooking: async (id, bookingData) => {
    try {
      const response = await apiClient.put(`/bookings/${id}/`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  cancelBooking: async (id) => {
    try {
      const response = await apiClient.patch(`/bookings/${id}/`, { status: 'cancelled' });
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }
};

export const reviewsAPI = {
  getReviews: async (destinationId) => {
    try {
      const response = await apiClient.get(`/reviews/?destination=${destinationId}`);
      console.log('Reviews response:', response.data);
      return Array.isArray(response.data) ? response.data : response.data.results || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  createReview: async (reviewData) => {
    try {
      const response = await apiClient.post('/reviews/', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }
};

export const weatherAPI = {
  getWeather: async (city) => {
    try {
      // For now, return mock weather data since we don't have a weather service set up
      const mockWeather = {
        city: city,
        temperature: Math.floor(Math.random() * 20) + 15, // 15-35°C
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
        forecast: []
      };
      
      // Generate 5-day forecast
      for (let i = 0; i < 5; i++) {
        mockWeather.forecast.push({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          temperature: Math.floor(Math.random() * 20) + 15,
          condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)]
        });
      }
      
      console.log('Weather data (mock):', mockWeather);
      return mockWeather;
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }
};

export const contactAPI = {
  // Submit contact form (no authentication required)
  submitContactForm: async (formData) => {
    try {
      console.log('Submitting contact form:', formData);
      const response = await apiClient.post('/contacts/submit/', formData);
      console.log('Contact form response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to send message. Please check your connection and try again.',
        errors: {}
      };
    }
  },

  // Get all contact submissions (admin only)
  getContacts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      
      const response = await apiClient.get(`/contacts/?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  // Get specific contact (admin only)
  getContact: async (contactId) => {
    try {
      const response = await apiClient.get(`/contacts/${contactId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  },

  // Update contact status (admin only)
  updateContact: async (contactId, updateData) => {
    try {
      const response = await apiClient.patch(`/contacts/${contactId}/`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }
};

export const favoritesAPI = {
  // Toggle favorite status for a destination
  toggleFavorite: async (destinationId) => {
    try {
      console.log('Toggling favorite for destination:', destinationId);
      const response = await apiClient.post('/favorites/toggle/', {
        destination_id: destinationId
      });
      console.log('Toggle favorite response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to update favorite. Please try again.',
        error: error.message
      };
    }
  },

  // Check favorite status for multiple destinations
  checkFavoritesStatus: async (destinationIds) => {
    try {
      console.log('Checking favorites status for:', destinationIds);
      const response = await apiClient.post('/favorites/status/', {
        destination_ids: destinationIds
      });
      console.log('Favorites status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking favorites status:', error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to check favorites status.',
        favorites_status: {}
      };
    }
  },

  // Get user's favorite destinations
  getFavoriteDestinations: async () => {
    try {
      console.log('Fetching user favorites');
      const response = await apiClient.get('/favorites/destinations/');
      console.log('User favorites response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to fetch favorites. Please try again.',
        favorites: []
      };
    }
  },

  // Get user's favorite lists
  getFavoriteLists: async () => {
    try {
      const response = await apiClient.get('/favorites/lists/');
      return response.data;
    } catch (error) {
      console.error('Error fetching favorite lists:', error);
      throw error;
    }
  },

  // Create a new favorite list
  createFavoriteList: async (listData) => {
    try {
      const response = await apiClient.post('/favorites/lists/', listData);
      return response.data;
    } catch (error) {
      console.error('Error creating favorite list:', error);
      throw error;
    }
  },

  // Get specific favorite list
  getFavoriteList: async (listId) => {
    try {
      const response = await apiClient.get(`/favorites/lists/${listId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching favorite list:', error);
      throw error;
    }
  },

  // Update favorite list
  updateFavoriteList: async (listId, updateData) => {
    try {
      const response = await apiClient.patch(`/favorites/lists/${listId}/`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating favorite list:', error);
      throw error;
    }
  },

  // Delete favorite list
  deleteFavoriteList: async (listId) => {
    try {
      await apiClient.delete(`/favorites/lists/${listId}/`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting favorite list:', error);
      throw error;
    }
  },

  // Add destination to favorite list
  addToFavoriteList: async (listId, destinationId, notes = '') => {
    try {
      const response = await apiClient.post(`/favorites/lists/${listId}/add/`, {
        destination_id: destinationId,
        notes: notes
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to favorite list:', error);
      throw error;
    }
  },

  // Remove destination from favorite list
  removeFromFavoriteList: async (listId, destinationId) => {
    try {
      const response = await apiClient.delete(`/favorites/lists/${listId}/remove/${destinationId}/`);
      return response.data;
    } catch (error) {
      console.error('Error removing from favorite list:', error);
      throw error;
    }
  }
};

export default apiClient;