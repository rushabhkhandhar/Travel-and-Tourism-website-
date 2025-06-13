import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { contactAPI } from '../services/api';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  StarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    message: '',
    newsletter: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formRef, formInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [infoRef, infoInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: '💬' },
    { value: 'booking', label: 'Booking Support', icon: '📅' },
    { value: 'destinations', label: 'Destination Info', icon: '🌍' },
    { value: 'feedback', label: 'Feedback', icon: '💭' },
    { value: 'partnership', label: 'Partnership', icon: '🤝' },
    { value: 'technical', label: 'Technical Support', icon: '🔧' }
  ];

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Submit to actual API
      const response = await contactAPI.submitContactForm(formData);
      
      console.log('Contact form submitted successfully:', response);
      
      if (response.success) {
        setIsSubmitted(true);
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          category: 'general',
          message: '',
          newsletter: false
        });

        // Reset success state after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setSubmitStatus('');
        }, 5000);
      } else {
        // Handle API validation errors
        if (response.errors) {
          setErrors(response.errors);
        }
        setSubmitStatus('error');
      }

    } catch (error) {
      console.error('Error submitting contact form:', error);
      
      // Handle different types of errors
      if (error.errors) {
        setErrors(error.errors);
      }
      
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-hide status messages
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Enhanced Hero Section */}
      <motion.div 
        ref={heroRef}
        className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 text-white py-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
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
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={heroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8"
          >
            <ChatBubbleLeftRightIcon className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ y: 30, opacity: 0 }}
            animate={heroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Get in Touch
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={heroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Have questions about your next adventure? We're here to help you plan the perfect trip. 
            Reach out to our travel experts anytime!
          </motion.p>
          
          <motion.div 
            className="flex items-center justify-center space-x-8"
            initial={{ y: 30, opacity: 0 }}
            animate={heroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <HeartIcon className="w-6 h-6 text-red-400" />
              <span className="text-lg">24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <StarIcon className="w-6 h-6 text-yellow-400" />
              <span className="text-lg">Expert Advice</span>
            </div>
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="w-6 h-6 text-green-400" />
              <span className="text-lg">Global Reach</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Status Messages */}
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className={`fixed top-20 right-4 z-50 p-6 rounded-2xl shadow-2xl max-w-md ${
                submitStatus === 'success' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                  : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  submitStatus === 'success' ? 'bg-white/20' : 'bg-white/20'
                }`}>
                  {submitStatus === 'success' ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    <ExclamationTriangleIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">
                    {submitStatus === 'success' ? 'Message Sent Successfully!' : 'Oops! Something went wrong'}
                  </h4>
                  <p className="text-sm opacity-90">
                    {submitStatus === 'success' 
                      ? 'Thank you for contacting us! We\'ll get back to you within 24 hours. Check your email for confirmation.' 
                      : 'Failed to send your message. Please check your connection and try again, or contact us directly.'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setSubmitStatus('')}
                  className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Enhanced Contact Info */}
            <motion.div 
              ref={infoRef}
              className="lg:col-span-2"
              initial={{ x: -50, opacity: 0 }}
              animate={infoInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 h-full contact-card">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={infoInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <EnvelopeIcon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Let's Start a Conversation
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Whether you're planning your dream vacation or need assistance with an existing booking, 
                    our team of travel experts is here to help make your journey unforgettable.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: MapPinIcon,
                      title: 'Visit Our Office',
                      content: '123 Adventure Boulevard\nTravel District, TD 12345\nUnited States',
                      color: 'from-blue-500 to-cyan-500'
                    },
                    {
                      icon: PhoneIcon,
                      title: 'Call Us',
                      content: '+1 (555) 123-4567\nToll-free: 1-800-TRAVEL',
                      color: 'from-green-500 to-emerald-500'
                    },
                    {
                      icon: EnvelopeIcon,
                      title: 'Email Us',
                      content: 'hello@traveltour.com\nsupport@traveltour.com',
                      color: 'from-purple-500 to-pink-500'
                    },
                    {
                      icon: ClockIcon,
                      title: 'Business Hours',
                      content: 'Mon - Fri: 8:00 AM - 8:00 PM\nSat - Sun: 10:00 AM - 6:00 PM\n24/7 Emergency Support',
                      color: 'from-orange-500 to-red-500'
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={infoInView ? { y: 0, opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                          {item.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Social Media Links */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Follow Our Journey</h3>
                  <div className="flex justify-center space-x-4">
                    {['📘', '📷', '🐦', '💼'].map((emoji, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-full flex items-center justify-center text-xl transition-all duration-300"
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Contact Form */}
            <motion.div 
              ref={formRef}
              className="lg:col-span-3"
              initial={{ x: 50, opacity: 0 }}
              animate={formInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div id="contact-form" className="bg-white rounded-3xl shadow-xl p-8 contact-card">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={formInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <PaperAirplaneIcon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={formInView ? { y: 0, opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.name ? 'border-red-300 bg-red-50 shake' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={formInView ? { y: 0, opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.email ? 'border-red-300 bg-red-50 shake' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>

                  {/* Phone and Category Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={formInView ? { y: 0, opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.phone ? 'border-red-300 bg-red-50 shake' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.phone}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={formInView ? { y: 0, opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                        Inquiry Type
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 focus:border-blue-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  </div>

                  {/* Subject */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={formInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.subject ? 'border-red-300 bg-red-50 shake' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="What can we help you with?"
                    />
                    {errors.subject && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.subject}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={formInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                        errors.message ? 'border-red-300 bg-red-50 shake' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.message}
                      </motion.p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      {formData.message.length}/1000 characters
                    </p>
                  </motion.div>

                  {/* Newsletter Subscription */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={formInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl"
                  >
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="newsletter" className="text-sm text-gray-700">
                      Subscribe to our newsletter for travel tips, destination guides, and exclusive offers
                    </label>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={formInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    } text-white`}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Message...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <PaperAirplaneIcon className="w-5 h-5" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </motion.button>

                  {/* Success/Error Message */}
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center p-4 bg-green-50 border border-green-200 rounded-xl"
                    >
                      <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-green-700 font-medium">
                        Thank you for your message! We'll get back to you within 24 hours.
                      </p>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Quick answers to common questions about our travel services and booking process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  question: "How far in advance should I book?",
                  answer: "We recommend booking at least 2-3 months in advance for international trips and 4-6 weeks for domestic travel to secure the best rates and availability."
                },
                {
                  question: "What's your cancellation policy?",
                  answer: "Cancellation policies vary by destination and tour type. Most bookings can be cancelled up to 30 days before departure with minimal fees."
                },
                {
                  question: "Do you offer travel insurance?",
                  answer: "Yes, we strongly recommend travel insurance and can help you choose the right coverage for your trip. We partner with leading insurance providers."
                },
                {
                  question: "Can I customize my itinerary?",
                  answer: "Absolutely! We specialize in creating personalized travel experiences. Contact us to discuss your preferences and we'll create a custom itinerary."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, bank transfers, and offer flexible payment plans for larger bookings."
                },
                {
                  question: "Do you provide 24/7 support during travel?",
                  answer: "Yes, we offer 24/7 emergency support for all our travelers. You'll have access to our dedicated support team throughout your journey."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 faq-card"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Quick Contact Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            document.getElementById('contact-form')?.scrollIntoView({ 
              behavior: 'smooth',
              block: 'center'
            });
          }}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </motion.button>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Quick Contact
          <div className="absolute top-full right-4 w-2 h-2 bg-gray-800 transform rotate-45 -mt-1"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;