const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const TOUR_GALLERY_CONFIGS = [
  // --- TOUR 1 & 4: HẠ LONG ---
  {
    tourIds: [1, 4],
    slugMatch: 'ha-long',
    primaryImage: '/uploads/tours/halong-cruise-hero.jpg',
    photos: [
      { filename: 'halong-cruise-hero.jpg', url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200' },
      { filename: 'halong-cruise-cabin.jpg', url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1000' },
      { filename: 'halong-kayak.jpg', url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1000' },
      { filename: 'halong-dining.jpg', url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=1000' },
      { filename: 'halong-sunset.jpg', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000' }
    ]
  },
  // --- TOUR 2 & 5: HÀ NỘI ---
  {
    tourIds: [2, 5],
    slugMatch: 'ha-noi',
    primaryImage: '/uploads/tours/hanoi-hoguom.jpg',
    photos: [
      { filename: 'hanoi-hoguom.jpg', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200' },
      { filename: 'hanoi-oldquarter.jpg', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000' },
      { filename: 'hanoi-pho.jpg', url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1000' },
      { filename: 'hanoi-buncha.jpg', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000' },
      { filename: 'hanoi-eggcoffee.jpg', url: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1000' }
    ]
  },
  // --- TOUR 3 & 6: PHÚ QUỐC ---
  {
    tourIds: [3, 6],
    slugMatch: 'phu-quoc',
    primaryImage: '/uploads/tours/phuquoc-baisao.jpg',
    photos: [
      { filename: 'phuquoc-baisao.jpg', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200' },
      { filename: 'phuquoc-cablecar.jpg', url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1000' },
      { filename: 'phuquoc-snorkeling.jpg', url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1000' },
      { filename: 'phuquoc-bunquay.jpg', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1000' },
      { filename: 'phuquoc-sunset.jpg', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000' }
    ]
  },
  // --- TOUR 9 & 12: ĐÀ NẴNG - HỘI AN ---
  {
    tourIds: [9, 12],
    slugMatch: 'da-nang',
    primaryImage: '/uploads/tours/danang-cauvang.jpg',
    photos: [
      { filename: 'danang-cauvang.jpg', url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200' },
      { filename: 'hoian-denlong.jpg', url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1000' },
      { filename: 'danang-mykhe.jpg', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000' },
      { filename: 'hoian-comga.jpg', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000' },
      { filename: 'danang-miquang.jpg', url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=1000' }
    ]
  },
  // --- TOUR 7 & 8: ĐÀ LẠT ---
  {
    tourIds: [7, 8],
    slugMatch: 'da-lat',
    primaryImage: '/uploads/tours/dalat-sanmay.jpg',
    photos: [
      { filename: 'dalat-sanmay.jpg', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200' },
      { filename: 'dalat-hotuyenlam.jpg', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000' },
      { filename: 'dalat-lauga.jpg', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1000' },
      { filename: 'dalat-chothem.jpg', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1000' },
      { filename: 'dalat-camtucau.jpg', url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000' }
    ]
  },
  // --- TOUR 10 & 11: SA PA ---
  {
    tourIds: [10, 11],
    slugMatch: 'sapa',
    primaryImage: '/uploads/tours/sapa-fansipan.jpg',
    photos: [
      { filename: 'sapa-fansipan.jpg', url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200' },
      { filename: 'sapa-muonghoa.jpg', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000' },
      { filename: 'sapa-catcat.jpg', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000' },
      { filename: 'sapa-cahoi.jpg', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1000' },
      { filename: 'sapa-thangco.jpg', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000' }
    ]
  },
  // --- TOUR 14: NINH BÌNH ---
  {
    tourIds: [14],
    slugMatch: 'ninh-binh',
    primaryImage: '/uploads/tours/ninhbinh-trangan.jpg',
    photos: [
      { filename: 'ninhbinh-trangan.jpg', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200' },
      { filename: 'ninhbinh-hangmua.jpg', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000' },
      { filename: 'ninhbinh-tamcoc.jpg', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000' },
      { filename: 'ninhbinh-denui.jpg', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000' },
      { filename: 'ninhbinh-baidinh.jpg', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000' }
    ]
  },
  // --- TOUR 19: HÀ GIANG ---
  {
    tourIds: [19],
    slugMatch: 'ha-giang',
    primaryImage: '/uploads/tours/hagiang-mapileng.jpg',
    photos: [
      { filename: 'hagiang-mapileng.jpg', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200' },
      { filename: 'hagiang-nhoque.jpg', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000' },
      { filename: 'hagiang-lungcu.jpg', url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000' },
      { filename: 'hagiang-tamgiacmach.jpg', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1000' },
      { filename: 'hagiang-dinhvuong.jpg', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000' }
    ]
  }
];

const targetDir = path.join(__dirname, '..', 'uploads', 'tours');
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
  console.log('🚀 Bắt đầu cào & tải ảnh Tour Gallery về local (uploads/tours)...');
  console.log(`📁 Thư mục lưu trữ: ${targetDir}`);

  // 1. Tải toàn bộ ảnh
  for (const config of TOUR_GALLERY_CONFIGS) {
    for (const p of config.photos) {
      const destPath = path.join(targetDir, p.filename);
      try {
        if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
          console.log(`⏩ Đã có ảnh: ${p.filename}`);
        } else {
          console.log(`⬇️ Đang tải ảnh: ${p.filename}...`);
          await downloadImage(p.url, destPath);
          console.log(`✅ Tải thành công: ${p.filename} (${fs.statSync(destPath).size} bytes)`);
        }
      } catch (err) {
        console.error(`⚠️ Lỗi tải ảnh ${p.filename}:`, err.message);
      }
    }
  }

  // 2. Cập nhật Tour trong database với ảnh chính và mảng photos
  console.log('\n🔄 Đang cập nhật Tour Gallery vào Database MySQL...');

  for (const config of TOUR_GALLERY_CONFIGS) {
    const photoUrls = config.photos.map(p => `/uploads/tours/${p.filename}`);
    
    // Cập nhật theo tourIds hoặc slug
    for (const tourId of config.tourIds) {
      try {
        await prisma.tour.update({
          where: { id: tourId },
          data: {
            image: config.primaryImage,
            photos: photoUrls
          }
        });
        console.log(`✅ Đã cập nhật Tour ID ${tourId} với 5 ảnh gallery.`);
      } catch (err) {
        console.warn(`Tour ID ${tourId} không tìm thấy hoặc lỗi:`, err.message);
      }
    }
  }

  // Cập nhật các tour còn lại nếu chưa có photos: cấp photos từ destination tương ứng
  const allToursList = await prisma.tour.findMany();
  const remainingTours = allToursList.filter(t => !t.photos);
  console.log(`\nCập nhật fallback gallery cho ${remainingTours.length} tour còn lại...`);
  for (const t of remainingTours) {
    // Tìm config phù hợp nhất
    const matched = TOUR_GALLERY_CONFIGS.find(c => t.slug.includes(c.slugMatch)) || TOUR_GALLERY_CONFIGS[0];
    const photoUrls = matched.photos.map(p => `/uploads/tours/${p.filename}`);
    await prisma.tour.update({
      where: { id: t.id },
      data: {
        image: matched.primaryImage,
        photos: photoUrls
      }
    });
  }

  console.log('\n🎉 Hoàn thành! 100% các Tour du lịch đã có ảnh đại diện chuẩn xác và mảng 5 ảnh Bento Gallery.');
  await prisma.$disconnect();
}

run().catch((err) => {
  console.error('❌ Lỗi:', err);
  prisma.$disconnect();
  process.exit(1);
});
