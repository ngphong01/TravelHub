import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  CreditCardIcon,
  TicketIcon,
  XMarkIcon,
  PrinterIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';
import AccountSidebar from '../../components/AccountSidebar';
import { UserAPI, BookingAPI, getAuthHeaders } from '../../utils/api';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<any | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const current = await UserAPI.current().catch(() => null);
      const userId = (current as any)?.user?.id;
      if (!userId) {
        setBookings([]);
        return;
      }
      const list = await BookingAPI.byUser(userId).catch(() => []);
      setBookings(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error('Failed to load bookings', e);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const getStatusConfig = (status: string) => {
    const s = String(status || '').toUpperCase();
    if (s === 'CONFIRMED' || s === 'PAID') {
      return { 
        bg: 'bg-emerald-100 dark:bg-emerald-950/60', 
        text: 'text-emerald-800 dark:text-emerald-300', 
        icon: CheckCircleIcon,
        label: s === 'PAID' ? 'Đã thanh toán' : 'Đã xác nhận'
      };
    }
    if (s === 'PENDING') {
      return { 
        bg: 'bg-amber-100 dark:bg-amber-950/60', 
        text: 'text-amber-800 dark:text-amber-300', 
        icon: ClockIcon,
        label: 'Chờ thanh toán'
      };
    }
    if (s === 'CANCELLED') {
      return { 
        bg: 'bg-red-100 dark:bg-red-950/60', 
        text: 'text-red-800 dark:text-red-300', 
        icon: XCircleIcon,
        label: 'Đã hủy'
      };
    }
    return { 
      bg: 'bg-gray-100 dark:bg-gray-800', 
      text: 'text-gray-800 dark:text-gray-200', 
      icon: ExclamationCircleIcon,
      label: status || 'Không xác định' 
    };
  };

  const handleCancelBooking = async () => {
    if (!cancellingBooking) return;
    try {
      setIsCancelling(true);
      const token = localStorage.getItem('tg_token');
      const res = await fetch(`/api/booking/${cancellingBooking.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ reason: 'Khách hàng yêu cầu hủy từ trang cá nhân' }),
      });

      if (!res.ok) {
        // Fallback update booking status via patch/post
        await fetch(`/api/booking/${cancellingBooking.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ status: 'CANCELLED' }),
        }).catch(() => null);
      }

      toast.success(`Đã hủy đặt chỗ #${cancellingBooking.code || cancellingBooking.id} thành công`);
      setCancellingBooking(null);
      loadBookings();
    } catch (err) {
      toast.error('Không thể hủy đơn đặt chỗ. Vui lòng liên hệ hotline hỗ trợ.');
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const s = String(booking.status || '').toLowerCase();
    const matchesFilter =
      filter === 'all' ||
      (filter === 'confirmed' && (s === 'confirmed' || s === 'paid')) ||
      (filter === 'pending' && s === 'pending') ||
      (filter === 'cancelled' && s === 'cancelled');

    const search = searchTerm.toLowerCase();
    const destName = booking.destination?.name || booking.destinationName || '';
    const code = booking.code || String(booking.id || '');

    const matchesSearch =
      !searchTerm ||
      code.toLowerCase().includes(search) ||
      destName.toLowerCase().includes(search);

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => ['confirmed', 'paid'].includes(String(b.status).toLowerCase())).length,
    pending: bookings.filter((b) => String(b.status).toLowerCase() === 'pending').length,
    cancelled: bookings.filter((b) => String(b.status).toLowerCase() === 'cancelled').length,
  };

  const formatPrice = (amount?: number) => {
    return (amount || 0).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <AccountSidebar />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <CalendarDaysIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Lịch sử đặt chỗ</h1>
                    <p className="text-white/90 mt-1">Quản lý và theo dõi các tour, khách sạn và dịch vụ của bạn</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={() => setFilter('all')}
                className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 border cursor-pointer transition-all duration-200 ${
                  filter === 'all' ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-gray-100 dark:border-slate-800 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Tổng đơn</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stats.total}</p>
                  </div>
                  <div className="w-11 h-11 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center">
                    <CalendarDaysIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setFilter('confirmed')}
                className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 border cursor-pointer transition-all duration-200 ${
                  filter === 'confirmed' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-100 dark:border-slate-800 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Đã xác nhận</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">{stats.confirmed}</p>
                  </div>
                  <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setFilter('pending')}
                className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 border cursor-pointer transition-all duration-200 ${
                  filter === 'pending' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-gray-100 dark:border-slate-800 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Chờ thanh toán</p>
                    <p className="text-2xl font-black text-amber-600 mt-1">{stats.pending}</p>
                  </div>
                  <div className="w-11 h-11 bg-amber-50 dark:bg-amber-950/60 rounded-xl flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setFilter('cancelled')}
                className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 border cursor-pointer transition-all duration-200 ${
                  filter === 'cancelled' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-100 dark:border-slate-800 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Đã hủy</p>
                    <p className="text-2xl font-black text-red-600 mt-1">{stats.cancelled}</p>
                  </div>
                  <div className="w-11 h-11 bg-red-50 dark:bg-red-950/60 rounded-xl flex items-center justify-center">
                    <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo mã đặt chỗ, tên tour, khách sạn..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFilter(mode)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition ${
                        filter === mode
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200'
                      }`}
                    >
                      {mode === 'all' ? 'Tất cả' : mode === 'confirmed' ? 'Xác nhận' : mode === 'pending' ? 'Chờ duyệt' : 'Đã hủy'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bookings List */}
            {loading ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-gray-100 dark:border-slate-800">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">Đang tải lịch sử đặt chỗ của bạn...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-gray-100 dark:border-slate-800">
                <CalendarDaysIcon className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Không tìm thấy đơn đặt chỗ nào</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
                  {searchTerm ? 'Không có đơn nào khớp với từ khóa tìm kiếm.' : 'Bạn chưa có đơn đặt tour hoặc khách sạn nào.'}
                </p>
                <Link
                  to="/tours"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm hover:opacity-95 shadow-md shadow-indigo-500/20"
                >
                  Khám phá các tour nổi bật
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => {
                  const statusConfig = getStatusConfig(booking.status);
                  const StatusIcon = statusConfig.icon;
                  const isPending = String(booking.status).toUpperCase() === 'PENDING';
                  const isCancelled = String(booking.status).toUpperCase() === 'CANCELLED';
                  const title = booking.destination?.name || booking.destinationName || 'Hành trình TravelHub';
                  const displayCode = booking.code || `BK-${booking.id}`;

                  return (
                    <div
                      key={booking.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-sm">
                            #{booking.id}
                          </div>
                          <div>
                            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                              Mã đơn: {displayCode}
                            </span>
                            <span className="text-xs text-gray-400">
                              Ngày đặt: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('vi-VN') : 'Gần đây'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.text}`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>

                      <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-2">
                          <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                            {title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4 text-cyan-500" />
                              {booking.destination?.country || 'Việt Nam'}
                            </span>
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-4 h-4 text-amber-500" />
                              Khởi hành: {booking.from ? new Date(booking.from).toLocaleDateString('vi-VN') : 'Theo lịch hẹn'}
                            </span>
                          </div>
                          {booking.notes && (
                            <p className="text-xs text-gray-500 dark:text-slate-400 italic bg-gray-50 dark:bg-slate-800/60 p-2 rounded-lg">
                              Ghi chú: {booking.notes}
                            </p>
                          )}
                        </div>

                        <div className="text-left md:text-right flex flex-col justify-between">
                          <div>
                            <span className="text-xs text-gray-400 block">Tổng thanh toán:</span>
                            <span className="text-xl sm:text-2xl font-black text-orange-600 dark:text-orange-400">
                              {formatPrice(booking.totalAmount)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions Toolbar */}
                      <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedTicket(booking)}
                            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5 transition"
                          >
                            <TicketIcon className="w-4 h-4" />
                            Xem vé E-ticket
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => navigate(`/checkout/payment?code=${displayCode}`)}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition"
                              >
                                <CreditCardIcon className="w-4 h-4" />
                                Thanh toán ngay
                              </button>
                              <button
                                type="button"
                                onClick={() => setCancellingBooking(booking)}
                                className="px-3 py-2 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 font-bold text-xs transition"
                              >
                                Hủy đơn
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* E-Ticket Preview Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TicketIcon className="w-7 h-7 text-amber-300" />
                <div>
                  <h3 className="font-extrabold text-lg">Vé Điện Tử E-Ticket</h3>
                  <p className="text-xs text-indigo-100">TravelHub Booking Pass</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold block mb-1">Mã Vé Xác Thực</span>
                <span className="font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {selectedTicket.code || `BK-${selectedTicket.id}`}
                </span>
                <div className="mt-3 flex justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`TRAVELHUB-PASS-${selectedTicket.code || selectedTicket.id}`)}`}
                    alt="Ticket QR Code"
                    className="w-36 h-36 rounded-xl border-2 border-dashed border-indigo-300 p-1 bg-white"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">Xuất trình mã này cho HDV hoặc lễ tân khi nhận dịch vụ</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Dịch vụ:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedTicket.destination?.name || selectedTicket.destinationName || 'Tour du lịch'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Tổng thanh toán:</span>
                  <span className="font-extrabold text-orange-600">
                    {formatPrice(selectedTicket.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Trạng thái:</span>
                  <span className="font-bold text-emerald-600">{getStatusConfig(selectedTicket.status).label}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <PrinterIcon className="w-4 h-4" />
                  In Phiếu Vé
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="py-3 px-5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <ExclamationCircleIcon className="w-7 h-7" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Xác nhận hủy đặt chỗ</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                Bạn có chắc chắn muốn hủy đơn đặt chỗ #{cancellingBooking.code || cancellingBooking.id}? Thao tác này không thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 font-bold text-xs text-gray-700 dark:text-slate-300 hover:bg-gray-100"
              >
                Không, giữ lại
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancelBooking}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 disabled:opacity-50"
              >
                {isCancelling ? 'Đang hủy...' : 'Đồng ý hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
