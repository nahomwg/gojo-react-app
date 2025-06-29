export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  is_host: boolean;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  host_id: string;
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
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  host?: User;
}

export interface SearchPreference {
  id: string;
  user_id: string;
  name: string;
  type?: 'residential' | 'business';
  location?: string;
  price_max?: number;
  price_min?: number;
  bedrooms?: number;
  square_meters_min?: number;
  features?: string[];
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isHost: boolean;
}

export interface PropertyFilters {
  type?: 'residential' | 'business';
  location?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  squareMetersMin?: number;
  features?: string[];
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'new_listing' | 'price_change' | 'system';
  is_read: boolean;
  created_at: string;
}