import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, MapPin, Home, DollarSign, Bed, Square, Mic, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface AISearchBarProps {
  onSearch: (query: string) => void;
  onFiltersExtracted?: (filters: any) => void;
}

const SEARCH_EXAMPLES = [
  "2 bedroom apartment in Bole under 25,000 ETB",
  "Furnished office space near Meskel Square",
  "3 bedroom house in CMC with parking and garden",
  "Business space in Kazanchis with conference room",
  "Studio apartment in Old Airport area with WiFi",
  "Commercial property in Merkato with loading dock"
];

const QUICK_FILTERS = [
  { label: "Bole", type: "location", icon: MapPin },
  { label: "CMC", type: "location", icon: MapPin },
  { label: "2 Bedrooms", type: "bedrooms", icon: Bed },
  { label: "Under 20k", type: "price", icon: DollarSign },
  { label: "Furnished", type: "feature", icon: Home },
  { label: "Parking", type: "feature", icon: Square }
];

export const AISearchBar: React.FC<AISearchBarProps> = ({ onSearch, onFiltersExtracted }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock AI processing function with error handling
  const processNaturalLanguage = (searchQuery: string) => {
    try {
      if (!searchQuery?.trim()) {
        throw new Error('Search query cannot be empty');
      }

      const filters: any = {};
      const lowerQuery = searchQuery.toLowerCase().trim();

      // Extract location with validation
      const addisAreas = ['bole', 'cmc', 'kazanchis', 'old airport', 'meskel square', 'merkato', 'piassa', 'addis ketema', 'kirkos', 'lideta'];
      const foundArea = addisAreas.find(area => lowerQuery.includes(area));
      if (foundArea) {
        filters.location = foundArea;
      }

      // Extract bedrooms with validation
      const bedroomMatch = lowerQuery.match(/(\d+)\s*(bedroom|bed|br)/);
      if (bedroomMatch) {
        const bedrooms = parseInt(bedroomMatch[1]);
        if (bedrooms > 0 && bedrooms <= 10) {
          filters.bedrooms = bedrooms;
        }
      }

      // Extract price with validation
      const priceMatch = lowerQuery.match(/under\s*(\d+)[,\s]*(\d+)?\s*(etb|birr)?/);
      if (priceMatch) {
        const price = priceMatch[2] ? 
          parseInt(priceMatch[1] + priceMatch[2]) : 
          parseInt(priceMatch[1]) * (priceMatch[1].length <= 2 ? 1000 : 1);
        
        if (price > 0 && price <= 1000000) { // Reasonable price range
          filters.priceMax = price;
        }
      }

      // Extract property type
      if (lowerQuery.includes('office') || lowerQuery.includes('business') || lowerQuery.includes('commercial')) {
        filters.type = 'business';
      } else if (lowerQuery.includes('apartment') || lowerQuery.includes('house') || lowerQuery.includes('residential') || lowerQuery.includes('studio')) {
        filters.type = 'residential';
      }

      // Extract features
      const features = [];
      const featureMap = {
        'furnished': 'Furnished',
        'parking': 'Parking',
        'garden': 'Garden',
        'wifi': 'Internet',
        'internet': 'Internet',
        'security': 'Security',
        'gym': 'Gym',
        'pool': 'Swimming Pool',
        'balcony': 'Balcony',
        'elevator': 'Elevator',
        'conference': 'Conference Room',
        'loading': 'Loading Dock'
      };

      Object.entries(featureMap).forEach(([key, value]) => {
        if (lowerQuery.includes(key) && !features.includes(value)) {
          features.push(value);
        }
      });

      if (features.length > 0) {
        filters.features = features;
      }

      return filters;
    } catch (err) {
      console.error('Error processing natural language:', err);
      throw new Error('Failed to process search query');
    }
  };

  const handleSearch = async (searchQuery: string = query) => {
    try {
      setError(null);
      
      if (!searchQuery?.trim()) {
        toast.error('Please enter a search query');
        return;
      }

      setIsLoading(true);
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const extractedFilters = processNaturalLanguage(searchQuery);
      
      setShowSuggestions(false);
      
      onSearch(searchQuery);
      onFiltersExtracted?.(extractedFilters);
      
      toast.success('Search completed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleExampleClick = (example: string) => {
    try {
      setQuery(example);
      setShowSuggestions(false);
      handleSearch(example);
    } catch (err) {
      console.error('Error handling example click:', err);
      toast.error('Failed to apply search example');
    }
  };

  const handleQuickFilter = (filter: any) => {
    try {
      let newQuery = query;
      
      switch (filter.type) {
        case 'location':
          newQuery = query ? `${query} in ${filter.label}` : `Properties in ${filter.label}`;
          break;
        case 'bedrooms':
          newQuery = query ? `${query} ${filter.label.toLowerCase()}` : filter.label.toLowerCase();
          break;
        case 'price':
          newQuery = query ? `${query} ${filter.label.toLowerCase()}` : filter.label.toLowerCase();
          break;
        case 'feature':
          newQuery = query ? `${query} with ${filter.label.toLowerCase()}` : `Properties with ${filter.label.toLowerCase()}`;
          break;
        default:
          newQuery = query ? `${query} ${filter.label}` : filter.label;
      }
      
      setQuery(newQuery);
      handleSearch(newQuery);
    } catch (err) {
      console.error('Error handling quick filter:', err);
      toast.error('Failed to apply filter');
    }
  };

  // Mock voice recognition with error handling
  const handleVoiceSearch = () => {
    try {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        toast.error('Voice search is not supported in your browser');
        return;
      }

      setIsListening(true);
      setError(null);
      
      // Simulate voice recognition
      setTimeout(() => {
        try {
          const mockVoiceResult = "2 bedroom apartment in Bole";
          setQuery(mockVoiceResult);
          setIsListening(false);
          handleSearch(mockVoiceResult);
          toast.success('Voice search completed');
        } catch (err) {
          setIsListening(false);
          toast.error('Voice recognition failed');
        }
      }, 2000);
    } catch (err) {
      console.error('Voice search error:', err);
      setIsListening(false);
      toast.error('Voice search is not available');
    }
  };

  const clearSearch = () => {
    try {
      setQuery('');
      setShowSuggestions(false);
      setError(null);
      inputRef.current?.focus();
    } catch (err) {
      console.error('Error clearing search:', err);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden backdrop-blur-xl">
            {/* Search Input */}
            <div className="flex items-center">
              <div className="flex items-center pl-6 pr-4 py-1">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError(null);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Try: '2 bedroom apartment in Bole under 25,000 ETB' or 'office space near Meskel Square'"
                className="flex-1 py-6 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isLoading}
                maxLength={200}
              />

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pr-6">
                {query && (
                  <motion.button
                    type="button"
                    onClick={clearSearch}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Clear search"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </motion.button>
                )}
                
                <motion.button
                  type="button"
                  onClick={handleVoiceSearch}
                  disabled={isLoading}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Voice search"
                >
                  <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-rose-500/25"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-semibold">Searching...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="font-semibold">Search</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Loading Bar */}
            {isLoading && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-600"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>
            )}
          </div>
        </form>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
              >
                <X className="w-3 h-3 text-red-600 dark:text-red-400" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap gap-3 mt-4 justify-center"
        >
          {QUICK_FILTERS.map((filter, index) => (
            <motion.button
              key={filter.label}
              onClick={() => handleQuickFilter(filter)}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
            >
              <filter.icon className="w-4 h-4" />
              <span>{filter.label}</span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && !error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Try these AI search examples:
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SEARCH_EXAMPLES.map((example, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    disabled={isLoading}
                    className="text-left p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-start space-x-3">
                      <Search className="w-4 h-4 text-gray-400 group-hover:text-rose-500 mt-1 transition-colors" />
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          "{example}"
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  💡 <strong>Pro tip:</strong> Be as specific as possible. Include location, price range, bedrooms, and features for best results.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};