import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calculator, User, BarChart, Camera } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/app/dashboard', icon: Home, label: 'Home' },
    { path: '/app/analytics', icon: BarChart, label: 'Analytics' },
    { path: '/app/bodyfat-scan', icon: Camera, label: 'Body Fat' },
    { path: '/app/calculator', icon: Calculator, label: 'TDEE' },
    { path: '/app/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="grid grid-cols-5 h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center space-y-1 ${
                isActive 
                  ? 'text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}