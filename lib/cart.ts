"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "./types";
import { restoreItems, savedItemSchema } from "./cart-storage";
type Cart = {
  items: CartItem[];
  open: boolean;
  add: (item: Omit<CartItem, "key">) => boolean;
  update: (key: string, patch: Partial<CartItem>) => void;
  remove: (key: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};
export const useCart = create<Cart>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      add: (item) => {
        const parsed = savedItemSchema.safeParse({
          ...item,
          key: crypto.randomUUID(),
        });
        if (!parsed.success || get().items.length >= 30) return false;
        set((s) => ({ items: [...s.items, parsed.data], open: true }));
        return true;
      },
      update: (key, patch) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.key === key
              ? {
                  ...i,
                  ...patch,
                  quantity: Math.max(
                    1,
                    Math.min(20, patch.quantity ?? i.quantity),
                  ),
                }
              : i,
          ),
        })),
      remove: (key) =>
        set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),
    }),
    {
      name: "yk-enquiry-bag-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
      merge: (persisted, current) => ({
        ...current,
        items: restoreItems(persisted),
      }),
    },
  ),
);
