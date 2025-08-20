// "use client";

// import { createContext, useContext, useReducer } from "react";
// import type { CartLine, Address } from "@/types/global";

// interface State {
//   items: CartLine[];
//   address?: Address;
//   distance?: number;
//   deliveryCharge: number;
//   handlingCharge: number;
//   tip: number;
//   donation?: number;
// }

// type Action =
//   | { type: "ADD"; item: CartLine }
//   | { type: "REMOVE"; id: number }
//   | { type: "QTY"; id: number; qty: number }
//   | { type: "SET_ADDRESS"; address: Address }
//   | { type: "SET_TIP"; tip: number }
//   | { type: "SET_DISTANCE"; distance: number }
//   | { type: "SET_DELIVERY_CHARGE"; deliveryCharge: number }
//   | { type: "SET_HANDLING_CHARGE"; handlingCharge: number }
//   | { type: "RESET" };

// const initial: State = {
//   items: [],
//   tip: 0,
//   deliveryCharge: 0,
//   handlingCharge: 0,
// };

// function reducer(s: State, a: Action): State {
//   switch (a.type) {
//     case "ADD":
//       return s.items.find(i => i.id === a.item.id)
//         ? {
//             ...s,
//             items: s.items.map(i =>
//               i.id === a.item.id
//                 ? { ...i, quantity: i.quantity + a.item.quantity }
//                 : i
//             ),
//           }
//         : { ...s, items: [...s.items, a.item] };

//     case "REMOVE":
//       return { ...s, items: s.items.filter(i => i.id !== a.id) };

//     case "QTY":
//       return {
//         ...s,
//         items: s.items.map(i =>
//           i.id === a.id ? { ...i, quantity: a.qty } : i
//         ),
//       };

//     case "SET_ADDRESS":
//       return { ...s, address: a.address };

//     case "SET_DISTANCE":
//       return { ...s, distance: a.distance };

//     case "SET_DELIVERY_CHARGE":
//       return { ...s, deliveryCharge: a.deliveryCharge };

//     case "SET_HANDLING_CHARGE":
//       return { ...s, handlingCharge: a.handlingCharge };

//     case "SET_TIP":
//       return { ...s, tip: a.tip };

//     case "RESET":
//       return initial;

//     default:
//       return s;
//   }
// }

// const Ctx = createContext<{
//   state: State;
//   dispatch: React.Dispatch<Action>;
// } | undefined>(undefined);

// export function OrderProvider({ children }: { children: React.ReactNode }) {
//   const [state, dispatch] = useReducer(reducer, initial);
//   return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
// }

// export function useOrder() {
//   const ctx = useContext(Ctx);
//   if (!ctx) throw new Error("OrderProvider missing");
//   return ctx;
// }




"use client";

import { createContext, useContext, useReducer, useCallback, useEffect } from "react";
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
  | { type: "SET_ADDRESS"; address: Address }
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

// Pure reducer function (no async operations)
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
      return { ...s, distance: a.distance };

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
  // API methods
  addToCart: (userId: string, item: CartLine) => Promise<void>;
  removeFromCart: (userId: string, itemId: number) => Promise<void>;
  updateQuantity: (userId: string, itemId: number, quantity: number) => Promise<void>;
  loadCart: (userId: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
}

const Ctx = createContext<CartContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  // API helper function
  const apiCall = async (url: string, options: RequestInit) => {
    dispatch({ type: "SET_LOADING", loading: true });
    dispatch({ type: "SET_ERROR", error: null });

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: "SET_ERROR", error: errorMessage });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  // Load cart from API
  const loadCart = useCallback(async (userId: string) => {
    try {
      const data = await apiCall(`/api/carts/user/${userId}`, {
        method: 'GET',
      });

      if (data.success && data.data) {
        // Transform API data to match your CartLine interface
        const cartItems: CartLine[] = data.data.items.map((item: any) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images?.[0] || '',
          // Add other properties as needed
        }));

        dispatch({ type: "SET_ITEMS", items: cartItems });
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }, []);

  // Add item to cart
  const addToCart = useCallback(async (userId: string, item: CartLine) => {
    try {
      const data = await apiCall(`/api/carts/user/${userId}`, {
        method: 'POST',
        body: JSON.stringify({
          productId: item.id,
          quantity: item.quantity,
        }),
      });

      if (data.success) {
        // Optimistically update local state
        dispatch({ type: "ADD_ITEM", item });
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      // Optionally revert optimistic update or show error to user
    }
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback(async (userId: string, itemId: number) => {
    try {
      await apiCall(`/api/carts/user/${userId}?productId=${itemId}`, {
        method: 'DELETE',
      });

      // Update local state after successful API call
      dispatch({ type: "REMOVE_ITEM", id: itemId });
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  }, []);

  // Update item quantity
  const updateQuantity = useCallback(async (userId: string, itemId: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(userId, itemId);
        return;
      }

      const data = await apiCall(`/api/carts/user/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({
          productId: itemId,
          quantity: quantity,
        }),
      });

      if (data.success) {
        dispatch({ type: "UPDATE_QUANTITY", id: itemId, qty: quantity });
      }
    } catch (error) {
      console.error('Failed to update cart item quantity:', error);
    }
  }, [removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(async (userId: string) => {
    try {
      await apiCall(`/api/carts/user/${userId}`, {
        method: 'DELETE',
      });

      dispatch({ type: "SET_ITEMS", items: [] });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }, []);

  const contextValue: CartContextType = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateQuantity,
    loadCart,
    clearCart,
  };

  return <Ctx.Provider value={contextValue}>{children}</Ctx.Provider>;
}

export function useOrder() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("OrderProvider missing");
  return ctx;
}

// Enhanced hook for easier usage
export function useCartOrder() {
  const { state, addToCart, removeFromCart, updateQuantity, loadCart, clearCart } = useOrder();
  
  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    totalItems: state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    deliveryCharge: state.deliveryCharge,
    handlingCharge: state.handlingCharge,
    tip: state.tip,
    finalTotal: state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 
                 state.deliveryCharge + state.handlingCharge + state.tip,
    // API methods
    addToCart,
    removeFromCart,
    updateQuantity,
    loadCart,
    clearCart,
  };
}