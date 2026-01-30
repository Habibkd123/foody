// 'use client';
// import React, { useState } from 'react';
// import Image from 'next/image';

// type NavItem = {
//   label: string;
//   icon: string;
//   hasDropdown?: boolean;
//   dropdownItems?: string[];
// };

// const navItems: NavItem[] = [
//   {
//     label: 'New Arrivals',
//     icon: 'https://bokksumarket.com/cdn/shop/collections/icon_new_arrival_small.svg?v=1752737439',
//   },
//   {
//     label: 'Best Sellers',
//     icon: 'https://bokksumarket.com/cdn/shop/collections/icon_best_seller_small.svg?v=1752737885',
//   },
//   {
//     label: 'Bokksu Originals',
//     icon: 'https://bokksumarket.com/cdn/shop/collections/icon_exclusive_small.svg?v=1752737950',
//   },
//   {
//     label: 'Sweets',
//     icon: 'https://bokksumarket.com/cdn/shop/collections/Sweets_8a86e80d-8a38-4cfd-bbed-0e7b260e4ae6_small.svg?v=1752738009',
//     hasDropdown: true,
//     dropdownItems: [
//       'Kit Kat',
//       'Pocky',
//       'Oreos',
//       'Mochi',
//       'Candy',
//       'Chocolate',
//       'All Sweets',
//     ],
//   },
//   {
//     label: 'Snacks',
//     icon: 'https://bokksumarket.com/cdn/shop/collections/Snacks_small.svg?v=1752738169',
//     hasDropdown: true,
//     dropdownItems: [
//       'Rice Crackers',
//       'Senbei',
//       'Chips',
//       'Wasabi Peas',
//       'Seaweed Snacks',
//       'All Snacks',
//     ],
//   },
//   {
//     label: 'Drinks',
//     icon: 'https://bokksumarket.com/cdn/shop/collections/Drinks_small.svg?v=1752738381',
//     hasDropdown: true,
//     dropdownItems: [
//       'Ramune',
//       'Matcha',
//       'Green Tea',
//       'Coffee',
//       'Soft Drinks',
//       'All Drinks',
//     ],
//   },
//   {
//     label: 'Pantry',
//     icon: 'https://bokksumarket.com/cdn/shop/collections/Pantry_small.svg?v=1752738242',
//     hasDropdown: true,
//     dropdownItems: [
//       'Instant Ramen',
//       'Curry Packs',
//       'Seasonings',
//       'Sauces',
//       'Rice',
//       'Noodles',
//       'All Pantry',
//     ],
//   },
//   {
//     label: 'Groceries', // 🔥 New Dropdown
//     icon: 'https://bokksumarket.com/cdn/shop/collections/Pantry_small.svg?v=1752738242', // reused pantry icon — change if needed
//     hasDropdown: true,
//     dropdownItems: [
//       'Fresh Produce',
//       'Frozen Foods',
//       'Dairy',
//       'Bread & Bakery',
//       'Eggs',
//       'Tofu',
//       'All Groceries',
//     ],
//   },
//   {
//     label: 'Value Packs',
//     icon: 'https://bokksumarket.com/cdn/shop/collections/icon_value_pack_small.svg?v=1752738312',
//   },
//   {
//     label: 'Gachapon',
//     icon: 'https://bokksumarket.com/cdn/shop/collections/Sweets_small.svg?v=1752737283',
//   },

//   {
//     label: 'See All',
//     icon: 'https://bokksumarket.com/cdn/shop/collections/Sweets_small.svg?v=1752737283',
//   },
// ];

// const Navbar: React.FC = () => {
//   const [hovered, setHovered] = useState<string | null>(null);

//   return (
//     <nav className="flex gap-3 items-center px-4 py-2 bg-[#fdfbf5] relative z-50 mx-auto">
//       {navItems.map((item) => (
//         <div
//           key={item.label}
//           className="relative group"
//           onMouseEnter={() => setHovered(item.label)}
//           onMouseLeave={() => setHovered(null)}
//         >
//           <div className="flex flex-row gap-1 items-center cursor-pointer ">
//             <Image src={item.icon} color='#fbbf24' alt={item.label} width={30} height={30} />
//             <span className="text-sm text-black group-hover:text-orange font-semibold hover:text-orange-500 ">{item.label}</span>
//             {item.hasDropdown && (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-4 h-4 text-black group-hover:text-orange-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             )}
//           </div>

//           {/* Dropdown */}
//           {item.hasDropdown && hovered === item.label && item.dropdownItems && (
//             <div className="absolute left-0 mt-2 bg-white shadow-md border rounded w-40 py-2 z-50">
//               {item.dropdownItems.map((dropItem) => (
//                 <div
//                   key={dropItem}
//                   className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm cursor-pointer"
//                 >
//                   {dropItem}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </nav>
//   );
// };

// export default Navbar;


// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { Menu, X } from "lucide-react";
// import clsx from "clsx";
// import { getProductsByNavSearch } from "./APICall/category";
// import { ProductsContext, useProductsContext } from "@/context/AllProductContext";

