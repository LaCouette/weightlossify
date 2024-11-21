import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ChevronRight, Target } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(167,139,250,0.1),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
              <Activity className="h-5 w-5 text-indigo-400" />
              <span className="text-indigo-400 font-medium">AI-Powered Weight Management</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 text-transparent bg-clip-text">
              GetLean: Your Flexible Path to the Perfect You
            </h1>

            <p className="text-xl text-gray-400 mb-8">
              Master your weight goals with precision, autonomy, and fun! Achieve your ideal body with an AI-powered platform offering personalized insights, daily adjustments, and flexible planning—tailored just for you.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 group"
              >
                Start Free Trial
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Right Column - App Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-gray-800">
              <img
                src="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80"
                alt="GetLean app showing energy balance visualization"
                className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
              
              {/* Floating Stats Cards */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-gray-800 w-full max-w-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                      <Activity className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Daily Progress</div>
                      <div className="text-xl font-bold text-white">87% Complete</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-gray-800 w-full max-w-xs ml-auto"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Target className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Weekly Goal</div>
                      <div className="text-xl font-bold text-white">On Track</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}