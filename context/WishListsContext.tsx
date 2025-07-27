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
import React, { useState, createContext, useContext, ReactNode } from 'react';

// Type Definitions
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  discount: number;
}






interface WishListContextType {
  wishListsData: Product[];
  setWistListsData: React.Dispatch<React.SetStateAction<Product[]>>;
}


interface ProviderProps {
  children: ReactNode;
}

// Create Contexts
const WishListContext = createContext<WishListContextType | undefined>(undefined);



const useWishListContext = (): WishListContextType => {
  const context = useContext(WishListContext);
  if (!context) {
    throw new Error('useWishListContext must be used within a WishListProvider');
  }
  return context;
};

// WishList Provider
const WishListProvider: React.FC<ProviderProps> = ({ children }) => {
  const [wishListsData, setWistListsData] = useState<Product[]>([]);
  
  return (
    <WishListContext.Provider value={{ wishListsData, setWistListsData }}>
      {children}
    </WishListContext.Provider>
  );
};



export { WishListContext, useWishListContext, WishListProvider };