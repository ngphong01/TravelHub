import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  XMarkIcon,
  ScaleIcon,
  CheckIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/solid';
import { getAuthenticImage, handleImageError } from '../utils/imageFallback';
import { useLanguage } from '../contexts/LanguageContext';

export interface CompareTourItem {
  id: number;
  name: string;
  image?: string;
  price: number;
  duration?: number | string;
  rating?: number;
  destination?: string;
  transport?: string;
  slug: string;
}

interface FloatingCompareDrawerProps {
  selectedTours: CompareTourItem[];
  onRemoveTour: (id: number) => void;
  onClearAll: () => void;
}

export default function FloatingCompareDrawer({
  selectedTours,
  onRemoveTour,
  onClearAll,
}: FloatingCompareDrawerProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { language } = useLanguage();
  const location = useLocation();
  const isEn = language === 'en' || location.pathname.startsWith('/en/');

  if (selectedTours.length === 0) return null;

  const formatPrice = (val?: number) => {
    if (isEn) {
      return (val || 0).toLocaleString('en-US') + ' VND';
    }
    return (val || 0).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <>
      {/* Floating Bottom Dock */}
      <div className="fixed bottom-6 right-6 z-40 animate-soft-pop">
        <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white/20 text-white rounded-3xl p-3 sm:p-4 shadow-2xl flex items-center gap-4">
          {/* Thumbnails of selected tours */}
          <div className="flex items-center -space-x-3 overflow-hidden">
            {selectedTours.map((t) => (
              <div
                key={t.id}
                className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-slate-900 shadow-md flex-shrink-0 group"
              >
                <img
                  src={getAuthenticImage(t.image, t.name, 'tour')}
                  alt={t.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    handleImageError(e, t.name, 'tour');
                  }}
                />
                <button
                  type="button"
                  onClick={() => onRemoveTour(t.id)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                  title="Bỏ so sánh"
                >
                  <XMarkIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>

          {/* Info text */}
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-200">
              {isEn ? 'Selected ' : 'Đang chọn '}
              <span className="text-cyan-400 font-extrabold">{selectedTours.length}/3</span>
              {isEn ? ' tours' : ' tour'}
            </p>
            <span className="text-[11px] text-slate-400">
              {isEn ? 'Compare side-by-side specs' : 'So sánh đối chiếu chi tiết'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpenModal(true)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-cyan-500/25 flex items-center gap-1.5 transition"
            >
              <ScaleIcon className="w-4 h-4" />
              <span>{isEn ? 'Compare Now' : 'So sánh ngay'}</span>
            </button>
            <button
              onClick={onClearAll}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
              title={isEn ? 'Clear all' : 'Xóa tất cả'}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-soft-pop">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <ScaleIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                    {isEn ? 'Tour Comparison Matrix' : 'Bảng Đối Chiếu So Sánh Tour'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {isEn
                      ? 'Detailed breakdown of prices, schedules, and service standards to find your optimal trip.'
                      : 'Phân tích chi tiết giá vé, lịch trình và tiêu chuẩn dịch vụ để chọn hành trình tối ưu.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpenModal(false)}
                className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {selectedTours.map((tour) => (
                <div
                  key={tour.id}
                  className="bg-gray-50/70 dark:bg-slate-800/60 rounded-2xl p-5 border border-gray-200/80 dark:border-slate-700/80 flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="relative h-44 rounded-xl overflow-hidden mb-4 shadow-sm">
                      <img
                        src={getAuthenticImage(tour.image, tour.name, 'tour')}
                        alt={tour.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          handleImageError(e, tour.name, 'tour');
                        }}
                      />
                      <button
                        onClick={() => onRemoveTour(tour.id)}
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="font-extrabold text-base text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {tour.name}
                    </h4>

                    {/* Criteria Breakdown */}
                    <div className="space-y-3 text-xs mb-6">
                      <div className="flex justify-between py-1.5 border-b border-gray-200/60 dark:border-slate-700">
                        <span className="text-gray-500 dark:text-slate-400">
                          {isEn ? 'Adult Ticket Price' : 'Giá vé người lớn'}
                        </span>
                        <strong className="text-cyan-600 dark:text-cyan-400 font-black text-sm">
                          {formatPrice(tour.price)}
                        </strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-200/60 dark:border-slate-700">
                        <span className="text-gray-500 dark:text-slate-400">
                          {isEn ? 'Duration' : 'Thời lượng'}
                        </span>
                        <strong className="text-gray-800 dark:text-slate-200">
                          {tour.duration || 3} {isEn ? 'Days' : 'ngày'}
                        </strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-200/60 dark:border-slate-700">
                        <span className="text-gray-500 dark:text-slate-400">
                          {isEn ? 'Destination' : 'Điểm đến'}
                        </span>
                        <strong className="text-gray-800 dark:text-slate-200">{tour.destination || (isEn ? 'Vietnam' : 'Việt Nam')}</strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-200/60 dark:border-slate-700">
                        <span className="text-gray-500 dark:text-slate-400">
                          {isEn ? 'Rating' : 'Đánh giá'}
                        </span>
                        <span className="text-amber-500 font-bold flex items-center gap-1">
                          <StarIcon className="w-3.5 h-3.5" />
                          {tour.rating || 5.0} / 5.0
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-200/60 dark:border-slate-700">
                        <span className="text-gray-500 dark:text-slate-400">
                          {isEn ? 'Transportation' : 'Phương tiện'}
                        </span>
                        <strong className="text-gray-800 dark:text-slate-200">{tour.transport || (isEn ? 'Premium Tourist Coach' : 'Xe du lịch cao cấp')}</strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-200/60 dark:border-slate-700">
                        <span className="text-gray-500 dark:text-slate-400">
                          {isEn ? 'Hotel Standard' : 'Tiêu chuẩn phòng'}
                        </span>
                        <strong className="text-gray-800 dark:text-slate-200">{isEn ? '3 - 5 Star Hotel' : 'Khách sạn 3-5 sao'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA */}
                  <Link
                    to={`/tours/${tour.slug}`}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition"
                  >
                    <span>{isEn ? 'View & Book' : 'Xem chi tiết & Đặt'}</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
