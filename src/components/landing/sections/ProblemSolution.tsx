import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Calendar, 
  Calculator, 
  Activity,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export function ProblemSolution() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Weight Management Feels Impossible (and How GetLean Fixes It)
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We've identified the common struggles and built solutions that actually work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <span>Common Struggles</span>
            </h3>

            <div className="space-y-6">
              {[
                {
                  icon: Calculator,
                  title: "Confusing Calculations",
                  description: "Struggling to determine your real caloric needs and adjustments."
                },
                {
                  icon: Calendar,
                  title: "Rigid Plans",
                  description: "Fixed routines that don't adapt to your changing lifestyle."
                },
                {
                  icon: Brain,
                  title: "Lack of Clarity",
                  description: "Guessing what works and what doesn't without real insights."
                }
              ].map((problem, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <problem.icon className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{problem.title}</h4>
                      <p className="text-gray-400 text-sm">{problem.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <span>How GetLean Helps</span>
            </h3>

            <div className="space-y-6">
              {[
                {
                  icon: Calculator,
                  title: "Accurate Caloric Needs",
                  description: "Instant TDEE calculations based on your goals and activity."
                },
                {
                  icon: Calendar,
                  title: "Flexible Day Planner",
                  description: "Adjust targets in advance for special occasions or rest days."
                },
                {
                  icon: Activity,
                  title: "Optimized Body Composition",
                  description: "Smart insights for better fat loss or lean muscle gain."
                },
                {
                  icon: Brain,
                  title: "AI-Powered Insights",
                  description: "Personalized recommendations based on your unique patterns."
                }
              ].map((solution, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <solution.icon className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{solution.title}</h4>
                      <p className="text-gray-400 text-sm">{solution.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}