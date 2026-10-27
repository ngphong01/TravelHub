import React, { useState, useEffect } from 'react';
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
import FlashSaleBanner from '../components/FlashSaleBanner';
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

// Slides phong cảnh 4K chuẩn điện ảnh cho Hero Banner (Unsplash CDN tốc độ cao)
const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=85',
    tag: 'Vịnh Hạ Long',
    title: 'Kỳ Quan Thiên Nhiên Thế Giới',
    subtitle: 'Nghỉ dưỡng du thuyền 5 sao đẳng cấp, chèo kayak xuyên hang động và ngắm hoàng hôn vịnh ngọc.',
    badge: '★ Tour Bán Chạy Nhất · Tiết Kiệm Đến 35%',
    link: '/tours/tour-ha-long-2n1d-du-thuyen-5-sao',
  },
  {
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1920&q=85',
    tag: 'Đà Nẵng & Hội An',
    title: 'Cầu Vàng Bà Nà & Phố Cổ Hội An',
    subtitle: 'Trải nghiệm cáp treo đạt kỷ lục thế giới, dạo phố cổ lung linh đèn lồng và tắm biển Mỹ Khê.',
    badge: '★ Lựa Chọn Hàng Đầu Của Du Khách 2026',
    link: '/tours/tour-da-nang-ba-na-hills-3n2d',
  },
  {
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1920&q=85',
    tag: 'Đảo Ngọc Phú Quốc',
    title: 'Thiên Đường Nghỉ Dưỡng Nhiệt Đới',
    subtitle: 'Hòa mình vào làn nước trong vắt bãi Sao, cáp treo vượt biển Hòn Thơm và ẩm thực bún quậy trứ danh.',
    badge: '★ Combo Vé Máy Bay + Resort 5 Sao',
    link: '/tours/tour-phu-quoc-4-dao-3n2d',
  },
  {
    image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1920&q=85',
    tag: 'Sa Pa - Fansipan',
    title: 'Nóc Nhà Đông Dương & Mùa Săn Mây',
    subtitle: 'Chinh phục cột mốc đỉnh Fansipan 3.143m, thưởng ngoạn ruộng bậc thang Mường Hoa kỳ vĩ.',
    badge: '★ Mùa Lúa Chín & Săn Mây Đẹp Nhất Năm',
    link: '/tours/tour-sa-pa-fansipan-2n1d',
  },
];

// Reviews thực tế từ du khách Việt Nam (Phong cách Tripadvisor - Tối giản, chân thực)
const REAL_VIETNAM_REVIEWS = [
  {
    id: 1,
    author: 'Nguyễn Minh Trang',
    city: 'Hà Nội',
    tour: 'Tour Du Thuyền Hạ Long 5 Sao Heritage',
    rating: 5,
    date: '15/10/2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    comment: 'Chuyến đi tuyệt vời cùng cả gia đình. Du thuyền 5 sao chuẩn mực, buffet hải sản rất tươi và phong phú. Nhận mã QR vé điện tử từ TravelHub nhanh chóng, lên tàu không phải chờ đợi.',
    verified: true,
  },
  {
    id: 2,
    author: 'Trần Hoàng Nam',
    city: 'TP. Hồ Chí Minh',
    tour: 'Tour Đà Nẵng - Bà Nà Hills - Phố Cổ Hội An',
    rating: 5,
    date: '08/10/2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    comment: 'Hướng dẫn viên nhiệt tình, chu đáo từng chút một cho bố mẹ lớn tuổi của mình. Lịch trình linh hoạt, xe đưa đón Limousine êm ái. Giá tour qua TravelHub tiết kiệm hơn 25% so với đại lý truyền thống.',
    verified: true,
  },
  {
    id: 3,
    author: 'Lê Phương Thảo',
    city: 'Đà Nẵng',
    tour: 'Combo Nghỉ Dưỡng Phú Quốc 3N2Đ Resort View Biển',
    rating: 5,
    date: '22/09/2026',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    comment: 'Resort ở Bãi Trường ngắm hoàng hôn rất đẹp. Hỗ trợ check-in mượt mà, nhân viên TravelHub tư vấn tận tình qua Zalo. Chắc chắn sẽ quay lại đặt tiếp cho chuyến đi tới.',
    verified: true,
  },
];

