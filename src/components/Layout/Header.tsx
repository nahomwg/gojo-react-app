import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Bell, Menu, X, LogOut, Settings, Building2, Search, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { user, isHost, signOut, switchToHost, switchToGuest } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleModeSwitch = async () => {
    if (isHost) {
      // Switch to guest mode first, then navigate
      await switchToGuest();
      // Use setTimeout to ensure state update completes before navigation
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } else {
      // Switch to host mode first, then navigate
      await switchToHost();
      // Use setTimeout to ensure state update completes before navigation
      setTimeout(() => {
        navigate('/host', { replace: true });
      }, 100);
    }
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-500/25 transition-all duration-300">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </motion.div>
            <div className="hidden sm:block">
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Gojo
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1 font-medium">
                  Addis Ababa Properties
                </span>
              </div>
            </div>
          </Link>

          {/* Center Navigation - Mode Toggle for Desktop */}
          {user && (
            <div className="hidden lg:flex items-center">
              <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-1.5 border border-gray-200/50 dark:border-gray-700/50">
                <motion.button
                  onClick={() => !isHost && handleModeSwitch()}
                  disabled={!isHost} // Disable when already in guest mode
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    !isHost
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-lg shadow-primary-500/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50 cursor-pointer'
                  }`}
                  whileHover={{ scale: isHost ? 1.02 : 1 }}
                  whileTap={{ scale: isHost ? 0.98 : 1 }}
                >
                  <Search className="w-5 h-5" />
                  <span>Explore</span>
                  {!isHost && <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />}
                </motion.button>
                <motion.button
                  onClick={() => isHost || handleModeSwitch()}
                  disabled={isHost} // Disable when already in host mode
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isHost
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-lg shadow-primary-500/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50 cursor-pointer'
                  }`}
                  whileHover={{ scale: !isHost ? 1.02 : 1 }}
                  whileTap={{ scale: !isHost ? 0.98 : 1 }}
                >
                  <Building2 className="w-5 h-5" />
                  <span>Host</span>
                  {isHost && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
                </motion.button>
              </div>
            </div>
          )}

          {/* Right Section - Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {user ? (
              <>
                {/* Quick Actions */}
                <div className="flex items-center space-x-3">
                  {!isHost && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/saved"
                        className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-200 backdrop-blur-sm"
                      >
                        <Heart className="w-5 h-5" />
                        <span className="font-medium">Saved</span>
                      </Link>
                    </motion.div>
                  )}
                  
                  {/* Notifications */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-200"
                  >
                    <Bell className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </motion.button>
                </div>

                <ThemeToggle />
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-200 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="hidden xl:block text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isHost ? 'Host Account' : 'Explorer'}
                      </p>
                    </div>
                    <motion.svg
                      animate={{ rotate: isProfileOpen ? 180 : 0 }}
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-3 z-50"
                      >
                        {/* Profile Header */}
                        <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center overflow-hidden">
                              {user.avatar_url ? (
                                <img
                                  src={user.avatar_url}
                                  alt={user.full_name}
                                  className="w-12 h-12 rounded-xl object-cover"
                                />
                              ) : (
                                <User className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {user.full_name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="w-5 h-5 mr-3" />
                            Profile Settings
                          </Link>
                          
                          <button
                            onClick={handleModeSwitch}
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors"
                          >
                            {isHost ? <Search className="w-5 h-5 mr-3" /> : <Building2 className="w-5 h-5 mr-3" />}
                            Switch to {isHost ? 'Explorer' : 'Host'} Mode
                          </button>
                        </div>

                        <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/login"
                    className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 font-semibold shadow-lg shadow-primary-500/25"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50"
          >
            <div className="px-4 py-6 space-y-4">
              {user ? (
                <>
                  {/* Mobile User Profile */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl backdrop-blur-sm">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center overflow-hidden">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.full_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isHost ? 'Host Account' : 'Explorer Account'}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Mode Toggle */}
                  <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl p-1.5 backdrop-blur-sm">
                    <button
                      onClick={() => !isHost && handleModeSwitch()}
                      disabled={!isHost}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                        !isHost
                          ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-lg'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Search className="w-5 h-5" />
                      <span>Explore</span>
                    </button>
                    <button
                      onClick={() => isHost || handleModeSwitch()}
                      disabled={isHost}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isHost
                          ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-lg'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                      <span>Host</span>
                    </button>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="space-y-2">
                    {!isHost && (
                      <Link
                        to="/saved"
                        className="flex items-center space-x-3 p-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-xl transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Heart className="w-5 h-5" />
                        <span>Saved Properties</span>
                      </Link>
                    )}
                    
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 p-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-xl transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Profile Settings</span>
                    </Link>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 w-full p-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block w-full p-4 text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-xl transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full p-4 text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all font-semibold shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
};