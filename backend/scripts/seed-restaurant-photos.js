const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Danh sách nhà hàng chuẩn xác 100% theo từng vùng miền & điểm đến
const RESTAURANT_DATA = [
  // --- HÀ NỘI (Destination ID: 5) ---
  {
    name: 'Phở Gia Truyền Bát Đàn',
    slug: 'pho-gia-truyen-bat-dan',
    city: 'Hà Nội',
    address: '49 Bát Đàn, Cửa Đông, Hoàn Kiếm, Hà Nội',
    cuisine: 'Ẩm thực Hà Nội',
    priceRange: '50.000đ - 90.000đ',
    rating: 4.8,
    destinationId: 5,
    filename: 'pho-batdan.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1000',
    description: 'Quán phở bò gia truyền trứ danh phố cổ Hà Nội, nước dùng thanh trong thơm lừng quế hồi gừng tươi cùng bánh phở mềm mướt.'
  },
  {
    name: 'Bún Chả Hương Liên (Obama)',
    slug: 'bun-cha-huong-lien',
    city: 'Hà Nội',
    address: '24 Lê Văn Hưu, Phan Chu Trinh, Hai Bà Trưng, Hà Nội',
    cuisine: 'Đặc sản Hà Nội',
    priceRange: '60.000đ - 120.000đ',
    rating: 4.7,
    destinationId: 5,
    filename: 'buncha-obama.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000',
    description: 'Nơi cựu Tổng thống Mỹ Barack Obama và đầu bếp Anthony Bourdain từng thưởng thức bún chả nem hải sản giòn rụm.'
  },
  {
    name: 'Chả Cá Lã Vọng Hoàn Kiếm',
    slug: 'cha-ca-la-vong',
    city: 'Hà Nội',
    address: '14 Chả Cá, Hàng Bồ, Hoàn Kiếm, Hà Nội',
    cuisine: 'Ẩm thực Hà Nội',
    priceRange: '150.000đ - 250.000đ',
    rating: 4.6,
    destinationId: 5,
    filename: 'chaca-lavong.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000',
    description: 'Món chả cá lăng nướng than hoa xào thì là hành hoa thơm nức mũi, ăn kèm bún, đậu phộng rang và mắm tôm gia truyền.'
  },
  {
    name: 'Cà Phê Trứng Giảng',
    slug: 'ca-phe-giang',
    city: 'Hà Nội',
    address: '39 Nguyễn Hữu Huân, Lý Thái Tổ, Hoàn Kiếm, Hà Nội',
    cuisine: 'Cà phê & Đồ uống',
    priceRange: '35.000đ - 60.000đ',
    rating: 4.9,
    destinationId: 5,
    filename: 'cafe-giang.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1000',
    description: 'Cội nguồn của thức uống cà phê trứng huyền thoại Hà thành, lớp kem trứng béo ngậy bông xốp hòa quyện cà phê đậm đà.'
  },

  // --- HẠ LONG (Destination ID: 2) ---
  {
    name: 'Hải Sản Cua Vàng Bãi Cháy',
    slug: 'hai-san-cua-vang-ha-long',
    city: 'Hạ Long',
    address: '32 Phan Chu Trinh, Bãi Cháy, TP. Hạ Long',
    cuisine: 'Hải sản tươi sống',
    priceRange: '250.000đ - 650.000đ',
    rating: 4.9,
    destinationId: 2,
    filename: 'haisan-cuavang.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=1000',
    description: 'Nhà hàng hải sản số 1 Bãi Cháy nổi tiếng với lẩu cua biển nấu niêu đất gia truyền, cua gạch chắc thịt và bề bề tươi rói.'
  },
  {
    name: 'Nhà Hàng Hồng Hạnh 3',
    slug: 'nha-hang-hong-hanh-3',
    city: 'Hạ Long',
    address: 'Đường Hoàng Quốc Việt, Bãi Cháy, TP. Hạ Long',
    cuisine: 'Hải sản',
    priceRange: '200.000đ - 500.000đ',
    rating: 4.8,
    destinationId: 2,
    filename: 'honghanh-halong.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1000',
    description: 'Thương hiệu ẩm thực hải sản Hạ Long uy tín nhiều năm, phục vụ cù kỳ, tu hài, mực xào và cá song hấp xì dầu tươi ngon.'
  },

  // --- HỘI AN (Destination ID: 8) ---
  {
    name: 'Cơm Gà Bà Buội Phố Cổ',
    slug: 'com-ga-ba-buoi-hoi-an',
    city: 'Hội An',
    address: '22 Phan Chu Trinh, Phường Minh An, TP. Hội An',
    cuisine: 'Đặc sản xứ Quảng',
    priceRange: '55.000đ - 110.000đ',
    rating: 4.8,
    destinationId: 8,
    filename: 'comga-babuoi.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000',
    description: 'Hạt cơm óng ả nấu từ nước luộc gà và nghệ tươi, gà ta xé phay bóp hành tây rau răm cay nồng đặc sắc Phố Cổ.'
  },
  {
    name: 'Cao Lầu Bá Lễ Hội An',
    slug: 'cao-lau-ba-le-hoi-an',
    city: 'Hội An',
    address: '49/3 Trần Hưng Đạo, Phường Minh An, TP. Hội An',
    cuisine: 'Đặc sản xứ Quảng',
    priceRange: '45.000đ - 75.000đ',
    rating: 4.7,
    destinationId: 8,
    filename: 'caolau-bale.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=1000',
    description: 'Món cao lầu trứ danh chế biến từ nước giếng Bá Lễ nghìn năm, sợi mì dai vàng giòn bì heo và xá xíu đậm vị.'
  },
  {
    name: 'Bánh Mì Phượng Hội An',
    slug: 'banh-mi-phuong-hoi-an',
    city: 'Hội An',
    address: '2B Phan Chu Trinh, Cẩm Châu, TP. Hội An',
    cuisine: 'Bánh mì & Đường phố',
    priceRange: '30.000đ - 55.000đ',
    rating: 4.9,
    destinationId: 8,
    filename: 'banhmi-phuong.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1000',
    description: 'Tiệm bánh mì ngon nhất thế giới theo đánh giá của các chuyên gia ẩm thực quốc tế, nước sốt pate béo ngậy thơm lừng.'
  },

  // --- ĐÀ NẴNG (Destination ID: 6) ---
  {
    name: 'Mì Quảng Ếch Bếp Trang',
    slug: 'mi-quang-ech-bep-trang',
    city: 'Đà Nẵng',
    address: '441 Ông Ích Khiêm, Nam Dương, Hải Châu, Đà Nẵng',
    cuisine: 'Đặc sản Đà Nẵng',
    priceRange: '60.000đ - 110.000đ',
    rating: 4.8,
    destinationId: 6,
    filename: 'miquang-beptrang.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=1000',
    description: 'Biến tấu mì Quảng đựng trong mẹt tre độc đáo, thịt ếch đồng om sả ớt vàng óng, ăn kèm bánh tráng nướng mè giòn rụm.'
  },
  {
    name: 'Hải Sản Năm Đảnh Sơn Trà',
    slug: 'hai-san-nam-danh-da-nang',
    city: 'Đà Nẵng',
    address: 'K139/H59/38 Trần Quang Khải, Thọ Quang, Sơn Trà, Đà Nẵng',
    cuisine: 'Hải sản biển',
    priceRange: '80.000đ - 220.000đ',
    rating: 4.8,
    destinationId: 6,
    filename: 'haisan-namdanh.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000',
    description: 'Quán hải sản bình dân đông khách nhất Đà Nẵng, hải sản đánh bắt trong ngày tươi sống giá cực kỳ hợp lý.'
  },
  {
    name: 'Đặc Sản Trần Đà Nẵng',
    slug: 'dac-san-tran-da-nang',
    city: 'Đà Nẵng',
    address: '04 Lê Duẩn, Hải Châu 1, Hải Châu, Đà Nẵng',
    cuisine: 'Đặc sản xứ Quảng',
    priceRange: '90.000đ - 180.000đ',
    rating: 4.7,
    destinationId: 6,
    filename: 'banhtrang-tran.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000',
    description: 'Nổi tiếng với bánh tráng cuốn thịt heo hai đầu da luộc mềm mọng, chấm mắm nêm đậm đà thơm ngát vị dứa ớt.'
  },

  // --- HUẾ (Destination ID: 9) ---
  {
    name: 'Bún Bò Huế Bà Tuyết',
    slug: 'bun-bo-hue-ba-tuyet',
    city: 'Huế',
    address: '47 Nguyễn Công Trứ, Phú Hội, TP. Huế',
    cuisine: 'Ẩm thực Cố Đô',
    priceRange: '40.000đ - 70.000đ',
    rating: 4.9,
    destinationId: 9,
    filename: 'bunbo-hue.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1000',
    description: 'Tô bún bò đậm vị ruốc sả truyền thống xứ Huế, đầy ắp giò heo, bò bắp, chả cua quết thơm và tiết mềm mọng.'
  },
  {
    name: 'Cơm Hến Hoa Đông Cồn Hến',
    slug: 'com-hen-hoa-dong',
    city: 'Huế',
    address: '64 kiệt 7 Ưng Bình, Vỹ Dạ, TP. Huế',
    cuisine: 'Ẩm thực Cố Đô',
    priceRange: '25.000đ - 50.000đ',
    rating: 4.8,
    destinationId: 9,
    filename: 'comhen-hue.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000',
    description: 'Cơm hến chuẩn vị đất Cồn Hến, thịt hến xào ngậy cay xé lưỡi hòa cùng bắp chuối, rau thơm và tóp mỡ giòn tan.'
  },

  // --- ĐÀ LẠT (Destination ID: 3) ---
  {
    name: 'Lẩu Gà Lá É Tao Ngộ',
    slug: 'lau-ga-la-e-tao-ngo',
    city: 'Đà Lạt',
    address: 'Số 5 đường 3/4, Phường 3, TP. Đà Lạt',
    cuisine: 'Ẩm thực cao nguyên',
    priceRange: '200.000đ - 350.000đ',
    rating: 4.8,
    destinationId: 3,
    filename: 'lauga-dalat.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1000',
    description: 'Nồi lẩu gà nóng hổi bốc khói giữa tiết trời se lạnh Đà Lạt, vị thơm the the đặc trưng của lá é quyện thịt gà đồi săn chắc.'
  },
  {
    name: 'Bánh Căn Lệ Đà Lạt',
    slug: 'banh-can-le-da-lat',
    city: 'Đà Lạt',
    address: '27/44 Yersin, Phường 10, TP. Đà Lạt',
    cuisine: 'Ăn vặt & Đường phố',
    priceRange: '35.000đ - 65.000đ',
    rating: 4.7,
    destinationId: 3,
    filename: 'banhcan-dalat.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1000',
    description: 'Bánh căn nóng giòn đổ từ khuôn đất nung, nhân trứng cút, thịt bò, chấm ngập chén xíu mại mỡ hành cay ấm nồng.'
  },

  // --- PHÚ QUỐC (Destination ID: 4) ---
  {
    name: 'Bún Quậy Kiến Xây Dương Đông',
    slug: 'bun-quay-kien-xay',
    city: 'Phú Quốc',
    address: '28 Bạch Đằng, TT. Dương Đông, TP. Phú Quốc',
    cuisine: 'Đặc sản Đảo Ngọc',
    priceRange: '45.000đ - 85.000đ',
    rating: 4.9,
    destinationId: 4,
    filename: 'bunquay-phuquoc.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1000',
    description: 'Món bún tự quậy nước chấm trứ danh Phú Quốc, chả tôm mực tươi quết nhuyễn trực tiếp trong tô nước dùng nóng hổi.'
  },
  {
    name: 'Hải Sản Làng Chài Hàm Ninh',
    slug: 'hai-san-lang-chai-ham-ninh',
    city: 'Phú Quốc',
    address: 'Làng chài Hàm Ninh, TP. Phú Quốc',
    cuisine: 'Hải sản biển',
    priceRange: '150.000đ - 450.000đ',
    rating: 4.8,
    destinationId: 4,
    filename: 'haisan-hamninh.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000',
    description: 'Ăn ghẹ Hàm Ninh tươi ngọt nhảy tanh tách tại bè nổi ven biển, gỏi cá trích cuốn bánh tráng chấm nước mắm cốt Phú Quốc.'
  },

  // --- NHA TRANG (Destination ID: 12) ---
  {
    name: 'Nem Nướng Đặng Văn Quyên',
    slug: 'nem-nuong-dang-van-quyen',
    city: 'Nha Trang',
    address: '16A Lãn Ông, Xương Huân, TP. Nha Trang',
    cuisine: 'Đặc sản Nha Trang',
    priceRange: '50.000đ - 100.000đ',
    rating: 4.8,
    destinationId: 12,
    filename: 'nemnuong-nhatrang.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000',
    description: 'Nem nướng lụi than hồng thơm nức cuộn ram giòn rụm, xoài xanh, dưa chuột chấm bát nước sốt tương nếp gia truyền sánh mịn.'
  },
  {
    name: 'Hải Sản Bờ Kè Tháp Bà',
    slug: 'hai-san-bo-ke-nha-trang',
    city: 'Nha Trang',
    address: '42 Cù Lao Trung, Vĩnh Thọ, TP. Nha Trang',
    cuisine: 'Hải sản',
    priceRange: '120.000đ - 350.000đ',
    rating: 4.7,
    destinationId: 12,
    filename: 'haisan-nhatrang.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=1000',
    description: 'Ngồi lộng gió ven sông ngắm cầu Trần Phú, thưởng thức tôm hùm, ốc hương sốt trứng muối và sò huyết nướng mọi tươi ngon.'
  },

  // --- SA PA (Destination ID: 7) ---
  {
    name: 'Lẩu Cá Hồi Song Nhi Sa Pa',
    slug: 'lau-ca-hoi-song-nhi-sapa',
    city: 'Sa Pa',
    address: 'Khu du lịch Thác Bạc, Sa Pa, Lào Cai',
    cuisine: 'Ẩm thực Tây Bắc',
    priceRange: '250.000đ - 550.000đ',
    rating: 4.9,
    destinationId: 7,
    filename: 'cahoi-songnhi-sapa.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1000',
    description: 'Cá hồi tươi nuôi tại suối lạnh Sa Pa thịt đỏ au ngọt ngào, lẩu măng chua ăn kèm rau rừng cải mèo giòn ngọt thanh tao.'
  },
  {
    name: 'Thắng Cố A Quỳnh Sa Pa',
    slug: 'thang-co-a-quynh-sapa',
    city: 'Sa Pa',
    address: '15 Thạch Sơn, TT. Sa Pa, Lào Cai',
    cuisine: 'Đặc sản bản địa',
    priceRange: '150.000đ - 350.000đ',
    rating: 4.7,
    destinationId: 7,
    filename: 'thangco-sapa.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000',
    description: 'Món thắng cố ngựa truyền thống nấu cùng thảo quả hoa hồi Tây Bắc, nhâm nhi cùng chén rượu ngô ấm nồng xua tan sương lạnh.'
  },

  // --- NINH BÌNH (Destination ID: 1) ---
  {
    name: 'Nhà Hàng Dê Núi Chính Thư',
    slug: 'de-nui-chinh-thu-ninh-binh',
    city: 'Ninh Bình',
    address: 'Thôn Khê Thượng, Ninh Xuân, Hoa Lư, Ninh Bình',
    cuisine: 'Đặc sản Cố Đô',
    priceRange: '150.000đ - 350.000đ',
    rating: 4.8,
    destinationId: 1,
    filename: 'denui-ninhbinh.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000',
    description: 'Thịt dê núi thả đá tự nhiên săn chắc ngọt thịt, tái dê chanh thơm phức chấm nước tương gừng ăn cùng cơm cháy ruốc giòn tan.'
  },

  // --- BANGKOK (Destination ID: 17) ---
  {
    name: 'Jay Fai Bangkok (Michelin 1 Sao)',
    slug: 'jay-fai-bangkok',
    city: 'Bangkok',
    address: '327 Maha Chai Rd, Samran Rat, Phra Nakhon, Bangkok',
    cuisine: 'Thái Lan & Hải sản',
    priceRange: '400.000đ - 1.200.000đ',
    rating: 4.9,
    destinationId: 17,
    filename: 'jayfai-bangkok.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=1000',
    description: 'Huyền thoại ẩm thực đường phố Bangkok đạt sao Michelin, nổi danh khắp thế giới với món trứng cuộn cua hoàng đế khổng lồ.'
  },

  // --- TOKYO (Destination ID: 21) ---
  {
    name: 'Sukiyabashi Jiro Tokyo',
    slug: 'sukiyabashi-jiro-tokyo',
    city: 'Tokyo',
    address: 'Tsukamoto Sogyo Building, Ginza, Chuo City, Tokyo',
    cuisine: 'Sushi Nhật Bản',
    priceRange: '1.500.000đ - 4.000.000đ',
    rating: 5.0,
    destinationId: 21,
    filename: 'jiro-tokyo.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1000',
    description: 'Đỉnh cao nghệ thuật sushi thế giới của nghệ nhân Jiro Ono, từng miếng nigiri được chăm chút đạt chuẩn mực hoàn hảo.'
  }
];

