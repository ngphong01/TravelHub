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
  unitLabel?: string; // 'phòng' | 'khách' | 'bàn'
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  adults?: number;
  children?: number;
  pricePerAdult?: number;
  pricePerChild?: number;
  discount?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateGuests: (id: string, guests: number) => void;
  updateTourGuests?: (id: string, adults: number, children: number) => void;
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
    const id = `${newItem.type}-${newItem.itemId}-${newItem.date || 'default'}-${newItem.roomType || ''}`;
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === id);
      if (existingIndex > -1) {
        const updated = [...prev];
        if (newItem.adults !== undefined || newItem.children !== undefined) {
          updated[existingIndex].adults = (updated[existingIndex].adults || 1) + (newItem.adults || 0);
          updated[existingIndex].children = (updated[existingIndex].children || 0) + (newItem.children || 0);
          updated[existingIndex].guests = (updated[existingIndex].adults || 1) + (updated[existingIndex].children || 0);
        } else {
          updated[existingIndex].guests += newItem.guests || 1;
        }
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

  const updateTourGuests = (id: string, adults: number, children: number) => {
    if (adults < 1 && children < 1) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newAdults = Math.max(1, adults);
          const newChildren = Math.max(0, children);
          const totalGuests = newAdults + newChildren;
          const pa = item.pricePerAdult ?? item.price;
          const pc = item.pricePerChild ?? Math.round(pa * 0.7);
          const rawTotal = newAdults * pa + newChildren * pc;
          const newDiscount = rawTotal >= 5000000 ? 150000 : (rawTotal >= 2000000 ? 80000 : 0);
          return {
            ...item,
            adults: newAdults,
            children: newChildren,
            guests: totalGuests,
            discount: newDiscount > 0 ? newDiscount : undefined,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((acc, item) => acc + (item.guests || 1), 0);
  const totalPrice = items.reduce((acc, item) => {
    if (item.type === 'restaurant') {
      return acc; // Đặt bàn nhà hàng hoàn toàn miễn phí 0đ
    }
    if (item.type === 'tour' && (item.adults !== undefined || item.children !== undefined)) {
      const a = item.adults ?? item.guests;
      const c = item.children ?? 0;
      const pa = item.pricePerAdult ?? item.price;
      const pc = item.pricePerChild ?? Math.round(pa * 0.7);
      const sub = a * pa + c * pc - (item.discount || 0);
      return acc + Math.max(0, sub);
    }
    return acc + (Number(item.price) || 0) * (Number(item.guests) || 1);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateGuests,
        updateTourGuests,
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
      updateTourGuests: () => {},
      clearCart: () => {},
      totalCount: 0,
      totalPrice: 0,
    };
  }
  return context;
}
