"use client";

import React from "react";

const ProductEmptyState: React.FC = () => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16">
      <div className="text-4xl sm:text-6xl mb-4 animate-bounce">🔍</div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
        No products found
      </h3>
      <p className="text-sm sm:text-base text-gray-500 text-center px-4">
        Try adjusting your filters or search terms
      </p>
    </div>
  );
};

export default ProductEmptyState;
