import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useUserProperties } from '../hooks/useProperties';
import { PropertyForm } from '../components/Properties/PropertyForm';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { PropertyListItem } from '../components/dashboard/PropertyListItem';
import { Property } from '../types';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const HostDashboard: React.FC = () => {
  const { properties, loading, createProperty, updateProperty, deleteProperty } = useUserProperties();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateProperty = async (data: any, images: string[]) => {
    setFormLoading(true);
    try {
      const { error } = await createProperty({
        ...data,
        images,
        is_active: true
      });
      
      if (error) {
        toast.error(error);
      } else {
        toast.success('Property created successfully!');
        setIsFormOpen(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProperty = async (data: any, images: string[]) => {
    if (!editingProperty) return;
    
    setFormLoading(true);
    try {
      const { error } = await updateProperty(editingProperty.id, {
        ...data,
        images
      });
      
      if (error) {
        toast.error(error);
      } else {
        toast.success('Property updated successfully!');
        setEditingProperty(null);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      const { error } = await deleteProperty(id);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Property deleted successfully!');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const handleToggleActive = async (property: Property) => {
    try {
      const { error } = await updateProperty(property.id, {
        is_active: !property.is_active
      });
      
      if (error) {
        toast.error(error);
      } else {
        toast.success(`Property ${property.is_active ? 'deactivated' : 'activated'} successfully!`);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  // Filter properties based on search query
  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Host Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your property listings</p>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Property</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <DashboardStats properties={properties} />

      {/* Properties Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Properties</h2>
            
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Plus className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No properties found' : 'No properties yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first property listing.'
              }
            </p>
            {!searchQuery && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFormOpen(true)}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Your First Property
              </motion.button>
            )}
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <AnimatePresence>
              {filteredProperties.map((property, index) => (
                <PropertyListItem
                  key={property.id}
                  property={property}
                  onEdit={setEditingProperty}
                  onDelete={handleDeleteProperty}
                  onToggleActive={handleToggleActive}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Property Form Modal */}
      <AnimatePresence>
        {(isFormOpen || editingProperty) && (
          <PropertyForm
            property={editingProperty || undefined}
            onSubmit={editingProperty ? handleUpdateProperty : handleCreateProperty}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingProperty(null);
            }}
            loading={formLoading}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};