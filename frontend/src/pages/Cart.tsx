import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import SEOHead from '../components/SEOHead';
import {
  TrashIcon,
  ShoppingBagIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  TagIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getAuthenticImage, handleImageError } from '../utils/imageFallback';

export default function CartPage() {
  const { items, removeItem, updateGuests, updateTourGuests, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const formatPrice = (amount: number) => {
    return (amount || 0).toLocaleString('vi-VN') + ' đ';
  };

  const getItemLink = (item: any) => {
    const slug = item.slug || '';
    if (item.type === 'tour') return `/tours/${slug}`;
    if (item.type === 'hotel') return `/hotels/${slug}`;
    if (item.type === 'restaurant' || item.type === 'dining' || item.type === 'food') return `/restaurants/${slug}`;
    const title = (item.title || '').toLowerCase();
    if (
      title.includes('nhà hàng') ||
      title.includes('quán') ||
      title.includes('phở') ||
      title.includes('đặt bàn') ||
      title.includes('bát đàn')
    ) {
      return `/restaurants/${slug}`;
    }
    if (title.includes('khách sạn') || title.includes('hotel') || title.includes('resort') || title.includes('phòng')) {
      return `/hotels/${slug}`;
    }
    return `/destinations/${slug}`;
  };

  const getItemUnitLabel = (item: any) => {
    if (item.unitLabel) return item.unitLabel;
    if (item.type === 'hotel') return 'phòng';
    if (item.type === 'restaurant') return 'khách';
    return 'khách';
  };

  const getItemSubtotal = (item: any) => {
    if (item.type === 'restaurant') {
      return 0; // Đặt bàn nhà hàng miễn phí 0đ
    }
    if (item.type === 'tour' && (item.adults !== undefined || item.children !== undefined)) {
      const a = item.adults ?? item.guests;
      const c = item.children ?? 0;
      const pa = item.pricePerAdult ?? item.price;
      const pc = item.pricePerChild ?? Math.round(pa * 0.7);
      return Math.max(0, a * pa + c * pc - (item.discount || 0));
    }
    return (item.price || 0) * (item.guests || 1);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError('Vui lòng nhập mã ưu đãi.');
      return;
    }

    if (code === 'MEMBER10' || code === 'TRAVELHUB10' || code === 'EARLY10') {
      setDiscountPercent(10);
      setAppliedCoupon(code);
      setCouponError(null);
      toast.success(`Đã áp dụng mã ${code} (Giảm 10%)`);
    } else if (code === 'TRAVELHUB20') {
      setDiscountPercent(20);
      setAppliedCoupon('TRAVELHUB20');
      setCouponError(null);
      toast.success('Đã áp dụng mã TRAVELHUB20 (Giảm 20%)');
    } else if (code === 'GROUP5') {
      const totalGuests = items.reduce((s, i) => s + (i.guests || 1), 0);
      if (totalGuests < 4) {
        setDiscountPercent(0);
        setAppliedCoupon('');
        setCouponError('Mã GROUP5 chỉ áp dụng cho nhóm từ 4 khách trở lên.');
        toast.error('Mã GROUP5 chỉ áp dụng cho nhóm từ 4 khách trở lên!');
        return;
      }
      setDiscountPercent(5);
      setAppliedCoupon('GROUP5');
      setCouponError(null);
      toast.success('Đã áp dụng mã GROUP5 (Giảm 5%)');
    } else {
      setDiscountPercent(0);
      setAppliedCoupon('');
      setCouponError('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
      toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }
  };

  const discountAmount = Math.round((totalPrice * discountPercent) / 100);
  const finalPrice = Math.max(0, totalPrice - discountAmount);

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống!');
      return;
    }
    // Encode cart data or save session for checkout
    navigate(`/checkout?from=cart&discount=${discountPercent}&coupon=${appliedCoupon}`);
  };

  return (
    <>
      <SEOHead
        title="Giỏ hàng - TravelHub"
        description="Xem lại các tour và dịch vụ du lịch đã chọn trong giỏ hàng và tiến hành thanh toán an toàn."
      />

      <div className="min-h-screen bg-gray-50/60 dark:bg-slate-950 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-100 dark:border-cyan-800">
                <ShoppingBagIcon className="w-6 h-6" />
              </div>
              Giỏ hàng của bạn
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
              Quản lý các tour, khách sạn và dịch vụ bạn đã chọn trước khi tiến hành thanh toán.
            </p>
          </div>

          {items.length === 0 ? (
            /* Empty Cart View */
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-12 text-center max-w-xl mx-auto my-12 transition-colors">
              <div className="w-20 h-20 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner border border-cyan-100 dark:border-cyan-900">
                <ShoppingBagIcon className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Giỏ hàng của bạn đang trống</h2>
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
                Bạn chưa thêm bất kỳ dịch vụ hay tour du lịch nào. Hãy khám phá ngay các hành trình hấp dẫn!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/destinations"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold transition shadow-md shadow-cyan-500/20 text-sm"
                >
                  Khám phá điểm đến
                </Link>
                <Link
                  to="/deals"
                  className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition text-sm"
                >
                  Xem ưu đãi hot
                </Link>
              </div>
            </div>
          ) : (
            /* Cart Items Grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: List of items */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm text-sm">
                  <span className="font-semibold text-gray-700 dark:text-slate-200">
                    Đang có <span className="text-cyan-600 dark:text-cyan-400 font-bold">{items.length}</span> dịch vụ trong giỏ
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:underline"
                  >
                    Xóa tất cả
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                  >
                    {/* Item Image & Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <Link
                        to={getItemLink(item)}
                        className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 flex-shrink-0 border border-gray-100 dark:border-slate-800 group"
                      >
                        <img
                          src={getAuthenticImage(item.image, item.title, item.type === 'hotel' ? 'hotel' : 'tour')}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            handleImageError(e, item.title, item.type === 'hotel' ? 'hotel' : 'tour');
                          }}
                        />
                      </Link>
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 tracking-wider">
                          {item.type === 'tour'
                            ? 'Tour du lịch'
                            : item.type === 'hotel'
                            ? 'Khách sạn'
                            : item.type === 'restaurant'
                            ? 'Nhà hàng'
                            : 'Điểm đến'}
                        </span>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition">
                          <Link to={getItemLink(item)}>
                            {item.title}
                          </Link>
                        </h3>
                        {item.date && (
                          <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
                            <CalendarDaysIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span>
                              {item.type === 'hotel'
                                ? 'Thời gian lưu trú: '
                                : item.type === 'restaurant'
                                ? 'Thời gian dùng bữa: '
                                : 'Ngày khởi hành: '}
                              <strong className="font-medium text-gray-700 dark:text-slate-200">{item.date}</strong>
                            </span>
                          </p>
                        )}
                        {/* Pricing details */}
                        {item.type === 'restaurant' ? (
                          <div className="pt-0.5 space-y-1">
                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                              <span>0 đ</span>
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                Đặt chỗ miễn phí
                              </span>
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-slate-400">
                              Không thu phí đặt trước • Thanh toán trực tiếp tại quán theo thực đơn
                            </p>
                          </div>
                        ) : item.type === 'tour' && (item.adults !== undefined || item.children !== undefined) ? (
                          <div className="space-y-1 pt-1">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-slate-300">
                              <span className="font-semibold text-cyan-700 dark:text-cyan-300">
                                {item.adults ?? item.guests} Người lớn × {formatPrice(item.pricePerAdult ?? item.price)}
                              </span>
                              {(item.children || 0) > 0 && (
                                <span className="font-semibold text-amber-600 dark:text-amber-400">
                                  • {item.children} Trẻ em (70%) × {formatPrice(item.pricePerChild ?? Math.round((item.pricePerAdult ?? item.price) * 0.7))}
                                </span>
                              )}
                            </div>
                            {item.discount && item.discount > 0 ? (
                              <span className="inline-block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                Ưu đãi đặt trực tuyến: -{formatPrice(item.discount)}
                              </span>
                            ) : null}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap pt-0.5">
                            <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                              {formatPrice(item.price)}{' '}
                              <span className="text-xs font-normal text-gray-500 dark:text-slate-400">
                                / {getItemUnitLabel(item)}
                              </span>
                            </p>
                            {item.discount && item.discount > 0 && (
                              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                Đã giảm ưu đãi online: -{formatPrice(item.discount)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-slate-800">
                      {/* Counter */}
                      {item.type === 'tour' && (item.adults !== undefined || item.children !== undefined) ? (
                        <div className="flex flex-col sm:items-end gap-1.5">
                          {/* Adults counter */}
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-300">
                            <span className="text-[11px] font-medium">Người lớn:</span>
                            <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-800">
                              <button
                                type="button"
                                onClick={() =>
                                  updateTourGuests?.(
                                    item.id,
                                    Math.max(1, (item.adults ?? item.guests) - 1),
                                    item.children ?? 0
                                  )
                                }
                                className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold transition text-xs"
                                title="Giảm 1 người lớn"
                              >
                                -
                              </button>
                              <span className="px-2 text-center font-bold text-xs text-gray-800 dark:text-white">
                                {item.adults ?? item.guests}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateTourGuests?.(
                                    item.id,
                                    (item.adults ?? item.guests) + 1,
                                    item.children ?? 0
                                  )
                                }
                                className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold transition text-xs"
                                title="Thêm 1 người lớn"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Children counter */}
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-300">
                            <span className="text-[11px] font-medium">Trẻ em:</span>
                            <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-800">
                              <button
                                type="button"
                                onClick={() =>
                                  updateTourGuests?.(
                                    item.id,
                                    item.adults ?? item.guests,
                                    Math.max(0, (item.children ?? 0) - 1)
                                  )
                                }
                                className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold transition text-xs"
                                title="Giảm 1 trẻ em"
                              >
                                -
                              </button>
                              <span className="px-2 text-center font-bold text-xs text-gray-800 dark:text-white">
                                {item.children ?? 0}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateTourGuests?.(
                                    item.id,
                                    item.adults ?? item.guests,
                                    (item.children ?? 0) + 1
                                  )
                                }
                                className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold transition text-xs"
                                title="Thêm 1 trẻ em"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-800">
                          <button
                            type="button"
                            onClick={() => updateGuests(item.id, Math.max(1, item.guests - 1))}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold transition"
                            title={`Giảm 1 ${getItemUnitLabel(item)}`}
                          >
                            -
                          </button>
                          <span className="px-2.5 text-center font-semibold text-xs text-gray-800 dark:text-white whitespace-nowrap">
                            {item.guests} {getItemUnitLabel(item)}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateGuests(item.id, item.guests + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold transition"
                            title={`Thêm 1 ${getItemUnitLabel(item)}`}
                          >
                            +
                          </button>
                        </div>
                      )}

                      {/* Subtotal for Item */}
                      <div className="text-right">
                        <span className="text-xs text-gray-400 dark:text-slate-500 block">Thành tiền</span>
                        <span className="font-bold text-base text-gray-900 dark:text-white">
                          {formatPrice(getItemSubtotal(item))}
                        </span>
                        {item.type === 'restaurant' && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
                            (Thanh toán tại quán)
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm sticky top-24">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
                    Tóm tắt đơn hàng
                  </h2>

                  {/* Coupon Form */}
                  <form onSubmit={handleApplyCoupon} className="mb-5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 block mb-1.5">
                      Mã ưu đãi / Khuyến mãi
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <TagIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="MEMBER10, TRAVELHUB20..."
                          className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 uppercase"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-slate-900 dark:bg-cyan-600 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 dark:hover:bg-cyan-500 transition"
                      >
                        Áp dụng
                      </button>
                    </div>
                    {appliedCoupon && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1 font-medium">
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                        Đang áp dụng: <strong>{appliedCoupon}</strong> (-{discountPercent}%)
                      </p>
                    )}
                    {couponError && (
                      <p className="text-xs text-rose-500 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                        <span>⚠️</span>
                        {couponError}
                      </p>
                    )}
                  </form>

                  {/* Pricing Details */}
                  <div className="space-y-3 text-sm border-t border-gray-100 dark:border-slate-800 pt-4">
                    <div className="flex justify-between text-gray-600 dark:text-slate-400">
                      <span>Tạm tính ({items.length} dịch vụ):</span>
                      <span className="font-semibold text-gray-800 dark:text-slate-200">{formatPrice(totalPrice)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Giảm giá ({discountPercent}%):</span>
                        <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600 dark:text-slate-400">
                      <span>Phí dịch vụ & VAT:</span>
                      <span className="text-xs text-gray-500 dark:text-slate-400 italic">Đã bao gồm</span>
                    </div>

                    <div className="border-t border-gray-200/80 dark:border-slate-800 pt-3 flex justify-between items-baseline">
                      <span className="font-bold text-gray-900 dark:text-white text-base">Tổng thanh toán:</span>
                      <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                        {formatPrice(finalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full mt-6 py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-teal-500 transition-all flex items-center justify-center gap-2 group text-sm"
                  >
                    <span>Tiến hành thanh toán</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Security Guarantees */}
                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2 text-xs text-gray-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <ShieldCheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Bảo mật chuẩn mã hóa SSL 256-bit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                      <span>Xác nhận tức thì qua Email & SMS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
