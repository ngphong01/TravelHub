import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  CalendarIcon, 
  KeyIcon, 
  Cog6ToothIcon,
  ArrowLeftIcon,
  PhotoIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  HeartIcon,
  StarIcon,
  CalendarDaysIcon,
  TicketIcon,
  SparklesIcon,
  IdentificationIcon,
  PhoneIcon,
  MapPinIcon,
  QrCodeIcon,
  ArrowRightIcon,
  CameraIcon,
  CreditCardIcon,
  TagIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  GiftIcon,
  BoltIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import AccountSidebar from "../components/AccountSidebar";
import AvatarSelectorModal from "../components/AvatarSelectorModal";

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: string;
  loginTime: string;
  verified?: boolean;
  role?: string;
  settings?: any;
  avatarUrl?: string;
  createdAt?: string;
}

interface UserResponse {
  authenticated: boolean;
  user: User | null;
}

export default function AccountPage() {
  const router = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'trips' | 'vouchers' | 'security'>('profile');
  const [phone, setPhone] = useState('0868 156 027');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [idCard, setIdCard] = useState('001295******');
  const [isEditingIdCard, setIsEditingIdCard] = useState(false);
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);

  // Handle token from URL query params (OAuth callback)
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      console.log('🔑 Account Page: Token found in URL, saving to localStorage...');
      localStorage.setItem('tg_token', urlToken);
      // Remove token from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('token');
      window.history.replaceState({}, '', newUrl.pathname + newUrl.search);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Fetch user info - Memoize với useCallback để tránh re-create function
  const fetchUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Account Page: Fetching user info...');
      console.log('🌐 Current URL:', window.location.href);
      
      // Get token from localStorage or URL
      const urlToken = searchParams.get('token');
      const token = urlToken || localStorage.getItem('tg_token');
      
      if (urlToken) {
        localStorage.setItem('tg_token', urlToken);
      }
      
      const response = await fetch('/api/auth/user', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      
      console.log('📡 Account Page: Response status:', response.status);
      const data: UserResponse = await response.json();
      console.log('📊 Account Page: User data:', data);

      if (data.authenticated && data.user) {
        // 🔥 CRITICAL: Map avatarUrl vào picture để hiển thị ảnh Google
        const mapped: any = {
          ...data.user,
          picture: (data.user as any).avatarUrl || (data.user as any).picture || null,
          avatarUrl: (data.user as any).avatarUrl || (data.user as any).picture || null, // Đảm bảo cả 2 field đều có
          settings: (data.user as any).settings || {},
        };
        console.log('🖼️ Avatar URL:', mapped.avatarUrl, 'Picture:', mapped.picture);
        setUser(mapped);
        console.log('✅ Account Page: User authenticated:', data.user.name);
        console.log('✅ Account Page: User settings:', mapped.settings);
        
        // Allow admin to view their own account page
        // Only redirect if explicitly requested (not when clicking "Tài khoản" from menu)
        // Admin can access both /account and /admin/dashboard
      } else {
        setUser(null);
        console.log('❌ Account Page: User not authenticated');
        console.log('   Response data:', data);
        if ((data as any).error) {
          console.error('   Error from server:', (data as any).error);
        }
        // If we have a token but authentication failed, clear it
        if (token) {
          console.log('   Clearing invalid token from localStorage');
          localStorage.removeItem('tg_token');
        }
      }
    } catch (error) {
      console.error('💥 Account Page: Error fetching user info:', error);
      setUser(null);
    } finally {
      setLoading(false);
      console.log('🏁 Account Page: Loading finished');
    }
  }, [searchParams]);

  useEffect(() => {
    console.log('🚀 Account Page: Component mounted, starting fetch...');
    fetchUserInfo();
  }, [fetchUserInfo]);

  // Fetch lại khi có token mới từ URL
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      console.log('🔑 Token in URL detected, refetching user info...');
      fetchUserInfo();
    }
  }, [searchParams, fetchUserInfo]);

  // Ref để tránh fetch nhiều lần
  const fetchingRef = useRef(false);

  // Listen to avatar-updated event để refetch user info
  useEffect(() => {
    const handleAvatarUpdate = () => {
      console.log('🔄 Avatar updated event received, refetching user info...');
      if (!fetchingRef.current) {
        fetchingRef.current = true;
        fetchUserInfo().finally(() => {
          fetchingRef.current = false;
        });
      }
    };

    window.addEventListener('avatar-updated', handleAvatarUpdate);
    return () => {
      window.removeEventListener('avatar-updated', handleAvatarUpdate);
    };
  }, []);

  // ProtectedRoute đã xử lý redirect, không cần redirect lại ở đây
  // useEffect(() => {
  //   if (!loading && !user) {
  //     window.location.assign('/signin');
  //   }
  // }, [loading, user]);

  // 🔥 CRITICAL: Tất cả hooks phải được gọi TRƯỚC các early return
  // Memoize avatarUrl để tránh tính toán lại và nháy
  const avatarUrl = useMemo(() => {
    if (!user) return null;
    const url = (user as any)?.avatarUrl || (user as any)?.picture || null;
    return url;
  }, [user, (user as any)?.avatarUrl, (user as any)?.picture]);
  
  const isImageAvatar = useMemo(() => {
    return !!(avatarUrl && avatarUrl.length > 5);
  }, [avatarUrl]);
  
  // Get full avatar URL if it's a relative path - Memoize để tránh nháy
  const fullAvatarUrl = useMemo(() => {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith('http')) return avatarUrl;
    if (avatarUrl.startsWith('/uploads')) return avatarUrl;
    return `/uploads/avatars/${avatarUrl}`;
  }, [avatarUrl]);

  // Early returns - sau khi tất cả hooks đã được gọi
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Chưa đăng nhập</h1>
            <p className="text-gray-600 mb-8">Vui lòng đăng nhập để xem thông tin tài khoản của bạn</p>
            <div className="space-y-3">
              <Link 
                to="/api/auth/oauth/google" 
                className="block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Đăng nhập ngay
            </Link>
              <Link 
                to="/" 
                className="block bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
              Về trang chủ
            </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user.name || user.email?.split('@')[0] || "User";
  const initial = displayName.slice(0, 1).toUpperCase();

