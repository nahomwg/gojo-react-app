import React, { useState } from 'react';
import { MapPicker } from './MapPicker';
import { AddressSearch } from './AddressSearch';
import { LocationData } from '../../types';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
  className?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  className = ''
}) => {
  const [searchValue, setSearchValue] = useState(
    initialLocation?.formattedAddress || initialLocation?.address || ''
  );
  const [selectedLocation, setSelectedLocation] = useState<LocationData | undefined>(initialLocation);

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    setSearchValue(location.formattedAddress || location.address);
    onLocationSelect(location);
  };

  const handleSearchSelect = (location: LocationData) => {
    handleLocationSelect(location);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Property Location
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Search for an address or click on the map to set the location
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Address Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Search Address
          </label>
          <AddressSearch
            onPlaceSelect={handleSearchSelect}
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search for an address in Addis Ababa..."
          />
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
              Or select on map
            </span>
          </div>
        </div>

        {/* Map Picker */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Interactive Map
          </label>
          <MapPicker
            onLocationSelect={handleLocationSelect}
            initialLocation={selectedLocation}
            height="400px"
          />
        </div>

        {/* Location Summary */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Selected Property Location
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 break-words mb-2">
                  {selectedLocation.formattedAddress || selectedLocation.address}
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Latitude:</span> {selectedLocation.latitude.toFixed(6)}
                  </div>
                  <div>
                    <span className="font-medium">Longitude:</span> {selectedLocation.longitude.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">Location Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Use the search box for quick address lookup</li>
                <li>• Click anywhere on the map to set a precise location</li>
                <li>• Use "My Location" to center the map on your current position</li>
                <li>• The selected coordinates will be saved with your property</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};