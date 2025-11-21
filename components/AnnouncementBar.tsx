'use client';
import React, { useEffect, useState } from 'react';

const offers = [
  "Lay's and Oreos Are Back. Grab Yours Now!",
  "Buy 1 Get 1 Free on Chocolates!",
  "Flat 20% Off on Beverages!",
  "Extra 10% Off on First Order!",
  "Free Delivery on Orders Above ₹499!",
  "Weekend Flash Sale - Up to 50% Off!"
];

const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % offers.length);
    }, 2000); // changes every 2 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-700 text-white text-sm font-semibold text-center py-2">
      <span className="transition-all duration-500 ease-in-out">{offers[index]}</span>
    </div>
  );
};

export default AnnouncementBar;
