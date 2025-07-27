// // import React, { useState } from 'react';
// // import { Filter, Star } from 'lucide-react';

// import { useFilterContext } from "@/context/FilterContext";
// import { Filter, Star } from "lucide-react";
// import { useContext, ReactNode, FC, useState } from "react";

// // const SidebarFilters = () => {
// //   /* -------------  LOCAL STATE ------------- */
// //   const [selectedCategory, setSelectedCategory] = useState('all');
// //   const [priceFilters, setPriceFilters] = useState([]);
// //   const [ratingFilters, setRatingFilters] = useState([]);

// //   /* -------------  DUMMY DATA ------------- */
// //   const categories = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Beverages'];

// //   /* -------------  HANDLERS ------------- */
// //   const togglePrice = (range:any) =>
// //     setPriceFilters((prev) =>
// //       prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
// //     );

// //   const toggleRating = (rate:any) =>
// //     setRatingFilters((prev) =>
// //       prev.includes(rate) ? prev.filter((r) => r !== rate) : [...prev, rate]
// //     );


// //     const price=['Under ₹200', '₹200 - ₹500', 'Above ₹500']
// //     const rating =[4, 3, 2, 1]
// //   /* -------------  RENDER ------------- */

// //   return (
// //     <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-0 ">
// //       {/* <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
// //         <Filter className="w-5 h-5 mr-2 text-orange-400" />
// //         Filters
// //       </h3> */}

// //       <div className="space-y-6">
// //         {/* ----- Categories ----- */}
// //         <div>
// //           <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
// //           <div className="space-y-2">
// //             {categories.map((cat) => {
// //               const key = cat === 'All' ? 'all' : cat.toLowerCase();
// //               return (
// //                 <label key={key} className="flex items-center">
// //                   <input
// //                     type="radio"
// //                     name="category"
// //                     className="text-orange-400 focus:ring-orange-400"
// //                     checked={selectedCategory === key}
// //                     onChange={() => setSelectedCategory(key)}
// //                   />
// //                   <span className="ml-2 text-sm text-gray-600">{cat}</span>
// //                 </label>
// //               );
// //             })}
// //           </div>
// //         </div>

// //         {/* ----- Price Range ----- */}
// //         <div>
// //           <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
// //           {price.map((range) => (
// //             <label key={range} className="flex items-center mb-2">
// //               <input
// //                 type="checkbox"
// //                 className="text-orange-400 focus:ring-orange-400 rounded"
// //                 checked={priceFilters.includes(range)}
// //                 onChange={() => togglePrice(range)}
// //               />
// //               <span className="ml-2 text-sm text-gray-600">{range}</span>
// //             </label>
// //           ))}
// //         </div>

// //         {/* ----- Rating ----- */}
// //         <div>
// //           <h4 className="font-medium text-gray-700 mb-3">Rating</h4>
// //           {rating.map((rating) => (
// //             <label key={rating} className="flex items-center mb-2">
// //               <input
// //                 type="checkbox"
// //                 className="text-orange-400 focus:ring-orange-400 rounded"
// //                 checked={ratingFilters.includes(rating)}
// //                 onChange={() => toggleRating(rating)}
// //               />
// //               <div className="ml-2 flex items-center">
// //                 {[...Array(5)].map((_, i) => (
// //                   <Star
// //                     key={i}
// //                     className={`w-4 h-4 ${
// //                       i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
// //                     }`}
// //                   />
// //                 ))}
// //                 <span className="ml-1 text-sm text-gray-600">& Up</span>
// //               </div>
// //             </label>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SidebarFilters;



// const SidebarFilters: React.FC = () => {
//   const { filters, updateFilter, toggleArrayFilter } = useFilterContext();


//   const categories = [
//     { key: 'all', label: 'All Products', icon: '🛒' },
//     { key: 'fruits', label: 'Fresh Fruits', icon: '🍎' },
//     { key: 'vegetables', label: 'Vegetables', icon: '🥕' },
//     { key: 'dairy', label: 'Dairy Products', icon: '🥛' },
//     { key: 'bakery', label: 'Bakery Items', icon: '🍞' },
//     { key: 'beverages', label: 'Beverages', icon: '🥤' },
//     { key: 'snacks', label: 'Snacks & Chips', icon: '🍿' },
//     { key: 'frozen', label: 'Frozen Foods', icon: '🧊' },
//     { key: 'spices', label: 'Spices & Herbs', icon: '🌶️' },
//     { key: 'pantry', label: 'Pantry Staples', icon: '🥫' }
//   ];

