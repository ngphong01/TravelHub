import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  TagIcon,
  ClockIcon,
  SparklesIcon,
  FireIcon,
  TicketIcon,
  CheckBadgeIcon,
  MapPinIcon,
  StarIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  GiftIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { getTours, Tour } from '../services/tour';
import { getActivePromos, PromoCode } from '../services/promo';
import { getTourImageUrl } from '../utils/imageHelper';
import SEOHead from '../components/SEOHead';
import Skeleton from '../components/Skeleton';

type TabType = 'all' | 'flash' | 'combo' | 'voucher';

interface ComboDeal {
  id: string;
  title: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  imageUrl: string;
  destination: string;
  duration: string;
  rating: number;
  reviewCount: number;
  includes: string[];
  tag: string;
}

const LUXURY_COMBOS: ComboDeal[] = [
  {
    id: 'combo-halong',
    title: 'Combo Du Thuyền Hạ Long 5 Sao + Khách Sạn View Vịnh',
    originalPrice: 4850000,
    salePrice: 3390000,
    discount: 30,
    imageUrl: '/uploads/tours/halong-bay-karsts.jpg',
    destination: 'Hạ Long',
    duration: '3 ngày 2 đêm',
    rating: 4.9,
    reviewCount: 342,
    includes: ['Cabin du thuyền 5 sao', '3 bữa Buffet hải sản', 'Vé chèo kayak & Hang Sửng Sốt', 'Xe limousine đưa đón Hà Nội'],
    tag: 'Bán chạy nhất',
  },
  {
    id: 'combo-phuquoc',
    title: 'Combo Phú Quốc Nghỉ Dưỡng Bãi Dài + Cáp Treo Hòn Thơm',
    originalPrice: 6200000,
    salePrice: 4340000,
    discount: 30,
    imageUrl: '/uploads/tours/phuquoc-sunset-sanato.jpg',
    destination: 'Phú Quốc',
    duration: '4 ngày 3 đêm',
    rating: 4.9,
    reviewCount: 520,
    includes: ['Resort 5 sao sát biển', 'Buffet sáng mỗi ngày', 'Vé Cáp treo Sun World 2 chiều', 'Tour cano 4 đảo ngắm san hô'],
    tag: 'Siêu HOT',
  },
  {
    id: 'combo-danang',
    title: 'Combo Đà Nẵng - Hội An: Khách Sạn Mỹ Khê + Vé Cầu Vàng',
    originalPrice: 4200000,
    salePrice: 2940000,
    discount: 30,
    imageUrl: '/uploads/tours/danang-golden-bridge.jpg',
    destination: 'Đà Nẵng & Hội An',
    duration: '3 ngày 2 đêm',
    rating: 4.8,
    reviewCount: 418,
    includes: ['Khách sạn 4 sao view biển', 'Vé cáp treo Bà Nà Hills & Buffet', 'Tour xích lô phố cổ Hội An', 'Đưa đón sân bay Đà Nẵng'],
    tag: 'Ưu đãi gia đình',
  },
  {
    id: 'combo-dalat',
    title: 'Combo Đà Lạt Săn Mây + Resort Rừng Thông Hồ Tuyền Lâm',
    originalPrice: 3600000,
    salePrice: 2520000,
    discount: 30,
    imageUrl: '/uploads/tours/dalat-sanmay.jpg',
    destination: 'Đà Lạt',
    duration: '3 ngày 2 đêm',
    rating: 4.9,
    reviewCount: 289,
    includes: ['Villa phong cách Pháp', 'Tour săn mây đón bình minh', 'Vé tham quan Thung lũng Tình Yêu', 'Tiệc nướng BBQ tối ấm cúng'],
    tag: 'Lãng mạn',
  },
];

