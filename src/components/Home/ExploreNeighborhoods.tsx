import React from 'react';
import { MapPin, TrendingUp, Users, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NEIGHBORHOODS = [
  {
    name: 'Bole',
    description: 'Modern business district with upscale amenities',
    properties: 120,
    avgPrice: '35,000',
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
    trending: true
  },
  {
    name: 'CMC',
    description: 'Central location with excellent connectivity',
    properties: 85,
    avgPrice: '28,000',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    trending: false
  },
  {
    name: 'Kazanchis',
    description: 'Diplomatic area with premium properties',
    properties: 65,
    avgPrice: '42,000',
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
    trending: true
  },
  {
    name: 'Old Airport',
    description: 'Quiet residential area with family homes',
    properties: 95,
    avgPrice: '25,000',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    trending: false
  },
  {
    name: 'Meskel Square',
    description: 'Historic center with cultural significance',
    properties: 75,
    avgPrice: '30,000',
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
    trending: false
  },
  {
    name: 'Merkato',
    description: 'Commercial hub with business opportunities',
    properties: 110,
    avgPrice: '22,000',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    trending: true
  }
];

interface ExploreNeighborhoodsProps {
  onNeighborhoodClick?: (neighborhood: string) => void;
}

export const ExploreNeighborhoods: React.FC<ExploreNeighborhoodsProps> = ({ onNeighborhoodClick }) => {
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <MapPin className="w-8 h-8 text-rose-500" />
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Explore Neighborhoods
          </h2>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Discover the unique character and opportunities in Addis Ababa's most sought-after areas
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {NEIGHBORHOODS.map((neighborhood, index) => (
          <motion.div
            key={neighborhood.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            onClick={() => onNeighborhoodClick?.(neighborhood.name)}
            className="group cursor-pointer"
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={neighborhood.image}
                  alt={neighborhood.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Trending Badge */}
                {neighborhood.trending && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Trending</span>
                  </div>
                )}

                {/* Neighborhood Name */}
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {neighborhood.name}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {neighborhood.description}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Home className="w-4 h-4 text-gray-400" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {neighborhood.properties}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Properties</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <span className="text-sm text-gray-500">ETB</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {neighborhood.avgPrice}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Price</p>
                  </div>
                </div>

                {/* Explore Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg shadow-rose-500/25 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300"
                >
                  Explore {neighborhood.name}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <MapPin className="w-5 h-5" />
          <span>View All Neighborhoods</span>
        </motion.button>
      </motion.div>
    </section>
  );
};