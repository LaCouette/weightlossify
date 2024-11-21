import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PricingProps {
  onGetStarted: () => void;
}

export function Pricing({ onGetStarted }: PricingProps) {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for getting started",
      features: [
        "Basic weight tracking",
        "Daily calorie calculator",
        "Simple progress charts",
        "Basic insights",
        "Limited history",
        "Community support"
      ],
      limitations: [
        "No AI insights",
        "No body fat scanner",
        "No day planner",
        "No data export"
      ]
    },
    {
      name: "Pro",
      price: "19",
      description: "Everything you need to succeed",
      features: [
        "Everything in Free, plus:",
        "AI-powered insights",
        "Body fat scanner",
        "Advanced analytics",
        "Unlimited history",
        "Day planner",
        "Data export",
        "Priority support",
        "Custom meal plans",
        "Training recommendations"
      ]
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="pricing">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple Pricing, Massive Value
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the plan that best fits your needs. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border ${
                plan.name === 'Pro' ? 'border-indigo-500' : 'border-gray-700'
              }`}
            >
              {plan.name === 'Pro' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-gray-400 mt-2">{plan.description}</p>
              </div>

              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}

                {plan.limitations?.map((limitation, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <span className="text-gray-400">{limitation}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onGetStarted}
                className={`w-full mt-8 px-6 py-3 rounded-xl font-medium transition-colors ${
                  plan.name === 'Pro'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {plan.name === 'Free' ? 'Start Free' : 'Go Pro'}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            All plans include a 14-day money-back guarantee. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
}