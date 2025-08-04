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
import React, { useState, useEffect } from 'react';
import { Filter, Star, X, ChevronDown, ChevronUp, Search, Trash2, Check } from 'lucide-react';
import { useFilterContext } from '@/context/FilterContext';

interface SidebarFiltersProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({ isMobile = false, onClose }) => {
  const { filters, updateFilter, toggleArrayFilter } = useFilterContext();
  
  // Enhanced state management
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    priceRanges: true,
    ratings: true
  });
  const [categorySearch, setCategorySearch] = useState('');
  const [animatingFilters, setAnimatingFilters] = useState<string[]>([]);
  const [filterCounts, setFilterCounts] = useState({ categories: 0, priceRanges: 0, ratings: 0 });

  // Basic grocery and bakery categories only
  const categories = [
    { key: 'all', label: 'All Products', icon: '🛒', color: 'bg-gray-100' },
    { key: 'rice', label: 'Rice & Grains', icon: '🍚', color: 'bg-green-100' },
    { key: 'flour', label: 'Flour & Powder', icon: '🌾', color: 'bg-yellow-100' },
    { key: 'spices', label: 'Spices & Masala', icon: '🌶️', color: 'bg-red-100' },
    { key: 'oil', label: 'Cooking Oil', icon: '🫒', color: 'bg-amber-100' },
    { key: 'bakery', label: 'Cakes & Pastries', icon: '🍰', color: 'bg-pink-100' },
    { key: 'biscuits', label: 'Biscuits & Cookies', icon: '🍪', color: 'bg-orange-100' },
    { key: 'dairy', label: 'Dairy Products', icon: '🥛', color: 'bg-blue-100' },
    { key: 'beverages', label: 'Beverages', icon: '🥤', color: 'bg-purple-100' },
    { key: 'snacks', label: 'Packaged Snacks', icon: '🍿', color: 'bg-indigo-100' },
    { key: 'pulses', label: 'Pulses & Lentils', icon: '🫘', color: 'bg-lime-100' },
    { key: 'condiments', label: 'Sauces & Condiments', icon: '🍯', color: 'bg-teal-100' }
  ];

  // Optimized price ranges for grocery items
  const priceRanges = [
    { key: 'under-50', label: 'Under ₹50', min: 0, max: 50, color: 'bg-green-100' },
    { key: '50-100', label: '₹50 - ₹100', min: 50, max: 100, color: 'bg-blue-100' },
    { key: '100-200', label: '₹100 - ₹200', min: 100, max: 200, color: 'bg-yellow-100' },
    { key: '200-500', label: '₹200 - ₹500', min: 200, max: 500, color: 'bg-orange-100' },
    { key: 'above-500', label: 'Above ₹500', min: 500, max: Infinity, color: 'bg-red-100' }
  ];

  const ratings = [
    { value: 4, label: '4+ Stars', color: 'bg-green-100' },
    { value: 3, label: '3+ Stars', color: 'bg-yellow-100' },
    { value: 2, label: '2+ Stars', color: 'bg-orange-100' }
  ];

  // Filter categories based on search
  const filteredCategories = categories.filter(cat =>
    cat.label.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Calculate active filter counts
  useEffect(() => {
    setFilterCounts({
      categories: filters.category !== 'all' ? 1 : 0,
      priceRanges: filters.priceRanges.length,
      ratings: filters.ratings.length
    });
  }, [filters]);

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Enhanced filter change with animation
  const handleFilterChange = (type: string, value: any, isToggle = false) => {
    const filterId = `${type}-${value}`;
    setAnimatingFilters(prev => [...prev, filterId]);
    
    if (isToggle) {
      toggleArrayFilter(type as any, value);
    } else {
      updateFilter(type as any, value);
    }
    
    setTimeout(() => {
      setAnimatingFilters(prev => prev.filter(id => id !== filterId));
    }, 300);
  };

  // Clear all filters with animation
  const clearAllFilters = () => {
    setAnimatingFilters(['clear-all']);
    updateFilter('category', 'all');
    updateFilter('priceRanges', []);
    updateFilter('ratings', []);
    setTimeout(() => setAnimatingFilters([]), 500);
  };

  const totalActiveFilters = filterCounts.categories + filterCounts.priceRanges + filterCounts.ratings;

  const containerClasses = isMobile 
    ? "w-full bg-white rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm" 
    : "w-72 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-24 border border-gray-100 backdrop-blur-sm";

  // Section Header Component
  const SectionHeader = ({ 
    title, 
    count, 
    section, 
    icon 
  }: { 
    title: string; 
    count: number; 
    section: keyof typeof expandedSections;
    icon: React.ReactNode;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all duration-300 group"
    >
      <div className="flex items-center space-x-3">
        <div className="text-orange-500 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
          {title}
        </h4>
        {count > 0 && (
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            {count}
          </span>
        )}
      </div>
      <div className={`transition-transform duration-300 ${expandedSections[section] ? 'rotate-180' : ''}`}>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
    </button>
  );

  return (
    <div className={containerClasses}>
      {/* Enhanced Header */}
      <div className={`flex items-center justify-between ${isMobile ? 'p-4 pb-2' : 'mb-6'}`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
            <Filter className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Filters</h3>
            {totalActiveFilters > 0 && (
              <p className="text-xs text-gray-500">{totalActiveFilters} active</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {totalActiveFilters > 0 && (
            <button
              onClick={clearAllFilters}
              className="p-2 hover:bg-red-50 rounded-lg transition-all duration-300 group"
              title="Clear all filters"
            >
              <Trash2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform duration-300" />
            </button>
          )}
          
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className={`space-y-4 ${isMobile ? 'p-4 pt-0' : ''}`}>
        {/* Categories Section */}
        <div className="border border-gray-100 rounded-lg overflow-hidden">
          <SectionHeader 
            title="Categories" 
            count={filterCounts.categories}
            section="categories"
            icon={<span className="text-lg">🏪</span>}
          />
          
          <div className={`transition-all duration-500 ease-in-out ${
            expandedSections.categories ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}>
            <div className="p-3 pt-0">
              {/* Category Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {filteredCategories.map((cat, index) => {
                  const isActive = filters.category === cat.key;
                  const isAnimating = animatingFilters.includes(`category-${cat.key}`);
                  
                  return (
                    <label 
                      key={cat.key} 
                      className={`flex items-center cursor-pointer p-3 rounded-lg transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 ${
                        isActive ? 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200' : 'hover:bg-gray-50'
                      } ${isAnimating ? 'scale-105' : 'scale-100'}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name="category"
                          className="sr-only"
                          checked={isActive}
                          onChange={() => handleFilterChange('category', cat.key)}
                        />
                        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                          isActive 
                            ? 'border-orange-500 bg-orange-500' 
                            : 'border-gray-300 hover:border-orange-400'
                        }`}>
                          {isActive && (
                            <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                          )}
                        </div>
                      </div>
                      
                      <div className={`ml-3 p-2 rounded-lg ${cat.color} transition-all duration-300`}>
                        <span className="text-lg">{cat.icon}</span>
                      </div>
                      
                      <span className={`ml-3 text-sm font-medium transition-colors duration-300 ${
                        isActive ? 'text-orange-700' : 'text-gray-700'
                      }`}>
                        {cat.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Price Range Section */}
        <div className="border border-gray-100 rounded-lg overflow-hidden">
          <SectionHeader 
            title="Price Range" 
            count={filterCounts.priceRanges}
            section="priceRanges"
            icon={<span className="text-lg">💰</span>}
          />
          
          <div className={`transition-all duration-500 ease-in-out ${
            expandedSections.priceRanges ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}>
            <div className="p-3 pt-0 space-y-2">
              {priceRanges.map((range, index) => {
                const isActive = filters.priceRanges.includes(range.key);
                const isAnimating = animatingFilters.includes(`priceRanges-${range.key}`);
                
                return (
                  <label 
                    key={range.key} 
                    className={`flex items-center cursor-pointer p-3 rounded-lg transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 ${
                      isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' : 'hover:bg-gray-50'
                    } ${isAnimating ? 'scale-105' : 'scale-100'}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isActive}
                        onChange={() => handleFilterChange('priceRanges', range.key, true)}
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-all duration-300 ${
                        isActive 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300 hover:border-blue-400'
                      }`}>
                        {isActive && (
                          <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                        )}
                      </div>
                    </div>
                    
                    <div className={`ml-3 px-2 py-1 rounded ${range.color}`}>
                      <span className="text-xs font-medium">₹</span>
                    </div>
                    
                    <span className={`ml-3 text-sm font-medium transition-colors duration-300 ${
                      isActive ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {range.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="border border-gray-100 rounded-lg overflow-hidden">
          <SectionHeader 
            title="Customer Rating" 
            count={filterCounts.ratings}
            section="ratings"
            icon={<Star className="w-5 h-5 text-yellow-500 fill-current" />}
          />
          
          <div className={`transition-all duration-500 ease-in-out ${
            expandedSections.ratings ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}>
            <div className="p-3 pt-0 space-y-2">
              {ratings.map((rating, index) => {
                const isActive = filters.ratings.includes(rating.value);
                const isAnimating = animatingFilters.includes(`ratings-${rating.value}`);
                
                return (
                  <label 
                    key={rating.value} 
                    className={`flex items-center cursor-pointer p-3 rounded-lg transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 ${
                      isActive ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'hover:bg-gray-50'
                    } ${isAnimating ? 'scale-105' : 'scale-100'}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isActive}
                        onChange={() => handleFilterChange('ratings', rating.value, true)}
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-all duration-300 ${
                        isActive 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}>
                        {isActive && (
                          <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-3 flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 transition-colors duration-300 ${
                              i < rating.value 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`ml-2 text-sm font-medium transition-colors duration-300 ${
                        isActive ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {rating.label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={clearAllFilters}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                totalActiveFilters > 0 
                  ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } ${animatingFilters.includes('clear-all') ? 'animate-pulse' : ''}`}
              disabled={totalActiveFilters === 0}
            >
              <Trash2 className="w-4 h-4 inline mr-2" />
              Clear All
            </button>
            
            {isMobile && (
              <button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Apply Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff6b35;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e55527;
        }
      `}</style>
    </div>
  );
};

export default SidebarFilters;