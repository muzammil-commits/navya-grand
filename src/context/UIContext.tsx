"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Product, ServiceItem } from "@/lib/types";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
}

interface UIContextValue {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  isBookingOpen: boolean;
  openBookingModal: () => void;
  closeBookingModal: () => void;
  isBanquetOpen: boolean;
  openBanquetModal: () => void;
  closeBanquetModal: () => void;
  selectedService: ServiceItem | null;
  openServiceModal: (service: ServiceItem) => void;
  closeServiceModal: () => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBanquetOpen, setIsBanquetOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const anyModalOpen = Boolean(
    isCartOpen ||
      selectedProduct ||
      isBookingOpen ||
      isBanquetOpen ||
      selectedService
  );

  // Prevent background scroll ONLY while a modal/drawer is open
  useEffect(() => {
    if (anyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyModalOpen]);

  // Global Escape key handler for popups
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selectedProduct) setSelectedProduct(null);
      else if (selectedService) setSelectedService(null);
      else if (isBookingOpen) setIsBookingOpen(false);
      else if (isBanquetOpen) setIsBanquetOpen(false);
      else if (isCartOpen) setIsCartOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    selectedProduct,
    selectedService,
    isBookingOpen,
    isBanquetOpen,
    isCartOpen,
  ]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-2), { ...toast, id }]);
      setTimeout(() => {
        dismissToast(id);
      }, 3600);
    },
    [dismissToast]
  );

  return (
    <UIContext.Provider
      value={{
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        selectedProduct,
        openProductModal: (p) => setSelectedProduct(p),
        closeProductModal: () => setSelectedProduct(null),
        isBookingOpen,
        openBookingModal: () => setIsBookingOpen(true),
        closeBookingModal: () => setIsBookingOpen(false),
        isBanquetOpen,
        openBanquetModal: () => setIsBanquetOpen(true),
        closeBanquetModal: () => setIsBanquetOpen(false),
        selectedService,
        openServiceModal: (s) => setSelectedService(s),
        closeServiceModal: () => setSelectedService(null),
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useUI must be used within UIProvider");
  }
  return ctx;
}