// type NavItem = {
//   label: string;
//   icon: string;
//   hasDropdown?: boolean;
//   dropdownItems?: string[];
// };

// const navItems: NavItem[] = [
//   {
//     label: "New Arrivals",
//     icon: "https://bokksumarket.com/cdn/shop/collections/icon_new_arrival_small.svg?v=1752737439",
//   },
//   {
//     label: "Best Sellers",
//     icon: "https://bokksumarket.com/cdn/shop/collections/icon_best_seller_small.svg?v=1752737885",
//   },
//   {
//     label: "Bokksu Originals",
//     icon: "https://bokksumarket.com/cdn/shop/collections/icon_exclusive_small.svg?v=1752737950",
//   },
//   {
//     label: "Sweets",
//     icon: "https://bokksumarket.com/cdn/shop/collections/Sweets_8a86e80d-8a38-4cfd-bbed-0e7b260e4ae6_small.svg?v=1752738009",
//     hasDropdown: true,
//     dropdownItems: ["Kit Kat", "Pocky", "Oreos", "Mochi", "Candy", "Chocolate", "All Sweets"],
//   },
//   {
//     label: "Snacks",
//     icon: "https://bokksumarket.com/cdn/shop/collections/Snacks_small.svg?v=1752738169",
//     hasDropdown: true,
//     dropdownItems: ["Rice Crackers", "Senbei", "Chips", "Wasabi Peas", "Seaweed Snacks", "All Snacks"],
//   },
//   {
//     label: "Drinks",
//     icon: "https://bokksumarket.com/cdn/shop/collections/Drinks_small.svg?v=1752738381",
//     hasDropdown: true,
//     dropdownItems: ["Ramune", "Matcha", "Green Tea", "Coffee", "Soft Drinks", "All Drinks"],
//   },
//   {
//     label: "Pantry",
//     icon: "https://bokksumarket.com/cdn/shop/collections/Pantry_small.svg?v=1752738242",
//     hasDropdown: true,
//     dropdownItems: ["Instant Ramen", "Curry Packs", "Seasonings", "Sauces", "Rice", "Noodles", "All Pantry"],
//   },
//   {
//     label: "Groceries",
//     icon: "https://bokksumarket.com/cdn/shop/collections/Pantry_small.svg?v=1752738242",
//     hasDropdown: true,
//     dropdownItems: ["Fresh Produce", "Frozen Foods", "Dairy", "Bread & Bakery", "Eggs", "Tofu", "All Groceries"],
//   },
//   {
//     label: "Value Packs",
//     icon: "https://bokksumarket.com/cdn/shop/collections/icon_value_pack_small.svg?v=1752738312",
//   },
//   // {
//   //   label: "Gachapon",
//   //   icon: "https://bokksumarket.com/cdn/shop/collections/Sweets_small.svg?v=1752737283",
//   // },
//   {
//     label: "See All",
//     icon: "https://bokksumarket.com/cdn/shop/collections/Sweets_small.svg?v=1752737283",
//   },
// ];

// const Navbar: React.FC = () => {
//   const [hovered, setHovered] = useState<string | null>(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
//   const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
// const {setProductsData }=useProductsContext()
// useEffect(()=>{
//   const getCategoryData=async()=>{
//     try {
//       let payload={
//         search: hovered,
//         limit:10,
//         page:1,
//         sort:"asc"
//       }
//       const response=await getProductsByNavSearch(payload)
//       console.log("response",response)
//       if(response.success){
//         setProductsData(response.data.products)
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   getCategoryData()
// },[hovered])
//   return (
//     <nav className="bg-[#fdfbf5] sticky top-0 z-50 border-b border-gray-200">
//       {/* Mobile toggle */}
//       <div className="flex items-center justify-between px-4 py-3 md:hidden">
//         <span className="text-xl font-bold text-foreground">Menu</span>
//         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//           {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>
//       </div>

//       {/* Nav Items */}
//       <div
//         className={clsx(
//           "flex-col md:flex md:flex-row md:items-center md:justify-start md:px-6 md:py-2",
//           mobileMenuOpen ? "flex" : "hidden md:flex"
//         )}
//       >
//         <div className="overflow-x-auto flex md:flex-wrap gap-4 md:gap-6 px-4 md:px-0 py-2 md:py-0">
//           {navItems.map((item) => {
//             const isDropdownOpen = hovered === item.label || mobileDropdownOpen === item.label;
//             const toggleMobileDropdown = () =>
//               setMobileDropdownOpen((prev) => (prev === item.label ? null : item.label));

//             return (
//               <div
//                 key={item.label}
//                 className="relative group"
//                 onMouseEnter={() => !isMobile && setHovered(item.label)}
//                 onMouseLeave={() => !isMobile && setHovered(null)}
//               >
//                 <div
//                   className="flex items-center gap-1 cursor-pointer"
//                   onClick={() => isMobile && item.hasDropdown && toggleMobileDropdown()}
//                 >
//                   <Image src={item.icon} alt={item.label} width={24} height={24} />
//                   <span className="text-sm font-semibold text-black hover:text-orange-500">
//                     {item.label}
//                   </span>
//                   {item.hasDropdown && (
//                     <svg
//                       className="w-4 h-4 text-gray-600 ml-1"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   )}
//                 </div>

