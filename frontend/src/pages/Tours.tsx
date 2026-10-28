import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getToursPaged, Tour } from '../services/tour';
import { getDestinations } from '../services/destination';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';
import Skeleton from '../components/Skeleton';
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ClockIcon,
  StarIcon,
  MapPinIcon,
  FunnelIcon,
  ShoppingBagIcon,
  CheckBadgeIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import FloatingCompareDrawer, { CompareTourItem } from '../components/FloatingCompareDrawer';
import toast from 'react-hot-toast';
import { getAuthenticImage, handleImageError } from '../utils/imageFallback';


export default function ToursPage() {
  const { addItem } = useCart();
  const { language } = useLanguage();
  const location = useLocation();
  const isEn = language === 'en' || location.pathname.startsWith('/en/');

  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [selectedDestination, setSelectedDestination] = useState<number | undefined>(undefined);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
      setPage(1);
    }
  }, [searchParams]);
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'rating'>('featured');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under2m' | '2to5m' | 'above5m'>('all');
  const [durationFilter, setDurationFilter] = useState<'all' | '1to2' | '3to4' | '5plus'>('all');
  const [compareTours, setCompareTours] = useState<CompareTourItem[]>([]);

  const getTourTitle = (tour: Tour) => {
    if (!isEn) return tour.name;
    const enMap: Record<string, string> = {
      'tour-ha-long-2n1d-du-thuyen-5-sao': 'Ha Long Bay 2D1N - 5-Star Luxury Heritage Cruise',
      'tour-da-nang-ba-na-hills-3n2d': 'Da Nang - Golden Bridge Ba Na Hills - Hoi An Ancient Town 3D2N',
      'nghi-duong-phu-quoc-3n2d': 'Phu Quoc Island Retreat - Hon Thom Cable Car 3D2N',
      'tour-sa-pa-fansipan-2n1d': 'Sa Pa Discovery - Mount Fansipan Summit - Cat Cat Village 2D1N',
      'tour-ninh-binh-trang-an-1-ngay': 'Ninh Binh Day Tour - Trang An - Mua Cave - Bai Dinh Pagoda',
      'tour-ha-giang-ma-pi-leng-3n2d': 'Ha Giang Geopark Discovery - Ma Pi Leng Pass 3D2N',
      'tour-da-lat-san-may-3n2d': 'Da Lat Cloud Hunting - Valley of Love - Cau Dat Tea Hill 3D2N',
      'tour-ha-noi-trang-an-ha-long-4n3d': 'Hanoi City Tour - Trang An Bai Dinh - Ha Long Bay 4D3N',
    };
    return enMap[tour.slug] || tour.name;
  };

  const getDestinationName = (name?: string) => {
    if (!name || !isEn) return name;
    const destMap: Record<string, string> = {
      'Vịnh Hạ Long': 'Ha Long Bay',
      'Đà Nẵng & Hội An': 'Da Nang & Hoi An',
      'Đảo Ngọc Phú Quốc': 'Phu Quoc Island',
      'Sa Pa - Fansipan': 'Sa Pa - Mount Fansipan',
      'Ninh Bình - Tràng An': 'Ninh Binh - Trang An',
      'Cao Nguyên Hà Giang': 'Ha Giang Karst Plateau',
      'Đà Lạt Mộng Mơ': 'Da Lat Highlands',
      'Thủ Đô Hà Nội': 'Hanoi Capital',
    };
    return destMap[name] || name;
  };

  const toggleCompare = (tour: Tour) => {
    const title = getTourTitle(tour);
    if (compareTours.some((t) => t.id === tour.id)) {
      setCompareTours((prev) => prev.filter((t) => t.id !== tour.id));
      toast.success(
        isEn
          ? `Removed ${title} from comparison`
          : `Đã bỏ ${tour.name} khỏi danh sách so sánh`
      );
    } else {
      if (compareTours.length >= 3) {
        toast.error(
          isEn
            ? 'You can only compare up to 3 tours at a time'
            : 'Chỉ có thể so sánh tối đa 3 tour cùng lúc'
        );
        return;
      }
      setCompareTours((prev) => [
        ...prev,
        {
          id: tour.id,
          name: title,
          image: tour.image || undefined,
          price: tour.price || 0,
          duration: tour.duration,
          rating: tour.rating,
          destination: getDestinationName(tour.destination?.name),
          transport: tour.transport || (isEn ? 'Tourist Coach' : 'Xe ô tô du lịch'),
          slug: tour.slug,
        },
      ]);
      toast.success(
        isEn
          ? `Added ${title} to comparison list`
          : `Đã thêm ${tour.name} vào bảng so sánh`
      );
    }
  };

  const { data: destinationsData } = useQuery({
    queryKey: ['destinations-all'],
    queryFn: getDestinations,
  });

  const { data: toursData, isLoading, isError, refetch } = useQuery({
    queryKey: ['tours-list', page, searchTerm, selectedDestination],
    queryFn: () => getToursPaged(page, 9, {
      q: searchTerm || undefined,
      destinationId: selectedDestination,
    }),
  });

  const tours = toursData?.items || [];
  const totalPages = toursData?.pages || 1;

  const sortedTours = [...tours].sort((a, b) => {
    if (sortBy === 'priceAsc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'priceDesc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const displayTours = sortedTours.filter((tour) => {
    const price = tour.price || 0;
    if (priceFilter === 'under2m' && price >= 2000000) return false;
    if (priceFilter === '2to5m' && (price < 2000000 || price > 5000000)) return false;
    if (priceFilter === 'above5m' && price <= 5000000) return false;

    const duration = tour.duration || 1;
    if (durationFilter === '1to2' && (duration < 1 || duration > 2)) return false;
    if (durationFilter === '3to4' && (duration < 3 || duration > 4)) return false;
    if (durationFilter === '5plus' && duration < 5) return false;

    return true;
  });

  const formatPrice = (p?: number) => {
    if (isEn) {
      return (p || 0).toLocaleString('en-US') + ' VND';
    }
    return (p || 0).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <>
      <SEOHead
        title={isEn ? 'Tour Packages & Travel Itineraries - TravelHub' : 'Danh sách Tour du lịch - TravelHub'}
        description={
          isEn
            ? 'Discover top-rated all-inclusive tour packages with best guaranteed prices across Vietnam with TravelHub.'
            : 'Khám phá các tour du lịch trọn gói chất lượng cao, giá tốt nhất trên toàn quốc cùng TravelHub.'
        }
      />

      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {isEn ? 'Find a tour' : 'Tìm tour du lịch'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {isEn ? 'Compare destinations, duration and listed prices.' : 'So sánh điểm đến, thời lượng và giá niêm yết của từng tour.'}
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200/80 dark:border-slate-800 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder={isEn ? 'Search tour name, landmark, experience...' : 'Tìm tên tour, địa danh, trải nghiệm...'}
                className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#003580] bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Destination Select */}
            <div className="w-full md:w-56">
              <select
                value={selectedDestination || ''}
                onChange={(e) => {
                  setSelectedDestination(e.target.value ? Number(e.target.value) : undefined);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#003580] bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="">{isEn ? 'All Destinations' : 'Tất cả điểm đến'}</option>
                {(destinationsData || []).map((dest: any) => (
                  <option key={dest.id} value={dest.id}>
                    {getDestinationName(dest.name)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="w-full md:w-52">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#003580] bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="featured">{isEn ? 'Featured / Most Popular' : 'Nổi bật nhất'}</option>
                <option value="priceAsc">{isEn ? 'Price: Low to High' : 'Giá: Thấp đến Cao'}</option>
                <option value="priceDesc">{isEn ? 'Price: High to Low' : 'Giá: Cao đến Thấp'}</option>
                <option value="rating">{isEn ? 'Highest Rated' : 'Đánh giá cao nhất'}</option>
              </select>
            </div>
          </div>

          {/* Quick Filters Bar (Klook Style) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-gray-200/80 dark:border-slate-800 mb-8 space-y-3">
            {/* Price Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 min-w-[85px]">
                {isEn ? 'Price Range:' : 'Khoảng giá:'}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: isEn ? 'All Prices' : 'Tất cả giá' },
                  { id: 'under2m', label: isEn ? 'Under 2M VND' : 'Dưới 2 triệu' },
                  { id: '2to5m', label: isEn ? '2 - 5M VND' : '2 - 5 triệu' },
                  { id: 'above5m', label: isEn ? 'Above 5M VND' : 'Trên 5 triệu' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPriceFilter(item.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      priceFilter === item.id
                        ? 'bg-[#003580] text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 min-w-[85px]">
                {isEn ? 'Duration:' : 'Thời lượng:'}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: isEn ? 'All' : 'Tất cả' },
                  { id: '1to2', label: isEn ? '1 - 2 Days' : '1 - 2 ngày' },
                  { id: '3to4', label: isEn ? '3 - 4 Days' : '3 - 4 ngày' },
                  { id: '5plus', label: isEn ? '5+ Days' : 'Từ 5 ngày trở lên' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDurationFilter(item.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      durationFilter === item.id
                        ? 'bg-[#003580] text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Reset filter button */}
              {(priceFilter !== 'all' || durationFilter !== 'all' || searchTerm || selectedDestination) && (
                <button
                  onClick={() => {
                    setPriceFilter('all');
                    setDurationFilter('all');
                    setSearchTerm('');
                    setSelectedDestination(undefined);
                  }}
                  className="ml-auto text-xs text-red-500 hover:text-red-600 font-semibold px-2 py-1"
                >
                  {isEn ? 'Clear filters' : 'Xóa bộ lọc'}
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
              <span>
                {isEn ? (
                  <>Showing <strong>{displayTours.length}</strong> matching tour packages</>
                ) : (
                  <>Hiển thị <strong>{displayTours.length}</strong> tour du lịch phù hợp</>
                )}
              </span>
            </div>
          </div>

          {/* Tour Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-96 w-full rounded-2xl" />
              ))}
            </div>
          ) : isError ? (
            <div role="alert" className="rounded-2xl bg-white p-8 text-center text-slate-700">
              Không tải được dữ liệu tour. Vui lòng thử lại sau.
              <button type="button" onClick={() => refetch()} className="block mx-auto mt-4 text-blue-700 font-semibold">Tải lại</button>
            </div>
          ) : displayTours.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-slate-800">
              <p className="text-gray-500 dark:text-slate-400 text-base">
                {isEn ? 'No tour packages match your current search criteria.' : 'Không tìm thấy tour phù hợp với yêu cầu tìm kiếm.'}
              </p>
              <button
                onClick={() => {
                  setPriceFilter('all');
                  setDurationFilter('all');
                  setSearchTerm('');
                  setSelectedDestination(undefined);
                }}
                className="mt-4 px-4 py-2 bg-[#003580] text-white rounded-xl text-sm font-semibold hover:bg-blue-900 transition"
              >
                {isEn ? 'Reset Filters' : 'Đặt lại bộ lọc'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTours.map((tour) => {
                const tourTitle = getTourTitle(tour);
                const destName = getDestinationName(tour.destination?.name);
                const isSelected = compareTours.some((t) => t.id === tour.id);

                return (
                  <div
                    key={tour.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                  >
                    {/* Image with badges & compare button */}
                    <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                      <img
                        src={getAuthenticImage(tour.image, tour.name || tour.slug, 'tour')}
                        alt={tourTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e: any) => {
                          handleImageError(e, tour.name || tour.slug, 'tour');
                        }}
                      />
                      {tour.featured && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                          <CheckBadgeIcon className="w-3.5 h-3.5" />
                          {isEn ? 'Best Seller' : 'Bán chạy'}
                        </span>
                      )}

                      {/* Compare Button */}
                      <button
                        type="button"
                        onClick={() => toggleCompare(tour)}
                        className={`absolute top-3 right-3 px-2.5 py-1 rounded-xl text-xs font-bold backdrop-blur-md transition flex items-center gap-1 z-10 ${
                          isSelected
                            ? 'bg-[#003580] text-white shadow-md'
                            : 'bg-black/60 text-white/90 hover:bg-black/80'
                        }`}
                        title={isEn ? 'Compare with other tours' : 'So sánh với tour khác'}
                      >
                        <ScaleIcon className="w-3.5 h-3.5" />
                        <span>{isSelected ? (isEn ? 'Selected' : 'Đã chọn') : (isEn ? 'Compare' : 'So sánh')}</span>
                      </button>

                      {tour.duration && (
                        <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-lg flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5" />
                          {tour.duration} {isEn ? (tour.duration > 1 ? 'Days' : 'Day') : 'ngày'}
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Destination name */}
                        {destName && (
                          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-1 mb-1.5">
                            <MapPinIcon className="w-3.5 h-3.5" />
                            {destName}
                          </p>
                        )}

                        {/* Title */}
                        <h2 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2 hover:text-[#003580] dark:hover:text-blue-400 transition mb-2">
                          <Link to={`/tours/${tour.slug}`}>{tourTitle}</Link>
                        </h2>

                        {/* Description */}
                        <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                          {tour.shortDescription || tour.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center text-amber-400">
                            <StarIconSolid className="w-4 h-4" />
                            <span className="text-xs font-bold text-gray-800 dark:text-slate-200 ml-1">
                              {tour.rating ? tour.rating.toFixed(1) : '5.0'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            ({tour.reviewCount ?? 0} {isEn ? 'reviews' : 'đánh giá'})
                          </span>
                        </div>
                      </div>

                      {/* Bottom Pricing & CTA */}
                      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[11px] text-gray-400 block">{isEn ? 'From' : 'Giá từ'}</span>
                          <span className="text-lg font-black text-rose-600 dark:text-rose-400">
                            {formatPrice(tour.price)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              addItem({
                                type: 'tour',
                                itemId: tour.id,
                                title: tourTitle,
                                image: tour.image || undefined,
                                slug: tour.slug,
                                price: tour.price || 0,
                                originalPrice: tour.originalPrice || undefined,
                                guests: 1,
                                duration: tour.duration,
                                location: destName,
                              })
                            }
                            className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-[#003580] dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                            title={isEn ? 'Add to cart' : 'Thêm vào giỏ hàng'}
                          >
                            <ShoppingBagIcon className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/tours/${tour.slug}`}
                            className="px-4 py-2 bg-[#003580] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition shadow-sm"
                          >
                            {isEn ? 'Details' : 'Chi tiết'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-800 text-sm font-medium disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-white transition"
              >
                {isEn ? 'Previous' : 'Trước'}
              </button>
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-300 px-3">
                {isEn ? `Page ${page} / ${totalPages}` : `Trang ${page} / ${totalPages}`}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-800 text-sm font-medium disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-white transition"
              >
                {isEn ? 'Next' : 'Sau'}
              </button>
            </div>
          )}

          {/* Floating Compare Drawer */}
          <FloatingCompareDrawer
            selectedTours={compareTours}
            onRemoveTour={(id) => setCompareTours((prev) => prev.filter((t) => t.id !== id))}
            onClearAll={() => setCompareTours([])}
          />
        </div>
      </div>
    </>
  );
}
