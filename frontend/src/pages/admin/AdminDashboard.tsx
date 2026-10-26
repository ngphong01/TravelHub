import { useAdminSummary } from '../../hooks/useAdmin';
import Skeleton from '../../components/Skeleton';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import RevenueInsights from '../../components/admin/RevenueInsights';
import {
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  MapPinIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  StarIcon,
  ClockIcon,
  CalendarIcon,
  ChartBarIcon,
  BellAlertIcon,
  BoltIcon,
  TagIcon,
  FireIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [performancePeriod, setPerformancePeriod] = useState<'7days' | '30days' | '3months'>('7days');
  const { data, isLoading } = useAdminSummary(performancePeriod);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Executive Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
              <BoltIcon className="h-3.5 w-3.5 text-cyan-400" />
              <span>Trung Tâm Chỉ Huy & Điều Hành Trực Tiếp</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Chào mừng trở lại, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Đào Văn Phong</span>!
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Toàn bộ dữ liệu doanh thu, lượt đặt tour và tài khoản người dùng đang được giám sát theo thời gian thực.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur border border-slate-700/80 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200">
              <CalendarIcon className="h-4 w-4 text-cyan-400" />
              <span>
                {new Date().toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <Link
              to="/admin/destinations"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <ChartBarIcon className="h-4 w-4" />
              <span>Quản lý Tour ngay</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {!isLoading && data?.alerts && data.alerts.pendingBookings > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-amber-500 p-2.5 rounded-xl text-white shadow-md shadow-amber-500/30">
              <BellAlertIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Có đơn đặt chỗ mới cần xác nhận!
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Hiện có <span className="font-bold text-amber-600">{data.alerts.pendingBookings}</span> đơn tour đang chờ quản trị viên xử lý.
              </p>
            </div>
          </div>
          <Link 
            to="/admin/bookings?status=PENDING" 
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex-shrink-0"
          >
            Xử lý ngay →
          </Link>
        </div>
      )}

        {/* Main Stats Cards */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <Skeleton className="h-32 rounded-xl" />
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatCard
                title="Doanh thu"
                value={formatCurrency(data.revenue)}
                icon={CurrencyDollarIcon}
                gradient="from-green-500 to-emerald-600"
                trend={data.revenue > 0 ? 'up' : 'neutral'}
                subtitle="Tổng doanh thu"
                percentage="+12.5%"
              />
              <StatCard
                title="Đặt chỗ"
                value={data.totalBookings}
                icon={ClipboardDocumentListIcon}
                gradient="from-blue-500 to-cyan-600"
                trend={data.totalBookings > 0 ? 'up' : 'neutral'}
                subtitle={`${data.todayBookings || 0} đơn hôm nay`}
                percentage="+8.2%"
              />
              <StatCard
                title="Người dùng"
                value={data.totalUsers}
                icon={UsersIcon}
                gradient="from-purple-500 to-pink-600"
                trend="up"
                subtitle="Tài khoản đăng ký"
                percentage="+15.3%"
              />
              <StatCard
                title="Điểm đến"
                value={data.totalDestinations}
                icon={MapPinIcon}
                gradient="from-orange-500 to-red-600"
                trend="up"
                subtitle={`${data.featuredDestinations || 0} tour nổi bật`}
                percentage="+5.1%"
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <MiniStatCard
                title="Đơn chờ xác nhận"
                value={data.pendingBookings || 0}
                icon={ClockIcon}
                gradient="from-yellow-400 to-orange-500"
                href="/admin/bookings?status=PENDING"
              />
              <MiniStatCard
                title="Đánh giá mới"
                value={data.recentReviews || 0}
                icon={StarIcon}
                gradient="from-blue-400 to-indigo-500"
                subtitle="7 ngày qua"
              />
              <MiniStatCard
                title="Đơn hôm nay"
                value={data.todayBookings || 0}
                icon={FireIcon}
                gradient="from-red-400 to-pink-500"
              />
            </div>

            {/* AI Revenue Insights */}
            {!isLoading && data && (
              <RevenueInsights
                revenue={data.revenue}
                growth={12.5}
                bookings={data.totalBookings}
                popularTours={data.featuredDestinations}
                period={performancePeriod}
              />
            )}
          </>
        )}

        {/* Recent Activity & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Recent Pending Bookings */}
          {!isLoading && data?.alerts?.recentBookings && data.alerts.recentBookings.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  Đơn cần xử lý
                </h2>
                <Link to="/admin/bookings" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Xem tất cả →
                </Link>
              </div>
              <div className="space-y-3">
                {data.alerts.recentBookings.map((booking: any) => (
                  <div key={booking.id} className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all border border-gray-200 hover:border-blue-300 hover:shadow-md">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                        {booking.destination.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{booking.destination}</p>
                        <p className="text-xs text-gray-600 mt-1">{booking.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-xs font-semibold text-blue-600 mt-1">
                        Mới
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Chart Placeholder */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <ChartBarIcon className="h-5 w-5 text-green-600" />
                </div>
                Hiệu suất
              </h2>
              <select 
                value={performancePeriod}
                onChange={(e) => setPerformancePeriod(e.target.value as '7days' | '30days' | '3months')}
                className="text-sm border-2 border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
                <option value="3months">3 tháng qua</option>
              </select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tỷ lệ hoàn thành</span>
                <span className="text-sm font-bold text-green-600">
                  {data?.performance?.completionRate || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-300" 
                  style={{width: `${data?.performance?.completionRate || 0}%`}}
                ></div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-600">Tỷ lệ hủy</span>
                <span className="text-sm font-bold text-red-600">
                  {data?.performance?.cancellationRate || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-red-400 to-pink-500 h-3 rounded-full transition-all duration-300" 
                  style={{width: `${data?.performance?.cancellationRate || 0}%`}}
                ></div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-600">Đánh giá trung bình</span>
                <span className="text-sm font-bold text-yellow-600 flex items-center gap-1">
                  <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {data?.performance?.averageRating ? `${data.performance.averageRating}/5` : '0/5'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300" 
                  style={{width: `${data?.performance?.ratingPercentage || 0}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BoltIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Thao tác nhanh</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <QuickActionCard
              title="Quản lý Tour"
              description="Thêm hoặc chỉnh sửa điểm đến"
              href="/admin/destinations"
              icon={MapPinIcon}
              gradient="from-blue-500 to-cyan-500"
            />
            <QuickActionCard
              title="Quản lý Đặt chỗ"
              description="Xem và xử lý đơn đặt tour"
              href="/admin/bookings"
              icon={ClipboardDocumentListIcon}
              gradient="from-purple-500 to-pink-500"
            />
            <QuickActionCard
              title="Quản lý Người dùng"
              description="Xem danh sách người dùng"
              href="/admin/users"
              icon={UsersIcon}
              gradient="from-orange-500 to-red-500"
            />
            <QuickActionCard
              title="Quản lý Đánh giá"
              description="Xem và duyệt đánh giá"
              href="/admin/reviews"
              icon={StarIcon}
              gradient="from-green-500 to-emerald-500"
            />
            <QuickActionCard
              title="Quản lý Mã Giảm Giá"
              description="Tạo và quản lý voucher"
              href="/admin/promo"
              icon={TagIcon}
              gradient="from-purple-500 to-pink-500"
            />
            <QuickActionCard
              title="Quản lý Blog"
              description="Viết và quản lý bài viết"
              href="/admin/blogs"
              icon={FireIcon}
              gradient="from-orange-500 to-red-500"
            />
            <QuickActionCard
              title="Quản lý Banner"
              description="Quản lý banner và slider"
              href="/admin/banners"
              icon={PhotoIcon}
              gradient="from-indigo-500 to-purple-500"
            />
          </div>
        </div>
      </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradient: string;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  percentage?: string;
}

function StatCard({ title, value, icon: Icon, gradient, trend = 'neutral', subtitle, percentage }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/80 p-5 md:p-6 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
      {/* Top subtle gradient highlight bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-80`} />
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 truncate">{title}</p>
          <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1 truncate">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium truncate">{subtitle}</p>
          )}
        </div>
        <div className={`bg-gradient-to-br ${gradient} p-3.5 rounded-2xl shadow-md group-hover:scale-110 transition-transform flex-shrink-0 text-white`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend !== 'neutral' && percentage && (
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
          <div className="flex items-center text-xs font-bold">
            {trend === 'up' ? (
              <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-1 stroke-2" />
                <span>{percentage}</span>
              </div>
            ) : (
              <div className="flex items-center text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                <ArrowTrendingDownIcon className="h-3.5 w-3.5 mr-1 stroke-2" />
                <span>{percentage}</span>
              </div>
            )}
          </div>
          <span className="text-[11px] font-medium text-slate-400">so với tháng trước</span>
        </div>
      )}
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradient: string;
}

function QuickActionCard({ title, description, href, icon: Icon, gradient }: QuickActionCardProps) {
  return (
    <Link
      to={href}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block relative overflow-hidden group`}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-8 -mb-8"></div>
      </div>
      
      <div className="relative z-10">
        <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold mb-1 tracking-tight">{title}</h3>
        <p className="text-xs text-white/85 line-clamp-1">{description}</p>
      </div>
    </Link>
  );
}

interface MiniStatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradient: string;
  subtitle?: string;
  href?: string;
}

function MiniStatCard({ title, value, icon: Icon, gradient, subtitle, href }: MiniStatCardProps) {
  const content = (
    <div className={`bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-200/80 p-5 transition-all duration-300 group ${href ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
        </div>
        <div className={`bg-gradient-to-br ${gradient} p-3 rounded-2xl shadow-md group-hover:scale-110 transition-transform text-white`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  return content;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}