import React from 'react';
import { PropertyCard } from '../Properties/PropertyCard';
import { Property } from '../../types';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Clock, ArrowRight } from 'lucide-react';

interface FeaturedPropertiesProps {
  properties: Property[];
  loading?: boolean;
  onFavorite?: (id: string) => void;
  favoritedProperties?: string[];
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  properties,
  loading = false,
  onFavorite,
  favoritedProperties = []
}) => {
  const featuredProperties = properties.slice(0, 8);
  const trendingProperties = properties.slice(2, 6);
  const newProperties = properties.slice(4, 8);

  if (loading) {
    return (
      <div className="space-y-12">
        {/* Loading skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Featured Properties */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Featured Properties
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Hand-picked properties with exceptional value and quality
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center space-x-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <PropertyCard
                property={property}
                onFavorite={onFavorite}
                isFavorited={favoritedProperties.includes(property.id)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Properties */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Trending Now
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Most viewed properties this week in Addis Ababa
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              <PropertyCard
                property={property}
                onFavorite={onFavorite}
                isFavorited={favoritedProperties.includes(property.id)}
              />
              {/* Trending Badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                🔥 Hot
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Properties */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-6 h-6 text-blue-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Just Listed
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Fresh properties added in the last 7 days
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              <PropertyCard
                property={property}
                onFavorite={onFavorite}
                isFavorited={favoritedProperties.includes(property.id)}
              />
              {/* New Badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                ✨ New
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};