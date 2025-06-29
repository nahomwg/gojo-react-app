# Gojo Property Rental Platform

A modern, production-ready property rental platform built with React, TypeScript, and Supabase. Gojo connects property owners (hosts) with renters (guests) in Ethiopia, offering both residential and business property listings.

## 🚀 Features

### Authentication & User Management
- **Social Login**: Google and Facebook OAuth integration
- **Email/Password**: Traditional authentication with secure password handling
- **Unified Accounts**: Users can switch between renter and host modes
- **Profile Management**: Upload profile pictures, update personal information

### Property Management (Hosts)
- **Property Listings**: Create, edit, and delete property listings
- **Image Uploads**: Multiple property photos with drag-and-drop interface
- **Location Integration**: Google Maps integration for precise location picking
- **Property Types**: Support for both residential and business properties
- **Feature Management**: Customizable property features and amenities
- **Listing Status**: Activate/deactivate listings as needed

### Property Discovery (Renters)
- **Advanced Search**: Filter by type, location, price, bedrooms, square meters
- **Natural Language Search**: OpenAI API integration for intelligent search queries
- **Saved Searches**: Save search preferences and get notifications for new matches
- **Favorites**: Save favorite properties for easy access
- **Responsive Grid**: Beautiful property cards with hover effects

### Technical Features
- **Real-time Updates**: Supabase real-time subscriptions
- **Row Level Security**: Comprehensive data protection
- **File Storage**: Secure image uploads with Supabase Storage
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Performance**: Optimized loading and caching strategies

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **State Management**: React Context API, Custom Hooks
- **Forms**: React Hook Form
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gojo-rental-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_FACEBOOK_APP_ID=your_facebook_app_id
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration file in the Supabase SQL editor:
     ```sql
     -- Copy and paste the contents of supabase/migrations/create_gojo_schema.sql
     ```
   - Configure authentication providers (Google, Facebook) in Supabase Auth settings

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄 Database Schema

### Tables
- **users**: User profiles with host/guest capabilities
- **properties**: Property listings with comprehensive details
- **search_preferences**: Saved search criteria for notifications
- **notifications**: User notification system

### Storage Buckets
- **property-images**: Property photos and galleries
- **profile-images**: User profile pictures

### Security
- Row Level Security (RLS) enabled on all tables
- Comprehensive policies for data access control
- Secure file upload policies

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the database migration
3. Configure authentication providers
4. Set up storage buckets
5. Update environment variables

### Google Maps Integration
1. Get a Google Maps API key
2. Enable Places API and Maps JavaScript API
3. Add the API key to your environment variables

### OpenAI Integration
1. Get an OpenAI API key
2. Add the key to your environment variables
3. The natural language search feature will be ready to use

## 🚀 Deployment

### Netlify (Recommended)
1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to Netlify
3. Set up environment variables in Netlify dashboard
4. Configure redirects for SPA routing

### Vercel
1. Connect your repository to Vercel
2. Set up environment variables
3. Deploy automatically on push

## 📱 Features in Detail

### Host Dashboard
- Property management interface
- Analytics and statistics
- Image upload and management
- Listing activation controls

### Search & Discovery
- Advanced filtering system
- Natural language search
- Saved search preferences
- Real-time notifications

### User Experience
- Smooth animations and transitions
- Mobile-responsive design
- Intuitive navigation
- Fast loading times

## 🔒 Security Features

- **Authentication**: Secure OAuth and email/password login
- **Authorization**: Role-based access control
- **Data Protection**: Row Level Security policies
- **File Security**: Secure image uploads with access controls
- **Input Validation**: Comprehensive form validation
- **XSS Protection**: Sanitized user inputs

## 🎨 Design System

- **Colors**: Professional blue, emerald, and orange palette
- **Typography**: Clean, readable font hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable, accessible UI components
- **Animations**: Subtle, purposeful motion design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

## 🔮 Future Enhancements

- **Booking System**: Complete rental booking flow
- **Payment Integration**: Stripe payment processing
- **Messaging**: In-app communication between hosts and guests
- **Reviews**: Property and user review system
- **Advanced Analytics**: Detailed insights for hosts
- **Mobile App**: React Native mobile application