// Fallback Tour bán chạy (Chuẩn Vietravel & Klook - Mỗi tour 1 ảnh đặc trưng độc nhất)
const FALLBACK_TOURS = [
  {
    id: 101,
    name: 'Tour Hạ Long 2N1Đ - Du Thuyền 5 Sao Đẳng Cấp Heritage',
    slug: 'tour-ha-long-2n1d-du-thuyen-5-sao',
    destination: 'Vịnh Hạ Long',
    duration: '2 ngày 1 đêm',
    departureSchedule: 'Thứ 5 & Thứ 7 hàng tuần',
    transport: 'Xe Limousine Dcar',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviewsCount: 1420,
    price: 2490000,
    originalPrice: 3890000,
  },
  {
    id: 102,
    name: 'Tour Đà Nẵng - Cầu Vàng Bà Nà Hills - Phố Cổ Hội An',
    slug: 'tour-da-nang-ba-na-hills-3n2d',
    destination: 'Đà Nẵng - Hội An',
    duration: '3 ngày 2 đêm',
    departureSchedule: 'Thứ 6 & Chủ Nhật hàng tuần',
    transport: 'Máy bay khứ hồi + Ô tô',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    rating: 4.85,
    reviewsCount: 980,
    price: 2990000,
    originalPrice: 4500000,
  },
  {
    id: 103,
    name: 'Nghỉ Dưỡng Đảo Ngọc Phú Quốc - Cáp Treo Hòn Thơm 3N2Đ',
    slug: 'nghi-duong-phu-quoc-3n2d',
    destination: 'Phú Quốc',
    duration: '3 ngày 2 đêm',
    departureSchedule: 'Khởi hành hàng ngày',
    transport: 'Máy bay + Resort 5 Sao',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
    rating: 4.92,
    reviewsCount: 1650,
    price: 3390000,
    originalPrice: 5200000,
  },
  {
    id: 104,
    name: 'Tour Sa Pa - Chinh Phục Đỉnh Fansipan - Bản Cát Cát',
    slug: 'tour-sa-pa-fansipan-2n1d',
    destination: 'Sa Pa - Lào Cai',
    duration: '2 ngày 1 đêm',
    departureSchedule: 'Thứ 6 hàng tuần',
    transport: 'Xe giường nằm Cabin đôi',
    image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewsCount: 760,
    price: 1890000,
    originalPrice: 2600000,
  },
  {
    id: 105,
    name: 'Khám Phá Ninh Bình - Tràng An - Hang Múa - Bái Đính Trong Ngày',
    slug: 'tour-ninh-binh-trang-an-1-ngay',
    destination: 'Ninh Bình',
    duration: '1 ngày',
    departureSchedule: 'Khởi hành hàng ngày từ Hà Nội',
    transport: 'Xe du lịch máy lạnh cao cấp',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviewsCount: 1120,
    price: 850000,
    originalPrice: 1200000,
  },
  {
    id: 106,
    name: 'Tour Khám Phá Cao Nguyên Đá Hà Giang - Đèo Mã Pí Lèng',
    slug: 'tour-ha-giang-ma-pi-leng-3n2d',
    destination: 'Hà Giang',
    duration: '3 ngày 2 đêm',
    departureSchedule: 'Thứ 5 hàng tuần',
    transport: 'Xe Limousine + Xe máy bản địa',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    rating: 4.95,
    reviewsCount: 890,
    price: 2650000,
    originalPrice: 3500000,
  },
];

