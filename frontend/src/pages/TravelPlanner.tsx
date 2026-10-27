import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTours } from '../services/tour';
import { useCart } from '../contexts/CartContext';
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
  TruckIcon
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
  { id: 'da-nang', name: 'Đà Nẵng - Hội An', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80' },
  { id: 'ha-long', name: 'Vịnh Hạ Long', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80' },
  { id: 'phu-quoc', name: 'Đảo Ngọc Phú Quốc', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80' },
  { id: 'ninh-binh', name: 'Ninh Bình - Tràng An', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&q=80' },
  { id: 'da-lat', name: 'Đà Lạt Mộng Mơ', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
  { id: 'ha-noi', name: 'Thủ Đô Hà Nội', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80' },
  { id: 'sa-pa', name: 'Sa Pa - Fansipan', image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=600&q=80' },
  { id: 'nha-trang', name: 'Biển Nha Trang', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80' },
];

const getToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const formatPlannerDate = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })
    .format(new Date(`${value}T00:00:00`));

const formatPlanDay = (departureDate: string, day: number) => {
  const date = new Date(`${departureDate}T00:00:00`);
  date.setDate(date.getDate() + day - 1);
  return new Intl.DateTimeFormat('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }).format(date);
};

const normalizeForMatch = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function TravelPlanner() {
  const { addItem } = useCart();
  const [selectedDest, setSelectedDest] = useState(PRESET_DESTINATIONS[0].name);
  const [customDest, setCustomDest] = useState('');
  const [duration, setDuration] = useState(3);
  const [departureDate, setDepartureDate] = useState(getToday);
  const [budget, setBudget] = useState<'budget' | 'standard' | 'luxury'>('standard');
  const [travelers, setTravelers] = useState<'solo' | 'couple' | 'family' | 'friends'>('couple');
  const [travelerCount, setTravelerCount] = useState(2);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Biển & Nghỉ dưỡng', 'Ẩm thực']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);

  // Fetch real tours for recommendation
  const { data: toursData } = useQuery({
    queryKey: ['tours', 'featured-planner'],
    queryFn: () => getTours(),
  });

  const recommendedTours = (() => {
    if (!generatedPlan || !toursData?.length) return [];

    const destinationTerms = normalizeForMatch(generatedPlan.destination)
      .split(/[\s-]+/)
      .filter((term) => term.length >= 3);
    const matchingTours = toursData.filter((tour) => {
      const tags = Array.isArray(tour.tags) ? tour.tags.join(' ') : String(tour.tags || '');
      const searchableText = normalizeForMatch(`${tour.name} ${tour.destination?.name || ''} ${tags}`);
      return destinationTerms.some((term) => searchableText.includes(term));
    });

    return (matchingTours.length ? matchingTours : toursData)
      .slice()
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (b.rating || 0) - (a.rating || 0));
  })();

  const travelStyles = [
    'Biển & Nghỉ dưỡng',
    'Ẩm thực địa phương',
    'Di sản văn hóa',
    'Khám phá mạo hiểm',
    'Check-in sống ảo',
    'Thiên nhiên sinh thái',
  ];

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const handleGenerate = () => {
    const destName = customDest.trim() || selectedDest;
    if (!destName) {
      toast.error('Vui lòng chọn hoặc nhập điểm đến.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      // Budget multipliers
      const costPerDay = budget === 'budget' ? 850000 : budget === 'luxury' ? 2800000 : 1500000;
      const estimatedCostPerPerson = costPerDay * duration;
      const totalCost = estimatedCostPerPerson * travelerCount;

      const days: DayPlan[] = [];
      for (let i = 1; i <= duration; i++) {
        days.push({
          day: i,
          dateLabel: formatPlanDay(departureDate, i),
          title: i === 1 
            ? `Khởi hành, Check-in & Khám phá trung tâm ${destName}` 
            : i === duration 
            ? `Mua sắm đặc sản & Tạm biệt ${destName}` 
            : `Hành trình trải nghiệm danh thắng nổi tiếng ngày ${i}`,
          morning: {
            time: '08:00 - 11:30',
            activity: i === 1 ? 'Đáp chuyến bay / di chuyển đến khách sạn nhận phòng, nghỉ ngơi' : 'Khởi hành tham quan điểm di sản & ngắm cảnh bình minh tuyệt đẹp',
            place: `Điểm ngắm cảnh biểu tượng tại ${destName}`,
            tip: 'Nên đi sớm trước 8h30 để tránh nắng gắt và chụp ảnh không bị đông người',
          },
          lunch: {
            place: `Nhà hàng đặc sản địa phương ${destName}`,
            dish: 'Thưởng thức mâm cơm đặc sản truyền thống & hải sản tươi sống',
          },
          afternoon: {
            time: '14:00 - 17:30',
            activity: 'Trải nghiệm vui chơi giải trí, tắm biển hoặc check-in các điểm di tích danh thắng',
            place: `Khu du lịch & điểm trải nghiệm sinh thái ${destName}`,
            tip: 'Mang theo kem chống nắng, mũ rộng vành và chuẩn bị pin sạc dự phòng',
          },
          dinner: {
            place: 'Khu ẩm thực đêm ven biển / phố cổ',
            dish: 'Ẩm thực đường phố, tiệc nướng BBQ hải sản hoặc ẩm thực cung đình',
          },
          evening: {
            time: '19:30 - 22:00',
            activity: 'Đi dạo phố đêm, thưởng thức cafe view ngắm toàn cảnh thành phố về đêm',
            place: 'Phố đi bộ & Chợ đêm ẩm thực lưu niệm',
          },
        });
      }

      setGeneratedPlan({
        destination: destName,
        duration,
        departureDate,
        travelers: travelerCount,
        budgetLevel: budget === 'budget' ? 'Tiết kiệm' : budget === 'luxury' ? 'Cao cấp' : 'Tiêu chuẩn',
        estimatedCostPerPerson,
        totalEstimatedCost: totalCost,
        costBreakdown: {
          hotel: Math.round(totalCost * 0.38),
          food: Math.round(totalCost * 0.32),
          tickets: Math.round(totalCost * 0.18),
          transport: Math.round(totalCost * 0.12),
        },
        highlights: [
          `Lộ trình tối ưu thời gian di chuyển giữa các điểm tham quan tại ${destName}`,
          'Tích hợp các quán ăn ngon chuẩn vị người bản địa giới thiệu',
          'Thời gian biểu cân bằng giữa hoạt động năng động và nghỉ ngơi thư giãn',
          'Chi phí tính toán minh bạch, sát với giá thực tế thị trường',
        ],
        days,
        packingTips: [
          'CCCD / Hộ chiếu bản gốc còn hạn để check-in khách sạn và máy bay',
          'Trang phục thoáng mát kèm 1 áo khoác nhẹ khi đi đêm hoặc lên đèo',
          'Thuốc say tàu xe, thuốc tiêu hóa và xịt chống muỗi côn trùng',
          'Tiền mặt lẻ (50k, 100k) để gửi xe và ăn quà vặt tại chợ đêm',
        ],
      });

      setIsGenerating(false);
      toast.success('Đã tạo lịch trình du lịch thông minh thành công!');
    }, 1200);
  };

  const handleCopyItinerary = () => {
    if (!generatedPlan) return;
    const text = `LỊCH TRÌNH DU LỊCH ${generatedPlan.destination.toUpperCase()} (${generatedPlan.duration} NGÀY)\n` +
      `Khởi hành: ${formatPlannerDate(generatedPlan.departureDate)} | Số khách: ${generatedPlan.travelers}\n` +
      `Ngân sách dự kiến: ${generatedPlan.estimatedCostPerPerson.toLocaleString('vi-VN')} VNĐ/người (${generatedPlan.totalEstimatedCost.toLocaleString('vi-VN')} VNĐ cho cả nhóm)\n\n` +
      generatedPlan.days.map(d => `--- NGÀY ${d.day} (${d.dateLabel}): ${d.title} ---\n` +
        `• Sáng (${d.morning.time}): ${d.morning.activity} (${d.morning.place})\n` +
        `• Trưa: ${d.lunch.dish} tại ${d.lunch.place}\n` +
        `• Chiều (${d.afternoon.time}): ${d.afternoon.activity} (${d.afternoon.place})\n` +
        `• Tối: ${d.dinner.dish} | ${d.evening.activity}\n`
      ).join('\n') +
      `\nLên kế hoạch bởi TravelHub Trip Planner & Cost Estimator.`;

    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép lịch trình vào Clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 md:py-12 relative overflow-hidden transition-colors duration-300">
      <SEOHead
        title="Lập Kế Hoạch & Dự Toán Chi Phí Du Lịch - TravelHub"
        description="Công cụ thông minh lập lộ trình chi tiết từng ngày, dự toán chi phí trọn gói khách sạn, ăn uống, vé tham quan và đề xuất tour du lịch phù hợp."
        keywords="lập kế hoạch du lịch, dự toán chi phí du lịch, lịch trình du lịch, travel planner, tự túc du lịch"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Hero Header with Animated Background */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 p-8 md:p-12 text-center text-white shadow-2xl border border-indigo-800/40">
          <TravelAnimatedBackground
            className="z-0 opacity-40"
            intensity="vibrant"
            showDrifters={true}
          />
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-cyan-300 text-xs md:text-sm font-semibold border border-white/15 shadow-sm">
              <CalendarDaysIcon className="w-4 h-4 text-cyan-400" />
              Công Cụ Gợi Ý Lịch Trình & Chi Phí Thông Minh
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-cyan-200 to-indigo-200 bg-clip-text text-transparent tracking-tight">
              Lập Kế Hoạch & Dự Toán Chi Phí Du Lịch
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Hệ thống tự động tính toán lộ trình chi tiết từng ngày, dự toán ngân sách trọn gói (khách sạn, ẩm thực, vé vui chơi) và gợi ý các tour tối ưu nhất cho bạn.
            </p>
          </div>
        </div>

        {/* Input Form Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-10 border border-slate-200/80 dark:border-slate-800 space-y-8 transition-colors">
          
          {/* Step 1: Destination */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <MapPinIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              1. Chọn điểm đến bạn muốn khám phá:
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
                        ? 'border-cyan-600 dark:border-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/30 shadow-md ring-2 ring-cyan-400/50 scale-[1.02]'
                        : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-cyan-300 dark:hover:border-cyan-600'
                    }`}
                  >
                    <img
                      src={getAuthenticImage(dest.image, dest.name, 'destination')}
                      alt={dest.name}
                      className="w-full h-20 object-cover rounded-xl mb-2"
                      loading="lazy"
                      onError={(e) => {
                        handleImageError(e, dest.name, 'destination');
                      }}
                    />
                    <span className="font-semibold text-gray-900 dark:text-slate-100 text-sm block truncate">{dest.name}</span>
                    {isSelected && (
                      <span className="absolute top-4 right-4 bg-cyan-600 text-white rounded-full p-1 shadow">
                        <CheckCircleIcon className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <input
                type="text"
                value={customDest}
                onChange={(e) => setCustomDest(e.target.value)}
                placeholder="Hoặc nhập điểm đến khác (ví dụ: Mộc Châu, Côn Đảo, Quy Nhơn, Cần Thơ...)"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              />
            </div>
          </div>

          {/* Step 2: Duration, Budget, Travelers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-slate-800">
            {/* Duration */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-sm">
                <CalendarDaysIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                Thời gian chuyến đi:
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2.5 rounded-xl font-bold text-sm transition-all ${
                      duration === d
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {d}N
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Lựa chọn: {duration} ngày {duration > 1 ? `${duration - 1} đêm` : ''}</p>
              <div className="pt-1">
                <label htmlFor="departure-date" className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Ngày khởi hành</label>
                <input
                  id="departure-date"
                  type="date"
                  min={getToday()}
                  value={departureDate}
                  onChange={(event) => setDepartureDate(event.target.value || getToday())}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-gray-700 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-sm">
                <CurrencyDollarIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                Mức ngân sách:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'budget', label: 'Tiết kiệm' },
                  { key: 'standard', label: 'Tiêu chuẩn' },
                  { key: 'luxury', label: 'Cao cấp' },
                ].map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => setBudget(b.key as any)}
                    className={`py-2.5 px-2 rounded-xl font-semibold text-xs transition-all ${
                      budget === b.key
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {budget === 'budget' && 'Dưới 1 triệu VNĐ / ngày (Hostel, ăn vặt)'}
                {budget === 'standard' && 'Khoảng 1.5 triệu VNĐ / ngày (Khách sạn 3-4 sao)'}
                {budget === 'luxury' && 'Trên 2.8 triệu VNĐ / ngày (Resort 5 sao, VIP)'}
              </p>
            </div>

            {/* Travelers */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-sm">
                <UserGroupIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                Đi cùng ai:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'solo', label: 'Một mình' },
                  { key: 'couple', label: 'Cặp đôi' },
                  { key: 'family', label: 'Gia đình' },
                  { key: 'friends', label: 'Nhóm bạn' },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTravelers(t.key as any)}
                    className={`py-2.5 px-3 rounded-xl font-semibold text-xs transition-all ${
                      travelers === t.key
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <label htmlFor="traveler-count" className="block text-xs font-semibold text-gray-700 dark:text-slate-300 pt-1">Số lượng khách</label>
              <input
                id="traveler-count"
                type="number"
                min={1}
                max={20}
                value={travelerCount}
                onChange={(event) => setTravelerCount(Math.min(20, Math.max(1, Number(event.target.value) || 1)))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-gray-700 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Step 3: Styles */}
          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <label className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-sm">
              <HeartIcon className="w-5 h-5 text-rose-500" />
              Sở thích & Phong cách du lịch:
            </label>
            <div className="flex flex-wrap gap-2">
              {travelStyles.map((style) => {
                const active = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyle(style)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      active
                        ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-600 dark:border-cyan-500 text-cyan-700 dark:text-cyan-300 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 hover:from-cyan-700 hover:via-teal-700 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-base md:text-lg"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Hệ Thống Đang Tính Toán Lộ Trình & Chi Phí...</span>
                </>
              ) : (
                <>
                  <CalendarDaysIcon className="w-6 h-6" />
                  <span>Tạo lịch trình chuyến đi</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Area */}
        {generatedPlan && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Overview Banner */}
            <div className="bg-gradient-to-r from-cyan-800 via-teal-800 to-indigo-900 rounded-3xl shadow-2xl p-6 md:p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
                    <CheckCircleIcon className="w-4 h-4 text-amber-300" />
                    Kế hoạch đã sẵn sàng
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black">
                    {generatedPlan.destination} ({generatedPlan.duration} Ngày)
                  </h2>
                  <p className="text-cyan-100 text-sm mt-1">
                    Khởi hành {formatPlannerDate(generatedPlan.departureDate)} • Gói {generatedPlan.budgetLevel} • {generatedPlan.travelers} khách
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleCopyItinerary}
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
                  >
                    <ShareIcon className="w-4 h-4" />
                    Sao chép
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 bg-white text-teal-800 hover:bg-teal-50 font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition-all"
                  >
                    <PrinterIcon className="w-4 h-4" />
                    In lịch trình
                  </button>
                </div>
              </div>

              {/* Budget Breakdown Cards */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-cyan-100">Tổng chi phí dự kiến cho {generatedPlan.travelers} khách</p>
                <p className="text-2xl font-black">{generatedPlan.totalEstimatedCost.toLocaleString('vi-VN')} đ</p>
                <p className="text-xs text-cyan-100">~ {generatedPlan.estimatedCostPerPerson.toLocaleString('vi-VN')} đ/người</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl">
                  <p className="text-xs text-cyan-200 flex items-center gap-1">
                    <BuildingOfficeIcon className="w-3.5 h-3.5 text-cyan-300" />
                    Chỗ ở (38%)
                  </p>
                  <p className="text-lg font-bold">{generatedPlan.costBreakdown.hotel.toLocaleString('vi-VN')} đ</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl">
                  <p className="text-xs text-cyan-200 flex items-center gap-1">
                    <CakeIcon className="w-3.5 h-3.5 text-emerald-300" />
                    Ăn uống (32%)
                  </p>
                  <p className="text-lg font-bold">{generatedPlan.costBreakdown.food.toLocaleString('vi-VN')} đ</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl">
                  <p className="text-xs text-cyan-200 flex items-center gap-1">
                    <TicketIcon className="w-3.5 h-3.5 text-amber-300" />
                    Vé & Tour (18%)
                  </p>
                  <p className="text-lg font-bold">{generatedPlan.costBreakdown.tickets.toLocaleString('vi-VN')} đ</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl">
                  <p className="text-xs text-cyan-200 flex items-center gap-1">
                    <TruckIcon className="w-3.5 h-3.5 text-indigo-300" />
                    Di chuyển (12%)
                  </p>
                  <p className="text-lg font-bold">{generatedPlan.costBreakdown.transport.toLocaleString('vi-VN')} đ</p>
                </div>
              </div>
            </div>

            {/* Daily Timeline */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarDaysIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                Chi Tiết Lịch Trình Từng Ngày
              </h3>

              <div className="space-y-6">
                {generatedPlan.days.map((day) => (
                  <div key={day.day} className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/60 px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 bg-cyan-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
                          {day.day}
                        </span>
                        <h4 className="font-bold text-gray-900 dark:text-white text-base md:text-lg">{day.title}</h4>
                      </div>
                      <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-white dark:bg-slate-700 px-3 py-1 rounded-full shadow-sm">
                        Ngày {day.day} • {day.dateLabel}
                      </span>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                      {/* Morning */}
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                          <SunIcon className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">Buổi Sáng ({day.morning.time})</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{day.morning.activity}</p>
                          <p className="text-sm text-gray-600 dark:text-slate-300 flex items-center gap-1.5">
                            <MapPinIcon className="w-4 h-4 text-gray-400 dark:text-slate-500" /> {day.morning.place}
                          </p>
                          {day.morning.tip && (
                            <p className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 rounded-lg p-2 mt-1 flex items-center gap-1.5 border border-amber-200/50 dark:border-amber-900/50">
                              <LightBulbIcon className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                              <span>Mẹo: {day.morning.tip}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Lunch */}
                      <div className="flex gap-4 pl-12 border-l-2 border-dashed border-gray-200 dark:border-slate-750 ml-4 py-1">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                            <CakeIcon className="w-3.5 h-3.5" /> Bữa Trưa
                          </p>
                          <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{day.lunch.dish} tại <span className="font-bold">{day.lunch.place}</span></p>
                        </div>
                      </div>

                      {/* Afternoon */}
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
                          <ClockIcon className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide">Buổi Chiều ({day.afternoon.time})</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{day.afternoon.activity}</p>
                          <p className="text-sm text-gray-600 dark:text-slate-300 flex items-center gap-1.5">
                            <MapPinIcon className="w-4 h-4 text-gray-400 dark:text-slate-500" /> {day.afternoon.place}
                          </p>
                          {day.afternoon.tip && (
                            <p className="text-xs text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 rounded-lg p-2 mt-1 flex items-center gap-1.5 border border-cyan-200/50 dark:border-cyan-900/50">
                              <LightBulbIcon className="w-4 h-4 flex-shrink-0 text-cyan-600 dark:text-cyan-400" />
                              <span>Mẹo: {day.afternoon.tip}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Dinner & Evening */}
                      <div className="flex gap-4 pl-12 border-l-2 border-dashed border-gray-200 dark:border-slate-750 ml-4 py-1">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1">
                            <CakeIcon className="w-3.5 h-3.5" /> Bữa Tối & Đêm
                          </p>
                          <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{day.dinner.dish} tại <span className="font-bold">{day.dinner.place}</span></p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                            <ClockIcon className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                            {day.evening.time}: {day.evening.activity} ({day.evening.place})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TravelHub Recommended Tours */}
            {recommendedTours.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <TicketIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                      Tour phù hợp với kế hoạch của bạn
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Nếu không muốn tự túc, bạn có thể đặt ngay tour trọn gói có hướng dẫn viên</p>
                  </div>
                  <Link
                    to="/tours"
                    className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1"
                  >
                    Xem tất cả tour <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedTours.slice(0, 3).map((tour) => (
                    <div key={tour.id} className="border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={getAuthenticImage(tour.image, tour.name, 'tour')}
                          alt={tour.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            handleImageError(e, tour.name, 'tour');
                          }}
                        />
                        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg font-medium">
                          {tour.duration || '3N2Đ'}
                        </span>
                      </div>
                      <div className="p-4 space-y-3">
                        <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {tour.name}
                        </h4>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/60">
                          <div>
                            <span className="text-xs text-gray-400 dark:text-slate-500 block">Giá từ</span>
                            <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">
                              {(tour.price || 0).toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              addItem({
                                itemId: tour.id,
                                type: 'tour',
                                title: tour.name,
                                slug: tour.slug || `tour-${tour.id}`,
                                price: tour.price || 0,
                                originalPrice: tour.originalPrice ?? undefined,
                                image: tour.image ?? undefined,
                                date: generatedPlan.departureDate,
                                guests: generatedPlan.travelers,
                                duration: tour.duration,
                              });
                            }}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-3 py-2 rounded-xl text-xs shadow-md transition-all"
                          >
                            Thêm giỏ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packing & Preparation Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-3xl p-6 md:p-8 border border-amber-200/60 dark:border-amber-900/40 space-y-4">
              <h4 className="font-bold text-amber-900 dark:text-amber-200 text-lg flex items-center gap-2">
                <BookmarkSquareIcon className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                Hành Trang Cần Chuẩn Bị Cho Chuyến Đi
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-amber-800 dark:text-amber-200">
                {generatedPlan.packingTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm p-3 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
