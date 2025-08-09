import mongoose, { Schema, model, Types, Document } from 'mongoose';
export enum ProductStatus { ACTIVE = 'active', INACTIVE = 'inactive' }

export interface IProduct extends Document {
  name: string;
  description?: string;
  images: string[];
  price: number;
  category: Types.ObjectId; // Reference to subcategory
  stock: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
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
  name: string;
  description?: string;
  images: string[];
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
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