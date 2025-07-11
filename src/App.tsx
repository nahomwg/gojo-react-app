import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { HostDashboard } from './pages/HostDashboard';
import { SavedPropertiesPage } from './pages/SavedPropertiesPage';
import { ProfilePage } from './pages/ProfilePage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { NetworkStatus } from './components/common/NetworkStatus';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireHost?: boolean }> = ({ 
  children, 
  requireHost = false 
}) => {
  const { user, loading, isHost } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireHost && !isHost) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Smart Home Route - redirects based on user mode
const SmartHomeRoute: React.FC = () => {
  const { user, isHost, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If user is logged in and is a host, redirect to dashboard
  if (user && isHost) {
    return <Navigate to="/host" replace />;
  }

  // Otherwise show the regular home page
  return <HomePage />;
};

function AppRoutes() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Smart Home Route */}
          <Route path="/" element={<SmartHomeRoute />} />
          
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/host" 
            element={
              <ProtectedRoute requireHost>
                <HostDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/saved" 
            element={
              <ProtectedRoute>
                <SavedPropertiesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      
      {/* Global Components */}
      <NetworkStatus />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'dark:bg-gray-800 dark:text-white',
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
          error: {
            duration: 6000,
          },
          success: {
            duration: 3000,
          }
        }}
      />
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;