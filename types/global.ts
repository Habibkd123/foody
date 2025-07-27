export interface CartLine {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Address {
  label: string;
  lat: number;
  lng: number;
}

export interface OrderPayload {
  address: Address;
  items: CartLine[];
  tip: number;
  note?: string;
}
