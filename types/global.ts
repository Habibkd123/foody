export interface Product {
  id: number | string;
  _id?: string;
  name: string;
  price: number;
  originalPrice: number;
  images: string[];
  rating: number;
  totalReviews: number;
  category: string;
  discount: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  inStock?: boolean;
  stockCount?: number;
  quantity?: number;
  brand?: string;
  sku?: string;
  weight?: string;
  dimensions?: string;
  reviews?: Review[];
  createdAt?: string;
  relatedProducts?: Product[];
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
export interface UserWishList {
  products: Product[];
  _id: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Product {
  quantity: number;
  productId?: string;
  configKey?: string;
  image?: string;
  variant?: { name: string; option: string };
  addons?: Array<{ group: string; option: string }>;
}

export type CartLine = CartItem;

export interface Address {
  address?: string;
  userId: string;
  label: string;
  street: string;
  lat: number;
  lng: number;
  flatNumber: string,
  floor: string,
  area: string,
  landmark: string,
  name: string,
  phone: number,
  city: string,
  state: string,
  zipCode: string,
  isDefault?: boolean;
  _id?: string;
}

export interface OrderPayload {
  address: Address;
  items: CartLine[];
  tip: number;
  note?: string;
}
