import React, { useState, useEffect } from 'react';
import { SearchFilters } from '../components/Search/SearchFilters';
import { PropertyGrid } from '../components/Properties/PropertyGrid';
import { AISearchBar } from '../components/Search/AISearchBar';
import { useProperties } from '../hooks/useProperties';
import { PropertyFilters } from '../types';
import { Hero } from '../components/Home/Hero';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { isHost } = useAuth();
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { properties, loading, error } = useProperties(filters);

  // Redirect hosts to dashboard
  useEffect(() => {
    if (isHost) {
      window.location.href = '/host';
    }
  }, [isHost]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Search query:', query);
  };

  const handleFiltersExtracted = (extractedFilters: PropertyFilters) => {
    console.log('Extracted filters:', extractedFilters);
    setFilters(prev => ({ ...prev, ...extractedFilters }));
  };

  const handleFavorite = (propertyId: string) => {
    // This would be implemented with a favorites system
    console.log('Toggle favorite:', propertyId);
  };

  // Don't render for hosts
  if (isHost) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <Hero />
      
      {/* AI Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-6"
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <Sparkles className="w-8 h-8 text-rose-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI-Powered Property Search
            </h2>
          </motion.div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Just describe what you're looking for in natural language, and our AI will find the perfect properties for you
          </p>
        </div>

        <AISearchBar
          onSearch={handleSearch}
          onFiltersExtracted={handleFiltersExtracted}
        />
      </motion.div>
      
      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
      />
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
        >
          <p className="text-red-600 dark:text-red-400">Error loading properties: {error}</p>
        </motion.div>
      )}

      <div>
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              <span>Available Properties</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {searchQuery ? `Results for "${searchQuery}"` : 'Discover your next home in Addis Ababa'}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-right"
          >
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {loading ? 'Loading...' : `${properties.length} properties`}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filters.location && `in ${filters.location}`}
            </p>
          </motion.div>
        </div>

        <PropertyGrid
          properties={properties}
          loading={loading}
          onFavorite={handleFavorite}
          favoritedProperties={[]} // Would come from user preferences
          showLocation={true} // Show coordinates for development
        />
      </div>
    </motion.div>
  );
};