//   const priceRanges = [
//     { key: 'under-100', label: 'Under ₹100', min: 0, max: 100 },
//     { key: '100-300', label: '₹100 - ₹300', min: 100, max: 300 },
//     { key: '300-500', label: '₹300 - ₹500', min: 300, max: 500 },
//     { key: '500-1000', label: '₹500 - ₹1000', min: 500, max: 1000 },
//     { key: 'above-1000', label: 'Above ₹1000', min: 1000, max: Infinity }
//   ];

//   const ratings = [5, 4, 3, 2, 1];

//   return (
//     <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-0 border border-gray-200">
//       <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center">
//         <Filter className="w-6 h-6 mr-2 text-orange-500" />
//         Filters
//       </h3>

//       <div className="space-y-8">
//         {/* Categories */}
//         <div>
//           <h4 className="font-semibold text-gray-800 mb-4 text-lg">Categories</h4>
//           <div className="space-y-3 max-h-64 overflow-y-auto">
//             {categories.map((cat) => (
//               <label 
//                 key={cat.key} 
//                 className="flex items-center cursor-pointer hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200"
//               >
//                 <input
//                   type="radio"
//                   name="category"
//                   className="w-4 h-4 text-orange-500 focus:ring-orange-400 focus:ring-2"
//                   checked={filters.category === cat.key}
//                   onChange={() => updateFilter('category', cat.key)}
//                 />
//                 <span className="ml-3 text-2xl">{cat.icon}</span>
//                 <span className="ml-2 text-sm text-gray-700 font-medium">{cat.label}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Price Range */}
//         <div>
//           <h4 className="font-semibold text-gray-800 mb-4 text-lg">Price Range</h4>
//           <div className="space-y-3">
//             {priceRanges.map((range) => (
//               <label 
//                 key={range.key} 
//                 className="flex items-center cursor-pointer hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200"
//               >
//                 <input
//                   type="checkbox"
//                   className="w-4 h-4 text-orange-500 focus:ring-orange-400 focus:ring-2 rounded"
//                   checked={filters.priceRanges.includes(range.key)}
//                   onChange={() => toggleArrayFilter('priceRanges', range.key)}
//                 />
//                 <span className="ml-3 text-sm text-gray-700 font-medium">{range.label}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Rating */}
//         <div>
//           <h4 className="font-semibold text-gray-800 mb-4 text-lg">Customer Rating</h4>
//           <div className="space-y-3">
//             {ratings.map((rating) => (
//               <label 
//                 key={rating} 
//                 className="flex items-center cursor-pointer hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200"
//               >
//                 <input
//                   type="checkbox"
//                   className="w-4 h-4 text-orange-500 focus:ring-orange-400 focus:ring-2 rounded"
//                   checked={filters.ratings.includes(rating)}
//                   onChange={() => toggleArrayFilter('ratings', rating)}
//                 />
//                 <div className="ml-3 flex items-center">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`w-4 h-4 ${
//                         i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
//                       }`}
//                     />
//                   ))}
//                   <span className="ml-2 text-sm text-gray-600 font-medium">& Up</span>
//                 </div>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Clear Filters Button */}
//         <button
//           onClick={() => {
//             updateFilter('category', 'all');
//             updateFilter('priceRanges', []);
//             updateFilter('ratings', []);
//           }}
//           className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
//         >
//           Clear All Filters
//         </button>
//       </div>
//     </div>
//   );
// };


// export default SidebarFilters;



import React from 'react';
import { Filter, Star, X } from 'lucide-react';
import { useFilterContext } from '@/context/FilterContext';

interface SidebarFiltersProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({ isMobile = false, onClose }) => {
  const { filters, updateFilter, toggleArrayFilter } = useFilterContext();

