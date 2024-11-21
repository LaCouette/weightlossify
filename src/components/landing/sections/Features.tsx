import React from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  BarChart2,
  Calendar,
  Brain,
  Camera,
  Activity,
  Zap,
  Smartphone,
  Scale,
  Target
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Calculator,
      title: "Daily Caloric Balance",
      description: "Know exactly what to eat and burn every day—no math required.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: BarChart2,
      title: "Energy Flux Visualization",
      description: "Dynamic, interactive graphs show your daily energy balance.",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Calendar,
      title: "Smart Day Planner",
      description: "Plan ahead and adjust targets for special occasions.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations based on your data.",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10"
    },
    {
      icon: Camera,
      title: "Body Fat Scanner",
      description: "AI-powered body composition analysis from photos.",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10"
    },
    {
      icon: Activity,
      title: "Pattern Analysis",
      description: "Discover what works best for your body.",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      icon: Zap,
      title: "Dynamic Adjustments",
      description: "Automatic updates based on your progress.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: Smartphone,
      title: "Device Integration",
      description: "Sync with your favorite fitness apps and devices.",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10"
    },
    {
      icon: Scale,
      title: "Body Composition",
      description: "Track more than just weight—monitor your body changes.",
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set and track meaningful, achievable targets.",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="features">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Features That Make Weight Goals Effortless
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to achieve your ideal body composition, all in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}