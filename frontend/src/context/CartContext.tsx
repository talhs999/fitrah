"use client";

import { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import { PRODUCTS } from "@/lib/products";

export type CartItem = {
  id: string;
  qty: number;
};

type State = { items: CartItem[] };
type Action =
  | { type: "ADD"; id: string }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "CLEAR" }
  | { type: "LOAD"; items: CartItem[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.id === action.id);
      if (existing) {
        return { items: state.items.map((i) => i.id === action.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { items: [...state.items, { id: action.id, qty: 1 }] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "SET_QTY":
      if (action.qty < 1) return { items: state.items.filter((i) => i.id !== action.id) };
      return { items: state.items.map((i) => i.id === action.id ? { ...i, qty: action.qty } : i) };
    case "CLEAR":
      return { items: [] };
    case "LOAD":
      return { items: action.items };
    default:
      return state;
  }
}

type CartContextType = {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fitrah_cart");
      if (stored) dispatch({ type: "LOAD", items: JSON.parse(stored) });
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("fitrah_cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = useCallback((id: string) => dispatch({ type: "ADD", id }), []);
  const removeFromCart = useCallback((id: string) => dispatch({ type: "REMOVE", id }), []);
  const setQty = useCallback((id: string, qty: number) => dispatch({ type: "SET_QTY", id, qty }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const totalCount = state.items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = state.items.reduce((sum, i) => {
    const product = PRODUCTS.find((p) => p.id === i.id);
    return sum + (product ? product.price * i.qty : 0);
  }, 0);

  return (
    <CartContext.Provider value={{ items: state.items, totalCount, totalPrice, addToCart, removeFromCart, setQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
