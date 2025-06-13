import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { StarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // Enhanced testimonials data with more details
    const staticTestimonials = [
      {
        id: 1,
        name: 'Sarah Johnson',
        location: 'New York, USA',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
        rating: 5,
        comment: 'Absolutely incredible experience! TravelTour exceeded all my expectations. The attention to detail, the seamless organization, and the breathtaking destinations made our Bali trip truly magical.',
        trip: 'Bali Paradise Getaway',
        date: 'March 2024',
        highlight: 'Perfect organization'
      },
      {
        id: 2,
        name: 'Michael Chen',
        location: 'London, UK',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        rating: 5,
        comment: 'From the bustling streets of Shibuya to the serene temples of Kyoto, every moment was perfectly curated. The local guides were fantastic and really brought the culture to life.',
        trip: 'Tokyo Modern Culture',
        date: 'February 2024',
        highlight: 'Amazing local guides'
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        location: 'Barcelona, Spain',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        rating: 5,
        comment: 'Paris has always been a dream destination, and TravelTour made it even more special than I imagined. The cultural tours, the exclusive access to museums, simply perfection!',
        trip: 'Paris Cultural Heritage',
        date: 'January 2024',
        highlight: 'Exclusive experiences'
      }
    ];
    
    setTestimonials(staticTestimonials);
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6">
            <ChatBubbleLeftIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our amazing customers have to say 
            about their unforgettable adventures with us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white rounded-3xl shadow-xl p-8 relative hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <ChatBubbleLeftIcon className="w-12 h-12 text-purple-600" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                {renderStars(testimonial.rating)}
                <span className="ml-2 text-gray-600 font-semibold">
                  {testimonial.rating}.0
                </span>
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-8 leading-relaxed text-lg italic">
                "{testimonial.comment}"
              </p>

              {/* Trip & Highlight */}
              <div className="mb-6 space-y-2">
                <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
                  {testimonial.trip}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-700 text-sm font-medium">{testimonial.highlight}</span>
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-white shadow-lg"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">{testimonial.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to create your own amazing travel story?
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Join thousands of satisfied travelers and discover your next adventure
            </p>
            <button className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg px-10 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <span>Start Your Journey</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;