import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { BottomNav } from './components/navigation/BottomNav';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { AuthPage } from './components/auth/AuthPage';
import { ProfileSetup } from './components/profile/ProfileSetup';
import { Profile } from './components/profile/Profile';
import { LogsHistory } from './components/LogsHistory';
import { Calculator } from './components/Calculator';
import { BodyFatScan } from './components/bodyfat/BodyFatScan';
import { LandingPage } from './components/landing/LandingPage';
import PrivateRoute from './components/auth/PrivateRoute';
import { useInitializeWeight } from './hooks/useInitializeWeight';

export function App() {
  // Initialize weight state
  useInitializeWeight();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile-setup"
            element={
              <PrivateRoute>
                <ProfileSetup />
              </PrivateRoute>
            }
          />

          {/* App Layout Routes */}
          <Route
            path="/app/*"
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen pb-16 md:pb-0">
                  <Header />
                  <Routes>
                    <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/logs" element={<LogsHistory />} />
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/bodyfat-scan" element={<BodyFatScan />} />
                  </Routes>
                  <BottomNav />
                </div>
              </PrivateRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}