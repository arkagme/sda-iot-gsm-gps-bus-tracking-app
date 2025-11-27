import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bus, Menu, X, Bell, User, LogOut, LayoutDashboard, MapPin, HelpCircle, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { unreadCount } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { path: '/tracking', label: 'Live Tracking', icon: MapPin, show: true },
    { path: '/support', label: 'Support', icon: HelpCircle, show: true },
    { path: '/admin', label: 'Admin', icon: Shield, show: isAdmin() },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SASTRA Bus</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:ml-10 md:space-x-4">
              {navLinks.filter(link => link.show).map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name?.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.filter(link => link.show).map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
