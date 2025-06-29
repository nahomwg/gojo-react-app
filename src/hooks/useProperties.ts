import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Property, PropertyFilters } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const useProperties = (filters?: PropertyFilters) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('properties')
        .select(`
          *,
          host:users(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Apply filters safely
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters?.priceMin && filters.priceMin > 0) {
        query = query.gte('price', filters.priceMin);
      }
      if (filters?.priceMax && filters.priceMax > 0) {
        query = query.lte('price', filters.priceMax);
      }
      if (filters?.bedrooms && filters.bedrooms > 0) {
        query = query.eq('bedrooms', filters.bedrooms);
      }
      if (filters?.squareMetersMin && filters.squareMetersMin > 0) {
        query = query.gte('square_meters', filters.squareMetersMin);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch properties: ${error.message}`);
      }

      // Validate and sanitize data
      const validProperties = (data || []).filter(property => {
        return property && 
               property.id && 
               property.title && 
               property.price && 
               property.location;
      });

      setProperties(validProperties);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load properties';
      setError(errorMessage);
      console.error('Error fetching properties:', err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties
  };
};

export const useUserProperties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProperties();
    } else {
      setProperties([]);
      setLoading(false);
      setError(null);
    }
  }, [user]);

  const fetchUserProperties = async () => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch your properties: ${error.message}`);
      }

      setProperties(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load your properties';
      setError(errorMessage);
      console.error('Error fetching user properties:', err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (propertyData: Omit<Property, 'id' | 'host_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      const error = 'You must be logged in to create a property';
      toast.error(error);
      return { error };
    }

    try {
      // Validate required fields
      if (!propertyData.title?.trim()) {
        throw new Error('Property title is required');
      }
      if (!propertyData.description?.trim()) {
        throw new Error('Property description is required');
      }
      if (!propertyData.location?.trim()) {
        throw new Error('Property location is required');
      }
      if (!propertyData.price || propertyData.price <= 0) {
        throw new Error('Valid price is required');
      }

      const { data, error } = await supabase
        .from('properties')
        .insert([{
          ...propertyData,
          host_id: user.id,
          title: propertyData.title.trim(),
          description: propertyData.description.trim(),
          location: propertyData.location.trim(),
          features: propertyData.features || [],
          images: propertyData.images || []
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create property: ${error.message}`);
      }

      setProperties(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create property';
      console.error('Error creating property:', err);
      return { data: null, error };
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    if (!user) {
      const error = 'You must be logged in to update properties';
      toast.error(error);
      return { error };
    }

    if (!id?.trim()) {
      const error = 'Property ID is required';
      toast.error(error);
      return { error };
    }

    try {
      // Validate updates
      const sanitizedUpdates = { ...updates };
      if (sanitizedUpdates.title) {
        sanitizedUpdates.title = sanitizedUpdates.title.trim();
      }
      if (sanitizedUpdates.description) {
        sanitizedUpdates.description = sanitizedUpdates.description.trim();
      }
      if (sanitizedUpdates.location) {
        sanitizedUpdates.location = sanitizedUpdates.location.trim();
      }
      if (sanitizedUpdates.price && sanitizedUpdates.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      const { data, error } = await supabase
        .from('properties')
        .update(sanitizedUpdates)
        .eq('id', id)
        .eq('host_id', user.id) // Ensure user owns the property
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update property: ${error.message}`);
      }

      setProperties(prev => prev.map(p => p.id === id ? data : p));
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update property';
      console.error('Error updating property:', err);
      return { data: null, error };
    }
  };

  const deleteProperty = async (id: string) => {
    if (!user) {
      const error = 'You must be logged in to delete properties';
      toast.error(error);
      return { error };
    }

    if (!id?.trim()) {
      const error = 'Property ID is required';
      toast.error(error);
      return { error };
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)
        .eq('host_id', user.id); // Ensure user owns the property

      if (error) {
        throw new Error(`Failed to delete property: ${error.message}`);
      }

      setProperties(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete property';
      console.error('Error deleting property:', err);
      return { error };
    }
  };

  return {
    properties,
    loading,
    error,
    createProperty,
    updateProperty,
    deleteProperty,
    refetch: fetchUserProperties
  };
};