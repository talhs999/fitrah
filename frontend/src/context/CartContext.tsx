"use client";

import { createContext, useContext, useEffect, useReducer, useCallback, useState } from "react";
import { PRODUCTS } from "@/lib/products";
import { createClient } from "@/utils/supabase/client";

export type CartItem = {
  id: string;
  qty: number;
  selectedCap: 'dropper' | 'pump';
};

type State = { items: CartItem[] };
type Action =
  | { type: "ADD"; id: string; selectedCap?: 'dropper' | 'pump' }
  | { type: "REMOVE"; id: string; selectedCap?: 'dropper' | 'pump' }
  | { type: "SET_QTY"; id: string; qty: number; selectedCap?: 'dropper' | 'pump' }
  | { type: "CLEAR" }
  | { type: "LOAD"; items: CartItem[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const targetCap = action.selectedCap || 'dropper';
      const existing = state.items.find((i) => i.id === action.id && i.selectedCap === targetCap);
      if (existing) {
        return { items: state.items.map((i) => i.id === action.id && i.selectedCap === targetCap ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { items: [...state.items, { id: action.id, qty: 1, selectedCap: targetCap }] };
    }
    case "REMOVE": {
      const targetCap = action.selectedCap || 'dropper';
      return { items: state.items.filter((i) => !(i.id === action.id && i.selectedCap === targetCap)) };
    }
    case "SET_QTY": {
      const targetCap = action.selectedCap || 'dropper';
      if (action.qty < 1) return { items: state.items.filter((i) => !(i.id === action.id && i.selectedCap === targetCap)) };
      return { items: state.items.map((i) => i.id === action.id && i.selectedCap === targetCap ? { ...i, qty: action.qty } : i) };
    }
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
  addToCart: (id: string, selectedCap?: 'dropper' | 'pump') => void;
  removeFromCart: (id: string, selectedCap?: 'dropper' | 'pump') => void;
  setQty: (id: string, qty: number, selectedCap?: 'dropper' | 'pump') => void;
  clearCart: () => void;
  products: typeof PRODUCTS;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [products, setProducts] = useState(PRODUCTS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fitrah_cart");
      if (stored) dispatch({ type: "LOAD", items: JSON.parse(stored) });
    } catch {}
  }, []);

  // Fetch and merge database products
  useEffect(() => {
    async function loadProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("products").select("*");
        if (data && data.length > 0 && !error) {
          const merged = PRODUCTS.map(staticP => {
            const dbP = data.find(p => p.id === staticP.id);
            return dbP ? { ...staticP, ...dbP } : staticP;
          });
          setProducts(merged);
        }
      } catch (err) {
        console.error("Failed to load products in CartContext:", err);
      }
    }
    loadProducts();
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("fitrah_cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = useCallback((id: string, selectedCap?: 'dropper' | 'pump') => dispatch({ type: "ADD", id, selectedCap }), []);
  const removeFromCart = useCallback((id: string, selectedCap?: 'dropper' | 'pump') => dispatch({ type: "REMOVE", id, selectedCap }), []);
  const setQty = useCallback((id: string, qty: number, selectedCap?: 'dropper' | 'pump') => dispatch({ type: "SET_QTY", id, qty, selectedCap }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const totalCount = state.items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = state.items.reduce((sum, i) => {
    const product = products.find((p) => p.id === i.id);
    return sum + (product ? product.price * i.qty : 0);
  }, 0);

  return (
    <CartContext.Provider value={{ items: state.items, totalCount, totalPrice, addToCart, removeFromCart, setQty, clearCart, products }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
