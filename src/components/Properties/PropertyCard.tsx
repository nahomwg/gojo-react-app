import React from 'react';
import { MapPin, Bed, Square, Star, Heart, Wifi, Car, Shield, Eye, Calendar, Navigation } from 'lucide-react';
import { Property } from '../../types';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
  showLocation?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onFavorite, 
  isFavorited = false,
  showLocation = false
}) => {
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(property.id);
  };

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Open Google Maps with the property location
    const mapsUrl = `https://www.google.com/maps?q=${property.latitude},${property.longitude}`;
    window.open(mapsUrl, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getFeatureIcon = (feature: string) => {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('wifi') || lowerFeature.includes('internet')) return Wifi;
    if (lowerFeature.includes('parking') || lowerFeature.includes('car')) return Car;
    if (lowerFeature.includes('security')) return Shield;
    return null;
  };

  // Mock data for demonstration
  const rating = (4.2 + Math.random() * 0.8).toFixed(1);
  const views = Math.floor(Math.random() * 100) + 20;
  const daysAgo = Math.floor(Math.random() * 30) + 1;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg dark:shadow-gray-900/20 overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <div className="relative w-full h-full">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            <div className="text-gray-400 dark:text-gray-500 text-center">
              <Square className="w-16 h-16 mx-auto mb-3" />
              <p className="text-sm font-medium">No image available</p>
            </div>
          </div>
        )}
        
        {/* Top Row - Favorite & Property Type */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm border border-white/20 ${
            property.type === 'residential' 
              ? 'bg-blue-500/90 text-white' 
              : 'bg-emerald-500/90 text-white'
          }`}>
            {property.type === 'residential' ? 'Residential' : 'Business'}
          </span>

          <div className="flex items-center space-x-2">
            {/* View on Map Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleViewOnMap}
              className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 border border-white/20"
              title="View on map"
            >
              <Navigation className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </motion.button>

            {/* Favorite Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavorite}
              className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 border border-white/20"
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${
                  isFavorited 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                }`}
              />
            </motion.button>
          </div>
        </div>

        {/* Bottom Row - Image Count & Views */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          {property.images && property.images.length > 1 && (
            <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-white/20 flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>1/{property.images.length}</span>
            </div>
          )}
          
          <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-white/20 flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{views} views</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Price & Rating */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(property.price)}
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">/month</span>
          </div>
          <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {rating}
            </span>
          </div>
        </div>

        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{property.location}, Addis Ababa</span>
          </div>
          
          {/* Coordinates display for development/debugging */}
          {showLocation && (
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          {property.type === 'residential' && property.bedrooms && (
            <div className="flex items-center bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-lg">
              <Bed className="w-4 h-4 mr-1" />
              <span className="font-medium">{property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}</span>
            </div>
          )}
          {property.square_meters && (
            <div className="flex items-center bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-lg">
              <Square className="w-4 h-4 mr-1" />
              <span className="font-medium">{property.square_meters} m²</span>
            </div>
          )}
        </div>

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {property.features.slice(0, 3).map((feature, index) => {
                const IconComponent = getFeatureIcon(feature);
                return (
                  <div
                    key={index}
                    className="flex items-center px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600"
                  >
                    {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
                    <span className="font-medium">{feature}</span>
                  </div>
                );
              })}
              {property.features.length > 3 && (
                <span className="px-2 py-1 bg-gradient-to-r from-rose-100 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30 text-rose-700 dark:text-rose-300 text-xs rounded-full border border-rose-200 dark:border-rose-800 font-medium">
                  +{property.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Host Info & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center overflow-hidden">
              {property.host?.avatar_url ? (
                <img
                  src={property.host.avatar_url}
                  alt={property.host.full_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-xs text-white font-bold">
                  {property.host?.full_name?.charAt(0).toUpperCase() || 'H'}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {property.host?.full_name || 'Host'}
              </p>
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{daysAgo} days ago</span>
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-bold rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg shadow-rose-500/25"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};