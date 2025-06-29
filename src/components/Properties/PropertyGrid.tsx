import React from 'react';
import { PropertyCard } from './PropertyCard';
import { Property } from '../../types';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, MapPin, Filter } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  error?: string | null;
  onFavorite?: (id: string) => void;
  favoritedProperties?: string[];
  onRetry?: () => void;
  showLocation?: boolean;
  searchQuery?: string;
  activeFilters?: any;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  loading = false,
  error = null,
  onFavorite,
  favoritedProperties = [],
  onRetry,
  showLocation = false,
  searchQuery,
  activeFilters
}) => {
  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800"
      >
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to Load Properties
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-6 max-w-md mx-auto">
          {error}
        </p>
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </motion.button>
        )}
      </motion.div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-700" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              </div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!properties || properties.length === 0) {
    const hasActiveFilters = activeFilters && Object.keys(activeFilters).some(key => activeFilters[key] !== undefined);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-3xl"
      >
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          {hasActiveFilters ? (
            <Filter className="w-12 h-12 text-gray-400" />
          ) : searchQuery ? (
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {hasActiveFilters ? 'No Properties Match Your Filters' : 
           searchQuery ? `No Results for "${searchQuery}"` : 
           'No Properties Found'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {hasActiveFilters ? 
            'Try adjusting your search filters to see more properties.' :
            searchQuery ? 
              'Try a different search term or browse all properties.' :
              'We couldn\'t find any properties matching your criteria. Try adjusting your search filters or check back later for new listings.'
          }
        </p>
        
        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Active filters:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(activeFilters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <span
                    key={key}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium"
                  >
                    {key === 'type' ? `Type: ${value}` :
                     key === 'location' ? `Location: ${value}` :
                     key === 'bedrooms' ? `${value} bedrooms` :
                     key === 'priceMax' ? `Under ETB ${value.toLocaleString()}` :
                     key === 'priceMin' ? `Over ETB ${value.toLocaleString()}` :
                     `${key}: ${value}`}
                  </span>
                );
              })}
            </div>
          </div>
        )}
        
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </motion.button>
        )}
      </motion.div>
    );
  }

  // Success state - render properties
  return (
    <div className="space-y-6">
      {/* Results Summary */}
      {(searchQuery || activeFilters) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Found {properties.length} propert{properties.length === 1 ? 'y' : 'ies'}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
              {activeFilters?.location && (
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  in {activeFilters.location}, Addis Ababa
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property, index) => {
          // Validate property data before rendering
          if (!property || !property.id || !property.title) {
            console.warn('Invalid property data:', property);
            return null;
          }

          return (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PropertyCard
                property={property}
                onFavorite={onFavorite}
                isFavorited={favoritedProperties.includes(property.id)}
                showLocation={showLocation}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Load More Button (for pagination) */}
      {properties.length >= 12 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Load More Properties
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};