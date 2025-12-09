"use client"

import React from "react"
import { Clock, Star, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

export default function WhyChooseSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white"
        >
          Why Choose <span className="text-primary">Gro-Delivery?</span>
        </motion.h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[ 
            {
              icon: <Clock className="h-10 w-10 text-primary" />,
              title: "Fast Delivery",
              desc: "Get your groceries delivered within 30 minutes",
            },
            {
              icon: <Star className="h-10 w-10 text-primary" />,
              title: "Quality Products",
              desc: "Fresh and high-quality groceries every time",
            },
            {
              icon: <ShoppingCart className="h-10 w-10 text-primary" />,
              title: "Best Prices",
              desc: "Competitive pricing & weekly discounts",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              transition={{
                delay: i * 0.2,  // 👈 FIX — delay added here
                duration: 0.6,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.04 }}
              className="bg-white dark:bg-gray-800 px-8 py-10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              
              {/* Icon Circle */}
              <motion.div 
                whileHover={{ scale: 1.15, rotate: 5 }}
                className="w-20 h-20 bg-secondary/70 dark:bg-secondary/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:shadow-xl transition-all"
              >
                {item.icon}
              </motion.div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {item.desc}
              </p>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