export default function Deals() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string>('all');

  // Flash sale countdown timer (resets every 24 hours)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real tours from backend
  const { data: tours = [], isLoading: isLoadingTours } = useQuery({
    queryKey: ['tours', 'deals'],
    queryFn: getTours,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch active promo codes
  const { data: promos = [], isLoading: isLoadingPromos } = useQuery({
    queryKey: ['promos', 'active', 'deals'],
    queryFn: () => getActivePromos(20),
    staleTime: 5 * 60 * 1000,
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Generate flash sale tours from real tours
  const flashSaleTours = tours.slice(0, 8).map((tour, idx) => {
    const discountRate = idx % 2 === 0 ? 0.35 : 0.25;
    const basePrice = tour.price && tour.price > 0 ? tour.price : 2500000;
    const originalPrice = Math.round(basePrice / (1 - discountRate));
    return {
      ...tour,
      salePrice: basePrice,
      originalPrice,
      discountPercent: Math.round(discountRate * 100),
      tag: idx === 0 ? 'Cháy vé' : idx === 1 ? 'Giảm sâu nhất' : 'Hot hôm nay',
    };
  });

  const filteredCombos = selectedDestination === 'all'
    ? LUXURY_COMBOS
    : LUXURY_COMBOS.filter((c) => c.destination.toLowerCase().includes(selectedDestination.toLowerCase()));

  const filteredTours = selectedDestination === 'all'
    ? flashSaleTours
    : flashSaleTours.filter((t) => t.destination?.name?.toLowerCase().includes(selectedDestination.toLowerCase()) || t.name.toLowerCase().includes(selectedDestination.toLowerCase()));

  return (
    <>
      <SEOHead
        title="Săn Deal Du Lịch & Combo Ưu Đãi Độc Quyền - TravelHub"
        description="Tổng hợp khuyến mãi tour du lịch, combo vé máy bay + khách sạn và mã giảm giá tốt nhất hôm nay. Giảm đến 50% chỉ có tại TravelHub."
        url="/deals"
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
        {/* =========================================================================
            1. HERO SECTION: ROYAL NAVY & GOLD LUXURY BANNER
            ========================================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#00224f] via-[#003580] to-[#0f172a] text-white py-16 sm:py-20">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
                backgroundSize: '36px 36px',
              }}
            />
          </div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full text-blue-200 text-sm font-semibold mb-6 shadow-sm">
              <FireIcon className="h-5 w-5 text-amber-400 animate-bounce" />
              <span>Đại Tiệc Ưu Đãi Du Lịch 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
              Săn Deal Du Lịch <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">Giảm Đến 50%</span>
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
              Khám phá trọn vẹn vẻ đẹp Việt Nam với các gói combo khách sạn 5 sao, vé máy bay và tour trọn gói giá tốt nhất được cập nhật mỗi ngày.
            </p>

            {/* Countdown Clock */}
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-xl">
              <ClockIcon className="h-6 w-6 text-amber-400 flex-shrink-0" />
              <div className="text-left">
                <span className="text-xs text-blue-200 block font-semibold uppercase tracking-wider">Flash Sale kết thúc sau:</span>
                <div className="flex items-center gap-2 text-xl sm:text-2xl font-black text-amber-300 font-mono mt-0.5">
                  <span className="bg-black/30 px-2 py-0.5 rounded-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span>:</span>
                  <span className="bg-black/30 px-2 py-0.5 rounded-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span>:</span>
                  <span className="bg-black/30 px-2 py-0.5 rounded-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. NAVIGATION TABS & DESTINATION FILTERS
            ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-2 sm:p-3 flex flex-wrap items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all' as TabType, label: 'Tất Cả Ưu Đãi', icon: SparklesIcon },
                { id: 'flash' as TabType, label: 'Flash Sale 24h', icon: FireIcon },
                { id: 'combo' as TabType, label: 'Combo Du Lịch', icon: TagIcon },
                { id: 'voucher' as TabType, label: 'Kho Voucher', icon: TicketIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Destination Select */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-slate-400 uppercase hidden md:inline">Điểm đến:</span>
              {['all', 'Hạ Long', 'Phú Quốc', 'Đà Lạt', 'Đà Nẵng', 'Ninh Bình'].map((dest) => (
                <button
                  key={dest}
                  onClick={() => setSelectedDestination(dest)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedDestination === dest
                      ? 'bg-amber-400 text-slate-900 font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {dest === 'all' ? 'Tất cả' : dest}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. MAIN CONTENT SECTIONS
            ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {/* A. VOUCHER CARDS (TICKET STRIP) */}
          {(activeTab === 'all' || activeTab === 'voucher') && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                    <TicketIcon className="h-4 w-4" />
                    <span>Voucher Độc Quyền</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    Mã Giảm Giá Đang Mở Dùng
                  </h2>
                </div>
                <Link to="/promo-codes" className="text-xs sm:text-sm font-bold text-blue-600 hover:underline">
                  Xem tất cả mã →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { code: 'TRAVELHUB2026', discount: 'Giảm 500K', desc: 'Đơn từ 3 triệu cho tour trọn gói', badge: 'Voucher Năm Mới' },
                  { code: 'MEMBER10', discount: 'Giảm 10%', desc: 'Độc quyền thành viên VIP TravelHub', badge: 'VIP Member' },
                  { code: 'EARLYBIRD', discount: 'Giảm 300K', desc: 'Khi đặt tour trước ngày khởi hành 20 ngày', badge: 'Đặt Sớm' },
                  { code: 'GROUP5', discount: 'Giảm 5%', desc: 'Áp dụng cho nhóm bạn hoặc gia đình từ 4 người', badge: 'Đi Nhóm' },
                ].map((voucher) => (
                  <div
                    key={voucher.code}
                    className="relative bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition-all"
                  >
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-md self-start mb-2">
                      {voucher.badge}
                    </span>
                    <div className="text-xl font-black text-blue-600 dark:text-blue-400 mb-1">
                      {voucher.discount}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                      {voucher.desc}
                    </p>

                    <div className="pt-3 border-t border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {voucher.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(voucher.code)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                          copiedCode === voucher.code
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {copiedCode === voucher.code ? 'Đã chép!' : 'Lưu mã'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* B. COMBO PACKAGES (FLIGHT + HOTEL + TOUR) */}
          {(activeTab === 'all' || activeTab === 'combo') && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                    <TagIcon className="h-4 w-4" />
                    <span>Gói Tiết Kiệm Nhất</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    Gói Combo Nghỉ Dưỡng Trọn Gói 2026
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">{filteredCombos.length} combo cao cấp</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCombos.map((combo) => (
                  <div
                    key={combo.id}
                    className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
                      <img
                        src={combo.imageUrl}
                        alt={combo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/uploads/tours/halong-bay-karsts.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-white text-[11px] font-bold rounded-lg shadow-md">
                        {combo.tag}
                      </span>
                      <span className="absolute top-3 right-3 px-2.5 py-1 bg-rose-600 text-white text-xs font-black rounded-lg shadow-md">
                        -{combo.discount}%
                      </span>
                      <div className="absolute bottom-3 left-3 text-white text-xs flex items-center gap-1 font-semibold">
                        <MapPinIcon className="h-4 w-4 text-amber-400" />
                        <span>{combo.destination}</span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-amber-500 mb-1.5">
                          <StarIconSolid className="h-4 w-4" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">{combo.rating}</span>
                          <span className="text-slate-400">({combo.reviewCount} đánh giá)</span>
                        </div>

                        <h3 className="font-black text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors mb-3">
                          {combo.title}
                        </h3>

                        <ul className="space-y-1.5 mb-4 text-xs text-slate-600 dark:text-slate-400">
                          {combo.includes.map((item, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span className="truncate">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-xs text-slate-400 line-through">
                            {combo.originalPrice.toLocaleString('vi-VN')}đ
                          </span>
                          <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                            {combo.salePrice.toLocaleString('vi-VN')}đ
                          </span>
                        </div>

                        <Link
                          to={`/checkout?type=combo&amount=${combo.salePrice}&title=${encodeURIComponent(combo.title)}`}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl text-center block transition-all shadow-md"
                        >
                          Đặt Combo Ngay
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* C. FLASH SALE TOURS (REAL DATABASE TOURS) */}
          {(activeTab === 'all' || activeTab === 'flash') && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                    <FireIcon className="h-4 w-4" />
                    <span>Giảm Giá Giờ Vàng</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    Tour Du Lịch Giảm Giá Sốc Hôm Nay
                  </h2>
                </div>
                <Link to="/tours" className="text-xs sm:text-sm font-bold text-blue-600 hover:underline">
                  Xem tất cả tour →
                </Link>
              </div>

              {isLoadingTours ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <Skeleton key={n} className="h-80 rounded-3xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredTours.map((tour) => {
                    const imgUrl = getTourImageUrl(tour.image);
                    return (
                      <div
                        key={tour.id}
                        className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
                          <img
                            src={imgUrl}
                            alt={tour.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/uploads/tours/halong-bay-karsts.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-rose-600 text-white text-[11px] font-bold rounded-lg shadow-md">
                            {tour.tag}
                          </span>
                          <span className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-white text-xs font-black rounded-lg shadow-md">
                            -{tour.discountPercent}%
                          </span>
                          <div className="absolute bottom-3 left-3 text-white text-xs flex items-center gap-1 font-semibold">
                            <MapPinIcon className="h-4 w-4 text-amber-400" />
                            <span>{tour.destination?.name || 'Việt Nam'}</span>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1 text-xs text-amber-500 mb-1.5">
                              <StarIconSolid className="h-4 w-4" />
                              <span className="font-bold text-slate-800 dark:text-slate-200">{tour.rating || 4.9}</span>
                              <span className="text-slate-400">({tour.reviewCount || 120} đánh giá)</span>
                            </div>

                            <h3 className="font-black text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                              {tour.name}
                            </h3>

                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                              {tour.shortDescription || tour.description || 'Hành trình khám phá tuyệt vời cùng hướng dẫn viên chuyên nghiệp và dịch vụ trọn gói chuẩn 5 sao.'}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="text-xs text-slate-400 line-through">
                                {tour.originalPrice.toLocaleString('vi-VN')}đ
                              </span>
                              <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                                {tour.salePrice.toLocaleString('vi-VN')}đ
                              </span>
                            </div>

                            <Link
                              to={`/tours/${tour.slug}`}
                              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl text-center block transition-all shadow-md"
                            >
                              Xem Chi Tiết & Đặt Vé
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* D. BRAND GUARANTEES */}
          <section className="bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-blue-900/10 dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-blue-200/50 dark:border-blue-900/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                  <ShieldCheckIcon className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900 dark:text-white mb-1">Cam Kết Giá Rẻ Nhất</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Hoàn tiền 100% phần chênh lệch nếu bạn tìm thấy giá tour cùng chất lượng rẻ hơn trên thị trường.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                  <CheckBadgeIcon className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900 dark:text-white mb-1">Xác Nhận Tức Thì</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Nhận vé điện tử và hợp đồng tour qua email & Zalo ngay khi hoàn tất thanh toán trong 30 giây.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                  <ClockIcon className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900 dark:text-white mb-1">Hỗ Trợ Đổi Hủy 24/7</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Hỗ trợ linh hoạt đổi ngày khởi hành hoặc hủy tour theo quy định minh bạch, hoàn tiền nhanh chóng.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
