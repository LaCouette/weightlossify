import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, 
  BarChart2, 
  Brain, 
  Calculator, 
  Calendar, 
  Camera, 
  ChevronRight,
  Clock,
  Scale,
  Target,
  Zap
} from 'lucide-react';
import { Hero } from './sections/Hero';
import { ProblemSolution } from './sections/ProblemSolution';
import { Features } from './sections/Features';
import { HowItWorks } from './sections/HowItWorks';
import { Testimonials } from './sections/Testimonials';
import { VisualDemo } from './sections/VisualDemo';
import { Pricing } from './sections/Pricing';
import { FAQ } from './sections/FAQ';
import { StickyFooter } from './sections/StickyFooter';

export function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-indigo-500" />
              <span className="text-xl font-bold">GetLean</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
              <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
            </div>
            <button
              onClick={handleGetStarted}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <Hero onGetStarted={handleGetStarted} />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        <Testimonials />
        <VisualDemo />
        <Pricing onGetStarted={handleGetStarted} />
        <FAQ />
      </main>

      <StickyFooter onGetStarted={handleGetStarted} />
    </div>
  );
}