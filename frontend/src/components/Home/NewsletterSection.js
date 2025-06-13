import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  EnvelopeIcon, 
  CheckCircleIcon, 
  GlobeAltIcon,
  MapIcon,
  CameraIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    }, 1000);
  };

  const benefits = [
    {
      icon: GlobeAltIcon,
      title: 'Exclusive Deals',
      description: 'Get access to special discounts and early bird offers'
    },
    {
      icon: MapIcon,
      title: 'Travel Guides',
      description: 'Detailed destination guides and insider tips'
    },
    {
      icon: CameraIcon,
      title: 'Photo Inspiration',
      description: 'Stunning photography from around the world'
    },
    {
      icon: HeartIcon,
      title: 'Curated Experiences',
      description: 'Handpicked experiences tailored to your interests'
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center text-white mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Inspired with Travel Updates
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Join thousands of fellow travelers and get the latest destinations, 
            travel tips, and exclusive offers delivered to your inbox
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Newsletter Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
              {!isSubscribed ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Subscribe to Our Newsletter
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-12 pr-4 py-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 backdrop-blur-sm"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                          <span>Subscribing...</span>
                        </div>
                      ) : (
                        'Subscribe Now'
                      )}
                    </button>
                  </form>
                  
                  <p className="text-sm text-primary-100 mt-4 text-center">
                    No spam, unsubscribe at any time. Your privacy is important to us.
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <CheckCircleIcon className="h-16 w-16 text-white mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Welcome Aboard!
                  </h3>
                  <p className="text-primary-100">
                    You're now subscribed to our newsletter. Get ready for amazing travel inspiration!
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 lg:order-2"
          >
            <h3 className="text-2xl font-bold text-white mb-8">
              What You'll Get:
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-primary-100">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-primary-100 text-lg">
            Join <span className="font-bold text-white">25,000+</span> travelers who already subscribe
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;