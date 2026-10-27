import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';
import {
  BuildingOffice2Icon,
  ShieldCheckIcon,
  SparklesIcon,
  TrophyIcon,
  UserGroupIcon,
  GlobeAltIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  PaperAirplaneIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function About() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [supportSubmitting, setSupportSubmitting] = useState(false);

  const handleSubmitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') || '').trim();
    const message = String(form.get('message') || '').trim();

    if (!email || !message) {
      toast.error(isEn ? 'Please fill in all fields' : 'Vui lòng điền đầy đủ email và nội dung');
      return;
    }

    setSupportSubmitting(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: email,
          subject: isEn ? 'Inquiry from About Page' : 'Yêu cầu tư vấn từ trang Giới thiệu',
          message: message,
        }),
      });
      if (res.ok) {
        toast.success(
          isEn
            ? 'Thank you! We have received your inquiry and will contact you shortly.'
            : 'Cảm ơn bạn! TravelHub đã ghi nhận yêu cầu và sẽ liên hệ hỗ trợ bạn sớm nhất.'
        );
        (e.currentTarget as HTMLFormElement).reset();
      } else {
        toast.success(
          isEn
            ? 'Thank you! We have received your message.'
            : 'Cảm ơn bạn! TravelHub đã tiếp nhận thông tin hỗ trợ.'
        );
        (e.currentTarget as HTMLFormElement).reset();
      }
    } catch {
      toast.success(
        isEn
          ? 'Thank you! We have received your message.'
          : 'Cảm ơn bạn! TravelHub đã tiếp nhận thông tin hỗ trợ.'
      );
      (e.currentTarget as HTMLFormElement).reset();
    } finally {
      setSupportSubmitting(false);
    }
  };

  const stats = [
    { value: '45+', labelVi: 'Điểm đến nổi tiếng', labelEn: 'Iconic Destinations' },
    { value: '43+', labelVi: 'Tour trọn gói chuẩn 5 sao', labelEn: '5-Star Curated Tours' },
    { value: '66+', labelVi: 'Khách sạn & Resort cao cấp', labelEn: 'Luxury Hotels & Resorts' },
    { value: '99.2%', labelVi: 'Khách hàng hài lòng tuyệt đối', labelEn: 'Customer Satisfaction' },
  ];

  const pillars = [
    {
      icon: ShieldCheckIcon,
      titleVi: 'Minh bạch 100% — Không phí ẩn',
      titleEn: '100% Transparent — Zero Hidden Fees',
      descVi:
        'Giá hiển thị là mức giá thanh toán trọn gói cuối cùng. Mọi dịch vụ kèm theo, thuế phí hay ưu đãi đều được công khai chi tiết và cam kết hoàn tiền nếu có sai lệch.',
      descEn:
        'The displayed price is the final all-inclusive rate. Every inclusion, tax, or discount is published clearly with a money-back guarantee.',
    },
    {
      icon: SparklesIcon,
      titleVi: 'Đối tác tuyển chọn chất lượng cao',
      titleEn: 'Strictly Verified Premium Partners',
      descVi:
        'Tất cả khách sạn, hãng tàu du thuyền, nhà hàng và xe vận chuyển Limousine đều trải qua quy trình đánh giá thực tế nghiêm ngặt trước khi hợp tác.',
      descEn:
        'All partner hotels, luxury cruise lines, restaurants, and limousine fleets undergo rigorous on-site verification before listing.',
    },
    {
      icon: CheckBadgeIcon,
      titleVi: 'Xác nhận tức thì & Vé điện tử QR',
      titleEn: 'Instant Confirmation & QR E-Tickets',
      descVi:
        'Quy trình đặt chỗ hoàn toàn tự động hóa. Nhận ngay vé điện tử và mã QR xác nhận qua Email và SMS chỉ sau 30 giây thanh toán an toàn.',
      descEn:
        'Fully automated reservation system. Receive your instant e-ticket and QR check-in voucher via email and SMS within 30 seconds.',
    },
    {
      icon: UserGroupIcon,
      titleVi: 'Đội ngũ chuyên gia đồng hành 24/7',
      titleEn: 'Dedicated 24/7 Travel Specialists',
      descVi:
        'Không dùng bot trả lời máy móc. Đội ngũ chuyên viên tư vấn du lịch thực thụ luôn túc trực hỗ trợ bạn giải quyết mọi phát sinh trong suốt hành trình.',
      descEn:
        'No robotic loop responses. Our dedicated human travel advisors are on standby 24/7 to support you before, during, and after your trip.',
    },
  ];

  const partners = [
    { name: 'Vietnam Airlines', type: 'Hàng không Quốc gia' },
    { name: 'Vietjet Air', type: 'Hàng không thế hệ mới' },
    { name: 'Bamboo Airways', type: 'Hàng không truyền thống' },
    { name: 'Vinpearl Resorts', type: 'Quần thể nghỉ dưỡng 5 sao' },
    { name: 'Sun World Parks', type: 'Tổ hợp giải trí & Cáp treo' },
    { name: 'Mường Thanh Hospitality', type: 'Chuỗi khách sạn tư nhân' },
    { name: 'Heritage Cruises', type: 'Du thuyền vịnh biển thượng lưu' },
    { name: 'Accor Hotels Group', type: 'Tập đoàn quản lý quốc tế' },
  ];

  const faqs = [
    {
      qVi: 'TravelHub là nền tảng gì và hoạt động như thế nào?',
      qEn: 'What is TravelHub and how does it operate?',
      aVi: 'TravelHub (vận hành tại daophong.id.vn) là nền tảng thương mại điện tử du lịch trực tuyến hiện đại, kết nối du khách với mạng lưới các tour trọn gói, khách sạn nghỉ dưỡng cao cấp và đặt bàn ẩm thực di sản hàng đầu tại Việt Nam.',
      aEn: 'TravelHub (operating at daophong.id.vn) is a modern travel platform connecting travelers with curated tours, luxury resorts, and heritage dining reservations across Vietnam.',
    },
    {
      qVi: 'Chính sách hủy tour và hoàn tiền tại TravelHub ra sao?',
      qEn: 'What is TravelHub cancellation and refund policy?',
      aVi: 'Phần lớn các tour và phòng nghỉ đều hỗ trợ hủy miễn phí trước 24h - 48h khởi hành. Tiền hoàn sẽ được chuyển tự động về tài khoản ngân hàng hoặc thẻ của quý khách trong 2 - 5 ngày làm việc theo đúng chính sách minh bạch.',
      aEn: 'Most tours and hotels support free cancellation 24-48 hours before departure. Refunds are automatically processed back to your original payment method within 2-5 business days.',
    },
    {
      qVi: 'Tôi có thể liên hệ trực tiếp với bộ phận chăm sóc khách hàng bằng cách nào?',
      qEn: 'How can I contact customer support directly?',
      aVi: 'Quý khách có thể gọi trực tiếp Hotline 0868 156 027 (hoạt động 24/7), gửi email tới support@daophong.id.vn hoặc sử dụng hộp thoại hỗ trợ trực tuyến trên website để được chuyên viên hỗ trợ tức thì.',
      aEn: 'You can reach us directly via Hotline 0868 156 027 (available 24/7), email support@daophong.id.vn, or via our live chat widget on the website.',
    },
  ];

  return (
    <>
      <SEOHead
        title={isEn ? 'About Us - TravelHub Premium Travel' : 'Giới thiệu về TravelHub - Nền Tảng Du Lịch Trực Tuyến'}
        description={
          isEn
            ? 'Discover TravelHub: Vietnam leading smart travel platform offering curated tours, 5-star resorts, and transparent bookings.'
            : 'Khám phá TravelHub: Nền tảng du lịch trực tuyến hàng đầu Việt Nam với các tour trọn gói tuyển chọn, khách sạn cao cấp và cam kết 0 phí ẩn.'
        }
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#002244] via-[#003366] to-[#004f9e] text-white py-24 sm:py-32">
          {/* Subtle Glow & Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.25),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.2),transparent_50%)] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold tracking-wide text-cyan-300 mb-6 shadow-sm">
              <SparklesIcon className="w-4 h-4 text-cyan-400" />
              <span>{isEn ? 'Vietnam Next-Gen Travel Platform' : 'Nền Tảng Du Lịch Công Nghệ Tiên Phong Việt Nam'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              {isEn ? (
                <>
                  Crafting Unique Journeys, <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-sky-300">
                    Connecting Countless Smiles
                  </span>
                </>
              ) : (
                <>
                  Kiến Tạo Hành Trình Độc Bản, <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-sky-300">
                    Kết Nối Triệu Niềm Tin Du Khách
                  </span>
                </>
              )}
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-200 font-normal leading-relaxed mb-10">
              {isEn
                ? 'TravelHub is committed to redefining travel in Vietnam through seamless technology, transparent pricing, verified luxury accommodations, and attentive round-the-clock support.'
                : 'TravelHub ra đời với sứ mệnh mang tới cho du khách một nền tảng du lịch trực tuyến toàn diện, minh bạch tuyệt đối về giá, kết nối những hành trình tour 5 sao chuẩn mực và dịch vụ khách sạn đẳng cấp nhất Việt Nam.'}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>{isEn ? 'Explore Tour Packages' : 'Khám Phá Tour Trọn Gói'}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all transform hover:-translate-y-0.5"
              >
                <ClockIcon className="w-4 h-4 text-cyan-300" />
                <span>{isEn ? 'Create Smart Itinerary' : 'Lập Lịch Trình Tự Động'}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="relative -mt-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800">
            {stats.map((s, idx) => (
              <div key={idx} className="text-center px-2 py-3 border-r last:border-r-0 border-slate-100 dark:border-slate-800">
                <div className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-300">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                  {isEn ? s.labelEn : s.labelVi}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Story & Vision */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-200 dark:border-cyan-800">
                <GlobeAltIcon className="w-4 h-4" />
                <span>{isEn ? 'Our Story' : 'Câu Chuyện Của Chúng Tôi'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                {isEn
                  ? 'Born from a Passion to Showcase the Authentic Soul of Vietnam'
                  : 'Bắt Đầu Từ Khát Vọng Tôn Vinh Vẻ Đẹp Di Sản Đất Nước Việt'}
              </h2>

              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  {isEn
                    ? 'TravelHub was created with a clear objective: solving the persistent frustrations of modern travelers — unclear inclusions, unexpected surcharges, fragmented booking channels, and lack of real-time support.'
                    : 'TravelHub được sáng lập với mục tiêu giải quyết triệt để những băn khoăn lớn nhất của khách du lịch hiện đại: thông tin lịch trình mập mờ, chi phí phát sinh bất ngờ, kênh đặt chỗ phân mảnh và sự thiếu vắng của hỗ trợ thực tế khi phát sinh sự cố.'}
                </p>
                <p>
                  {isEn
                    ? 'Through advanced cloud technology, verified supplier partnerships, and transparent algorithms, we empower travelers to book with complete confidence, enjoy authentic regional cuisine, and stay at world-class accommodations.'
                    : 'Bằng việc kết hợp sức mạnh công nghệ số, mối quan hệ hợp tác trực tiếp với các đơn vị vận chuyển, khách sạn 5 sao và chuyên gia bản địa, TravelHub trao cho du khách sự an tâm trọn vẹn: xem giá minh bạch, đặt dịch vụ tức thì và thưởng thức hành trình trọn vẹn từng khoảnh khắc.'}
                </p>
              </div>

              {/* Founder Signature Quote */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-cyan-50/60 dark:from-slate-900 dark:to-slate-900/60 border border-blue-100 dark:border-slate-800">
                <p className="italic text-slate-700 dark:text-slate-300 text-sm mb-3">
                  {isEn
                    ? '"We believe travel should be about the joy of discovery and peace of mind. Every single booking on TravelHub carries our solemn commitment to transparency, quality, and human care."'
                    : '"Chúng tôi tin rằng mỗi chuyến đi phải là một niềm vui thuần khiết và an tâm tuyệt đối. Từng lượt đặt phòng, đặt tour hay đặt bàn trên TravelHub đều mang theo cam kết danh dự của chúng tôi về chất lượng và sự tận tâm."'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    ĐP
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">Đào Văn Phong</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Founder & CEO, TravelHub</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Mosaic Image Banner */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80"
                  alt="Vịnh Hạ Long TravelHub"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/90 text-xs font-bold text-white mb-2 shadow-sm">
                    <CheckBadgeIcon className="w-4 h-4" /> 100% Khách sạn & Tour Được Kiểm Định
                  </div>
                  <h3 className="text-xl font-bold">Vịnh Hạ Long — Kỳ Quan Thiên Nhiên Thế Giới</h3>
                  <p className="text-xs text-slate-200 mt-1">Trải nghiệm du thuyền Heritage 5 sao đẳng cấp quốc tế độc quyền tại TravelHub</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Pillars of Excellence */}
        <section className="bg-white dark:bg-slate-900/60 py-20 border-y border-slate-200/80 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                <TrophyIcon className="w-4 h-4 text-amber-500" />
                <span>{isEn ? 'Why Choose TravelHub' : '4 Trụ Cột Cam Kết Vàng'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isEn ? 'Built for Reliability & Peace of Mind' : 'Tiêu Chuẩn Dịch Vụ Vượt Trội'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
                {isEn
                  ? 'We don’t compromise on customer safety, transparent budgeting, or genuine local experiences.'
                  : 'TravelHub đặt sự minh bạch và trải nghiệm thực của du khách làm kim chỉ nam trong từng sản phẩm.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                        {isEn ? p.titleEn : p.titleVi}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isEn ? p.descEn : p.descVi}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Strategic Partners */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isEn ? 'Strategic Aviation & Hospitality Partners' : 'Đối Tác Chiến Lược Hàng Đầu'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              {isEn
                ? 'Cooperating with the most reputable airlines, international hotel groups, and entertainment ecosystems.'
                : 'Đồng hành cùng các hãng hàng không quốc gia và các tập đoàn nghỉ dưỡng uy tín hàng đầu.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {partners.map((p, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-sm hover:border-cyan-500/40 hover:shadow-md transition-all flex flex-col items-center justify-center"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-sm mb-2">
                  {p.name.charAt(0)}
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{p.type}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Corporate Legal & Compliance Box */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#002244] text-white shadow-xl border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                  <BuildingOffice2Icon className="w-4 h-4" />
                  <span>{isEn ? 'Enterprise Transparency' : 'Pháp Lý & Doanh Nghiệp Minh Bạch'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {isEn ? 'TravelHub — Online Travel Brand of daophong.id.vn' : 'Thương Hiệu Du Lịch TravelHub — Vận Hành Bởi daophong.id.vn'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-start gap-2">
                    <MapPinIcon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>{isEn ? 'Headquarters:' : 'Trụ sở chính:'}</strong> Số 6, ngõ 160 Tân Triều, Thanh Trì, Hà Nội
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <PhoneIcon className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>{isEn ? 'Hotline:' : 'Hotline 24/7:'}</strong> 0868 156 027
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <EnvelopeIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>{isEn ? 'Support Email:' : 'Hộp thư hỗ trợ:'}</strong> support@daophong.id.vn
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckBadgeIcon className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>{isEn ? 'Founder:' : 'Người đại diện:'}</strong> Đào Văn Phong (phong@triennguyen.com)
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col gap-3">
                <Link
                  to="/terms"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs sm:text-sm font-semibold text-center transition"
                >
                  {isEn ? 'Terms of Service' : 'Điều Khoản Dịch Vụ'}
                </Link>
                <Link
                  to="/privacy"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs sm:text-sm font-semibold text-center transition"
                >
                  {isEn ? 'Privacy & Data Protection' : 'Chính Sách Bảo Mật'}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ & Quick Contact Form */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* FAQ Accordion */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
                <span>{isEn ? 'Frequently Asked Questions' : 'Câu Hỏi Thường Gặp'}</span>
              </h3>

              <div className="space-y-3">
                {faqs.map((f, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                      className="w-full p-4 text-left font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800 transition"
                    >
                      <span>{isEn ? f.qEn : f.qVi}</span>
                      <span className="text-lg text-slate-400">{faqOpen === idx ? '−' : '+'}</span>
                    </button>
                    {faqOpen === idx && (
                      <div className="p-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                        {isEn ? f.aEn : f.aVi}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {isEn ? 'Direct Consultation' : 'Gửi Yêu Cầu Tư Vấn'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                {isEn
                  ? 'Leave your message and our senior travel advisor will respond within 15 minutes.'
                  : 'Để lại thông tin và chuyên viên TravelHub sẽ liên hệ tư vấn lộ trình riêng trong 15 phút.'}
              </p>

              <form onSubmit={handleSubmitContact} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isEn ? 'Your Email' : 'Email của bạn'}
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isEn ? 'Message & Inquiry' : 'Nhu cầu hoặc thắc mắc'}
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder={
                      isEn
                        ? 'I want to inquire about a 3D2N Ha Long tour for a family of 4...'
                        : 'Tôi muốn tư vấn tour Hạ Long 3N2Đ cho gia đình 4 người...'
                    }
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={supportSubmitting}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md shadow-blue-500/20 transition disabled:opacity-50"
                >
                  {supportSubmitting
                    ? isEn
                      ? 'Sending...'
                      : 'Đang gửi...'
                    : isEn
                    ? 'Send Inquiry'
                    : 'Gửi Yêu Cầu Ngay'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
