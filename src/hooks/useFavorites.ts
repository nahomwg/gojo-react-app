import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
          console.error('Error loading favorites:', error);
          setFavorites([]);
        }
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (user && favorites.length >= 0) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    setLoading(true);
    try {
      setFavorites(prev => {
        const isFavorited = prev.includes(propertyId);
        if (isFavorited) {
          toast.success('Removed from favorites');
          return prev.filter(id => id !== propertyId);
        } else {
          toast.success('Added to favorites');
          return [...prev, propertyId];
        }
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  const isFavorited = (propertyId: string): boolean => {
    return favorites.includes(propertyId);
  };

  const clearAllFavorites = () => {
    if (!user) return;
    
    setFavorites([]);
    localStorage.removeItem(`favorites_${user.id}`);
    toast.success('All favorites cleared');
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorited,
    clearAllFavorites
  };
};