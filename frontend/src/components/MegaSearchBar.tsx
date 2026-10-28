import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  MapPinIcon,
  SparklesIcon,
  ChevronDownIcon,
  XMarkIcon,
  FireIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  BookmarkSquareIcon,
} from '@heroicons/react/24/outline';
import { getAuthenticImage, handleImageError } from '../utils/imageFallback';

type SearchMode = 'tours' | 'hotels' | 'destinations';

const POPULAR_TOURS = [
  { id: 1, name: 'Đà Nẵng - Hội An', tag: 'Biển & Di sản', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Vịnh Hạ Long', tag: 'Kỳ quan thiên nhiên', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Đảo Ngọc Phú Quốc', tag: 'Thiên đường nghỉ dưỡng', image: '/images/destinations/phu-quoc.jpg' },
  { id: 4, name: 'Sa Pa - Fansipan', tag: 'Săn mây & Núi rừng', image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=300&q=80' },
  { id: 5, name: 'Ninh Bình - Tràng An', tag: 'Non nước hữu tình', image: '/images/destinations/ninh-binh.jpg' },
  { id: 6, name: 'Đà Lạt Mộng Mơ', tag: 'Khí hậu ôn đới', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80' },
];

const POPULAR_HOTELS = [
  { id: 1, name: 'Đà Nẵng', tag: 'Ven biển Mỹ Khê & Bán đảo Sơn Trà', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Phú Quốc', tag: 'Resort 5 sao Bãi Trường & Sunset', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Hà Nội', tag: 'Khách sạn Phố Cổ & Hồ Tây', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80' },
  { id: 4, name: 'Nha Trang', tag: 'Trần Phú view trọn vịnh ngọc', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300&q=80' },
  { id: 5, name: 'Hội An', tag: 'Boutique Resort ven sông Hoài', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=300&q=80' },
  { id: 6, name: 'Đà Lạt', tag: 'Biệt thự sương mù & Hồ Tuyền Lâm', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80' },
];

const POPULAR_DESTINATIONS = [
  { id: 1, name: 'Vịnh Hạ Long', tag: 'Kỳ quan Thiên nhiên Thế giới (UNESCO)', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Quần thể Tràng An', tag: 'Di sản Văn hóa & Thiên nhiên Kép', image: '/images/destinations/ninh-binh.jpg' },
  { id: 3, name: 'Phố cổ Hội An', tag: 'Di sản Văn hóa & Đèn lồng lung linh', image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=300&q=80' },
  { id: 4, name: 'Hà Giang', tag: 'Công viên Địa chất Toàn cầu Đồng Văn', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80' },
  { id: 5, name: 'Phong Nha - Kẻ Bàng', tag: 'Vương quốc hang động thạch nhũ', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=300&q=80' },
  { id: 6, name: 'Côn Đảo', tag: 'Biển đảo hoang sơ & Di tích thiêng liêng', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=300&q=80' },
];

export default function MegaSearchBar() {
  const navigate = useNavigate();

  // Mode state: 'tours' (Klook), 'hotels' (Booking.com), 'destinations' (Vietnam Travel)
  const [searchMode, setSearchMode] = useState<SearchMode>('tours');

  // Search state
  const [destinationQuery, setDestinationQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [departureDate, setDepartureDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState('');

  // Dropdown visibility states
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  const destRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setShowGuestsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalGuests = adults + children;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = (selectedDestination || destinationQuery).trim();

    if (searchMode === 'tours') {
      const queryParams = new URLSearchParams();
      if (q) queryParams.set('q', q);
      if (departureDate) queryParams.set('date', departureDate);
      if (totalGuests > 1) queryParams.set('guests', totalGuests.toString());
      navigate(`/tours?${queryParams.toString()}`);
    } else if (searchMode === 'hotels') {
      const queryParams = new URLSearchParams();
      if (q) {
        queryParams.set('city', q);
        queryParams.set('q', q);
      }
      if (departureDate) queryParams.set('checkIn', departureDate);
      if (rooms > 1) queryParams.set('rooms', rooms.toString());
      navigate(`/hotels?${queryParams.toString()}`);
    } else {
      // destinations
      const queryParams = new URLSearchParams();
      if (q) queryParams.set('q', q);
      if (selectedRegion) queryParams.set('region', selectedRegion);
      navigate(`/destinations?${queryParams.toString()}`);
    }
  };

  const handleSelectDest = (destName: string) => {
    setSelectedDestination(destName);
    setDestinationQuery(destName);
    setShowDestDropdown(false);
  };

  // Get current popular suggestions list based on active tab
  const activeSuggestions =
    searchMode === 'hotels'
      ? POPULAR_HOTELS
      : searchMode === 'destinations'
      ? POPULAR_DESTINATIONS
      : POPULAR_TOURS;

  return (
    <div className="w-full max-w-5xl mx-auto relative z-30">
      {/* Category Tabs Header - Chuẩn OTA quốc tế đồng nhất 1 màu Brand Blue */}
      <div className="flex items-center gap-2 mb-3 px-2 overflow-x-auto scrollbar-none">
        {/* Tab 1: Tour trọn gói */}
        <button
          type="button"
          onClick={() => {
            setSearchMode('tours');
            setSelectedDestination(null);
          }}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-sm ${
            searchMode === 'tours'
              ? 'bg-white text-blue-600 border border-blue-200 shadow-sm'
              : 'bg-black/40 hover:bg-black/60 text-white/90 hover:text-white border border-white/10'
          }`}
        >
          <SparklesIcon className={`w-4 h-4 ${searchMode === 'tours' ? 'text-blue-600' : 'text-white/80'}`} />
          <span>Tour trọn gói</span>
        </button>

        {/* Tab 2: Khách sạn & Resort */}
        <button
          type="button"
          onClick={() => {
            setSearchMode('hotels');
            setSelectedDestination(null);
          }}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-sm ${
            searchMode === 'hotels'
              ? 'bg-white text-blue-600 border border-blue-200 shadow-sm'
              : 'bg-black/40 hover:bg-black/60 text-white/90 hover:text-white border border-white/10'
          }`}
        >
          <BuildingOfficeIcon className={`w-4 h-4 ${searchMode === 'hotels' ? 'text-blue-600' : 'text-white/80'}`} />
          <span>Khách sạn & Resort</span>
        </button>

        {/* Tab 3: Khám phá Điểm đến */}
        <button
          type="button"
          onClick={() => {
            setSearchMode('destinations');
            setSelectedDestination(null);
          }}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-sm ${
            searchMode === 'destinations'
              ? 'bg-white text-blue-600 border border-blue-200 shadow-sm'
              : 'bg-black/40 hover:bg-black/60 text-white/90 hover:text-white border border-white/10'
          }`}
        >
          <GlobeAltIcon className={`w-4 h-4 ${searchMode === 'destinations' ? 'text-blue-600' : 'text-white/80'}`} />
          <span>Khám phá Điểm đến</span>
        </button>

        {/* Tab 4: Lập lịch trình AI */}
        <button
          type="button"
          onClick={() => navigate('/planner')}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md text-xs sm:text-sm font-semibold border border-white/15 shadow-sm flex items-center gap-1.5 transition ml-auto"
        >
          <SparklesIcon className="w-4 h-4 text-blue-300" />
          <span>Lập lịch trình AI</span>
        </button>
      </div>

      {/* Main Booking.com & Luxury OTA Signature Search Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.22)] border border-white/80 dark:border-slate-800 ring-2 ring-amber-400/40 hover:ring-amber-400/70 flex flex-col lg:flex-row items-stretch gap-1.5 sm:gap-2 transition-all"
      >
        {/* 1. Destination / Location Section */}
        <div ref={destRef} className="relative flex-[1.4] p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition group cursor-pointer">
          <div
            onClick={() => {
              setShowDestDropdown(!showDestDropdown);
              setShowGuestsDropdown(false);
            }}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              {searchMode === 'hotels' ? (
                <BuildingOfficeIcon className="w-4 h-4 text-blue-600" />
              ) : searchMode === 'destinations' ? (
                <GlobeAltIcon className="w-4 h-4 text-blue-600" />
              ) : (
                <MapPinIcon className="w-4 h-4 text-blue-600" />
              )}
              <span>
                {searchMode === 'hotels'
                  ? 'Khách sạn / Thành phố'
                  : searchMode === 'destinations'
                  ? 'Địa danh / Danh thắng'
                  : 'Điểm đến / Tour'}
              </span>
            </div>
            <input
              type="text"
              value={destinationQuery}
              onChange={(e) => {
                setDestinationQuery(e.target.value);
                setSelectedDestination(null);
                setShowDestDropdown(true);
              }}
              placeholder={
                searchMode === 'hotels'
                  ? 'Bạn muốn nghỉ dưỡng ở đâu? (Đà Nẵng, Phú Quốc...)'
                  : searchMode === 'destinations'
                  ? 'Tìm di sản, kỳ quan (Vịnh Hạ Long, Hội An...)'
                  : 'Bạn muốn đi tour nào? (Đà Nẵng, Sa Pa...)'
              }
              className="w-full bg-transparent font-bold text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none truncate"
            />
          </div>

          {/* Destination Dropdown Popup */}
          {showDestDropdown && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 p-5 z-50 animate-soft-pop max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-slate-800">
                <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FireIcon className="w-4 h-4 text-amber-500" />
                  {searchMode === 'hotels'
                    ? 'Thành phố & Resort được yêu thích'
                    : searchMode === 'destinations'
                    ? 'Danh thắng & Di sản nổi bật'
                    : 'Điểm đến thịnh hành nhất'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowDestDropdown(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeSuggestions.map((dest) => (
                  <div
                    key={dest.id}
                    onClick={() => handleSelectDest(dest.name)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-cyan-50/70 dark:hover:bg-cyan-950/40 border border-transparent hover:border-cyan-200 dark:hover:border-cyan-800/50 cursor-pointer transition group"
                  >
                    <img
                      src={getAuthenticImage(dest.image, dest.name, searchMode === 'hotels' ? 'hotel' : 'destination')}
                      alt={dest.name}
                      className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        handleImageError(e, dest.name, searchMode === 'hotels' ? 'hotel' : 'destination');
                      }}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 truncate">
                        {dest.name}
                      </p>
                      <span className="text-[11px] text-gray-500 dark:text-slate-400 truncate block">{dest.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-[1px] bg-gray-200 dark:bg-slate-800 my-2" />

        {/* 2. Middle Section: Date or Region Selection */}
        {searchMode !== 'destinations' ? (
          <div className="relative flex-1 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition group cursor-pointer">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <CalendarDaysIcon className="w-4 h-4 text-blue-600" />
              <span>{searchMode === 'hotels' ? 'Ngày nhận phòng' : 'Thời gian đi'}</span>
            </div>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full bg-transparent font-bold text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            />
          </div>
        ) : (
          <div className="relative flex-1 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition group cursor-pointer">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <BookmarkSquareIcon className="w-4 h-4 text-blue-600" />
              <span>Khu vực vùng miền</span>
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-transparent font-bold text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="" className="dark:bg-slate-900">Tất cả vùng miền</option>
              <option value="mien-bac" className="dark:bg-slate-900">Miền Bắc (Đông Bắc, Tây Bắc, Đồng bằng)</option>
              <option value="mien-trung" className="dark:bg-slate-900">Miền Trung (Di sản & Biển đảo)</option>
              <option value="tay-nguyen" className="dark:bg-slate-900">Tây Nguyên (Đại ngàn & Cà phê)</option>
              <option value="mien-nam" className="dark:bg-slate-900">Miền Nam (Sông nước & Đô thị)</option>
            </select>
          </div>
        )}

        {/* 3. Guests & Rooms Section */}
        {searchMode !== 'destinations' ? (
          <div ref={guestsRef} className="relative flex-1 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition group cursor-pointer">
            <div
              onClick={() => {
                setShowGuestsDropdown(!showGuestsDropdown);
                setShowDestDropdown(false);
              }}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                <UserGroupIcon className="w-4 h-4 text-blue-600" />
                <span>{searchMode === 'hotels' ? 'Số khách & Phòng' : 'Số lượng khách'}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                <span>
                  {searchMode === 'hotels'
                    ? `${totalGuests} khách · ${rooms} phòng`
                    : `${totalGuests} khách ${children > 0 ? `(${adults} lớn, ${children} trẻ)` : ''}`}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Guests Dropdown Popup */}
            {showGuestsDropdown && (
              <div className="absolute top-full right-0 w-72 sm:w-80 mt-3 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 p-5 z-50 animate-soft-pop">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-gray-700 dark:text-slate-200 uppercase tracking-wider">
                    {searchMode === 'hotels' ? 'Khách & Số phòng' : 'Chọn hành khách'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowGuestsDropdown(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Adults Counter */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">Người lớn</p>
                    <span className="text-xs text-gray-400">Từ 12 tuổi trở lên</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-slate-700 flex items-center justify-center font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-gray-900 dark:text-white w-5 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-slate-700 flex items-center justify-center font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children Counter */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">Trẻ em</p>
                    <span className="text-xs text-gray-400">Từ 2 đến 11 tuổi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-slate-700 flex items-center justify-center font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-gray-900 dark:text-white w-5 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-slate-700 flex items-center justify-center font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Rooms Counter (For Hotels - Booking.com style) */}
                {searchMode === 'hotels' && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">Số lượng phòng</p>
                      <span className="text-xs text-gray-400">Phòng lưu trú</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setRooms(Math.max(1, rooms - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-slate-700 flex items-center justify-center font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm text-gray-900 dark:text-white w-5 text-center">{rooms}</span>
                      <button
                        type="button"
                        onClick={() => setRooms(rooms + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-slate-700 flex items-center justify-center font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowGuestsDropdown(false)}
                  className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition"
                >
                  Áp dụng
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative flex-1 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition group flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Trải nghiệm nổi bật
            </span>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">
              Di sản · Ẩm thực · Nghỉ dưỡng
            </p>
          </div>
        )}

        {/* 4. Submit Search Button */}
        <div className="p-1 flex items-center">
          <button
            type="submit"
            className="w-full lg:w-auto px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
          >
            <MagnifyingGlassIcon className="w-5 h-5 stroke-[2.5]" />
            <span>
              {searchMode === 'hotels'
                ? 'Tìm Khách Sạn'
                : searchMode === 'destinations'
                ? 'Khám Phá'
                : 'Tìm Kiếm Tour'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
