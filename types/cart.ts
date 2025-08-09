export interface CartItemRequest {
  product: string; // ObjectId as string
  quantity: number;
}

export interface CartCreateRequest {
  user: string; // ObjectId as string
  items: CartItemRequest[];
}

export interface CartUpdateRequest {
  items?: CartItemRequest[];
}

export interface CartItemResponse {
  _id?: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
    status: string;
  };
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: CartItemResponse[];
  itemCount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartSummaryResponse {
  _id: string;
  user: string;
  itemCount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
}

export interface CartStatsResponse {
  totalCarts: number;
  activeCarts: number;
  abandonedCarts: number;
  totalItemsInCarts: number;
  averageItemsPerCart: number;
  averageCartValue: number;
  topProducts: Array<{
    product: {
      _id: string;
      name: string;
    };
    totalQuantity: number;
    totalCarts: number;
  }>;
}