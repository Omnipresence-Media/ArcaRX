import { useSyncExternalStore } from "react";

export type CartLine = { productId: string; qty: number };

let cart: CartLine[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const cartStore = {
  get(): CartLine[] {
    return cart;
  },
  add(productId: string, qty = 1) {
    const existing = cart.find((l) => l.productId === productId);
    if (existing) {
      cart = cart.map((l) =>
        l.productId === productId ? { ...l, qty: l.qty + qty } : l,
      );
    } else {
      cart = [...cart, { productId, qty }];
    }
    emit();
  },
  setQty(productId: string, qty: number) {
    if (qty <= 0) {
      cart = cart.filter((l) => l.productId !== productId);
    } else {
      cart = cart.map((l) => (l.productId === productId ? { ...l, qty } : l));
    }
    emit();
  },
  remove(productId: string) {
    cart = cart.filter((l) => l.productId !== productId);
    emit();
  },
  clear() {
    cart = [];
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

const EMPTY: CartLine[] = [];
export function useCart(): CartLine[] {
  return useSyncExternalStore(
    cartStore.subscribe,
    cartStore.get,
    () => EMPTY,
  );
}

export function useCartCount(): number {
  const lines = useCart();
  return lines.reduce((s, l) => s + l.qty, 0);
}
