import React from 'react';
import { motion } from 'framer-motion';
import { Target, Activity, Brain } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Target,
      title: "Set Your Goal",
      description: "Choose between weight loss, lean muscle gain, or maintenance.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Activity,
      title: "Track Your Daily Habits",
      description: "Log your food, activity, sleep, and more with ease.",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Brain,
      title: "Let GetLean Guide You",
      description: "Get AI-powered insights to optimize your journey.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="how-it-works">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(167,139,250,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started in Just 3 Easy Steps!
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your journey to a better you starts here. No complicated setup, just simple steps to success.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-800 to-gray-700" />
              )}

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 relative">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className={`p-4 rounded-xl ${step.bgColor} mb-6`}>
                    <step.icon className={`h-8 w-8 ${step.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Example UI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1611339555312-e607c8352fd7?auto=format&fit=crop&q=80"
              alt="GetLean app interface demonstration"
              className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Transform?</h3>
                <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                  Join thousands of users who are achieving their fitness goals with GetLean.
                </p>
                <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                  Start Your Journey
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}