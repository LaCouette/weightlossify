import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AuthPage } from './components/auth/AuthPage';
import { ProfileSetup } from './components/profile/ProfileSetup';
import { Profile } from './components/profile/Profile';
import { LogsHistory } from './components/LogsHistory';
import { Calculator } from './components/Calculator';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { useInitializeWeight } from './hooks/useInitializeWeight';
import { BottomNav } from './components/navigation/BottomNav';

export function App() {
  // Initialize weight state
  useInitializeWeight();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/profile-setup"
            element={
              <PrivateRoute>
                <ProfileSetup />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1 container mx-auto px-4 py-8 mb-16 md:mb-0">
                    <Profile />
                  </main>
                  <BottomNav />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1 container mx-auto px-4 py-8 mb-16 md:mb-0">
                    <LogsHistory />
                  </main>
                  <BottomNav />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/calculator"
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1 container mx-auto px-4 py-8 mb-16 md:mb-0">
                    <Calculator />
                  </main>
                  <BottomNav />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1 container mx-auto px-4 py-8 mb-16 md:mb-0">
                    <Dashboard />
                  </main>
                  <BottomNav />
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}