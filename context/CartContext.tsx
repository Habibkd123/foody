
"use client";
import React, { useState, createContext, useContext } from 'react';

// Type Definitions
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  images: string[];
  rating: number;
  reviews: Review[];
  totalReviews: number;
  category: string;
  discount: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  stockCount: number;
  brand: string;
  sku: string;
  weight: string;
  dimensions: string;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

interface CartItem extends Product {
  quantity: number;
}


interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
}

// Mock Context
const CartContext = createContext<CartContextType | undefined>(undefined);



const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number): void => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(prev => prev.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems(prev => [...prev, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId: number): void => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};



const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export { CartProvider, useCart };