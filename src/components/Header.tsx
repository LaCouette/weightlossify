import React, { useState } from 'react';
import { Activity, LogOut, User, Menu, X, Calendar, Calculator, BarChart, Home, Camera } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export function Header() {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: Home },
    { path: '/app/analytics', label: 'Analytics', icon: BarChart },
    { path: '/app/bodyfat-scan', label: 'Body Fat Scan', icon: Camera },
    { path: '/app/logs', label: 'Logs History', icon: Calendar },
    { path: '/app/calculator', label: 'TDEE Calculator', icon: Calculator },
    { path: '/app/profile', label: 'Profile', icon: User }
  ];

  return (
    <header className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Centered Logo and Brand */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              navigate('/app/dashboard');
              setIsMenuOpen(false);
            }}
          >
            <Activity className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">WeightLossify</h1>
          </div>

          {/* Sign Out Button */}
          <button 
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Full Screen Navigation Menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {menuItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive(path)
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>

              <div className="absolute bottom-8 left-0 right-0 px-6">
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}