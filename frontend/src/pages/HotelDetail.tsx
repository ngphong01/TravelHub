import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHotelBySlug } from '../services/hotel';
import Skeleton from '../components/Skeleton';
import SEOHead from '../components/SEOHead';
import MapEmbed from '../components/MapEmbed';
import { getAuthenticImage, getAuthenticGallery, handleImageError } from '../utils/imageFallback';
import {
  MapPinIcon,
  StarIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  PhoneIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  HeartIcon,
  ShareIcon,
  CheckIcon,
  WifiIcon,
  TvIcon,
  FireIcon,
  HomeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  XMarkIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  HandThumbUpIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  CheckBadgeIcon,
} from '@heroicons/react/24/solid';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface RoomType {
  id: string;
  name: string;
  pricePerNight: number;
  image: string;
}

export default function HotelDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Booking parameters state (Chuẩn Booking.com)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);

  const defaultCheckIn = tomorrow.toISOString().split('T')[0];
  const defaultCheckOut = dayAfterTomorrow.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomsCount, setRoomsCount] = useState<Record<string, number>>({ standard: 1 });
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
  const [activePhotoModal, setActivePhotoModal] = useState<number | null>(null);

  // Fetch real hotel data from backend
  const { data: dbHotel, isLoading, isError, refetch } = useQuery({
    queryKey: ['hotel', slug],
    queryFn: () => getHotelBySlug(slug!),
    enabled: !!slug,
    retry: 1,
  });

  // Smart fallback hotel data if not found or empty
  const hotel = useMemo(() => {
    if (dbHotel) return dbHotel;

    const s = (slug || '').toLowerCase();
    let name = 'Khách sạn cao cấp';
    let city = 'Đà Nẵng';
    let address = 'Đường biển Mỹ Khê, Đà Nẵng';
    let desc = 'Khách sạn nghỉ dưỡng sang trọng với tầm nhìn trọn vẹn ra cảnh quan thiên nhiên tuyệt mỹ.';

    if (s.includes('ha-noi') || s.includes('hanoi') || s.includes('hoan-kiem')) {
      name = 'Khách sạn Khang Palace Hà Nội';
      city = 'Hà Nội';
      address = 'Phố Hàng Bông, Quận Hoàn Kiếm, Hà Nội';
      desc = 'Khách sạn boutique đậm phong cách thanh lịch phố cổ Hà Nội, gần hồ Hoàn Kiếm và các điểm tham quan trung tâm.';
    } else if (s.includes('ha-long') || s.includes('halong') || s.includes('bai-chay')) {
      name = 'Heritage Hạ Long Grand Resort';
      city = 'Quảng Ninh';
      address = 'Đường Bãi Cháy, TP. Hạ Long, Quảng Ninh';
      desc = 'Resort nghỉ dưỡng hướng vịnh di sản với hồ bơi vô cực và ẩm thực hải sản phong phú.';
    } else if (s.includes('phu-quoc') || s.includes('phuquoc')) {
      name = 'Sunset Sanato Resort Phú Quốc';
      city = 'Phú Quốc';
      address = 'Bãi Trường, Dương Tơ, TP. Phú Quốc';
      desc = 'Khu nghỉ dưỡng biển với bãi cát dài thơ mộng, ngắm hoàng hôn rực rỡ và dịch vụ thư giãn đẳng cấp.';
    } else if (s.includes('sa-pa') || s.includes('sapa')) {
      name = 'Silk Path Grand Resort & Spa Sa Pa';
      city = 'Sa Pa';
      address = 'Đồi Quan Sứ, Thị xã Sa Pa, Lào Cai';
      desc = 'Khu nghỉ dưỡng mang phong cách châu Âu giữa mây ngàn Tây Bắc, nhìn thẳng ra dãy Hoàng Liên Sơn hùng vĩ.';
    } else if (s.includes('nha-trang')) {
      name = 'Amiana Resort Nha Trang';
      city = 'Nha Trang';
      address = 'Đường Phạm Văn Đồng, TP. Nha Trang';
      desc = 'Resort ven biển với hồ bơi nước biển tự nhiên, bãi tắm riêng và các tiện ích spa đẳng cấp.';
    } else if (s.includes('da-nang') || s.includes('danang') || s.includes('vinpearl')) {
      name = 'Vinpearl Luxury Resort & Spa';
      city = 'Đà Nẵng';
      address = 'Đường Trường Sa, Bán đảo Sơn Trà, Ngũ Hành Sơn, Đà Nẵng';
      desc = 'Tọa lạc trên bãi biển Mỹ Khê tuyệt đẹp, khu nghỉ dưỡng sở hữu không gian biển xanh thơ mộng, hồ bơi vô cực rộng lớn và hệ thống ẩm thực quốc tế 5 sao đẳng cấp.';
    } else if (slug) {
      const formatted = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      name = `Khách Sạn & Resort ${formatted}`;
    }

    return {
      id: 999,
      name,
      slug: slug || 'khach-san-nghi-duong',
      address,
      city,
      country: 'Việt Nam',
      pricePerNight: 2890000,
      rating: 4.9,
      reviewCount: 0,
      description: desc,
      image: getAuthenticImage(null, slug, 'hotel'),
      amenities: ['wifi', 'pool', 'spa', 'gym', 'restaurant', 'beach', 'breakfast'],
      contact: '1900 232389',
      website: 'https://travelhub.vn',
    };
  }, [dbHotel, slug]);

  // Photo Gallery (Authentic unique gallery)
  const hotelPhotos = useMemo(() => {
    return getAuthenticGallery([hotel.image], hotel.name || hotel.city || slug, 'hotel');
  }, [hotel.image, hotel.name, hotel.city, slug]);

  // Dynamic Amenities Processing from DB
  const parsedAmenities = useMemo(() => {
    let rawList: any[] = [];
    if (Array.isArray(hotel.amenities)) {
      rawList = hotel.amenities;
    } else if (typeof hotel.amenities === 'string') {
      try {
        rawList = JSON.parse(hotel.amenities);
      } catch {
        rawList = [hotel.amenities];
      }
    }

    const dict: Record<string, { label: string; icon: any; color: string }> = {
      wifi: { label: 'WiFi', icon: WifiIcon, color: 'text-emerald-500' },
      pool: { label: 'Bể bơi', icon: SparklesIcon, color: 'text-amber-500' },
      spa: { label: 'Spa', icon: HeartIcon, color: 'text-pink-500' },
      gym: { label: 'Phòng tập', icon: FireIcon, color: 'text-orange-500' },
      restaurant: { label: 'Nhà hàng', icon: BuildingStorefrontIcon, color: 'text-blue-500' },
      bar: { label: 'Quầy bar', icon: SparklesIcon, color: 'text-purple-500' },
      breakfast: { label: 'Bữa sáng', icon: BuildingOfficeIcon, color: 'text-amber-500' },
      shuttle: { label: 'Xe đưa đón', icon: ShieldCheckIcon, color: 'text-teal-500' },
      beach: { label: 'Bãi biển', icon: HomeIcon, color: 'text-cyan-500' },
      parking: { label: 'Bãi đỗ xe', icon: ShieldCheckIcon, color: 'text-emerald-500' },
    };

    return rawList.map((item: any) => {
      const key = String(item).toLowerCase().trim();
      if (dict[key]) return dict[key];
      return {
        label: String(item),
        icon: CheckBadgeIcon,
        color: 'text-cyan-500',
      };
    });
  }, [hotel.amenities]);

  // Only the hotel's catalog price is available; room inventory is not modeled.
  const roomTypes: RoomType[] = useMemo(() => [{
    id: 'standard',
    name: 'Phòng theo giá niêm yết',
    pricePerNight: Number(hotel.pricePerNight) || 0,
    image: getAuthenticImage(hotel.image, hotel.name, 'hotel'),
  }], [hotel.pricePerNight, hotel.image, hotel.name]);

  // Date validation
  const isDateInvalid = useMemo(() => {
    if (!checkIn || !checkOut) return true;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inDate < today || outDate <= inDate;
  }, [checkIn, checkOut]);

  // Calculate nights
  const totalNights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const diff = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  // Calculate total price based on selected rooms
  const calculateTotal = useMemo(() => {
    let sum = 0;
    roomTypes.forEach((room) => {
      const count = roomsCount[room.id] || 0;
      sum += count * room.pricePerNight * totalNights;
    });
    return sum;
  }, [roomsCount, roomTypes, totalNights]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  const handleRoomCountChange = (roomId: string, count: number) => {
    setRoomsCount((prev) => ({
      ...prev,
      [roomId]: Math.max(1, count),
    }));
  };

  const handleReserve = (roomId?: string) => {
    if (isDateInvalid || totalNights <= 0) {
      toast.error('Ngày trả phòng phải sau ngày nhận phòng và không được chọn ngày trong quá khứ!');
      return;
    }
    let targetRoom = roomId;
    if (!targetRoom) targetRoom = 'standard';
    const count = roomsCount[targetRoom] || 1;
    const roomObj = roomTypes.find((r) => r.id === targetRoom);
    if (!roomObj?.pricePerNight) {
      toast.error('Khách sạn chưa có giá phòng xác thực.');
      return;
    }
    const amount = roomObj.pricePerNight * count * totalNights;
    navigate(`/checkout?type=hotel&id=${hotel.id}&slug=${hotel.slug}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${adults + children}&roomType=${targetRoom}&rooms=${count}&amount=${amount}`);
  };

  const handleAddToCart = (roomTarget?: RoomType) => {
    if (isDateInvalid || totalNights <= 0) {
      toast.error('Ngày trả phòng phải sau ngày nhận phòng và không được chọn ngày trong quá khứ!');
      return;
    }
    let target = roomTarget;
    if (!target) {
      const selectedId = 'standard';
      target = roomTypes.find((r) => r.id === selectedId) || roomTypes[0];
    }
    if (!target?.pricePerNight) {
      toast.error('Khách sạn chưa có giá phòng xác thực.');
      return;
    }
    const count = roomsCount[target.id] || 1;
    const pricePerRoomStay = target.pricePerNight * totalNights;

    addItem({
      type: 'hotel',
      itemId: hotel.id,
      title: `${hotel.name} - ${target.name}`,
      slug: hotel.slug || String(hotel.id),
      price: pricePerRoomStay,
      originalPrice: pricePerRoomStay,
      date: `${checkIn} đến ${checkOut} (${totalNights} đêm)`,
      guests: count,
      unitLabel: 'phòng',
      roomType: target.name,
      checkIn,
      checkOut,
      nights: totalNights,
      location: hotel.city || 'Việt Nam',
      image: getAuthenticImage(hotel.image, hotel.name, 'hotel'),
    });
  };

  const handleToggleWishlist = () => {
    const nextState = !isFavorite;
    setIsFavorite(nextState);
    try {
      const saved = localStorage.getItem('travelgo:wishlist');
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];
      const currentSlug = slug || hotel?.slug;
      if (currentSlug) {
        if (nextState) {
          if (!list.includes(currentSlug)) list.push(currentSlug);
          toast.success(`Đã lưu "${hotel.name}" vào yêu thích trên thiết bị này! (Đăng nhập để đồng bộ vĩnh viễn)`, {
            icon: '❤️',
            duration: 4000,
          });
        } else {
          list = list.filter((s) => s !== currentSlug);
          toast(`Đã bỏ lưu "${hotel.name}" khỏi danh sách yêu thích`, { icon: '🤍' });
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

  const handleShareHotel = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Đã sao chép liên kết khách sạn vào bộ nhớ tạm!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
        <Skeleton className="h-96 w-full max-w-7xl mx-auto rounded-3xl mb-8" />
        <Skeleton className="h-64 w-full max-w-7xl mx-auto rounded-3xl" />
      </div>
    );
  }

  if (isError || !dbHotel) {
    return <div role="alert" className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Không tải được thông tin khách sạn</h1>
      <p>Khách sạn không tồn tại hoặc máy chủ đang gián đoạn.</p>
      <button type="button" onClick={() => refetch()} className="rounded-lg bg-blue-700 px-5 py-2 text-white">Tải lại</button>
    </div>;
  }

  return (
    <>
      <SEOHead
        title={`${hotel.name} - Đặt Phòng Khách Sạn Giá Tốt Nhất | TravelHub`}
        description={hotel.description || `Xem thông tin và giá phòng tại ${hotel.name} trên TravelHub.`}
        url={`/hotels/${hotel.slug}`}
        image={hotelPhotos[0]}
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-20">
        {/* =========================================================================
            BREADCRUMBS & HEADER (Chuẩn Booking.com)
            ========================================================================= */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link to="/" className="hover:text-cyan-600">Trang chủ</Link>
              <ChevronRightIcon className="w-3.5 h-3.5" />
              <Link to="/hotels" className="hover:text-cyan-600">Khách sạn</Link>
              <ChevronRightIcon className="w-3.5 h-3.5" />
              <span className="text-slate-700 dark:text-slate-300">{hotel.city || 'Việt Nam'}</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
              <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">{hotel.name}</span>
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
                onClick={handleShareHotel}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                title="Chia sẻ"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            HOTEL TITLE & TOP SUMMARY (Chuẩn Booking.com)
            ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                  Khách sạn & Resort
                </span>
                <div className="flex text-amber-400">
                  {Array.from({ length: Math.max(0, Math.min(5, Math.round(Number(hotel.rating) || 0))) }).map((_, i) => (
                    <StarIconSolid key={i} className="w-4 h-4" />
                  ))}
                </div>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {hotel.name}
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                <MapPinIcon className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                <span>{hotel.address || 'Chưa cập nhật địa chỉ'}, {hotel.city || 'Việt Nam'}</span>
                <a href="#map" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline ml-1">
                  — Xem vị trí trên bản đồ
                </a>
              </div>
            </div>

          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <img src={hotelPhotos[0]} alt={hotel.name}
            className="w-full h-[300px] sm:h-[440px] rounded-3xl object-cover"
            onError={(e) => handleImageError(e, hotel.name, 'hotel')} />
        </div>

        {/* =========================================================================
            DYNAMIC AMENITIES BAR (Kéo từ Database)
            ========================================================================= */}
        {parsedAmenities.length > 0 && <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 flex items-center gap-6 overflow-x-auto scrollbar-none text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 whitespace-nowrap text-cyan-600 dark:text-cyan-400">
              <CheckBadgeIcon className="w-5 h-5" />
              <span>Tiện nghi nổi bật:</span>
            </div>
            {parsedAmenities.map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
                <amenity.icon className={`w-4 h-4 ${amenity.color}`} />
                <span>{amenity.label}</span>
              </div>
            ))}
          </div>
        </div>}

        {/* =========================================================================
            MAIN CONTENT & ROOM SELECTION TABLE (Signature Booking.com Feature)
            ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT 3 COLUMNS: Room Matrix & Details */}
          <div className="lg:col-span-3 space-y-10">
            {/* Filter Date Bar */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl">
              <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2">
                <CalendarDaysIcon className="w-5 h-5 text-amber-400" />
                Chọn ngày lưu trú để xem giá dự tính
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Ngày nhận phòng</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={checkIn}
                    onChange={(e) => {
                      const newIn = e.target.value;
                      setCheckIn(newIn);
                      if (new Date(checkOut) <= new Date(newIn)) {
                        const next = new Date(newIn);
                        next.setDate(next.getDate() + 1);
                        setCheckOut(next.toISOString().split('T')[0]);
                      }
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 font-bold text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Ngày trả phòng</label>
                  <input
                    type="date"
                    min={(() => {
                      if (!checkIn) return new Date().toISOString().split('T')[0];
                      const d = new Date(checkIn);
                      d.setDate(d.getDate() + 1);
                      return d.toISOString().split('T')[0];
                    })()}
                    value={checkOut}
                    onChange={(e) => {
                      const newOut = e.target.value;
                      if (checkIn && new Date(newOut) <= new Date(checkIn)) {
                        toast.error('Ngày trả phòng phải sau ngày nhận phòng!');
                      }
                      setCheckOut(newOut);
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 font-bold text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Số khách</label>
                  <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 font-bold text-sm text-white flex items-center justify-between">
                    <span>{adults} Người lớn {children > 0 ? `, ${children} trẻ` : ''}</span>
                    <span className={totalNights > 0 ? "text-amber-400 text-xs" : "text-rose-400 text-xs font-bold"}>
                      ({totalNights > 0 ? `${totalNights} đêm` : 'Ngày không hợp lệ'})
                    </span>
                  </div>
                </div>
              </div>
              {isDateInvalid && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-xs text-rose-200 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>Ngày trả phòng phải sau ngày nhận phòng và không được chọn ngày trong quá khứ.</span>
                </div>
              )}
            </div>

            {/* Catalog room rate; no room inventory or special perks are recorded. */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Giá phòng niêm yết</h2>
                <p className="text-sm text-slate-500 mt-1">Loại phòng, tình trạng còn phòng, thuế và điều kiện hủy cần được xác nhận trước khi thanh toán.</p>
              </div>
              {roomTypes.map((room) => {
                const currentCount = roomsCount[room.id] || 0;
                return <div key={room.id} className="p-6 flex flex-col sm:flex-row gap-5 sm:items-center">
                  <img src={room.image} alt={hotel.name} className="w-full sm:w-40 h-28 object-cover rounded-xl"
                    onError={(e) => handleImageError(e, hotel.name, 'hotel')} />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">{room.name}</h3>
                    <p className="text-sm text-slate-500">{formatPrice(room.pricePerNight)} / đêm</p>
                    <p className="text-sm font-semibold text-orange-600">{formatPrice(room.pricePerNight * totalNights)} / {totalNights} đêm</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" aria-label="Giảm số phòng" onClick={() => handleRoomCountChange(room.id, currentCount - 1)}
                      className="w-8 h-8 rounded-lg border border-slate-300">-</button>
                    <span className="w-6 text-center">{currentCount}</span>
                    <button type="button" aria-label="Tăng số phòng" onClick={() => handleRoomCountChange(room.id, currentCount + 1)}
                      className="w-8 h-8 rounded-lg border border-slate-300">+</button>
                  </div>
                </div>;
              })}
            </div>

            {/* Description & Overview */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Giới Thiệu Chung Về {hotel.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {hotel.description}
              </p>
            </div>

            {/* Map Section */}
            <div id="map" className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-red-500" />
                Vị Trí & Khu Vực Xung Quanh
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-4">
                {hotel.address}, {hotel.city}, {hotel.country || 'Việt Nam'}
              </p>
              <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
                <MapEmbed query={`${hotel.name}, ${hotel.city || 'Việt Nam'}`} />
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Sticky Checkout Card (Booking.com style) */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Giá tổng ước tính:</span>
                <span className="text-3xl font-black text-orange-600 dark:text-orange-400 block">
                  {formatPrice(calculateTotal)}
                </span>
                <span className="text-xs text-slate-500">
                  Cho {totalNights} đêm nghỉ · Thuế và phí cần xác nhận
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Nhận phòng:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trả phòng:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thời gian lưu trú:</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{totalNights} đêm</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-300/40 text-xs text-amber-700 dark:text-amber-300 space-y-1">
                <p>Giá và điều kiện đặt phòng cần được khách sạn xác nhận.</p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleReserve()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
                >
                  Xem Thông Tin Đặt Phòng
                </button>
                <button
                  type="button"
                  onClick={() => handleAddToCart()}
                  className="w-full py-3 rounded-2xl border-2 border-blue-600 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBagIcon className="w-4 h-4" />
                  Thêm Vào Giỏ Hàng
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
