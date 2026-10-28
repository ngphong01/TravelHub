import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getTourBySlug, getToursPaged } from '../services/tour';
import { useLanguage } from '../contexts/LanguageContext';
import Skeleton from '../components/Skeleton';
import SEOHead from '../components/SEOHead';
import { getAuthenticImage, handleImageError } from '../utils/imageFallback';
import {
  CalendarDaysIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  ClockIcon,
  TicketIcon,
  StarIcon,
  DocumentTextIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CheckBadgeIcon,
  ShareIcon,
  ShoppingBagIcon,
  SparklesIcon,
  BoltIcon,
  TagIcon,
  BanknotesIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import ReviewSection from '../components/ReviewSection';
import toast from 'react-hot-toast';

export type PackageType = 'standard' | 'vip' | 'saver';

export interface PackageOption {
  id: PackageType;
  name: string;
  subtitle: string;
  badge: string;
  badgeStyle: string;
  priceDelta: number;
  description: string;
  features: string[];
  highlight?: boolean;
}

export const PACKAGE_OPTIONS: PackageOption[] = [{
  id: 'standard', name: 'Giá tour', subtitle: '', badge: '', badgeStyle: '',
  priceDelta: 0, description: '', features: [],
}];

export default function TourDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { i18n } = useTranslation();
  const bookingRef = useRef<HTMLDivElement | null>(null);
  
  // State management
  const selectedPackage: PackageType = 'standard';
  const [selectedDate, setSelectedDate] = useState('');
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true, 3: true, 4: true });
  const [isHighlightsExpanded, setIsHighlightsExpanded] = useState(true);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('travelgo:wishlist');
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list) && slug) {
          return list.includes(slug);
        }
      }
    } catch {}
    return false;
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Fetch tour data from backend
  const { data: dbTour, isLoading, isError, refetch } = useQuery({
    queryKey: ['tour', slug, i18n.language],
    queryFn: () => getTourBySlug(slug!),
    enabled: !!slug,
    retry: 1,
  });

  const tour = dbTour!;

  const { data: relatedToursData } = useQuery({
    queryKey: ['related-tours', tour?.destinationId, i18n.language],
    queryFn: () => getToursPaged(1, 3, { destinationId: tour?.destinationId ?? undefined }),
    enabled: !!tour?.destinationId,
  });

  const relatedTours = relatedToursData?.items?.filter(t => t.slug !== slug) || [];

  // Reset accordion when tour changes
  useEffect(() => {
    setExpandedAccordion(null);
  }, [slug]);

  // Catalog photos are stock images; use a destination image until product photos are verified.
  const images = useMemo(() => {
    if (!tour) return [];
    return [getAuthenticImage(null, tour.destination?.name || tour.name || tour.slug, 'tour')];
  }, [tour]);

  // Get tags
  const tags = useMemo(() => {
    if (!tour?.tags) return [];
    if (Array.isArray(tour.tags)) return tour.tags;
    if (typeof tour.tags === 'string') {
      try {
        const parsed = JSON.parse(tour.tags);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  }, [tour?.tags]);

  // Get highlights (parse JSON string or Array, with realistic fallback)
  const highlights = useMemo(() => {
    let list = tour?.highlights;
    if (typeof list === 'string') {
      try { list = JSON.parse(list); } catch {}
    }
    if (Array.isArray(list) && list.length > 0) return list;
    return [];
  }, [tour?.highlights]);

  // Get enriched itinerary with rich travel narrative and times
  const itinerary = useMemo(() => {
    let days = tour?.itinerary;
    if (typeof days === 'string') {
      try { days = JSON.parse(days); } catch { return []; }
    }
    if (!Array.isArray(days)) return [];
    return days.map((day: any, index: number) => ({
      day: day.day || index + 1,
      title: day.title || `Ngày ${index + 1}`,
      meals: day.meals,
      hotel: day.hotel,
      transport: day.transport,
      activities: Array.isArray(day.activities)
        ? day.activities.map((activity: any) => {
            if (typeof activity !== 'string') return activity;
            const match = activity.match(/^(\\d{1,2}:\\d{2})\\s*:\\s*(.+)$/);
            return { time: match?.[1], title: match?.[2] || activity, desc: '' };
          })
        : [],
    }));
  }, [tour?.itinerary]);

  const toggleDay = (index: number) => {
    setExpandedDays((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleAllDays = (expand: boolean) => {
    const next: Record<number, boolean> = {};
    itinerary.forEach((_: any, idx: number) => {
      next[idx] = expand;
    });
    setExpandedDays(next);
  };

  // Get FAQ
  const faq = useMemo(() => {
    if (!tour?.faq) return [];
    if (Array.isArray(tour.faq)) return tour.faq;
    return [];
  }, [tour?.faq]);

  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return '0';
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Active package details
  const activePackage = useMemo(() => {
    return PACKAGE_OPTIONS.find((p) => p.id === selectedPackage) || PACKAGE_OPTIONS[0];
  }, [selectedPackage]);

  // Calculate prices with selected package
  const baseTourPrice = tour?.adultPrice ?? tour?.price ?? 0;
  const pricePerAdult = Math.max(0, baseTourPrice + activePackage.priceDelta);
  const pricePerChild = tour?.childPrice ?? 0;
  const hasChildPrice = tour?.childPrice != null && tour.childPrice >= 0;
  const hasPublishedRefundPolicy =
    typeof tour?.policies?.cancellation === 'string' && Boolean(tour.policies.cancellation.trim()) &&
    typeof tour?.policies?.refund === 'string' && Boolean(tour.policies.refund.trim());

  const adultsTotal = pricePerAdult * adults;
  const childrenTotal = pricePerChild * children;
  const totalPrice = adultsTotal + childrenTotal;
  
  // Traveloka Transparent breakdown: 0đ hidden fee + online member discount
  const serviceFee = 0; // Traveloka zero-hidden-fee guarantee
  const memberDiscount = 0;
  const grandTotal = Math.max(0, totalPrice + serviceFee - memberDiscount);

  const handleBooking = () => {
    if (!hasPublishedRefundPolicy) {
      toast.error('Tour chưa công bố chính sách hoàn hủy. Chưa thể thanh toán trực tuyến.');
      return;
    }
    if (!selectedDate) {
      toast.error('Vui lòng chọn ngày khởi hành');
      const el = document.getElementById('booking-date');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    // Pass both ID, slug and package for seamless checkout
    navigate(`/checkout?type=tour&id=${tour?.id}&slug=${tour?.slug}&date=${selectedDate}&adults=${adults}&children=${children}&package=${selectedPackage}`);
  };

  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!selectedDate) {
      toast.error('Vui lòng chọn ngày khởi hành');
      const el = document.getElementById('booking-date');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const totalGuests = Math.max(1, adults + children);

    addItem({
      type: 'tour',
      itemId: tour.id,
      title: `${tour.name} [${activePackage.name}]`,
      image: tour.image || undefined,
      slug: tour.slug,
      price: pricePerAdult,
      originalPrice: tour.originalPrice ? (tour.originalPrice + activePackage.priceDelta) : undefined,
      date: selectedDate,
      guests: totalGuests,
      unitLabel: 'khách',
      duration: tour.duration,
      location: tour.destination?.name,
      adults,
      children,
      pricePerAdult,
      pricePerChild,
      discount: memberDiscount > 0 ? memberDiscount : undefined,
    });
  };

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleToggleWishlist = () => {
    const nextState = !isFavorite;
    setIsFavorite(nextState);
    try {
      const saved = localStorage.getItem('travelgo:wishlist');
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];
      const currentSlug = slug || tour?.slug;
      if (currentSlug) {
        if (nextState) {
          if (!list.includes(currentSlug)) list.push(currentSlug);
          toast.success('Đã lưu vào yêu thích trên thiết bị này! (Đăng nhập để đồng bộ vĩnh viễn)', {
            icon: '❤️',
            duration: 4000,
          });
        } else {
          list = list.filter((s) => s !== currentSlug);
          toast('Đã bỏ lưu khỏi danh sách yêu thích.', { icon: '🤍' });
        }
        localStorage.setItem('travelgo:wishlist', JSON.stringify(list));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('travelgo:wishlist');
      if (saved && slug) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          setIsFavorite(list.includes(slug));
        }
      }
    } catch {}
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tour?.name,
        text: tour?.shortDescription || tour?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link đã được sao chép!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Skeleton className="h-[70vh] w-full" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !dbTour) {
    return (
      <div role="alert" className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-bold">Không tải được thông tin tour</h1>
        <p>Tour không tồn tại hoặc máy chủ đang gián đoạn. Vui lòng thử lại.</p>
        <button type="button" onClick={() => refetch()} className="rounded-lg bg-blue-700 px-5 py-2 text-white">Tải lại</button>
      </div>
    );
  }



  const mainImage = images[0] || getAuthenticImage(null, tour.destination?.name || tour.name || tour.slug, 'tour');
  const price = tour.adultPrice ?? tour.price ?? 0;
  const originalPrice = tour.originalPrice;
  const destinationName = tour.destination?.name || 'Đang cập nhật';

  return (
    <>
      <SEOHead
        title={tour.name}
        description={tour.description || ''}
        image={mainImage}
        type="product"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Breadcrumb Navigation */}
        <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium overflow-x-auto whitespace-nowrap">
              <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
              <span>/</span>
              <Link to="/tours" className="hover:text-blue-600 transition-colors">Tour du lịch</Link>
              <span>/</span>
              <span className="text-slate-600 dark:text-slate-300 font-semibold">{destinationName}</span>
              <span>/</span>
              <span className="text-slate-900 dark:text-white font-bold truncate max-w-[260px] sm:max-w-md">{tour.name}</span>
            </nav>
          </div>
        </div>

        {/* Tour Header & Action Bar */}
        <section className="bg-white dark:bg-slate-950 pt-6 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Badges & Actions row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                {tour.featured && <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Tour nổi bật</span>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition-all"
                >
                  <ShareIcon className="w-4 h-4" /> Chia sẻ
                </button>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition-all ${
                    isFavorite
                      ? 'border-red-200 bg-red-50 text-red-600 dark:bg-red-950/30 dark:border-red-800'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {isFavorite ? <HeartIconSolid className="w-4 h-4 text-red-500" /> : <HeartIcon className="w-4 h-4" />}
                  {isFavorite ? 'Đã lưu' : 'Lưu tour'}
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug mb-3">
              {tour.name}
            </h1>

            {/* Metadata bar */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-400">
                  <StarIconSolid className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white">{tour.reviewCount && tour.rating ? tour.rating.toFixed(1) : '—'}</span>
                <span className="text-slate-500 dark:text-slate-400 underline decoration-slate-300">({tour.reviewCount ?? 0} đánh giá)</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4 text-rose-500" />
                <span className="font-medium">{destinationName}{tour.departurePoint ? ` • Khởi hành: ${tour.departurePoint}` : ''}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                <span>{tour.duration ? `${tour.duration} ngày ${Math.max(0, tour.duration - 1)} đêm` : 'Chưa cập nhật thời lượng'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* One destination image is shown until product photos are verified. */}
        <section className="bg-white dark:bg-slate-950 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
              <img src={images[0]} alt={tour.destination?.name || tour.name}
                className="w-full h-[280px] sm:h-[400px] object-cover"
                onError={(e) => handleImageError(e, tour.name || tour.slug, 'tour')} />
              <span className="absolute bottom-4 left-4 rounded-lg bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-white">
                Ảnh minh họa điểm đến
              </span>
            </div>
          </div>
        </section>

        {/* Sticky Sub Navigation Tabs Bar */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-y border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8 overflow-x-auto text-sm font-semibold text-slate-600 dark:text-slate-400 no-scrollbar">
              <a href="#package-options" className="py-3.5 border-b-2 border-blue-600 text-blue-600 whitespace-nowrap">
                Ngày đi & giá
              </a>
              <a href="#tour-itinerary" className="py-3.5 border-b-2 border-transparent hover:text-blue-600 whitespace-nowrap">
                Lịch trình
              </a>
              <a href="#tour-inclusions" className="py-3.5 border-b-2 border-transparent hover:text-blue-600 whitespace-nowrap">
                Dịch vụ bao gồm
              </a>
              <a href="#tour-policy" className="py-3.5 border-b-2 border-transparent hover:text-blue-600 whitespace-nowrap">
                Hoàn hủy
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Content) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Intro */}
              {tour.description && (
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <MapPinIcon className="w-6 h-6 text-white" />
                </div>
                    <h2 className="text-3xl font-bold text-gray-900">Giới thiệu</h2>
                </div>
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                    {tour.description}
                  </p>
              </div>
              )}

              {/* Highlights */}
              {highlights.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-xl p-8 border border-blue-100">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <CheckCircleIcon className="w-8 h-8 text-blue-600" />
                    Điểm nổi bật
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {highlights.map((highlight: any, i: number) => (
                      <div key={i} className="group bg-white rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <CheckIcon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium leading-relaxed">{highlight.text || highlight}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {itinerary.length > 0 && (
                <div id="tour-itinerary" className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-200 dark:border-slate-800 scroll-mt-20">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-5 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                        <CalendarDaysIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lịch trình chi tiết</h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          Hành trình {itinerary.length} ngày tối ưu trải nghiệm & thư giãn trọn vẹn
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => toggleAllDays(true)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 transition-colors"
                      >
                        Mở rộng tất cả
                      </button>
                      <button
                        onClick={() => toggleAllDays(false)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
                      >
                        Thu gọn
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {itinerary.map((day: any, i: number) => {
                      const isExpanded = expandedDays[i] !== false;
                      const dayNumber = day.day || (i + 1);
                      const dayTitle = day.title || `Ngày ${dayNumber}`;

                      return (
                        <div
                          key={i}
                          className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:border-blue-300 dark:hover:border-slate-700 transition-all"
                        >
                          <button
                            onClick={() => toggleDay(i)}
                            className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 bg-gradient-to-r from-gray-50/70 to-white dark:from-slate-800/40 dark:to-slate-900 hover:bg-blue-50/30 transition-colors"
                          >
                            <div className="flex items-start gap-3.5 flex-1 min-w-0">
                              <span className="flex-shrink-0 inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-xs tracking-wider shadow-sm">
                                NGÀY {dayNumber}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug">
                                  {dayTitle}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  {day.meals && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
                                      <span>🍽️</span>
                                      <span className="truncate max-w-[240px] sm:max-w-none">{day.meals}</span>
                                    </span>
                                  )}
                                  {day.hotel && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200/60 dark:border-purple-900/40">
                                      <span>🏨</span>
                                      <span className="truncate max-w-[240px] sm:max-w-none">{day.hotel}</span>
                                    </span>
                                  )}
                                  {day.transport && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200/60 dark:border-sky-900/40">
                                      <span>🚌</span>
                                      <span className="truncate max-w-[240px] sm:max-w-none">{day.transport}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0 transition-colors">
                              <ChevronDownIcon
                                className={`w-5 h-5 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                                }`}
                              />
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="p-5 sm:p-6 pt-2 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                              <div className="relative pl-6 sm:pl-8 space-y-5 before:content-[''] before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-indigo-400 before:to-purple-500">
                                {day.activities.map((act: any, actIdx: number) => {
                                  const actTime = typeof act === 'object' ? act.time : null;
                                  const actTitle = typeof act === 'object' ? act.title : act;
                                  const actDesc = typeof act === 'object' ? act.desc : null;

                                  return (
                                    <div key={actIdx} className="relative group">
                                      <div className="absolute -left-[23px] sm:-left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-600 group-hover:scale-125 group-hover:border-indigo-500 transition-transform shadow-sm" />
                                      <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                          {actTime && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/50">
                                              <ClockIcon className="w-3 h-3" />
                                              {actTime}
                                            </span>
                                          )}
                                          <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                                            {actTitle}
                                          </h4>
                                        </div>
                                        {actDesc && (
                                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed pt-0.5">
                                            {actDesc}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <section id="tour-inclusions" className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-200 dark:border-slate-800 scroll-mt-20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Giá và quyền lợi của tour</h2>
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  Giá hiển thị là giá theo gói và số khách đã chọn. Các hoạt động trong lịch trình và quyền lợi dưới đây được lấy từ thông tin của tour này.
                </p>
                {highlights.length > 0 ? (
                  <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {highlights.map((highlight: any, index: number) => (
                      <li key={index}>• {highlight.text || highlight}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-gray-600">Chi tiết dịch vụ bao gồm đang được cập nhật. Vui lòng xác nhận trước khi đặt.</p>
                )}
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Chi phí cá nhân ngoài lịch trình chưa nằm trong giá hiển thị. Vui lòng xác nhận các khoản phát sinh và thông tin hóa đơn trước khi thanh toán.
                </p>
              </section>

              {hasPublishedRefundPolicy && (
                <section id="tour-policy" className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 scroll-mt-20">
                  <h2 className="text-xl font-bold mb-3">Chính sách hoàn hủy của tour này</h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2"><strong>Điều kiện hủy:</strong> {tour.policies.cancellation}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2"><strong>Mức hoàn tiền:</strong> {tour.policies.refund}</p>
                </section>
              )}
              {!hasPublishedRefundPolicy && (
                <section id="tour-policy" className="bg-amber-50 rounded-2xl p-6 border border-amber-200 scroll-mt-20">
                  <h2 className="text-lg font-bold">Chính sách hoàn hủy</h2>
                  <p className="mt-2 text-sm">Tour này chưa công bố đủ điều kiện hủy và mức hoàn tiền. Thanh toán trực tuyến tạm dừng cho đến khi thông tin được xác nhận bằng văn bản.</p>
                </section>
              )}

              {/* Customer Reviews Section */}
              {tour && (
                <ReviewSection
                  type="tour"
                  targetId={tour.id}
                  slug={tour.slug}
                  title={tour.name}
                />
              )}
            </div>

            {/* Right Column (Booking Card) - Sticky */}
            <div id="package-options" className="lg:col-span-1 scroll-mt-20" ref={bookingRef}>
              <div className="sticky top-24 space-y-6">
                {/* Main Booking Card (Traveloka Standard Transparent Pricing) */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 sm:p-7 border border-blue-100 dark:border-slate-800 transition-colors">
                  {/* Traveloka Price Header */}
                  <div className="mb-5 pb-5 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <BoltIcon className="w-3.5 h-3.5" />
                        Giá tour hiện tại
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <ShieldCheckIcon className="w-3.5 h-3.5" />
                        Theo giá niêm yết
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                        {formatPrice(pricePerAdult)} ₫
                      </span>
                      {originalPrice && (originalPrice + activePackage.priceDelta) > pricePerAdult && (
                        <span className="text-gray-400 dark:text-slate-500 line-through text-base">
                          {formatPrice(originalPrice + activePackage.priceDelta)} ₫
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Giá mỗi người lớn • Đang chọn: <strong className="text-gray-800 dark:text-slate-200">{activePackage.name}</strong>
                    </p>
                  </div>

                  {/* Date & Guest Pickers */}
                  <div className="space-y-4 mb-5">
                    {/* Date Picker */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                        <CalendarDaysIcon className="w-4 h-4 text-blue-600" />
                        Ngày đi dự kiến
                      </label>
                      <input
                        type="date"
                        id="booking-date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                      />
                    </div>

                    {/* Adults */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">
                          Người lớn
                        </label>
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          {formatPrice(pricePerAdult)} ₫/người
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-white transition-colors font-bold text-base flex items-center justify-center"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={adults}
                          onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                          className="flex-1 text-center py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setAdults(adults + 1)}
                          className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-white transition-colors font-bold text-base flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    {hasChildPrice ? <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">
                          Trẻ em (dưới 12 tuổi)
                        </label>
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          {formatPrice(pricePerChild)} ₫/trẻ
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-white transition-colors font-bold text-base flex items-center justify-center"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={children}
                          onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                          className="flex-1 text-center py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setChildren(children + 1)}
                          className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-white transition-colors font-bold text-base flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div> : <p className="text-xs text-amber-700 dark:text-amber-300">
                      Giá trẻ em chưa được công bố. Vui lòng liên hệ TravelHub để xác nhận.
                    </p>}
                  </div>

                  {/* Traveloka Transparent Price Breakdown */}
                  <div className="rounded-2xl bg-gray-50 dark:bg-slate-800/70 p-4 border border-gray-200/70 dark:border-slate-700/60 mb-5 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-slate-700">
                      <span className="text-xs font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1.5">
                        <BanknotesIcon className="w-4 h-4 text-blue-600" />
                        Bóc tách chi phí minh bạch
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Giá TravelHub
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-gray-600 dark:text-slate-400">
                      <span>Người lớn ({adults} x {formatPrice(pricePerAdult)} ₫)</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(adultsTotal)} ₫</span>
                    </div>

                    {children > 0 && (
                      <div className="flex justify-between text-xs text-gray-600 dark:text-slate-400">
                        <span>Trẻ em ({children} x {formatPrice(pricePerChild)} ₫)</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(childrenTotal)} ₫</span>
                      </div>
                    )}

                    <div className="flex justify-between text-xs text-gray-600 dark:text-slate-400">
                      <span>Phí dịch vụ & Bảo lưu chỗ</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">0 ₫ (Miễn phí)</span>
                    </div>

                    {memberDiscount > 0 && (
                      <div className="flex justify-between text-xs text-rose-600 dark:text-rose-400">
                        <span className="flex items-center gap-1">
                          <TagIcon className="w-3.5 h-3.5" />
                          Ưu đãi đặt trực tuyến
                        </span>
                        <span className="font-bold">-{formatPrice(memberDiscount)} ₫</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-200 dark:border-slate-700 flex justify-between items-baseline">
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">Tổng thanh toán:</div>
                        <div className="text-[10px] text-gray-500 dark:text-slate-400">Giá theo gói và số khách đã chọn</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                          {formatPrice(grandTotal)} ₫
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`mb-4 rounded-xl border p-3 text-sm ${hasPublishedRefundPolicy ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
                    {hasPublishedRefundPolicy
                      ? <a href="#tour-policy" className="font-semibold underline">Xem chính sách hoàn hủy của tour này</a>
                      : <span>Chưa có chính sách hoàn hủy xác thực. Anh/chị có thể lưu tour và liên hệ tư vấn; thanh toán trực tuyến đang tạm dừng.</span>}
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={handleBooking}
                      disabled={!selectedDate || !hasPublishedRefundPolicy}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <CreditCardIcon className="w-5 h-5" />
                      <span>{!hasPublishedRefundPolicy ? 'Chưa thể thanh toán tour này' : selectedDate ? 'Tiếp tục đặt tour' : 'Chọn ngày khởi hành để đặt'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={!selectedDate}
                      className="w-full py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingBagIcon className="w-5 h-5" />
                      Thêm vào giỏ hàng
                    </button>
                  </div>

                </div>

                {/* Contact Buttons */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl p-6 border border-green-100">
                  <h3 className="font-bold text-gray-900 mb-4 text-center">Cần hỗ trợ?</h3>
                  <div className="space-y-3">
                    <a
                      href="tel:0868156027"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                    >
                      <PhoneIcon className="w-5 h-5" />
                      Gọi: 0868156027
                    </a>
                    <Link to="/chatbot" className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      Chat ngay
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Tours */}
          {relatedTours.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-6">
                <MapPinIcon className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">CÁC CHƯƠNG TRÌNH KHÁC</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedTours.map((relatedTour) => {
                  const relatedPrice = relatedTour.price || 0;
                  
                  return (
                    <Link
                      key={relatedTour.id}
                      to={`/tours/${relatedTour.slug}`}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={getAuthenticImage(relatedTour.image, relatedTour.name || relatedTour.slug, 'tour')}
                          alt={relatedTour.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            handleImageError(e, relatedTour.name || relatedTour.slug, 'tour');
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            try {
                              const saved = localStorage.getItem('travelgo:wishlist');
                              let list: string[] = saved ? JSON.parse(saved) : [];
                              if (!Array.isArray(list)) list = [];
                              const rSlug = relatedTour.slug;
                              if (rSlug) {
                                if (list.includes(rSlug)) {
                                  list = list.filter((s) => s !== rSlug);
                                  toast('Đã bỏ lưu khỏi danh sách yêu thích.', { icon: '🤍' });
                                } else {
                                  list.push(rSlug);
                                  toast.success('Đã lưu vào yêu thích trên thiết bị này!', { icon: '❤️' });
                                }
                                localStorage.setItem('travelgo:wishlist', JSON.stringify(list));
                              }
                            } catch {}
                          }}
                          className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md"
                        >
                          <HeartIcon className="h-5 w-5 text-gray-500 hover:text-red-500" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
                          {relatedTour.name}
                        </h3>
                        <div className="text-xs text-gray-600 mb-2 space-y-1">
                          <p className="flex items-center gap-1.5">
                            <MapPinIcon className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            {relatedTour.departurePoint ? <>Khởi hành: <span className="text-blue-600 font-medium">{relatedTour.departurePoint}</span></> : 'Điểm khởi hành cần xác nhận'}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <TicketIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            {relatedTour.duration ? `${relatedTour.duration} ngày` : 'Thời lượng cần xác nhận'}
                          </p>
                        </div>
                        <div className="flex items-baseline gap-1 mb-3">
                          <span className="text-xs text-gray-600">Giá từ</span>
                          <span className="text-xl font-bold text-red-500">
                            {formatPrice(relatedPrice)}
                          </span>
                          <span className="text-sm text-red-500">₫</span>
                        </div>
                        <div className="text-blue-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Xem chi tiết
                          <ChevronRightIcon className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </section>
        </div>

      {/* Compact mobile booking entry point. */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300 whitespace-nowrap">{formatPrice(price)} ₫</div>
            <div className="text-xs text-slate-500">Giá mỗi người lớn</div>
          </div>
          <button type="button" onClick={scrollToBooking}
            className="shrink-0 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white">
            Xem giá &amp; ngày đi
          </button>
        </div>
      </div>

    </>
  );
}
