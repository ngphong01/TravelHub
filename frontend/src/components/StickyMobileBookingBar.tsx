import React from 'react';
import {
  ShoppingBagIcon,
  BoltIcon,
  StarIcon
} from '@heroicons/react/24/solid';

interface StickyMobileBookingBarProps {
  price: number;
  rating?: number;
  onAddToCart: () => void;
  onInstantBook: () => void;
}

export default function StickyMobileBookingBar({
  price,
  rating = 5.0,
  onAddToCart,
  onInstantBook,
}: StickyMobileBookingBarProps) {
  const formatPrice = (val: number) => {
    return (val || 0).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Price & Rating Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-1 text-amber-500 text-[11px] font-bold">
            <StarIcon className="w-3.5 h-3.5" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-gray-400 font-normal">/ 5.0</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-cyan-600 dark:text-cyan-400 truncate">
              {formatPrice(price)}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-slate-400">/ khách</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddToCart}
            className="p-3 rounded-2xl border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition active:scale-95"
            title="Thêm vào giỏ"
          >
            <ShoppingBagIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onInstantBook}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 active:scale-95 transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <BoltIcon className="w-4 h-4 text-amber-300" />
            <span>Đặt ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
