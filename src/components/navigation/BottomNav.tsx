import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Calculator, User } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/logs', icon: Calendar, label: 'Logs' },
    { path: '/calculator', icon: Calculator, label: 'TDEE' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="grid grid-cols-4 h-14">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center space-y-1 active:bg-gray-100 ${
                isActive 
                  ? 'text-indigo-600' 
                  : 'text-gray-600'
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