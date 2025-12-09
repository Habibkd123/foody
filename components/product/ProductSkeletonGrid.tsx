"use client";

import React from "react";

const ProductSkeletonGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-gray-200" />
          <div className="p-2 sm:p-3 md:p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeletonGrid;
