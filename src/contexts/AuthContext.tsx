import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { User, AuthState } from '../types';
import { toast } from 'react-hot-toast';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithFacebook: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  switchToHost: () => Promise<void>;
  switchToGuest: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        // Skip auth initialization if Supabase is not properly configured
        if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
          console.warn('Supabase not configured, running in demo mode');
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted && session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes only if Supabase is configured
    let subscription: any;
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_project_url') {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        try {
          if (mounted) {
            if (session?.user) {
              await fetchUserProfile(session.user);
            } else {
              setUser(null);
            }
            setLoading(false);
          }
        } catch (err) {
          console.error('Auth state change error:', err);
          if (mounted) {
            setLoading(false);
          }
        }
      });
      subscription = authSubscription;
    }

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      if (!supabaseUser?.id) {
        throw new Error('Invalid user data');
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // User profile doesn't exist, create it
        const newUser = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
          avatar_url: supabaseUser.user_metadata?.avatar_url || null,
          is_host: false
        };

        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert([newUser])
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          return;
        }

        setUser(createdUser);
      } else if (error) {
        console.error('Error fetching user profile:', error);
      } else if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!email?.trim() || !password?.trim()) {
        const error = { message: 'Email and password are required' };
        return { error };
      }

      const { error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      return { error };
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: { message: 'An unexpected error occurred during sign in' } };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      if (!email?.trim() || !password?.trim() || !fullName?.trim()) {
        const error = { message: 'All fields are required' };
        return { error };
      }

      if (password.length < 6) {
        const error = { message: 'Password must be at least 6 characters' };
        return { error };
      }

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim()
          }
        }
      });
      
      return { error };
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: { message: 'An unexpected error occurred during sign up' } };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      return { error };
    } catch (err) {
      console.error('Google sign in error:', err);
      return { error: { message: 'Failed to sign in with Google' } };
    }
  };

  const signInWithFacebook = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      return { error };
    } catch (err) {
      console.error('Facebook sign in error:', err);
      return { error: { message: 'Failed to sign in with Facebook' } };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      toast.error('Failed to sign out');
    }
  };

  const switchToHost = async () => {
    if (!user) {
      toast.error('You must be logged in to switch to host mode');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_host: true })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setUser({ ...user, is_host: true });
      toast.success('Switched to host mode');
    } catch (err) {
      console.error('Switch to host error:', err);
      toast.error('Failed to switch to host mode');
    }
  };

  const switchToGuest = async () => {
    if (!user) {
      toast.error('You must be logged in to switch to guest mode');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_host: false })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setUser({ ...user, is_host: false });
      toast.success('Switched to guest mode');
    } catch (err) {
      console.error('Switch to guest error:', err);
      toast.error('Failed to switch to guest mode');
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      const error = { message: 'You must be logged in to update your profile' };
      return { error };
    }

    try {
      // Validate updates
      const sanitizedUpdates = { ...updates };
      if (sanitizedUpdates.full_name) {
        sanitizedUpdates.full_name = sanitizedUpdates.full_name.trim();
        if (!sanitizedUpdates.full_name) {
          return { error: { message: 'Name cannot be empty' } };
        }
      }
      if (sanitizedUpdates.email) {
        sanitizedUpdates.email = sanitizedUpdates.email.trim();
        if (!sanitizedUpdates.email.includes('@')) {
          return { error: { message: 'Please enter a valid email address' } };
        }
      }

      const { error } = await supabase
        .from('users')
        .update(sanitizedUpdates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setUser({ ...user, ...sanitizedUpdates });
      return { error: null };
    } catch (err) {
      console.error('Update profile error:', err);
      const error = { message: err instanceof Error ? err.message : 'Failed to update profile' };
      return { error };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isHost: user?.is_host || false,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    switchToHost,
    switchToGuest,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};