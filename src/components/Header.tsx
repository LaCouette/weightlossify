import React from 'react';
import { Activity, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export function Header() {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">WeightLossify</h1>
        </div>
        <nav className="flex items-center space-x-6">
          <Link
            to="/"
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium ${
              isActive('/') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium ${
              isActive('/profile') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
            }`}
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>
          <button 
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>
    </header>
  );
}