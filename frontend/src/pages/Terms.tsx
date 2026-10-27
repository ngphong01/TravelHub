import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { DocumentTextIcon, ShieldCheckIcon, ScaleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function TermsPage() {
  return (
    <>
      <SEOHead
        title="Điều khoản Dịch vụ - TravelHub"
        description="Điều khoản và điều kiện sử dụng dịch vụ đặt tour, khách sạn và trải nghiệm du lịch tại TravelHub."
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4 border border-cyan-100 dark:border-cyan-800">
              <ScaleIcon className="w-4 h-4" />
              Chính Sách & Quy Định
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Điều Khoản Dịch Vụ TravelHub
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Cập nhật lần cuối: Tháng 10/2026 • Áp dụng cho mọi giao dịch đặt dịch vụ trên hệ thống TravelHub (daophong.id.vn)
            </p>
          </div>

          {/* Content Body */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-xs font-black">1</span>
                Quy Định Chung
              </h2>
              <p>
                Chào mừng bạn đến với TravelHub. Bằng việc truy cập, tạo tài khoản hoặc tiến hành đặt dịch vụ (bao gồm Tour du lịch, Khách sạn, Nhà hàng ẩm thực, Combo trọn gói) trên website <strong>daophong.id.vn</strong>, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ toàn bộ các điều khoản được nêu dưới đây.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-xs font-black">2</span>
                Đặt Dịch Vụ & Xác Nhận Đơn Hàng
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Khách hàng có trách nhiệm cung cấp thông tin liên hệ chính xác (Họ tên, Email, Số điện thoại) khi đặt tour để nhận vé điện tử và hỗ trợ khẩn cấp.</li>
                <li>Đơn đặt chỉ được coi là xác nhận thành công sau khi hệ thống TravelHub phát hành Mã đặt chỗ (Booking Code) và gửi thông báo xác nhận qua Email/SMS.</li>
                <li>Mọi hành vi can thiệp kỹ thuật nhằm làm thay đổi giá niêm yết của tour/dịch vụ đều bị coi là vi phạm nghiêm trọng và đơn hàng sẽ bị tự động hủy bỏ.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-xs font-black">3</span>
                Chính Sách Thanh Toán & Giá Cả
              </h2>
              <p>
                TravelHub hỗ trợ các phương thức thanh toán an toàn bao gồm Thẻ tín dụng/ghi nợ quốc tế (Visa, Mastercard), PayPal và Chuyển khoản ngân hàng nội địa qua VietQR. Giá niêm yết bằng Việt Nam Đồng (VNĐ) và đã bao gồm các loại thuế, phí dịch vụ cơ bản theo quy định.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-xs font-black">4</span>
                Chính Sách Hoàn Hủy & Đổi Lịch Trình
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Hủy trước 7 ngày khởi hành</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hoàn tiền 100% chi phí tour hoặc bảo lưu miễn phí trong 12 tháng.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Hủy từ 3 - 6 ngày trước</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hoàn tiền 50% chi phí tour hoặc đổi ngày có phụ phí điều chỉnh dịch vụ.</p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-xs font-black">5</span>
                Quyền & Trách Nhiệm Của TravelHub
              </h2>
              <p>
                TravelHub cam kết cung cấp dịch vụ đúng theo lịch trình đã công bố, đảm bảo quyền lợi bảo hiểm du lịch theo quy định. Trong các trường hợp bất khả kháng (thiên tai, bão lũ, chỉ đạo của cơ quan quản lý hàng hải/hàng không), TravelHub sẽ phối hợp linh hoạt để đảm bảo an toàn tối đa cho du khách.
              </p>
            </section>

            <section className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mọi thắc mắc cần hỗ trợ, vui lòng liên hệ hotline: <strong className="text-cyan-600 dark:text-cyan-400">1900 232389</strong> hoặc email <strong className="text-cyan-600 dark:text-cyan-400">support@daophong.id.vn</strong>
              </p>
              <Link
                to="/"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs hover:from-cyan-600 hover:to-teal-600 transition shadow-md shadow-cyan-500/20 whitespace-nowrap"
              >
                Quay Về Trang Chủ
              </Link>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
