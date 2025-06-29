export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          is_host: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          is_host?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
          is_host?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          description: string;
          type: 'residential' | 'business';
          price: number;
          location: string;
          latitude: number;
          longitude: number;
          bedrooms: number | null;
          square_meters: number | null;
          features: string[];
          business_features: string[] | null;
          images: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          title: string;
          description: string;
          type: 'residential' | 'business';
          price: number;
          location: string;
          latitude: number;
          longitude: number;
          bedrooms?: number | null;
          square_meters?: number | null;
          features: string[];
          business_features?: string[] | null;
          images?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          host_id?: string;
          title?: string;
          description?: string;
          type?: 'residential' | 'business';
          price?: number;
          location?: string;
          latitude?: number;
          longitude?: number;
          bedrooms?: number | null;
          square_meters?: number | null;
          features?: string[];
          business_features?: string[] | null;
          images?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      search_preferences: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'residential' | 'business' | null;
          location: string | null;
          price_max: number | null;
          price_min: number | null;
          bedrooms: number | null;
          square_meters_min: number | null;
          features: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type?: 'residential' | 'business' | null;
          location?: string | null;
          price_max?: number | null;
          price_min?: number | null;
          bedrooms?: number | null;
          square_meters_min?: number | null;
          features?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'residential' | 'business' | null;
          location?: string | null;
          price_max?: number | null;
          price_min?: number | null;
          bedrooms?: number | null;
          square_meters_min?: number | null;
          features?: string[] | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'new_listing' | 'price_change' | 'system';
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: 'new_listing' | 'price_change' | 'system';
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: 'new_listing' | 'price_change' | 'system';
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
  };
}