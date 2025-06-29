import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, MapPin, Plus } from 'lucide-react';
import { Property, LocationData } from '../../types';
import { ImageUploader } from '../upload/ImageUploader';
import { LocationPicker } from '../Maps/LocationPicker';
import { motion } from 'framer-motion';

interface PropertyFormData {
  title: string;
  description: string;
  type: 'residential' | 'business';
  price: number;
  location: string;
  latitude: number;
  longitude: number;
  bedrooms?: number;
  square_meters?: number;
  features: string[];
  business_features?: string[];
}

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: PropertyFormData, images: string[]) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const RESIDENTIAL_FEATURES = [
  'Parking', 'Balcony', 'Garden', 'Security', 'Furnished', 'Pet Friendly',
  'Internet', 'Air Conditioning', 'Heating', 'Gym', 'Swimming Pool', 'Elevator'
];

const BUSINESS_FEATURES = [
  'Reception Area', 'Conference Room', 'Parking', 'Security', 'Internet',
  'Air Conditioning', 'Elevator', 'Kitchen', 'Storage', 'Loading Dock'
];

export const PropertyForm: React.FC<PropertyFormProps> = ({
  property,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(property?.features || []);
  const [selectedBusinessFeatures, setSelectedBusinessFeatures] = useState<string[]>(property?.business_features || []);
  const [customFeature, setCustomFeature] = useState('');
  const [images, setImages] = useState<string[]>(property?.images || []);
  const [propertyType, setPropertyType] = useState<'residential' | 'business'>(property?.type || 'residential');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | undefined>(
    property ? {
      address: property.location,
      latitude: property.latitude,
      longitude: property.longitude,
      formattedAddress: property.location
    } : undefined
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<PropertyFormData>({
    defaultValues: property ? {
      title: property.title,
      description: property.description,
      type: property.type,
      price: property.price,
      location: property.location,
      latitude: property.latitude,
      longitude: property.longitude,
      bedrooms: property.bedrooms || undefined,
      square_meters: property.square_meters || undefined,
      features: property.features,
      business_features: property.business_features || undefined
    } : {
      type: 'residential',
      features: [],
      business_features: [],
      latitude: 9.005401, // Default to Addis Ababa center
      longitude: 38.763611
    }
  });

  const toggleFeature = (feature: string, isBusinessFeature = false) => {
    if (isBusinessFeature) {
      setSelectedBusinessFeatures(prev =>
        prev.includes(feature)
          ? prev.filter(f => f !== feature)
          : [...prev, feature]
      );
    } else {
      setSelectedFeatures(prev =>
        prev.includes(feature)
          ? prev.filter(f => f !== feature)
          : [...prev, feature]
      );
    }
  };

  const addCustomFeature = () => {
    if (customFeature.trim()) {
      if (propertyType === 'business') {
        setSelectedBusinessFeatures(prev => [...prev, customFeature.trim()]);
      } else {
        setSelectedFeatures(prev => [...prev, customFeature.trim()]);
      }
      setCustomFeature('');
    }
  };

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    setValue('location', location.formattedAddress || location.address);
    setValue('latitude', location.latitude);
    setValue('longitude', location.longitude);
  };

  const onFormSubmit = async (data: PropertyFormData) => {
    const formData = {
      ...data,
      features: selectedFeatures,
      business_features: propertyType === 'business' ? selectedBusinessFeatures : undefined,
      // Ensure location data is included
      location: selectedLocation?.formattedAddress || selectedLocation?.address || data.location,
      latitude: selectedLocation?.latitude || data.latitude,
      longitude: selectedLocation?.longitude || data.longitude
    };

    await onSubmit(formData, images);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {property ? 'Edit Property' : 'Add New Property'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property Title
                </label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter property title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property Type
                </label>
                <select
                  {...register('type', { required: 'Type is required' })}
                  onChange={(e) => {
                    setPropertyType(e.target.value as 'residential' | 'business');
                    setValue('type', e.target.value as 'residential' | 'business');
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="residential">Residential</option>
                  <option value="business">Business</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe your property..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Price and Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing & Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Price (ETB)
                </label>
                <input
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be greater than 0' }
                  })}
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price.message}</p>
                )}
              </div>

              {propertyType === 'residential' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bedrooms
                  </label>
                  <input
                    {...register('bedrooms', { 
                      min: { value: 1, message: 'Must be at least 1' }
                    })}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                  {errors.bedrooms && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bedrooms.message}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Square Meters
                </label>
                <input
                  {...register('square_meters', { 
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0"
                />
                {errors.square_meters && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.square_meters.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location</h3>
            
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              initialLocation={selectedLocation}
            />

            {/* Hidden form fields for coordinates */}
            <input
              {...register('latitude', { required: true })}
              type="hidden"
            />
            <input
              {...register('longitude', { required: true })}
              type="hidden"
            />
            <input
              {...register('location', { required: 'Location is required' })}
              type="hidden"
            />
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Features</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(propertyType === 'business' ? BUSINESS_FEATURES : RESIDENTIAL_FEATURES).map((feature) => (
                <motion.button
                  key={feature}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleFeature(feature, propertyType === 'business')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    (propertyType === 'business' ? selectedBusinessFeatures : selectedFeatures).includes(feature)
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 border-2 border-primary-300 dark:border-primary-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {feature}
                </motion.button>
              ))}
            </div>

            {/* Custom Feature Input */}
            <div className="flex space-x-3">
              <input
                type="text"
                value={customFeature}
                onChange={(e) => setCustomFeature(e.target.value)}
                placeholder="Add custom feature..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addCustomFeature}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </motion.button>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Property Images</h3>
            <ImageUploader
              images={images}
              onImagesChange={setImages}
              propertyId={property?.id || 'temp'}
              maxImages={10}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <span>{loading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};