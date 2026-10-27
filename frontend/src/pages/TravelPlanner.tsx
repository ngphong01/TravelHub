import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTours } from '../services/tour';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import SEOHead from '../components/SEOHead';
import TravelAnimatedBackground from '../components/TravelAnimatedBackground';
import {
  MapPinIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  HeartIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PrinterIcon,
  ShareIcon,
  BookmarkSquareIcon,
  BuildingOfficeIcon,
  TicketIcon,
  CakeIcon,
  ShoppingBagIcon,
  SunIcon,
  LightBulbIcon,
  TruckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { getAuthenticImage, handleImageError } from '../utils/imageFallback';

interface DayPlan {
  day: number;
  dateLabel: string;
  title: string;
  morning: { time: string; activity: string; place: string; tip?: string };
  lunch: { place: string; dish: string };
  afternoon: { time: string; activity: string; place: string; tip?: string };
  dinner: { place: string; dish: string };
  evening: { time: string; activity: string; place: string };
}

interface GeneratedPlan {
  destination: string;
  duration: number;
  departureDate: string;
  travelers: number;
  budgetLevel: string;
  estimatedCostPerPerson: number;
  totalEstimatedCost: number;
  costBreakdown: {
    hotel: number;
    food: number;
    tickets: number;
    transport: number;
  };
  highlights: string[];
  days: DayPlan[];
  packingTips: string[];
}

const PRESET_DESTINATIONS = [
  { id: 'da-nang', name: 'Đà Nẵng - Hội An', nameEn: 'Da Nang - Hoi An', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80' },
  { id: 'ha-long', name: 'Vịnh Hạ Long', nameEn: 'Ha Long Bay', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80' },
  { id: 'phu-quoc', name: 'Đảo Ngọc Phú Quốc', nameEn: 'Phu Quoc Island', image: '/images/destinations/phu-quoc.jpg' },
  { id: 'ninh-binh', name: 'Ninh Bình - Tràng An', nameEn: 'Ninh Binh - Trang An', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&q=80' },
  { id: 'da-lat', name: 'Đà Lạt Mộng Mơ', nameEn: 'Da Lat City', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
  { id: 'ha-noi', name: 'Thủ Đô Hà Nội', nameEn: 'Hanoi Capital', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80' },
  { id: 'sa-pa', name: 'Sa Pa - Fansipan', nameEn: 'Sa Pa - Fansipan', image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=600&q=80' },
  { id: 'nha-trang', name: 'Biển Nha Trang', nameEn: 'Nha Trang Beach', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80' },
];

const getToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const formatPlannerDate = (value: string, isEn = false) => {
  try {
    return new Intl.DateTimeFormat(isEn ? 'en-US' : 'vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(`${value}T00:00:00`));
  } catch {
    return value;
  }
};

const formatPlanDay = (departureDate: string, day: number, isEn = false) => {
  try {
    const date = new Date(`${departureDate}T00:00:00`);
    date.setDate(date.getDate() + day - 1);
    return new Intl.DateTimeFormat(isEn ? 'en-US' : 'vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  } catch {
    return `Ngày ${day}`;
  }
};

// Rich Destination Knowledge Base
const DESTINATION_KNOWLEDGE: Record<string, {
  baseCost: number;
  highlightsVi: string[];
  highlightsEn: string[];
  daysVi: Omit<DayPlan, 'day' | 'dateLabel'>[];
  daysEn: Omit<DayPlan, 'day' | 'dateLabel'>[];
}> = {
  'da-nang': {
    baseCost: 1450000,
    highlightsVi: [
      'Chinh phục Cầu Vàng Bà Nà Hills và ngôi làng Pháp cổ kính trên mây',
      'Thưởng thức mì Quảng ếch Bếp Trang và xem Cầu Rồng phun lửa cuối tuần',
      'Thả đèn hoa đăng lung linh trên sông Hoài và dạo phố cổ Hội An về đêm',
      'Chèo thuyền thúng rừng dừa Bảy Mẫu và thăm làng đá mỹ nghệ Non Nước',
    ],
    highlightsEn: [
      'Walk on the world-famous Golden Bridge at Ba Na Hills and European French Village',
      'Savor authentic Mi Quang noodles and witness the Dragon Bridge fire-breathing show',
      'Release floating lanterns on the Hoai River in ancient Hoi An town at night',
      'Experience traditional basket boat paddling in the Bay Mau coconut forest',
    ],
    daysVi: [
      {
        title: 'Bán Đảo Sơn Trà — Chùa Linh Ứng — Biển Mỹ Khê & Cầu Rồng Phun Lửa',
        morning: {
          time: '08:00 - 11:30',
          activity: 'Đón tại sân bay/điểm hẹn, tham quan Bán đảo Sơn Trà, viếng Đại tượng Phật Bà tại Chùa Linh Ứng ngắm trọn vịnh Đà Nẵng',
          place: 'Bán đảo Sơn Trà & Chùa Linh Ứng',
          tip: 'Đến trước 9h để ngắm đàn voọc chà vá chân nâu quý hiếm và chụp ảnh biển trong vắt',
        },
        lunch: {
          place: 'Nhà hàng Mì Quảng Bếp Trang',
          dish: 'Mì Quảng ếch niêu đất ăn kèm bánh tráng mè nướng giòn rụm',
        },
        afternoon: {
          time: '14:30 - 17:30',
          activity: 'Tắm biển Mỹ Khê — bãi biển quyến rũ nhất hành tinh, check-in Công viên Biển Đông',
          place: 'Bãi biển Mỹ Khê & Cầu Tình Yêu',
          tip: 'Bãi tắm số 1 và số 2 sóng êm và dịch vụ thể thao biển ca nô, dù lượn phong phú',
        },
        dinner: {
          place: 'Hải sản Bé Mặn ven biển Sơn Trà',
          dish: 'Cua rang me, tôm hùm nướng phô mai và lẩu hải sản chua cay',
        },
        evening: {
          time: '19:30 - 22:00',
          activity: 'Dạo chợ đêm Helio, thưởng thức ẩm thực đường phố và ngắm Cầu Rồng phun lửa, phun nước lúc 21:00',
          place: 'Cầu Rồng & Chợ Đêm Helio',
        },
      },
      {
        title: 'Trọn Ngày Khám Phá Bà Nà Hills — Cầu Vàng — Đêm Phố Cổ Hội An',
        morning: {
          time: '07:30 - 11:30',
          activity: 'Đi cáp treo đạt kỷ lục thế giới lên đỉnh Bà Nà, check-in Cầu Vàng đôi bàn tay khổng lồ, thăm Vườn hoa Le Jardin',
          place: 'Sun World Ba Na Hills & Cầu Vàng',
          tip: 'Nên lên cáp treo sớm chuyến 7h30 sáng để đón ánh bình minh vắt ngang Cầu Vàng không bị đông',
        },
        lunch: {
          place: 'Nhà hàng buffet Beer Plaza Bà Nà',
          dish: 'Thưởng thức đại tiệc buffet hơn 100 món Á — Âu và bia tươi Đức thủ công',
        },
        afternoon: {
          time: '14:30 - 17:30',
          activity: 'Khám phá Làng Pháp cổ kính, vui chơi tại Fantasy Park rồi khởi hành vào Phố Cổ Hội An',
          place: 'Làng Pháp & Phố Cổ Hội An',
          tip: 'Nên thuê áo dài cổ phục truyền thống để chụp ảnh check-in các góc tường vàng hoa giấy Hội An',
        },
        dinner: {
          place: 'Nhà hàng Bông Hồng Trắng Phố Cổ',
          dish: 'Cao lầu Hội An gia truyền, bánh bao bánh vạc và bánh mì Phượng lừng danh',
        },
        evening: {
          time: '19:00 - 21:30',
          activity: 'Ngồi thuyền gỗ thả hoa đăng cầu may trên dòng sông Hoài, dạo chợ đêm phố đèn lồng lung linh',
          place: 'Sông Hoài & Chùa Cầu Hội An',
        },
      },
      {
        title: 'Rừng Dừa Bảy Mẫu Thuyền Thúng — Ngũ Hành Sơn — Mua Quà Chợ Hàn',
        morning: {
          time: '08:00 - 11:00',
          activity: 'Trải nghiệm ngồi thuyền thúng len lỏi rừng dừa Bảy Mẫu, xem màn múa thúng xoay tròn điêu luyện của ngư dân',
          place: 'Rừng dừa Bảy Mẫu Cẩm Thanh',
          tip: 'Chuẩn bị tiền tip nhỏ 20k - 50k động viên các chú lái thúng biểu diễn múa thúng cảm giác mạnh',
        },
        lunch: {
          place: 'Bánh tráng cuốn thịt heo Trần',
          dish: 'Bánh tráng cuốn thịt heo hai đầu da chấm mắm nêm đậm đà',
        },
        afternoon: {
          time: '13:30 - 16:30',
          activity: 'Chinh phục danh thắng Ngũ Hành Sơn, viếng Động Huyền Không kỳ bí và mua đặc sản chả bò, mực rim tại Chợ Hàn',
          place: 'Ngũ Hành Sơn & Chợ Hàn',
          tip: 'Chả bò Chợ Hàn nên chọn mua loại đóng gói hút chân không có tem kiểm định để mang lên máy bay',
        },
        dinner: {
          place: 'Khu ẩm thực Chợ Đêm Sơn Trà',
          dish: 'Bánh xèo nem lụi Bà Dưỡng và chè sầu Liên trứ danh',
        },
        evening: {
          time: '19:00 - 21:00',
          activity: 'Du thuyền sông Hàn ngắm toàn cảnh các cây cầu ánh sáng rực rỡ và chia tay Đà Nẵng',
          place: 'Bến du thuyền Sông Hàn',
        },
      },
    ],
    daysEn: [
      {
        title: 'Son Tra Peninsula — Linh Ung Pagoda — My Khe Beach & Dragon Bridge',
        morning: {
          time: '08:00 - 11:30',
          activity: 'Airport pickup, drive along the coast to Son Tra Peninsula, visit Lady Buddha at Linh Ung Pagoda overlooking the bay',
          place: 'Son Tra Peninsula & Linh Ung Pagoda',
          tip: 'Arrive before 9 AM to spot endangered red-shanked douc langurs and catch the crystal-clear ocean views',
        },
        lunch: {
          place: 'Bep Trang Restaurant',
          dish: 'Authentic claypot frog Mi Quang noodles served with crispy sesame rice crackers',
        },
        afternoon: {
          time: '14:30 - 17:30',
          activity: 'Swim at My Khe Beach — voted one of the most stunning beaches on Earth, stroll along the promenade',
          place: 'My Khe Beach & Love Bridge',
          tip: 'Sections 1 & 2 have gentle waves and thrilling watersports like parasailing and jet-skiing',
        },
        dinner: {
          place: 'Be Man Seafood on the Coast',
          dish: 'Tamarind-glazed crab, grilled cheese lobster, and spicy seafood hotpot',
        },
        evening: {
          time: '19:30 - 22:00',
          activity: 'Explore Helio Night Market for street eats, then watch Dragon Bridge breathe fire and water at 9 PM',
          place: 'Dragon Bridge & Helio Market',
        },
      },
      {
        title: 'Full Day Ba Na Hills & Golden Bridge — Enchanting Night in Hoi An',
        morning: {
          time: '07:30 - 11:30',
          activity: 'Take the Guinness World Record cable car to Ba Na Hills, walk on the colossal Golden Bridge, explore French gardens',
          place: 'Sun World Ba Na Hills & Golden Bridge',
          tip: 'Catch the 7:30 AM cable car to enjoy morning golden light over the giant stone hands before the crowds arrive',
        },
        lunch: {
          place: 'Beer Plaza Ba Na Hills Buffet',
          dish: 'Grand international buffet featuring over 100 Asian-European delicacies and craft beer',
        },
        afternoon: {
          time: '14:30 - 17:30',
          activity: 'Roam through European medieval French Village, take in Fantasy Park attractions, then transfer to Hoi An Ancient Town',
          place: 'French Village & Hoi An Old Town',
          tip: 'Rent traditional Vietnamese Ao Dai for postcard-perfect photography along bougainvillea-lined yellow alleys',
        },
        dinner: {
          place: 'White Rose Ancient Restaurant',
          dish: 'Signature Hoi An Cao Lau noodles, steamed white rose dumplings, and world-famous Banh Mi Phuong',
        },
        evening: {
          time: '19:00 - 21:30',
          activity: 'Board a wooden boat to release lucky floating candles on Hoai River, explore the lantern-lit night market',
          place: 'Hoai River & Japanese Covered Bridge',
        },
      },
      {
        title: 'Bay Mau Coconut Basket Boat — Marble Mountains — Han Market',
        morning: {
          time: '08:00 - 11:00',
          activity: 'Ride iconic round bamboo basket boats through Bay Mau coconut palm waterways, watch fisherman spinning performances',
          place: 'Bay Mau Coconut Forest',
          tip: 'Prepare a small tip of 20k-50k VND to encourage the boatmen to perform their thrilling spinning maneuvers',
        },
        lunch: {
          place: 'Tran Restaurant Specialty',
          dish: 'Steamed pork wrapped in delicate rice paper with authentic fermented dipping sauce',
        },
        afternoon: {
          time: '13:30 - 16:30',
          activity: 'Climb Marble Mountains to discover hidden mystical Huyen Khong Cave, shop for local specialties at Han Market',
          place: 'Marble Mountains & Han Market',
          tip: 'Choose vacuum-sealed beef sausages and dried calamari at Han Market with quality inspection seals for flights',
        },
        dinner: {
          place: 'Son Tra Night Market Hub',
          dish: 'Sizzling Banh Xeo pancakes and famous Lien Durian sweet soup',
        },
        evening: {
          time: '19:00 - 21:00',
          activity: 'Board a Han River cruise to admire illuminated architectural bridges and bid farewell to Da Nang',
          place: 'Han River Cruise Pier',
        },
      },
    ],
  },
  'ha-long': {
    baseCost: 1680000,
    highlightsVi: [
      'Nghỉ dưỡng trên du thuyền 5 sao vịnh biển ngắm hàng nghìn đảo đá vôi kỳ vĩ',
      'Chèo kayak khám phá Hang Luồn và leo đỉnh núi ngắm toàn cảnh Đảo Ti Tốp',
      'Thưởng thức đại tiệc buffet hải sản vịnh biển và câu mực đêm cùng thủy thủ đoàn',
      'Tham quan Hang Sửng Sốt và trải nghiệm Cáp treo Nữ Hoàng vượt biển Bãi Cháy',
    ],
    highlightsEn: [
      'Cruise on a 5-star luxury vessel among thousands of emerald limestone karsts',
      'Kayak through Luon Cave and climb to the panoramic peak of Ti Top Island',
      'Indulge in fresh bay seafood feasts and try night squid fishing with crew members',
      'Explore magnificent Sung Sot Cave and ride the Queen Cable Car across the strait',
    ],
    daysVi: [
      {
        title: 'Check-in Du Thuyền 5 Sao — Chèo Kayak Hang Luồn & Hoàng Hôn Ti Tốp',
        morning: {
          time: '08:30 - 11:30',
          activity: 'Đón tại Hà Nội hoặc Cảng Tuần Châu, làm thủ tục check-in nhận phòng Suite view trọn vịnh với welcome drink',
          place: 'Cảng tàu Quốc tế Tuần Châu',
          tip: 'Mang theo CCCD/Hộ chiếu gốc để làm thủ tục xuất bến cảng nhanh chóng',
        },
        lunch: {
          place: 'Nhà hàng du thuyền 5 sao Heritage',
          dish: 'Buffet hải sản tươi sống: tôm sú hấp nước dừa, mực nhảy xào cần tỏi, hàu nướng mỡ hành',
        },
        afternoon: {
          time: '14:30 - 17:30',
          activity: 'Chèo thuyền Kayak xuyên vòm đá Hang Luồn, tắm biển bãi cát trắng và leo 400 bậc đá ngắm hoàng hôn Đảo Ti Tốp',
          place: 'Hang Luồn & Đảo Ti Tốp',
          tip: 'Đem theo túi chống nước điện thoại khi chèo kayak để lưu giữ những góc ảnh phản chiếu mây trời tuyệt đẹp',
        },
        dinner: {
          place: 'Sundeck du thuyền lộng gió biển',
          dish: 'Tiệc nướng BBQ hoàng hôn Sunset Party và tiệc tối Fine Dining chuẩn đầu bếp 5 sao',
        },
        evening: {
          time: '20:00 - 22:30',
          activity: 'Tham gia câu mực đêm cùng thủy thủ đoàn trên mạn tàu, thưởng thức cocktail tại Sky Bar du thuyền',
          place: 'Vịnh Lan Hạ / Vịnh Hạ Long',
        },
      },
      {
        title: 'Khám Phá Hang Sửng Sốt — Làng Chài Ba Hang — Sun World Bãi Cháy',
        morning: {
          time: '06:30 - 11:00',
          activity: 'Tập Thái Cực Quyền đón bình minh trên sundeck, khám phá Hang Sửng Sốt — hang động rộng lớn và lộng lẫy bậc nhất kỳ quan',
          place: 'Hang Sửng Sốt & Vịnh Hạ Long',
          tip: 'Động có hệ thống nhũ đá ngàn năm tuyệt đẹp, mang giày bệt chống trơn trượt khi đi trong hang',
        },
        lunch: {
          place: 'Nhà hàng Cua Vàng Bãi Cháy',
          dish: 'Lẩu cua vàng trứ danh nấu trong niêu đất và chả mực giã tay nóng hổi',
        },
        afternoon: {
          time: '14:00 - 17:30',
          activity: 'Trải nghiệm Cáp treo Nữ Hoàng đạt 2 kỷ lục thế giới, Vòng quay Mặt Trời Sun Wheel ngắm toàn cảnh cầu Bãi Cháy',
          place: 'Tổ hợp giải trí Sun World Hạ Long',
          tip: 'Vé cáp treo đã bao gồm khu vườn Nhật Bản Zen Garden và bảo tàng tượng sáp kỳ thú',
        },
        dinner: {
          place: 'Nhà hàng Ẩm thực Làng Chài Tuần Châu',
          dish: 'Cá song hấp xì dầu, tu hài nướng mỡ hành và xôi chả mực',
        },
        evening: {
          time: '19:30 - 22:00',
          activity: 'Dạo phố cổ Bãi Cháy rực rỡ ánh đèn, thưởng thức sữa chua trân châu Hạ Long chính gốc',
          place: 'Phố cổ Bãi Cháy & Chợ Đêm',
        },
      },
      {
        title: 'Bảo Tàng Than Đá Quảng Ninh — Đường Bao Biển — Mua Đặc Sản Chả Mực',
        morning: {
          time: '08:00 - 11:00',
          activity: 'Check-in Bảo tàng Quảng Ninh — công trình kiến trúc kính đen biểu tượng khối than đá độc bản, ngắm vịnh từ đường bao biển',
          place: 'Bảo tàng Quảng Ninh & Trần Quốc Nghiễn',
          tip: 'Mặt kính đen ngoài bảo tàng là góc check-in thời thượng thu hút hàng nghìn bức ảnh sống ảo',
        },
        lunch: {
          place: 'Nhà hàng Phương Nam Hạ Long',
          dish: 'Bún bề bề nóng hổi ngọt nước, sá sùng xào tỏi và nem cua bể giòn tan',
        },
        afternoon: {
          time: '13:30 - 16:30',
          activity: 'Mua sắm chả mực giã tay Thoan tại Chợ Hạ Long 1, ghé thăm Thư viện tỉnh và lên xe trở về Hà Nội',
          place: 'Chợ Hạ Long 1',
          tip: 'Nên mua chả mực loại hút chân không có cấp đông đá khô để giữ trọn vẹn hương vị khi mang về nhà',
        },
        dinner: {
          place: 'Điểm dừng chân cao tốc Hải Phòng',
          dish: 'Bánh mì cay Hải Phòng và trà hoa cúc truyền thống',
        },
        evening: {
          time: '19:00 - 20:30',
          activity: 'Xe Limousine trả khách an toàn tại điểm hẹn trung tâm Hà Nội, kết thúc chuyến đi tuyệt vời',
          place: 'Điểm hẹn trung tâm Hà Nội',
        },
      },
    ],
    daysEn: [
      {
        title: 'Check-in 5-Star Cruise — Kayak Luon Cave & Ti Top Sunset Hike',
        morning: {
          time: '08:30 - 11:30',
          activity: 'Transfer to Tuan Chau International Marina, embark luxury cruise with refreshing welcome drink and suite check-in',
          place: 'Tuan Chau International Marina',
          tip: 'Bring original Passport/ID card for smooth maritime port security clearance',
        },
        lunch: {
          place: 'Heritage Luxury Cruise Dining Room',
          dish: 'Fresh bay seafood feast: coconut-steamed tiger prawns, squid with fragrant celery, grilled oysters with scallion oil',
        },
        afternoon: {
          time: '14:30 - 17:30',
          activity: 'Kayak through water arches of Luon Cave, swim in turquoise waters, and hike 400 stone steps atop Ti Top Island',
          place: 'Luon Cave & Ti Top Island',
          tip: 'Bring waterproof phone pouches while kayaking to capture reflections of towering limestone pillars',
        },
        dinner: {
          place: 'Cruise Sundeck under the Stars',
          dish: 'Sunset Party BBQ feast and fine-dining gourmet multi-course culinary dinner',
        },
        evening: {
          time: '20:00 - 22:30',
          activity: 'Join night squid fishing with crew hands on the deck, enjoy signature cocktails at the panoramic sky lounge',
          place: 'Lan Ha & Ha Long Bay Waters',
        },
      },
      {
        title: 'Explore Sung Sot Cave — Ba Hang Village — Sun World Complex',
        morning: {
          time: '06:30 - 11:00',
          activity: 'Morning Tai Chi class on the sundeck at dawn, then explore magnificent Sung Sot (Surprise) Cave stalactite chambers',
          place: 'Sung Sot Cave & Ha Long Bay',
          tip: 'The cave features thousands of years of nature carvings; wear comfortable flat walking shoes',
        },
        lunch: {
          place: 'Cua Vang Bai Chay Restaurant',
          dish: 'Legendary claypot golden crab hotpot and crispy hand-pounded squid patties',
        },
        afternoon: {
          time: '14:00 - 17:30',
          activity: 'Ride the double-decker Queen Cable Car across the bay, take the Sun Wheel for bird-eye views of Bai Chay Bridge',
          place: 'Sun World Ha Long Complex',
          tip: 'Cable car ticket includes access to the authentic Japanese Zen Garden and Wax Museum',
        },
        dinner: {
          place: 'Tuan Chau Fisherman Wharf Dining',
          dish: 'Steamed grouper with ginger and soy, grilled sweet geoduck clams, and fragrant squid cake sticky rice',
        },
        evening: {
          time: '19:30 - 22:00',
          activity: 'Stroll along bustling Bai Chay Old Quarter promenade and treat yourself to authentic Ha Long tapioca pearl yogurt',
          place: 'Bai Chay Walking Street & Night Market',
        },
      },
      {
        title: 'Quang Ninh Black Glass Museum — Coastal Drive — Squid Cakes Gift',
        morning: {
          time: '08:00 - 11:00',
          activity: 'Visit the architectural masterpiece Quang Ninh Museum resembling black coal crystals, take scenic coastal photos',
          place: 'Quang Ninh Museum & Coastal Boulevard',
          tip: 'The giant obsidian glass exterior provides stunning minimalist architectural photo opportunities',
        },
        lunch: {
          place: 'Phuong Nam Bayview Restaurant',
          dish: 'Piping hot mantis shrimp noodle broth, garlic-sautéed peanut worms, and golden fried crab spring rolls',
        },
        afternoon: {
          time: '13:30 - 16:30',
          activity: 'Shop for authentic Thoan hand-pounded squid cakes at Ha Long Market 1, visit provincial library, board return express',
          place: 'Ha Long Market 1',
          tip: 'Ask for dry-ice vacuum packaging to keep squid patties fresh and frozen all the way home',
        },
        dinner: {
          place: 'Highway Express Rest Stop',
          dish: 'Spicy Hai Phong mini baguettes and refreshing herbal chrysanthemum tea',
        },
        evening: {
          time: '19:00 - 20:30',
          activity: 'Limousine drops you off safely at your Hanoi hotel, concluding an unforgettable world heritage journey',
          place: 'Central Hanoi Drop-off',
        },
      },
    ],
  },
};

export default function TravelPlanner() {
  const { addItem } = useCart();
  const { language } = useLanguage();
  const location = useLocation();

  // Robust bilingual detection
  const isEn = language === 'en' || location.pathname.startsWith('/en/');

  const [selectedDest, setSelectedDest] = useState(PRESET_DESTINATIONS[0].name);
  const [customDest, setCustomDest] = useState('');
  const [duration, setDuration] = useState(3);
  const [departureDate, setDepartureDate] = useState(getToday);
  const [budget, setBudget] = useState<'budget' | 'standard' | 'luxury'>('standard');
  const [travelerCount, setTravelerCount] = useState(2);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([
    isEn ? 'Beach & Resort' : 'Biển & Nghỉ dưỡng',
    isEn ? 'Local Culinary' : 'Ẩm thực',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);

  // Fetch real tours for recommendation
  const { data: toursData } = useQuery({
    queryKey: ['tours', 'featured-planner'],
    queryFn: () => getTours(),
  });

  const travelStylesVi = [
    'Biển & Nghỉ dưỡng',
    'Ẩm thực địa phương',
    'Di sản văn hóa',
    'Khám phá mạo hiểm',
    'Check-in sống ảo',
    'Thiên nhiên sinh thái',
  ];

  const travelStylesEn = [
    'Beach & Resort',
    'Local Culinary',
    'Cultural Heritage',
    'Adventure & Trekking',
    'Photography & Sightseeing',
    'Eco & Nature',
  ];

  const travelStyles = isEn ? travelStylesEn : travelStylesVi;

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleGenerate = () => {
    const destName = customDest.trim() || selectedDest;
    if (!destName) {
      toast.error(isEn ? 'Please choose or type a destination.' : 'Vui lòng chọn hoặc nhập điểm đến.');
      return;
    }

    // P1 Validation: Prevent past departure dates
    const todayStr = getToday();
    if (departureDate < todayStr) {
      toast.error(
        isEn
          ? 'Departure date cannot be in the past! Please select today or a future date.'
          : 'Ngày khởi hành không thể ở trong quá khứ! Vui lòng chọn ngày từ hôm nay trở đi.'
      );
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      // Find destination key
      const lowerName = destName.toLowerCase();
      let key = 'da-nang';
      if (lowerName.includes('hạ long') || lowerName.includes('ha long') || lowerName.includes('halong')) {
        key = 'ha-long';
      } else if (lowerName.includes('đà nẵng') || lowerName.includes('hội an') || lowerName.includes('da nang')) {
        key = 'da-nang';
      }

      const destKnowledge = DESTINATION_KNOWLEDGE[key] || DESTINATION_KNOWLEDGE['da-nang'];

      // Distinct Budget Multipliers by destination & style
      let baseRate = destKnowledge.baseCost;
      if (budget === 'budget') baseRate = Math.round(baseRate * 0.72);
      if (budget === 'luxury') baseRate = Math.round(baseRate * 1.95);

      const estimatedCostPerPerson = baseRate * duration;
      const totalCost = estimatedCostPerPerson * travelerCount;

      // P1 Fix: For 1-Day Trip, Hotel cost is STRICTLY 0 VNĐ!
      const isOneDay = duration === 1;
      const costBreakdown = isOneDay
        ? {
            hotel: 0, // Zero accommodation fee for day-trips
            food: Math.round(totalCost * 0.45),
            tickets: Math.round(totalCost * 0.35),
            transport: Math.round(totalCost * 0.20),
          }
        : {
            hotel: Math.round(totalCost * 0.38),
            food: Math.round(totalCost * 0.32),
            tickets: Math.round(totalCost * 0.18),
            transport: Math.round(totalCost * 0.12),
          };

      // Construct Days
      const rawDays = isEn ? destKnowledge.daysEn : destKnowledge.daysVi;
      const days: DayPlan[] = [];

      for (let i = 1; i <= duration; i++) {
        const templateIndex = (i - 1) % rawDays.length;
        const template = rawDays[templateIndex];

        let dayTitle = template.title;
        let morning = { ...template.morning };
        let afternoon = { ...template.afternoon };
        let lunch = { ...template.lunch };
        let dinner = { ...template.dinner };
        let evening = { ...template.evening };

        // P1 Fix: One day trip must not have check-in or hotel actions!
        if (isOneDay) {
          dayTitle = isEn
            ? `Day Trip Discovery: ${destName} Highlights`
            : `Hành Trình Khám Phá Trọn Ngày Tại ${destName}`;
          morning.activity = isEn
            ? `Pickup at designated point, transfer directly to ${destName} and commence morning sightseeing`
            : `Xe đón tại điểm hẹn trung tâm, khởi hành đi ${destName} và bắt đầu hành trình tham quan trải nghiệm trong ngày`;
          morning.place = template.morning.place;
          evening.activity = isEn
            ? `Dinner with local specialties, shopping for gifts, and safe transfer back to departure point`
            : `Thưởng thức bữa tối ẩm thực đặc sản, tự do mua quà lưu niệm và lên xe trở về lại điểm hẹn ban đầu an toàn`;
        } else if (i === 1) {
          // Normal Multi-day day 1
          morning.activity = isEn
            ? `Depart and transfer to ${destName}, hotel check-in / cruise boarding and initial leisure`
            : `Khởi hành đến ${destName}, làm thủ tục nhận phòng/lên du thuyền và nghỉ ngơi nhẹ chuẩn bị hành trình`;
        } else if (i === duration) {
          // Last day
          dayTitle = isEn
            ? `Cultural Farewell & Local Gift Shopping in ${destName}`
            : `Mua Sắm Đặc Sản Làm Quà & Tạm Biệt ${destName}`;
        }

        days.push({
          day: i,
          dateLabel: formatPlanDay(departureDate, i, isEn),
          title: dayTitle,
          morning,
          lunch,
          afternoon,
          dinner,
          evening,
        });
      }

      setGeneratedPlan({
        destination: destName,
        duration,
        departureDate,
        travelers: travelerCount,
        budgetLevel:
          budget === 'budget'
            ? isEn ? 'Budget Saver' : 'Tiết kiệm'
            : budget === 'luxury'
            ? isEn ? 'Luxury VIP' : 'Cao cấp'
            : isEn ? 'Standard' : 'Tiêu chuẩn',
        estimatedCostPerPerson,
        totalEstimatedCost: totalCost,
        costBreakdown,
        highlights: isEn ? destKnowledge.highlightsEn : destKnowledge.highlightsVi,
        days,
        packingTips: isEn
          ? [
              'Original Passport / National ID card required for hotel & flight boarding',
              'Comfortable walking shoes, sunglasses, SPF50+ sunscreen, and wide-brim hat',
              'Personal medicine pouch: motion sickness pills, digestive relief, mosquito spray',
              'Small cash banknotes (50k, 100k VND) for night markets and local street vendors',
            ]
          : [
              'CCCD / Hộ chiếu bản gốc còn hạn để check-in khách sạn, du thuyền và máy bay',
              'Trang phục thoáng mát kèm giày đi bộ êm ái, kem chống nắng và kính râm',
              'Túi thuốc cá nhân: thuốc say sóng/xe, thuốc tiêu hóa và xịt chống muỗi',
              'Tiền mặt lẻ (50k, 100k) để gửi xe và thưởng thức quà vặt chợ đêm',
            ],
      });

      setIsGenerating(false);
      toast.success(
        isEn
          ? 'Smart travel itinerary generated successfully!'
          : 'Đã tạo lịch trình du lịch thông minh thành công!'
      );
    }, 900);
  };

  const handleCopyItinerary = () => {
    if (!generatedPlan) return;
    const text = isEn
      ? `TRAVEL ITINERARY: ${generatedPlan.destination.toUpperCase()} (${generatedPlan.duration} DAYS)\n` +
        `Departure: ${formatPlannerDate(generatedPlan.departureDate, true)} | Travelers: ${generatedPlan.travelers}\n` +
        `Estimated Budget: ${generatedPlan.estimatedCostPerPerson.toLocaleString('vi-VN')} VND/person (${generatedPlan.totalEstimatedCost.toLocaleString('vi-VN')} VND total)\n\n` +
        generatedPlan.days
          .map(
            (d) =>
              `--- DAY ${d.day} (${d.dateLabel}): ${d.title} ---\n` +
              `• Morning (${d.morning.time}): ${d.morning.activity} (${d.morning.place})\n` +
              `• Lunch: ${d.lunch.dish} at ${d.lunch.place}\n` +
              `• Afternoon (${d.afternoon.time}): ${d.afternoon.activity} (${d.afternoon.place})\n` +
              `• Dinner: ${d.dinner.dish} | ${d.evening.activity}\n`
          )
          .join('\n') +
        `\nPlanned via TravelHub Smart Trip Planner.`
      : `LỊCH TRÌNH DU LỊCH ${generatedPlan.destination.toUpperCase()} (${generatedPlan.duration} NGÀY)\n` +
        `Khởi hành: ${formatPlannerDate(generatedPlan.departureDate)} | Số khách: ${generatedPlan.travelers}\n` +
        `Ngân sách dự kiến: ${generatedPlan.estimatedCostPerPerson.toLocaleString('vi-VN')} VNĐ/người (${generatedPlan.totalEstimatedCost.toLocaleString('vi-VN')} VNĐ cho cả nhóm)\n\n` +
        generatedPlan.days
          .map(
            (d) =>
              `--- NGÀY ${d.day} (${d.dateLabel}): ${d.title} ---\n` +
              `• Sáng (${d.morning.time}): ${d.morning.activity} (${d.morning.place})\n` +
              `• Trưa: ${d.lunch.dish} tại ${d.lunch.place}\n` +
              `• Chiều (${d.afternoon.time}): ${d.afternoon.activity} (${d.afternoon.place})\n` +
              `• Tối: ${d.dinner.dish} | ${d.evening.activity}\n`
          )
          .join('\n') +
        `\nLên kế hoạch bởi TravelHub Trip Planner & Cost Estimator.`;

    navigator.clipboard.writeText(text);
    toast.success(isEn ? 'Itinerary copied to clipboard!' : 'Đã sao chép lịch trình vào Clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 md:py-12 relative overflow-hidden transition-colors duration-300">
      <SEOHead
        title={isEn ? 'Smart Travel Planner & Cost Estimator - TravelHub' : 'Lập Kế Hoạch & Dự Toán Chi Phí Du Lịch - TravelHub'}
        description={
          isEn
            ? 'Generate intelligent day-by-day travel itineraries and realistic budget estimates across Vietnam.'
            : 'Công cụ thông minh lập lộ trình chi tiết từng ngày, dự toán chi phí trọn gói khách sạn, ăn uống, vé tham quan và đề xuất tour du lịch phù hợp.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 p-8 md:p-12 text-center text-white shadow-2xl border border-indigo-800/40">
          <TravelAnimatedBackground className="z-0 opacity-40" intensity="vibrant" showDrifters={true} />
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-cyan-300 text-xs md:text-sm font-semibold border border-white/15 shadow-sm">
              <CalendarDaysIcon className="w-4 h-4 text-cyan-400" />
              <span>{isEn ? 'Smart AI Travel Itinerary & Budget Generator' : 'Công Cụ Gợi Ý Lịch Trình & Chi Phí Thông Minh'}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-cyan-200 to-indigo-200 bg-clip-text text-transparent tracking-tight">
              {isEn ? 'Plan Your Trip & Estimate Budget' : 'Lập Kế Hoạch & Dự Toán Chi Phí Du Lịch'}
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {isEn
                ? 'Generate tailored day-by-day itineraries with authentic landmarks, local specialties, zero hidden fees, and curated tour packages.'
                : 'Hệ thống tự động tính toán lộ trình chi tiết từng ngày, dự toán ngân sách trọn gói (khách sạn, ẩm thực, vé vui chơi) và gợi ý các tour tối ưu nhất cho bạn.'}
            </p>
          </div>
        </div>

        {/* Input Form Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-10 border border-slate-200/80 dark:border-slate-800 space-y-8 transition-colors">
          {/* Step 1: Destination */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <MapPinIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              <span>{isEn ? '1. Select Your Destination:' : '1. Chọn điểm đến bạn muốn khám phá:'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_DESTINATIONS.map((dest) => {
                const isSelected = selectedDest === dest.name && !customDest;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => {
                      setSelectedDest(dest.name);
                      setCustomDest('');
                    }}
                    className={`relative rounded-2xl overflow-hidden p-3 text-left transition-all duration-200 border-2 ${
                      isSelected
                        ? 'border-cyan-500 shadow-lg shadow-cyan-500/20 bg-cyan-50/50 dark:bg-cyan-950/40'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {isEn ? dest.nameEn : dest.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Duration, Date & Travelers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Duration */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{isEn ? 'Trip Duration (Days):' : 'Thời lượng chuyến đi:'}</span>
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500/20 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value={1}>{isEn ? '1 Day (Day Trip — No Hotel)' : '1 Ngày (Đi về trong ngày — 0đ khách sạn)'}</option>
                <option value={2}>{isEn ? '2 Days 1 Night' : '2 Ngày 1 Đêm'}</option>
                <option value={3}>{isEn ? '3 Days 2 Nights (Popular)' : '3 Ngày 2 Đêm (Khuyên dùng)'}</option>
                <option value={4}>{isEn ? '4 Days 3 Nights' : '4 Ngày 3 Đêm'}</option>
                <option value={5}>{isEn ? '5 Days 4 Nights' : '5 Ngày 4 Đêm'}</option>
              </select>
            </div>

            {/* Departure Date with min=today */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <CalendarDaysIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{isEn ? 'Departure Date:' : 'Ngày khởi hành:'}</span>
              </label>
              <input
                type="date"
                min={getToday()}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500/20 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              />
            </div>

            {/* Travelers Count */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <UserGroupIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{isEn ? 'Number of Travelers:' : 'Số lượng khách:'}</span>
              </label>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
                  className="w-10 h-10 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-sm text-slate-900 dark:text-white">
                  {travelerCount} {isEn ? 'Guest(s)' : 'khách'}
                </span>
                <button
                  type="button"
                  onClick={() => setTravelerCount(travelerCount + 1)}
                  className="w-10 h-10 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Budget Tier */}
          <div className="space-y-3 pt-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CurrencyDollarIcon className="w-5 h-5 text-emerald-500" />
              <span>{isEn ? 'Budget Preference:' : 'Mức ngân sách mong muốn:'}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'budget', labelVi: 'Tiết Kiệm (Homestay / Khách sạn 2-3 sao)', labelEn: 'Budget Saver (2-3 Star / Homestay)' },
                { id: 'standard', labelVi: 'Tiêu Chuẩn (Khách sạn 3-4 sao, ẩm thực đặc sản)', labelEn: 'Standard (3-4 Star, Authentic Dining)' },
                { id: 'luxury', labelVi: 'Cao Cấp (Resort 5 sao / Du thuyền VIP Heritage)', labelEn: 'Luxury VIP (5-Star Resort / Cruise)' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBudget(b.id as any)}
                  className={`p-3.5 rounded-2xl text-left border-2 text-xs sm:text-sm font-bold transition-all ${
                    budget === b.id
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {isEn ? b.labelEn : b.labelVi}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 text-center">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold text-base shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 inline-flex items-center justify-center gap-2.5"
            >
              <SparklesIcon className="w-5 h-5 text-cyan-300" />
              <span>
                {isGenerating
                  ? isEn
                    ? 'Synthesizing Itinerary & Calculating Budget...'
                    : 'Đang tổng hợp lộ trình & tính toán chi phí...'
                  : isEn
                  ? 'Generate Smart Itinerary Now'
                  : 'Tạo Lịch Trình Du Lịch Thông Minh Ngay'}
              </span>
            </button>
          </div>
        </div>

        {/* Results View */}
        {generatedPlan && (
          <div className="space-y-8 animate-fadeIn">
            {/* Summary Overview Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                    {isEn ? 'Smart Estimate Generated' : 'Đã Lập Lịch Trình Thành Công'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                    {generatedPlan.destination} — {generatedPlan.duration} {isEn ? 'Day(s)' : 'Ngày'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {isEn ? 'Depart:' : 'Khởi hành:'} <strong>{formatPlannerDate(generatedPlan.departureDate, isEn)}</strong> • {isEn ? 'Travelers:' : 'Số khách:'} <strong>{generatedPlan.travelers}</strong> • {isEn ? 'Tier:' : 'Hạng:'} <strong>{generatedPlan.budgetLevel}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {isEn ? 'Total Group Estimate' : 'Tổng dự toán cả nhóm'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {generatedPlan.totalEstimatedCost.toLocaleString('vi-VN')} VNĐ
                  </div>
                  <div className="text-xs text-slate-400">
                    (~{generatedPlan.estimatedCostPerPerson.toLocaleString('vi-VN')} VNĐ/{isEn ? 'guest' : 'người'})
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700">
                  <div className="text-xs text-slate-500 dark:text-slate-400">{isEn ? '🏨 Accommodation' : '🏨 Lưu trú khách sạn'}</div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {generatedPlan.costBreakdown.hotel === 0
                      ? isEn ? '0 VND (Day Trip)' : '0 đ (Đi về trong ngày)'
                      : `${generatedPlan.costBreakdown.hotel.toLocaleString('vi-VN')} đ`}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-100 dark:border-slate-700">
                  <div className="text-xs text-slate-500 dark:text-slate-400">{isEn ? '🍽️ Dining & Culinary' : '🍽️ Ăn uống đặc sản'}</div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {generatedPlan.costBreakdown.food.toLocaleString('vi-VN')} đ
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700">
                  <div className="text-xs text-slate-500 dark:text-slate-400">{isEn ? '🎟️ Sightseeing Tickets' : '🎟️ Vé tham quan & vui chơi'}</div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {generatedPlan.costBreakdown.tickets.toLocaleString('vi-VN')} đ
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-700">
                  <div className="text-xs text-slate-500 dark:text-slate-400">{isEn ? '🚗 Local Transport' : '🚗 Di chuyển bản địa'}</div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {generatedPlan.costBreakdown.transport.toLocaleString('vi-VN')} đ
                  </div>
                </div>
              </div>
            </div>

            {/* Day by Day Plan Cards */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ClockIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  <span>{isEn ? 'Detailed Daily Schedule' : 'Lịch Trình Chi Tiết Từng Ngày'}</span>
                </h3>
                <button
                  type="button"
                  onClick={handleCopyItinerary}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <ShareIcon className="w-4 h-4 text-cyan-600" />
                  <span>{isEn ? 'Copy Itinerary' : 'Sao Chép Lịch Trình'}</span>
                </button>
              </div>

              {generatedPlan.days.map((day) => (
                <div
                  key={day.day}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-cyan-500/20">
                        {isEn ? `D${day.day}` : `N${day.day}`}
                      </div>
                      <div>
                        <div className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold">{day.dateLabel}</div>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{day.title}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Morning */}
                    <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800/40 border border-amber-100 dark:border-slate-700/60 space-y-2">
                      <div className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <SunIcon className="w-4 h-4" />
                        <span>{isEn ? 'Morning' : 'Buổi Sáng'} ({day.morning.time})</span>
                      </div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">{day.morning.place}</div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{day.morning.activity}</p>
                      {day.morning.tip && (
                        <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
                          💡 <strong>Tip:</strong> {day.morning.tip}
                        </div>
                      )}
                    </div>

                    {/* Afternoon & Lunch */}
                    <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-slate-800/40 border border-cyan-100 dark:border-slate-700/60 space-y-2">
                      <div className="text-xs font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                        <CakeIcon className="w-4 h-4" />
                        <span>{isEn ? 'Lunch & Afternoon' : 'Trưa & Chiều'} ({day.afternoon.time})</span>
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                        🍴 <strong>{isEn ? 'Lunch:' : 'Ăn trưa:'}</strong> {day.lunch.dish} ({day.lunch.place})
                      </div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white pt-1">{day.afternoon.place}</div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{day.afternoon.activity}</p>
                    </div>

                    {/* Evening & Dinner */}
                    <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/40 border border-indigo-100 dark:border-slate-700/60 space-y-2">
                      <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                        <ShoppingBagIcon className="w-4 h-4" />
                        <span>{isEn ? 'Dinner & Evening' : 'Tối & Đêm'} ({day.evening.time})</span>
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                        🌙 <strong>{isEn ? 'Dinner:' : 'Bữa tối:'}</strong> {day.dinner.dish}
                      </div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white pt-1">{day.evening.place}</div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{day.evening.activity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommended Tours Matching This Itinerary */}
            {toursData && toursData.length > 0 && (
              <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/40 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {isEn ? 'Save Time & Effort' : 'Gợi Ý Tour Trọn Gói'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold mt-2">
                      {isEn
                        ? `Don't Want to Organize Self-Sufficiently? Book a Curated Tour:`
                        : `Ngại Lên Kế Hoạch Tự Túc? Đặt Tour Tuyển Chọn Trọn Gói Chuẩn 5 Sao:`}
                    </h3>
                  </div>
                  <Link
                    to="/tours"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-cyan-300 hover:text-white hover:underline"
                  >
                    <span>{isEn ? 'View All Tours' : 'Xem tất cả tour'}</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {toursData.slice(0, 3).map((t: any) => (
                    <div
                      key={t.id}
                      className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/50 transition-all flex flex-col justify-between"
                    >
                      <div className="aspect-[16/9] overflow-hidden relative">
                        <img
                          src={getAuthenticImage(t.image, t.name || t.slug, 'tour')}
                          alt={t.name}
                          className="w-full h-full object-cover"
                          onError={(e) => handleImageError(e, t.name || t.slug, 'tour')}
                        />
                      </div>
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-white line-clamp-2 hover:text-cyan-300 transition">
                            <Link to={`/tours/${t.slug}`}>{t.name}</Link>
                          </h4>
                          <div className="text-xs text-slate-300 mt-1">
                            {t.duration || 3} {isEn ? 'Days' : 'Ngày'} • {isEn ? 'Depart from:' : 'Khởi hành:'} {t.departurePoint || 'Hà Nội'}
                          </div>
                        </div>
                        <div className="pt-2 flex items-center justify-between border-t border-white/10">
                          <span className="font-extrabold text-cyan-300 text-sm">
                            {(t.price || 0).toLocaleString('vi-VN')} đ
                          </span>
                          <Link
                            to={`/tours/${t.slug}`}
                            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs transition"
                          >
                            {isEn ? 'Details' : 'Chi tiết'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
