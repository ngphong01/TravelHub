import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { ShieldCheckIcon, LockClosedIcon, KeyIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Chính sách Bảo mật - TravelHub"
        description="Chính sách bảo mật thông tin cá nhân và an toàn giao dịch tại nền tảng du lịch TravelHub."
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100 dark:border-emerald-800">
              <ShieldCheckIcon className="w-4 h-4" />
              Bảo Mật Tiêu Chuẩn Quốc Tế
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Chính Sách Bảo Mật TravelHub
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Cam kết bảo mật dữ liệu khách hàng theo tiêu chuẩn mã hóa SSL 256-bit và quy định pháp luật Việt Nam.
            </p>
          </div>

          {/* Content Body */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-black">1</span>
                Thông Tin Chúng Tôi Thu Thập
              </h2>
              <p>
                Để cung cấp dịch vụ đặt tour và vé du lịch nhanh chóng, TravelHub chỉ thu thập các thông tin tối thiểu cần thiết:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm">
                <li>Thông tin tài khoản: Họ tên, địa chỉ email, số điện thoại, mật khẩu mã hóa một chiều (bcrypt).</li>
                <li>Thông tin giao dịch: Mã đặt chỗ, lịch trình tour, số lượng khách và phương thức thanh toán.</li>
                <li>Dữ liệu kỹ thuật: Địa chỉ IP, trình duyệt nhằm phục vụ đối soát và ngăn chặn tấn công gian lận.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-black">2</span>
                Mục Đích Sử Dụng Dữ Liệu
              </h2>
              <p>
                Thông tin của bạn được sử dụng độc quyền cho các mục đích:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm">
                <li>Xác nhận đặt tour, xuất vé điện tử và gửi thông báo hành trình qua Email/SMS.</li>
                <li>Gửi thông báo cập nhật tình trạng giao dịch, hoàn tiền hoặc thay đổi lịch trình khẩn cấp.</li>
                <li>Hỗ trợ chăm sóc khách hàng 24/7 và giải quyết khiếu nại phát sinh.</li>
                <li>TravelHub tuyệt đối <strong>không bán, không trao đổi</strong> thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào vì mục đích quảng cáo rác.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-black">3</span>
                An Toàn Giao Dịch & Bảo Mật Thẻ
              </h2>
              <p>
                Toàn bộ dữ liệu thanh toán qua thẻ tín dụng/ghi nợ được xử lý qua cổng thanh toán bảo mật chuẩn PCI-DSS. Hệ thống TravelHub không lưu trữ số thẻ CVV/CVC của khách hàng trên cơ sở dữ liệu nội bộ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-black">4</span>
                Quyền Hạn Của Khách Hàng
              </h2>
              <p>
                Bạn có toàn quyền xem, chỉnh sửa thông tin cá nhân tại trang Cài đặt tài khoản hoặc gửi yêu cầu xóa tài khoản vĩnh viễn khỏi hệ thống bất cứ lúc nào qua email hỗ trợ của chúng tôi.
              </p>
            </section>

            <section className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bộ phận Bảo vệ Dữ liệu TravelHub: <strong className="text-emerald-600 dark:text-emerald-400">privacy@daophong.id.vn</strong>
              </p>
              <Link
                to="/"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs hover:from-emerald-600 hover:to-teal-600 transition shadow-md shadow-emerald-500/20 whitespace-nowrap"
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
