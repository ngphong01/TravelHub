import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  MapPinIcon, 
  GlobeAltIcon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon, 
  StarIcon, 
  CreditCardIcon, 
  TagIcon,
  DocumentTextIcon,
  PhotoIcon,
  QueueListIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  ShieldCheckIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser } from '../lib/auth';
import LanguageSwitcher from '../components/LanguageSwitcher';
import TravelHubLogo from '../components/TravelHubLogo';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('tg_token');
    navigate('/signin');
  };

  // Grouped Navigation for modern Enterprise OTAs
  const navGroups = [
    {
      title: 'TỔNG QUAN & PHÂN TÍCH',
      items: [
        { href: '/admin/dashboard', label: 'Bảng điều khiển', icon: HomeIcon },
        { href: '/admin/analytics', label: 'Báo cáo & Phân tích', icon: ChartBarIcon },
      ],
    },
    {
      title: 'DỊCH VỤ DU LỊCH',
      items: [
        { href: '/admin/tours', label: 'Quản lý Tour', icon: GlobeAltIcon },
        { href: '/admin/destinations', label: 'Điểm đến du lịch', icon: MapPinIcon },
        { href: '/admin/hotels', label: 'Khách sạn & Resort', icon: BuildingOffice2Icon },
        { href: '/admin/restaurants', label: 'Nhà hàng & Ẩm thực', icon: BuildingStorefrontIcon },
      ],
    },
    {
      title: 'KINH DOANH & KHÁCH HÀNG',
      items: [
        { href: '/admin/bookings', label: 'Quản lý Đặt chỗ', icon: ClipboardDocumentListIcon, badge: 'Đơn mới' },
        { href: '/admin/users', label: 'Khách hàng & Thành viên', icon: UsersIcon },
        { href: '/admin/reviews', label: 'Đánh giá của khách', icon: StarIcon },
        { href: '/admin/payments', label: 'Giao dịch thanh toán', icon: CreditCardIcon },
        { href: '/admin/promo', label: 'Mã ưu đãi & Voucher', icon: TagIcon },
      ],
    },
    {
      title: 'NỘI DUNG & VẬN HÀNH',
      items: [
        { href: '/admin/blogs', label: 'Bài viết & Cẩm nang', icon: DocumentTextIcon },
        { href: '/admin/banners', label: 'Banner & Quảng cáo', icon: PhotoIcon },
        { href: '/admin/menu', label: 'Menu & Điều hướng', icon: QueueListIcon },
        { href: '/admin/chat', label: 'Trò chuyện CSKH', icon: ChatBubbleLeftRightIcon },
        { href: '/admin/settings', label: 'Cài đặt hệ thống', icon: Cog6ToothIcon },
      ],
    },
  ];

  // Helper to detect current page title
  const getCurrentPageTitle = () => {
    for (const group of navGroups) {
      for (const item of group.items) {
        if (location.pathname === item.href) return item.label;
      }
    }
    return 'Bảng điều khiển';
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex font-sans antialiased text-slate-800">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Dark Luxury Slate-900 / Navy */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/80 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <TravelHubLogo variant="light" size="sm" showTagline={false} />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded-full w-fit">
                Admin Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Current Admin User Profile Chip */}
        <div className="px-5 py-4 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md ring-2 ring-blue-500/30">
                ĐP
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                Đào Văn Phong
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                <span className="text-[11px] font-medium text-slate-400 truncate">
                  {user?.email || 'Super Admin • Toàn quyền'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {group.title}
              </h3>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'
                      }`}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-1.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60 rounded-xl transition-colors group"
          >
            <span className="flex items-center gap-2">
              <SparklesIcon className="h-4 w-4 text-cyan-400" />
              Xem Website Khách Hàng
            </span>
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Đăng xuất an toàn
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Modern Top Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
          {/* Left: Mobile trigger & Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>Quản trị TravelHub</span>
                <span>/</span>
                <span className="text-blue-600 font-semibold">{getCurrentPageTitle()}</span>
              </div>
              <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                {getCurrentPageTitle()}
              </h1>
            </div>
          </div>

          {/* Center: Quick Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tour, khách hàng, mã booking... (Ctrl + K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Right: Quick Actions, Status & Tools */}
          <div className="flex items-center gap-3">
            {/* Quick Create Tour Button */}
            <Link
              to="/admin/destinations"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:shadow-lg active:scale-95"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Thêm Tour / Điểm Đến</span>
            </Link>

            {/* System Status Pill */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-xl text-[11px] font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Hệ thống: Bình thường</span>
            </div>

            {/* Notification Bell */}
            <Link
              to="/admin/bookings?status=PENDING"
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Thông báo đơn đặt chỗ mới"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </Link>

            {/* Language Switcher */}
            <div className="border-l border-slate-200 pl-3">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}