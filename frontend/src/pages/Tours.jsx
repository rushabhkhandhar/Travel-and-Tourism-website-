import React, { useState, useEffect } from 'react';
import { destinationsAPI } from '../services/api';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [toursResponse, categoriesResponse] = await Promise.all([
          destinationsAPI.getDestinations(),
          destinationsAPI.getCategories()
        ]);

        // Handle tours (same as destinations for now)
        if (Array.isArray(toursResponse)) {
          setTours(toursResponse);
        } else if (toursResponse?.results) {
          setTours(toursResponse.results);
        }

        if (Array.isArray(categoriesResponse)) {
          setCategories(categoriesResponse);
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTours = tours.filter(tour => 
    selectedCategory === '' || tour.category === parseInt(selectedCategory)
  );

  const sortedTours = [...filteredTours].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price_per_person - b.price_per_person;
      case 'duration':
        return a.duration_days - b.duration_days;
      case 'rating':
        return b.average_rating - a.average_rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading tours...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Tours
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explore our curated selection of guided tours and adventures around the world
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Tours Coming Soon!
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We're working hard to bring you the best tour experiences. 
            Check back soon for exciting tour packages and adventures.
          </p>
          <div className="text-6xl mb-8">🏃‍♂️💨</div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-200">
            Notify Me When Ready
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tours;