import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getActivePromos } from '../services/promo';
import { 
  TicketIcon, 
  ClockIcon, 
  TagIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  SparklesIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightIcon,
  FireIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import Skeleton from '../components/Skeleton';
import SEOHead from '../components/SEOHead';

export default function PromoCodes() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'percent' | 'fixed' | 'expiring'>('all');

  const { data: promos, isLoading } = useQuery({
    queryKey: ['promos', 'active'],
    queryFn: () => getActivePromos(50),
  });

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDiscount = (type: string, value: number) => {
    return type === 'PERCENTAGE' ? `${value}%` : `${value.toLocaleString('vi-VN')}đ`;
  };

  const isExpiringSoon = (validUntil: string) => {
    const daysUntilExpiry = Math.ceil((new Date(validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  const activePromos = promos?.filter(p => p.active && !isExpired(p.validUntil)) || [];
  const expiredPromos = promos?.filter(p => isExpired(p.validUntil)) || [];

  const filteredPromos = activePromos.filter(p => {
    if (filterTab === 'percent') return p.discountType === 'PERCENTAGE';
    if (filterTab === 'fixed') return p.discountType !== 'PERCENTAGE';
    if (filterTab === 'expiring') return isExpiringSoon(p.validUntil);
    return true;
  });

  return (
    <>
      <SEOHead
        title="Kho Voucher & Mã Giảm Giá Du Lịch - TravelHub"
        description="Tổng hợp mã giảm giá tour, khách sạn, vé vui chơi mới nhất hôm nay. Sao chép mã và nhận ưu đãi đặt tour lên đến 50% cùng TravelHub."
        url="/promo-codes"
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white py-16 lg:py-24">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
                backgroundSize: '32px 32px'
              }}
            />
          </div>
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 border border-white/20 backdrop-blur-md rounded-full text-blue-200 text-sm font-semibold mb-6 shadow-sm">
              <SparklesIcon className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>Kho Ưu Đãi Độc Quyền TravelHub 2026</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-5 tracking-tight text-white">
              Săn Mã Giảm Giá <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-blue-200">Du Lịch Hôm Nay</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/90 max-w-2xl mx-auto font-light leading-relaxed mb-8">
              Lưu ngay voucher đặt tour trọn gói, phòng khách sạn và vé tham quan với mức chiết khấu cực sốc.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/10">
              <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="text-2xl font-black text-amber-300">{activePromos.length}+</div>
                <div className="text-xs text-blue-200 mt-0.5">Mã đang mở dùng</div>
              </div>
              <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="text-2xl font-black text-emerald-300">50%</div>
                <div className="text-xs text-blue-200 mt-0.5">Mức giảm cao nhất</div>
              </div>
              <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="text-2xl font-black text-cyan-300">100%</div>
                <div className="text-xs text-blue-200 mt-0.5">Áp dụng tức thì</div>
              </div>
              <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="text-2xl font-black text-rose-300">0đ</div>
                <div className="text-xs text-blue-200 mt-0.5">Phí nhận mã</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  filterTab === 'all'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Tất cả ưu đãi ({activePromos.length})
              </button>
              <button
                onClick={() => setFilterTab('percent')}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  filterTab === 'percent'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Giảm theo %
              </button>
              <button
                onClick={() => setFilterTab('fixed')}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  filterTab === 'fixed'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Giảm tiền mặt (đ)
              </button>
              <button
                onClick={() => setFilterTab('expiring')}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  filterTab === 'expiring'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Sắp hết hạn 🔥
              </button>
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400">
              Đang hiển thị <span className="font-bold text-slate-900 dark:text-white">{filteredPromos.length}</span> voucher khả dụng
            </div>
          </div>

          {/* Skeleton Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                  <Skeleton className="h-6 w-1/3 rounded-lg" />
                  <Skeleton className="h-10 w-2/3 rounded-lg" />
                  <Skeleton className="h-4 w-1/2 rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredPromos.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
                <TicketIcon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Chưa tìm thấy mã phù hợp</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                Vui lòng thử chọn danh mục khác hoặc quay lại vào khung giờ vàng tiếp theo.
              </p>
              <button
                onClick={() => setFilterTab('all')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition-all"
              >
                Xem tất cả mã
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPromos.map((promo) => {
                const expiringSoon = isExpiringSoon(promo.validUntil);
                const isCopied = copiedCode === promo.code;
                const percentUsed = promo.usageLimit 
                  ? Math.min(100, Math.round((promo.usedCount / promo.usageLimit) * 100))
                  : null;

                return (
                  <div
                    key={promo.id}
                    className={`relative bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl border transition-all duration-300 flex flex-col sm:flex-row overflow-hidden group hover:-translate-y-1 ${
                      expiringSoon
                        ? 'border-amber-300 dark:border-amber-700/60 ring-1 ring-amber-300/50'
                        : 'border-slate-200/90 dark:border-slate-800'
                    }`}
                  >
                    {/* Left Coupon Notch / Ribbon Panel */}
                    <div className="sm:w-44 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-6 text-white flex flex-col justify-between items-center text-center relative overflow-hidden">
                      <div className="absolute -top-12 -left-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                      
                      <div className="w-full flex justify-between items-center text-xs text-blue-200">
                        <span className="font-semibold tracking-wider uppercase">TravelHub</span>
                        {expiringSoon && (
                          <span className="flex items-center gap-0.5 text-amber-300 font-bold">
                            <FireIcon className="h-3.5 w-3.5" />
                            Gấp
                          </span>
                        )}
                      </div>

                      <div className="my-3">
                        <div className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-sm">
                          {formatDiscount(promo.discountType, promo.discountValue)}
                        </div>
                        <div className="text-xs uppercase tracking-wider font-semibold text-blue-100 mt-1">
                          {promo.discountType === 'PERCENTAGE' ? 'Mã Chiết Khấu' : 'Giảm Tiền Mặt'}
                        </div>
                      </div>

                      <div className="text-xs text-blue-200 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full font-medium w-full truncate">
                        {promo.minAmount ? `Từ ${(promo.minAmount / 1000).toLocaleString('vi-VN')}k` : 'Mọi đơn đặt'}
                      </div>
                    </div>

                    {/* Perforation Divider (Hidden on small, visible on sm+) */}
                    <div className="hidden sm:flex flex-col justify-between items-center relative w-0 z-10">
                      <div className="w-5 h-5 bg-slate-50 dark:bg-slate-950 rounded-full -translate-x-1/2 -mt-2.5 border-b border-slate-200 dark:border-slate-800 transition-colors" />
                      <div className="h-full border-r-2 border-dashed border-slate-200 dark:border-slate-800" />
                      <div className="w-5 h-5 bg-slate-50 dark:bg-slate-950 rounded-full -translate-x-1/2 -mb-2.5 border-t border-slate-200 dark:border-slate-800 transition-colors" />
                    </div>

                    {/* Right Coupon Body */}
                    <div className="flex-1 p-6 flex flex-col justify-between bg-white dark:bg-slate-900">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-snug">
                            {promo.code} - Giảm {formatDiscount(promo.discountType, promo.discountValue)}
                          </h3>
                          {expiringSoon && (
                            <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full whitespace-nowrap">
                              Sắp hết hạn
                            </span>
                          )}
                        </div>

                        {/* Rules / Conditions */}
                        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                          {promo.minAmount && (
                            <div className="flex items-center gap-1.5">
                              <TagIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              <span>Đơn tối thiểu: <strong className="text-slate-700 dark:text-slate-300">{promo.minAmount.toLocaleString('vi-VN')} đ</strong></span>
                            </div>
                          )}
                          {promo.maxDiscount && (
                            <div className="flex items-center gap-1.5">
                              <SparklesIcon className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                              <span>Giảm tối đa: <strong className="text-slate-700 dark:text-slate-300">{promo.maxDiscount.toLocaleString('vi-VN')} đ</strong></span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <ClockIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            <span>HSD: {formatDate(promo.validUntil)}</span>
                          </div>
                        </div>

                        {/* Quota Progress Bar */}
                        {promo.usageLimit && (
                          <div className="mb-4">
                            <div className="flex justify-between items-center text-xs mb-1">
                              <span className="text-slate-500 dark:text-slate-400">Đã sử dụng</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {promo.usedCount} / {promo.usageLimit} ({percentUsed}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  (percentUsed || 0) > 85 ? 'bg-rose-500' : 'bg-blue-600'
                                }`}
                                style={{ width: `${percentUsed}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <button
                          onClick={() => copyToClipboard(promo.code)}
                          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            isCopied
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <ClipboardDocumentCheckIcon className="h-4 w-4" />
                              <span>Đã sao chép!</span>
                            </>
                          ) : (
                            <>
                              <span className="font-mono tracking-wider">{promo.code}</span>
                              <span className="text-xs font-normal opacity-70">(Sao chép)</span>
                            </>
                          )}
                        </button>

                        <Link
                          to="/tours"
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all whitespace-nowrap"
                        >
                          <span>Dùng ngay</span>
                          <ArrowRightIcon className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Guide Section */}
          <div className="mt-16 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full mb-3">
                <InformationCircleIcon className="h-4 w-4" />
                Hướng dẫn tận dụng ưu đãi
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Cách Áp Dụng Mã Giảm Giá Tại TravelHub
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl mb-4 shadow-lg shadow-blue-500/20">
                  1
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Chọn & Sao Chép Mã</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Bấm nút sao chép trên voucher phù hợp với nhu cầu du lịch hoặc đặt phòng của bạn.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl mb-4 shadow-lg shadow-indigo-500/20">
                  2
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Chọn Tour & Đặt Chỗ</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Lựa chọn hành trình yêu thích và tiến hành điền thông tin hành khách tại trang đặt tour.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl mb-4 shadow-lg shadow-emerald-500/20">
                  3
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Dán Mã & Giảm Giá Ngay</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tại bước thanh toán, dán mã vào ô "Mã khuyến mãi" để được trừ trực tiếp số tiền tương ứng.
                </p>
              </div>
            </div>
          </div>

          {/* Expired Promos Section */}
          {expiredPromos.length > 0 && (
            <div className="mt-14 pt-10 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
                <XCircleIcon className="h-6 w-6 text-slate-400" />
                <span>Mã đã hết hạn sử dụng ({expiredPromos.length})</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                {expiredPromos.map((promo) => (
                  <div
                    key={promo.id}
                    className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-5 border border-slate-300 dark:border-slate-700"
                  >
                    <div className="text-xl font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {formatDiscount(promo.discountType, promo.discountValue)}
                    </div>
                    <div className="font-mono font-bold text-slate-500 dark:text-slate-400 mb-2">
                      {promo.code}
                    </div>
                    <div className="text-xs text-slate-400">
                      Hết hiệu lực từ: {formatDate(promo.validUntil)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


