import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading: authLoading } = useAuthStore();
  const { profile, fetchProfile, isLoading: profileLoading } = useUserStore();
  const location = useLocation();

  useEffect(() => {
    if (user?.uid && !profile) {
      fetchProfile(user.uid);
    }
  }, [user?.uid, fetchProfile, profile]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Only redirect to profile setup if:
  // 1. Profile doesn't exist or setup isn't completed
  // 2. We're not already on the profile setup page
  // 3. We're not on the auth page
  if ((!profile || !profile.setupCompleted) && 
      location.pathname !== '/profile-setup' && 
      location.pathname !== '/auth') {
    return <Navigate to="/profile-setup" />;
  }

  return <>{children}</>;
}