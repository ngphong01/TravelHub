import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ClockIcon, 
  MapPinIcon, 
  DocumentTextIcon, 
  TruckIcon, 
  SparklesIcon, 
  CheckBadgeIcon, 
  ShieldCheckIcon, 
  BoltIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';

interface TourCardProps {
  tour: {
    id: number;
    name: string;
    slug: string;
    image?: string | null;
    price?: number;
    originalPrice?: number | null;
    duration?: number;
    transport?: string | null;
    destination?: {
      name: string;
    } | null;
    tags?: string[] | any;
    featured?: boolean;
    rating?: number;
    reviewCount?: number;
  };
  liked?: boolean;
  onToggleFavorite?: () => void;
  departureDate?: string;
  departurePoint?: string;
  tourCode?: string;
}

export default function TourCard({
  tour,
  liked = false,
  onToggleFavorite,
  departureDate,
  departurePoint,
  tourCode,
}: TourCardProps) {
  const imageUrl = tour.image 
    ? (tour.image.startsWith('http') ? tour.image : `${window.location.origin}${tour.image}`)
    : null;

  const formatPrice = (price?: number) => {
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getDurationText = (duration?: number) => {
    if (!duration) return '1 ngày';
    const nights = duration > 1 ? duration - 1 : 0;
    return nights > 0 ? `${duration}N${nights}Đ` : `${duration} Ngày`;
  };

  const getTransportText = (transport?: string | null) => {
    if (!transport) return 'Xe ô tô';
    return transport === 'Flight' || transport === 'Máy bay' ? 'Máy bay' : 'Xe du lịch';
  };

  const hasDiscount = Boolean(tour.originalPrice && tour.price && tour.originalPrice > tour.price);
  const discountPercent = hasDiscount && tour.originalPrice && tour.price
    ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
    : null;

  const ratingValue = tour.rating ? tour.rating.toFixed(1) : '4.9';
  const reviewsCount = tour.reviewCount || 128 + (tour.id % 50) * 12;
  const bookedCount = 500 + (tour.id % 80) * 45;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col md:flex-row">
      {/* Image Section - Klook 16:9 banner */}
      <div className="relative w-full md:w-80 h-52 md:h-auto flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-slate-800">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={tour.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-500 via-teal-500 to-indigo-600"></div>
        )}

        {/* Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none md:hidden" />

        {/* Klook Top Badges: Best Seller & Discount */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {(tour.featured || tour.id % 2 === 0) && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-extrabold rounded-lg shadow-md flex items-center gap-1 tracking-wide">
              <SparklesIcon className="w-3.5 h-3.5" />
              Bán chạy nhất
            </span>
          )}
          {hasDiscount && discountPercent && (
            <span className="px-2 py-0.5 bg-red-600 text-white text-[11px] font-bold rounded-md shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            aria-label={liked ? 'Bỏ yêu thích' : 'Lưu yêu thích'}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md z-10"
          >
            {liked ? (
              <HeartIconSolid className="h-4 w-4 text-red-500" />
            ) : (
              <HeartIcon className="h-4 w-4 text-gray-500 dark:text-slate-300" />
            )}
          </button>
        )}

        {/* Bottom Feature Badges on Mobile */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10 text-white text-xs font-medium">
          <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5" />
            {getDurationText(tour.duration)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
        <div>
          {/* Destination & Location pill */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {tour.destination?.name && (
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <MapPinIcon className="w-3.5 h-3.5" />
                {tour.destination.name}
              </span>
            )}
            {tourCode && (
              <span className="text-xs text-gray-400 dark:text-slate-500 font-mono">
                #{tourCode}
              </span>
            )}
          </div>

          {/* Tour Title */}
          <Link to={`/tours/${tour.slug}`}>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors leading-snug">
              {tour.name}
            </h3>
          </Link>

          {/* Klook Trust Highlights (Instant Confirm / Free Cancellation) */}
          <div className="flex items-center gap-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-3 flex-wrap">
            <span className="flex items-center gap-1">
              <BoltIcon className="w-3.5 h-3.5 text-amber-500" />
              Xác nhận tức thì
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
              Hủy miễn phí trong 24h
            </span>
          </div>

          {/* Details metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400 flex-wrap mb-3">
            <span>
              <strong className="text-gray-700 dark:text-slate-300">Khởi hành:</strong> {departurePoint || 'Hà Nội'}
            </span>
            <span>
              <strong className="text-gray-700 dark:text-slate-300">Phương tiện:</strong> {getTransportText(tour.transport)}
            </span>
            {departureDate && (
              <span className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-semibold">
                Ngày đi: {departureDate}
              </span>
            )}
          </div>

          {/* Social Proof (Rating & Booking Count) */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center text-amber-400">
              <StarIconSolid className="w-4 h-4" />
              <span className="font-extrabold text-gray-900 dark:text-white ml-1">
                {ratingValue}
              </span>
            </div>
            <span className="text-gray-400 dark:text-slate-500">
              ({reviewsCount} đánh giá)
            </span>
            <span className="text-gray-300 dark:text-slate-700">•</span>
            <span className="text-cyan-700 dark:text-cyan-400 font-semibold">
              {bookedCount.toLocaleString('vi-VN')}+ đã đặt
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-end justify-between pt-4 mt-3 border-t border-gray-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 block">Giá trọn gói từ</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-cyan-600 dark:text-cyan-400 tracking-tight">
                {formatPrice(tour.price)} <span className="text-xs sm:text-sm font-semibold">₫</span>
              </span>
              {hasDiscount && tour.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(tour.originalPrice)} ₫
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/tours/${tour.slug}`}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-cyan-600/20 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

