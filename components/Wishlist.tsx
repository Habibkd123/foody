'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

type WishlistItem = {
  id: number;
  title: string;
  image: string;
  price: number;
};

type WishlistProps = {
  items: WishlistItem[];
  onRemove: (id: number) => void;
};

const Wishlist: React.FC<WishlistProps> = ({ items, onRemove }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Wishlist</h2>

      {items.length === 0 ? (
        <p className="text-gray-600 text-center">Your wishlist is empty 😢</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-2">₹{item.price}</p>
                <button
                  onClick={() => onRemove(item.id)}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
