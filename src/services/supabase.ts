import { createClient } from '@supabase/supabase-js';

// Use placeholder values if environment variables are not set (for development)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Only throw error in production or if both are missing
if ((!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') && import.meta.env.PROD) {
  console.warn('Supabase environment variables not configured. Some features may not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers with error handling
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  } catch (err) {
    console.error('Google sign-in error:', err);
    return { data: null, error: { message: 'Failed to sign in with Google' } };
  }
};

export const signInWithFacebook = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  } catch (err) {
    console.error('Facebook sign-in error:', err);
    return { data: null, error: { message: 'Failed to sign in with Facebook' } };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    if (!email?.trim() || !password?.trim()) {
      return { data: null, error: { message: 'Email and password are required' } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    return { data, error };
  } catch (err) {
    console.error('Email sign-in error:', err);
    return { data: null, error: { message: 'Failed to sign in' } };
  }
};

export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  try {
    if (!email?.trim() || !password?.trim() || !fullName?.trim()) {
      return { data: null, error: { message: 'All fields are required' } };
    }

    if (password.length < 6) {
      return { data: null, error: { message: 'Password must be at least 6 characters' } };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim()
        }
      }
    });
    return { data, error };
  } catch (err) {
    console.error('Email sign-up error:', err);
    return { data: null, error: { message: 'Failed to create account' } };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    console.error('Sign-out error:', err);
    return { error: { message: 'Failed to sign out' } };
  }
};

// Storage helpers with error handling
export const uploadPropertyImage = async (file: File, propertyId: string) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!propertyId?.trim()) {
      throw new Error('Property ID is required');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !['jpg', 'jpeg', 'png', 'webp'].includes(fileExt)) {
      throw new Error('Unsupported file format. Use JPG, PNG, or WebP');
    }

    const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName);
    
    return { data: publicUrl, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
    console.error('Image upload error:', err);
    return { data: null, error: errorMessage };
  }
};

export const uploadProfileImage = async (file: File, userId: string) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!userId?.trim()) {
      throw new Error('User ID is required');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Validate file size (2MB limit for profile images)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new Error('Profile image must be less than 2MB');
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !['jpg', 'jpeg', 'png', 'webp'].includes(fileExt)) {
      throw new Error('Unsupported file format. Use JPG, PNG, or WebP');
    }

    const fileName = `${userId}/profile.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, { 
        upsert: true,
        cacheControl: '3600'
      });
    
    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);
    
    return { data: publicUrl, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to upload profile image';
    console.error('Profile image upload error:', err);
    return { data: null, error: errorMessage };
  }
};

// Helper function to check if Supabase is properly configured
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    return { connected: !error, error };
  } catch (err) {
    console.error('Supabase connection check failed:', err);
    return { connected: false, error: err };
  }
};