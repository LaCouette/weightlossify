import React, { useState } from 'react';
import { Zap, TrendingUp, Info, ChevronDown, ChevronUp, Clock, Target, Brain, Calculator } from 'lucide-react';
import { getGFluxLevel, getGFluxRecommendations, getGFluxEducation } from '../../utils/gfluxCalculations';
import { motion, AnimatePresence } from 'framer-motion';

interface GFluxMeterProps {
  calories: number;
  steps: number;
  gFlux: number;
}

export function GFluxMeter({ calories, steps, gFlux }: GFluxMeterProps) {
  const [showEducation, setShowEducation] = useState(false);
  const { level, message, color } = getGFluxLevel(gFlux);
  const recommendations = getGFluxRecommendations(gFlux, calories, steps);
  const education = getGFluxEducation(level);

  const getPercentage = (gFlux: number) => {
    const max = 5000; // Maximum G-Flux value for visualization
    return Math.min((gFlux / max) * 100, 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Main Meter Display */}
      <div className="p-6 relative">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r opacity-10"
          initial={{ width: '0%' }}
          animate={{ width: `${getPercentage(gFlux)}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            backgroundImage: `linear-gradient(to right, ${
              level === 'low' ? '#EF4444, #F97316' :
              level === 'moderate' ? '#EAB308, #22C55E' :
              level === 'high' ? '#22C55E, #3B82F6' :
              '#3B82F6, #8B5CF6'
            })`
          }}
        />

        <div className="relative">
          {/* G-Flux Score */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-2"
              style={{
                backgroundImage: `linear-gradient(to right, ${
                  level === 'low' ? '#EF4444, #F97316' :
                  level === 'moderate' ? '#EAB308, #22C55E' :
                  level === 'high' ? '#22C55E, #3B82F6' :
                  '#3B82F6, #8B5CF6'
                })`
              }}>
              {gFlux.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Daily G-Flux Score</div>
          </div>

          {/* Energy Flow Visualization */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">
                {calories.toLocaleString()} kcal
              </div>
              <div className="text-sm text-gray-600">Energy In</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {Math.round(steps * 0.045 + 300).toLocaleString()} kcal
              </div>
              <div className="text-sm text-gray-600">Energy Out</div>
            </div>
          </div>

          {/* Level Indicator */}
          <div className="text-center mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              level === 'low' ? 'bg-red-100 text-red-800' :
              level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
              level === 'high' ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              <Zap className="w-4 h-4 mr-1" />
              {level.charAt(0).toUpperCase() + level.slice(1)} G-Flux
            </span>
          </div>

          {/* Message */}
          <div className="text-center text-gray-600 text-sm mb-4">
            {message}
          </div>

          {/* Learn More Button */}
          <div className="text-center">
            <button
              onClick={() => setShowEducation(!showEducation)}
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
            >
              {showEducation ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span>Hide Details</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span>Learn More About G-Flux</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Educational Section */}
      <AnimatePresence>
        {showEducation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 overflow-hidden"
          >
            <div className="bg-indigo-50 p-6">
              <div className="space-y-6">
                {/* What is G-Flux */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-medium text-gray-900">What is G-Flux?</h3>
                  </div>
                  <p className="text-sm text-gray-600">{education.whatIsIt}</p>
                </div>

                {/* Benefits */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-medium text-gray-900">Key Benefits</h3>
                  </div>
                  <ul className="grid grid-cols-2 gap-2">
                    {education.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How it's Calculated */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-medium text-gray-900">How It's Calculated</h3>
                  </div>
                  <p className="text-sm text-gray-600">{education.howCalculated}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendations Section */}
      <div className="bg-gray-50 border-t border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Immediate Actions */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-indigo-600" />
              <h3 className="font-medium text-gray-900">Today's Actions</h3>
            </div>
            <div className="space-y-2">
              {recommendations.immediate.map((rec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Short-term Goals */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-indigo-600" />
              <h3 className="font-medium text-gray-900">This Week's Goals</h3>
            </div>
            <div className="space-y-2">
              {recommendations.shortTerm.map((rec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Long-term Strategies */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-indigo-600" />
              <h3 className="font-medium text-gray-900">Long-term Strategy</h3>
            </div>
            <div className="space-y-2">
              {recommendations.longTerm.map((rec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}