const targetDir = path.join(__dirname, '..', 'uploads', 'restaurants');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;

    const request = (u) => {
      client.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          request(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download ${u}: status ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }).on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    };

    request(url);
  });
}

async function run() {
  console.log('🚀 Bắt đầu cào & tải ảnh nhà hàng về local (uploads/restaurants)...');
  console.log(`📁 Thư mục lưu trữ: ${targetDir}`);

  // 1. Tải ảnh về cục bộ
  for (const item of RESTAURANT_DATA) {
    const destPath = path.join(targetDir, item.filename);
    try {
      if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
        console.log(`⏩ Đã có ảnh: ${item.filename}`);
      } else {
        console.log(`⬇️ Đang tải ảnh cho: ${item.name} (${item.city})...`);
        await downloadImage(item.imageUrl, destPath);
        console.log(`✅ Tải thành công: ${item.filename} (${fs.statSync(destPath).size} bytes)`);
      }
    } catch (err) {
      console.error(`⚠️ Lỗi tải ảnh ${item.filename}:`, err.message);
    }
  }

  // 2. Cập nhật và chuẩn hóa dữ liệu nhà hàng trong Database
  console.log('\n🔄 Đang cập nhật dữ liệu nhà hàng trong Database MySQL...');

  // Xóa sạch hoặc đồng bộ lại các nhà hàng theo danh mục chuẩn xác
  let updatedCount = 0;
  for (const item of RESTAURANT_DATA) {
    const localImagePath = `/uploads/restaurants/${item.filename}`;

    await prisma.restaurant.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        city: item.city,
        address: item.address,
        cuisine: item.cuisine,
        priceRange: item.priceRange,
        rating: item.rating,
        destinationId: item.destinationId,
        image: localImagePath,
        description: item.description,
        featured: true,
      },
      create: {
        name: item.name,
        slug: item.slug,
        city: item.city,
        address: item.address,
        cuisine: item.cuisine,
        priceRange: item.priceRange,
        rating: item.rating,
        destinationId: item.destinationId,
        image: localImagePath,
        description: item.description,
        featured: true,
      }
    });

    updatedCount++;
    console.log(`📍 [${item.city}] ${item.name} -> ${localImagePath}`);
  }

  // Dọn dẹp các bản ghi sai lệch cũ không thuộc danh sách chuẩn
  const validSlugs = RESTAURANT_DATA.map(r => r.slug);
  const deleteOld = await prisma.restaurant.deleteMany({
    where: {
      slug: { notIn: validSlugs }
    }
  });

  console.log(`\n🎉 Hoàn thành! Đã chuẩn hóa ${updatedCount} nhà hàng chuẩn vị trí vùng miền.`);
  console.log(`🧹 Đã dọn dẹp ${deleteOld.count} nhà hàng cũ bị lỗi lệch địa chỉ.`);
  await prisma.$disconnect();
}

run().catch((err) => {
  console.error('❌ Lỗi xử lý:', err);
  prisma.$disconnect();
  process.exit(1);
});
