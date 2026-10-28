import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  UserIcon,
  BuildingOffice2Icon,
  SparklesIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import MapEmbed from '../components/MapEmbed';
import SEOHead from '../components/SEOHead';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Tư vấn đặt tour',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const branches = [
    {
      city: 'Hà Nội (Trụ sở chính)',
      badge: 'Headquarters',
      address: 'Tầng 8, Tòa nhà TravelHub Tower, 6/160 Tân Triều, Thanh Trì, Hà Nội',
      phone: '0868 156 027',
      email: 'phong@triennguyen.com',
      hours: '08:00 - 18:30 (Thứ 2 - Chủ Nhật)',
    },
    {
      city: 'TP. Hồ Chí Minh',
      badge: 'Chi nhánh Nam Bộ',
      address: 'Tầng 12, Tòa nhà Bitexco Financial, Số 2 Hải Triều, P. Bến Nghé, Quận 1, TP.HCM',
      phone: '0868 156 027',
      email: 'saigon@travelhub.vn',
      hours: '08:00 - 18:30 (Thứ 2 - Thứ 7)',
    },
    {
      city: 'Đà Nẵng',
      badge: 'Chi nhánh Miền Trung',
      address: 'Tầng 5, Tòa nhà Indochina Riverside, 74 Bạch Đằng, P. Hải Châu 1, Q. Hải Châu, Đà Nẵng',
      phone: '0868 156 027',
      email: 'danang@travelhub.vn',
      hours: '08:00 - 18:00 (Thứ 2 - Thứ 7)',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: formData.email,
          subject: formData.subject,
          message: `Khách hàng: ${formData.name}\nSố điện thoại: ${formData.phone}\nChuyên mục: ${formData.subject}\n\nNội dung:\n${formData.message}`,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: 'Tư vấn đặt tour', message: '' });
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(data.message || 'Có lỗi xảy ra trong quá trình gửi yêu cầu. Vui lòng liên hệ trực tiếp hotline.');
      }
    } catch (error) {
      console.error('Error submitting support form:', error);
      setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng gọi trực tiếp hotline 0868 156 027.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <SEOHead
        title="Trung Tâm Hỗ Trợ & Liên Hệ 24/7 - TravelHub"
        description="Tổng đài CSKH 24/7 TravelHub: 0868 156 027. Đội ngũ chuyên gia du lịch luôn sẵn sàng tư vấn tour, giải đáp thắc mắc và hỗ trợ đặt dịch vụ nhanh chóng."
        url="/contact"
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
        {/* =========================================================================
            1. LUXURY HERO BANNER - Cohesive Royal Navy & Gold TravelHub Palette
            ========================================================================= */}
        <section className="relative overflow-hidden bg-[#003580] text-white py-10 sm:py-12">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
                backgroundSize: '36px 36px',
              }}
            />
          </div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-blue-100 text-sm font-semibold mb-4">
              <ShieldCheckIcon className="h-5 w-5 text-amber-400" />
              <span>Trung Tâm Trợ Giúp & Chăm Sóc Khách Hàng TravelHub</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight">
              Chúng Tôi Luôn Sẵn Sàng <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">Đồng Hành Cùng Bạn</span>
            </h1>

            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Chọn kênh liên hệ phù hợp hoặc gửi yêu cầu qua biểu mẫu bên dưới.
            </p>
          </div>
        </section>

        {/* =========================================================================
            2. DIRECT CONTACT CHANNELS (Hotline, Zalo, AI Chat, Email)
            ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hotline Card */}
            <a
              href="tel:0868156027"
              className="group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 flex items-start gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <PhoneIcon className="h-7 w-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Hotline 24/7 Toàn Quốc</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">0868 156 027</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cước gọi miễn phí • Hỗ trợ khẩn cấp 24/7</p>
                <span className="inline-block mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  Gọi ngay bây giờ →
                </span>
              </div>
            </a>

            {/* Zalo & Chat Card */}
            <a
              href="https://zalo.me/0868156027"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 flex items-start gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center flex-shrink-0 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                <ChatBubbleLeftRightIcon className="h-7 w-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Zalo & Chat Chuyên Viên</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">0868 156 027</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Nhắn tin Zalo nhận lịch trình & báo giá tức thì</p>
                <span className="inline-block mt-3 text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
                  Mở Zalo nhắn tin →
                </span>
              </div>
            </a>

            {/* Email Card */}
            <a
              href="mailto:phong@triennguyen.com"
              className="group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 hover:border-amber-500 hover:shadow-2xl transition-all duration-300 flex items-start gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <EnvelopeIcon className="h-7 w-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Hòm Thư Điện Tử</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 break-all">phong@triennguyen.com</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gửi hợp đồng, đối tác & xuất hóa đơn VAT</p>
                <span className="inline-block mt-3 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  Gửi thư điện tử →
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* =========================================================================
            3. MAIN CONTENT: SUPPORT FORM + FAQ + CHATBOT ACCESS
            ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-wider">
                <PaperAirplaneIcon className="h-4 w-4" />
                <span>Tiếp Nhận Yêu Cầu Trực Tuyến</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
                Gửi Yêu Cầu Hỗ Trợ
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Quý khách vui lòng cung cấp thông tin bên dưới. Bộ phận chăm sóc khách hàng TravelHub sẽ xử lý và liên hệ lại trong thời gian sớm nhất.
              </p>

              {submitted && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <p className="text-emerald-800 dark:text-emerald-200 font-semibold text-sm">
                    Gửi yêu cầu thành công! Chuyên viên TravelHub đã tiếp nhận và sẽ liên hệ hỗ trợ bạn trong ít phút.
                  </p>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-200 text-sm font-semibold">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                      Họ và tên <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium transition-all"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium transition-all"
                        placeholder="0912 345 678"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                      Địa chỉ Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium transition-all"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                      Chủ đề cần hỗ trợ
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium transition-all"
                    >
                      <option value="Tư vấn đặt tour">Tư vấn đặt tour du lịch</option>
                      <option value="Xác nhận thanh toán">Xác nhận thanh toán & Vé</option>
                      <option value="Thay đổi / Hủy vé">Yêu cầu hoàn hủy / Đổi ngày</option>
                      <option value="Hợp tác doanh nghiệp">Hợp tác đại lý & Doanh nghiệp</option>
                      <option value="Khiếu nại dịch vụ">Góp ý & Khiếu nại dịch vụ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                    Nội dung chi tiết <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium transition-all resize-none"
                    placeholder="Quý khách vui lòng mô tả chi tiết thông tin tour cần đặt, ngày khởi hành, số lượng người hoặc vấn đề cần trợ giúp..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Đang Gửi Yêu Cầu...</span>
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-5 w-5" />
                      <span>Gửi Yêu Cầu Hỗ Trợ Ngay</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* AI Assistant Banner */}
              <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-blue-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300">
                    <SparklesIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Trợ Lý AI Du Lịch 24/7</h3>
                    <p className="text-xs text-blue-200">Phản hồi siêu tốc dưới 2 giây</p>
                  </div>
                </div>
                <p className="text-sm text-blue-100/90 leading-relaxed mb-4">
                  Cần lên lịch trình du lịch Đà Lạt, tìm khách sạn view biển Phú Quốc, hay kiểm tra giá vé máy bay? Hãy trò chuyện ngay với AI của TravelHub!
                </p>
                <Link
                  to="/chatbot"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-sm transition-all shadow-md"
                >
                  <span>Chat Ngay Với AI</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Working Hours & Commitments */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200/80 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-blue-600" />
                  <span>Cam Kết Thời Gian Phục Vụ</span>
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Tổng đài Hotline:</strong> Phục vụ 24/7/365, kể cả ngày lễ Tết.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Zalo Chuyên Viên:</strong> Phản hồi ngay trong vòng 3 phút.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Hỗ trợ hoàn hủy:</strong> Xử lý trong 24 giờ làm việc.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Bảo hiểm du lịch:</strong> Cung cấp hợp đồng số tức thì sau thanh toán.</span>
                  </li>
                </ul>

                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Xem giải đáp câu hỏi thường gặp?</span>
                  <Link to="/faq" className="text-xs font-bold text-blue-600 hover:underline">
                    Xem FAQ →
                  </Link>
                </div>
              </div>

              {/* Google Map Mini Frame */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <MapPinIcon className="h-5 w-5 text-rose-500" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Vị Trí Trụ Sở TravelHub Hà Nội</span>
                </div>
                <div className="rounded-2xl overflow-hidden h-48 border border-slate-200 dark:border-slate-700">
                  <MapEmbed query="6/160 Tân Triều, Thanh Trì, Hà Nội" title="Vị trí TravelHub" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. BRANCH OFFICES ACROSS VIETNAM (Hà Nội, TP.HCM, Đà Nẵng)
            ========================================================================= */}
        <section className="bg-slate-100/70 dark:bg-slate-900/50 py-16 border-t border-slate-200/60 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Hệ Thống Mạng Lưới Toàn Quốc</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 mb-3">
                Văn Phòng & Chi Nhánh TravelHub
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Quý khách có thể đến trực tiếp các văn phòng đại diện để được tư vấn và thanh toán trực tiếp.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {branches.map((branch, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200/80 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <BuildingOffice2Icon className="h-6 w-6" />
                    </div>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-bold rounded-full">
                      {branch.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">{branch.city}</h3>

                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-start gap-2.5">
                      <MapPinIcon className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <PhoneIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <a href={`tel:${branch.phone.replace(/\s+/g, '')}`} className="font-semibold text-slate-900 dark:text-white hover:text-blue-600">
                        {branch.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <EnvelopeIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>{branch.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <ClockIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>{branch.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
