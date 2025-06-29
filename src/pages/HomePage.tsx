import React, { useState } from 'react';
import { SearchFilters } from '../components/Search/SearchFilters';
import { PropertyGrid } from '../components/Properties/PropertyGrid';
import { useProperties } from '../hooks/useProperties';
import { PropertyFilters } from '../types';
import { Hero } from '../components/Home/Hero';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<PropertyFilters>({});
  const { properties, loading, error } = useProperties(filters);

  const handleSearch = (query: string) => {
    // This would integrate with OpenAI API for natural language search
    console.log('AI Search query:', query);
    
    // For now, we'll use basic keyword matching for Addis Ababa areas
    const addisAreas = ['bole', 'cmc', 'kazanchis', 'old airport', 'meskel square', 'merkato', 'piassa'];
    const foundArea = addisAreas.find(area => query.toLowerCase().includes(area));
    
    if (foundArea) {
      setFilters(prev => ({ ...prev, location: foundArea }));
    }
    
    // Extract bedroom count
    const bedroomMatch = query.match(/(\d+)\s*bedroom/i);
    if (bedroomMatch) {
      setFilters(prev => ({ ...prev, bedrooms: parseInt(bedroomMatch[1]) }));
    }
    
    // Extract property type
    if (query.toLowerCase().includes('office') || query.toLowerCase().includes('business') || query.toLowerCase().includes('commercial')) {
      setFilters(prev => ({ ...prev, type: 'business' }));
    } else if (query.toLowerCase().includes('apartment') || query.toLowerCase().includes('house') || query.toLowerCase().includes('residential')) {
      setFilters(prev => ({ ...prev, type: 'residential' }));
    }
  };

  const handleFavorite = (propertyId: string) => {
    // This would be implemented with a favorites system
    console.log('Toggle favorite:', propertyId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <Hero />
      
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
              Discover your next home in Addis Ababa
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
        />
      </div>
    </motion.div>
  );
};