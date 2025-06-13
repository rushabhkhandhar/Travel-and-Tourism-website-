import { destinationsAPI } from './api';

export const destinationService = {
  async getAllDestinations(params = {}) {
    try {
      return await destinationsAPI.getDestinations(params);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      return { results: [] };
    }
  },

  async getDestinationById(id) {
    try {
      return await destinationsAPI.getDestination(id);
    } catch (error) {
      console.error('Error fetching destination:', error);
      throw error;
    }
  },

  async getFeaturedDestinations() {
    try {
      return await destinationsAPI.getFeatured();
    } catch (error) {
      console.error('Error fetching featured destinations:', error);
      return [];
    }
  },

  async getCategories() {
    try {
      return await destinationsAPI.getCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  async searchDestinations(query) {
    try {
      return await destinationsAPI.searchDestinations(query);
    } catch (error) {
      console.error('Error searching destinations:', error);
      return [];
    }
  }
};

export default destinationService;