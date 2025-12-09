"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="relative bg-gray-900 text-white pt-20 pb-10 overflow-hidden">

      {/* Floating Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-primary/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* TOP CTA BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary to-red-500 rounded-2xl px-6 py-10 text-center text-white shadow-xl mb-20"
        >
          <h3 className="text-2xl md:text-3xl font-bold">Get Exclusive Deals & Offers!</h3>
          <p className="text-white/90 mt-2 mb-6">
            Subscribe to our newsletter & stay updated with fresh grocery discounts.
          </p>

          {/* Newsletter Input */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-lg mx-auto">
            <Input
              className="bg-white text-black placeholder:text-gray-500 border-none"
              placeholder="Enter your email"
            />
            <Button className="bg-black hover:bg-gray-800 text-white px-6">Subscribe</Button>
          </div>
        </motion.div>

        {/* LINK GRID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16"
        >
          {/* COMPANY */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a className="hover:text-white" href="#">About</a></li>
              <li><a className="hover:text-white" href="#">Careers</a></li>
              <li><a className="hover:text-white" href="#">Press</a></li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Help Center</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a className="hover:text-white" href="#">Support</a></li>
              <li><a className="hover:text-white" href="#">Order Tracking</a></li>
              <li><a className="hover:text-white" href="#">Refund Policy</a></li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a className="hover:text-white" href="#">Fruits & Veggies</a></li>
              <li><a className="hover:text-white" href="#">Dairy Products</a></li>
              <li><a className="hover:text-white" href="#">Household Items</a></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a className="hover:text-white" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-white" href="#">Terms & Conditions</a></li>
              <li><a className="hover:text-white" href="#">Cookies</a></li>
            </ul>
          </div>
        </motion.div>

        {/* SOCIAL + APP LINKS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10"
        >
          {/* SOCIAL BUTTONS */}
          <div className="flex space-x-5">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
              <motion.div key={index} whileHover={{ scale: 1.15 }}>
                <Button
                  size="icon"
                  className="bg-white/10 rounded-full backdrop-blur-md p-3 hover:bg-white/20 text-gray-300 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </div>

          {/* APP STORE BUTTONS */}
          <div className="flex gap-4">
            <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold shadow-md hover:opacity-90">
              App Store
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:opacity-90">
              Google Play
            </button>
          </div>
        </motion.div>

        {/* COPYRIGHT */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-400 text-sm border-t border-white/10 pt-6"
        >
          © {new Date().getFullYear()} Gro-Delivery — All Rights Reserved.
        </motion.p>
      </div>

    </footer>
  )
}
