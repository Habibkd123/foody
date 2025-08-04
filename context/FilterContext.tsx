"use client";
import React, { useState, createContext, useContext, ReactNode } from 'react';
import { Product } from '@/types/global';

// Type Definitions


interface CartItem extends Product {
  quantity: number;
}

interface Category {
  key: string;
  label: string;
  icon: string;
}

interface PriceRange {
  key: string;
  label: string;
  min: number;
  max: number;
}

interface Filters {
  category: string;
  priceRanges: string[];
  ratings: number[];
  searchTerm: string;
}


interface ProviderProps {
  children: ReactNode;
}
interface FilterContextType {
  filters: Filters;
  updateFilter: (key: keyof Filters, value: any) => void;
  toggleArrayFilter: (key: 'priceRanges' | 'ratings', value: string | number) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);
// Filter Provider
const FilterProvider: React.FC<ProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    priceRanges: [],
    ratings: [],
    searchTerm: ''
  });

  const updateFilter = (key: keyof Filters, value: any): void => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'priceRanges' | 'ratings', value: string | number): void => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value as never) 
        ? prev[key].filter((item: string | number) => item !== value)
        : [...prev[key], value as never]
    }));
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilter, toggleArrayFilter }}>
      {children}
    </FilterContext.Provider>
  );
}
// Custom Hooks
const useFilterContext = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};
export { FilterProvider, useFilterContext };

