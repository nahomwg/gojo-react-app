import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { MapPin, Crosshair, AlertCircle } from 'lucide-react';
import { LocationData } from '../../types';
import { motion } from 'framer-motion';

interface MapPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
  height?: string;
  className?: string;
}

// Default center: Addis Ababa city center
const DEFAULT_CENTER = {
  lat: 9.005401,
  lng: 38.763611
};

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '400px',
  borderRadius: '12px'
};

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  gestureHandling: 'cooperative',
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'on' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'on' }]
    }
  ]
};

const LIBRARIES: ("places" | "geometry" | "drawing" | "visualization")[] = ['places'];

export const MapPicker: React.FC<MapPickerProps> = ({
  onLocationSelect,
  initialLocation,
  height = '400px',
  className = ''
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation || null
  );
  const [mapCenter, setMapCenter] = useState(
    initialLocation 
      ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
      : DEFAULT_CENTER
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const mapContainerStyle = {
    ...MAP_CONTAINER_STYLE,
    height
  };

  // Initialize geocoder when map loads
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    geocoderRef.current = new window.google.maps.Geocoder();
    setIsLoading(false);
  }, []);

  // Handle map click to select location
  const onMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng || !geocoderRef.current) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    try {
      // Reverse geocode to get address
      const response = await new Promise<google.maps.GeocoderResponse>((resolve, reject) => {
        geocoderRef.current!.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === 'OK' && results) {
              resolve({ results } as google.maps.GeocoderResponse);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          }
        );
      });

      const result = response.results[0];
      const address = result?.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      const locationData: LocationData = {
        address,
        latitude: lat,
        longitude: lng,
        placeId: result?.place_id,
        formattedAddress: result?.formatted_address
      };

      setSelectedLocation(locationData);
      onLocationSelect(locationData);
      setError(null);
    } catch (err) {
      console.error('Geocoding error:', err);
      
      // Still allow selection even if geocoding fails
      const locationData: LocationData = {
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        latitude: lat,
        longitude: lng
      };

      setSelectedLocation(locationData);
      onLocationSelect(locationData);
      setError('Could not get address for this location');
    }
  }, [onLocationSelect]);

  // Center map on user's current location
  const centerOnCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCenter = { lat: latitude, lng: longitude };
        
        setMapCenter(newCenter);
        
        // Auto-select current location
        const locationData: LocationData = {
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          latitude,
          longitude
        };
        
        setSelectedLocation(locationData);
        onLocationSelect(locationData);
        setIsLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Could not get your current location');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Update map center when initialLocation changes
  useEffect(() => {
    if (initialLocation) {
      setMapCenter({
        lat: initialLocation.latitude,
        lng: initialLocation.longitude
      });
      setSelectedLocation(initialLocation);
    }
  }, [initialLocation]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'your_google_maps_api_key') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gray-100 dark:bg-gray-800 rounded-xl p-8 text-center ${className}`}
        style={{ height }}
      >
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Google Maps Not Configured
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please add your Google Maps API key to enable location selection.
        </p>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Add <code className="bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to your .env file
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-4 ${className}`}
    >
      {/* Map Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Click on the map to select a location
          </span>
        </div>
        
        <motion.button
          type="button"
          onClick={centerOnCurrentLocation}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Crosshair className="w-4 h-4" />
          <span>Use My Location</span>
        </motion.button>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center space-x-2"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span className="text-sm text-amber-800 dark:text-amber-300">{error}</span>
        </motion.div>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                Selected Location
              </h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 break-words">
                {selectedLocation.formattedAddress || selectedLocation.address}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
                {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Google Map */}
      <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-10">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 dark:text-gray-400">Loading map...</span>
            </div>
          </div>
        )}
        
        <LoadScript
          googleMapsApiKey={apiKey}
          libraries={LIBRARIES}
          loadingElement={<div style={{ height: '100%' }} />}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={13}
            options={MAP_OPTIONS}
            onLoad={onMapLoad}
            onClick={onMapClick}
          >
            {selectedLocation && (
              <Marker
                position={{
                  lat: selectedLocation.latitude,
                  lng: selectedLocation.longitude
                }}
                animation={window.google?.maps?.Animation?.BOUNCE}
                icon={{
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="12" fill="#2563eb" stroke="white" stroke-width="3"/>
                      <circle cx="16" cy="16" r="4" fill="white"/>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(32, 32),
                  anchor: new window.google.maps.Point(16, 16)
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </motion.div>
  );
};