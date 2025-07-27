'use client';
import React, { useState } from 'react';
import Image from 'next/image';

type NavItem = {
  label: string;
  icon: string;
  hasDropdown?: boolean;
  dropdownItems?: string[];
};

const navItems: NavItem[] = [
  {
    label: 'New Arrivals',
    icon: 'https://bokksumarket.com/cdn/shop/collections/icon_new_arrival_small.svg?v=1752737439',
  },
  {
    label: 'Best Sellers',
    icon: 'https://bokksumarket.com/cdn/shop/collections/icon_best_seller_small.svg?v=1752737885',
  },
  {
    label: 'Bokksu Originals',
    icon: 'https://bokksumarket.com/cdn/shop/collections/icon_exclusive_small.svg?v=1752737950',
  },
  {
    label: 'Sweets',
    icon: 'https://bokksumarket.com/cdn/shop/collections/Sweets_8a86e80d-8a38-4cfd-bbed-0e7b260e4ae6_small.svg?v=1752738009',
    hasDropdown: true,
    dropdownItems: [
      'Kit Kat',
      'Pocky',
      'Oreos',
      'Mochi',
      'Candy',
      'Chocolate',
      'All Sweets',
    ],
  },
  {
    label: 'Snacks',
    icon: 'https://bokksumarket.com/cdn/shop/collections/Snacks_small.svg?v=1752738169',
    hasDropdown: true,
    dropdownItems: [
      'Rice Crackers',
      'Senbei',
      'Chips',
      'Wasabi Peas',
      'Seaweed Snacks',
      'All Snacks',
    ],
  },
  {
    label: 'Drinks',
    icon: 'https://bokksumarket.com/cdn/shop/collections/Drinks_small.svg?v=1752738381',
    hasDropdown: true,
    dropdownItems: [
      'Ramune',
      'Matcha',
      'Green Tea',
      'Coffee',
      'Soft Drinks',
      'All Drinks',
    ],
  },
  {
    label: 'Pantry',
    icon: 'https://bokksumarket.com/cdn/shop/collections/Pantry_small.svg?v=1752738242',
    hasDropdown: true,
    dropdownItems: [
      'Instant Ramen',
      'Curry Packs',
      'Seasonings',
      'Sauces',
      'Rice',
      'Noodles',
      'All Pantry',
    ],
  },
  {
    label: 'Groceries', // 🔥 New Dropdown
    icon: 'https://bokksumarket.com/cdn/shop/collections/Pantry_small.svg?v=1752738242', // reused pantry icon — change if needed
    hasDropdown: true,
    dropdownItems: [
      'Fresh Produce',
      'Frozen Foods',
      'Dairy',
      'Bread & Bakery',
      'Eggs',
      'Tofu',
      'All Groceries',
    ],
  },
  {
    label: 'Value Packs',
    icon: 'https://bokksumarket.com/cdn/shop/collections/icon_value_pack_small.svg?v=1752738312',
  },
  {
    label: 'Gachapon',
    icon: 'https://bokksumarket.com/cdn/shop/collections/Sweets_small.svg?v=1752737283',
  },

  {
    label: 'See All',
    icon: 'https://bokksumarket.com/cdn/shop/collections/Sweets_small.svg?v=1752737283',
  },
];

const Navbar: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav className="flex gap-3 items-center px-4 py-2 bg-[#fdfbf5] relative z-50 mx-auto">
      {navItems.map((item) => (
        <div
          key={item.label}
          className="relative group"
          onMouseEnter={() => setHovered(item.label)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex flex-row gap-1 items-center cursor-pointer ">
            <Image src={item.icon} color='#fbbf24' alt={item.label} width={30} height={30} />
            <span className="text-sm text-black group-hover:text-orange font-semibold hover:text-orange-500 ">{item.label}</span>
            {item.hasDropdown && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-black group-hover:text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>

          {/* Dropdown */}
          {item.hasDropdown && hovered === item.label && item.dropdownItems && (
            <div className="absolute left-0 mt-2 bg-white shadow-md border rounded w-40 py-2 z-50">
              {item.dropdownItems.map((dropItem) => (
                <div
                  key={dropItem}
                  className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm cursor-pointer"
                >
                  {dropItem}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Navbar;
