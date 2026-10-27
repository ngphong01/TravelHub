export type Destination = {
  slug: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  price: number;
  country: string;
  tags: string[];
};

export const DESTINATIONS: Destination[] = [
  // Việt Nam – Ninh Bình
  {
    slug: "ninh-binh",
    name: "Ninh Bình",
    description: "Di sản Tràng An, Tam Cốc – Bích Động, hang động và non nước hữu tình.",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    price: 5900000,
    country: "Việt Nam",
    tags: ["nature", "adventure", "romantic"]
  },
  // Việt Nam – Hạ Long
  {
    slug: "ha-long",
    name: "Hạ Long",
    description: "Vịnh Hạ Long – kỳ quan thiên nhiên thế giới với du thuyền và hang động.",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    price: 7900000,
    country: "Việt Nam",
    tags: ["nature", "resort", "luxury"]
  },
  // Việt Nam – Đà Lạt
  {
    slug: "da-lat",
    name: "Đà Lạt",
    description: "Thành phố sương mù, hoa và những nông trại – khí hậu mát mẻ quanh năm.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    price: 6200000,
    country: "Việt Nam",
    tags: ["nature", "romantic", "food"]
  },
  // Việt Nam – Phú Quốc
  {
    slug: "phu-quoc",
    name: "Phú Quốc",
    description: "Thiên đường nghỉ dưỡng với biển xanh, cát trắng và resort cao cấp.",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    price: 10900000,
    country: "Việt Nam",
    tags: ["beach", "resort", "luxury"]
  },
  // Thái Lan – Phuket
  {
    slug: "phuket",
    name: "Phuket",
    description: "Hòn đảo nổi tiếng của Thái Lan – biển đẹp, tiệc tùng và hoạt động biển.",
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
    price: 9900000,
    country: "Thái Lan",
    tags: ["beach", "entertainment", "food"]
  },
  // Nhật Bản – Kyoto
  {
    slug: "kyoto",
    name: "Kyoto",
    description: "Cố đô Nhật Bản với đền chùa, rừng trúc Arashiyama và văn hóa truyền thống.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    price: 23900000,
    country: "Nhật Bản",
    tags: ["history", "culture", "museum"]
  },
  // Mỹ – Grand Canyon
  {
    slug: "grand-canyon",
    name: "Grand Canyon",
    description: "Hẻm núi kỳ vĩ ở Arizona – trekking, tham quan và ngắm bình minh tuyệt đẹp.",
    image: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    price: 27900000,
    country: "Mỹ",
    tags: ["adventure", "nature", "modern"]
  },
  // Ai Cập – Giza
  {
    slug: "giza",
    name: "Kim Tự Tháp Giza",
    description: "Kỳ quan cổ đại – kim tự tháp và tượng Nhân Sư bên sa mạc Sahara.",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    price: 19900000,
    country: "Ai Cập",
    tags: ["history", "culture", "adventure"]
  },
  {
    slug: "ha-noi",
    name: "Hà Nội",
    description: "Thủ đô nghìn năm văn hiến với phố cổ, ẩm thực phong phú và hồ Hoàn Kiếm thơ mộng.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    price: 8900000,
    country: "Việt Nam",
    tags: ["city", "culture", "food"]
  },
  {
    slug: "da-nang",
    name: "Đà Nẵng",
    description: "Thành phố đáng sống bên biển với Bà Nà Hills, Cầu Vàng và những bãi biển tuyệt đẹp.",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    price: 7900000,
    country: "Việt Nam",
    tags: ["beach", "nature", "city"]
  },
  {
    slug: "paris",
    name: "Paris",
    description: "Kinh đô ánh sáng với tháp Eiffel, bảo tàng Louvre và những quán cà phê ven đường.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    price: 19900000,
    country: "Pháp",
    tags: ["romantic", "city", "museum"]
  },
  {
    slug: "bali",
    name: "Bali",
    description: "Thiên đường nhiệt đới của Indonesia, nổi tiếng với ruộng bậc thang, đền cổ và bãi biển.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    price: 15900000,
    country: "Indonesia",
    tags: ["beach", "resort", "nature"]
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    description: "Thành phố hiện đại bậc nhất, giao thoa giữa truyền thống và công nghệ.",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    price: 22900000,
    country: "Nhật Bản",
    tags: ["city", "tech", "food"]
  },
  {
    slug: "london",
    name: "London",
    description: "Thành phố cổ kính với Big Ben, Tower Bridge và những bảo tàng lừng danh thế giới.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    price: 18900000,
    country: "Anh",
    tags: ["city", "culture", "museum"]
  },
  {
    slug: "new-york",
    name: "New York",
    description: "Thành phố không bao giờ ngủ với Times Square, Central Park và tượng Nữ thần Tự do.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
    price: 24900000,
    country: "Mỹ",
    tags: ["city", "shopping", "entertainment"]
  },
  {
    slug: "dubai",
    name: "Dubai",
    description: "Thành phố xa hoa với Burj Khalifa, đảo nhân tạo và những trung tâm mua sắm sang trọng.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    rating: 4.4,
    price: 29900000,
    country: "UAE",
    tags: ["luxury", "shopping", "modern"]
  },
  {
    slug: "sydney",
    name: "Sydney",
    description: "Thành phố cảng xinh đẹp với nhà hát Opera, cầu Harbour và những bãi biển tuyệt vời.",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    price: 17900000,
    country: "Úc",
    tags: ["beach", "city", "nature"]
  },
  {
    slug: "singapore",
    name: "Singapore",
    description: "Quốc đảo xanh với Gardens by the Bay, Marina Bay Sands và ẩm thực đa dạng.",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    price: 16900000,
    country: "Singapore",
    tags: ["city", "modern", "food"]
  },
  {
    slug: "bangkok",
    name: "Bangkok",
    description: "Thành phố sôi động với chùa Vàng, kênh đào và ẩm thực đường phố hấp dẫn.",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
    rating: 4.3,
    price: 9900000,
    country: "Thái Lan",
    tags: ["city", "culture", "food"]
  },
  {
    slug: "seoul",
    name: "Seoul",
    description: "Thủ đô hiện đại với cung điện cổ, K-pop và ẩm thực Hàn Quốc đặc sắc.",
    image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    price: 14900000,
    country: "Hàn Quốc",
    tags: ["city", "culture", "food"]
  },
  {
    slug: "rome",
    name: "Rome",
    description: "Thành phố vĩnh cửu với Colosseum, Vatican và những di tích lịch sử vĩ đại.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    price: 17900000,
    country: "Ý",
    tags: ["history", "culture", "romantic"]
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    description: "Thành phố nghệ thuật với kiến trúc Gaudi, bãi biển Địa Trung Hải và ẩm thực Tây Ban Nha.",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
    price: 15900000,
    country: "Tây Ban Nha",
    tags: ["art", "beach", "culture"]
  },
  {
    slug: "amsterdam",
    name: "Amsterdam",
    description: "Thành phố kênh đào với bảo tàng Van Gogh, nhà cổ và văn hóa tự do.",
    image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80",
    rating: 4.4,
    price: 16900000,
    country: "Hà Lan",
    tags: ["culture", "art", "romantic"]
  },
  {
    slug: "prague",
    name: "Prague",
    description: "Thành phố cổ tích với lâu đài Prague, cầu Charles và kiến trúc Gothic tuyệt đẹp.",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    price: 12900000,
    country: "Cộng hòa Séc",
    tags: ["history", "romantic", "culture"]
  },
  {
    slug: "vienna",
    name: "Vienna",
    description: "Thủ đô âm nhạc với cung điện Schönbrunn, nhà hát opera và văn hóa cà phê.",
    image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
    price: 14900000,
    country: "Áo",
    tags: ["culture", "music", "romantic"]
  },
  {
    slug: "istanbul",
    name: "Istanbul",
    description: "Thành phố giao thoa Á-Âu với Hagia Sophia, Grand Bazaar và văn hóa Ottoman.",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
    rating: 4.4,
    price: 11900000,
    country: "Thổ Nhĩ Kỳ",
    tags: ["culture", "history", "shopping"]
  },
  {
    slug: "cairo",
    name: "Cairo",
    description: "Thành phố kim tự tháp với Giza, bảo tàng Ai Cập và sông Nile huyền bí.",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80",
    rating: 4.2,
    price: 8900000,
    country: "Ai Cập",
    tags: ["history", "culture", "adventure"]
  },
  {
    slug: "cape-town",
    name: "Cape Town",
    description: "Thành phố mũi với Table Mountain, bãi biển đẹp và văn hóa Nam Phi đa dạng.",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    price: 13900000,
    country: "Nam Phi",
    tags: ["nature", "beach", "adventure"]
  }
];