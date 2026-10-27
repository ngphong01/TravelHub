import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import {
  XMarkIcon,
  ShoppingBagIcon,
  TrashIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { getAuthenticImage, handleImageError } from '../utils/imageFallback';

interface CartSlideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSlideDrawer({ isOpen, onClose }: CartSlideDrawerProps) {
  const { items, removeItem, updateGuests, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const formatPrice = (val: number) => {
    return (val || 0).toLocaleString('vi-VN') + ' đ';
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout?from=cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between animate-soft-pop">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <ShoppingBagIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                  Giỏ hàng của bạn
                </h3>
                <span className="text-xs text-gray-500 dark:text-slate-400">
                  {items.length} dịch vụ đã chọn
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-400 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBagIcon className="w-8 h-8" />
                </div>
                <p className="text-gray-800 dark:text-slate-200 font-bold mb-1">
                  Giỏ hàng chưa có dịch vụ nào
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">
                  Hãy khám phá các tour du lịch và ưu đãi hấp dẫn ngay hôm nay.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/tours');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider transition"
                >
                  Khám phá Tour
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200/80 dark:border-slate-800 flex items-center gap-3.5"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 dark:bg-slate-700 flex-shrink-0">
                    <img
                      src={getAuthenticImage(item.image, item.title, item.type === 'hotel' ? 'hotel' : 'tour')}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        handleImageError(e, item.title, item.type === 'hotel' ? 'hotel' : 'tour');
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs font-black text-cyan-600 dark:text-cyan-400 my-0.5">
                      {formatPrice(item.price)}
                    </p>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                        <button
                          type="button"
                          onClick={() => updateGuests(item.id, Math.max(1, item.guests - 1))}
                          className="px-2 py-0.5 text-xs font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-900 dark:text-white">
                          {item.guests}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateGuests(item.id, item.guests + 1)}
                          className="px-2 py-0.5 text-xs font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[10px] text-gray-400">khách</span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-slate-400">Tổng thanh toán:</span>
                <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="py-3 text-center rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 font-bold text-xs transition"
                >
                  Xem giỏ hàng
                </Link>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-1.5"
                >
                  <span>Thanh toán</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                <span>Bảo mật chuẩn mã hóa SSL 256-bit</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
