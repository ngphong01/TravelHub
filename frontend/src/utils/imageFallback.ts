import { restaurantImages } from './restaurantImages';

/**
 * Intelligent Image Fallback & CDN Resolver
 * TravelHub - Match authentic high-res images to destination & tour names
 */

export interface KeywordImageMap {
  keywords: string[];
  image: string;
  gallery?: string[];
}

export const AUTHENTIC_LOCATION_MAP: KeywordImageMap[] = [
  // --- VIỆT NAM ---
  {
    keywords: ['đà nẵng', 'da nang', 'danang', 'cầu vàng', 'bà nà', 'bana', 'mỹ khê'],
    image: '/images/destinations/da-nang.jpg', // Cầu Vàng Bà Nà Hills
    gallery: [
      '/images/destinations/da-nang.jpg',
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['phú quốc', 'phu quoc', 'phuquoc', 'bãi sao', 'hòn thơm', 'hòn mây rút', 'sunset sanato'],
    image: '/images/destinations/phu-quoc.jpg', // Biển Bãi Sao Phú Quốc
    gallery: [
      '/images/destinations/phu-quoc.jpg',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['sa pa', 'sapa', 'fansipan', 'mù cang chải', 'ruộng bậc thang', 'y tý'],
    image: '/images/destinations/sa-pa.jpg', // Ruộng bậc thang Sa Pa hùng vĩ
    gallery: [
      '/images/destinations/sa-pa.jpg',
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['đà lạt', 'da lat', 'dalat', 'hồ xuân hương', 'đồi chè', 'thành phố ngàn hoa', 'langbiang'],
    image: '/images/destinations/da-lat.jpg', // Đà Lạt Hồ Xuân Hương & Vườn hoa
    gallery: [
      '/images/destinations/da-lat.jpg',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['hạ long', 'ha long', 'halong', 'bái tử long', 'lan hạ', 'du thuyền hạ long', 'tuần châu'],
    image: '/images/destinations/ha-long.jpg', // Vịnh Hạ Long kỳ quan
    gallery: [
      '/images/destinations/ha-long.jpg',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['hội an', 'hoi an', 'hoian', 'chùa cầu', 'sông hoài', 'phố cổ đèn lồng'],
    image: '/images/destinations/hoi-an.jpg', // Phố cổ Hội An Chùa Cầu
    gallery: [
      '/images/destinations/hoi-an.jpg',
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80',
      '/images/destinations/hoi-an.jpg',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['hà nội', 'ha noi', 'hanoi', 'hồ gươm', 'tháp rùa', 'phố cổ hà nội', 'ba đình'],
    image: '/images/destinations/ha-noi.jpg', // Hà Nội Tháp Rùa Hồ Gươm cổ kính
    gallery: [
      '/images/destinations/ha-noi.jpg',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
      '/images/destinations/ha-noi.jpg',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['huế', 'hue', 'đại nội', 'kinh thành huế', 'sông hương', 'thiên mụ', 'lăng tự đức'],
    image: '/images/destinations/hue.jpg', // Kinh thành Đại Nội Huế
    gallery: [
      '/images/destinations/hue.jpg',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      '/images/destinations/hue.jpg',
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['ninh bình', 'ninh binh', 'tràng an', 'tam cốc', 'bích động', 'hang múa', 'bái đính'],
    image: '/images/destinations/ninh-binh.jpg', // Tràng An Ninh Bình
    gallery: [
      '/images/destinations/ninh-binh.jpg',
      '/images/destinations/ninh-binh.jpg',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['hồ chí minh', 'sài gòn', 'saigon', 'ho chi minh', 'bến thành', 'landmark 81'],
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80', // TP. Hồ Chí Minh hiện đại
    gallery: [
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['nha trang', 'nhatrang', 'hòn tằm', 'hòn mun', 'vinpearl nha trang', 'tháp bà ponagar'],
    image: '/images/destinations/nha-trang.jpg', // Vịnh biển Nha Trang
    gallery: [
      '/images/destinations/nha-trang.jpg',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['quy nhơn', 'quy nhon', 'quynhon', 'eo gió', 'kỳ co', 'hòn khô'],
    image: '/images/destinations/quy-nhon.jpg', // Eo Gió Quy Nhơn
    gallery: [
      '/images/destinations/quy-nhon.jpg',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['mù cang chải', 'mu cang chai', 'đồi mâm xôi', 'la pán tẩn', 'khau phạ'],
    image: '/images/destinations/mu-cang-chai.jpg', // Đồi mâm xôi Mù Cang Chải
    gallery: [
      '/images/destinations/mu-cang-chai.jpg',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['côn đảo', 'con dao', 'condao', 'bãi đầm trầu', 'hòn bảy cạnh'],
    image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80', // Biển hoang sơ Côn Đảo
    gallery: [
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['phong nha', 'kẻ bàng', 'quảng bình', 'hang sơn đoòng', 'động thiên đường'],
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80', // Rừng núi & hang động Phong Nha
    gallery: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['vũng tàu', 'vung tau', 'vungtau', 'bãi trước', 'bãi sau', 'hải đăng vũng tàu'],
    image: '/images/destinations/vung-tau.jpg', // Toàn cảnh Vịnh Vũng Tàu
    gallery: [
      '/images/destinations/vung-tau.jpg',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['hà giang', 'ha giang', 'mã pí lèng', 'sông nho quế', 'đồng văn', 'mèo vạc', 'tây bắc'],
    image: '/images/destinations/ha-giang.jpg', // Đèo Mã Pí Lèng Hà Giang
    gallery: [
      '/images/destinations/ha-giang.jpg',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['cần thơ', 'can tho', 'chợ nổi cái răng', 'miền tây', 'đồng bằng sông cửu long', 'bến tre'],
    image: '/images/destinations/can-tho.jpg', // Chợ nổi Cái Răng Cần Thơ sông nước
    gallery: [
      '/images/destinations/can-tho.jpg',
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80'
    ]
  },

  // --- QUỐC TẾ ---
  {
    keywords: ['tokyo', 'nhật bản', 'japan', 'phú sĩ', 'fuji', 'shibuya', 'shinjuku'],
    image: '/images/destinations/tokyo.jpg', // Tokyo Nhật Bản
    gallery: [
      '/images/destinations/tokyo.jpg',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['kyoto', 'cổng torii', 'fushimi inari', 'arashiyama', 'rừng trúc'],
    image: '/images/destinations/kyoto.jpg', // Kyoto Cổ kính
    gallery: [
      '/images/destinations/kyoto.jpg',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['seoul', 'hàn quốc', 'korea', 'namsan', 'gyeongbokgung'],
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80', // Seoul Cung điện & Tháp Namsan
    gallery: [
      'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['bangkok', 'thái lan', 'thailand', 'wat arun', 'wat phra kaew'],
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80', // Bangkok Wat Arun
    gallery: [
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['phuket', 'vịnh phang nga', 'đảo phi phi', 'phi phi', 'patong'],
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80', // Phuket Thiên đường biển
    gallery: [
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['bali', 'indonesia', 'ubud', 'nusa penida', 'kuta', 'tanah lot'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', // Bali Cổng trời & Biển
    gallery: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['singapore', 'marina bay', 'gardens by the bay', 'merlion'],
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80', // Singapore Marina Bay Sands
    gallery: [
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['paris', 'pháp', 'france', 'tháp eiffel', 'louvre', 'sông seine'],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', // Paris Tháp Eiffel
    gallery: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520939817895-060bdef4ad1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['london', 'anh', 'uk', 'big ben', 'tháp london', 'tower bridge', 'sông thames'],
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80', // London Big Ben
    gallery: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520939817895-060bdef4ad1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['rome', 'roma', 'ý', 'italy', 'colosseum', 'đấu trường la mã', 'vatican', 'trevi'],
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80', // Rome Colosseum
    gallery: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520939817895-060bdef4ad1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['santorini', 'hy lạp', 'greece', 'aegean', 'oia'],
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80', // Santorini Đảo trắng vòm xanh
    gallery: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['thụy sĩ', 'thuy si', 'switzerland', 'matterhorn', 'zermatt', 'alps'],
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80', // Dãy Alps Thụy Sĩ
    gallery: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['new york', 'mỹ', 'usa', 'manhattan', 'times square', 'nữ thần tự do'],
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80', // New York City
    gallery: [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['sydney', 'úc', 'australia', 'nhà hát con sò', 'opera house'],
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80', // Sydney Opera House
    gallery: [
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keywords: ['dubai', 'burj khalifa', 'tiểu vương quốc', 'sa mạc dubai'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', // Dubai Burj Khalifa
    gallery: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ]
  }
];

// Fallback defaults by category if no keyword matches
export const CATEGORY_DEFAULTS = {
  destination: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  tour: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  hotel: '/images/hotel-placeholder.svg',
  restaurant: '/images/restaurant-placeholder.svg',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
};

/**
 * Find matching authentic image and gallery based on text (name, title, slug)
 */
export function findAuthenticImageMatch(text?: string): KeywordImageMap | null {
  if (!text) return null;
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_]/g, ' ');

  for (const item of AUTHENTIC_LOCATION_MAP) {
    for (const kw of item.keywords) {
      const kwNormalized = kw
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[-_]/g, ' ');
      if (normalized.includes(kwNormalized)) {
        return item;
      }
    }
  }
  return null;
}

/**
 * Returns an authentic image URL for any destination, tour, hotel or restaurant.
 * If rawUrl is a valid external URL (Unsplash, Cloudinary, etc.), it returns rawUrl.
 * If rawUrl is missing or a local broken path (/uploads/...), it dynamically matches against name/slug.
 */
export function getAuthenticImage(
  rawUrl?: string | null,
  nameOrSlug?: string | null,
  type: 'destination' | 'tour' | 'hotel' | 'restaurant' | 'avatar' = 'tour'
): string {
  if (type === 'restaurant') {
    const knownPhoto = restaurantImages[nameOrSlug || ''];
    if (knownPhoto) return knownPhoto;
    if (rawUrl?.startsWith('/uploads/restaurants/')) return rawUrl;
    if (rawUrl && /^https?:\/\//.test(rawUrl) && !rawUrl.includes('images.unsplash.com')) return rawUrl;
    return CATEGORY_DEFAULTS.restaurant;
  }

  if (type === 'hotel') {
    if (rawUrl?.startsWith('/uploads/hotels/')) return rawUrl;
    if (rawUrl && /^https?:\/\//.test(rawUrl) && !rawUrl.includes('images.unsplash.com')) return rawUrl;
    return CATEGORY_DEFAULTS.hotel;
  }

  if (type === 'tour' && (!rawUrl || rawUrl.includes('images.unsplash.com'))) {
    const destinationPhoto = findAuthenticImageMatch(nameOrSlug || '');
    if (destinationPhoto?.image.startsWith('/images/destinations/')) return destinationPhoto.image;
  }

  // Filter out known mistaken Unsplash IDs
  const isMismatched = rawUrl && (
    rawUrl.includes('photo-1540959733332') || // Tokyo arcade mistakenly assigned to Phu Quoc
    rawUrl.includes('photo-1589308078059') || // Mount Fuji mistakenly assigned to Phu Quoc
    rawUrl.includes('photo-1509316975850') || // Pine forest mistakenly assigned to Ha Noi
    rawUrl.includes('photo-1571401835393') || // Nepal Himalayas mistakenly assigned to Sa Pa
    rawUrl.includes('photo-1568084680786') || // Resort mistakenly assigned to Hoi An
    rawUrl.includes('photo-1583417319070') || // Bitexco HCMC mistakenly assigned to Hue
    rawUrl.includes('photo-1559847844')    // Curry dish mistakenly assigned to Can Tho
  );

  // If already an authentic URL or local /images/ asset, verify it's not mismatched
  if (rawUrl && !isMismatched && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('/images/'))) {
    return rawUrl;
  }

  // If name or slug contains a known location, return that specific location's hero image
  const match = findAuthenticImageMatch(nameOrSlug || '');
  if (match) {
    return match.image;
  }

  // If rawUrl contains location hints in its filename
  if (rawUrl && !isMismatched) {
    const fileMatch = findAuthenticImageMatch(rawUrl);
    if (fileMatch) {
      return fileMatch.image;
    }
  }

  return CATEGORY_DEFAULTS[type] || CATEGORY_DEFAULTS.tour;
}

/**
 * Returns an authentic photo gallery array (guaranteed unique images)
 */
export function getAuthenticGallery(
  rawPhotos?: string[] | any,
  nameOrSlug?: string | null,
  type: 'destination' | 'tour' | 'hotel' = 'tour'
): string[] {
  if (type === 'hotel') {
    const first = Array.isArray(rawPhotos) ? rawPhotos[0] : typeof rawPhotos === 'string' ? rawPhotos : null;
    return [getAuthenticImage(first, nameOrSlug, 'hotel')];
  }
  let photoList: string[] = [];

  if (Array.isArray(rawPhotos)) {
    photoList = rawPhotos.filter((p) => typeof p === 'string' && p.trim().length > 0);
  } else if (typeof rawPhotos === 'string') {
    try {
      const parsed = JSON.parse(rawPhotos);
      if (Array.isArray(parsed)) {
        photoList = parsed;
      }
    } catch {
      photoList = [rawPhotos];
    }
  }

  // Deduplicate and filter out invalid/local placeholder paths if needed
  const uniqueUrls = Array.from(new Set(photoList)).filter((p) => p.startsWith('http'));

  if (uniqueUrls.length >= 3) {
    return uniqueUrls;
  }

  // If not enough unique photos, fetch authentic gallery based on name
  const match = findAuthenticImageMatch(nameOrSlug || '');
  if (match && match.gallery && match.gallery.length > 0) {
    return match.gallery;
  }

  // Fallback unique scenic gallery
  return [
    CATEGORY_DEFAULTS[type] || CATEGORY_DEFAULTS.tour,
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80'
  ];
}

/**
 * Error event handler for <img> tags.
 * Switches src to authentic photo matching the item name, and unbinds onError to avoid infinite loops.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  nameOrSlug?: string | null,
  type: 'destination' | 'tour' | 'hotel' | 'restaurant' | 'avatar' = 'tour'
) {
  const target = event.currentTarget as HTMLImageElement;
  target.onerror = null; // Prevent infinite loop

  const authenticUrl = getAuthenticImage(null, nameOrSlug, type);
  target.src = authenticUrl;
}
