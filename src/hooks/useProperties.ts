import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Property, PropertyFilters } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

// Mock data for when Supabase is not configured
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    host_id: 'mock-host-1',
    title: 'Modern 2BR Apartment in Bole',
    description: 'Beautiful modern apartment with stunning city views, fully furnished with high-end amenities.',
    type: 'residential',
    price: 25000,
    location: 'Bole',
    latitude: 8.9806,
    longitude: 38.7578,
    bedrooms: 2,
    square_meters: 85,
    features: ['Parking', 'WiFi', 'Security', 'Furnished'],
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    host: {
      id: 'mock-host-1',
      email: 'host1@example.com',
      full_name: 'Ahmed Hassan',
      is_host: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },
  {
    id: '2',
    host_id: 'mock-host-2',
    title: 'Executive Office Space in CMC',
    description: 'Premium office space perfect for businesses, with conference rooms and modern facilities.',
    type: 'business',
    price: 45000,
    location: 'CMC',
    latitude: 9.0054,
    longitude: 38.7636,
    square_meters: 120,
    features: ['Conference Room', 'Parking', 'Security', 'Reception'],
    business_features: ['Conference Room', 'Reception Area', 'High-speed Internet'],
    images: [
      'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    is_active: true,
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    host: {
      id: 'mock-host-2',
      email: 'host2@example.com',
      full_name: 'Sara Bekele',
      is_host: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },
  {
    id: '3',
    host_id: 'mock-host-3',
    title: 'Luxury 3BR Villa in Kazanchis',
    description: 'Spacious villa with garden, perfect for families, located in the prestigious Kazanchis area.',
    type: 'residential',
    price: 55000,
    location: 'Kazanchis',
    latitude: 9.0157,
    longitude: 38.7614,
    bedrooms: 3,
    square_meters: 180,
    features: ['Garden', 'Parking', 'Security', 'Swimming Pool', 'Furnished'],
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    is_active: true,
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z',
    host: {
      id: 'mock-host-3',
      email: 'host3@example.com',
      full_name: 'Michael Tadesse',
      is_host: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },
  {
    id: '4',
    host_id: 'mock-host-4',
    title: 'Cozy Studio in Old Airport',
    description: 'Perfect studio apartment for young professionals, fully equipped and ready to move in.',
    type: 'residential',
    price: 15000,
    location: 'Old Airport',
    latitude: 8.9806,
    longitude: 38.7578,
    bedrooms: 1,
    square_meters: 45,
    features: ['WiFi', 'Furnished', 'Security'],
    images: [
      'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    is_active: true,
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z',
    host: {
      id: 'mock-host-4',
      email: 'host4@example.com',
      full_name: 'Hanan Ali',
      is_host: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  }
];

const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && 
         import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_project_url' &&
         import.meta.env.VITE_SUPABASE_ANON_KEY &&
         import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your_supabase_anon_key';
};

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

      // Use mock data if Supabase is not configured
      if (!isSupabaseConfigured()) {
        console.log('Using mock data - Supabase not configured');
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredProperties = [...MOCK_PROPERTIES];
        
        // Apply filters to mock data
        if (filters?.type) {
          filteredProperties = filteredProperties.filter(p => p.type === filters.type);
        }
        if (filters?.location) {
          filteredProperties = filteredProperties.filter(p => 
            p.location.toLowerCase().includes(filters.location!.toLowerCase())
          );
        }
        if (filters?.priceMin && filters.priceMin > 0) {
          filteredProperties = filteredProperties.filter(p => p.price >= filters.priceMin!);
        }
        if (filters?.priceMax && filters.priceMax > 0) {
          filteredProperties = filteredProperties.filter(p => p.price <= filters.priceMax!);
        }
        if (filters?.bedrooms && filters.bedrooms > 0) {
          filteredProperties = filteredProperties.filter(p => p.bedrooms === filters.bedrooms);
        }
        if (filters?.squareMetersMin && filters.squareMetersMin > 0) {
          filteredProperties = filteredProperties.filter(p => 
            p.square_meters && p.square_meters >= filters.squareMetersMin!
          );
        }
        
        setProperties(filteredProperties);
        setLoading(false);
        return;
      }

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
      
      // Fallback to mock data on error
      console.log('Falling back to mock data due to error');
      setProperties(MOCK_PROPERTIES);
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

      // Use mock data if Supabase is not configured
      if (!isSupabaseConfigured()) {
        console.log('Using mock user properties - Supabase not configured');
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return mock properties for the current user
        const userProperties = MOCK_PROPERTIES.filter(p => p.host_id === user.id);
        setProperties(userProperties);
        setLoading(false);
        return;
      }

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
      
      // Fallback to empty array on error
      setProperties([]);
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

    if (!isSupabaseConfigured()) {
      toast.error('Database not configured. This is a demo version.');
      return { error: 'Database not configured' };
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

    if (!isSupabaseConfigured()) {
      toast.error('Database not configured. This is a demo version.');
      return { error: 'Database not configured' };
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

    if (!isSupabaseConfigured()) {
      toast.error('Database not configured. This is a demo version.');
      return { error: 'Database not configured' };
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