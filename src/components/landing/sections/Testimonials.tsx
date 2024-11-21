import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: "Jessica Anderson",
      age: 32,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
      quote: "I love how easy GetLean makes it to track my progress. I've lost 10kg and feel amazing!",
      achievement: "Lost 10kg in 3 months"
    },
    {
      name: "Tom Martinez",
      age: 28,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
      quote: "The day planner feature is genius. I planned for a big weekend meal and still stayed on track!",
      achievement: "Maintained weight while traveling"
    },
    {
      name: "Maria Chen",
      age: 41,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
      quote: "The insights helped me understand how sleep affects my weight loss. Game-changer!",
      achievement: "Reached ideal body composition"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="testimonials">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Real Results. Real Users.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See how GetLean has helped people just like you achieve their fitness goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="relative">
                <div className="absolute -top-2 -left-2">
                  <Quote className="h-8 w-8 text-indigo-500 opacity-50" />
                </div>
                <div className="pt-6">
                  <p className="text-gray-300 mb-6">"{testimonial.quote}"</p>
                  
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.age} years old</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-500 font-medium">
                        {testimonial.achievement}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}