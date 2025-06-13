import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon
} from 'react-share';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigation = {
    destinations: [
      { name: 'Popular Destinations', href: '/destinations' },
      { name: 'Adventure Tours', href: '/destinations?category=adventure' },
      { name: 'Cultural Tours', href: '/destinations?category=culture' },
      { name: 'Beach Holidays', href: '/destinations?category=beach' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Booking Guide', href: '/booking-guide' },
      { name: 'Cancellation Policy', href: '/cancellation-policy' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Refund Policy', href: '/refund' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, href: 'https://facebook.com' },
    { name: 'Twitter', icon: TwitterIcon, href: 'https://twitter.com' },
    { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: LinkedInIcon, href: 'https://linkedin.com' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <MapPinIcon className="h-8 w-8 text-primary-400" />
                <span className="text-xl font-bold">TravelTour</span>
              </Link>
              <p className="text-gray-300 mb-6 max-w-md">
                Discover the world with our expertly curated travel experiences. 
                From adventure tours to relaxing getaways, we make your dream 
                vacation a reality.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-primary-400" />
                  <span className="text-gray-300">info@traveltour.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-primary-400" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <GlobeAltIcon className="h-5 w-5 text-primary-400" />
                  <span className="text-gray-300">www.traveltour.com</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Destinations</h3>
              <ul className="space-y-2">
                {navigation.destinations.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {navigation.support.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="max-w-md">
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-300 mb-4">
                Get the latest travel deals and destination insights delivered to your inbox.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="btn-primary whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} TravelTour. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-4 md:mt-0">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;