import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRestaurantsPaged } from '../services/restaurant';
import Skeleton from '../components/Skeleton';
import {
  MapPinIcon,
  StarIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid';

type FilterState = {
  city?: string;
  cuisine?: string;
  priceRange?: string;
  search?: string;
  sort?: string;
};

export default function Restaurants() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 12;

  const filters: FilterState = {
    city: searchParams.get('city') || undefined,
    cuisine: searchParams.get('cuisine') || undefined,
    priceRange: searchParams.get('priceRange') || undefined,
    search: searchParams.get('q') || undefined,
    sort: searchParams.get('sort') || 'created_desc',
  };

  const { data: restaurantsData, isLoading } = useQuery({
    queryKey: ['restaurants', page, filters],
    queryFn: () => getRestaurantsPaged(page, pageSize, {
      q: filters.search,
      city: filters.city,
      cuisine: filters.cuisine,
      priceRange: filters.priceRange,
      sort: filters.sort,
    }),
  });

  const restaurants = restaurantsData?.items || [];
  const total = restaurantsData?.total || 0;

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

  const hasActiveFilters = filters.city || filters.cuisine || filters.priceRange;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section (Booking.com Style Royal Navy) */}
      <section className="relative overflow-hidden bg-[#003580] text-white">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="text-center mb-8">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 backdrop-blur-md mb-3 inline-block border border-white/20">
              Khám Phá Hương Vị Bản Địa
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-3 leading-tight tracking-tight">
              Nhà Hàng & Ẩm Thực Du Lịch
            </h1>
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto mb-8 font-normal">
              Trải nghiệm tinh hoa ẩm thực 3 miền từ quán ăn truyền thống đến nhà hàng đạt chuẩn quốc tế
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-amber-400 p-1 sm:p-1.5 rounded-2xl shadow-2xl">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('q', e.target.value)}
                  placeholder="Tìm kiếm nhà hàng (tên quán, món ăn đặc sản, địa chỉ...)"
                  className="w-full pl-12 pr-5 py-3.5 text-base text-gray-900 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Thành phố</label>
              <input
                type="text"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="VD: Hà Nội, Đà Nẵng, Hạ Long"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Loại ẩm thực</label>
              <input
                type="text"
                value={filters.cuisine || ''}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                placeholder="VD: Hải sản, Món Việt, Phở"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mức giá</label>
              <select
                value={filters.priceRange || ''}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="">Tất cả mức giá</option>
                <option value="$">Bình dân ($)</option>
                <option value="$$">Vừa phải ($$)</option>
                <option value="$$$">Cao cấp ($$$)</option>
                <option value="$$$$">Fine Dining ($$$$)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Sắp xếp</label>
              <select
                value={filters.sort || 'created_desc'}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="created_desc">Mới nhất</option>
                <option value="name_asc">Tên A-Z</option>
                <option value="name_desc">Tên Z-A</option>
                <option value="rating_desc">Đánh giá cao</option>
              </select>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
            >
              ✕ Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Tìm thấy <span className="font-bold text-slate-900">{total}</span> nhà hàng phù hợp
          </p>
        </div>

        {/* Restaurants Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <BuildingStorefrontIcon className="h-16 w-16 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-600">Không tìm thấy nhà hàng nào phù hợp với bộ lọc</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {restaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  to={`/restaurants/${restaurant.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={restaurant.image && restaurant.image.startsWith('http') ? restaurant.image : (restaurant.image && restaurant.image.startsWith('/uploads') ? restaurant.image : `/uploads/restaurants/${restaurant.image}`) || '/uploads/restaurants/pho-batdan.jpg'}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/uploads/restaurants/pho-batdan.jpg';
                      }}
                    />
                    {restaurant.featured && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm">
                        Nổi bật
                      </div>
                    )}
                    {restaurant.rating && (
                      <div className="absolute bottom-3 left-3 bg-slate-950/75 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 border border-white/10">
                        <StarIconSolid className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-xs font-bold text-white">{restaurant.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {restaurant.name}
                      </h3>
                      {restaurant.cuisine && (
                        <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold mb-2.5">
                          {restaurant.cuisine}
                        </div>
                      )}
                      {restaurant.address && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                          <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                          <span className="truncate">{restaurant.address}</span>
                        </div>
                      )}
                    </div>
                    {restaurant.priceRange && (
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                        <span className="text-xs text-slate-400">Khoảng giá</span>
                        <div className="text-sm font-bold text-blue-600">
                          {restaurant.priceRange}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {total > pageSize && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page - 1) })}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  Trước
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Trang {page} / {Math.ceil(total / pageSize)}
                </span>
                <button
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page + 1) })}
                  disabled={page >= Math.ceil(total / pageSize)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

