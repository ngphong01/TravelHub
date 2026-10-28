import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import SEOHead from '../components/SEOHead';
import Skeleton from '../components/Skeleton';
import { useFeaturedDestinations } from '../hooks/useDestinations';
import { getToursPaged } from '../services/tour';
import { getHotelsPaged } from '../services/hotel';
import { getRestaurantsPaged } from '../services/restaurant';
import { getDestinationImageUrl } from '../utils/imageHelper';
import { getAuthenticImage, handleImageError } from '../utils/imageFallback';
import MegaSearchBar from '../components/MegaSearchBar';
import InteractiveTravelMap from '../components/InteractiveTravelMap';
import {
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  ShieldCheckIcon,
  BoltIcon,
  TicketIcon,
  CheckIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  CheckBadgeIcon,
} from '@heroicons/react/24/solid';

const HERO_IMAGE = '/images/destinations/ha-long.jpg';

// Cẩm nang du lịch
const TRAVEL_GUIDES = [
  {
    id: 1,
    title: 'Kinh nghiệm du lịch Phú Quốc 3N2Đ: Lịch trình tối ưu & Địa điểm check-in không thể bỏ lỡ',
    category: 'Cẩm nang biển đảo',
    readTime: '5 phút đọc',
    image: '/images/destinations/phu-quoc.jpg',
    link: '/destinations/phu-quoc',
  },
  {
    id: 2,
    title: 'Top 10 trải nghiệm ẩm thực phố cổ Hội An: Mì Quảng, Cao Lầu và Bánh Mì Phượng trứ danh',
    category: 'Văn hóa & Ẩm thực',
    readTime: '4 phút đọc',
    image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80',
    link: '/destinations/hoi-an',
  },
  {
    id: 3,
    title: 'Thời điểm vàng săn mây Sa Pa & Y Tý: Mẹo giữ ấm và cung đường ngắm ruộng bậc thang',
    category: 'Mẹo du lịch vùng cao',
    readTime: '6 phút đọc',
    image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80',
    link: '/destinations/sa-pa',
  },
];

