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

// Sample products data
const products: Product[] = [
  {
    id: 1,
    name: 'Premium Organic Red Apples',
    price: 180,
    originalPrice: 220,
    images: [
      'https://picsum.photos/600/600?random=1',
      'https://picsum.photos/600/600?random=2',
      'https://picsum.photos/600/600?random=3',
      'https://picsum.photos/600/600?random=4'
    ],
    rating: 4.5,
    totalReviews: 128,
    category: 'fruits',
    discount: 18,
    description: 'Fresh, crispy, and naturally sweet organic red apples sourced directly from premium orchards. These apples are rich in fiber, vitamins, and antioxidants, making them a perfect healthy snack for the whole family.',
    features: [
      '100% Organic & Natural',
      'Rich in Fiber & Vitamins',
      'Crispy & Fresh',
      'No Artificial Preservatives',
      'Hand-picked Quality'
    ],
    specifications: {
      'Weight': '1 kg',
      'Origin': 'Himachal Pradesh, India',
      'Variety': 'Red Delicious',
      'Shelf Life': '7-10 days',
      'Storage': 'Cool & Dry Place',
      'Organic Certified': 'Yes'
    },
    inStock: true,
    stockCount: 45,
    brand: 'FreshMart Organic',
    sku: 'FMO-APL-001',
    weight: '1 kg',
    dimensions: '15cm x 10cm x 8cm',
    reviews: [
      {
        id: 1,
        userName: 'Priya Sharma',
        rating: 5,
        comment: 'Excellent quality apples! Very fresh and crispy. My family loved them.',
        date: '2 days ago',
        verified: true,
        helpful: 12
      },
      {
        id: 2,
        userName: 'Rajesh Kumar',
        rating: 4,
        comment: 'Good quality but slightly expensive. Worth it for organic produce.',
        date: '1 week ago',
        verified: true,
        helpful: 8
      },
      {
        id: 3,
        userName: 'Anjali Patel',
        rating: 5,
        comment: 'Perfect for my kids lunch boxes. Great taste and quality.',
        date: '2 weeks ago',
        verified: false,
        helpful: 5
      }
    ]
  },
  {
    id: 17,
    name: 'Maggi Masala-ae-Magic Sabzi Masala',
    price: 280,
    originalPrice: 350,
    images: [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/18c2665c-3591-482c-a11a-e35662e756a4.png',
      'https://picsum.photos/600/600?random=17a',
      'https://picsum.photos/600/600?random=17b',
      'https://picsum.photos/600/600?random=17c'
    ],
    rating: 4.6,
    totalReviews: 187,
    category: 'masala',
    discount: 20,
    description: 'Maggi Masala-ae-Magic Sabzi Masala is a perfect blend of aromatic spices that enhances the taste of your vegetables. This magical spice mix transforms ordinary vegetables into extraordinary dishes with its rich flavor and authentic taste.',
    features: [
      'Perfect blend of aromatic spices',
      'Enhances vegetable flavors',
      'No artificial colors',
      'Easy to use',
      'Trusted Maggi quality'
    ],
    specifications: {
      'Weight': '80g',
      'Brand': 'Maggi',
      'Type': 'Vegetable Masala',
      'Shelf Life': '24 months',
      'Storage': 'Cool & Dry Place',
      'Ingredients': 'Coriander, Cumin, Red Chilli, Turmeric'
    },
    inStock: true,
    stockCount: 75,
    brand: 'Maggi',
    sku: 'MGI-SMM-001',
    weight: '80g',
    dimensions: '12cm x 8cm x 3cm',
    reviews: [
      {
        id: 1,
        userName: 'Sunita Devi',
        rating: 5,
        comment: 'Excellent masala! Makes vegetables taste amazing.',
        date: '3 days ago',
        verified: true,
        helpful: 15
      },
      {
        id: 2,
        userName: 'Amit Singh',
        rating: 4,
        comment: 'Good quality spice mix. Value for money.',
        date: '1 week ago',
        verified: true,
        helpful: 8
      }
    ]
  },
  {
    id: 18,
    name: 'Everest Tikhalal Red Chilli Powder',
    price: 54,
    originalPrice: 54,
    images: [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/9dea2d22-108f-4021-aeec-e95b4e271e16.png',
      'https://picsum.photos/600/600?random=18a',
      'https://picsum.photos/600/600?random=18b',
      'https://picsum.photos/600/600?random=18c'
    ],
    rating: 4.6,
    totalReviews: 187,
    category: 'masala',
    discount: 0,
    description: 'Everest Tikhalal Red Chilli Powder brings authentic heat and vibrant color to your dishes. Made from premium quality red chillies, it adds the perfect spice level to your favorite recipes.',
    features: [
      'Made from premium red chillies',
      'Authentic heat and flavor',
      'Rich red color',
      'No artificial additives',
      'Trusted Everest quality'
    ],
    specifications: {
      'Weight': '100g',
      'Brand': 'Everest',
      'Type': 'Red Chilli Powder',
      'Shelf Life': '24 months',
      'Storage': 'Cool & Dry Place',
      'Heat Level': 'Medium to Hot'
    },
    inStock: true,
    stockCount: 92,
    brand: 'Everest',
    sku: 'EVR-RCP-001',
    weight: '100g',
    dimensions: '10cm x 7cm x 3cm',
    reviews: [
      {
        id: 1,
        userName: 'Meera Gupta',
        rating: 5,
        comment: 'Perfect spice level and great color.',
        date: '2 days ago',
        verified: true,
        helpful: 12
      },
      {
        id: 2,
        userName: 'Ravi Kumar',
        rating: 4,
        comment: 'Good quality chilli powder. Reliable brand.',
        date: '5 days ago',
        verified: true,
        helpful: 6
      }
    ]
  }
];

// Products Provider
const ProductsProvider: React.FC<ProviderProps> = ({ children }) => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  
  useEffect(() => {
    setProductsData(products);
  }, []);
  
  return (
    <ProductsContext.Provider value={{ productsData, setProductsData }}>
      {children}
    </ProductsContext.Provider>
  );
};

export { ProductsContext, useProductsContext, ProductsProvider };