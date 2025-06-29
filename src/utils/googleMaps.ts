/**
 * Google Maps utility functions for the Gojo property rental app
 */

import { LocationData } from '../types';

/**
 * Check if Google Maps API is loaded and ready
 */
export const isGoogleMapsLoaded = (): boolean => {
  return !!(window.google && window.google.maps && window.google.maps.places);
};

/**
 * Get the Google Maps API key from environment variables
 */
export const getGoogleMapsApiKey = (): string | null => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return apiKey && apiKey !== 'your_google_maps_api_key' ? apiKey : null;
};

/**
 * Default map center for Addis Ababa
 */
export const ADDIS_ABABA_CENTER = {
  lat: 9.005401,
  lng: 38.763611
};

/**
 * Bounds for Addis Ababa area to restrict search results
 */
export const ADDIS_ABABA_BOUNDS = {
  southwest: { lat: 8.8, lng: 38.6 },
  northeast: { lat: 9.2, lng: 38.9 }
};

/**
 * Convert a Google Maps Place to our LocationData format
 */
export const placeToLocationData = (place: google.maps.places.PlaceResult): LocationData | null => {
  if (!place.geometry?.location) {
    return null;
  }

  return {
    address: place.name || place.formatted_address || '',
    latitude: place.geometry.location.lat(),
    longitude: place.geometry.location.lng(),
    placeId: place.place_id,
    formattedAddress: place.formatted_address
  };
};

/**
 * Geocode an address to get coordinates
 */
export const geocodeAddress = async (address: string): Promise<LocationData | null> => {
  if (!isGoogleMapsLoaded()) {
    throw new Error('Google Maps API not loaded');
  }

  const geocoder = new google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode(
      { 
        address,
        componentRestrictions: { country: 'ET' },
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(ADDIS_ABABA_BOUNDS.southwest.lat, ADDIS_ABABA_BOUNDS.southwest.lng),
          new google.maps.LatLng(ADDIS_ABABA_BOUNDS.northeast.lat, ADDIS_ABABA_BOUNDS.northeast.lng)
        )
      },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const result = results[0];
          const location = result.geometry.location;
          
          resolve({
            address: result.formatted_address || address,
            latitude: location.lat(),
            longitude: location.lng(),
            placeId: result.place_id,
            formattedAddress: result.formatted_address
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      }
    );
  });
};

/**
 * Reverse geocode coordinates to get address
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<LocationData | null> => {
  if (!isGoogleMapsLoaded()) {
    throw new Error('Google Maps API not loaded');
  }

  const geocoder = new google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const result = results[0];
          
          resolve({
            address: result.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            latitude: lat,
            longitude: lng,
            placeId: result.place_id,
            formattedAddress: result.formatted_address
          });
        } else {
          reject(new Error(`Reverse geocoding failed: ${status}`));
        }
      }
    );
  });
};

/**
 * Calculate distance between two points using Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Format coordinates for display
 */
export const formatCoordinates = (lat: number, lng: number, precision: number = 6): string => {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
};

/**
 * Check if coordinates are within Addis Ababa bounds
 */
export const isWithinAddisAbaba = (lat: number, lng: number): boolean => {
  return (
    lat >= ADDIS_ABABA_BOUNDS.southwest.lat &&
    lat <= ADDIS_ABABA_BOUNDS.northeast.lat &&
    lng >= ADDIS_ABABA_BOUNDS.southwest.lng &&
    lng <= ADDIS_ABABA_BOUNDS.northeast.lng
  );
};

/**
 * Generate Google Maps URL for a location
 */
export const generateMapsUrl = (lat: number, lng: number, zoom: number = 15): string => {
  return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}`;
};

/**
 * Generate Google Maps directions URL
 */
export const generateDirectionsUrl = (
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): string => {
  return `https://www.google.com/maps/dir/${fromLat},${fromLng}/${toLat},${toLng}`;
};