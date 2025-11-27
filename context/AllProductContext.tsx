"use client";
import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { Product } from '@/types/global';

interface ProductsContextType {
  productsData: Product[];
  setProductsData: React.Dispatch<React.SetStateAction<Product[]>>;
}

interface ProviderProps {
  children: ReactNode;
}

// Create Context
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Custom hook to use ProductsContext
const useProductsContext = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  return context;
};


const ProductsProvider: React.FC<ProviderProps> = ({ children }) => {
  const [productsData, setProductsData] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/auth/products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data?.success && data.data.products) {
        console.log("datadatadatadatadata",data)
        // ✅ If API returns multiple products
        setProductsData(data.data.products);
      } else if (data?.success && data.data.products) {
        // ✅ If API returns single product
        setProductsData([data.data.products]);
      } 
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
  return (
    <ProductsContext.Provider value={{ productsData, setProductsData }}>
      {children}
    </ProductsContext.Provider>
  );
};

export { ProductsContext, useProductsContext, ProductsProvider };