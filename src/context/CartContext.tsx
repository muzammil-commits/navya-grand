"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product } from "@/lib/types";

const STORAGE_KEY = "navya_grand_cart_v1";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (
    product: Product,
    options?: {
      quantity?: number;
      variantLabel?: string | null;
      unitPrice?: number;
      instructions?: string;
    }
  ) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (item) =>
                item &&
                typeof item.productId === "number" &&
                typeof item.quantity === "number" &&
                item.quantity > 0
            )
          );
        }
      }
    } catch {
      // Ignore corrupt localStorage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (
      product: Product,
      options?: {
        quantity?: number;
        variantLabel?: string | null;
        unitPrice?: number;
        instructions?: string;
      }
    ) => {
      if (!product.isAvailable) return;
      const qty = Math.max(1, Math.min(50, options?.quantity || 1));
      const variantLabel =
        options?.variantLabel ??
        (product.variants.length > 0 ? product.variants[0].label : null);
      const matchedVariant = variantLabel
        ? product.variants.find((v) => v.label === variantLabel)
        : undefined;
      const unitPrice =
        options?.unitPrice ?? matchedVariant?.price ?? product.price;
      const key = `${product.id}::${variantLabel || "default"}`;

      setItems((prev) => {
        const existing = prev.find((i) => i.key === key);
        if (existing) {
          return prev.map((i) =>
            i.key === key
              ? {
                  ...i,
                  quantity: Math.min(50, i.quantity + qty),
                  instructions: options?.instructions ?? i.instructions,
                }
              : i
          );
        }
        return [
          ...prev,
          {
            key,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            imageUrl: product.imageUrl,
            vegType: product.vegType,
            variantLabel,
            unitPrice,
            quantity: qty,
            instructions: options?.instructions,
          },
        ];
      });
    },
    []
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.key !== key));
      return;
    }
    const clamped = Math.min(50, Math.max(1, Math.floor(quantity)));
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity: clamped } : i))
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        hydrated,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

