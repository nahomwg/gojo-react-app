import React, { useState, useEffect } from 'react';
import { useProperties } from '../hooks/useProperties';
import { PropertyFilters } from '../types';
import { Hero } from '../components/Home/Hero';
import { AISearchBar } from '../components/Search/AISearchBar';
import { FeaturedProperties } from '../components/Home/FeaturedProperties';
import { ExploreNeighborhoods } from '../components/Home/ExploreNeighborhoods';
import { PropertyGrid } from '../components/Properties/PropertyGrid';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, MapPin, Users, Star, ArrowRight, AlertTriangle, Building2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { user, isHost } = useAuth();
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritedProperties, setFavoritedProperties] = useState<string[]>([]);
  const { properties, loading, error, refetch } = useProperties(filters);

  // Load favorited properties from localStorage with error handling
  useEffect(() => {
    if (user) {
      try {
        const saved = localStorage.getItem(`favorites_${user.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setFavoritedProperties(parsed);
          }
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
        toast.error('Failed to load saved properties');
      }
    } else {
      setFavoritedProperties([]);
    }
  }, [user]);

  const handleSearch = (query: string) => {
    try {
      if (!query?.trim()) {
        toast.error('Please enter a search query');
        return;
      }

      setSearchQuery(query);
      toast.success(`Searching for: "${query}"`);
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Search failed');
    }
  };

  const handleFiltersExtracted = (extractedFilters: PropertyFilters) => {
    try {
      setFilters(extractedFilters);
      
      // Show what filters were extracted
      const filterMessages = [];
      if (extractedFilters.location) filterMessages.push(`Location: ${extractedFilters.location}`);
      if (extractedFilters.type) filterMessages.push(`Type: ${extractedFilters.type}`);
      if (extractedFilters.bedrooms) filterMessages.push(`Bedrooms: ${extractedFilters.bedrooms}`);
      if (extractedFilters.priceMax) filterMessages.push(`Max Price: ETB ${extractedFilters.priceMax.toLocaleString()}`);
      if (extractedFilters.features?.length) filterMessages.push(`Features: ${extractedFilters.features.join(', ')}`);
      
      if (filterMessages.length > 0) {
        toast.success(`AI extracted: ${filterMessages.join(' • ')}`);
      }
    } catch (err) {
      console.error('Filter extraction error:', err);
      toast.error('Failed to apply search filters');
    }
  };

  const handleFavorite = (propertyId: string) => {
    try {
      if (!user) {
        toast.error('Please sign in to save properties');
        return;
      }

      if (!propertyId?.trim()) {
        toast.error('Invalid property');
        return;
      }

      const newFavorites = favoritedProperties.includes(propertyId)
        ? favoritedProperties.filter(id => id !== propertyId)
        : [...favoritedProperties, propertyId];
      
      setFavoritedProperties(newFavorites);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
      
      toast.success(
        favoritedProperties.includes(propertyId) 
          ? 'Removed from favorites' 
          : 'Added to favorites'
      );
    } catch (err) {
      console.error('Favorite error:', err);
      toast.error('Failed to update favorites');
    }
  };

  const handleNeighborhoodClick = (neighborhood: string) => {
    try {
      if (!neighborhood?.trim()) {
        toast.error('Invalid neighborhood');
        return;
      }

      setFilters({ location: neighborhood });
      setSearchQuery(`Properties in ${neighborhood}`);
      toast.success(`Exploring ${neighborhood} properties`);
    } catch (err) {
      console.error('Neighborhood click error:', err);
      toast.error('Failed to explore neighborhood');
    }
  };

  const handleRetry = () => {
    try {
      refetch();
      toast.success('Refreshing properties...');
    } catch (err) {
      console.error('Retry error:', err);
      toast.error('Failed to refresh');
    }
  };

  const clearSearch = () => {
    try {
      setFilters({});
      setSearchQuery('');
      toast.success('Search cleared');
    } catch (err) {
      console.error('Clear search error:', err);
      toast.error('Failed to clear search');
    }
  };

  // Show host dashboard prompt for hosts
  if (isHost) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <Building2 className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Host Mode!
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Manage your properties, track performance, and grow your rental business from your dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/host"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-800 transition-all shadow-lg shadow-emerald-500/25"
              >
                <Building2 className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => {
                  // This will be handled by the header component
                  window.location.reload();
                }}
                className="inline-flex items-center space-x-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                <Search className="w-5 h-5" />
                <span>Browse Properties</span>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-16"
    >
      {/* Hero Section */}
      <Hero />
      
      {/* AI Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AISearchBar 
          onSearch={handleSearch}
          onFiltersExtracted={handleFiltersExtracted}
        />
      </motion.div>

      {/* Search Results or Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                Search Error
              </h3>
              <p className="text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
            <motion.button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Search Results Summary */}
      {(searchQuery || Object.keys(filters).length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {loading ? 'Searching...' : `Found ${properties.length} properties`}
                </h3>
                {searchQuery && (
                  <p className="text-gray-600 dark:text-gray-400">
                    for "{searchQuery}"
                  </p>
                )}
              </div>
            </div>
            
            {(searchQuery || Object.keys(filters).length > 0) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearSearch}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Clear search
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      {/* Properties Section */}
      <div>
        {(searchQuery || Object.keys(filters).length > 0) ? (
          // Search Results
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8 text-rose-500" />
                  <span>Search Results</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Properties matching your search criteria
                </p>
              </div>
            </motion.div>

            <PropertyGrid
              properties={properties}
              loading={loading}
              error={error}
              onFavorite={handleFavorite}
              favoritedProperties={favoritedProperties}
              onRetry={handleRetry}
            />
          </div>
        ) : (
          // Default Featured Properties
          <FeaturedProperties
            properties={properties}
            loading={loading}
            onFavorite={handleFavorite}
            favoritedProperties={favoritedProperties}
          />
        )}
      </div>

      {/* Explore Neighborhoods - Only show when not searching */}
      {!searchQuery && Object.keys(filters).length === 0 && (
        <ExploreNeighborhoods onNeighborhoodClick={handleNeighborhoodClick} />
      )}

      {/* Why Choose Gojo Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Gojo?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We're revolutionizing property rental in Addis Ababa with cutting-edge technology and personalized service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Sparkles,
              title: 'AI-Powered Search',
              description: 'Find your perfect property using natural language. Just describe what you want!',
              color: 'text-rose-500'
            },
            {
              icon: Star,
              title: 'Verified Properties',
              description: 'All listings are verified and quality-checked by our expert team.',
              color: 'text-yellow-500'
            },
            {
              icon: Users,
              title: 'Trusted Community',
              description: 'Join thousands of satisfied tenants and hosts in our growing community.',
              color: 'text-blue-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <div className={`w-16 h-16 ${feature.color} bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      {!user && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-12 text-white"
        >
          <h2 className="text-4xl font-bold mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who have found their perfect property in Addis Ababa. 
            Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="inline-block bg-white text-rose-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg"
              >
                Get Started Free
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}
    </motion.div>
  );
};