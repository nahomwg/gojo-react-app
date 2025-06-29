import React, { useState, useEffect } from 'react';
import { SearchFilters } from '../components/Search/SearchFilters';
import { PropertyGrid } from '../components/Properties/PropertyGrid';
import { AISearchBar } from '../components/Search/AISearchBar';
import { FeaturedProperties } from '../components/Home/FeaturedProperties';
import { ExploreNeighborhoods } from '../components/Home/ExploreNeighborhoods';
import { useProperties } from '../hooks/useProperties';
import { PropertyFilters } from '../types';
import { Hero } from '../components/Home/Hero';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, MapPin } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { isHost } = useAuth();
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const { properties, loading, error, refetch } = useProperties(filters);

  // Redirect hosts to dashboard
  useEffect(() => {
    if (isHost) {
      window.location.href = '/host';
    }
  }, [isHost]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowAdvancedSearch(true);
    console.log('Search query:', query);
  };

  const handleFiltersExtracted = (extractedFilters: PropertyFilters) => {
    console.log('Extracted filters:', extractedFilters);
    setFilters(prev => ({ ...prev, ...extractedFilters }));
    setShowAdvancedSearch(true);
  };

  const handleNeighborhoodClick = (neighborhood: string) => {
    setFilters(prev => ({ ...prev, location: neighborhood }));
    setShowAdvancedSearch(true);
    // Scroll to results
    setTimeout(() => {
      document.getElementById('search-results')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleFavorite = (propertyId: string) => {
    // This would be implemented with a favorites system
    console.log('Toggle favorite:', propertyId);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setShowAdvancedSearch(false);
  };

  // Don't render for hosts
  if (isHost) {
    return null;
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined) || searchQuery;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
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

      {/* Conditional Content Based on Search State */}
      {hasActiveFilters ? (
        /* Search Results View */
        <div id="search-results" className="space-y-8">
          {/* Advanced Search Filters */}
          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
          />
          
          {/* Clear Filters Button */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-primary-600" />
                <span>Search Results</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {searchQuery ? `Results for "${searchQuery}"` : 'Filtered properties in Addis Ababa'}
              </p>
            </motion.div>
            
            <motion.button
              onClick={clearFilters}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Clear all filters</span>
              <MapPin className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
            >
              <p className="text-red-600 dark:text-red-400">Error loading properties: {error}</p>
            </motion.div>
          )}

          {/* Search Results Grid */}
          <PropertyGrid
            properties={properties}
            loading={loading}
            error={error}
            onFavorite={handleFavorite}
            favoritedProperties={[]} // Would come from user preferences
            onRetry={refetch}
            showLocation={true}
            searchQuery={searchQuery}
            activeFilters={filters}
          />
        </div>
      ) : (
        /* Default Home View */
        <div className="space-y-16">
          {/* Featured Properties */}
          <FeaturedProperties
            properties={properties}
            loading={loading}
            onFavorite={handleFavorite}
            favoritedProperties={[]}
          />

          {/* Explore Neighborhoods */}
          <ExploreNeighborhoods onNeighborhoodClick={handleNeighborhoodClick} />

          {/* Quick Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-3xl p-8 md:p-12 text-center border border-primary-200 dark:border-primary-800"
          >
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Ready to Find Your Perfect Property?
              </h3>
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Use our advanced search to find exactly what you're looking for, or browse our curated collections above.
            </p>

            <motion.button
              onClick={() => setShowAdvancedSearch(true)}
              className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2 mx-auto shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Advanced Search</span>
            </motion.button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};