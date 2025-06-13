import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import FeaturedDestinations from '../components/Home/FeaturedDestinations';
import PopularCategories from '../components/Home/PopularCategories';
import TestimonialsSection from '../components/Home/TestimonialsSection';
import NewsletterSection from '../components/Home/NewsletterSection';
import StatsSection from '../components/Home/StatsSection';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <PopularCategories />
      <FeaturedDestinations />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
};

export default Home;