  const categories = [
    { key: 'all', label: 'All Products', icon: '🛒' },
    { key: 'fruits', label: 'Fresh Fruits', icon: '🍎' },
    { key: 'vegetables', label: 'Vegetables', icon: '🥕' },
    { key: 'dairy', label: 'Dairy Products', icon: '🥛' },
    { key: 'bakery', label: 'Bakery Items', icon: '🍞' },
    { key: 'beverages', label: 'Beverages', icon: '🥤' },
    { key: 'snacks', label: 'Snacks & Chips', icon: '🍿' },
    { key: 'frozen', label: 'Frozen Foods', icon: '🧊' },
    { key: 'spices', label: 'Spices & Herbs', icon: '🌶️' },
    { key: 'pantry', label: 'Pantry Staples', icon: '🥫' }
  ];

  const priceRanges = [
    { key: 'under-100', label: 'Under ₹100', min: 0, max: 100 },
    { key: '100-300', label: '₹100 - ₹300', min: 100, max: 300 },
    { key: '300-500', label: '₹300 - ₹500', min: 300, max: 500 },
    { key: '500-1000', label: '₹500 - ₹1000', min: 500, max: 1000 },
    { key: 'above-1000', label: 'Above ₹1000', min: 1000, max: Infinity }
  ];

  const ratings = [5, 4, 3, 2, 1];

  const containerClasses = isMobile 
    ? "w-full bg-white rounded-lg shadow-sm border border-gray-200" 
    : "w-64 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-0 border border-gray-200";

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isMobile ? 'p-4 pb-2' : 'mb-6'}`}>
        <h3 className="font-bold text-lg sm:text-xl text-gray-900 flex items-center">
          <Filter className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-500" />
          Filters
        </h3>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <div className={`space-y-6 sm:space-y-8 ${isMobile ? 'p-4 pt-0' : ''}`}>
        {/* Categories */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">Categories</h4>
          <div className={`space-y-2 sm:space-y-3 ${isMobile ? 'max-h-40' : 'max-h-64'} overflow-y-auto`}>
            {categories.map((cat) => (
              <label 
                key={cat.key} 
                className="flex items-center cursor-pointer hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200"
              >
                <input
                  type="radio"
                  name="category"
                  className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 focus:ring-orange-400 focus:ring-2"
                  checked={filters.category === cat.key}
                  onChange={() => updateFilter('category', cat.key)}
                />
                <span className="ml-2 sm:ml-3 text-lg sm:text-2xl">{cat.icon}</span>
                <span className="ml-2 text-xs sm:text-sm text-gray-700 font-medium">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">Price Range</h4>
          <div className="space-y-2 sm:space-y-3">
            {priceRanges.map((range) => (
              <label 
                key={range.key} 
                className="flex items-center cursor-pointer hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 focus:ring-orange-400 focus:ring-2 rounded"
                  checked={filters.priceRanges.includes(range.key)}
                  onChange={() => toggleArrayFilter('priceRanges', range.key)}
                />
                <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700 font-medium">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">Customer Rating</h4>
          <div className="space-y-2 sm:space-y-3">
            {ratings.map((rating) => (
              <label 
                key={rating} 
                className="flex items-center cursor-pointer hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 focus:ring-orange-400 focus:ring-2 rounded"
                  checked={filters.ratings.includes(rating)}
                  onChange={() => toggleArrayFilter('ratings', rating)}
                />
                <div className="ml-2 sm:ml-3 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${
                        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600 font-medium">& Up</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Applied Filters Summary - Mobile Only */}
        {isMobile && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 text-base">Applied Filters</h4>
            <div className="flex flex-wrap gap-2">
              {filters.category !== 'all' && (
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs flex items-center">
                  Category: {filters.category}
                  <button
                    onClick={() => updateFilter('category', 'all')}
                    className="ml-1 hover:text-orange-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.priceRanges.map(range => (
                <span key={range} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                  {priceRanges.find(p => p.key === range)?.label}
                  <button
                    onClick={() => toggleArrayFilter('priceRanges', range)}
                    className="ml-1 hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.ratings.map(rating => (
                <span key={rating} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center">
                  {rating}+ stars
                  <button
                    onClick={() => toggleArrayFilter('ratings', rating)}
                    className="ml-1 hover:text-green-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters Button */}
        <button
          onClick={() => {
            updateFilter('category', 'all');
            updateFilter('priceRanges', []);
            updateFilter('ratings', []);
          }}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 sm:py-3 px-4 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
        >
          Clear All Filters
        </button>

        {/* Apply Filters Button - Mobile Only */}
        {isMobile && (
          <button
            onClick={onClose}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Apply Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SidebarFilters;