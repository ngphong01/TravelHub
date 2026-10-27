import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FireIcon,
  ClockIcon,
  SparklesIcon,
  ArrowRightIcon,
  TagIcon,
  BoltIcon
} from '@heroicons/react/24/solid';
import { getAuthenticImage, handleImageError } from '../utils/imageFallback';

interface DealItem {
  id: number;
  title: string;
  destination: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  slotsRemaining: number;
  slug: string;
}

const SAMPLE_DEALS: DealItem[] = [
  {
    id: 1,
    title: 'Tour Hạ Long 2N1Đ - Du thuyền 5 Sao Heritage',
    destination: 'Vịnh Hạ Long',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    originalPrice: 3890000,
    discountedPrice: 2490000,
    discountPercent: 36,
    slotsRemaining: 3,
    slug: 'tour-ha-long-2n1d-du-thuyen-5-sao',
  },
  {
    id: 2,
    title: 'Tour Đà Nẵng - Bà Nà Hills - Cầu Vàng 3N2Đ',
    destination: 'Đà Nẵng',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    originalPrice: 4500000,
    discountedPrice: 2990000,
    discountPercent: 34,
    slotsRemaining: 5,
    slug: 'tour-da-nang-ba-na-hills-3n2d',
  },
  {
    id: 3,
    title: 'Nghỉ dưỡng Đảo Ngọc Phú Quốc 3N2Đ Resort 5 Sao',
    destination: 'Phú Quốc',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
    originalPrice: 5200000,
    discountedPrice: 3390000,
    discountPercent: 35,
    slotsRemaining: 2,
    slug: 'nghi-duong-phu-quoc-3n2d',
  },
];

export default function FlashSaleBanner() {
  // 3 hours, 45 minutes, 20 seconds initial countdown
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 45,
    seconds: 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatPrice = (val: number) => {
    return val.toLocaleString('vi-VN') + ' đ';
  };

  const padZero = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="w-full my-12">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header with Live Countdown */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <BoltIcon className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Flash Sale Giới Hạn</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Deal Du Lịch Chớp Nhoáng</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-rose-500 text-white text-xs font-black uppercase">
                HOT
              </span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Ưu đãi độc quyền trong ngày - Giảm giá trực tiếp tới 45% cho các tour hot nhất
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-3.5 rounded-2xl self-start md:self-auto">
            <ClockIcon className="w-5 h-5 text-amber-400 animate-spin-slow" />
            <span className="text-xs font-semibold text-slate-300 uppercase">Kết thúc sau:</span>
            <div className="flex items-center gap-1.5 font-mono font-black text-white text-lg sm:text-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                {padZero(timeLeft.hours)}
              </div>
              <span className="text-amber-400">:</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                {padZero(timeLeft.minutes)}
              </div>
              <span className="text-amber-400">:</span>
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 animate-pulse">
                {padZero(timeLeft.seconds)}
              </div>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {SAMPLE_DEALS.map((deal) => (
            <div
              key={deal.id}
              className="bg-slate-800/80 hover:bg-slate-800 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              {/* Image & Discount Badge */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getAuthenticImage(deal.image, deal.destination || deal.title, 'tour')}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    handleImageError(e, deal.destination || deal.title, 'tour');
                  }}
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-xs shadow-lg flex items-center gap-1">
                  <TagIcon className="w-3.5 h-3.5" />
                  <span>-{deal.discountPercent}%</span>
                </div>
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-slate-200 text-[11px] font-semibold">
                  {deal.destination}
                </div>
              </div>

              {/* Deal Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base line-clamp-2 group-hover:text-amber-400 transition mb-3">
                    <Link to={`/tours/${deal.slug}`}>{deal.title}</Link>
                  </h3>

                  {/* Progress bar for remaining spots */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
                      <span className="flex items-center gap-1 text-amber-400">
                        <FireIcon className="w-3.5 h-3.5" />
                        Chỉ còn {deal.slotsRemaining} chỗ cuối
                      </span>
                      <span>Đã bán 88%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                        style={{ width: '88%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 line-through block">
                      {formatPrice(deal.originalPrice)}
                    </span>
                    <span className="text-lg font-black text-amber-400">
                      {formatPrice(deal.discountedPrice)}
                    </span>
                  </div>
                  <Link
                    to={`/tours/${deal.slug}`}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1 group/btn"
                  >
                    <span>Săn deal</span>
                    <ArrowRightIcon className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Deals CTA */}
        <div className="relative z-10 mt-8 text-center">
          <Link
            to="/deals"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition group"
          >
            <span>Xem tất cả ưu đãi Flash Sale hôm nay</span>
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
