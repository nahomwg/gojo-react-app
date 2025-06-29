import React, { useRef, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { LocationData } from '../../types';
import { motion } from 'framer-motion';

interface AddressSearchProps {
  onPlaceSelect: (location: LocationData) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const AddressSearch: React.FC<AddressSearchProps> = ({
  onPlaceSelect,
  placeholder = "Search for an address in Addis Ababa...",
  className = "",
  value = "",
  onChange
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google?.maps?.places) {
      console.warn('Google Maps Places API not loaded');
      return;
    }

    if (!inputRef.current) return;

    try {
      // Initialize Google Places Autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          // Restrict to Ethiopia and specifically Addis Ababa area
          componentRestrictions: { country: 'ET' },
          bounds: new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(8.8, 38.6), // Southwest
            new window.google.maps.LatLng(9.2, 38.9)  // Northeast
          ),
          strictBounds: false,
          types: ['address', 'establishment', 'geocode']
        }
      );

      // Handle place selection
      const handlePlaceSelect = () => {
        const place = autocompleteRef.current?.getPlace();
        
        if (!place || !place.geometry?.location) {
          console.warn('No valid place selected');
          return;
        }

        const location: LocationData = {
          address: place.name || place.formatted_address || '',
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          placeId: place.place_id,
          formattedAddress: place.formatted_address
        };

        onPlaceSelect(location);
      };

      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);

      return () => {
        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
    }
  }, [onPlaceSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          <MapPin className="w-5 h-5 text-primary-500" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-16 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 text-lg"
        />
        
        {/* Loading indicator when Google Maps is not ready */}
        {!window.google?.maps?.places && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
        <MapPin className="w-4 h-4" />
        <span>Search for addresses, landmarks, or neighborhoods in Addis Ababa</span>
      </p>
    </motion.div>
  );
};