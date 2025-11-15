
"use client";

import { createContext, useContext, useReducer, useCallback } from "react";
import type { CartLine, Address } from "@/types/global";

interface State {
  items: CartLine[];
  address?: Address;
  distance?: number;
  deliveryCharge: number;
  handlingCharge: number;
  tip: number;
  donation?: number;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "ADD_ITEM"; item: CartLine }
  | { type: "REMOVE_ITEM"; id: number }
  | { type: "UPDATE_QUANTITY"; id: number; qty: number }
  | { type: "SET_ITEMS"; items: CartLine[] }

  | { type: "SET_ADDRESS"; address?: Address }
  | { type: "SET_TIP"; tip: number }
  | { type: "SET_DISTANCE"; distance: number }
  | { type: "SET_DELIVERY_CHARGE"; deliveryCharge: number }
  | { type: "SET_HANDLING_CHARGE"; handlingCharge: number }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" };

const initial: State = {
  items: [],
  tip: 0,
  deliveryCharge: 0,
  handlingCharge: 0,
  loading: false,
  error: null,
};

// helper for delivery charge
const calcDelivery = (distance: number) => {
  if (distance <= 5) return 20;
  if (distance <= 10) return 50;
  return 100;
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "ADD_ITEM":
      return s.items.find(i => i.id === a.item.id)
        ? {
          ...s,
          items: s.items.map(i =>
            i.id === a.item.id
              ? { ...i, quantity: i.quantity + a.item.quantity }
              : i
          ),
        }
        : { ...s, items: [...s.items, a.item] };

    case "REMOVE_ITEM":
      return { ...s, items: s.items.filter(i => i.id !== a.id) };

    case "UPDATE_QUANTITY":
      return {
        ...s,
        items: s.items.map(i =>
          i.id === a.id ? { ...i, quantity: a.qty } : i
        ),
      };

    case "SET_ITEMS":
      return { ...s, items: a.items };

    case "SET_ADDRESS":
      return { ...s, address: a.address };

    case "SET_DISTANCE":
      return { ...s, distance: a.distance, deliveryCharge: calcDelivery(a.distance) };

    case "SET_DELIVERY_CHARGE":
      return { ...s, deliveryCharge: a.deliveryCharge };

    case "SET_HANDLING_CHARGE":
      return { ...s, handlingCharge: a.handlingCharge };

    case "SET_TIP":
      return { ...s, tip: a.tip };

    case "SET_LOADING":
      return { ...s, loading: a.loading };

    case "SET_ERROR":
      return { ...s, error: a.error };

    case "RESET":
      return initial;

    default:
      return s;
  }
}

interface CartContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  addToCart: (userId: string, item: CartLine) => Promise<void>;
  addAddress: (userId: string, item: Address) => Promise<void>;
  removeFromCart: (userId: string, itemId: number) => Promise<void>;
  updateQuantity: (userId: string, itemId: number, quantity: number) => Promise<void>;
  loadCart: (userId: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
  setDistance: (distance: number) => void;
  getAddresses: (userId: string) => Promise<any[]>;
  deleteAddress: (userId: string, addressId: string) => Promise<void>;
  updateAddress: (userId: string, addressId: string, address: Address) => Promise<any>;
}

