import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getTourBySlug, getToursPaged } from '../services/tour';
import { useLanguage } from '../contexts/LanguageContext';
import Skeleton from '../components/Skeleton';
import SEOHead from '../components/SEOHead';
import { getAuthenticImage, getAuthenticGallery, handleImageError } from '../utils/imageFallback';
import {
  CalendarDaysIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  UserGroupIcon,
  ClockIcon,
  TicketIcon,
  StarIcon,
  DocumentTextIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
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
  FireIcon,
  TrophyIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useState, useMemo, useEffect, useRef } from 'react';
import { getDestinationImageUrl } from '../utils/imageHelper';
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

export const PACKAGE_OPTIONS: PackageOption[] = [
  {
    id: 'standard',
    name: 'Gói Tiêu Chuẩn',
    subtitle: 'Standard Comfort',
    badge: 'Phổ biến nhất',
    badgeStyle: 'bg-blue-600 text-white',
    priceDelta: 0,
    description: 'Trọn gói đầy đủ các điểm tham quan, ẩm thực và xe đưa đón đạt chuẩn du lịch chất lượng cao.',
    features: [
      'Xe du lịch máy lạnh chất lượng cao đưa đón suốt tuyến',
      'Hướng dẫn viên chuyên nghiệp nhiệt tình theo đoàn',
      'Vé tham quan tất cả các điểm có trong lịch trình',
      'Bữa ăn theo chương trình với ẩm thực địa phương đặc sản',
      'Nước suối tinh khiết & khăn lạnh phục vụ hằng ngày',
      'Bảo hiểm du lịch mức bồi thường tối đa 50.000.000đ/vụ',
    ],
  },
  {
    id: 'vip',
    name: 'Gói Trải Nghiệm VIP',
    subtitle: 'VIP Luxury & Priority',
    badge: 'TravelHub Choice ★ Khuyên dùng',
    badgeStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm',
    priceDelta: 350000,
    highlight: true,
    description: 'Nâng cấp chuẩn thương gia: Limousine đưa đón tận cửa, ẩm thực 4-5 sao và lối đi ưu tiên Fast-Track.',
    features: [
      'Bao gồm toàn bộ quyền lợi của Gói Tiêu Chuẩn',
      'Xe Limousine Dcar hạng thương gia đón trả tận khách sạn',
      'Bữa trưa & tối set menu cao cấp tại nhà hàng chuẩn 4-5 sao',
      'Lối đi ưu tiên Fast-Track & vé cáp treo VIP không cần xếp hàng',
      'Tặng vé trải nghiệm chèo thuyền SUP / kayak 60 phút',
      'Bảo hiểm du lịch toàn diện nâng mức 120.000.000đ/vụ',
      'Bộ quà tặng du lịch độc quyền cao cấp TravelHub Traveler Kit',
    ],
  },
  {
    id: 'saver',
    name: 'Gói Tiết Kiệm',
    subtitle: 'Smart Budget Saver',
    badge: 'Tiết kiệm chi phí',
    badgeStyle: 'bg-emerald-600 text-white',
    priceDelta: -150000,
    description: 'Lựa chọn lý tưởng cho các bạn trẻ và nhóm du khách thích linh hoạt tự do khám phá theo cách riêng.',
    features: [
      'Xe du lịch đưa đón các điểm tham quan chính trong tour',
      'Vé vào cổng các điểm thắng cảnh cơ bản theo chương trình',
      'Tự do lựa chọn thưởng thức ẩm thực theo sở thích cá nhân',
      'Bảo hiểm du lịch bắt buộc theo quy định hiện hành',
      'Tối đa thời gian tự do chụp ảnh và trải nghiệm riêng',
    ],
  },
];

