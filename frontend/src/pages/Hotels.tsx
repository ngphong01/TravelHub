import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHotelsPaged } from '../services/hotel';
import Skeleton from '../components/Skeleton';
import SEOHead from '../components/SEOHead';
import TravelAnimatedBackground from '../components/TravelAnimatedBackground';
import { getAuthenticImage, handleImageError } from '../utils/imageFallback';
import {
  MapPinIcon,
  StarIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid';

type FilterState = {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
};

export default function Hotels() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 12;

  const filters: FilterState = {
    city: searchParams.get('city') || undefined,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    search: searchParams.get('q') || undefined,
    sort: searchParams.get('sort') || 'created_desc',
  };

  const { data: hotelsData, isLoading, isError, refetch } = useQuery({
    queryKey: ['hotels', page, filters],
    queryFn: () => getHotelsPaged(page, pageSize, {
      q: filters.search,
      city: filters.city,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
    }),
  });

  const hotels = Array.isArray(hotelsData)
    ? hotelsData
    : (hotelsData?.items || []);
  const total = hotelsData?.total ?? (Array.isArray(hotelsData) ? hotelsData.length : 0);

  const handleFilterChange = (key: keyof FilterState | 'q', value: any) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === undefined || value === '') {
      newParams.delete(key === 'q' ? 'q' : key);
    } else {
      newParams.set(key === 'q' ? 'q' : key, String(value));
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = filters.search || filters.city || filters.minPrice || filters.maxPrice;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 transition-colors">
      <SEOHead
        title="Khách sạn & Chỗ nghỉ - TravelHub"
        description="Đặt phòng khách sạn, resort cao cấp với giá ưu đãi tốt nhất trên toàn quốc cùng TravelHub."
      />

      {/* Hero Section (Booking.com Royal Navy Blue) */}
      <section className="relative overflow-hidden bg-[#003580] text-white">
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="text-center">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 backdrop-blur-md mb-3 inline-block border border-white/20">
              Nghỉ dưỡng đẳng cấp
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight tracking-tight">
              Khách sạn & Resort Hàng Đầu
            </h1>
            <p className="text-base text-blue-100 max-w-2xl mx-auto mb-5 font-normal">
              Khám phá không gian lưu trú sang trọng, view biển đắt giá và dịch vụ chuẩn mực.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-white/15 p-1 rounded-xl shadow-sm">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('q', e.target.value)}
                  placeholder="Tìm theo tên khách sạn, địa chỉ, thành phố..."
                  className="w-full pl-12 pr-6 py-3.5 text-base text-gray-900 dark:text-white bg-white dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200/80 dark:border-slate-800 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">Thành phố</label>
              <input
                type="text"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="VD: Hà Nội, Đà Nẵng, Phú Quốc"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">Giá tối thiểu (VND)</label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="0"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">Giá tối đa (VND)</label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Không giới hạn"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">Sắp xếp theo</label>
              <select
                value={filters.sort || 'created_desc'}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="created_desc">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
                <option value="rating_desc">Đánh giá cao nhất</option>
                <option value="name_asc">Tên A-Z</option>
              </select>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              ✕ Xóa toàn bộ bộ lọc
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Tìm thấy <strong className="text-blue-600 dark:text-blue-400 font-bold">{total}</strong> khách sạn phù hợp
          </p>
        </div>

        {/* Hotels Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <div role="alert" className="text-center py-20 bg-white rounded-3xl border border-gray-200">
            <p className="text-lg font-bold mb-3">Không tải được danh sách khách sạn</p>
            <button type="button" onClick={() => refetch()} className="px-4 py-2 bg-blue-600 text-white rounded-xl">Thử lại</button>
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800">
            <BuildingOfficeIcon className="h-20 w-20 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-2">Không tìm thấy khách sạn nào</p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc giá.</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-sm"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {hotels.map((hotel) => (
                <Link
                  key={hotel.id}
                  to={`/hotels/${hotel.slug}`}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <img
                      src={getAuthenticImage(hotel.image, hotel.name || hotel.slug, 'hotel')}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        handleImageError(e, hotel.name || hotel.slug, 'hotel');
                      }}
                    />
                    {hotel.featured && (
                      <div className="absolute top-3.5 left-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        Nổi bật
                      </div>
                    )}
                    {hotel.rating && (
                      <div className="absolute bottom-3.5 left-3.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <StarIconSolid className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{hotel.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {hotel.name}
                      </h3>
                      {hotel.address && (
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400 text-xs mb-2">
                          <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0 text-blue-600" />
                          <span className="line-clamp-1">{hotel.address}</span>
                        </div>
                      )}
                      {hotel.city && (
                        <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">{hotel.city}, {hotel.country || 'Việt Nam'}</p>
                      )}
                    </div>

                    {hotel.pricePerNight && (
                      <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Chỉ từ</span>
                          <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                            {hotel.pricePerNight.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-slate-400">/ đêm</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {total > pageSize && (
              <div className="flex justify-center items-center gap-3">
                <button
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page - 1) })}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition text-sm font-semibold"
                >
                  Trang trước
                </button>
                <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                  Trang {page} / {Math.ceil(total / pageSize)}
                </span>
                <button
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page + 1) })}
                  disabled={page >= Math.ceil(total / pageSize)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition text-sm font-semibold"
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

