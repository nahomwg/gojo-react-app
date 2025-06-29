import React, { useState } from 'react';
import { PropertyGrid } from '../components/Properties/PropertyGrid';
import { useSearchPreferences } from '../hooks/useSearchPreferences';
import { useProperties } from '../hooks/useProperties';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Bell, Trash2, Plus, Star, TrendingUp, MapPin, Users, Sparkles, ArrowRight, Lock, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export const SavedPropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const { preferences, loading: preferencesLoading, deletePreference } = useSearchPreferences();
  const { properties, loading: propertiesLoading } = useProperties();
  const { favorites, toggleFavorite, isFavorited } = useFavorites();
  const [activeTab, setActiveTab] = useState<'featured' | 'trending' | 'new'>('featured');

  const handleDeletePreference = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved search?')) return;
    
    try {
      await deletePreference(id);
    } catch (error) {
      console.error('Error deleting preference:', error);
    }
  };

  // Get favorited properties
  const favoritedProperties = properties.filter(property => 
    favorites.includes(property.id)
  );

  // Mock featured properties (in real app, these would be curated)
  const featuredProperties = properties.slice(0, 6);
  const trendingProperties = properties.slice(2, 8);
  const newProperties = properties.slice(4, 10);

  const getTabProperties = () => {
    switch (activeTab) {
      case 'trending': return trendingProperties;
      case 'new': return newProperties;
      default: return featuredProperties;
    }
  };

  if (!user) {
    // Show beautiful property showcase for non-logged users
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-12"
      >
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-black/10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          </div>
          
          <div className="relative px-8 py-16 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Heart className="w-8 h-8 text-red-400" />
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Discover Amazing
                <span className="block text-primary-200">Properties in Addis Ababa</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
                Save your favorite properties and never miss out on your dream home
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2 shadow-lg"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Start Saving Properties</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors backdrop-blur-sm"
                  >
                    Already have an account?
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Heart,
              title: 'Save Favorites',
              description: 'Keep track of properties you love with our smart favorites system',
              color: 'text-red-500'
            },
            {
              icon: Bell,
              title: 'Smart Alerts',
              description: 'Get notified when new properties match your saved searches',
              color: 'text-blue-500'
            },
            {
              icon: TrendingUp,
              title: 'Market Insights',
              description: 'Track price changes and market trends for your saved properties',
              color: 'text-emerald-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 text-center"
            >
              <div className={`w-16 h-16 ${feature.color} bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Property Showcase Tabs */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Explore Properties
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Discover what makes Addis Ababa special
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              {[
                { key: 'featured', label: 'Featured', icon: Star },
                { key: 'trending', label: 'Trending', icon: TrendingUp },
                { key: 'new', label: 'New', icon: Plus }
              ].map(({ key, label, icon: Icon }) => (
                <motion.button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === key
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Property Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PropertyGrid
                properties={getTabProperties()}
                loading={propertiesLoading}
                onFavorite={() => {}} // Disabled for non-logged users
                favoritedProperties={[]}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-3xl p-8 md:p-12 text-center border border-primary-200 dark:border-primary-800">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Lock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Save Your Dream Property?
            </h3>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have found their perfect home in Addis Ababa. 
              Create your account to save properties, set up alerts, and never miss out.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2 shadow-lg"
                >
                  <Users className="w-5 h-5" />
                  <span>Create Free Account</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="border-2 border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-400 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  Sign In Instead
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Logged-in user view
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <Heart className="w-8 h-8 text-red-500" />
            <span>Saved Properties</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your favorite properties and saved searches
          </p>
        </motion.div>
      </div>

      {/* Saved Searches */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Saved Searches</h2>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              Get notified for new matches
            </span>
          </div>
        </div>

        {preferencesLoading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        ) : preferences.length === 0 ? (
          <div className="p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Bell className="w-12 h-12 text-blue-500" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No saved searches yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Save your search preferences to get notified when new matching properties are available.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Search Alert</span>
            </Link>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {preferences.map((preference, index) => (
              <motion.div
                key={preference.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{preference.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {preference.type && (
                      <span className="capitalize bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {preference.type}
                      </span>
                    )}
                    {preference.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{preference.location}</span>
                      </div>
                    )}
                    {preference.price_min && preference.price_max && (
                      <span>ETB {preference.price_min.toLocaleString()} - {preference.price_max.toLocaleString()}</span>
                    )}
                    {preference.bedrooms && (
                      <span>{preference.bedrooms} bedrooms</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full font-medium">
                    Active
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeletePreference(preference.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete saved search"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Properties */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Favorite Properties</h2>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <span>{favoritedProperties.length} saved</span>
          </div>
        </div>

        {favoritedProperties.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Heart className="w-12 h-12 text-red-500" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No saved properties yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start browsing properties and save your favorites to see them here.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>Browse Properties</span>
            </Link>
          </div>
        ) : (
          <PropertyGrid
            properties={favoritedProperties}
            onFavorite={toggleFavorite}
            favoritedProperties={favorites}
          />
        )}
      </div>
    </motion.div>
  );
};