import mongoose, { Schema, model, Types, Document } from 'mongoose';
export enum ProductStatus { ACTIVE = 'active', INACTIVE = 'inactive' }
export type ProductApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Category {
  _id: string;
  name: string;
  parent?: string | null;
  image?: string;
  description?: string;
  status?: 'active' | 'inactive';
  slug?: string;
  type?: "New Arrivals" | "Best Sellers" | "Sweets" | "Snacks" | "Drinks" | "Pantry" | "Groceries" | "Value Packs" | "See All";
  createdAt?: string;
  updatedAt?: string;
  subcategories?: Category[];
}

export interface Product {
  _id: string;
  restaurantId?: string;
  approvalStatus?: ProductApprovalStatus;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  quantity?: number; // if you use quantity instead of stock
  category: Category;
  views?: number;
  inStock?: boolean;
  recipe?: Array<{ item: string; qty: number }>;
  addonGroups?: Array<{
    name: string;
    selectionType: 'single' | 'multiple';
    min?: number;
    max?: number;
    options: Array<{ name: string; price: number; inStock?: boolean }>;
  }>;
  variants?: Array<{
    name: string;
    selectionType: 'single';
    options: Array<{ name: string; price: number; inStock?: boolean }>;
  }>;
  isCombo?: boolean;
  comboItems?: Array<{ product: string; quantity: number }>;
  relatedProducts?: Product[];
  images: string[];
  brand?: string;
  sku?: string;
  weight?: string;
  dimensions?: string;
  tags?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  nutritionalInfo?: Record<string, string>;
  deliveryInfo?: {
    freeDelivery?: boolean;
    estimatedDays?: string;
    expressAvailable?: boolean;
    expressDays?: string;
  };
  warranty?: string;
  warrantyPeriod?: string;
  rating?: number;
  totalReviews?: number;
  status?: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
  reviews?: Review[];
}

export interface Review {
  _id: string;
  product: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}
export interface ProductCreateRequest {
  name: string;
  description?: string;
  images: string[];
  price: number;
  category: string; // ObjectId as string
  stock: number;
  status?: 'active' | 'inactive';
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  images?: string[];
  price?: number;
  category?: string;
  stock?: number;
  status?: 'active' | 'inactive';
}

export interface ProductResponse {
  _id: string;
  id?: string; 
  name: string;
  description?: string;
  images: string[];
  price: number;
  originalPrice?: number;
  category: Category | string;
  stock: number;
  inStock?: boolean;
  status: 'active' | 'inactive';
  brand?: string;
  sku?: string;
  weight?: string;
  dimensions?: string;
  features?: string[];
  specifications?: Record<string, any>;
  nutritionalInfo?: Record<string, any>;
  deliveryInfo?: {
    freeDelivery?: boolean;
    estimatedDays?: string;
    expressAvailable?: boolean;
    expressDays?: string;
  };
  rating?: number;
  totalReviews?: number;
  reviews?: Review[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationData {
  total: number;
  pages: number;
  current: number;
  limit: number;
}

export interface ProductListResponse {
  products: ProductResponse[];
  pagination: PaginationData;
}