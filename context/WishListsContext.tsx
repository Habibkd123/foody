// "use client";
// import React, { createContext, useState, ReactNode } from 'react';

// interface ContextState {
//     wishListsData: string;
//     setWistListsData: (wishListsData: string) => void;
// }

// const WishListContext = createContext<ContextState | undefined>(undefined);

// const WishListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//     const [wishListsData, setWistListsData] = useState<any>([]);

//     return (
//         <WishListContext.Provider value={{ wishListsData, setWistListsData }}>
//             {children}
//         </WishListContext.Provider>
//     );
// };

// export { WishListContext, WishListProvider };



"use client";
import React, { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { Product, UserWishList } from "@/types/global";
import {
  getUserWishList as apiGetUserWishList,
  addWishList as apiAddWishList,
  removeWishList as apiRemoveWishList,
} from "@/components/APICall/wishlist";

interface WishListContextType {
  wishListsData: Product[];
  setWistListsData: React.Dispatch<React.SetStateAction<Product[]>>;
  addWishList: (userId: string, productId: string) => Promise<void>;
  removeWishList: (userId: string, productId: string) => Promise<void>;
  getUserWishList: (userId: string) => Promise<void>;
}

interface ProviderProps {
  children: ReactNode;
}

// Context
const WishListContext = createContext<WishListContextType | undefined>(
  undefined
);

const useWishListContext = (): WishListContextType => {
  const context = useContext(WishListContext);
  if (!context) {
    throw new Error("useWishListContext must be used within a WishListProvider");
  }
  return context;
};

const WishListProvider: React.FC<ProviderProps> = ({ children }) => {
  const [wishListsData, setWistListsData] = useState<Product[]>([]);

  const getUserWishList = async (userId: string) => {
    try {
      const response = await apiGetUserWishList({userId});
      if(response.success){
        console.log("response", response)
        setWistListsData(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching wishlists:", error);
    }
  };

 

  const addWishList = async (userId: string, productId: string) => {
    if (!userId) {
      alert("Please login to add to wishlist");
      
      return;
    }
    if (!productId) {
      alert("Please select a product to add to wishlist");
      return;
    }
  
    try {
      const response = await apiAddWishList(userId, productId);
  
      // Update full wishlist with populated products
      setWistListsData(response.data.products || []);
    } catch (error) {
      console.error("Error adding wishlist:", error);
    }
  };
  

  const removeWishList = async (userId: string, productId: string) => {
    if (!userId) {
      alert("Please login to remove from wishlist");
      return;
    }
    if (!productId) {
      alert("Please select a product to remove from wishlist");
      return;
    }
  
    try {
      const response = await apiRemoveWishList(userId, productId);
  
      // Update wishlist with populated products from backend
      setWistListsData(response.data.products || []);
    } catch (error) {
      console.error("Error removing wishlist:", error);
    }
  };
  
  return (
    <WishListContext.Provider
      value={{
        wishListsData,
        setWistListsData,
        addWishList,
        removeWishList,
        getUserWishList,
      }}
    >
      {children}
    </WishListContext.Provider>
  );
};

export { WishListContext, useWishListContext, WishListProvider };
