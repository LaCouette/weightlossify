import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Play } from 'lucide-react';

export function VisualDemo() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(99,102,241,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See Your Progress Like Never Before
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Interactive visualizations help you understand your energy balance and progress at a glance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-gray-800">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
              alt="GetLean energy flux visualizer demo"
              className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

            {/* Demo Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="group bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-8 transition-colors">
                <Play className="h-12 w-12 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Floating Stats */}
            <div className="absolute inset-x-0 bottom-0 p-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <BarChart2 className="h-5 w-5 text-blue-400" />
                  <div>
                    <div className="text-sm text-gray-400">Daily Balance</div>
                    <div className="text-lg font-bold text-white">-350 kcal</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <BarChart2 className="h-5 w-5 text-green-400" />
                  <div>
                    <div className="text-sm text-gray-400">Weekly Trend</div>
                    <div className="text-lg font-bold text-white">-0.5 kg</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <BarChart2 className="h-5 w-5 text-purple-400" />
                  <div>
                    <div className="text-sm text-gray-400">Progress</div>
                    <div className="text-lg font-bold text-white">On Track</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            👀 Explore the Energy Flux Visualizer
          </button>
        </div>
      </div>
    </section>
  );
}