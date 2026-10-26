import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingAPI, UserAPI, getAuthHeaders } from '../utils/api';
import toast from 'react-hot-toast';
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  TicketIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

type Order = {
  id: number;
  code?: string;
  status: string;
  totalAmount?: number;
  createdAt?: string;
  destination?: { name: string; image?: string; slug?: string };
  from?: string;
  to?: string;
};

const getStatusConfig = (status: string) => {
  const statusMap: Record<string, { label: string; bg: string; text: string; icon: any; gradient: string }> = {
    CONFIRMED: {
      label: 'Đã xác nhận',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      icon: CheckCircleIcon,
      gradient: 'from-emerald-500 to-teal-500'
    },
    COMPLETED: {
      label: 'Hoàn thành',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      icon: CheckCircleIcon,
      gradient: 'from-blue-500 to-cyan-500'
    },
    PENDING: {
      label: 'Đang chờ',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      icon: ClockIcon,
      gradient: 'from-amber-500 to-orange-500'
    },
    CANCELLED: {
      label: 'Đã hủy',
      bg: 'bg-red-50',
      text: 'text-red-700',
      icon: XCircleIcon,
      gradient: 'from-red-500 to-rose-500'
    },
  };
  return statusMap[status] || {
    label: status,
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    icon: ExclamationCircleIcon,
    gradient: 'from-gray-500 to-slate-500'
  };
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [emailOrder, setEmailOrder] = useState<any | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const current = await UserAPI.current().catch(() => null);
        const userId = (current as any)?.user?.id;
        if (!userId) {
          setOrders([]);
          setError('Bạn cần đăng nhập để xem tour đã đặt.');
          return;
        }
        const list = await BookingAPI.byUser(userId).catch(() => []);
        if (!cancelled) setOrders(list as unknown as Order[]);
      } catch (e) {
        if (!cancelled) setError('Không thể tải danh sách tour đã đặt.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn đặt chỗ này không?')) return;
    try {
      setCancellingId(orderId);
      const res = await fetch(`/api/booking/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      if (!res.ok) throw new Error('Không thể hủy đơn đặt tour');
      toast.success('Đã hủy tour thành công');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev: any) => prev ? { ...prev, status: 'CANCELLED' } : null);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Lỗi khi hủy đơn');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.destination?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    
    const matchesFilter = filterStatus === 'ALL' || order.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: orders.length,
    confirmed: orders.filter(o => o.status === 'CONFIRMED' || o.status === 'COMPLETED').length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="animate-pulse bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 mb-8 h-48"></div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg h-32" />
            ))}
          </div>

          {/* Cards Skeleton */}
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white overflow-hidden relative">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                    <TicketIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">
                      Tour Đã Đặt
                    </h1>
                    <p className="text-white/90 text-base md:text-lg">Theo dõi và quản lý các tour du lịch của bạn</p>
                  </div>
                </div>
                
                {orders.length > 0 && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30">
                    <TicketIcon className="w-5 h-5 text-white" />
                    <div className="text-left">
                      <p className="text-xs text-white/80 font-medium">Tổng số tour</p>
                      <p className="text-2xl font-bold text-white">{orders.length}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tổng số</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stats.total}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <TicketIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Đã xác nhận</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {stats.confirmed}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <CheckCircleIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Đang chờ</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {stats.pending}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <ClockIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Đã hủy</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  {stats.cancelled}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <XCircleIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        {orders.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/50">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã tour, điểm đến..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Filter */}
              <div className="relative md:w-64">
                <FunnelIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 appearance-none cursor-pointer bg-white"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="PENDING">Đang chờ</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-red-200">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl">
                <XCircleIcon className="w-10 h-10 text-white" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Cần đăng nhập</h3>
                <p className="text-gray-600 mb-6 text-lg">{error}</p>
                <Link
                  to="/signin"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Đăng nhập ngay
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && !loading && orders.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 md:p-16 text-center border border-white/50">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <TicketIcon className="w-16 h-16 text-indigo-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Chưa có tour nào được đặt</h3>
            <p className="text-gray-600 mb-10 text-lg max-w-md mx-auto leading-relaxed">
              Bắt đầu hành trình của bạn bằng cách khám phá những điểm đến tuyệt vời trên khắp thế giới và tạo ra những kỷ niệm không thể quên
            </p>
            <Link
              to="/destinations"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              <MapPinIcon className="w-6 h-6" />
              Khám phá điểm đến
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!error && !loading && filteredOrders.length > 0 && (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              // Lấy ảnh từ destination
              let destinationImage = null;
              if (order.destination?.image) {
                if (order.destination.image.startsWith('http')) {
                  destinationImage = order.destination.image;
                } else if (order.destination.image.startsWith('/uploads')) {
                  destinationImage = `${window.location.origin}${order.destination.image}`;
                } else {
                  destinationImage = `${window.location.origin}/uploads/destinations/${order.destination.image}`;
                }
              }

              return (
                <div
                  key={order.id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-80 h-64 md:h-auto bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 overflow-hidden relative">
                      {destinationImage ? (
                        <>
                          <img
                            src={destinationImage}
                            alt={order.destination?.name || 'Điểm đến'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPinIcon className="w-24 h-24 text-white/50" />
                        </div>
                      )}
                      
                      {/* Status Badge on Image */}
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md border-2 border-white/30 shadow-lg ${statusConfig.bg} ${statusConfig.text}`}>
                          <StatusIcon className="w-5 h-5" />
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 md:p-8">
                      <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`w-12 h-12 bg-gradient-to-br ${statusConfig.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                                  <TicketIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Mã tour</p>
                                  <p className="font-mono text-xl font-bold text-gray-900">
                                    {order.code || `#${order.id}`}
                                  </p>
                                </div>
                              </div>
                              
                              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3 group-hover:text-indigo-600 transition-colors">
                                <MapPinIcon className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                                {order.destination?.name || 'Điểm đến không xác định'}
                              </h3>

                              {order.from && order.to && (
                                <div className="flex items-center gap-3 text-gray-600 mb-4 bg-gray-50 rounded-xl px-4 py-3">
                                  <CalendarDaysIcon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                  <span className="font-medium">
                                    {new Date(order.from).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })} 
                                    {' → '}
                                    {new Date(order.to).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  </span>
                                </div>
                              )}
                            </div>

                            {order.totalAmount && (
                              <div className="text-right bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl px-6 py-4 border-2 border-blue-200">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tổng tiền</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                  {order.totalAmount.toLocaleString('vi-VN')} <span className="text-lg text-gray-500">VNĐ</span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-6 border-t-2 border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                              <ClockIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500">Đặt ngày</p>
                              <p className="font-medium text-gray-900">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : '—'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 border border-indigo-200 shadow-sm hover:shadow text-sm"
                            >
                              <DocumentTextIcon className="w-4 h-4 text-indigo-600" />
                              Vé & Hóa đơn
                            </button>

                            <button
                              type="button"
                              onClick={() => setEmailOrder(order)}
                              className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-3.5 py-2.5 rounded-xl transition-all duration-200 border border-blue-200 shadow-sm hover:shadow text-sm"
                              title="Xem mẫu Email xác nhận đặt tour gửi cho khách hàng"
                            >
                              <EnvelopeIcon className="w-4 h-4 text-blue-600" />
                              Email xác nhận
                            </button>

                            {order.status !== 'CANCELLED' && (
                              <button
                                type="button"
                                disabled={cancellingId === order.id}
                                onClick={() => handleCancelOrder(order.id)}
                                className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm border border-red-200 disabled:opacity-50"
                              >
                                <XCircleIcon className="w-4 h-4" />
                                {cancellingId === order.id ? 'Đang xử lý...' : 'Hủy tour'}
                              </button>
                            )}

                            {order.destination?.slug && (
                              <Link
                                to={`/destinations/${order.destination.slug}`}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                              >
                                Xem tour
                                <ArrowRightIcon className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!error && !loading && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 md:p-16 text-center border border-white/50">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Không tìm thấy kết quả</h3>
            <p className="text-gray-600 mb-8 text-lg">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('ALL');
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <XCircleIcon className="w-5 h-5" />
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Results Count */}
        {filteredOrders.length > 0 && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/50">
              <span className="text-sm text-gray-600">
                Hiển thị <span className="font-bold text-indigo-600">{filteredOrders.length}</span> trong tổng số{' '}
                <span className="font-bold text-gray-900">{orders.length}</span> tour
              </span>
            </div>
          </div>
        )}
        {/* E-Ticket & Invoice Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
              {/* Header Gradient */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <TicketIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">VÉ ĐIỆN TỬ & HÓA ĐƠN ĐẶT TOUR</h3>
                    <p className="text-blue-100 text-xs font-mono">TravelHub E-Ticket System</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/20 pt-3">
                  <span className="text-sm font-mono tracking-wider font-bold bg-white/20 px-3 py-1 rounded-lg">
                    Mã đơn: {selectedOrder.code || `#${selectedOrder.id}`}
                  </span>
                  <span className="text-xs uppercase px-3 py-1 rounded-full font-bold bg-white text-indigo-700 shadow-sm">
                    {getStatusConfig(selectedOrder.status).label}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Destination & Schedule */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 p-5 rounded-2xl border border-blue-100/60">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Điểm đến / Tour</p>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPinIcon className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                    {selectedOrder.destination?.name || 'Điểm đến không xác định'}
                  </h4>

                  {selectedOrder.from && selectedOrder.to ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-200/60 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs">Khởi hành:</span>
                        <span className="font-semibold text-gray-800">
                          {new Date(selectedOrder.from).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs">Kết thúc:</span>
                        <span className="font-semibold text-gray-800">
                          {new Date(selectedOrder.to).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Billing Summary */}
                <div className="border border-gray-200 rounded-2xl p-5 space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Mã đặt chỗ:</span>
                    <span className="font-mono font-bold text-gray-900">{selectedOrder.code || `#${selectedOrder.id}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Thời gian đặt:</span>
                    <span className="font-medium text-gray-800">
                      {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('vi-VN') : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Trạng thái đơn hàng:</span>
                    <span className="font-semibold text-indigo-600">{getStatusConfig(selectedOrder.status).label}</span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">Tổng thanh toán:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {(selectedOrder.totalAmount || 0).toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>

                {/* QR Code Demo Section */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-900">Mã QR Check-in</p>
                    <p className="text-xs text-gray-500">Quét mã này tại quầy hoặc xuất trình cho Hướng dẫn viên</p>
                  </div>
                  <div className="w-16 h-16 bg-white p-1 rounded-xl shadow-sm border border-gray-300 flex items-center justify-center">
                    {/* SVG QR Code Simulation */}
                    <svg className="w-full h-full text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h2v4h-2v-4zm2 2h4v2h-4v-2zm0-4h2v2h-2v-2z" />
                    </svg>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
                  >
                    <PrinterIcon className="w-4 h-4" />
                    In vé / Hóa đơn
                  </button>

                  <a
                    href={`/api/invoice/${selectedOrder.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Tải PDF Hóa đơn
                  </a>

                  <a
                    href={`/api/itinerary/${selectedOrder.id}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                    Lịch trình PDF
                  </a>
                </div>

                {selectedOrder.status !== 'CANCELLED' && (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      disabled={cancellingId === selectedOrder.id}
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold underline disabled:opacity-50"
                    >
                      {cancellingId === selectedOrder.id ? 'Đang hủy đơn...' : 'Yêu cầu hủy đơn đặt chỗ này'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Email Confirmation Preview Modal */}
        {emailOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
              {/* Mail Client Bar */}
              <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  </div>
                  <span className="text-xs font-mono text-slate-300">
                    Mẫu Email Xác Nhận Đơn Hàng (Preview)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailOrder(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Email Meta Header */}
              <div className="p-6 bg-slate-50 border-b border-gray-200 space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <p>
                    <strong className="text-gray-900 font-semibold">Từ:</strong> TravelHub Booking System &lt;booking@travelhub.vn&gt;
                  </p>
                  <span className="text-[11px] text-gray-400">
                    {emailOrder.createdAt ? new Date(emailOrder.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <p>
                  <strong className="text-gray-900 font-semibold">Tới:</strong> Quý khách hàng &lt;khachhang@travelhub.vn&gt;
                </p>
                <p className="text-sm font-bold text-gray-900 pt-1">
                  Tiêu đề: [TravelHub] Xác nhận đặt tour thành công - Mã đơn #{emailOrder.id}
                </p>
              </div>

              {/* Email Body Content */}
              <div className="p-6 md:p-8 space-y-6 max-h-[65vh] overflow-y-auto bg-white">
                {/* Brand Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white text-center">
                  <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-300" />
                    ĐẶT CHỖ THÀNH CÔNG
                  </div>
                  <h3 className="text-2xl font-black">XÁC NHẬN HÀNH TRÌNH DU LỊCH</h3>
                  <p className="text-xs text-blue-100 mt-1">Cảm ơn quý khách đã tin chọn nền tảng du lịch trực tuyến TravelHub!</p>
                </div>

                {/* Greeting & Order Details Table */}
                <div className="space-y-4 text-sm text-gray-700">
                  <p>
                    Kính gửi <strong>Quý khách</strong>,
                  </p>
                  <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">
                    Yêu cầu đặt tour của quý khách đã được hệ thống ghi nhận và xác nhận chính thức. Dưới đây là thông tin chi tiết về hành trình của quý khách:
                  </p>

                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-500 text-xs">Mã đơn hàng:</span>
                      <span className="font-mono font-bold text-indigo-600 text-sm">#TH-{emailOrder.id}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-500 text-xs">Tour / Điểm đến:</span>
                      <span className="font-bold text-gray-900 text-right">{emailOrder.destination?.name || 'Tour Du Lịch Trọn Gói'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-500 text-xs">Ngày khởi hành:</span>
                      <span className="font-medium text-gray-900">
                        {emailOrder.from ? new Date(emailOrder.from).toLocaleDateString('vi-VN') : 'Theo thông báo'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-500 text-xs">Trạng thái vé:</span>
                      <span className="font-bold text-emerald-600">
                        {getStatusConfig(emailOrder.status).label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-gray-900 font-bold text-sm">Tổng thanh toán:</span>
                      <span className="font-extrabold text-blue-600 text-lg">
                        {(emailOrder.totalAmount || 0).toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                  </div>

                  {/* Travel Tips */}
                  <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100 text-xs text-blue-900 space-y-1.5">
                    <p className="font-bold flex items-center gap-1.5 text-blue-800">
                      <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                      Lưu ý quan trọng trước chuyến đi:
                    </p>
                    <p>• Quý khách vui lòng có mặt tại điểm đón trước ít nhất 30 phút so với giờ khởi hành.</p>
                    <p>• Mang theo CCCD/Hộ chiếu bản gốc còn hạn để làm thủ tục nhận phòng khách sạn.</p>
                    <p>• Xuất trình mã vé điện tử <strong>#TH-{emailOrder.id}</strong> cho Hướng dẫn viên tại điểm tập trung.</p>
                  </div>
                </div>

                {/* Email Sign-off */}
                <div className="pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                  <p className="font-bold text-gray-800">Ban Quản Trị Hệ Thống TravelHub</p>
                  <p>Hotline hỗ trợ 24/7: 1900 8888 • Email: support@travelhub.vn</p>
                  <p className="text-[11px] text-gray-400">Website: https://travelhub.vn — Nền tảng đặt tour & du lịch trực tuyến số 1</p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-700 transition"
                >
                  <PrinterIcon className="w-4 h-4" />
                  In Email
                </button>
                <button
                  type="button"
                  onClick={() => setEmailOrder(null)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
