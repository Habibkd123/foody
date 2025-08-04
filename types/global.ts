export interface Product {
  id: number;
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
  brand?: string;
  sku?: string;
  weight?: string;
  dimensions?: string;
  reviews?: Review[];
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


export interface CartItem extends Product {
  quantity: number;
}

export type CartLine = CartItem;

export interface Address {
  label: string;
  street: string;
  lat: number;
  lng: number;
   flatNumber: string,
  floor: string,
  area: string,
  landmark: string,
  name: string,
  phone: number
}

export interface OrderPayload {
  address: Address;
  items: CartLine[];
  tip: number;
  note?: string;
}
