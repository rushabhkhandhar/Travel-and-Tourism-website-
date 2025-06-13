import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const StatsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    {
      number: '50K+',
      label: 'Happy Travelers',
      description: 'Customers who have experienced our amazing tours'
    },
    {
      number: '200+',
      label: 'Destinations',
      description: 'Incredible places around the world to explore'
    },
    {
      number: '15+',
      label: 'Years Experience',
      description: 'Providing exceptional travel experiences'
    },
    {
      number: '98%',
      label: 'Satisfaction Rate',
      description: 'Customer satisfaction based on reviews'
    }
  ];

  return (
    <section className="py-16 bg-primary-600">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Journey in Numbers
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who have made their dream trips a reality
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 hover:bg-opacity-20 transition-all">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </h3>
                <h4 className="text-xl font-semibold text-primary-100 mb-2">
                  {stat.label}
                </h4>
                <p className="text-primary-200 text-sm">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;