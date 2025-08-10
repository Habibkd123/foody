export interface CategoryCreateRequest {
  name: string;
  parent?: string; // ObjectId as string
  image?: string;
}

export interface CategoryUpdateRequest {
  name?: string;
  parent?: string | null; // ObjectId as string or null
  image?: string;
}

export interface CategoryResponse {
  _id: string;
  name: string;
  parent?: string | null;
  parentCategory?: {
    _id: string;
    name: string;
  } | null;
  description?: string;
  status?: 'active' | 'inactive';
  image?: string;
  createdAt: string;
  updatedAt: string;
  subcategories?: CategoryResponse[];
  level?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CategoryTreeResponse {
  _id: string;
  name: string;
  image?: string;
  children: CategoryTreeResponse[];
  level: number;
}

export interface CategoryListResponse {
  categories: CategoryResponse[];
  pagination?: {
    total: number;
    pages: number;
    current: number;
    limit: number;
  };
}