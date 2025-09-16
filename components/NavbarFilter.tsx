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
//         <span className="text-xl font-bold text-gray-800">Menu</span>
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

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { getProductsByNavSearch } from "./APICall/category";
import { useProductsContext } from "@/context/AllProductContext";

type NavItem = {
  label: string;
  icon: string;
  hasDropdown?: boolean;
  dropdownItems?: string[];
};

const navItems: NavItem[] = [
  { label: "New Arrivals", icon: "https://bokksumarket.com/cdn/shop/collections/icon_new_arrival_small.svg?v=1752737439" },
  { label: "Best Sellers", icon: "https://bokksumarket.com/cdn/shop/collections/icon_best_seller_small.svg?v=1752737885" },
  { label: "Sweets", icon: "https://bokksumarket.com/cdn/shop/collections/Sweets_8a86e80d-8a38-4cfd-bbed-0e7b260e4ae6_small.svg?v=1752738009", hasDropdown: true, dropdownItems: ["Kit Kat", "Pocky", "Oreos", "Mochi", "Candy", "Chocolate", "All Sweets"] },
  { label: "Snacks", icon: "https://bokksumarket.com/cdn/shop/collections/Snacks_small.svg?v=1752738169", hasDropdown: true, dropdownItems: ["Rice Crackers", "Senbei", "Chips", "Wasabi Peas", "Seaweed Snacks", "All Snacks"] },
  { label: "Drinks", icon: "https://bokksumarket.com/cdn/shop/collections/Drinks_small.svg?v=1752738381", hasDropdown: true, dropdownItems: ["Ramune", "Matcha", "Green Tea", "Coffee", "Soft Drinks", "All Drinks"] },
  { label: "Pantry", icon: "https://bokksumarket.com/cdn/shop/collections/Pantry_small.svg?v=1752738242", hasDropdown: true, dropdownItems: ["Instant Ramen", "Curry Packs", "Seasonings", "Sauces", "Rice", "Noodles", "All Pantry"] },
  { label: "Groceries", icon: "https://bokksumarket.com/cdn/shop/collections/Pantry_small.svg?v=1752738242", hasDropdown: true, dropdownItems: ["Fresh Produce", "Frozen Foods", "Dairy", "Bread & Bakery", "Eggs", "Tofu", "All Groceries"] },
  { label: "Value Packs", icon: "https://bokksumarket.com/cdn/shop/collections/icon_value_pack_small.svg?v=1752738312" },
  { label: "See All", icon: "https://bokksumarket.com/cdn/shop/collections/Sweets_small.svg?v=1752737283" },
];

const Navbar: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>("New Arrivals"); // ✅ Default selected
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const { setProductsData } = useProductsContext();

  // 🔥 Fetch products whenever selected changes
  useEffect(() => {
    if (!selected) return;

    const getCategoryData = async () => {
      try {
        const payload = {
          type: selected,
          limit: 10,
          page: 1,
          sort: "asc",
        };
        const response = await getProductsByNavSearch(payload);
        console.log("response", response);
        if (response.success) {
          setProductsData(response.products);
        }else{
        setProductsData([])
        }
      } catch (error) {
        console.log(error);
        alert(error)
      }
    };

    getCategoryData();
  }, [selected, setProductsData]);

  return (
    <nav className="bg-[#fdfbf5] sticky top-0 z-50 border-b border-gray-200">
      {/* Mobile toggle */}
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <span className="text-xl font-bold text-gray-800">Menu</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Nav Items */}
      <div
        className={clsx(
          "flex-col md:flex md:flex-row md:items-center md:justify-start md:px-6 md:py-2",
          mobileMenuOpen ? "flex" : "hidden md:flex"
        )}
      >
        <div className="overflow-x-auto flex md:flex-wrap gap-4 md:gap-6 px-4 md:px-0 py-2 md:py-0">
          {navItems.map((item) => {
            const isDropdownOpen = hovered === item.label || mobileDropdownOpen === item.label;
            const toggleMobileDropdown = () =>
              setMobileDropdownOpen((prev) => (prev === item.label ? null : item.label));

            return (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => !isMobile && setHovered(item.label)}
                onMouseLeave={() => !isMobile && setHovered(null)}
              >
                <div
                  className={clsx(
                    "flex items-center gap-1 cursor-pointer px-2 py-1 rounded-md",
                    selected === item.label ? "bg-orange-100 text-orange-600" : "text-black"
                  )}
                  onClick={() => {
                    setSelected(item.label); // ✅ update selection on click
                    if (isMobile && item.hasDropdown) toggleMobileDropdown();
                  }}
                >
                  <Image src={item.icon} alt={item.label} width={24} height={24} />
                  <span className="text-sm font-semibold hover:text-orange-500">
                    {item.label}
                  </span>
                  {item.hasDropdown && (
                    <svg
                      className="w-4 h-4 text-gray-600 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>

                {item.hasDropdown && isDropdownOpen && item.dropdownItems && (
  <div
    className={clsx(
      "bg-white border rounded-md shadow-md md:absolute md:top-full md:left-0 md:w-40",
      isMobile ? "mt-2 w-full" : "py-2"
    )}
  >
    {item.dropdownItems.map((dropItem) => (
      <div
        key={dropItem}
        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        onClick={() => setSelected(dropItem)}
      >
        {dropItem}
      </div>
    ))}
  </div>
)}

              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
