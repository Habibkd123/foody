"use client";

import { createContext, useContext, useReducer } from "react";
import type { CartLine, Address } from "@/types/global";

interface State {
  items: CartLine[];
  address?: Address;
  distance?: number;
  deliveryCharge: number;
  handlingCharge: number;
  tip: number;
  donation?: number;
}

type Action =
  | { type: "ADD"; item: CartLine }
  | { type: "REMOVE"; id: number }
  | { type: "QTY"; id: number; qty: number }
  | { type: "SET_ADDRESS"; address: Address }
  | { type: "SET_TIP"; tip: number }
  | { type: "SET_DISTANCE"; distance: number }
  | { type: "SET_DELIVERY_CHARGE"; deliveryCharge: number }
  | { type: "SET_HANDLING_CHARGE"; handlingCharge: number }
  | { type: "RESET" };

const initial: State = {
  items: [],
  tip: 0,
  deliveryCharge: 0,
  handlingCharge: 0,
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "ADD":
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

    case "REMOVE":
      return { ...s, items: s.items.filter(i => i.id !== a.id) };

    case "QTY":
      return {
        ...s,
        items: s.items.map(i =>
          i.id === a.id ? { ...i, quantity: a.qty } : i
        ),
      };

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

    case "RESET":
      return initial;

    default:
      return s;
  }
}

const Ctx = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useOrder() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("OrderProvider missing");
  return ctx;
}