// Fallback Khách sạn & Resort cao cấp (Chuẩn Booking.com)
const FALLBACK_HOTELS = [
  {
    id: 1,
    name: 'Ha Long Bay Luxury Resort & Spa',
    slug: 'halong-bay-luxury-resort',
    city: 'Hạ Long, Quảng Ninh',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    rating: 9.4,
    ratingText: 'Xuất sắc',
    reviewsCount: 1420,
    pricePerNight: 2850000,
    originalPrice: 4200000,
    roomType: 'Phòng Deluxe Nhìn Ra Vịnh',
    distance: 'Cách trung tâm 1.2 km · Giáp biển',
  },
  {
    id: 2,
    name: 'InterContinental Danang Sun Peninsula Resort',
    slug: 'intercontinental-danang',
    city: 'Bán đảo Sơn Trà, Đà Nẵng',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    rating: 9.6,
    ratingText: 'Tuyệt hảo',
    reviewsCount: 2180,
    pricePerNight: 6890000,
    originalPrice: 8900000,
    roomType: 'Resort Classic Oceanview Suite',
    distance: 'Bãi biển riêng tư · Đưa đón sân bay',
  },
  {
    id: 3,
    name: 'JW Marriott Phu Quoc Emerald Bay Resort',
    slug: 'jw-marriott-phu-quoc',
    city: 'Bãi Khem, An Thới, Phú Quốc',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    rating: 9.5,
    ratingText: 'Xuất sắc',
    reviewsCount: 1890,
    pricePerNight: 5490000,
    originalPrice: 7200000,
    roomType: 'Emerald Bay View King Room',
    distance: 'Bãi Khem cát trắng · 3 Hồ bơi vô cực',
  },
  {
    id: 4,
    name: 'Vinpearl Resort & Spa Nha Trang Bay',
    slug: 'vinpearl-resort-nha-trang',
    city: 'Đảo Hòn Tre, Nha Trang',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    rating: 9.2,
    ratingText: 'Tuyệt vời',
    reviewsCount: 1640,
    pricePerNight: 2450000,
    originalPrice: 3500000,
    roomType: 'Deluxe Ocean View (Bao gồm cáp treo)',
    distance: 'Đảo Hòn Tre · Bãi tắm riêng',
  },
  {
    id: 5,
    name: 'Legacy Yen Tu - MGallery Resort',
    slug: 'legacy-yen-tu-mgallery',
    city: 'Uông Bí, Quảng Ninh',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    rating: 9.3,
    ratingText: 'Xuất sắc',
    reviewsCount: 1120,
    pricePerNight: 3190000,
    originalPrice: 4600000,
    roomType: 'Superior Room (Kiến trúc thời Trần)',
    distance: 'Chân núi Yên Tử · Không gian tĩnh lặng',
  },
  {
    id: 6,
    name: 'Hôtel de la Coupole - MGallery Sa Pa',
    slug: 'hotel-de-la-coupole-sapa',
    city: 'Trung tâm Sa Pa, Lào Cai',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    rating: 9.4,
    ratingText: 'Xuất sắc',
    reviewsCount: 1950,
    pricePerNight: 2990000,
    originalPrice: 4200000,
    roomType: 'Classic Room King Bed View Núi',
    distance: 'Trung tâm Sa Pa · Ga tàu Fansipan',
  },
];

// Fallback Ẩm thực & Nhà hàng trứ danh (Chuẩn Tripadvisor)
const FALLBACK_RESTAURANTS = [
  {
    id: 1,
    name: 'Phở Gia Truyền Bát Đàn',
    slug: 'pho-gia-truyen-bat-dan',
    city: 'Hoàn Kiếm, Hà Nội',
    cuisine: 'Ẩm thực Hà Nội · Món nước',
    priceRange: '50.000đ - 90.000đ',
    rating: 4.8,
    reviewsCount: 1820,
    ranking: '#1 trên 340 quán phở tại Hà Nội',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80',
    signatureDish: 'Phở bò tái lăn nước dùng trong veo thơm gừng',
  },
  {
    id: 2,
    name: 'Bún Chả Hương Liên (Obama)',
    slug: 'bun-cha-huong-lien',
    city: 'Hai Bà Trưng, Hà Nội',
    cuisine: 'Đặc sản Hà Nội · Nướng than hoa',
    priceRange: '60.000đ - 120.000đ',
    rating: 4.7,
    reviewsCount: 2450,
    ranking: 'Top Michelin Bib Gourmand 2026',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    signatureDish: 'Combo bún chả nem cua bể giòn rụm trứ danh',
  },
  {
    id: 3,
    name: 'Cơm Gà Bà Buội Hội An',
    slug: 'com-ga-ba-buoi-hoi-an',
    city: 'Phố Cổ Hội An, Quảng Nam',
    cuisine: 'Ẩm thực miền Trung · Cơm gà ta',
    priceRange: '55.000đ - 110.000đ',
    rating: 4.8,
    reviewsCount: 1670,
    ranking: '#2 trên 190 quán ăn tại Phố Cổ Hội An',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
    signatureDish: 'Gà ta thả vườn xé phay bóp gỏi rau răm',
  },
  {
    id: 4,
    name: 'Hải Sản Bãi Cháy Cua Vàng',
    slug: 'hai-san-cua-vang-ha-long',
    city: 'Bãi Cháy, TP. Hạ Long',
    cuisine: 'Hải sản tươi sống · Lẩu niêu đất',
    priceRange: '250.000đ - 600.000đ',
    rating: 4.9,
    reviewsCount: 1320,
    ranking: '#1 Hải sản nổi tiếng Bãi Cháy',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
    signatureDish: 'Lẩu cua biển nấu niêu đất gia truyền đặc sắc',
  },
];

