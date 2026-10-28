import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPinIcon,
  StarIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/solid';
import { getAuthenticImage, handleImageError } from '../utils/imageFallback';

interface MapPin {
  id: string;
  name: string;
  region: 'north' | 'central' | 'south';
  top: string; // percentage on map
  left: string; // percentage on map
  image: string;
  priceFrom: string;
  rating: number;
  toursCount: number;
  tag: string;
  slug: string;
}

const VIETNAM_PINS: MapPin[] = [
  // Miền Bắc
  {
    id: 'sapa',
    name: 'Sa Pa - Fansipan',
    region: 'north',
    top: '12%',
    left: '32%',
    image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
    priceFrom: '1.990.000 đ',
    rating: 4.9,
    toursCount: 6,
    tag: 'Săn mây & Bản làng',
    slug: 'sa-pa',
  },
  {
    id: 'hanoi',
    name: 'Thủ Đô Hà Nội',
    region: 'north',
    top: '18%',
    left: '46%',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    priceFrom: '950.000 đ',
    rating: 4.8,
    toursCount: 12,
    tag: 'Văn hóa 36 phố phường',
    slug: 'ha-noi',
  },
  {
    id: 'halong',
    name: 'Vịnh Hạ Long',
    region: 'north',
    top: '20%',
    left: '58%',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    priceFrom: '2.490.000 đ',
    rating: 5.0,
    toursCount: 8,
    tag: 'Di sản thế giới',
    slug: 'vinh-ha-long',
  },
  {
    id: 'ninhbinh',
    name: 'Ninh Bình - Tràng An',
    region: 'north',
    top: '24%',
    left: '49%',
    image: '/images/destinations/ninh-binh.jpg',
    priceFrom: '1.250.000 đ',
    rating: 4.9,
    toursCount: 5,
    tag: 'Non nước kỳ vĩ',
    slug: 'ninh-binh',
  },

  // Miền Trung
  {
    id: 'hue',
    name: 'Cố Đô Huế',
    region: 'central',
    top: '42%',
    left: '52%',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    priceFrom: '1.890.000 đ',
    rating: 4.8,
    toursCount: 7,
    tag: 'Lăng tẩm hoàng cung',
    slug: 'hue',
  },
  {
    id: 'danang',
    name: 'Đà Nẵng - Hội An',
    region: 'central',
    top: '47%',
    left: '58%',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
    priceFrom: '2.850.000 đ',
    rating: 5.0,
    toursCount: 15,
    tag: 'Cầu Vàng & Phố cổ',
    slug: 'da-nang',
  },
  {
    id: 'nhatrang',
    name: 'Biển Nha Trang',
    region: 'central',
    top: '64%',
    left: '68%',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    priceFrom: '2.690.000 đ',
    rating: 4.9,
    toursCount: 9,
    tag: 'Vịnh biển nhiệt đới',
    slug: 'nha-trang',
  },
  {
    id: 'dalat',
    name: 'Đà Lạt Ngàn Hoa',
    region: 'central',
    top: '68%',
    left: '59%',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    priceFrom: '2.190.000 đ',
    rating: 4.9,
    toursCount: 11,
    tag: 'Khí hậu ôn đới mát mẻ',
    slug: 'da-lat',
  },

  // Miền Nam
  {
    id: 'hcm',
    name: 'TP. Hồ Chí Minh',
    region: 'south',
    top: '78%',
    left: '51%',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
    priceFrom: '1.490.000 đ',
    rating: 4.8,
    toursCount: 14,
    tag: 'Đô thị năng động',
    slug: 'tp-ho-chi-minh',
  },
  {
    id: 'phuquoc',
    name: 'Đảo Ngọc Phú Quốc',
    region: 'south',
    top: '88%',
    left: '30%',
    image: '/images/destinations/phu-quoc.jpg',
    priceFrom: '3.490.000 đ',
    rating: 5.0,
    toursCount: 10,
    tag: 'Hoàng hôn biển bãi Sao',
    slug: 'phu-quoc',
  },
];

