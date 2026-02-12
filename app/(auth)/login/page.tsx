"use client";
import React, { useState } from 'react'
import AuthSystem from '@/components/auth-system'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/store/useUserStore'
import { motion } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';

const page = () => {
  const router = useRouter()
  const { user } = useUserStore();
  const userRole = user?.role;
  const [showAuth, setShowAuth] = useState(false) // Added state back
  console.log("user", user, "userRole", userRole)

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-gray-900">

      {/* Full Page Background Image with Animation */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="w-full h-full"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.6
          }}
        />
        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 h-full relative z-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between min-h-screen py-10">

        {/* Left Side: Branding & Features (Desktop Only) */}
        <div className="hidden lg:flex flex-col justify-center max-w-2xl px-8 space-y-10">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/10">
              <img src="/logoGro.png" alt="Logo" className="w-16 h-16 object-cover rounded-full shadow-2xl" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-5xl font-extrabold text-white tracking-tight leading-none">Foody</h1>
              <span className="text-orange-400 font-medium tracking-wide text-sm mt-1">DELIVERED FRESH</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Satisfy Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Cravings</span> Today.
            </h2>
            <p className="text-xl text-gray-300 max-w-lg leading-relaxed font-light">
              Discover the best local restaurants and get fresh food delivered to your doorstep in minutes.
            </p>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-6 pt-6"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors duration-300 group cursor-default">
              <div className="bg-orange-500/20 w-fit p-2 rounded-lg mb-3 group-hover:bg-orange-500/30 transition-colors">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-white font-semibold text-lg">Fast Delivery</h3>
              <p className="text-xs text-gray-400 mt-1 font-light">Under 30 mins</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors duration-300 group cursor-default">
              <div className="bg-orange-500/20 w-fit p-2 rounded-lg mb-3 group-hover:bg-orange-500/30 transition-colors">
                <Star className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-white font-semibold text-lg">Top Rated</h3>
              <p className="text-xs text-gray-400 mt-1 font-light">Curated Chefs</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors duration-300 group cursor-default">
              <div className="bg-orange-500/20 w-fit p-2 rounded-lg mb-3 group-hover:bg-orange-500/30 transition-colors">
                <MapPin className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-white font-semibold text-lg">Live Tracking</h3>
              <p className="text-xs text-gray-400 mt-1 font-light">Real-time GPS</p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full max-w-md lg:mr-8 xl:mr-20 z-20">
          <AuthSystem onClose={() => setShowAuth(false)} userRole1={userRole || ''} onLoginSuccess={() => console.log("Login success")} />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-xs text-gray-400/60 mt-6 font-light"
          >
            &copy; {new Date().getFullYear()} Foody. All rights reserved.
          </motion.p>
        </div>

      </div>
    </div>
  )
}

export default page