function InlineNameEditor({ current, onSaved }: { current: string; onSaved: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(current);
  useEffect(()=>{ setValue(current); }, [current]);
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex-shrink-0 text-indigo-600 hover:text-indigo-700 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all duration-200"
      >
        Sửa
      </button>
    );
  }
    return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <input
        value={value}
        onChange={(e)=>setValue(e.target.value)}
        className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
        placeholder="Nhập tên mới"
        autoFocus
      />
      <button
        onClick={async () => {
          const trimmed = value.trim();
          if (!trimmed || trimmed === current) { setOpen(false); return; }
          const token = localStorage.getItem('tg_token');
          const res = await fetch('/api/account/profile', {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ name: trimmed }),
          });
          const json = await res.json();
          if (res.ok && json?.success) {
            onSaved(trimmed);
            setOpen(false);
            window.dispatchEvent(new Event('avatar-updated'));
          } else {
            alert(json?.error || 'Cập nhật tên thất bại');
          }
        }}
        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        ✓ Lưu
      </button>
      <button 
        onClick={()=>{
          setValue(current);
          setOpen(false);
        }} 
        className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-100 text-gray-700 border border-gray-300 transition-all duration-200"
      >
        Hủy
      </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section - Traveler Passport (Ocean Navy & Gold VIP) */}
        <div className="relative overflow-hidden rounded-3xl mb-8 shadow-xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white">
          {/* Subtle Map / Compass Grid Texture */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
              {/* Left: Avatar & Traveler Profile */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                {/* Avatar with Single Clean Edit Button & Gold VIP Badge */}
                <div className="relative flex-shrink-0">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-blue-500/30 shadow-2xl bg-slate-800">
                    {isImageAvatar ? (
                      <img
                        key={fullAvatarUrl}
                        src={fullAvatarUrl || '/default-avatar.png'}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-avatar.png';
                        }}
                        loading="eager"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white text-4xl font-extrabold">
                        {initial}
                      </div>
                    )}
                  </div>

                  {/* Gold VIP Member Crown Badge */}
                  <div className="absolute -top-2.5 -left-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-lg border border-amber-200 flex items-center gap-1">
                    <span>👑</span>
                    <span>VIP ELITE</span>
                  </div>

                  {/* Hidden File Input for Avatar */}
                  <input
                    id="avatar-file-hero"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const form = new FormData();
                      form.append('file', file);
                      const token = localStorage.getItem('tg_token');
                      const res = await fetch('/api/account/avatar', {
                        method: 'POST',
                        body: form,
                        credentials: 'include',
                        headers: token ? ({ Authorization: `Bearer ${token}` } as any) : undefined,
                      });
                      const json = await res.json();
                      if (json?.success && json?.url) {
                        const base = (process.env.REACT_APP_BACKEND_URL || window.location.origin).replace(/\/$/, '');
                        const full = json.url.startsWith('http') ? json.url : `${base}${json.url}`;
                        setUser((prev) => (prev ? ({ ...prev, picture: full } as any) : prev));
                      } else {
                        alert(json?.error || 'Upload ảnh thất bại');
                      }
                    }}
                  />

                  {/* Single Clean Camera Button */}
                  <div className="absolute -bottom-2 -right-2 flex items-center gap-1">
                    <button
                      onClick={() => (document.getElementById('avatar-file-hero') as HTMLInputElement)?.click()}
                      className="w-9 h-9 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg border-2 border-slate-900 flex items-center justify-center transition-transform hover:scale-110"
                      title="Tải ảnh đại diện mới"
                    >
                      <CameraIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowAvatarModal(true)}
                      className="w-9 h-9 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl shadow-lg border-2 border-slate-900 flex items-center justify-center transition-transform hover:scale-110"
                      title="Chọn avatar có sẵn"
                    >
                      <PhotoIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Traveler Basic Metadata */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {displayName}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      <CheckBadgeIcon className="w-3.5 h-3.5 text-blue-400" />
                      Du khách đã xác thực
                    </span>
                  </div>

                  <p className="text-slate-400 text-sm font-medium flex items-center justify-center sm:justify-start gap-2">
                    <span>{user.email}</span>
                    <span>•</span>
                    <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                      Mã TV: #TH-{(user.id || '8924').toString().padStart(5, '0')}
                    </span>
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/80">
                      <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                      Email bảo mật 100%
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/80">
                      <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                      Gia nhập {new Date((user as any).createdAt || '2025-12-17').toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Loyalty Status Card (TravelHub Priority Pass) */}
              <div className="w-full lg:w-96 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-blue-950/80 border border-blue-500/20 backdrop-blur-md shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                      👑
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">HẠNG THÀNH VIÊN VÀNG</p>
                      <p className="text-[11px] text-slate-400">TravelHub Priority Member</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/30">
                    1.250 Xu
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 my-3">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500"
                      style={{ width: '62%' }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>1.250 điểm hiện có</span>
                    <span className="text-amber-300 font-semibold">Mục tiêu: 2.000 điểm</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2 flex items-center gap-1.5">
                  <SparklesIcon className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    Tích lũy thêm <strong>750 điểm</strong> để lên hạng <strong>Bạch Kim</strong> (Giảm thêm 15% tất cả tour).
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Quick Stats Bar (4 Chỉ Số Du Lịch Cốt Lõi) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Stat 1: Bookings */}
          <button
            onClick={() => setActiveTab('trips')}
            className={`p-5 rounded-2xl border text-left transition-all group ${
              activeTab === 'trips'
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activeTab === 'trips' ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600'
              }`}>
                <TicketIcon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'trips' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
              }`}>
                1 Sắp đi
              </span>
            </div>
            <div className={`text-2xl font-black ${activeTab === 'trips' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              01 Tour
            </div>
            <p className={`text-xs mt-1 ${activeTab === 'trips' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
              Xem vé điện tử & E-Ticket →
            </p>
          </button>

          {/* Stat 2: TravelPoints */}
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`p-5 rounded-2xl border text-left transition-all group ${
              activeTab === 'vouchers'
                ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activeTab === 'vouchers' ? 'bg-white/20 text-white' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600'
              }`}>
                <SparklesIcon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'vouchers' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                ≈ 125.000₫
              </span>
            </div>
            <div className={`text-2xl font-black ${activeTab === 'vouchers' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              1.250 Xu
            </div>
            <p className={`text-xs mt-1 ${activeTab === 'vouchers' ? 'text-amber-100' : 'text-slate-500 dark:text-slate-400'}`}>
              Quy đổi giảm trừ thanh toán →
            </p>
          </button>

          {/* Stat 3: Vouchers */}
          <button
            onClick={() => setActiveTab('vouchers')}
            className="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:shadow-md text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <TagIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Sẵn sàng
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              04 Mã
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Giảm tới 200.000₫ tour VIP →
            </p>
          </button>

          {/* Stat 4: Wishlist */}
          <Link
            to="/account/wishlist"
            className="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-400 hover:shadow-md text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
                <HeartIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                Đã lưu
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              05 Mục
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tour & Khách sạn quan tâm →
            </p>
          </Link>
        </div>

        {/* Dashboard Main Grid: Sidebar + Interactive Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <AccountSidebar />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Interactive Tab Navigation Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                Hồ Sơ & Giấy Tờ Du Khách
              </button>

              <button
                onClick={() => setActiveTab('trips')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'trips'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <TicketIcon className="w-4 h-4" />
                Chuyến Đi Sắp Tới (1)
              </button>

              <button
                onClick={() => setActiveTab('vouchers')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'vouchers'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <GiftIcon className="w-4 h-4" />
                Kho Voucher & Điểm Thưởng (4)
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <KeyIcon className="w-4 h-4" />
                Bảo Mật & Cài Đặt
              </button>
            </div>

            {/* TAB 1: PROFILE & TRAVEL DOCUMENTS */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Card 1: Basic Information */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Thông Tin Cá Nhân</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Dùng để liên hệ xác nhận chuyến đi và nhận hỗ trợ</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                          Họ và tên
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-base truncate block">
                          {displayName}
                        </span>
                      </div>
                      <InlineNameEditor
                        current={displayName}
                        onSaved={(name) => setUser((prev) => (prev ? ({ ...prev, name } as any) : prev))}
                      />
                    </div>

                    {/* Email */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                          Địa chỉ Email
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white text-sm truncate block">
                          {user.email}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <CheckIcon className="w-3 h-3 stroke-[3]" />
                        Đã xác thực
                      </span>
                    </div>

                    {/* Phone */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                          Số điện thoại (Nhận SMS Tour)
                        </span>
                        {isEditingPhone ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="px-2 py-1 text-xs border rounded-lg dark:bg-slate-900 dark:border-slate-700 font-bold"
                            />
                            <button
                              onClick={() => setIsEditingPhone(false)}
                              className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-lg font-bold"
                            >
                              Lưu
                            </button>
                          </div>
                        ) : (
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {phone}
                          </span>
                        )}
                      </div>
                      {!isEditingPhone && (
                        <button
                          onClick={() => setIsEditingPhone(true)}
                          className="text-blue-600 hover:text-blue-700 text-xs font-semibold px-2 py-1 hover:bg-blue-50 rounded"
                        >
                          Sửa
                        </button>
                      )}
                    </div>

                    {/* Join Date */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                        Trạng thái & Ngày tham gia
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Đang hoạt động
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {new Date((user as any).createdAt || '2025-12-17').toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Traveler Passport & Autofill (Klook / Traveloka Signature Feature) */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center font-bold">
                        <IdentificationIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Giấy Tờ Tùy Thân & Khai Báo Du Lịch</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Lưu an toàn để tự động điền (Autofill) khi đặt tour và làm thủ tục cảng vụ
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                      <ShieldCheckIcon className="w-3.5 h-3.5" />
                      Mã hóa SSL 256-Bit
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ID Card / Passport */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                          Số CCCD / Hộ chiếu
                        </span>
                        {isEditingIdCard ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              value={idCard}
                              onChange={(e) => setIdCard(e.target.value)}
                              className="px-2 py-1 text-xs border rounded-lg dark:bg-slate-900 dark:border-slate-700 font-bold"
                            />
                            <button
                              onClick={() => setIsEditingIdCard(false)}
                              className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-lg font-bold"
                            >
                              Lưu
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                            {idCard}
                          </span>
                        )}
                      </div>
                      {!isEditingIdCard && (
                        <button
                          onClick={() => setIsEditingIdCard(true)}
                          className="text-blue-600 hover:text-blue-700 text-xs font-semibold px-2 py-1 hover:bg-blue-50 rounded"
                        >
                          Cập nhật
                        </button>
                      )}
                    </div>

                    {/* Nationality */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                        Quốc tịch
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <span>🇻🇳</span>
                        <span>Việt Nam (Vietnam)</span>
                      </span>
                    </div>

                    {/* Pickup Address */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                        Điểm đón mặc định
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <MapPinIcon className="w-4 h-4 text-rose-500" />
                        <span>Hà Nội (Khu vực Phố Cổ / Nhà Hát Lớn)</span>
                      </span>
                    </div>

                    {/* Special Notes */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                        Ghi chú phục vụ đặc biệt
                      </span>
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        Ăn hải sản, ưu tiên cabin tầng cao ngắm cảnh vịnh.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: UPCOMING TRIPS & E-TICKET */}
            {activeTab === 'trips' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold">
                      <TicketIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Chuyến Đi Đã Đặt</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Vé điện tử và hướng dẫn khởi hành cho hành trình sắp tới</p>
                    </div>
                  </div>
                  <Link
                    to="/tours"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>+ Đặt tour mới</span>
                  </Link>
                </div>

                {/* E-Ticket Preview Card */}
                <div className="rounded-3xl border-2 border-blue-200 dark:border-slate-700 overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-white dark:from-slate-900 dark:to-slate-900 shadow-md">
                  <div className="p-5 sm:p-6 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <img
                        src="/uploads/tours/halong-bay-karsts.jpg"
                        alt="Hạ Long Cruise"
                        className="w-20 h-20 rounded-2xl object-cover shadow-sm flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.jpg';
                        }}
                      />
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                          <CheckIcon className="w-3 h-3 stroke-[3]" />
                          Đã xác nhận & Giữ chỗ
                        </span>
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                          Du thuyền Hạ Long 3N2Đ VIP – Chuẩn 5 Sao Quốc Tế
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <ClockIcon className="w-3.5 h-3.5 text-blue-500" />
                          <span>Khởi hành: <strong>Thứ 6, tuần tới (08:00 AM)</strong></span>
                          <span>•</span>
                          <span>2 Người lớn</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-col items-end gap-2 w-full md:w-auto">
                      <span className="text-xs font-mono text-slate-400">Mã đơn: #TH-HL8924</span>
                      <div className="flex gap-2 w-full md:w-auto">
                        <Link
                          to="/tours/du-thuyen-ha-long-3n2d-vip"
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                        >
                          <QrCodeIcon className="w-4 h-4" />
                          <span>Xem Vé E-Ticket</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border-t border-blue-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-rose-500" />
                      <span>Xe Limousine đón tại: <strong>Nhà Hát Lớn Hà Nội (07:45 AM)</strong></span>
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 font-semibold">
                      Hotline điều hành tour: 0868 156 027 (24/7)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: VOUCHERS & TRAVELPOINTS */}
            {activeTab === 'vouchers' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center font-bold">
                      <GiftIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Kho Voucher & Ưu Đãi Độc Quyền</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Các mã giảm giá áp dụng trực tiếp khi thanh toán tour</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      code: 'HALONG200K',
                      discount: 'GIẢM 200.000₫',
                      title: 'Tour Du Thuyền Hạ Long & Lan Hạ 5 Sao',
                      expiry: 'Hạn dùng: 31/12/2026',
                      minSpend: 'Đơn từ 2.000.000₫',
                      tag: 'VIP Choice',
                    },
                    {
                      code: 'WEEKEND15',
                      discount: 'GIẢM 15%',
                      title: 'Tour Cuối Tuần Sapa / Đà Nẵng / Phú Quốc',
                      expiry: 'Hạn dùng: 15/11/2026',
                      minSpend: 'Tối đa giảm 300.000₫',
                      tag: 'Bán chạy',
                    },
                    {
                      code: 'FREELIMO',
                      discount: 'TẶNG XE LIMOUSINE',
                      title: 'Nâng cấp xe đưa đón Limousine Dcar cao cấp',
                      expiry: 'Hạn dùng: 30/11/2026',
                      minSpend: 'Áp dụng tour trọn gói',
                      tag: 'Đặc quyền',
                    },
                    {
                      code: 'WELCOME100',
                      discount: 'GIẢM 100.000₫',
                      title: 'Voucher chào mừng thành viên mới',
                      expiry: 'Hạn dùng: Vô thời hạn',
                      minSpend: 'Đơn từ 1.000.000₫',
                      tag: 'Tân thủ',
                    },
                  ].map((v) => (
                    <div
                      key={v.code}
                      className="p-5 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700/60 bg-gradient-to-br from-amber-50/50 to-white dark:from-slate-900 dark:to-slate-900 flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                            {v.tag}
                          </span>
                          <span className="text-[11px] text-slate-400">{v.expiry}</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white text-amber-600 dark:text-amber-400">
                          {v.discount}
                        </h4>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{v.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{v.minSpend}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-amber-200/60 dark:border-slate-800">
                        <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700">
                          {v.code}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(v.code);
                            setCopiedVoucher(v.code);
                            setTimeout(() => setCopiedVoucher(null), 2000);
                          }}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-sm"
                        >
                          {copiedVoucher === v.code ? '✓ Đã sao chép' : 'Sao chép mã'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SECURITY & SETTINGS */}
            {activeTab === 'security' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold">
                    <KeyIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Trung Tâm Bảo Mật & Đăng Nhập</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Bảo vệ thông tin tài khoản và giao dịch du lịch của bạn</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    to="/account/password"
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                        <KeyIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Đổi Mật Khẩu Đăng Nhập</h4>
                        <p className="text-xs text-slate-500">Cập nhật định kỳ để bảo vệ tài khoản</p>
                      </div>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
                  </Link>

                  <Link
                    to="/account/settings"
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                        <Cog6ToothIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Cài Đặt & Thông Báo</h4>
                        <p className="text-xs text-slate-500">Tùy chỉnh SMS, Email và bảo mật 2 lớp</p>
                      </div>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      {user && (
        <AvatarSelectorModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          userId={parseInt(user.id)}
          currentAvatar={fullAvatarUrl || undefined}
          onAvatarChange={(newAvatarUrl) => {
            setUser((prev) => (prev ? ({ ...prev, picture: newAvatarUrl, avatarUrl: newAvatarUrl } as any) : prev));
          }}
        />
      )}
    </div>
  );
}
