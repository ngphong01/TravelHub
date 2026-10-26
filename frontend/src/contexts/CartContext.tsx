import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string; // Unique identifier: e.g. `tour-${id}-${date}`
  type: 'tour' | 'hotel' | 'restaurant' | 'destination';
  itemId: number;
  title: string;
  image?: string;
  slug: string;
  price: number;
  originalPrice?: number;
  date?: string;
  guests: number;
  location?: string;
  duration?: number | string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateGuests: (id: string, guests: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'travelgo:cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    const id = `${newItem.type}-${newItem.itemId}-${newItem.date || 'default'}`;
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].guests += newItem.guests || 1;
        toast.success(`Đã cập nhật số lượng cho: ${newItem.title}`);
        return updated;
      } else {
        toast.success(`Đã thêm vào giỏ: ${newItem.title}`);
        return [...prev, { ...newItem, id }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        toast.success(`Đã xóa "${target.title}" khỏi giỏ hàng`);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const updateGuests = (id: string, guests: number) => {
    if (guests < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, guests } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((acc, item) => acc + item.guests, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.guests, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateGuests,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    return {
      items: [],
      addItem: () => {},
      removeItem: () => {},
      updateGuests: () => {},
      clearCart: () => {},
      totalCount: 0,
      totalPrice: 0,
    };
  }
  return context;
}
