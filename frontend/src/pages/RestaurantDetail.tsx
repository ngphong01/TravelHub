import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRestaurantBySlug } from '../services/restaurant';
import Skeleton from '../components/Skeleton';
import SEOHead from '../components/SEOHead';
import MapEmbed from '../components/MapEmbed';
import { getAuthenticImage, handleImageError } from '../utils/imageFallback';
import {
  MapPinIcon,
  StarIcon,
  BuildingStorefrontIcon,
  PhoneIcon,
  GlobeAltIcon,
  ClockIcon,
  UserGroupIcon,
  HeartIcon,
  ShareIcon,
  CheckIcon,
  ExclamationCircleIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  CheckBadgeIcon,
} from '@heroicons/react/24/solid';
import { useState, useMemo, useEffect } from 'react';

export default function RestaurantDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [reservationDate, setReservationDate] = useState(defaultDate);
  const [reservationTime, setReservationTime] = useState('18:30');
  const [partySize, setPartySize] = useState(2);
  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('travelgo:wishlist');
      if (saved && slug) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) return list.includes(slug);
      }
    } catch {}
    return false;
  });

  const { data: dbRestaurant, isLoading, isError, refetch } = useQuery({
    queryKey: ['restaurant', slug],
    queryFn: () => getRestaurantBySlug(slug!),
    enabled: !!slug,
    retry: 1,
  });

  const restaurant = useMemo(() => {
    if (dbRestaurant) return dbRestaurant;

    const s = (slug || '').toLowerCase();
    let name = 'Nhà Hàng Ẩm Thực Cao Cấp';
    let city = 'Đà Nẵng';
    let address = 'Đường bờ biển du lịch, Trung tâm ẩm thực';
    let desc = 'Không gian ẩm thực sang trọng với nguồn nguyên liệu tươi ngon đánh bắt trong ngày, phục vụ các món ăn truyền thống và hải sản cao cấp.';

    if (s.includes('ha-noi') || s.includes('hanoi')) {
      name = 'Nhà Hàng Sen Tây Hồ Hà Nội';
      city = 'Hà Nội';
      address = 'Lạc Long Quân, Quận Tây Hồ, Hà Nội';
      desc = 'Không gian ẩm thực truyền thống Bắc Bộ đặc sắc bên bờ hồ Tây thơ mộng, quy tụ hàng trăm món ngon 3 miền.';
    } else if (s.includes('ha-long') || s.includes('halong')) {
      name = 'Nhà Hàng Cua Vàng Bãi Cháy';
      city = 'Quảng Ninh';
      address = 'Đường Hạ Long, Khu Bãi Cháy, TP. Hạ Long';
      desc = 'Thương hiệu hải sản nổi tiếng Hạ Long với món lẩu cua vàng trứ danh và các loại hải sản vịnh tươi sống.';
    } else if (s.includes('phu-quoc') || s.includes('phuquoc')) {
      name = 'Nhà Hàng Gió Biển Sunset Phú Quốc';
      city = 'Phú Quốc';
      address = 'Bãi Trường, Dương Tơ, TP. Phú Quốc';
      desc = 'Nhà hàng ven biển lãng mạn ngắm hoàng hôn, nổi tiếng với ghẹ Hàm Ninh và gỏi cá trích tươi ngon.';
    } else if (s.includes('hoi-an') || s.includes('hoian')) {
      name = 'Nhà Hàng Bông Hồng Trắng Phố Cổ Hội An';
      city = 'Quảng Nam';
      address = 'Đường Phan Chu Trinh, Phường Minh An, TP. Hội An';
      desc = 'Điểm đến ẩm thực di sản với đặc sản bánh bao, bánh vạc và cao lầu Hội An gia truyền.';
    } else if (s.includes('sa-pa') || s.includes('sapa')) {
      name = 'Nhà Hàng Bản Sắc Tây Bắc Sa Pa';
      city = 'Sa Pa';
      address = 'Đường Cầu Mây, Thị xã Sa Pa, Lào Cai';
      desc = 'Ẩm thực độc đáo vùng cao với thắng cố ngựa, cá hồi tươi Sa Pa và lợn bản nướng thơm lừng.';
    } else if (s.includes('da-nang') || s.includes('danang')) {
      name = 'Nhà Hàng Hải Sản Bé Mặn Đà Nẵng';
      city = 'Đà Nẵng';
      address = 'Đường Võ Nguyên Giáp, Phường Mân Thái, Quận Sơn Trà, Đà Nẵng';
      desc = 'Địa chỉ hải sản tươi sống bậc nhất Đà Nẵng ngay sát bãi biển Mỹ Khê, tự tay chọn hải sản đang bơi.';
    } else if (slug) {
      const formatted = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      name = `Nhà Hàng ${formatted}`;
    }

    return {
      id: 888,
      name,
      slug: slug || 'nha-hang-am-thuc-heritage',
      description: desc,
      image: getAuthenticImage(null, slug, 'restaurant'),
      address,
      city,
      country: 'Việt Nam',
      cuisine: 'Hải sản & Ẩm thực Việt Nam cao cấp',
      priceRange: '250.000đ - 650.000đ / người',
      rating: 4.8,
      featured: true,
      amenities: ['Chỗ đỗ xe miễn phí', 'Không gian ngoài trời ngắm biển', 'Phòng VIP riêng tư', 'Thanh toán thẻ & VietQR', 'WiFi tốc độ cao'],
      contact: '1900 232389',
      website: 'https://travelhub.vn',
      openingHours: {
        'Thứ Hai': '10:00 - 22:30',
        'Thứ Ba': '10:00 - 22:30',
        'Thứ Tư': '10:00 - 22:30',
        'Thứ Năm': '10:00 - 22:30',
        'Thứ Sáu': '10:00 - 23:00',
        'Thứ Bảy': '09:30 - 23:30',
        'Chủ Nhật': '09:30 - 23:00',
      },
    };
  }, [dbRestaurant, slug]);

  const handleReservation = () => {
    if (!reservationDate || !reservationTime) {
      toast.error('Vui lòng chọn ngày và giờ dùng bữa');
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(reservationDate) < today) {
      toast.error('Không thể đặt bàn vào ngày trong quá khứ!');
      return;
    }
    // Đặt chỗ nhà hàng là miễn phí, không thu phí trước, thanh toán trực tiếp theo món tại quán
    navigate(`/checkout?type=restaurant&id=${restaurant?.id}&slug=${restaurant?.slug}&date=${reservationDate}&time=${reservationTime}&partySize=${partySize}&amount=0`);
  };

  const handleAddToCart = () => {
    if (!reservationDate || !reservationTime) {
      toast.error('Vui lòng chọn ngày và giờ dùng bữa trước khi thêm vào giỏ');
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(reservationDate) < today) {
      toast.error('Không thể đặt bàn vào ngày trong quá khứ!');
      return;
    }
    // Giữ chỗ miễn phí 0đ theo cam kết trên trang chi tiết
    addItem({
      type: 'restaurant',
      itemId: restaurant.id,
      title: `${restaurant.name} (Đặt bàn ${partySize} khách)`,
      slug: restaurant.slug,
      price: 0,
      originalPrice: 0,
      date: `${reservationDate} lúc ${reservationTime}`,
      guests: partySize,
      unitLabel: 'khách',
      location: restaurant.city || 'Việt Nam',
      image: getAuthenticImage(restaurant.image, restaurant.name, 'restaurant'),
      adults: partySize,
      children: 0,
      pricePerAdult: 0,
      pricePerChild: 0,
      discount: 0,
    });
  };

  const handleToggleWishlist = () => {
    const nextState = !isFavorite;
    setIsFavorite(nextState);
    try {
      const saved = localStorage.getItem('travelgo:wishlist');
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];
      const currentSlug = slug || restaurant?.slug;
      if (currentSlug) {
        if (nextState) {
          if (!list.includes(currentSlug)) list.push(currentSlug);
          toast.success(`Đã lưu "${restaurant.name}" vào yêu thích trên thiết bị này! (Đăng nhập để đồng bộ vĩnh viễn)`, {
            icon: '❤️',
            duration: 4000,
          });
        } else {
          list = list.filter((s) => s !== currentSlug);
          toast(`Đã bỏ lưu "${restaurant.name}" khỏi danh sách yêu thích`, { icon: '🤍' });
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

  const handleShareRestaurant = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Đã sao chép liên kết nhà hàng vào bộ nhớ tạm!');
  };

  const amenitiesList = useMemo(() => {
    if (Array.isArray(restaurant.amenities)) return restaurant.amenities;
    if (typeof restaurant.amenities === 'string') {
      try {
        const parsed = JSON.parse(restaurant.amenities);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [restaurant.amenities];
      }
    }
    return [];
  }, [restaurant.amenities]);

  const openingHours = restaurant.openingHours && typeof restaurant.openingHours === 'object'
    ? restaurant.openingHours
    : {};
  const restaurantLocation = restaurant.address && restaurant.city &&
    restaurant.address.toLocaleLowerCase('vi').includes(restaurant.city.toLocaleLowerCase('vi'))
    ? restaurant.address
    : [restaurant.address, restaurant.city].filter(Boolean).join(', ') || 'Chưa cập nhật địa chỉ';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
        <Skeleton className="h-96 w-full max-w-7xl mx-auto rounded-3xl mb-8" />
        <Skeleton className="h-64 w-full max-w-7xl mx-auto rounded-3xl" />
      </div>
    );
  }

  if (isError || !dbRestaurant) {
    return <div role="alert" className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Không tải được thông tin nhà hàng</h1>
      <p>Nhà hàng không tồn tại hoặc máy chủ đang gián đoạn.</p>
      <button type="button" onClick={() => refetch()} className="rounded-lg bg-blue-700 px-5 py-2 text-white">Tải lại</button>
    </div>;
  }

  return (
    <>
      <SEOHead
        title={`${restaurant.name} - Thông Tin Nhà Hàng | TravelHub`}
        description={restaurant.description || `Xem thông tin nhà hàng ${restaurant.name} trên TravelHub.`}
        url={`/restaurants/${restaurant.slug}`}
        image={restaurant.image || undefined}
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link to="/" className="hover:text-cyan-600">Trang chủ</Link>
              <ChevronRightIcon className="w-3.5 h-3.5" />
              <Link to="/restaurants" className="hover:text-cyan-600">Nhà hàng & Ẩm thực</Link>
              <ChevronRightIcon className="w-3.5 h-3.5" />
              <span className="text-slate-700 dark:text-slate-300">{restaurant.city || 'Việt Nam'}</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
              <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">{restaurant.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleWishlist}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                title="Lưu vào danh sách yêu thích"
              >
                {isFavorite ? <HeartIconSolid className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={handleShareRestaurant}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                title="Chia sẻ"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative h-56 md:h-72 overflow-hidden bg-slate-900">
          <img
            src={getAuthenticImage(restaurant.image, restaurant.name || restaurant.slug, 'restaurant')}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              handleImageError(e, restaurant.name || restaurant.slug, 'restaurant');
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-6 left-0 right-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600 text-white mb-2 inline-block">
                {restaurant.cuisine || 'Ẩm thực địa phương'}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {restaurant.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Core Info Bar */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-lg flex items-center justify-center shadow-md">
                      {restaurant.rating ? Number(restaurant.rating).toFixed(1) : '—'}
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 dark:text-white block text-sm">Thông tin TravelHub</span>
                      <span className="text-xs text-slate-500">Điểm hiển thị theo dữ liệu nhà hàng</span>
                    </div>
                  </div>
                  {restaurant.priceRange && (
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Mức giá trung bình:</span>
                      <span className="text-base font-extrabold text-orange-600 dark:text-orange-400">
                        {restaurant.priceRange}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <MapPinIcon className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>{restaurantLocation}</span>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Giới Thiệu Ẩm Thực & Không Gian
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {restaurant.description}
                </p>
              </div>

              {/* Amenities */}
              {amenitiesList.length > 0 && <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <SparklesIcon className="w-6 h-6 text-amber-500" />
                  Tiện Nghi & Dịch Vụ Nhà Hàng
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {amenitiesList.map((amenity: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{String(amenity)}</span>
                    </div>
                  ))}
                </div>
              </div>}

              {/* Opening Hours */}
              {Object.keys(openingHours).length > 0 && <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <ClockIcon className="w-6 h-6 text-cyan-600" />
                  Thời Gian Phục Vụ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  {Object.entries(openingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{day}:</span>
                      <span className="text-orange-600 dark:text-orange-400 font-semibold">{hours as string}</span>
                    </div>
                  ))}
                </div>
              </div>}

              {/* Location Map */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6 text-red-500" />
                  Vị Trí Bản Đồ
                </h3>
                <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
                  <MapEmbed query={`${restaurant.name}, ${restaurant.city || 'Việt Nam'}`} />
                </div>
              </div>
            </div>

            {/* Right Column - Sticky Reservation Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 inline-block mb-2">
                    Thông Tin Đặt Bàn
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Xem Thông Tin Đặt Bàn
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Tình trạng bàn trống cần được nhà hàng xác nhận.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Ngày dùng bữa:
                    </label>
                    <input
                      type="date"
                      value={reservationDate}
                      onChange={(e) => setReservationDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Khung giờ:
                    </label>
                    <select
                      value={reservationTime}
                      onChange={(e) => setReservationTime(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="11:30">11:30 - Trưa</option>
                      <option value="12:00">12:00 - Trưa</option>
                      <option value="12:30">12:30 - Trưa</option>
                      <option value="18:00">18:00 - Tối</option>
                      <option value="18:30">18:30 - Tối</option>
                      <option value="19:00">19:00 - Tối</option>
                      <option value="19:30">19:30 - Tối</option>
                      <option value="20:00">20:00 - Tối</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Số lượng thực khách:
                    </label>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-extrabold text-sm">{partySize} Người lớn</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPartySize(Math.max(1, partySize - 1))}
                          className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-600 font-bold flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-sm">{partySize}</span>
                        <button
                          type="button"
                          onClick={() => setPartySize(partySize + 1)}
                          className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-600 font-bold flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300/40 text-xs text-emerald-700 dark:text-emerald-300 space-y-1">
                  <p className="font-bold">Tình trạng bàn trống chưa được xác nhận</p>
                  <p>Vui lòng xác nhận với nhà hàng trước khi đến.</p>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleReservation}
                    className="w-full py-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm transition-colors"
                  >
                    Xem Thông Tin Đặt Bàn
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full py-3 rounded-2xl border-2 border-orange-600 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <ShoppingBagIcon className="w-4 h-4" />
                    Thêm Vào Giỏ Hàng
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-[11px] text-slate-400">
                    Hotline hỗ trợ đặc biệt: 0868 156 027
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
