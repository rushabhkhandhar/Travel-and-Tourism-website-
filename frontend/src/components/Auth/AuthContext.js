import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = 'http://localhost:8000/api';

// Configure axios interceptor to automatically add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Attempting login with:', credentials.email);
      
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
        email: credentials.email,
        password: credentials.password
      });

      const { access, refresh, user: userData } = response.data;

      // Store tokens and user data
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      console.log('Login successful:', userData);
      return { success: true };

    } catch (err) {
      console.error('Login error:', err);
      
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.error || 
                          err.response?.data?.message ||
                          'Login failed. Please check your credentials.';
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Attempting registration with:', userData.email);
      
      const response = await axios.post(`${API_BASE_URL}/auth/register/`, userData);

      const { access, refresh, user: newUser } = response.data;

      // Store tokens and user data
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(newUser));

      setUser(newUser);
      setIsAuthenticated(true);

      console.log('Registration successful:', newUser);
      return { success: true };

    } catch (err) {
      console.error('Registration error:', err);
      
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.error || 
                          err.response?.data?.message ||
                          'Registration failed. Please try again.';
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const updateUser = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Updating user profile with:', userData);
      
      // Filter out read-only fields
      const { id, username, email, date_joined, ...updateData } = userData;
      
      // Filter out empty strings and null values to avoid validation errors
      const cleanedData = {};
      Object.keys(updateData).forEach(key => {
        const value = updateData[key];
        // Only include fields that have meaningful values
        if (value !== '' && value !== null && value !== undefined) {
          cleanedData[key] = value;
        }
      });
      
      console.log('Filtered update data:', cleanedData);
      
      const response = await axios.put(`${API_BASE_URL}/auth/profile/`, cleanedData);

      const updatedUser = response.data;

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      console.log('Profile updated successfully:', updatedUser);
      return { success: true, user: updatedUser };

    } catch (err) {
      console.error('Profile update error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.error || 
                          err.response?.data?.message ||
                          JSON.stringify(err.response?.data) ||
                          'Failed to update profile. Please try again.';
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};