// Các loại hình lưu trú phổ biến (Chuẩn Booking.com - Browse by property type)
const PROPERTY_TYPES = [
  {
    id: 1,
    name: 'Khách sạn cao cấp',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    link: '/hotels',
  },
  {
    id: 2,
    name: 'Khu nghỉ dưỡng & Spa',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    link: '/hotels?type=resort',
  },
  {
    id: 3,
    name: 'Biệt thự & Villa riêng tư',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    link: '/hotels?type=villa',
  },
  {
    id: 4,
    name: 'Du thuyền ngủ đêm',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    link: '/tours?q=du-thuyen',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { data: destinations, isLoading: loadingDestinations } = useFeaturedDestinations();
  const { i18n } = useTranslation();
  // Kéo Tour thực từ database
  const { data: toursData, isError: toursError, isLoading: toursLoading } = useQuery({
    queryKey: ['home-tours', i18n.language],
    queryFn: () => getToursPaged(1, 6),
    staleTime: 5 * 60 * 1000,
  });

  // Kéo Khách sạn thực từ database
  const { data: hotelsData, isError: hotelsError, isLoading: hotelsLoading } = useQuery({
    queryKey: ['home-hotels'],
    queryFn: () => getHotelsPaged(1, 6),
    staleTime: 5 * 60 * 1000,
  });

  // Kéo Nhà hàng & Ẩm thực thực từ database
  const { data: restaurantsData, isError: restaurantsError, isLoading: restaurantsLoading } = useQuery({
    queryKey: ['home-restaurants'],
    queryFn: () => getRestaurantsPaged(1, 4),
    staleTime: 5 * 60 * 1000,
  });

  const displayTours = toursData?.items || [];
  const displayHotels = hotelsData?.items || [];
  const displayRestaurants = restaurantsData?.items || [];

  const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'TravelHub',
    description: 'Nền tảng thương mại điện tử du lịch trực tuyến hàng đầu Việt Nam',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: ['https://www.facebook.com/travelhub'],
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <>
      <SEOHead
        title="TravelHub - Khám phá tour và lên kế hoạch du lịch"
        description="Tìm tour, xem lịch trình và tham khảo giá dịch vụ du lịch tại TravelHub."
        keywords="travelhub, du lịch, đặt tour, khách sạn, vé tham quan, booking, vietravel, lonely planet"
        image={`${siteUrl}/logo.png`}
        url={siteUrl}
        type="website"
        schema={organizationSchema}
      />

      <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
        {/* =========================================================================
            1. LUXURY CINEMATIC HERO SECTION (Cross-fade 4K Scenic Landscape Slides)
            ========================================================================= */}
        <section className="relative min-h-[400px] sm:min-h-[460px] text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center">
          <img src={HERO_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/65 to-slate-900/25 z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto w-full relative z-20">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
                Tìm chuyến đi phù hợp với bạn
              </h1>
              <p className="text-base sm:text-lg text-slate-100 leading-relaxed max-w-2xl">
                So sánh tour, xem lịch trình, giá và điều kiện dịch vụ trước khi lên kế hoạch.
              </p>
            </div>
          </div>

        </section>

        {/* =========================================================================
            2. LUXURY OVERLAPPING SEARCH BAR (Glassmorphism & High Contrast)
            ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-30">
          <MegaSearchBar />

          {/* Quick Destination Tags */}
          <div className="mt-4 flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
              Điểm đến thịnh hành:
            </span>
            {[
              { name: '🌊 Hạ Long', query: 'Hạ Long' },
              { name: '🌉 Đà Nẵng', query: 'Đà Nẵng' },
              { name: '🏝️ Phú Quốc', query: 'Phú Quốc' },
              { name: '⛰️ Sa Pa', query: 'Sa Pa' },
              { name: '🛶 Ninh Bình', query: 'Ninh Bình' },
              { name: '🌸 Đà Lạt', query: 'Đà Lạt' },
              { name: '🏮 Hội An', query: 'Hội An' },
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => navigate(`/tours?q=${encodeURIComponent(item.query)}`)}
                className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 transition-all duration-200 shadow-sm font-semibold cursor-pointer text-xs"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            3. VALUE PROPOSITIONS (Vibrant, high-end colorful cards with soft gradients)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Thông Tin Giá</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Xem giá niêm yết và xác nhận thuế, phí cùng điều kiện hoàn hủy trước khi thanh toán.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/20">
                <BoltIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Theo Dõi Đơn</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Xem trạng thái đơn đặt dịch vụ trong tài khoản sau khi gửi yêu cầu.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
                <TicketIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Thanh Toán Linh Hoạt</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Quét VietQR 24/7, ví MoMo, ZaloPay, VNPAY, Thẻ Visa/Master, PayPal.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/20">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Hỗ Trợ Lập Kế Hoạch</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Sử dụng công cụ gợi ý lịch trình và liên hệ hỗ trợ khi cần xác nhận dịch vụ.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            TÌM KIẾM THEO LOẠI CHỖ NGHỈ (Chuẩn Booking.com - Browse by property type)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Đa Dạng Loại Hình Nghỉ Dưỡng
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tìm Kiếm Theo Loại Chỗ Nghỉ
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Từ khách sạn 5 sao sang trọng đến biệt thự villa riêng tư và du thuyền vịnh ngọc
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {PROPERTY_TYPES.map((prop) => (
              <Link
                key={prop.id}
                to={prop.link}
                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-36 sm:h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={prop.image}
                    alt={prop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                      {prop.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Xem loại hình lưu trú
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* =========================================================================
            3. ĐIỂM ĐẾN THỊNH HÀNH (Chuẩn Booking.com: 2 ô lớn hàng đầu + 3 ô hàng tiếp theo)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Lựa Chọn Phổ Biến Nhất
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Điểm Đến Thịnh Hành Tại Việt Nam
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Các điểm đến được du khách trong nước và quốc tế tìm kiếm nhiều nhất
              </p>
            </div>
            <Link
              to="/destinations"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition group"
            >
              <span>Xem tất cả điểm đến</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingDestinations ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
              <Skeleton className="h-80 lg:col-span-3 rounded-2xl" />
              <Skeleton className="h-80 lg:col-span-3 rounded-2xl" />
              <Skeleton className="h-72 lg:col-span-2 rounded-2xl" />
              <Skeleton className="h-72 lg:col-span-2 rounded-2xl" />
              <Skeleton className="h-72 lg:col-span-2 rounded-2xl" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
              {(destinations?.slice(0, 5) || []).map((dest: any, idx: number) => {
                const img = getAuthenticImage(dest.image || getDestinationImageUrl(dest), dest.name || dest.slug, 'destination');
                const isLarge = idx < 2; // 2 ô đầu to chuẩn Booking.com
                return (
                  <Link
                    key={dest.id}
                    to={`/destinations/${dest.slug}`}
                    className={`group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-slate-900 border border-slate-200/80 dark:border-slate-800 ${
                      isLarge ? 'lg:col-span-3 h-80' : 'lg:col-span-2 h-72'
                    }`}
                  >
                    <img
                      src={img}
                      alt={dest.name}
                      onError={(e) => {
                        handleImageError(e, dest.name || dest.slug, 'destination');
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5">
                        <span>🇻🇳</span>
                        <span>{dest.region || 'Việt Nam'}</span>
                      </span>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10">
                        <StarIconSolid className="w-3.5 h-3.5" />
                        <span>4.9</span>
                      </div>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className={`font-bold text-white mb-1 group-hover:text-blue-300 transition-colors ${isLarge ? 'text-2xl' : 'text-lg'}`}>
                        {dest.name}
                      </h3>
                      <p className="text-xs text-slate-200 line-clamp-1 leading-relaxed mb-2">
                        {dest.description || 'Xem thông tin điểm đến'}
                      </p>
                      <div className="flex items-center justify-between pt-2.5 border-t border-white/15 text-xs text-white">
                        <span className="text-slate-300 font-medium">Xem điểm đến</span>
                        <ArrowRightIcon className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================================================================
            BẢN ĐỒ TƯƠNG TÁC DU LỊCH 3 MIỀN VIỆT NAM (Interactive Travel Map)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <InteractiveTravelMap />
        </section>

        {/* =========================================================================
            4. KHÁCH SẠN & RESORT ĐƯỢC YÊU THÍCH NHẤT (Booking.com Style: Rõ ràng, điểm số chuẩn, giá minh bạch)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                Nghỉ Dưỡng & Khách Sạn Cao Cấp
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Khách Sạn & Resort
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Xem thông tin khách sạn và giá theo đêm từ dữ liệu hiện có
              </p>
            </div>
            <Link
              to="/hotels"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition group"
            >
              <span>Xem tất cả khách sạn</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayHotels.length === 0 && <p className="text-slate-600">{hotelsLoading ? 'Đang tải khách sạn...' : hotelsError ? 'Chưa tải được dữ liệu khách sạn. Vui lòng thử lại sau.' : 'Chưa có khách sạn để hiển thị.'}</p>}
            {displayHotels.slice(0, 6).map((hotel: any) => {
              const price = Number(hotel.pricePerNight ?? 0);
              const originalPrice = Number(hotel.originalPrice ?? 0);
              const score = hotel.rating ? Number(hotel.rating).toFixed(1) : null;
              const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

              return (
                <div
                  key={hotel.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-400/40 hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/80 dark:border-slate-800 flex flex-col group ring-1 ring-black/5 dark:ring-white/5"
                >
                  {/* Image Container with Badges */}
                  <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={getAuthenticImage(hotel.image, hotel.name, 'hotel')}
                      alt={hotel.name}
                      onError={(e) => {
                        handleImageError(e, hotel.name, 'hotel');
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Right: Discount Pill */}
                    {discountPercent > 0 && (
                      <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black shadow-md">
                        -{discountPercent}%
                      </div>
                    )}

                    {/* Booking.com Score Badge */}
                    {score && <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 shadow-md">
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-white block leading-tight">Điểm hiển thị</span>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-inner">
                        {score}
                      </div>
                    </div>}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Location & Distance */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                        <MapPinIcon className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{hotel.city || hotel.address || 'Việt Nam'}</span>
                      </div>

                      {/* Hotel Name */}
                      <Link to={`/hotels/${hotel.slug}`}>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2">
                          {hotel.name}
                        </h3>
                      </Link>

                      {/* Room Type */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 truncate">
                        {hotel.roomType || 'Xem chi tiết phòng'}
                      </p>

                    </div>

                    {/* Footer: Price & Booking */}
                    <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-end justify-between">
                      <div>
                        {originalPrice > price && (
                          <span className="text-xs line-through text-slate-400 block font-medium">
                            {formatVND(originalPrice)}
                          </span>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-slate-400 font-medium">Từ</span>
                          <span className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                            {formatVND(price)}
                          </span>
                          <span className="text-xs text-slate-400 font-normal">/đêm</span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Thuế và phí cần xác nhận</span>
                      </div>

                      <Link
                        to={`/hotels/${hotel.slug}`}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md shadow-blue-500/20 active:scale-95"
                      >
                        Xem phòng
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            5. TOUR DU LỊCH BÁN CHẠY NHẤT (Vietravel Style: Lịch khởi hành rõ ràng, trọn gói)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 block mb-1">
                Tour Trọn Gói Định Kỳ
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Tour Du Lịch Nổi Bật
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Lịch trình chọn lọc, khởi hành định kỳ hàng tuần, dịch vụ chất lượng cao
              </p>
            </div>
            <Link
              to="/tours"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition group"
            >
              <span>Xem tất cả tour</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTours.length === 0 && <p className="text-slate-600">{toursLoading ? 'Đang tải tour...' : toursError ? 'Chưa tải được dữ liệu tour. Vui lòng thử lại sau.' : 'Chưa có tour để hiển thị.'}</p>}
            {displayTours.slice(0, 6).map((tour: any) => {
              const tourPrice = Number(tour.adultPrice ?? tour.price ?? 0);
              const originalPrice = Number(tour.originalPrice ?? 0);
              const img = getAuthenticImage(tour.image, tour.name || tour.slug, 'tour');
              const discountPercent = originalPrice > tourPrice ? Math.round(((originalPrice - tourPrice) / originalPrice) * 100) : 0;

              return (
                <div
                  key={tour.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-amber-400/40 hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/80 dark:border-slate-800 flex flex-col group ring-1 ring-black/5 dark:ring-white/5"
                >
                  {/* Card Header & Image */}
                  <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={img}
                      alt={tour.name}
                      onError={(e) => {
                        handleImageError(e, tour.name || tour.slug, 'tour');
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

                    {/* Discount Pill Top Left */}
                    {discountPercent > 0 && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black shadow-md flex items-center gap-1">
                        <BoltIcon className="w-3.5 h-3.5" />
                        <span>Tiết kiệm {discountPercent}%</span>
                      </div>
                    )}

                    {/* Destination Pill Top Right */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1 border border-white/10 shadow-sm">
                      <MapPinIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{tour.destination?.name || 'Chưa rõ điểm đến'}</span>
                    </div>

                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Vietravel Departure Schedule */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                        <span className="flex items-center gap-1">
                          <CalendarDaysIcon className="w-3.5 h-3.5 text-slate-400" />
                          Ngày đi theo lựa chọn
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                          {tour.duration ? `${tour.duration} ngày` : 'Đang cập nhật'}
                        </span>
                      </div>

                      {/* Tour Name */}
                      <Link to={`/tours/${tour.slug}`}>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-2">
                          {tour.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                        <StarIconSolid className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{tour.reviewCount ? tour.rating : '—'}</span>
                        <span>({tour.reviewCount ?? 0} đánh giá)</span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {tour.shortDescription || tour.description || 'Xem chi tiết lịch trình và dịch vụ.'}
                      </p>
                    </div>

                    {/* Card Footer: Pricing & Action */}
                    <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-end justify-between">
                      <div>
                        {originalPrice > tourPrice && (
                          <span className="text-xs line-through text-slate-400 block font-medium">
                            {formatVND(originalPrice)}
                          </span>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-slate-400 font-medium">Từ</span>
                          <span className="text-xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
                            {formatVND(tourPrice)}
                          </span>
                          <span className="text-xs text-slate-400 font-normal">/khách</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">✓ Trọn gói không phụ phí</span>
                      </div>

                      <Link
                        to={`/tours/${tour.slug}`}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md shadow-orange-500/25 active:scale-95"
                      >
                        Đặt tour
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            6. ẨM THỰC & NHÀ HÀNG NỔI BẬT (Tripadvisor Style: Điểm ăn uống ngon, giá chuẩn, món đặc sản)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                Khám Phá Hương Vị Bản Địa
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Ẩm Thực & Nhà Hàng Nổi Bật
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Tinh hoa ẩm thực 3 miền từ quán ngon truyền thống đến nhà hàng chuẩn Michelin
              </p>
            </div>
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition group"
            >
              <span>Xem tất cả nhà hàng</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayRestaurants.length === 0 && <p className="text-slate-600">{restaurantsLoading ? 'Đang tải nhà hàng...' : restaurantsError ? 'Chưa tải được dữ liệu nhà hàng. Vui lòng thử lại sau.' : 'Chưa có nhà hàng để hiển thị.'}</p>}
            {displayRestaurants.slice(0, 4).map((rest: any) => {
              return (
                <div
                  key={rest.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-emerald-400/40 hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/80 dark:border-slate-800 flex flex-col group ring-1 ring-black/5 dark:ring-white/5"
                >
                  {/* Card Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={getAuthenticImage(rest.image, rest.name, 'restaurant')}
                      alt={rest.name}
                      onError={(e) => {
                        handleImageError(e, rest.name, 'restaurant');
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

                    {/* Cuisine Tag */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 shadow-sm">
                      <span>{rest.cuisine || 'Nhà hàng'}</span>
                    </div>

                    {/* Price Range Pill */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-[11px] font-bold border border-white/10">
                      <span>{rest.priceRange || 'Xem chi tiết'}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Location & Ranking */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                        <MapPinIcon className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{rest.city || 'Chưa rõ địa điểm'}</span>
                      </div>

                      {/* Restaurant Name */}
                      <Link to={rest.slug ? `/restaurants/${rest.slug}` : `/restaurants`}>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-2">
                          {rest.name}
                        </h3>
                      </Link>

                      {/* TripAdvisor Badge Ranking */}
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mb-3 w-full border border-emerald-200/50 dark:border-emerald-800/50">
                        <SparklesIcon className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{rest.ranking || 'Xem thông tin nhà hàng'}</span>
                      </div>

                      {/* Signature Dish */}
                      {rest.signatureDish && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Món đặc trưng: </span>
                          {rest.signatureDish}
                        </p>
                      )}
                    </div>

                    {/* Card Footer: Rating & CTA */}
                    <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs">
                        <StarIconSolid className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-slate-900 dark:text-white">{rest.rating ?? '—'}</span>
                      </div>

                      <Link
                        to={rest.slug ? `/restaurants/${rest.slug}` : `/restaurants`}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md shadow-emerald-500/20 active:scale-95"
                      >
                        Khám phá
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            7. ĐÁNH GIÁ THỰC TẾ TỪ KHÁCH HÀNG (Tripadvisor Style: Người thật việc thật)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                Cẩm Nang Du Lịch Bản Địa
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Góc Cảm Hứng & Kinh Nghiệm
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Những bài viết chỉ dẫn thực tế giúp chuyến đi của bạn thêm phần trọn vẹn
              </p>
            </div>
            <Link
              to="/stories"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition group"
            >
              <span>Xem tất cả bài viết</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRAVEL_GUIDES.map((guide) => (
              <Link
                key={guide.id}
                to={guide.link}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/80 dark:border-slate-800 flex flex-col group ring-1 ring-black/5 dark:ring-white/5"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow-sm">
                    {guide.category}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-slate-200 text-[11px] font-medium border border-white/10">
                    {guide.readTime}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-3">
                    {guide.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Đọc cẩm nang</span>
                    <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
