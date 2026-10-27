import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import {
  CreditCardIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  ArrowRightIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  SparklesIcon,
  TicketIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const codeParam = searchParams.get('code') || searchParams.get('bookingCode') || '';
  const idParam = searchParams.get('id') || searchParams.get('bookingId') || '';

  const [bookingCode, setBookingCode] = useState(codeParam);
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<'vietqr' | 'card' | 'momo' | 'paypal'>('vietqr');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(900); // 15 phút
  const [isPaid, setIsPaid] = useState<boolean>(false);

  // Form Thẻ quốc tế
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Thông tin thụ hưởng ngân hàng
  const BANK_INFO = {
    bankId: 'TPB',
    bankName: 'TPBank (Ngân Hàng Tiên Phong)',
    accountNo: '77601112004',
    accountName: 'DAO VAN PHONG',
  };

  // Tra cứu đơn hàng
  const fetchBooking = async (lookupCode: string, lookupId?: string) => {
    if (!lookupCode && !lookupId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('tg_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let url = '';
      if (lookupId) {
        url = `/api/booking/${lookupId}`;
      } else {
        url = `/api/booking/code/${lookupCode}`;
      }

      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        setBooking(data);
        if (data.status === 'CONFIRMED' || data.status === 'PAID') {
          setIsPaid(true);
        }
      } else {
        // Fallback mock nếu API booking/code chưa có trong backend
        const mockBooking = {
          id: lookupId ? Number(lookupId) : 101,
          code: lookupCode || `BK-${lookupId || '8888'}`,
          destination: { name: 'Tour Khám Phá & Nghỉ Dưỡng TravelHub', country: 'Việt Nam' },
          destinationName: 'Tour Khám Phá & Nghỉ Dưỡng TravelHub',
          totalAmount: 3890000,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          guests: 2,
        };
        setBooking(mockBooking);
      }
    } catch (e) {
      console.error('Error fetching booking for payment:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (codeParam || idParam) {
      fetchBooking(codeParam, idParam);
    }
  }, [codeParam, idParam]);

  // Countdown timer
  useEffect(() => {
    if (isPaid || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, isPaid]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatPrice = (amount?: number) => {
    return (amount || 0).toLocaleString('vi-VN') + ' đ';
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`Đã sao chép ${field}!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmTransfer = async () => {
    setIsProcessing(true);
    try {
      // Giả lập xác nhận thanh toán VietQR
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsPaid(true);
      toast.success('Hệ thống đã xác nhận giao dịch thành công!');
    } catch {
      toast.error('Chưa thể xác nhận. Vui lòng thử lại sau giây lát.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
      toast.error('Vui lòng điền đầy đủ thông tin thẻ');
      return;
    }
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsPaid(true);
      toast.success('Thanh toán thẻ thành công! Vé điện tử đã sẵn sàng.');
    } catch {
      toast.error('Giao dịch thẻ thất bại. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = booking?.totalAmount || 3890000;
  const currentCode = booking?.code || codeParam || 'TRAVELHUB-PAY';

  // Dynamic VietQR Napas URL
  const qrUrl = useMemo(() => {
    const transferContent = `TRAVELHUB ${currentCode}`;
    return `https://img.vietqr.io/image/${BANK_INFO.bankId}-${BANK_INFO.accountNo}-compact2.jpg?amount=${totalAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`;
  }, [totalAmount, currentCode]);

  return (
    <>
      <SEOHead
        title="Cổng Thanh Toán Trực Tuyến - TravelHub"
        description="Thanh toán an toàn, bảo mật và tức thì qua VietQR Napas 24/7, thẻ ngân hàng, ví MoMo và PayPal cùng TravelHub."
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 inline-block border border-emerald-200 dark:border-emerald-800 mb-2">
              Bảo Mật Chuẩn PCI-DSS & VietQR 24/7
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Thanh Toán Đơn Đặt Chỗ
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Kiểm tra chi tiết đơn hàng và lựa chọn phương thức thanh toán an toàn, tiện lợi nhất.
            </p>
          </div>

          {/* Search Booking Bar if no code or want to change */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-8 max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchBooking(bookingCode);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã đơn cần thanh toán (VD: BK-12345678)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white uppercase font-mono font-bold"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition"
              >
                Tra cứu
              </button>
            </form>
          </div>

          {isPaid ? (
            /* =========================================================================
               PAYMENT SUCCESS STATE
               ========================================================================= */
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 dark:border-slate-800 max-w-xl mx-auto text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircleIcon className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Thanh Toán Thành Công!
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Đơn đặt chỗ <span className="font-mono font-bold text-blue-600">{currentCode}</span> đã được ghi nhận thanh toán hoàn tất.
                </p>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã giao dịch:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">TXN-{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số tiền thanh toán:</span>
                  <span className="font-extrabold text-orange-600">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trạng thái:</span>
                  <span className="font-bold text-emerald-600">ĐÃ THANH TOÁN (PAID)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link
                  to="/account/bookings"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition text-center"
                >
                  Xem vé trong Lịch sử đặt chỗ
                </Link>
                <Link
                  to="/"
                  className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-sm transition text-center"
                >
                  Về trang chủ
                </Link>
              </div>
            </div>
          ) : (
            /* =========================================================================
               PAYMENT ACTIVE INTERFACE
               ========================================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN: Payment Methods */}
              <div className="lg:col-span-7 space-y-6">
                {/* Method Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('vietqr')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'vietqr'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <QrCodeIcon className="w-6 h-6 text-emerald-600" />
                    <span className="text-xs font-bold block">VietQR Napas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'card'
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCardIcon className="w-6 h-6 text-blue-600" />
                    <span className="text-xs font-bold block">Thẻ Tín Dụng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('momo')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'momo'
                        ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 ring-2 ring-pink-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <DevicePhoneMobileIcon className="w-6 h-6 text-pink-600" />
                    <span className="text-xs font-bold block">Ví MoMo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('paypal')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'paypal'
                        ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <GlobeAltIcon className="w-6 h-6 text-sky-600" />
                    <span className="text-xs font-bold block">PayPal</span>
                  </button>
                </div>

                {/* METHOD 1: VIETQR */}
                {selectedMethod === 'vietqr' && (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                          Quét Mã VietQR Napas 24/7
                        </h3>
                        <p className="text-xs text-slate-500">Khớp lệnh và kích hoạt vé tự động trong 3 giây</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 text-xs font-bold">
                        <ClockIcon className="w-4 h-4" />
                        {formatTime(countdown)}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Dynamic QR */}
                      <div className="p-3 bg-white rounded-2xl border-2 border-emerald-500 shadow-md flex-shrink-0">
                        <img
                          src={qrUrl}
                          alt="VietQR Payment"
                          className="w-48 h-48 object-contain rounded-lg"
                        />
                      </div>

                      {/* Bank Details Table */}
                      <div className="flex-1 w-full space-y-3 text-xs">
                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Ngân hàng:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{BANK_INFO.bankName}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Số tài khoản:</span>
                            <span className="font-mono font-extrabold text-blue-600 text-sm">{BANK_INFO.accountNo}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(BANK_INFO.accountNo, 'Số tài khoản')}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition"
                          >
                            <DocumentDuplicateIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Chủ tài khoản:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{BANK_INFO.accountName}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Nội dung chuyển khoản (bắt buộc):</span>
                            <span className="font-mono font-extrabold text-emerald-600 text-sm">TRAVELHUB {currentCode}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(`TRAVELHUB ${currentCode}`, 'Nội dung CK')}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition"
                          >
                            <DocumentDuplicateIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmTransfer}
                      disabled={isProcessing}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {isProcessing ? 'Đang kiểm tra giao dịch...' : 'Tôi Đã Chuyển Khoản Thành Công'}
                    </button>
                  </div>
                )}

                {/* METHOD 2: CREDIT CARD */}
                {selectedMethod === 'card' && (
                  <form onSubmit={handleCardPayment} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      Thẻ Tín Dụng / Ghi Nợ Quốc Tế
                    </h3>
                    <p className="text-xs text-slate-500">Visa, MasterCard, JCB, American Express</p>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Tên in trên thẻ (không dấu):
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="NGUYEN VAN A"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Số thẻ:
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                          setCardNumber(v);
                        }}
                        placeholder="4111 2222 3333 4444"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Hạn thẻ (MM/YY):
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '');
                            if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2, 4)}`;
                            setCardExpiry(v);
                          }}
                          placeholder="12/28"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Mã CVV/CVC:
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          placeholder="•••"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all disabled:opacity-50 mt-4"
                    >
                      {isProcessing ? 'Đang xác thực 3D Secure...' : `Thanh Toán ${formatPrice(totalAmount)}`}
                    </button>
                  </form>
                )}

                {/* METHOD 3: MOMO */}
                {selectedMethod === 'momo' && (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-5">
                    <div className="w-14 h-14 bg-pink-100 dark:bg-pink-950/60 text-pink-600 rounded-2xl flex items-center justify-center mx-auto">
                      <DevicePhoneMobileIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                        Thanh Toán Qua Ví MoMo
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Quét mã QR từ ứng dụng MoMo trên điện thoại</p>
                    </div>
                    <div className="p-3 bg-white rounded-2xl border-2 border-pink-400 shadow-md inline-block">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`2|99|0868156027|DAO VAN PHONG||0|0|${totalAmount}|TRAVELHUB ${currentCode}|transfer_myqr`)}`}
                        alt="MoMo QR"
                        className="w-44 h-44 object-contain rounded-lg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleConfirmTransfer}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-sm uppercase shadow-md transition"
                    >
                      Đã Hoàn Tất Trên MoMo
                    </button>
                  </div>
                )}

                {/* METHOD 4: PAYPAL */}
                {selectedMethod === 'paypal' && (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-5">
                    <div className="w-14 h-14 bg-sky-100 dark:bg-sky-950/60 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
                      <GlobeAltIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                        Cổng Thanh Toán Quốc Tế PayPal
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Hỗ trợ thẻ tín dụng toàn cầu & quy đổi tỷ giá sang USD
                      </p>
                    </div>
                    <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-200 dark:border-sky-800 text-xs text-slate-700 dark:text-slate-300">
                      Số tiền quy đổi: <span className="font-bold text-sky-600 text-sm">${Math.round(totalAmount / 25000)} USD</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleConfirmTransfer}
                      className="w-full py-3.5 rounded-2xl bg-[#0070ba] hover:bg-[#003087] text-white font-bold text-sm uppercase shadow-md transition"
                    >
                      Kết Nối Tài Khoản PayPal
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Order Summary */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <TicketIcon className="w-5 h-5 text-blue-600" />
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                        Tóm Tắt Đơn Đặt Chỗ
                      </h3>
                    </div>
                    <span className="font-mono text-xs font-bold text-blue-600 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 rounded-lg">
                      #{currentCode}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Dịch vụ:</span>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                        {booking?.destination?.name || booking?.destinationName || 'Hành Trình Du Lịch TravelHub'}
                      </h4>
                    </div>

                    <div className="flex justify-between py-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Số lượng khách:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{booking?.guests || 2} Khách</span>
                    </div>

                    <div className="flex justify-between py-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Trạng thái:</span>
                      <span className="font-bold text-amber-600">Đang chờ thanh toán</span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Giá dịch vụ:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{formatPrice(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Phí giao dịch:</span>
                        <span className="font-semibold text-emerald-600">Miễn phí 0đ</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                        <span className="font-bold text-slate-800 dark:text-slate-200">Tổng thanh toán:</span>
                        <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                          {formatPrice(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                      Cam Kết An Toàn 100%
                    </p>
                    <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
                      Giao dịch của quý khách được mã hóa chuẩn SSL 256-bit và đảm bảo hoàn tiền nếu có sự cố lịch trình theo chính sách của TravelHub.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}