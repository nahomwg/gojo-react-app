import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { SearchPreference } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useSearchPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<SearchPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('search_preferences')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPreferences(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const savePreference = async (preference: Omit<SearchPreference, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('search_preferences')
        .insert([{
          ...preference,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setPreferences(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { data: null, error };
    }
  };

  const deletePreference = async (id: string) => {
    try {
      const { error } = await supabase
        .from('search_preferences')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setPreferences(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { error };
    }
  };

  return {
    preferences,
    loading,
    error,
    savePreference,
    deletePreference,
    refetch: fetchPreferences
  };
};