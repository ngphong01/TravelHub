import { 
  CreditCardIcon, 
  QrCodeIcon, 
  ShieldCheckIcon, 
  LockClosedIcon, 
  SparklesIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

export default function PaymentMethods() {
  const methods = [
    {
      id: 'vietqr',
      title: 'Chuyển Khoản Nhanh VietQR (Napas 24/7)',
      desc: 'Quét mã QR từ mọi ứng dụng ngân hàng tại Việt Nam (Vietcombank, Techcombank, MB Bank, BIDV...). Khớp lệnh và xác nhận đơn hàng tự động trong 3 giây.',
      badge: 'Khuyên Dùng • Phổ Biến Nhất',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      icon: QrCodeIcon,
      steps: ['Chọn phương thức VietQR tại trang Thanh toán', 'Mở app ngân hàng và quét mã QR hiển thị', 'Kiểm tra số tiền và xác nhận chuyển khoản']
    },
    {
      id: 'ewallet',
      title: 'Ví Điện Tử MoMo & ZaloPay',
      desc: 'Thanh toán tức thì chỉ bằng 1 chạm qua ứng dụng ví điện tử MoMo hoặc ZaloPay. Thường xuyên có mã giảm giá và hoàn tiền lên đến 50.000đ.',
      badge: 'Tiện Lợi • Hoàn Tiền',
      badgeColor: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
      icon: DevicePhoneMobileIcon,
      steps: ['Chọn ví MoMo hoặc ZaloPay', 'Quét mã thanh toán trên ứng dụng ví', 'Nhận thông báo đặt tour thành công ngay lập tức']
    },
    {
      id: 'vnpay',
      title: 'Cổng VNPAY-QR & Thẻ ATM Nội Địa',
      desc: 'Hỗ trợ thanh toán qua hơn 40 ngân hàng nội địa Việt Nam. An toàn tuyệt đối với mã OTP gửi về số điện thoại đăng ký.',
      badge: 'Liên Kết 40+ Ngân Hàng',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      icon: BuildingLibraryIcon,
      steps: ['Chọn cổng thanh toán VNPAY', 'Nhập thông tin thẻ ATM hoặc quét mã VNPAY-QR', 'Xác thực OTP ngân hàng gửi về SMS']
    },
    {
      id: 'international_cards',
      title: 'Thẻ Quốc Tế (Visa / MasterCard / JCB)',
      desc: 'Chấp nhận tất cả các loại thẻ thanh toán quốc tế phát hành tại Việt Nam và toàn cầu. Bảo mật chuẩn 3D-Secure phòng chống gian lận.',
      badge: 'Quốc Tế • Chuẩn 3D Secure',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      icon: CreditCardIcon,
      steps: ['Nhập số thẻ, tên in trên thẻ, ngày hết hạn và số CVV', 'Xác thực bảo mật 3D Secure (OTP ngân hàng)', 'Giao dịch được ghi nhận và gửi hóa đơn tức thì']
    },
    {
      id: 'paypal',
      title: 'Cổng Thanh Toán Quốc Tế PayPal',
      desc: 'Giải pháp lý tưởng dành cho du khách quốc tế hoặc kiều bào đặt tour tại Việt Nam. Hỗ trợ thanh toán an toàn bằng USD, EUR, AUD qua tài khoản PayPal.',
      badge: 'Thanh Toán Toàn Cầu',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
      icon: GlobeAltIcon,
      steps: ['Chọn cổng PayPal tại bước Thanh toán', 'Đăng nhập tài khoản PayPal và xác nhận thanh toán', 'Tự động quy đổi tỷ giá và xuất vé điện tử']
    }
  ];

  return (
    <>
      <SEOHead
        title="Các Hình Thức Thanh Toán Trực Tuyến - TravelHub"
        description="Tìm hiểu các hình thức thanh toán an toàn tại TravelHub: VietQR 24/7, MoMo, ZaloPay, VNPAY, Thẻ Visa/Mastercard và PayPal."
        url="/payment-methods"
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-900 text-white py-16 lg:py-24">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
                backgroundSize: '32px 32px'
              }}
            />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 border border-white/20 backdrop-blur-md rounded-full text-blue-200 text-sm font-semibold mb-6 shadow-sm">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-300 animate-pulse" />
              <span>Bảo Mật Giao Dịch Chuẩn Quốc Tế PCI-DSS</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-5 tracking-tight text-white">
              Hình Thức <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-200 to-teal-200">Thanh Toán</span>
            </h1>
            <p className="text-lg text-blue-100/90 max-w-2xl mx-auto font-light leading-relaxed mb-8">
              Hệ thống thanh toán đa kênh thông minh, nhanh chóng, minh bạch và an toàn 100% cho mọi du khách.
            </p>
          </div>
        </section>

        {/* Payment Gateways List */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="space-y-8">
            {methods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                            {method.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${method.badgeColor}`}>
                            {method.badge}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-3xl mb-4">
                          {method.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step Guides */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Các bước thực hiện:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {method.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security & Guarantee Box */}
          <div className="mt-16 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Cam Kết An Toàn & Bảo Mật Tuyệt Đối
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Chúng tôi áp dụng các tiêu chuẩn an ninh thanh toán số khắt khe nhất
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                <LockClosedIcon className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Mã Hóa SSL 256-Bit</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Mọi thông tin giao dịch thẻ và tài khoản đều được mã hóa bằng chứng chỉ bảo mật cao cấp nhất.
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                <ShieldCheckIcon className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Không Lưu Thông Tin Thẻ</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  TravelHub không lưu trữ mã PIN hay số CVV/CVC của quý khách trên bất kỳ máy chủ nào.
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                <CheckCircleIcon className="h-10 w-10 text-indigo-500 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Hoàn Tiền Minh Bạch</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Quy trình hoàn tiền tự động về đúng tài khoản nguồn trong trường hợp hủy tour theo quy định.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/25 transition-all text-sm"
              >
                <span>Khám phá các tour và đặt ngay</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