export default function TourDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { i18n } = useTranslation();
  const bookingRef = useRef<HTMLDivElement | null>(null);
  
  // State management
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('standard');
  const [selectedDate, setSelectedDate] = useState(() => {
    // Tự động chọn ngày khởi hành hợp lệ gần nhất (3 ngày tới)
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true, 3: true, 4: true });
  const [isHighlightsExpanded, setIsHighlightsExpanded] = useState(true);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isFavorite, setIsFavorite] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Fetch tour data from backend
  const { data: dbTour, isLoading } = useQuery({
    queryKey: ['tour', slug, i18n.language],
    queryFn: () => getTourBySlug(slug!),
    enabled: !!slug,
    retry: 1,
  });

  const tour = useMemo(() => {
    if (dbTour) return dbTour;
    return {
      id: 101,
      name: slug?.includes('ha-long')
        ? 'Tour Du Thuyền Hạ Long 2N1Đ - Chuẩn 5 Sao Quốc Tế Heritage'
        : slug?.includes('da-nang')
        ? 'Tour Đà Nẵng - Cầu Vàng Bà Nà Hills - Phố Cổ Hội An 3N2Đ'
        : slug?.includes('phu-quoc')
        ? 'Khám Phá Đảo Ngọc Phú Quốc - Cáp Treo Hòn Thơm 3N2Đ'
        : slug?.includes('sa-pa') || slug?.includes('sapa')
        ? 'Tour Sa Pa - Chinh Phục Đỉnh Fansipan - Bản Cát Cát 2N1Đ'
        : 'Tour Du Thuyền Hạ Long 2N1Đ - Chuẩn 5 Sao Quốc Tế Heritage',
      slug: slug || 'tour-ha-long-2n1d',
      shortDescription: 'Trải nghiệm kỳ nghỉ thiên đường với dịch vụ chuẩn quốc tế, ẩm thực hải sản thượng hạng và xe đưa đón Limousine cao cấp.',
      description: 'Chuyến hành trình được thiết kế công phu đưa du khách thưởng ngoạn những cảnh quan tuyệt sắc của thiên nhiên kỳ vĩ. Trọn gói vé tham quan các điểm du lịch nổi tiếng, hướng dẫn viên chuyên nghiệp và bảo hiểm du lịch toàn diện.',
      image: getAuthenticImage(null, slug, 'tour'),
      duration: 2,
      price: 2490000,
      originalPrice: 3890000,
      rating: 4.9,
      reviewCount: 1420,
      tags: ['Bán chạy nhất', 'TravelHub Choice', 'Xác nhận tức thì', 'Tour 5 Sao'],
      highlights: [
        { icon: 'ship', text: 'Nghỉ dưỡng chuẩn 5 sao view toàn cảnh thiên nhiên' },
        { icon: 'fork-knife', text: 'Thưởng thức buffet hải sản tươi sống đặc sản' },
        { icon: 'mountain', text: 'Chèo thuyền Kayak và ngắm hoàng hôn vịnh biển' },
        { icon: 'car', text: 'Xe Limousine Dcar đưa đón tận nơi suốt tuyến' },
      ],
      itinerary: [
        {
          day: 1,
          title: 'Khởi hành & Bắt đầu hành trình khám phá',
          activities: [
            '08:00: Xe Limousine đón quý khách tại điểm hẹn trung tâm',
            '11:30: Đến bến tàu, làm thủ tục check-in nhận phòng với đồ uống chào mừng',
            '12:30: Thưởng thức bữa trưa buffet với các món đặc sản địa phương',
            '14:30: Tham quan hang động kỳ quan và trải nghiệm chèo thuyền Kayak',
            '18:30: Tiệc ngắm hoàng hôn Sunset Party & Lớp học nấu ăn truyền thống',
            '19:30: Bữa tối ẩm thực sang trọng và câu mực đêm cùng thuyền viên',
          ],
        },
        {
          day: 2,
          title: 'Đón bình minh & Trải nghiệm văn hóa bản địa',
          activities: [
            '06:30: Tham gia lớp tập dưỡng sinh Thái Cực Quyền trên boong tàu',
            '07:30: Dùng bữa sáng nhẹ với trà, cà phê và bánh ngọt tươi',
            '08:30: Khám phá làng chài cổ kính, tìm hiểu cuộc sống ngư dân',
            '10:00: Làm thủ tục trả phòng, dùng bữa trưa nhẹ buffet',
            '12:00: Tàu cập bến, xe đưa quý khách trở về điểm hẹn an toàn',
          ],
        },
      ],
      destination: {
        id: 1,
        name: slug?.includes('phu-quoc') ? 'Phú Quốc' : slug?.includes('da-nang') ? 'Đà Nẵng' : 'Vịnh Hạ Long',
        slug: 'ha-long',
      },
      destinationId: 1,
    };
  }, [dbTour, slug]);

  const { data: relatedToursData } = useQuery({
    queryKey: ['related-tours', tour?.destinationId, i18n.language],
    queryFn: () => getToursPaged(1, 3, { destinationId: tour?.destinationId ?? undefined }),
    enabled: !!tour?.destinationId,
  });

  const relatedTours = relatedToursData?.items?.filter(t => t.slug !== slug) || [];

  // Scroll detection for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset accordion when tour changes
  useEffect(() => {
    setExpandedAccordion(null);
  }, [slug]);

  // Get images with authentic gallery fallback (guaranteed unique and authentic)
  const images = useMemo(() => {
    if (!tour) return [];
    const photoList: string[] = [];
    if (tour.image) photoList.push(tour.image);
    if (tour.photos) {
      if (Array.isArray(tour.photos)) {
        photoList.push(...tour.photos);
      } else if (typeof tour.photos === 'string') {
        try {
          const parsed = JSON.parse(tour.photos);
          if (Array.isArray(parsed)) photoList.push(...parsed);
        } catch {}
      }
    }
    return getAuthenticGallery(photoList, tour.name || tour.slug, 'tour');
  }, [tour]);

  // Gallery images
  const galleryImages = useMemo(() => {
    return images.filter(Boolean);
  }, [images]);

  // Generate tour code
  const tourCode = useMemo(() => {
    if (!tour) return 'NDSGN000';
    return `NDSGN${tour.id?.toString().padStart(3, '0') || '000'}`;
  }, [tour]);

  // Get tags
  const tags = useMemo(() => {
    if (!tour?.tags) return ['Island', 'Snorkeling'];
    if (Array.isArray(tour.tags)) return tour.tags;
    if (typeof tour.tags === 'string') {
      try {
        const parsed = JSON.parse(tour.tags);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return ['Island', 'Snorkeling'];
  }, [tour?.tags]);

  // Get highlights (parse JSON string or Array, with realistic fallback)
  const highlights = useMemo(() => {
    let list = tour?.highlights;
    if (typeof list === 'string') {
      try { list = JSON.parse(list); } catch {}
    }
    if (Array.isArray(list) && list.length > 0) return list;
    return [
      { icon: 'ship', text: 'Khách sạn/du thuyền tiêu chuẩn cao cấp tiện nghi sang trọng' },
      { icon: 'fork-knife', text: 'Thưởng thức buffet và ẩm thực đặc sản địa phương tươi ngon' },
      { icon: 'mountain', text: 'Trọn gói vé tham quan các danh lam thắng cảnh và hoạt động trải nghiệm' },
      { icon: 'car', text: 'Xe du lịch đời mới chất lượng cao đưa đón chu đáo suốt hành trình' },
    ];
  }, [tour?.highlights]);

  // Get enriched itinerary with rich travel narrative and times
  const itinerary = useMemo(() => {
    let rawList = tour?.itinerary;
    if (typeof rawList === 'string') {
      try { rawList = JSON.parse(rawList); } catch {}
    }
    const tourName = tour?.name || '';
    const tourSlug = slug || tour?.slug || '';
    const isHaLong = tourSlug.includes('ha-long') || tourName.toLowerCase().includes('hạ long');
    const is3N2D = tourSlug.includes('3n2d') || tourName.includes('3N2Đ') || tourName.includes('3 ngày 2 đêm') || tour?.duration === 3;

    if (isHaLong && is3N2D) {
      return [
        {
          day: 1,
          title: 'Hà Nội – Tuần Châu – Vịnh Hạ Long – Chèo Kayak & Tiệc Hoàng Hôn Sunset Party',
          meals: 'Ăn trưa buffet hải sản tươi, Bữa tối Fine Dining 5 sao lãng mạn',
          hotel: 'Du thuyền Heritage Cruise 5 sao (Cabin Suite view vịnh có bồn tắm)',
          transport: 'Xe Limousine Dcar cao tốc đón tại Hà Nội',
          activities: [
            {
              time: '08:00 - 08:30',
              title: 'Xe Limousine đón tại Hà Nội',
              desc: 'Xe Limousine hạng thương gia đón quý khách tại khách sạn phố cổ hoặc điểm hẹn trung tâm Hà Nội, khởi hành đi Hạ Long theo tuyến cao tốc mới Hà Nội – Hải Phòng – Quảng Ninh êm ái, nhanh chóng.',
            },
            {
              time: '11:30 - 12:00',
              title: 'Check-in Cảng Quốc tế Tuần Châu & Lên Du Thuyền',
              desc: 'Đến nhà chờ riêng tại Cảng Tuần Châu. Đội ngũ thủy thủ đoàn đón tiếp nồng hậu, hướng dẫn làm thủ tục lên tàu bằng tender. Quý khách thưởng thức đồ uống chào mừng Welcome Drink và nhận phòng Suite ban công riêng view trọn vịnh ngọc.',
            },
            {
              time: '12:30 - 14:00',
              title: 'Thưởng thức bữa trưa Buffet Hải sản thượng hạng',
              desc: 'Du thuyền nhổ neo lướt êm qua các kỳ quan đá vôi nghìn năm tuổi: Hòn Gà Chọi, Hòn Đỉnh Hương, Hòn Chó Đá. Quý khách dùng bữa trưa buffet phong phú với tôm, cua, mực tươi rói đánh bắt trong ngày.',
            },
            {
              time: '14:30 - 16:30',
              title: 'Chèo thuyền Kayak & Khám phá Hang Luồn',
              desc: 'Tự do chèo thuyền Kayak đôi hoặc ngồi thuyền nan có người chèo qua vòm hang Luồn kỳ vĩ, chiêm ngưỡng đàn khỉ vàng tự nhiên leo trèo trên vách đá và làn nước xanh ngọc bích phẳng lặng.',
            },
            {
              time: '17:30 - 18:30',
              title: 'Tiệc hoàng hôn Sunset Party & Lớp học nấu ăn',
              desc: 'Lên sundeck ngắm nhìn ánh hoàng hôn đỏ rực buông xuống vịnh di sản. Thưởng thức trà hoa cúc, trái cây nhiệt đới, rượu vang nhẹ và tham gia lớp học cuốn nem tươi truyền thống cùng bếp trưởng du thuyền.',
            },
            {
              time: '19:30 - 21:00',
              title: 'Bữa tối đẳng cấp Fine Dining dưới ánh nến',
              desc: 'Bữa tối set menu cao cấp phong cách Á - Âu kết hợp nguyên liệu hải sản vịnh tinh túy. Không gian nhà hàng sang trọng nhìn trọn mặt biển lung linh về đêm.',
            },
            {
              time: '21:00 - 22:30',
              title: 'Câu mực đêm & Thư giãn ngắm sao trên biển',
              desc: 'Trải nghiệm thử tài câu mực đêm cùng thủy thủ đoàn, thư giãn tại quầy bar ngoài trời, nghe nhạc acoustic hoặc tận hưởng liệu trình Spa trị liệu cao cấp.',
            },
          ],
        },
        {
          day: 2,
          title: 'Vịnh Lan Hạ – Đảo Cát Bà – Làng Chài Cổ Việt Hải – Tắm Biển Ba Trái Đào',
          meals: 'Ăn sáng buffet, Ăn trưa hải sản tươi sống, Đêm tiệc Gala BBQ',
          hotel: 'Du thuyền Heritage Cruise 5 sao (Cabin Suite view vịnh)',
          transport: 'Tàu nhật trình cao cấp + Xe đạp / Xe điện làng cổ',
          activities: [
            {
              time: '06:15 - 06:45',
              title: 'Đón bình minh & Tập Thái Cực Quyền (Tai Chi)',
              desc: 'Thức giấc giữa kỳ quan thiên nhiên, hít thở không khí biển sớm mai trong lành và tham gia bài tập Thái Cực Quyền dưỡng sinh nhẹ nhàng trên sundeck dưới sự hướng dẫn của chuyên gia.',
            },
            {
              time: '07:00 - 08:00',
              title: 'Bữa điểm tâm sáng với cà phê & bánh ngọt tươi',
              desc: 'Khởi đầu ngày mới tràn đầy năng lượng với phở bò truyền thống, trà thảo mộc, cà phê nóng và bánh ngọt kiểu Pháp nướng thơm lừng tại nhà hàng.',
            },
            {
              time: '08:30 - 12:00',
              title: 'Khám phá Làng cổ Việt Hải trên đảo Cát Bà',
              desc: 'Chuyển sang tàu nhật trình đưa quý khách đến bến Việt Hải. Đi xe đạp hoặc xe điện xuyên qua rừng nguyên sinh Cát Bà, ghé thăm ngôi làng cổ thanh bình tách biệt giữa thung lũng, ngâm chân mát-xa cá tự nhiên dưới dòng suối.',
            },
            {
              time: '12:30 - 14:00',
              title: 'Bữa trưa tươi ngon trên vịnh Lan Hạ',
              desc: 'Thưởng thức bữa trưa đậm đà hương vị biển đảo trong khi du thuyền di chuyển qua quần đảo Lan Hạ hoang sơ với hàng trăm bãi cát trắng tự nhiên.',
            },
            {
              time: '14:30 - 16:30',
              title: 'Bơi lội & Chèo Kayak tại Bãi biển Ba Trái Đào',
              desc: 'Thả mình vào làn nước biển trong vắt nhìn thấy đáy tại khu vực bãi tắm Ba Trái Đào hoặc bãi Vạn Bội. Trải nghiệm nhảy từ cầu tàu xuống mặt biển xanh mát.',
            },
            {
              time: '19:30 - 21:00',
              title: 'Đêm tiệc BBQ hải sản nướng trên boong tàu',
              desc: 'Bữa tiệc Gala BBQ hải sản nướng thơm nức mũi với tôm hùm, hào nướng mỡ hành, mực nướng sa tế và các loại cocktail nhiệt đới rực rỡ.',
            },
          ],
        },
        {
          day: 3,
          title: 'Khám Phá Hang Sửng Sốt – Buffet Brunch – Cập Cảng Tuần Châu – Hà Nội',
          meals: 'Ăn sáng nhẹ, Bữa trưa Buffet Brunch thịnh soạn',
          hotel: 'Kết thúc chuyến hành trình nghỉ dưỡng 5 sao',
          transport: 'Xe Limousine cao tốc đưa về Hà Nội',
          activities: [
            {
              time: '06:30 - 07:15',
              title: 'Ngắm bình minh & Thưởng thức trà sáng',
              desc: 'Tận hưởng khoảnh khắc bình minh tuyệt đẹp trên vịnh ngọc, nhâm nhi tách cà phê Việt Nam hoặc trà sen thơm ngát trên ban công phòng riêng.',
            },
            {
              time: '07:30 - 09:00',
              title: 'Chinh phục Hang Sửng Sốt (Kỳ quan đệ nhất hang động)',
              desc: 'Đoàn cập bến đảo Bồ Hòn, leo khoảng 50 bậc đá rợp bóng cây để vào tham quan Hang Sửng Sốt – hang động lớn và đẹp nhất Vịnh Hạ Long với hàng triệu khối thạch nhũ hóa thạch lung linh huyền ảo dưới ánh đèn nghệ thuật.',
            },
            {
              time: '09:30 - 10:30',
              title: 'Làm thủ tục trả phòng & Thưởng thức Buffet Brunch',
              desc: 'Quý khách thu xếp hành lý, đặt trước cửa phòng để nhân viên hỗ trợ chuyển xuống bờ. Thưởng thức bữa trưa sớm Buffet Brunch thịnh soạn trong khi du thuyền thong thả quay về đất liền.',
            },
            {
              time: '11:30 - 12:00',
              title: 'Tàu cập cảng Tuần Châu & Xe Limousine đón về Hà Nội',
              desc: 'Du thuyền cập cảng Tuần Châu. Xe Limousine đón quý khách và khởi hành về Hà Nội.',
            },
            {
              time: '14:30 - 15:00',
              title: 'Về đến điểm hẹn trung tâm Hà Nội – Kết thúc chuyến đi',
              desc: 'Xe đưa quý khách về đến điểm đón ban đầu tại Hà Nội an toàn. Hướng dẫn viên chia tay đoàn và hẹn gặp lại trong những hành trình tiếp theo cùng TravelHub!',
            },
          ],
        },
      ];
    }

    if (Array.isArray(rawList) && rawList.length > 0) {
      const defaultTimes = ['08:00 - 09:30', '10:00 - 12:00', '12:30 - 14:00', '14:30 - 17:00', '18:30 - 21:00'];
      return rawList.map((d: any, dIdx: number) => {
        const dayNumber = d.day || dIdx + 1;
        const formattedActivities = (d.activities || []).map((act: any, aIdx: number) => {
          if (typeof act === 'string') {
            if (act.includes(':')) {
              const parts = act.split(':');
              const firstPart = parts[0].trim();
              if (/^\d{1,2}[h:]\d{2}/.test(firstPart) || /^\d{1,2}:\d{2}/.test(firstPart)) {
                return {
                  time: firstPart,
                  title: parts[1]?.trim() || firstPart,
                  desc: parts.slice(1).join(':').trim(),
                };
              }
            }
            return {
              time: defaultTimes[aIdx % defaultTimes.length],
              title: act,
              desc: `Khám phá và trải nghiệm các hoạt động tiêu biểu của ${act} cùng hướng dẫn viên chuyên nghiệp.`,
            };
          }
          return act;
        });

        return {
          day: dayNumber,
          title: d.title || `Ngày ${dayNumber}: Hành trình khám phá trải nghiệm`,
          meals: d.meals || (dayNumber === 1 ? 'Ăn trưa, Ăn tối đặc sản' : 'Ăn sáng buffet, Ăn trưa đặc sản'),
          hotel: d.hotel || 'Khách sạn / Resort tiêu chuẩn 4-5 sao',
          transport: d.transport || 'Xe du lịch máy lạnh chất lượng cao',
          activities: formattedActivities.length > 0 ? formattedActivities : [
            { time: '08:00 - 11:30', title: 'Khởi hành tham quan các thắng cảnh', desc: 'Xe đưa đoàn đến các điểm du lịch tiêu biểu theo lịch trình đã duyệt.' },
            { time: '12:00 - 13:30', title: 'Thưởng thức ẩm thực địa phương', desc: 'Bữa ăn được chuẩn bị chu đáo với các món ăn đặc sản vùng miền tươi ngon.' },
            { time: '14:30 - 17:30', title: 'Trải nghiệm văn hóa & check-in', desc: 'Tự do chụp ảnh lưu niệm và tìm hiểu nếp sống văn hóa của cư dân bản địa.' },
          ],
        };
      });
    }

    return [
      {
        day: 1,
        title: 'Khởi hành & Bắt đầu hành trình khám phá',
        meals: 'Ăn trưa đặc sản, Bữa tối ẩm thực địa phương',
        hotel: 'Khách sạn / Resort 4-5 sao',
        transport: 'Xe Limousine đón tận nơi',
        activities: [
          { time: '08:00 - 08:30', title: 'Đón khách tại điểm hẹn', desc: 'Xe và hướng dẫn viên đón quý khách khởi hành chuyến tham quan.' },
          { time: '11:30 - 12:00', title: 'Nhận phòng & nghỉ ngơi', desc: 'Làm thủ tục nhận phòng khách sạn, thưởng thức đồ uống chào mừng.' },
          { time: '12:30 - 14:00', title: 'Bữa trưa đặc sản bản địa', desc: 'Thưởng thức các món ẩm thực tươi ngon mang đậm phong vị địa phương.' },
          { time: '14:30 - 17:00', title: 'Khám phá danh lam thắng cảnh', desc: 'Tham quan các điểm đến nổi tiếng, chụp ảnh lưu niệm và trải nghiệm văn hóa.' },
          { time: '18:30 - 21:00', title: 'Bữa tối & tự do dạo phố đêm', desc: 'Dùng bữa tối tại nhà hàng và tự do khám phá phố đêm lung linh.' },
        ],
      },
      {
        day: 2,
        title: 'Đón bình minh – Trải nghiệm văn hóa bản địa – Trở về điểm xuất phát',
        meals: 'Ăn sáng buffet, Ăn trưa nhẹ',
        hotel: 'Kết thúc chuyến hành trình',
        transport: 'Xe Limousine đưa về điểm đón',
        activities: [
          { time: '07:00 - 08:00', title: 'Điểm tâm sáng buffet', desc: 'Thưởng thức bữa sáng phong phú nạp năng lượng cho ngày mới.' },
          { time: '08:30 - 11:00', title: 'Hoạt động trải nghiệm & Mua quà', desc: 'Tham gia các hoạt động văn hóa đặc sắc và mua sắm đặc sản làm quà.' },
          { time: '11:30 - 12:30', title: 'Trả phòng & Dùng bữa trưa', desc: 'Làm thủ tục trả phòng khách sạn và thưởng thức bữa trưa.' },
          { time: '13:30 - 16:30', title: 'Khởi hành về điểm đón ban đầu', desc: 'Xe đưa quý khách về lại điểm hẹn ban đầu an toàn. Kết thúc hành trình trọn vẹn!' },
        ],
      },
    ];
  }, [tour?.itinerary, tour?.name, slug, tour?.slug, tour?.duration]);

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

  // Reset selectedImageIndex if it's out of bounds
  useEffect(() => {
    if (images.length > 0 && selectedImageIndex >= images.length) {
      setSelectedImageIndex(0);
    }
  }, [images.length, selectedImageIndex]);

  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return '0';
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const calendarDays = useMemo(() => getDaysInMonth(selectedMonth), [selectedMonth]);

  // Mock departure dates with prices - reliable recurring days (Tue, Thu, Fri, Sat, Sun)
  const departureDates = useMemo(() => {
    const dates: Record<string, number> = {};
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const basePrice = tour?.price || 15590000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= 31; i++) {
      const date = new Date(year, month, i);
      if (date.getMonth() !== month) break;
      if (date < today) continue;
      const dayOfWeek = date.getDay(); // 0 is Sun, 2 is Tue, 4 is Thu, 5 is Fri, 6 is Sat
      if ([0, 2, 4, 5, 6].includes(dayOfWeek)) {
        dates[i.toString()] = basePrice;
      }
    }
    return dates;
  }, [selectedMonth, tour?.price]);

  // Quick 4 upcoming departure dates for instant 1-click selection
  const quickDates = useMemo(() => {
    const list: { label: string; dateStr: string }[] = [];
    const baseDate = new Date();
    const daysName = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    
    for (let i = 2; i <= 25; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const dayOfWeek = d.getDay();
      if ([5, 6, 0].includes(dayOfWeek)) { // Fri, Sat, Sun
        const dayStr = String(d.getDate()).padStart(2, '0');
        const monthStr = String(d.getMonth() + 1).padStart(2, '0');
        const dateStr = `${d.getFullYear()}-${monthStr}-${dayStr}`;
        list.push({
          label: `${daysName[dayOfWeek]}, ${dayStr}/${monthStr}`,
          dateStr,
        });
        if (list.length >= 4) break;
      }
    }
    return list;
  }, []);

  // Active package details
  const activePackage = useMemo(() => {
    return PACKAGE_OPTIONS.find((p) => p.id === selectedPackage) || PACKAGE_OPTIONS[0];
  }, [selectedPackage]);

  // Calculate prices with selected package
  const baseTourPrice = tour?.price || 15590000;
  const pricePerAdult = Math.max(0, baseTourPrice + activePackage.priceDelta);
  const pricePerChild = Math.round(pricePerAdult * 0.7);

  const adultsTotal = pricePerAdult * adults;
  const childrenTotal = pricePerChild * children;
  const totalPrice = adultsTotal + childrenTotal;
  
  // Traveloka Transparent breakdown: 0đ hidden fee + online member discount
  const serviceFee = 0; // Traveloka zero-hidden-fee guarantee
  const memberDiscount = totalPrice >= 5000000 ? 150000 : (totalPrice >= 2000000 ? 80000 : 0);
  const grandTotal = Math.max(0, totalPrice + serviceFee - memberDiscount);

  const handleBooking = () => {
    if (!selectedDate) {
      toast.error('Vui lòng chọn ngày khởi hành');
      const el = document.getElementById('departure-schedule');
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
      const el = document.getElementById('departure-schedule');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!tour) return;
    addItem({
      type: 'tour',
      itemId: tour.id,
      title: `${tour.name} [${activePackage.name}]`,
      image: tour.image || undefined,
      slug: tour.slug,
      price: pricePerAdult,
      originalPrice: tour.originalPrice ? (tour.originalPrice + activePackage.priceDelta) : undefined,
      date: selectedDate,
      guests: adults + children,
      duration: tour.duration,
      location: tour.destination?.name,
    });
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setSelectedMonth(prev => {
      const now = new Date();
      if (direction === 'prev') {
        if (prev.getFullYear() === now.getFullYear() && prev.getMonth() <= now.getMonth()) {
          return prev;
        }
        const newDate = new Date(prev);
        newDate.setMonth(prev.getMonth() - 1);
        return newDate;
      } else {
        const newDate = new Date(prev);
        newDate.setMonth(prev.getMonth() + 1);
        return newDate;
      }
    });
  };

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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



  const mainImage = images[selectedImageIndex] || images[0] || getAuthenticImage(null, tour.name || tour.slug, 'tour');
  const price = tour.price || 980000;
  const originalPrice = tour.originalPrice;
  const destinationName = tour.destination?.name || 'Phú Quốc';
  const tourImage = getAuthenticImage(tour.image, tour.name || tour.slug, 'tour');

  return (
    <>
      <SEOHead
        title={tour.name}
        description={tour.description || ''}
        image={mainImage}
        type="product"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Sticky Top Bar - Appears on scroll */}
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <div>
                    <h1 className="font-bold text-gray-900 line-clamp-1">{tour.name}</h1>
                    <div className="flex items-center gap-2 text-sm">
                      {tour.rating && (
                        <div className="flex items-center gap-1">
                          <StarIconSolid className="w-4 h-4 text-yellow-400" />
                          <span className="font-semibold">{tour.rating.toFixed(1)}</span>
                        </div>
                      )}
                      {tour.duration && (
                        <span className="text-gray-600">• {tour.duration} ngày</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(price)} ₫</span>
                  <button 
                    onClick={scrollToBooking}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    Đặt ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 flex items-center gap-1">
                  <SparklesIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Klook Choice 2026
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 flex items-center gap-1">
                  <BoltIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Xác nhận tức thì
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                  ✓ Miễn phí hủy trong 24h
                </span>
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
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition-all ${
                    isFavorite
                      ? 'border-red-200 bg-red-50 text-red-600 dark:bg-red-950/30 dark:border-red-800'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {isFavorite ? <HeartIconSolid className="w-4 h-4 text-red-500" /> : <HeartIcon className="w-4 h-4" />}
                  {isFavorite ? 'Đã lưu' : 'Lưu vào yêu thích'}
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
                <span className="font-extrabold text-slate-900 dark:text-white">{tour.rating ? tour.rating.toFixed(1) : '4.9'}</span>
                <span className="text-slate-500 dark:text-slate-400 underline decoration-slate-300">({tour.reviewCount || 128} đánh giá)</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4 text-rose-500" />
                <span className="font-medium">{destinationName}{tour.departurePoint ? ` • Khởi hành: ${tour.departurePoint}` : ''}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                <span>{tour.duration ? `${tour.duration} ngày ${tour.duration - 1} đêm` : '2 ngày 1 đêm'}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1">
                <UserGroupIcon className="w-4 h-4 text-emerald-600" />
                <span>Tour ghép / Gia đình</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Photo Gallery */}
        <section className="bg-white dark:bg-slate-950 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 rounded-2xl overflow-hidden h-[340px] sm:h-[420px] lg:h-[460px]">
              {/* Photo 1: Large feature on the left (2 cols x 2 rows) */}
              <div
                className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden bg-slate-100 dark:bg-slate-800"
                onClick={() => { setCurrentImageIndex(0); setShowGallery(true); }}
              >
                <img
                  src={images[0]}
                  alt={tour.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    handleImageError(e, tour.name || tour.slug, 'tour');
                  }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <span className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                  <SparklesIcon className="w-3.5 h-3.5 text-amber-400" /> Toàn cảnh
                </span>
              </div>

              {/* Photos 2-5: 2x2 Grid on the right (Unique authentic photos) */}
              {images.slice(1, 5).map((photo, idx) => {
                const photoIndex = idx + 1;
                const isLast = idx === 3 || photoIndex === images.length;
                return (
                  <div
                    key={idx}
                    className="relative group cursor-pointer overflow-hidden bg-slate-100 dark:bg-slate-800 hidden md:block"
                    onClick={() => {
                      setCurrentImageIndex(photoIndex < images.length ? photoIndex : 0);
                      setShowGallery(true);
                    }}
                  >
                    <img
                      src={photo}
                      alt={`${tour.name} - ${photoIndex}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        handleImageError(e, tour.name || tour.slug, 'tour');
                      }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    {isLast && (
                      <div className="absolute inset-0 bg-slate-950/60 hover:bg-slate-950/75 backdrop-blur-[2px] flex items-center justify-center transition-all">
                        <button
                          type="button"
                          className="px-4 py-2.5 bg-white text-slate-900 font-bold rounded-xl text-xs sm:text-sm shadow-xl flex items-center gap-2 group-hover:scale-105 transition-transform"
                        >
                          <PhotoIcon className="w-4 h-4 text-blue-600" />
                          Xem tất cả {images.length} ảnh
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile View All Button */}
            <div className="mt-2.5 md:hidden">
              <button
                type="button"
                onClick={() => { setCurrentImageIndex(0); setShowGallery(true); }}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <PhotoIcon className="w-4 h-4 text-blue-600" /> Xem trọn bộ {images.length} ảnh chụp thực tế
              </button>
            </div>
          </div>
        </section>

        {/* Sticky Sub Navigation Tabs Bar */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-y border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8 overflow-x-auto text-sm font-semibold text-slate-600 dark:text-slate-400 no-scrollbar">
              <a href="#package-options" className="py-3.5 border-b-2 border-blue-600 text-blue-600 whitespace-nowrap">
                Gói dịch vụ & Giá
              </a>
              <a href="#tour-intro" className="py-3.5 border-b-2 border-transparent hover:text-blue-600 whitespace-nowrap">
                Tổng quan tour
              </a>
              <a href="#tour-highlights" className="py-3.5 border-b-2 border-transparent hover:text-blue-600 whitespace-nowrap">
                Điểm nổi bật
              </a>
              <a href="#tour-itinerary" className="py-3.5 border-b-2 border-transparent hover:text-blue-600 whitespace-nowrap">
                Lịch trình chi tiết
              </a>
              <a href="#tour-reviews" className="py-3.5 border-b-2 border-transparent hover:text-blue-600 whitespace-nowrap">
                Đánh giá ({tour.reviewCount || 128})
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

              {/* Klook Package Options Selector */}
              <div id="package-options" className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 flex items-center gap-1">
                        <SparklesIcon className="w-3.5 h-3.5" />
                        Klook Standard Packages
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                      Các gói dịch vụ & tiện nghi
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      Linh hoạt lựa chọn cấp độ trải nghiệm phù hợp với nhu cầu và ngân sách của bạn
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full self-start sm:self-auto border border-emerald-200/50 dark:border-emerald-800/40">
                    <BoltIcon className="w-4 h-4 text-emerald-500" />
                    <span>Xác nhận tức thì • Hủy miễn phí 24h</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {PACKAGE_OPTIONS.map((pkg) => {
                    const isSelected = selectedPackage === pkg.id;
                    const pkgAdultPrice = Math.max(0, (tour?.price || 15590000) + pkg.priceDelta);

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between border-2 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-lg shadow-blue-500/10 scale-[1.02]'
                            : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-blue-300 dark:hover:border-slate-700 hover:shadow-md'
                        }`}
                      >
                        {/* Top badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${pkg.badgeStyle}`}>
                            {pkg.badge}
                          </span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-gray-300 dark:border-slate-600'
                          }`}>
                            {isSelected && <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Title & subtitle */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {pkg.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-3">
                            {pkg.subtitle}
                          </p>

                          {/* Price comparison */}
                          <div className="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-3 mb-4">
                            <div className="text-xs text-gray-500 dark:text-slate-400">Giá mỗi khách:</div>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                                {formatPrice(pkgAdultPrice)} ₫
                              </span>
                            </div>
                            <div className="text-xs mt-1 font-semibold">
                              {pkg.priceDelta === 0 ? (
                                <span className="text-gray-500 dark:text-slate-400">Giá gốc tiêu chuẩn</span>
                              ) : pkg.priceDelta > 0 ? (
                                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                  <SparklesIcon className="w-3 h-3 inline" />
                                  + {formatPrice(pkg.priceDelta)} ₫/khách (Nâng cấp)
                                </span>
                              ) : (
                                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <TagIcon className="w-3 h-3 inline" />
                                  - {formatPrice(Math.abs(pkg.priceDelta))} ₫/khách (Tiết kiệm)
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-gray-600 dark:text-slate-300 mb-4 leading-relaxed">
                            {pkg.description}
                          </p>

                          {/* Features */}
                          <div className="space-y-2 border-t border-gray-100 dark:border-slate-800 pt-3">
                            <p className="text-xs font-bold text-gray-700 dark:text-slate-200 uppercase tracking-wider">
                              Quyền lợi bao gồm:
                            </p>
                            {pkg.features.map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-slate-300">
                                <CheckCircleIcon className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom action button */}
                        <div className="mt-5 pt-3 border-t border-gray-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPackage(pkg.id);
                            }}
                            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              isSelected
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <CheckIcon className="w-4 h-4 stroke-[2.5]" />
                                Đang chọn gói này
                              </>
                            ) : (
                              'Chọn gói này'
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Departure Schedule */}
              <div id="departure-schedule" className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-blue-50 dark:bg-blue-950/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <CalendarDaysIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">LỊCH KHỞI HÀNH & GIÁ THEO NGÀY</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Giá áp dụng cho 1 khách người lớn. Khởi hành định kỳ hàng tuần.</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold self-start sm:self-auto">
                    <ShieldCheckIcon className="w-4 h-4" />
                    Bảo đảm có chỗ • 0đ phụ phí
                  </div>
                </div>

                {/* Quick Date Selection Pills */}
                {quickDates.length > 0 && (
                  <div className="mb-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-3">
                      <SparklesIcon className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Khởi hành gần nhất (Gợi ý chọn nhanh):
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {quickDates.map((item) => {
                        const isSelected = selectedDate === item.dateStr;
                        return (
                          <button
                            key={item.dateStr}
                            onClick={() => setSelectedDate(item.dateStr)}
                            className={`p-2.5 rounded-xl text-left border transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 ring-2 ring-blue-400/40'
                                : 'bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/50'
                            }`}
                          >
                            <div className="text-xs font-bold truncate">{item.label}</div>
                            <div className="flex items-center justify-between mt-1">
                              <span className={`text-[11px] ${isSelected ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>Giá từ</span>
                              <span className={`text-xs font-extrabold ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
                                {formatPrice(tour?.price).replace(/,/g, '.').slice(0, -4)}tr
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Calendar */}
                <div className="border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                  <div className="bg-gradient-to-r from-blue-50/60 to-indigo-50/40 dark:from-slate-800 dark:to-slate-800/60 border-b border-gray-200 dark:border-slate-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={() => handleMonthChange('prev')}
                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors text-gray-600 dark:text-gray-300 border border-transparent hover:border-gray-200 shadow-sm"
                        aria-label="Tháng trước"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      <div className="text-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Lịch khởi hành</span>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          Tháng {selectedMonth.getMonth() + 1} / {selectedMonth.getFullYear()}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleMonthChange('next')}
                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors text-gray-600 dark:text-gray-300 border border-transparent hover:border-gray-200 shadow-sm"
                        aria-label="Tháng sau"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-xs font-bold">
                      {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => (
                        <div
                          key={day}
                          className={`text-center py-1.5 ${idx >= 5 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-600 dark:text-gray-400'}`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 p-3">
                    {calendarDays.map((day, idx) => {
                      if (day === null) {
                        return <div key={`empty-${idx}`} className="aspect-square" />;
                      }
                      
                      const dayStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const hasDeparture = departureDates[day.toString()];
                      const isSelected = selectedDate === dayStr;
                      
                      return (
                        <button
                          key={day}
                          onClick={() => {
                            if (hasDeparture) {
                              setSelectedDate(dayStr);
                            }
                          }}
                          disabled={!hasDeparture}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 text-xs transition-all relative ${
                            isSelected
                              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/30 ring-2 ring-blue-400'
                              : hasDeparture
                              ? 'border border-gray-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/60 dark:hover:bg-slate-800 text-gray-800 dark:text-gray-200'
                              : 'text-gray-300 dark:text-slate-700 cursor-not-allowed'
                          }`}
                        >
                          <span className="font-semibold text-xs sm:text-sm">{day}</span>
                          {hasDeparture && (
                            <span className={`text-[10px] leading-tight ${isSelected ? 'text-blue-100 font-bold' : 'text-blue-600 dark:text-blue-400 font-bold'}`}>
                              {formatPrice(hasDeparture).replace(/,/g, '.').slice(0, -4)}tr
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Date Status Banner */}
                {selectedDate ? (
                  <div className="mt-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                        <CheckIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold uppercase tracking-wider">
                          Ngày khởi hành đã chọn
                        </p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                          {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Chắc chắn khởi hành • Còn 6 chỗ
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic text-center">
                    💡 Vui lòng bấm chọn ngày khởi hành trên lịch hoặc chọn nhanh các ngày gợi ý phía trên.
                  </p>
                )}
              </div>

              {/* Itinerary */}
              {itinerary.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-200 dark:border-slate-800">
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

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-purple-50 dark:bg-purple-950/50 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <PhotoIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Thư viện ảnh thực tế</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Những khoảnh khắc chân thực nhất của hành trình</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentImageIndex(0);
                        setShowGallery(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20"
                    >
                      Xem tất cả ({galleryImages.length})
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {galleryImages.slice(0, 8).map((photo: string, i: number) => {
                      const isLarge = i === 0;
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            setCurrentImageIndex(i);
                            setShowGallery(true);
                          }}
                          className={`relative overflow-hidden rounded-2xl cursor-pointer group ${isLarge ? 'col-span-2 row-span-2' : ''} aspect-square border border-gray-100 dark:border-slate-800`}
                        >
                          <img
                            src={photo.startsWith('http') ? photo : (photo.startsWith('/uploads') ? photo : `/uploads/destinations/${photo}`)}
                            alt={`${tour.name} ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading={i < 4 ? 'eager' : 'lazy'}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-900 dark:text-white text-center">
                              Ảnh {i + 1} / {galleryImages.length}
                            </div>
                          </div>
                          {i === 7 && galleryImages.length > 8 && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                              <div className="text-white text-center">
                                <div className="text-2xl font-bold">+{galleryImages.length - 8}</div>
                                <div className="text-xs font-medium">ảnh khác</div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions (Dịch Vụ Bao Gồm & Không Bao Gồm) */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <CheckBadgeIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">DỊCH VỤ BAO GỒM & KHÔNG BAO GỒM</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Minh bạch 100% quyền lợi dịch vụ, không lo phát sinh chi phí ẩn</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 self-start sm:self-auto">
                    Tiêu chuẩn 5 Sao
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Included (Emerald Theme) */}
                  <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-b from-emerald-50/70 via-emerald-50/30 to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border-2 border-emerald-300 dark:border-emerald-800">
                    <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-emerald-200 dark:border-emerald-800/60">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 stroke-[3]" />
                      </div>
                      <h3 className="font-bold text-base text-emerald-900 dark:text-emerald-300">
                        GIÁ TOUR BAO GỒM
                      </h3>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2.5">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span><strong>Phương tiện cao cấp:</strong> Xe Limousine Dcar hạng thương gia đưa đón tận nơi suốt tuyến.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span><strong>Lưu trú chuẩn 5 sao:</strong> Nghỉ đêm tại Cabin Suite ban công riêng view trọn vịnh, bồn tắm sục.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span><strong>Trọn gói ẩm thực:</strong> Bữa trưa buffet hải sản tươi sống, tiệc hoàng hôn Sunset Party và tối Fine Dining lãng mạn.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span><strong>Vé tham quan & Hoạt động:</strong> Vé thắng cảnh kỳ quan, miễn phí chèo thuyền Kayak, đò nan làng chài và câu mực đêm.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span><strong>Đội ngũ chuyên nghiệp:</strong> Hướng dẫn viên và thuyền đoàn chu đáo, thông thạo tiếng Việt & Anh.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span><strong>Bảo hiểm toàn diện:</strong> Bảo hiểm du lịch với mức bồi thường tối đa 100.000.000 VNĐ/khách.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Excluded (Rose Theme) */}
                  <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-b from-rose-50/70 via-rose-50/30 to-white dark:from-rose-950/30 dark:via-slate-900 dark:to-slate-900 border-2 border-rose-300 dark:border-rose-800">
                    <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-rose-200 dark:border-rose-800/60">
                      <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                        <XMarkIcon className="w-4 h-4 stroke-[3]" />
                      </div>
                      <h3 className="font-bold text-base text-rose-900 dark:text-rose-300">
                        GIÁ TOUR KHÔNG BAO GỒM
                      </h3>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2.5">
                        <XCircleIcon className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Đồ uống phát sinh:</strong> Bia, rượu, cocktail ngoài chương trình và đồ uống tại minibar trong phòng.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <XCircleIcon className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Dịch vụ Spa & Massage:</strong> Các liệu trình thư giãn và chăm sóc sức khỏe tại quầy Spa trên du thuyền.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <XCircleIcon className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Thuế VAT (10%):</strong> Chỉ áp dụng nếu quý khách yêu cầu xuất hóa đơn tài chính đỏ của công ty.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <XCircleIcon className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Tiền Tip (Tùy tâm):</strong> Tiền tip bồi dưỡng cho lái xe và thuyền đoàn phục vụ (không bắt buộc).</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <XCircleIcon className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Chi phí cá nhân:</strong> Chi phí mua sắm quà lưu niệm, giặt là và các hoạt động tự túc ngoài hành trình.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Policies & Terms (Chính Sách & Điều Kiện Du Lịch) */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                  <div className="w-11 h-11 bg-blue-50 dark:bg-blue-950/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <DocumentTextIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">CHÍNH SÁCH & ĐIỀU KHOẢN DU LỊCH</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Quy định đặt chỗ, thanh toán và hoàn hủy theo tiêu chuẩn bảo vệ du khách</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Policy 1: Children */}
                  <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-slate-800/40 border border-amber-200/70 dark:border-slate-700">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                        <UserGroupIcon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">Chính Sách Giá Trẻ Em</h4>
                    </div>
                    <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      <li>• <strong>Dưới 2 tuổi:</strong> Miễn phí (ngủ chung giường bố mẹ, gia đình tự túc ăn uống).</li>
                      <li>• <strong>Từ 2 - dưới 5 tuổi:</strong> 30% giá người lớn (ngủ chung phòng cùng gia đình).</li>
                      <li>• <strong>Từ 5 - dưới 11 tuổi:</strong> 70% giá người lớn (có ghế riêng, suất ăn riêng, ngủ chung).</li>
                      <li>• <strong>Từ 11 tuổi trở lên:</strong> Tính như người lớn (tiêu chuẩn cabin và dịch vụ riêng).</li>
                    </ul>
                  </div>

                  {/* Policy 2: Payment */}
                  <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-slate-800/40 border border-blue-200/70 dark:border-slate-700">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                        <CreditCardIcon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">Đặt Cọc & Thanh Toán</h4>
                    </div>
                    <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      <li>• <strong>Đặt cọc 30%:</strong> Xác nhận giữ chỗ ngay sau khi hoàn tất đăng ký tour.</li>
                      <li>• <strong>Thanh toán 70% còn lại:</strong> Hoàn tất trước ngày khởi hành tối thiểu 5 ngày.</li>
                      <li>• <strong>Phương thức linh hoạt:</strong> Quét mã VietQR tức thì, thẻ ATM nội địa, Visa/Mastercard hoặc ví điện tử.</li>
                      <li>• <strong>Bảo mật giao dịch:</strong> Mã hóa chuẩn SSL 256-bit an toàn tuyệt đối.</li>
                    </ul>
                  </div>

                  {/* Policy 3: Cancellation */}
                  <div className="p-5 rounded-2xl bg-teal-50/50 dark:bg-slate-800/40 border border-teal-200/70 dark:border-slate-700">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                        <ArrowPathIcon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">Chính Sách Hoàn & Hủy Tour</h4>
                    </div>
                    <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      <li>• <strong>Hủy trước 15 ngày:</strong> Hoàn lại 100% tiền tour (không thu bất kỳ khoản phí nào).</li>
                      <li>• <strong>Hủy từ 7 - 14 ngày:</strong> Hoàn 70% tổng giá trị hợp đồng tour.</li>
                      <li>• <strong>Hủy từ 3 - 6 ngày:</strong> Hoàn 50% tổng giá trị tour.</li>
                      <li>• <strong>Trường hợp bất khả kháng:</strong> Bão, lũ, lệnh cấm cảng vụ: hoàn tiền 100% hoặc dời ngày khởi hành hoàn toàn miễn phí.</li>
                    </ul>
                  </div>

                  {/* Policy 4: Support & Documents */}
                  <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/40 border border-indigo-200/70 dark:border-slate-700">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                        <PhoneIcon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">Giấy Tờ Cần Thiết & Hotline 24/7</h4>
                    </div>
                    <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      <li>• <strong>Giấy tờ tùy thân:</strong> Bắt buộc mang theo CCCD/Hộ chiếu gốc (còn hạn) để khai báo với cảng vụ.</li>
                      <li>• <strong>Tổng đài hỗ trợ 24/7:</strong> <strong>0868 156 027</strong> (Hotline & Zalo chính thức).</li>
                      <li>• <strong>Email chăm sóc khách hàng:</strong> support@travelhub.vn.</li>
                      <li>• <strong>Địa chỉ văn phòng:</strong> 6/160 Tân Triều, Thanh Trì, Hà Nội.</li>
                    </ul>
                  </div>
                </div>
              </div>

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
            <div className="lg:col-span-1" ref={bookingRef}>
              <div className="sticky top-24 space-y-6">
                {/* Main Booking Card (Traveloka Standard Transparent Pricing) */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 sm:p-7 border border-blue-100 dark:border-slate-800 transition-colors">
                  {/* Traveloka Price Header */}
                  <div className="mb-5 pb-5 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <BoltIcon className="w-3.5 h-3.5" />
                        Giá tốt nhất hôm nay
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <ShieldCheckIcon className="w-3.5 h-3.5" />
                        0đ Phí Ẩn
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

                  {/* Quick Package Selector Pills (Traveloka Quick Switch) */}
                  <div className="mb-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                      <SparklesIcon className="w-4 h-4 text-orange-500" />
                      Gói dịch vụ đã chọn
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
                      {PACKAGE_OPTIONS.map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedPackage(pkg.id)}
                          className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
                            selectedPackage === pkg.id
                              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                              : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <div className="truncate">{pkg.name.replace('Gói ', '')}</div>
                          <div className="text-[10px] font-medium opacity-80">
                            {pkg.priceDelta === 0 ? 'Tiêu chuẩn' : pkg.priceDelta > 0 ? '+350k' : '-150k'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date & Guest Pickers */}
                  <div className="space-y-4 mb-5">
                    {/* Date Picker */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                        <CalendarDaysIcon className="w-4 h-4 text-blue-600" />
                        Ngày khởi hành
                      </label>
                      <input
                        type="date"
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
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">
                          Trẻ em (dưới 12 tuổi)
                        </label>
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          {formatPrice(pricePerChild)} ₫ (70%)
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
                    </div>
                  </div>

                  {/* Traveloka Transparent Price Breakdown */}
                  <div className="rounded-2xl bg-gray-50 dark:bg-slate-800/70 p-4 border border-gray-200/70 dark:border-slate-700/60 mb-5 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-slate-700">
                      <span className="text-xs font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1.5">
                        <BanknotesIcon className="w-4 h-4 text-blue-600" />
                        Bóc tách chi phí minh bạch
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Traveloka Style
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
                        <div className="text-[10px] text-gray-500 dark:text-slate-400">Đã bao gồm VAT & bảo hiểm</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                          {formatPrice(grandTotal)} ₫
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Traveloka Trust Badges */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-slate-300">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Xác nhận tức thì qua Email & SMS trong 5 phút</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-slate-300">
                      <ShieldCheckIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span>Miễn phí hủy trong 24h & hoàn tiền 100%</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-slate-300">
                      <CreditCardIcon className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span>Hỗ trợ VietQR quét mã tức thì & Thẻ quốc tế</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={handleBooking}
                      disabled={!selectedDate}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <CreditCardIcon className="w-5 h-5" />
                      <span>{selectedDate ? 'Đặt tour ngay' : 'Chọn ngày khởi hành để đặt'}</span>
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

                  {/* Social Proof */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
                      <FireIcon className="w-4 h-4 text-orange-500" />
                      <span><strong>2,147+</strong> khách đã đặt • Đang có <strong>3 khách</strong> xem tour này</span>
                    </div>
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
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg">
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      Chat ngay
                    </button>
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
                  const relatedImage = relatedTour.image || getDestinationImageUrl(relatedTour);
                  const relatedPrice = relatedTour.price || 0;
                  const relatedCode = `NDSGN${relatedTour.id?.toString().padStart(3, '0') || '000'}`;
                  
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
                          onClick={(e) => {
                            e.preventDefault();
                            setIsFavorite(!isFavorite);
                          }}
                          className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md"
                        >
                          {isFavorite ? (
                            <HeartIconSolid className="h-5 w-5 text-red-500" />
                          ) : (
                            <HeartIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          Tiết kiệm
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
                          {relatedTour.name}
                        </h3>
                        <div className="text-xs text-gray-600 mb-2 space-y-1">
                          <p className="flex items-center gap-1.5">
                            <MapPinIcon className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            Khởi hành: <span className="text-blue-600 font-medium">TP. Hồ Chí Minh</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <TicketIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            Mã: {relatedCode} • {relatedTour.duration || '6N5Đ'}
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

      {/* Enhanced Mobile sticky CTA with Add to Cart and Dark Mode */}
      {tour && (
        <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 shadow-[0_-8px_32px_rgba(0,0,0,0.15)] transition-colors">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-4 mb-2 text-xs text-gray-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                <span>Hủy miễn phí</span>
              </div>
              <div className="flex items-center gap-1">
                <LockClosedIcon className="w-4 h-4 text-blue-600" />
                <span>Thanh toán an toàn</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {tour.rating && (
                    <div className="flex items-center gap-1 text-amber-500">
                      <StarIconSolid className="w-3.5 h-3.5" />
                      <span className="font-bold text-gray-900 dark:text-white text-xs">{tour.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {tour.reviewCount && (
                    <span className="text-[11px] text-gray-400">({tour.reviewCount})</span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  {originalPrice && originalPrice > price ? (
                    <>
                      <span className="text-lg font-black text-blue-600 dark:text-blue-400">{formatPrice(price)} ₫</span>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)} ₫</span>
                    </>
                  ) : (
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">{formatPrice(price)} ₫</span>
                  )}
                  <span className="text-xs text-gray-400">/người</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="p-3 rounded-2xl border border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition active:scale-95"
                  title="Thêm vào giỏ"
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={scrollToBooking}
                  className="py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition active:scale-95 whitespace-nowrap"
                >
                  Đặt ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Photo Gallery */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-base sm:text-lg truncate max-w-xs sm:max-w-md">{tour.name}</span>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full text-white/90 font-medium">
                {currentImageIndex + 1} / {images.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowGallery(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo Area */}
          <div className="relative flex-1 flex items-center justify-center my-3 max-w-7xl mx-auto w-full overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={`${tour.name} - ${currentImageIndex + 1}`}
              className="max-h-[70vh] sm:max-h-[76vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all border border-white/20 shadow-xl"
                  title="Ảnh trước"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all border border-white/20 shadow-xl"
                  title="Ảnh tiếp theo"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pt-2 pb-1 max-w-7xl mx-auto w-full">
            {images.map((photo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  currentImageIndex === idx ? 'border-amber-400 scale-105 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
