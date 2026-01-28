"use client";

import React from "react";

const ProductSkeletonGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-gray-200 dark:bg-gray-800" />
          <div className="p-3 md:p-5 space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4" />
            <div className="h-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/3" />
              <div className="h-10 md:h-12 w-20 bg-gray-200 dark:bg-gray-800 rounded-xl md:rounded-2xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeletonGrid;