//                 {item.hasDropdown && isDropdownOpen && item.dropdownItems && (
//                   <div className="absolute left-0 mt-2 bg-white shadow-md border rounded-md w-40 py-2 z-50 md:group-hover:block md:absolute md:top-full">
//                     {item.dropdownItems.map((dropItem) => (
//                       <div
//                         key={dropItem}
//                         className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
//                       >
//                         {dropItem}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Sparkles, Trophy, Candy, Popcorn, Coffee,
  UtensilsCrossed, Package, LayoutGrid, ChevronDown,
  ArrowRight, Search, Zap, Star, Flame
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore } from "@/lib/store/useProductStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  image?: string;
  subcategories?: Category[];
}

const iconMap: Record<string, React.ReactNode> = {
  "New Arrivals": <Sparkles className="w-4 h-4" />,
  "Best Sellers": <Trophy className="w-4 h-4" />,
  "Sweets": <Candy className="w-4 h-4" />,
  "Snacks": <Popcorn className="w-4 h-4" />,
  "Drinks": <Coffee className="w-4 h-4" />,
  "Pantry": <UtensilsCrossed className="w-4 h-4" />,
  "Groceries": <Package className="w-4 h-4" />,
  "Value Packs": <Zap className="w-4 h-4" />,
  "See All": <LayoutGrid className="w-4 h-4" />,
  "Trending": <Flame className="w-4 h-4" />,
  "Featured": <Star className="w-4 h-4" />,
};

const NavbarFilter: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [subCategories, setSubCategories] = useState<Record<string, Category[]>>({});
  const menuRef = useRef<HTMLDivElement>(null);

  const { setProductsData } = useProductStore();

  useEffect(() => {
    const fetchRootCategories = async () => {
      try {
        const response = await fetch('/api/categories?parent=null&limit=20');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRootCategories();
  }, []);

  const fetchSubCategories = async (parentId: string) => {
    if (subCategories[parentId]) return;
    try {
      const response = await fetch(`/api/categories?parent=${parentId}&limit=10`);
      const data = await response.json();
      if (data.success) {
        setSubCategories(prev => ({ ...prev, [parentId]: data.data.categories }));
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const router = useRouter();

  const handleCategoryClick = (catId: string, catName: string) => {
    setActiveCategory(catId);
    router.push(`/productlist?category=${catId}`);
  };


  return (
    <div className="relative w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800" ref={menuRef}>
      <div className="max-w-12xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3">
          {loading ? (
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-10 w-28 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <>
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="relative group"
                  onMouseEnter={() => {
                    setHoveredCategory(cat._id);
                    fetchSubCategories(cat._id);
                  }}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <button
                    onClick={() => handleCategoryClick(cat._id, cat.name)}
                    className={clsx(
                      "flex items-center gap-2.5 px-6 py-2.5 rounded-2xl transition-all duration-300 whitespace-nowrap text-sm font-bold border-2",
                      activeCategory === cat._id || hoveredCategory === cat._id
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.05]"
                        : "bg-gray-50 dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-400 hover:border-primary/30 hover:text-primary"
                    )}
                  >
                    <span className={clsx(
                      "transition-transform",
                      activeCategory === cat._id || hoveredCategory === cat._id ? "text-white" : "text-primary"
                    )}>
                      {iconMap[cat.name] || <Package className="w-4 h-4" />}
                    </span>
                    {cat.name}
                  </button>

                  {/* Hover Sub-Category Strip */}
                  <AnimatePresence>
                    {hoveredCategory === cat._id && subCategories[cat._id] && subCategories[cat._id].length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed md:absolute top-[100%] left-4 md:left-0 right-4 md:right-auto mt-2 z-[9999] min-w-max bg-white dark:bg-gray-800 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-gray-700 p-3"
                      >
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[80vw] md:max-w-xl">
                          <div className="flex-shrink-0 px-3 py-1.5 border-r border-gray-100 dark:border-gray-700 mr-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Sub Collections</p>
                            <p className="text-xs font-bold text-gray-900 dark:text-white mt-1">{cat.name}</p>
                          </div>
                          {subCategories[cat._id].map((sub) => (
                            <Link
                              key={sub._id}
                              href={`/productlist?category=${sub._id}`}
                              className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-primary hover:text-white text-xs font-bold text-gray-600 dark:text-gray-300 transition-all whitespace-nowrap shadow-sm hover:shadow-primary/30"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                        {/* Arrow Tip */}
                        <div className="absolute -top-1.5 left-10 w-3 h-3 bg-white dark:bg-gray-800 rotate-45 border-t border-l border-gray-100 dark:border-gray-700 md:block hidden" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};



export default NavbarFilter;