const Ctx = createContext<CartContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const apiCall = async (url: string, options: RequestInit) => {
    dispatch({ type: "SET_LOADING", loading: true });
    dispatch({ type: "SET_ERROR", error: null });

    try {
      const response = await fetch(url, {
        ...options,
        headers: { "Content-Type": "application/json", ...options.headers },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      dispatch({ type: "SET_ERROR", error: errorMessage });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  // --- Cart APIs ---
  const loadCart = useCallback(async (userId: string) => {
    try {
      if(!userId){
        return;
      }
      const data = await apiCall(`/api/carts/user/${userId}`, { method: "GET" });
      if (data.success && data.data) {
        const cartItems: CartLine[] = data.data.items.map((item: any) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item?.product?.images?.[0] || "",
        }));
        dispatch({ type: "SET_ITEMS", items: cartItems });
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      throw error; // Re-throw to allow error handling by the caller
    }
  }, []);

  const addToCart = useCallback(async (userId: string, item: CartLine) => {
    try {
      if(!userId){
        return;
      }
      const data = await apiCall(`/api/carts/user/${userId}`, {
        method: "POST",
        body: JSON.stringify({ productId: item.id, quantity: item.quantity }),
      });
      if (data.success) dispatch({ type: "ADD_ITEM", item });
      console.log("data", data)
      return data;
    } catch (error) {
      console.error("Failed to add item:", error);
      return error;
    }
  }, []);

  const removeFromCart = useCallback(async (userId: string, itemId: number) => {
    try {
      if(!userId){
        return;
      }
      await apiCall(`/api/carts/user/${userId}?productId=${itemId}`, { method: "DELETE" });
      dispatch({ type: "REMOVE_ITEM", id: itemId });
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  }, []);

  const updateQuantity = useCallback(
    async (userId: string, itemId: number, quantity: number) => {
      try {
        if (quantity <= 0) {
          await removeFromCart(userId, itemId);
          return;
        }

        const data = await apiCall(`/api/carts/user/${userId}`, {
          method: "PUT",
          body: JSON.stringify({ productId: itemId, quantity }),
        });

        if (data.success) { 
          dispatch({ type: "UPDATE_QUANTITY", id: itemId, qty: quantity }) 
        } else {
          alert(data.message);
        };
        console.log("data", data)
        return data;
      } catch (error:any) {
        console.error("Failed to update quantity:", error);
        alert(error.message);
        return error.message;
      }
    },
    [removeFromCart]
  );

  const clearCart = useCallback(async (userId: string) => {
    try {
      if(!userId){
        return;
      }
      await apiCall(`/api/carts/user/${userId}`, { method: "DELETE" });
      dispatch({ type: "SET_ITEMS", items: [] });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }, []);

  // --- Address APIs ---
  const addAddress = useCallback(async (userId: string, address: Address) => {
    try {
      if(!userId){
        return;
      }
      console.log("Adding address:", userId);
      address.userId = userId;
      const data = await apiCall(`/api/users/${userId}/addresses`, {
        method: "POST",
        body: JSON.stringify(address),
      });
      if (data.success) dispatch({ type: "SET_ADDRESS", address: data.address });
    } catch (error) {
      console.error("Failed to add address:", error);
    }
  }, []);

  const getAddresses = useCallback(async (userId: string) => {
    try {
      if(!userId){
        return [] as any[];
      }
      const data = await apiCall(`/api/users/${userId}/addresses`, { method: "GET" });
      console.log("Addresses data:", data);
      if (data.success) {
        const addrs = Array.isArray(data.addresses) ? data.addresses : [];
        const preferred = addrs.find((a: any) => a?.isDefault) || addrs[0] || undefined;
        dispatch({ type: "SET_ADDRESS", address: preferred });
        return addrs;
      }
      return [] as any[];
    } catch (error) {
      console.error("Failed to get addresses:", error);
      return [] as any[];
    }
  }, []);

  const deleteAddress = useCallback(async (userId: string, addressId: string) => {
    try {
      if(!userId){
        return;
      }
      const response = await fetch(`/api/users/${userId}/addresses`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: addressId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete address');
      }

      // After successful deletion, refetch the addresses to update the UI
      await getAddresses(userId);
      return data;
    } catch (error) {
      console.error("Failed to delete address:", error);
      throw error; // Re-throw to allow handling in the component
    }
  }, [getAddresses]);

  const updateAddress = useCallback(async (userId: string, addressId: string, address: Address) => {

    try {
      if(!userId){
        return undefined as any;
      }
      address._id = addressId;
      const data = await apiCall(`/api/users/${userId}/addresses`, {
        method: "PUT",
        body: JSON.stringify(address),
      });
      if (data.success) {
        dispatch({ type: "SET_ADDRESS", address: data.address });
        return data.address;
      }
      return undefined as any;
    } catch (error) {
      console.error("Failed to update address:", error);
      return undefined as any;
    }
  }, []);

  const setDistance = useCallback((distance: number) => {
    dispatch({ type: "SET_DISTANCE", distance });
  }, []);

  const contextValue: CartContextType = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateQuantity,
    loadCart,
    clearCart,
    addAddress,
    getAddresses,
    deleteAddress,
    updateAddress,
    setDistance,
  };

  return <Ctx.Provider value={contextValue}>{children}</Ctx.Provider>;
}

export function useOrder() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("OrderProvider missing");
  return ctx;
}

export function useCartOrder() {
  const { state, addToCart, removeFromCart, updateQuantity, loadCart, clearCart, addAddress, getAddresses, deleteAddress, updateAddress, setDistance } = useOrder();

  const finalTotal =
    state.items.reduce((sum, i) => sum + i.price * i.quantity, 0) +
    state.deliveryCharge +
    state.handlingCharge +
    state.tip;

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    totalItems: state.items.reduce((sum, i) => sum + i.quantity, 0),
    totalAmount: state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    deliveryCharge: state.deliveryCharge,
    handlingCharge: state.handlingCharge,
    tip: state.tip,
    distance: state.distance,
    address: state.address,
    finalTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    loadCart,
    clearCart,
    addAddress,
    getAddresses,
    deleteAddress,
    updateAddress,
    setDistance,
  };
}