export default function InteractiveTravelMap() {
  const [activeRegion, setActiveRegion] = useState<'all' | 'north' | 'central' | 'south'>('all');
  const [selectedPin, setSelectedPin] = useState<MapPin>(VIETNAM_PINS[1]); // Default Đà Nẵng / Hà Nội

  const filteredPins = activeRegion === 'all'
    ? VIETNAM_PINS
    : VIETNAM_PINS.filter((p) => p.region === activeRegion);

  return (
    <div className="w-full my-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 inline-block mb-3">
          Bản Đồ Số Du Lịch Việt Nam
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Khám Phá Điểm Đến 3 Miền
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-slate-400">
          Chạm vào từng điểm ghim trên bản đồ để tra cứu nhanh thông tin, giá vé và các hành trình hấp dẫn nhất.
        </p>

        {/* Region Filter Buttons */}
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          {[
            { id: 'all', label: 'Toàn quốc' },
            { id: 'north', label: 'Miền Bắc' },
            { id: 'central', label: 'Miền Trung' },
            { id: 'south', label: 'Miền Nam' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRegion(r.id as any)}
              className={`px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                activeRegion === r.id
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-cyan-500/25 scale-105'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200/80 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Detail Split View */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Interactive Map Container */}
        <div className="lg:col-span-7 relative h-[450px] sm:h-[550px] bg-gradient-to-b from-cyan-500/5 via-teal-500/5 to-transparent rounded-2xl border border-cyan-100/50 dark:border-cyan-900/30 overflow-hidden flex items-center justify-center p-4">
          {/* Subtle Map SVG Background Outline */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20 pointer-events-none">
            <svg viewBox="0 0 400 800" className="h-full w-auto">
              <path
                d="M 160 50 Q 220 80 200 130 T 210 220 Q 230 280 215 360 T 225 480 Q 250 560 210 650 T 150 750"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-cyan-500/40"
              />
            </svg>
          </div>

          {/* Interactive Destination Pins */}
          {filteredPins.map((pin) => {
            const isSelected = selectedPin.id === pin.id;
            return (
              <div
                key={pin.id}
                style={{ top: pin.top, left: pin.left }}
                onClick={() => setSelectedPin(pin)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              >
                {/* Ping wave animation for selected pin */}
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-cyan-400 opacity-75 animate-ping" />
                )}

                {/* Pin Head */}
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-cyan-500 to-teal-400 text-white scale-125 shadow-cyan-500/40 ring-4 ring-cyan-200 dark:ring-cyan-800'
                      : 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-slate-700 hover:scale-110 hover:bg-cyan-50'
                  }`}
                >
                  <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {/* Pin Tooltip */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2.5 py-1 rounded-xl bg-slate-900/90 text-white text-[11px] font-bold whitespace-nowrap shadow-md pointer-events-none transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {pin.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Selected Destination Card */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-slate-700 shadow-xl relative overflow-hidden transition-all duration-300">
            {/* Top Image */}
            <div className="relative h-56 rounded-2xl overflow-hidden mb-6 shadow-md">
              <img
                src={getAuthenticImage(selectedPin.image, selectedPin.name, 'destination')}
                alt={selectedPin.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  handleImageError(e, selectedPin.name, 'destination');
                }}
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                {selectedPin.tag}
              </div>
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold flex items-center gap-1 shadow-md">
                <StarIcon className="w-4 h-4 text-white" />
                <span>{selectedPin.rating}</span>
              </div>
            </div>

            {/* Info */}
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {selectedPin.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mb-6">
              Hiện có <strong className="text-cyan-600 dark:text-cyan-400">{selectedPin.toursCount} tour du lịch</strong> đang mở bán với nhiều lịch trình hấp dẫn, trải nghiệm văn hóa và ẩm thực bản địa độc đáo.
            </p>

            {/* Price & Action */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 block uppercase font-medium">Giá chỉ từ</span>
                <span className="text-xl sm:text-2xl font-black text-cyan-600 dark:text-cyan-400">
                  {selectedPin.priceFrom}
                </span>
              </div>

              <Link
                to={`/destinations/${selectedPin.slug}`}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition flex items-center gap-2 group"
              >
                <span>Xem Tour ngay</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
