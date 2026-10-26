import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  DocumentTextIcon,
  LightBulbIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import AccountSidebar from "../../components/AccountSidebar";
import SEOHead from "../../components/SEOHead";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOk(false);

    if (!subject.trim() || !message.trim()) {
      setError("Vui lòng điền đầy đủ chủ đề và nội dung cần hỗ trợ");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('tg_token');
      const res = await fetch("/api/account/support", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ subject, message, category }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || d.message || "Gửi yêu cầu thất bại");
      }
      setOk(true);
      setSubject("");
      setMessage("");
      setCategory("general");
      setTimeout(() => setOk(false), 5000);
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err.message || "Có lỗi xảy ra trong quá trình xử lý yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'general', label: 'Tư vấn chung', icon: QuestionMarkCircleIcon },
    { value: 'booking', label: 'Đặt chỗ & Lịch trình', icon: DocumentTextIcon },
    { value: 'payment', label: 'Thanh toán & Hóa đơn', icon: EnvelopeIcon },
    { value: 'technical', label: 'Tài khoản & Kỹ thuật', icon: LightBulbIcon },
  ];

  return (
    <>
      <SEOHead
        title="Trung Tâm Hỗ Trợ Khách Hàng - TravelHub"
        description="Gửi yêu cầu hỗ trợ tới đội ngũ chuyên gia TravelHub. Xử lý khiếu nại, hoàn hủy vé, và tư vấn lịch trình 24/7."
        url="/account/support"
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <AccountSidebar />
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-[#00224f] via-[#003580] to-[#0f172a] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-blue-500/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 flex-shrink-0 border border-white/20">
                      <ChatBubbleLeftRightIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Dịch Vụ Khách Hàng 5 Sao</span>
                      <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Trung Tâm Hỗ Trợ & Khiếu Nại</h1>
                      <p className="text-sm text-blue-100/90 mt-1">Đội ngũ chuyên viên TravelHub cam kết phản hồi trong vòng 2-4 giờ</p>
                    </div>
                  </div>
                  <Link
                    to="/chatbot"
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
                  >
                    <SparklesIcon className="w-4 h-4" />
                    <span>Trợ Lý AI 24/7</span>
                  </Link>
                </div>
              </div>

              {/* Success Notification */}
              {ok && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl shadow-lg border border-emerald-300 dark:border-emerald-800 p-6 animate-fade-in">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/60 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-300">
                      <CheckCircleIcon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200 mb-1">Gửi yêu cầu hỗ trợ thành công!</h3>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-2">
                        Hệ thống đã tạo mã yêu cầu và chuyển tới chuyên viên phụ trách. Bạn sẽ nhận được thông báo phản hồi qua email.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <ClockIcon className="w-4 h-4" />
                        <span>Thời gian phản hồi cam kết: Dưới 4 giờ làm việc</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-rose-50 dark:bg-rose-950/40 rounded-2xl shadow-lg border border-rose-300 dark:border-rose-800 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/60 rounded-xl flex items-center justify-center flex-shrink-0 text-rose-600 dark:text-rose-300">
                      <ExclamationTriangleIcon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200 mb-1">Chưa gửi được yêu cầu</h3>
                      <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Column */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                    <span>Nội Dung Yêu Cầu Hỗ Trợ</span>
                  </h2>

                  <form onSubmit={submit} className="space-y-6">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                        Phân loại vấn đề
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categories.map((cat) => {
                          const Icon = cat.icon;
                          const isSelected = category === cat.value;
                          return (
                            <button
                              key={cat.value}
                              type="button"
                              onClick={() => setCategory(cat.value)}
                              className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all duration-200 ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-sm'
                                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className="text-xs sm:text-sm font-bold truncate">
                                {cat.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                        Tiêu đề yêu cầu <span className="text-rose-500">*</span>
                      </label>
                      <input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium transition-all"
                        placeholder="Ví dụ: Cần hỗ trợ thay đổi ngày khởi hành tour Đà Lạt..."
                        required
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                        Nội dung chi tiết <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={7}
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium transition-all resize-none"
                        placeholder="Quý khách vui lòng cung cấp mã đơn đặt chỗ (nếu có), số điện thoại và mô tả chi tiết vấn đề cần trợ giúp..."
                        required
                      />
                      <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                        <span>Cung cấp mã đơn hàng giúp chúng tôi xử lý nhanh gấp 2 lần</span>
                        <span>{message.length} ký tự</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || !subject.trim() || !message.trim()}
                      className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-4 px-6 rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Đang Gửi Yêu Cầu...</span>
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="w-5 h-5" />
                          <span>Gửi Yêu Cầu Hỗ Trợ Ngay</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Hotline Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200/80 dark:border-slate-800">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <PhoneIcon className="w-5 h-5 text-blue-600" />
                      <span>Kênh Hỗ Trợ Nhanh</span>
                    </h3>

                    <div className="space-y-3">
                      <a
                        href="tel:0868156027"
                        className="block p-3.5 bg-blue-50 dark:bg-blue-950/50 rounded-2xl border border-blue-200/80 dark:border-blue-900 hover:shadow-md transition-all"
                      >
                        <p className="text-xs font-bold text-blue-600 uppercase">Tổng đài 24/7</p>
                        <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">0868 156 027</p>
                        <p className="text-xs text-slate-500 mt-1">Cước gọi thông thường</p>
                      </a>

                      <a
                        href="https://zalo.me/0868156027"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3.5 bg-cyan-50 dark:bg-cyan-950/50 rounded-2xl border border-cyan-200/80 dark:border-cyan-900 hover:shadow-md transition-all"
                      >
                        <p className="text-xs font-bold text-cyan-600 uppercase">Zalo Chăm Sóc Khách Hàng</p>
                        <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">0868 156 027</p>
                        <p className="text-xs text-slate-500 mt-1">Chat trực tiếp ngay</p>
                      </a>
                    </div>
                  </div>

                  {/* FAQ Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-[#00224f] text-white rounded-3xl p-6 shadow-xl border border-blue-500/30">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center mb-3">
                      <QuestionMarkCircleIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2">Câu Hỏi Thường Gặp</h3>
                    <p className="text-xs text-blue-100/90 leading-relaxed mb-4">
                      Giải đáp nhanh về chính sách thanh toán VietQR, thẻ tín dụng, quy định hoàn tiền và đổi ngày khởi hành.
                    </p>
                    <Link
                      to="/faq"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all"
                    >
                      <span>Tra cứu FAQ ngay</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}