import React from 'react';
import { Edit, Trash2, Eye, ToggleLeft, ToggleRight, MapPin } from 'lucide-react';
import { Property } from '../../types';
import { motion } from 'framer-motion';

interface PropertyListItemProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onToggleActive: (property: Property) => void;
  index: number;
}

export const PropertyListItem: React.FC<PropertyListItemProps> = ({
  property,
  onEdit,
  onDelete,
  onToggleActive,
  index
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/10 border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200"
    >
      <div className="flex items-center space-x-4">
        {/* Property Image */}
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {property.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
              property.type === 'residential' 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
            }`}>
              {property.type === 'residential' ? 'Residential' : 'Business'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
              property.is_active
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {property.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
            {property.description}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-32">{property.location}</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatPrice(property.price)}/month
            </span>
            {property.bedrooms && (
              <span>{property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}</span>
            )}
            {property.square_meters && (
              <span>{property.square_meters} m²</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleActive(property)}
            className={`p-2 rounded-lg transition-colors ${
              property.is_active
                ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={property.is_active ? 'Deactivate' : 'Activate'}
          >
            {property.is_active ? (
              <ToggleRight className="w-5 h-5" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(property)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(property.id)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};