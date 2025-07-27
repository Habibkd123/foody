// import React, { useState } from 'react';
// import { Filter, Star } from 'lucide-react';

import { useFilterContext } from "@/context/FilterContext";
import { Filter, Star } from "lucide-react";
import { useContext, ReactNode, FC, useState } from "react";

// const SidebarFilters = () => {
//   /* -------------  LOCAL STATE ------------- */
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [priceFilters, setPriceFilters] = useState([]);
//   const [ratingFilters, setRatingFilters] = useState([]);

//   /* -------------  DUMMY DATA ------------- */
//   const categories = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Beverages'];

//   /* -------------  HANDLERS ------------- */
//   const togglePrice = (range:any) =>
//     setPriceFilters((prev) =>
//       prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
//     );

//   const toggleRating = (rate:any) =>
//     setRatingFilters((prev) =>
//       prev.includes(rate) ? prev.filter((r) => r !== rate) : [...prev, rate]
//     );


//     const price=['Under ₹200', '₹200 - ₹500', 'Above ₹500']
//     const rating =[4, 3, 2, 1]
//   /* -------------  RENDER ------------- */

//   return (
//     <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-0 ">
//       {/* <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
//         <Filter className="w-5 h-5 mr-2 text-orange-400" />
//         Filters
//       </h3> */}

//       <div className="space-y-6">
//         {/* ----- Categories ----- */}
//         <div>
//           <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
//           <div className="space-y-2">
//             {categories.map((cat) => {
//               const key = cat === 'All' ? 'all' : cat.toLowerCase();
//               return (
//                 <label key={key} className="flex items-center">
//                   <input
//                     type="radio"
//                     name="category"
//                     className="text-orange-400 focus:ring-orange-400"
//                     checked={selectedCategory === key}
//                     onChange={() => setSelectedCategory(key)}
//                   />
//                   <span className="ml-2 text-sm text-gray-600">{cat}</span>
//                 </label>
//               );
//             })}
//           </div>
//         </div>

//         {/* ----- Price Range ----- */}
//         <div>
//           <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
//           {price.map((range) => (
//             <label key={range} className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 className="text-orange-400 focus:ring-orange-400 rounded"
//                 checked={priceFilters.includes(range)}
//                 onChange={() => togglePrice(range)}
//               />
//               <span className="ml-2 text-sm text-gray-600">{range}</span>
//             </label>
//           ))}
//         </div>

//         {/* ----- Rating ----- */}
//         <div>
//           <h4 className="font-medium text-gray-700 mb-3">Rating</h4>
//           {rating.map((rating) => (
//             <label key={rating} className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 className="text-orange-400 focus:ring-orange-400 rounded"
//                 checked={ratingFilters.includes(rating)}
//                 onChange={() => toggleRating(rating)}
//               />
//               <div className="ml-2 flex items-center">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`w-4 h-4 ${
//                       i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
//                     }`}
//                   />
//                 ))}
//                 <span className="ml-1 text-sm text-gray-600">& Up</span>
//               </div>
//             </label>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SidebarFilters;



const SidebarFilters: React.FC = () => {
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

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-0 border border-gray-200">
      <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center">
        <Filter className="w-6 h-6 mr-2 text-orange-500" />
        Filters
      </h3>

      <div className="space-y-8">
        {/* Categories */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 text-lg">Categories</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {categories.map((cat) => (
              <label 
                key={cat.key} 
                className="flex items-center cursor-pointer hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200"
              >
                <input
                  type="radio"
                  name="category"
                  className="w-4 h-4 text-orange-500 focus:ring-orange-400 focus:ring-2"
                  checked={filters.category === cat.key}
                  onChange={() => updateFilter('category', cat.key)}
                />
                <span className="ml-3 text-2xl">{cat.icon}</span>
                <span className="ml-2 text-sm text-gray-700 font-medium">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 text-lg">Price Range</h4>
          <div className="space-y-3">
            {priceRanges.map((range) => (
              <label 
                key={range.key} 
                className="flex items-center cursor-pointer hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-orange-500 focus:ring-orange-400 focus:ring-2 rounded"
                  checked={filters.priceRanges.includes(range.key)}
                  onChange={() => toggleArrayFilter('priceRanges', range.key)}
                />
                <span className="ml-3 text-sm text-gray-700 font-medium">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 text-lg">Customer Rating</h4>
          <div className="space-y-3">
            {ratings.map((rating) => (
              <label 
                key={rating} 
                className="flex items-center cursor-pointer hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-orange-500 focus:ring-orange-400 focus:ring-2 rounded"
                  checked={filters.ratings.includes(rating)}
                  onChange={() => toggleArrayFilter('ratings', rating)}
                />
                <div className="ml-3 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 font-medium">& Up</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={() => {
            updateFilter('category', 'all');
            updateFilter('priceRanges', []);
            updateFilter('ratings', []);
          }}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};


export default SidebarFilters;