import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is GetLean suitable for weight gain or muscle building?",
      answer: "Absolutely! GetLean adapts to your goals, whether you want to lose fat, gain muscle, or maintain your current weight. Our AI-powered system helps you optimize your caloric surplus and provides specific recommendations for muscle growth."
    },
    {
      question: "How accurate is the body fat scanner?",
      answer: "Our AI-powered body fat scanner provides estimates with approximately 90% accuracy compared to DEXA scans. While it's not a replacement for medical-grade analysis, it's an excellent tool for tracking progress and trends over time."
    },
    {
      question: "Can I plan ahead for big events?",
      answer: "Yes! Our day planner feature lets you adjust your targets for special occasions. GetLean will automatically optimize your calories and activity levels for the days before and after to keep you on track with your goals."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time with no questions asked. We offer a 14-day money-back guarantee on all paid plans, so you can try GetLean risk-free."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="faq">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.1),transparent_50%)]" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-xl mb-4">
            <HelpCircle className="h-6 w-6 text-indigo-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Got questions? We've got answers. If you can't find what you're looking for, reach out to our support team.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-left"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium pr-8">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                
                {openIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 text-gray-400 text-sm"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}