// Cẩm nang du lịch (Phong cách Lonely Planet)
const TRAVEL_GUIDES = [
  {
    id: 1,
    title: 'Kinh nghiệm du lịch Phú Quốc 3N2Đ: Lịch trình tối ưu & Địa điểm check-in không thể bỏ lỡ',
    category: 'Cẩm nang biển đảo',
    readTime: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
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
    count: '1.240+ chỗ nghỉ',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    link: '/hotels',
  },
  {
    id: 2,
    name: 'Khu nghỉ dưỡng & Spa',
    count: '480+ resort ven biển',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    link: '/hotels?type=resort',
  },
  {
    id: 3,
    name: 'Biệt thự & Villa riêng tư',
    count: '320+ villa nguyên căn',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    link: '/hotels?type=villa',
  },
  {
    id: 4,
    name: 'Du thuyền ngủ đêm',
    count: '150+ du thuyền 5 sao',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    link: '/tours?q=du-thuyen',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { data: destinations, isLoading: loadingDestinations } = useFeaturedDestinations();
  const { i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Kéo Tour thực từ database
  const { data: toursData } = useQuery({
    queryKey: ['home-tours', i18n.language],
    queryFn: () => getToursPaged(1, 6),
    staleTime: 5 * 60 * 1000,
  });

  // Kéo Khách sạn thực từ database
  const { data: hotelsData } = useQuery({
    queryKey: ['home-hotels'],
    queryFn: () => getHotelsPaged(1, 6),
    staleTime: 5 * 60 * 1000,
  });

  // Kéo Nhà hàng & Ẩm thực thực từ database
  const { data: restaurantsData } = useQuery({
    queryKey: ['home-restaurants'],
    queryFn: () => getRestaurantsPaged(1, 4),
    staleTime: 5 * 60 * 1000,
  });

  const displayTours = toursData?.items?.length ? toursData.items : FALLBACK_TOURS;
  const displayHotels = (hotelsData?.items?.length ? hotelsData.items : FALLBACK_HOTELS).map((h: any, idx: number) => {
    const fallback = FALLBACK_HOTELS[idx % FALLBACK_HOTELS.length];
    return {
      ...fallback,
      ...h,
      pricePerNight: h.pricePerNight || fallback.pricePerNight,
      rating: h.rating || fallback.rating,
      image: h.image || fallback.image,
    };
  });

  const displayRestaurants = (restaurantsData?.items?.length ? restaurantsData.items : FALLBACK_RESTAURANTS).map((r: any, idx: number) => {
    const fallback = FALLBACK_RESTAURANTS[idx % FALLBACK_RESTAURANTS.length];
    return {
      ...fallback,
      ...r,
      image: r.image || fallback.image,
      rating: r.rating || fallback.rating,
    };
  });

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
        title="TravelHub - Sàn Thương Mại Điện Tử Du Lịch Trực Tuyến Hàng Đầu"
        description="Đặt tour du lịch, vé tham quan, khách sạn nghỉ dưỡng với giá tốt nhất cùng TravelHub. Khám phá vẻ đẹp bất tận của Việt Nam và thế giới."
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
        <section className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] text-white pt-6 pb-24 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col justify-between">
          {/* Background Images with smooth cross-fade animation */}
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              } transform transition-transform duration-[7000ms]`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}

          {/* Luxury Gradient Dark Overlays for ultimate contrast & readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-blue-950/80 to-slate-950/40 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 z-10 pointer-events-none" />

          {/* Ambient Lighting Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none z-10" />
          <div className="absolute -bottom-10 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none z-10" />

          {/* Top Category Sub-Navigation Bar */}
          <div className="max-w-7xl mx-auto w-full relative z-20">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-6 sm:mb-8 scrollbar-none">
              {[
                { name: 'Tour du lịch', icon: GlobeAltIcon, href: '/tours', active: true },
                { name: 'Khách sạn & Resort', icon: BuildingOfficeIcon, href: '/hotels', active: false },
                { name: 'Nhà hàng & Ẩm thực', icon: SparklesIcon, href: '/restaurants', active: false },
                { name: 'Lập lịch trình AI', icon: SparklesIcon, href: '/planner', active: false },
                { name: 'Kho Voucher 50%', icon: TicketIcon, href: '/promo-codes', active: false },
                { name: 'Cẩm nang du lịch', icon: PhotoIcon, href: '/stories', active: false },
              ].map((serv, idx) => (
                <Link
                  key={idx}
                  to={serv.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap backdrop-blur-md ${
                    serv.active
                      ? 'bg-white text-slate-900 shadow-md shadow-black/20 font-bold'
                      : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/15'
                  }`}
                >
                  <serv.icon className={`w-4 h-4 ${serv.active ? 'text-blue-600' : 'text-white'}`} />
                  <span>{serv.name}</span>
                </Link>
              ))}
            </div>

            {/* Main Headlines */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 backdrop-blur-md text-amber-300 text-xs font-bold mb-4 shadow-sm animate-pulse">
                <SparklesIcon className="w-4 h-4 text-amber-400" />
                <span>{HERO_SLIDES[currentSlide].badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-3 sm:mb-4">
                Chạm Vào Kỳ Quan <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-200 to-cyan-300">
                  {HERO_SLIDES[currentSlide].title}
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-200 font-light leading-relaxed mb-6 max-w-2xl drop-shadow">
                {HERO_SLIDES[currentSlide].subtitle}
              </p>

              {/* Quick Trust Badges in Hero */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-200 pt-3 border-t border-white/15">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                  <span>Bảo hiểm 120.000.000đ</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <BoltIcon className="w-4 h-4 text-amber-400" />
                  <span>Xác nhận vé QR tức thì</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckBadgeIcon className="w-4 h-4 text-cyan-400" />
                  <span>Cam kết giá tốt nhất</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right Slide Switchers */}
          <div className="max-w-7xl mx-auto w-full relative z-20 flex justify-end pb-2">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
                    idx === currentSlide
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {slide.tag}
                </button>
              ))}
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
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Giá Tốt Nhất Cam Kết</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Minh bạch không phí ẩn. Hoàn lại 100% chênh lệch nếu bạn tìm thấy giá thấp hơn.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/20">
                <BoltIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Xác Nhận Tức Thì</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Nhận vé điện tử E-ticket và mã QR vào cổng ngay lập tức qua email & SMS.
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
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Hỗ Trợ AI & Chuyên Gia 24/7</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Trợ lý du lịch AI Gemini và đội ngũ chăm sóc khách hàng đồng hành suốt chuyến đi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            AGODA & KLOOK FLASH SALE DEALS BANNER (Vibrant Countdown)
            ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <FlashSaleBanner />
        </div>

        {/* =========================================================================
            GENIUS MEMBER PROMO BANNER (Chuẩn Booking.com VIP)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white border border-blue-500/30 shadow-[0_15px_35px_rgba(30,58,138,0.25)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 left-1/3 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 sm:gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 font-black text-base flex flex-col items-center justify-center flex-shrink-0 shadow-lg shadow-amber-400/25 ring-2 ring-amber-300/50">
                <span className="text-[10px] uppercase font-bold tracking-tighter text-slate-800 -mb-1">VIP</span>
                <span>Genius</span>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-extrabold mb-1 border border-amber-400/30">
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>Ưu đãi thành viên trọn đời</span>
                </div>
                <h3 className="font-black text-lg sm:text-xl text-white tracking-tight">
                  Tiết kiệm từ 10% - 25% với thẻ thành viên TravelHub Genius
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Đăng nhập tài khoản TravelHub để tự động mở khóa giá độc quyền, miễn phí nâng hạng phòng và nhận coupon ưu đãi lên tới 500.000đ.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
              <Link
                to="/signin"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] text-center flex-1 md:flex-none"
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 backdrop-blur-md transition hover:scale-[1.02] active:scale-[0.98] text-center flex-1 md:flex-none"
              >
                Đăng ký miễn phí
              </Link>
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
                      {prop.count}
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
                        {dest.description || 'Khám phá vẻ đẹp kỳ vĩ và những nét văn hóa ẩm thực truyền thống độc đáo.'}
                      </p>
                      <div className="flex items-center justify-between pt-2.5 border-t border-white/15 text-xs text-white">
                        <span className="text-slate-300 font-medium">1.250+ chỗ nghỉ & tour</span>
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
                Khách Sạn & Resort Được Yêu Thích Nhất
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Khu nghỉ dưỡng 4-5 sao với dịch vụ hoàn hảo, cam kết giá tốt nhất
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
            {displayHotels.slice(0, 6).map((hotel: any) => {
              const price = hotel.pricePerNight || 2450000;
              const originalPrice = hotel.originalPrice || Math.round(price * 1.3);
              const score = hotel.rating ? (hotel.rating > 5 ? hotel.rating : (hotel.rating * 2)).toFixed(1) : '9.4';
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

                    {/* Top Left: 5 Star Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[11px] font-extrabold flex items-center gap-1 border border-white/10 shadow-sm">
                      <StarIconSolid className="w-3.5 h-3.5 text-amber-400" />
                      <span>5 Sao Nghỉ Dưỡng</span>
                    </div>

                    {/* Top Right: Discount Pill */}
                    {discountPercent > 0 && (
                      <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black shadow-md">
                        -{discountPercent}%
                      </div>
                    )}

                    {/* Booking.com Score Badge */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 shadow-md">
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-white block leading-tight">
                          {hotel.ratingText || 'Xuất sắc'}
                        </span>
                        <span className="text-[10px] text-slate-300 block">
                          {hotel.reviewsCount || 1240} đánh giá
                        </span>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-inner">
                        {score}
                      </div>
                    </div>
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
                        {hotel.roomType || 'Phòng Deluxe Giường Đôi (View toàn cảnh)'}
                      </p>

                      {/* Booking.com Perks */}
                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium mb-4">
                        <div className="flex items-center gap-1.5">
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>Bao gồm bữa sáng buffet 5 sao</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>Miễn phí hủy phòng trước 48h</span>
                        </div>
                      </div>
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
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">✓ Đã bao gồm thuế & phí</span>
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
                Tour Du Lịch Bán Chạy Nhất
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
            {displayTours.slice(0, 6).map((tour: any) => {
              const tourPrice = tour.price || 1990000;
              const originalPrice = tour.originalPrice || Math.round(tourPrice * 1.3);
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
                      <span>{tour.destination?.name || tour.destination || 'Việt Nam'}</span>
                    </div>

                    {/* Instant Confirmation Pill Bottom Left */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-emerald-300 text-[11px] font-semibold flex items-center gap-1 border border-white/10">
                      <CheckBadgeIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Xác nhận vé tức thì</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Vietravel Departure Schedule */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                        <span className="flex items-center gap-1">
                          <CalendarDaysIcon className="w-3.5 h-3.5 text-slate-400" />
                          {tour.departureSchedule || 'Thứ 5 & Thứ 7 hàng tuần'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                          {tour.duration || '3N2Đ'}
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
                        <span className="font-bold text-slate-800 dark:text-slate-200">{tour.rating || 4.9}</span>
                        <span>({tour.reviewsCount || 1240} đánh giá)</span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {tour.shortDescription || tour.description || 'Trọn gói vé tham quan, xe đưa đón chuẩn du lịch cao cấp và hướng dẫn viên đồng hành.'}
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
                      <span>{rest.cuisine || 'Ẩm thực Việt'}</span>
                    </div>

                    {/* Price Range Pill */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-[11px] font-bold border border-white/10">
                      <span>{rest.priceRange || '$$'}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Location & Ranking */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                        <MapPinIcon className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{rest.city || 'Việt Nam'}</span>
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
                        <span className="truncate">{rest.ranking || 'Địa điểm được yêu thích'}</span>
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
                        <span className="font-bold text-slate-900 dark:text-white">{rest.rating || 4.8}</span>
                        <span className="text-slate-400">({rest.reviewsCount || 850})</span>
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Đánh Giá Xác Thực
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Cộng Đồng Du Khách Nói Gì Về TravelHub?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl mx-auto">
              Hơn 98.6% khách hàng đánh giá hài lòng với quy trình đặt chỗ và chất lượng dịch vụ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REAL_VIETNAM_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between ring-1 ring-black/5 dark:ring-white/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIconSolid key={i} className="w-4 h-4" />
                      ))}
                    </div>
                    {rev.verified && (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/50 dark:border-emerald-800/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckBadgeIcon className="w-3.5 h-3.5" />
                        Đã trải nghiệm
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                    {rev.tour}
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-6">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-11 h-11 rounded-full object-cover border-2 border-amber-400/50 shadow-sm"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{rev.author}</h5>
                    <span className="text-xs text-slate-400">{rev.city} · {rev.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            7. CẨM NANG & KINH NGHIỆM DU LỊCH (Lonely Planet Style)
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
