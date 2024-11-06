import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-8">
        <Activity className="h-10 w-10 text-indigo-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-900">WeightLossify</h1>
      </div>
      
      {isLogin ? <LoginForm /> : <RegisterForm />}
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}