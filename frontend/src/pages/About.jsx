import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About TravelTour
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your trusted partner in creating unforgettable travel experiences
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4">
                Founded with a passion for travel and adventure, TravelTour has been connecting 
                travelers with amazing destinations around the world. We believe that travel 
                has the power to transform lives and create lasting memories.
              </p>
              <p className="text-gray-600">
                Our team of travel experts curates each destination and experience to ensure 
                you get the most authentic and memorable journey possible.
              </p>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">🌍</div>
              <p className="text-gray-500">Connecting You to the World</p>
            </div>
          </div>

          {/* Mission */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To make travel accessible, memorable, and transformative for everyone. 
              We strive to provide exceptional service and unique experiences that 
              connect you with the beauty and diversity of our world.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate to bring you the latest in travel technology and experiences.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2">Passion</h3>
              <p className="text-gray-600">
                Our love for travel drives everything we do, from planning to execution.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Trust</h3>
              <p className="text-gray-600">
                We build lasting relationships based on trust, transparency, and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;