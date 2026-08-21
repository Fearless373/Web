"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "./types";
import { calculateTotals } from "./utils";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string, customizations?: Record<string, string>) => void;
  updateQuantity: (
    menuItemId: string,
    quantity: number,
    customizations?: Record<string, string>
  ) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotals: () => { subtotal: number; tax: number; serviceFee: number; total: number };
  getItemCount: () => number;
}

function matchItem(
  a: CartItem,
  menuItemId: string,
  customizations?: Record<string, string>
) {
  if (a.menuItemId !== menuItemId) return false;
  const c1 = JSON.stringify(a.customizations || {});
  const c2 = JSON.stringify(customizations || {});
  return c1 === c2;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) =>
            matchItem(i, item.menuItemId, item.customizations)
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                matchItem(i, item.menuItemId, item.customizations)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (menuItemId, customizations) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !matchItem(i, menuItemId, customizations)
          ),
        }));
      },
      updateQuantity: (menuItemId, quantity, customizations) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId, customizations);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            matchItem(i, menuItemId, customizations)
              ? { ...i, quantity }
              : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getSubtotal: () => {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
      getTotals: () => {
        const subtotal = get().getSubtotal();
        return { subtotal, ...calculateTotals(subtotal) };
      },
      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: "restaurant-cart",
    }
  )
);
