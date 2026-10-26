import { Link } from 'react-router-dom';
import {
  SunIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
  BuildingStorefrontIcon,
  BuildingLibraryIcon,
  HeartIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
  TrophyIcon,
  SparklesIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  TagIcon,
  PhoneArrowUpRightIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import SEOHead from '../components/SEOHead';

export default function Categories() {
  const categories = [
    { 
      title: "Biển & Resort", 
      desc: "Bãi biển xanh ngọc, resort 5 sao sang trọng và lặn ngắm san hô", 
      href: "/destinations?tags=beach,resort",
      Icon: SunIcon,
      image: "/uploads/tours/phuquoc-white-sand.jpg",
      gradient: "from-blue-600 to-cyan-500",
      count: "150+ điểm đến",
      features: ["Bãi biển cát trắng", "Resort chuẩn 5 sao", "Lặn biển & Du thuyền"],
      popular: ["Phú Quốc", "Nha Trang", "Maldives", "Bali"]
    },
    { 
      title: "Thành phố & Văn hóa", 
      desc: "Khám phá nhịp sống hiện đại, kiến trúc lịch sử và lễ hội bản địa", 
      href: "/destinations?tags=city,culture",
      Icon: BuildingOffice2Icon,
      image: "/uploads/avatars/ha-noi.jpg",
      gradient: "from-purple-600 to-pink-500",
      count: "200+ điểm đến",
      features: ["Bảo tàng nghệ thuật", "Phố cổ nghìn năm", "Kiến trúc biểu tượng"],
      popular: ["Tokyo", "Hà Nội", "Paris", "Rome"]
    },
    { 
      title: "Thiên nhiên & Mạo hiểm", 
      desc: "Chinh phục đỉnh núi cao, trekking rừng nguyên sinh và cắm trại", 
      href: "/destinations?tags=nature,adventure",
      Icon: GlobeAltIcon,
      image: "/uploads/tours/sapa-fansipan-peak.jpg",
      gradient: "from-emerald-600 to-teal-500",
      count: "100+ điểm đến",
      features: ["Trekking đường dài", "Leo núi mạo hiểm", "Thám hiểm hang động"],
      popular: ["Hà Giang", "Sapa", "Phong Nha", "New Zealand"]
    },
    { 
      title: "Ẩm thực & Trải nghiệm", 
      desc: "Hành trình vị giác với street food trứ danh và lớp học làm bếp", 
      href: "/destinations?tags=food,experience",
      Icon: BuildingStorefrontIcon,
      image: "/uploads/restaurants/pho-batdan.jpg",
      gradient: "from-amber-600 to-orange-500",
      count: "80+ điểm đến",
      features: ["Food tour chợ đêm", "Lớp học làm bánh & nấu ăn", "Michelin Guide"],
      popular: ["Huế", "Bangkok", "Đà Nẵng", "Osaka"]
    },
    { 
      title: "Lịch sử & Di sản", 
      desc: "Tìm về cội nguồn với các quần thể di sản UNESCO thế giới", 
      href: "/destinations?tags=history,heritage",
      Icon: BuildingLibraryIcon,
      image: "/uploads/tours/hoian-lanterns-night.jpg",
      gradient: "from-amber-700 to-yellow-600",
      count: "120+ điểm đến",
      features: ["Di tích nghìn năm", "Đền đài Angkor", "Lăng tẩm cố đô"],
      popular: ["Hội An", "Cố đô Huế", "Angkor Wat", "Hy Lạp"]
    },
    { 
      title: "Lãng mạn & Honeymoon", 
      desc: "Không gian riêng tư, ngắm hoàng hôn rực rỡ bên người thương", 
      href: "/destinations?tags=romantic,honeymoon",
      Icon: HeartIcon,
      image: "/uploads/destinations/Tour lãng mạn cho đôi.jpg",
      gradient: "from-rose-600 to-pink-500",
      count: "60+ điểm đến",
      features: ["Villa hướng biển", "Bữa tối nến lãng mạn", "Spa thư giãn đôi"],
      popular: ["Đà Lạt", "Santorini", "Phú Quốc", "Bora Bora"]
    },
    { 
      title: "Gia đình & Trẻ nhỏ", 
      desc: "Các điểm vui chơi an toàn, công viên giải trí và khu nghỉ dưỡng", 
      href: "/destinations?tags=family,kids",
      Icon: UsersIcon,
      image: "/uploads/hotels/danang-beach.jpg",
      gradient: "from-blue-600 to-indigo-600",
      count: "90+ điểm đến",
      features: ["Công viên nước", "Safari hoang dã", "Phòng Family Suite"],
      popular: ["VinWonders", "Sun World", "Singapore", "Disneyland"]
    },
    { 
      title: "Tâm linh & Thiền định", 
      desc: "Thanh lọc tâm hồn tại các cổ tự, thiền viện thanh tịnh", 
      href: "/destinations?tags=spiritual,meditation",
      Icon: AdjustmentsHorizontalIcon,
      image: "/uploads/tours/ninhbinh-ancient-temple.jpg",
      gradient: "from-teal-600 to-emerald-700",
      count: "40+ điểm đến",
      features: ["Khóa tu ngắn ngày", "Yoga trên mây", "Không gian tĩnh lặng"],
      popular: ["Yên Tử", "Tây Thiên", "Bhangarh", "Bhutan"]
    },
    { 
      title: "Thể thao & Hoạt động", 
      desc: "Lướt sóng biển, dù lượn, trượt tuyết và sân golf chuẩn PGA", 
      href: "/destinations?tags=sports,activities",
      Icon: TrophyIcon,
      image: "/uploads/tours/halong-kayak-cave.jpg",
      gradient: "from-red-600 to-orange-600",
      count: "70+ điểm đến",
      features: ["Lướt ván cano", "Dù lượn ngắm đèo", "Trượt tuyết mùa đông"],
      popular: ["Mũi Né", "Đà Lạt", "Niseko", "Thụy Sĩ"]
    }
  ];

  return (
    <>
      <SEOHead
        title="Danh Mục Khám Phá Du Lịch Theo Sở Thích - TravelHub"
        description="Khám phá các tour du lịch được phân loại tinh tế: biển đảo, thiên nhiên, trekking mạo hiểm, nghỉ dưỡng gia đình, tuần trăng mật và ẩm thực."
        url="/categories"
      />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white py-20 lg:py-28">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
                backgroundSize: '36px 36px'
              }}
            />
          </div>
          <div className="absolute top-10 left-10 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 border border-white/20 backdrop-blur-md rounded-full px-4 py-2 text-sm font-semibold text-teal-200 mb-6 shadow-sm">
              <SparklesIcon className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Khám Phá Theo Phong Cách Sống & Sở Thích</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              Tìm Điểm Đến <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-200 to-amber-200">
                Sinh Ra Để Dành Cho Bạn
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-teal-100/90 max-w-3xl mx-auto leading-relaxed font-light">
              Dù bạn yêu thích biển xanh cát trắng, đam mê chinh phục đỉnh núi hoang sơ hay tìm kiếm không gian lãng mạn cho kỳ trăng mật.
            </p>
          </div>
        </section>

        {/* Categories Grid Section */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
              9 Nhóm Trải Nghiệm Du Lịch Đỉnh Cao
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Mỗi danh mục được đội ngũ chuyên gia TravelHub tuyển chọn kỹ lưỡng theo từng tiêu chuẩn khắt khe
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Link 
                key={index}
                to={category.href} 
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Photo Cover Header */}
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Count Badge on Photo */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/20">
                    {category.count}
                  </div>

                  {/* Icon Circle */}
                  <div className={`absolute bottom-4 left-4 w-12 h-12 rounded-2xl bg-gradient-to-br ${category.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <category.Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {category.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-5 leading-relaxed">
                      {category.desc}
                    </p>
                    
                    {/* Features list */}
                    <div className="space-y-2 mb-5">
                      {category.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    {/* Popular Destinations Chips */}
                    <div className="mb-4">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Điểm đến hot:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {category.popular.map((dest, idx) => (
                          <span 
                            key={idx} 
                            className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium"
                          >
                            {dest}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* CTA Link */}
                    <div className="flex items-center justify-between text-sm font-bold text-teal-600 dark:text-teal-400 pt-2">
                      <span>Khám phá ngay</span>
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Why Choose TravelHub Section */}
        <section className="py-20 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-3 py-1 rounded-full mb-3">
                <ShieldCheckIcon className="h-4 w-4" />
                Cam kết từ nền tảng
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">
                Vì Sao Nên Đồng Hành Cùng TravelHub?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Chúng tôi mang đến giải pháp du lịch toàn diện với độ an toàn và chất lượng dịch vụ dẫn đầu thị trường.
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center group hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
                  <ShieldCheckIcon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Kiểm duyệt chất lượng</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  100% đối tác tour, khách sạn và dịch vụ được kiểm tra pháp lý và đánh giá thực tế.
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center group hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <TagIcon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Giá cả minh bạch</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Cam kết không phụ phí ẩn, chiết khấu trực tiếp với hệ thống voucher cập nhật mỗi ngày.
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center group hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                  <PhoneArrowUpRightIcon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hỗ trợ 24/7 tức thì</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Tích hợp trợ lý AI thông minh cùng đội ngũ tư vấn viên sẵn sàng xử lý mọi phát sinh trên đường đi.
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center group hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <UserGroupIcon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Cá nhân hóa tối đa</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Gợi ý lịch trình và dịch vụ theo độ tuổi, ngân sách và sở thích cá nhân từng du khách.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl sm:text-5xl font-black text-teal-600 dark:text-teal-400 mb-2">850+</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Điểm đến phong phú</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-black text-blue-600 dark:text-blue-400 mb-2">80+</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Tỉnh thành & Quốc gia</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-black text-purple-600 dark:text-purple-400 mb-2">25K+</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Khách hàng tin chọn</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-black text-amber-500 dark:text-amber-400 mb-2">9</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Nhóm trải nghiệm đa dạng</div>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Home CTA */}
        <section className="py-16 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-teal-600/30 hover:shadow-xl hover:scale-105 transition-all"
          >
            <span>Quay lại trang chủ TravelHub</span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </section>
      </main>
    </>
  );
}

