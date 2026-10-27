const https = require('https');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Curated high quality authentic travel photos for blogs, stories, and banners
const blogImages = {
  'blog-healing-vietnam.jpg': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&q=80', // Tràng An Ninh Bình bình yên
  'blog-wellness-travel.jpg': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80', // Sa Pa sương sớm tĩnh lặng
  'blog-dalat-retreat.jpg': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80', // Đà Lạt thông reo & hồ nước
  'blog-phuquoc-wellness.jpg': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80', // Phú Quốc biển xanh tĩnh tại
  'blog-yentu-mindfulness.jpg': 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80', // Hạ Long / Yên Tử thanh tịnh
  'blog-hoian-slowlife.jpg': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80', // Hội An phố cổ thanh bình
  'blog-hagiang-healing.jpg': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80', // Hà Giang hùng vĩ khoáng đạt
};

const storyImages = {
  'story-ninhbinh-trangan.jpg': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&q=80', // Ninh Bình
  'story-sapa-fansipan.jpg': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80', // Sa Pa
  'story-danang-cauvang.jpg': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80', // Đà Nẵng Cầu Vàng
  'story-phuquoc-sunset.jpg': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80', // Phú Quốc
  'story-halong-heritage.jpg': 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80', // Vịnh Hạ Long
  'story-hoian-lanterns.jpg': 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=1200&q=80', // Hội An
};

const bannerImages = {
  'banner-hero-halong.jpg': 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=85',
  'banner-danang-goldenbridge.jpg': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1920&q=85',
  'banner-phuquoc-paradise.jpg': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=85',
  'banner-sapa-fansipan.jpg': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&q=85',
};

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const request = (u) => {
      https.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          request(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
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

async function downloadSet(name, imageMap, targetDir) {
  ensureDir(targetDir);
  console.log(`\n🚀 Downloading ${name} photos into ${targetDir}...`);
  for (const [filename, url] of Object.entries(imageMap)) {
    const dest = path.join(targetDir, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`  ✓ Already exists: ${filename}`);
      continue;
    }
    try {
      console.log(`  ⬇ Downloading ${filename}...`);
      await downloadImage(url, dest);
      console.log(`  ✓ Saved: ${filename}`);
    } catch (e) {
      console.error(`  ✗ Error downloading ${filename}:`, e.message);
    }
  }
}

async function updateDatabase() {
  console.log('\n🔄 Updating Database records (Blogs, Stories, Banners)...');

  // 1. Update Blogs
  const blogUpdates = [
    {
      id: 1,
      title: 'Du Lịch Chữa Lành Việt Nam: Tìm Lại Bình Yên Giữa Thiên Nhiên Hùng Vĩ',
      featuredImage: '/uploads/blogs/blog-healing-vietnam.jpg',
      author: 'Ban Biên Tập TravelHub',
    },
    {
      id: 2,
      title: 'Du Lịch Chữa Lành: Hành Trình Tái Tạo Năng Lượng và Tìm Lại Bình Yên Tuyệt Vời',
      featuredImage: '/uploads/blogs/blog-wellness-travel.jpg',
      author: 'TravelHub Wellness Team',
    },
    {
      id: 3,
      title: 'Du Lịch Chữa Lành Ở Việt Nam: Khám Phá Những Khu Retreat Thanh Tịnh Cùng TravelHub',
      featuredImage: '/uploads/blogs/blog-dalat-retreat.jpg',
      author: 'Nguyễn Minh Anh - TravelHub Editor',
    },
    {
      id: 4,
      title: 'Du Lịch Chữa Lành: Khám Phá Những Điểm Đến Bình Yên Để Tái Tạo Năng Lượng Cùng TravelHub',
      featuredImage: '/uploads/blogs/blog-phuquoc-wellness.jpg',
      author: 'Trần Mai Phương - TravelHub',
    },
    {
      id: 5,
      title: 'Du lịch chữa lành: Liệu pháp tái tạo tâm hồn và cơ thể hoàn hảo cùng TravelHub',
      featuredImage: '/uploads/blogs/blog-yentu-mindfulness.jpg',
      author: 'Ban Biên Tập TravelHub',
    },
    {
      id: 6,
      title: 'Du Lịch Chữa Lành: Khám Phá Những Điểm Đến An Yên Tuyệt Vời Nhất Việt Nam Cùng TravelHub',
      featuredImage: '/uploads/blogs/blog-hoian-slowlife.jpg',
      author: 'Hoàng Văn Đức - TravelHub',
    },
    {
      id: 7,
      title: 'Du Lịch Chữa Lành Tại Việt Nam: Hành Trình Tái Tạo Tâm Hồn Cùng TravelHub',
      featuredImage: '/uploads/blogs/blog-hagiang-healing.jpg',
      author: 'Ban Biên Tập TravelHub',
    },
  ];

  for (const b of blogUpdates) {
    try {
      await prisma.blog.update({
        where: { id: b.id },
        data: {
          title: b.title,
          featuredImage: b.featuredImage,
          author: b.author,
        },
      });
      console.log(`  ✓ Updated Blog [${b.id}]: ${b.title}`);
    } catch (e) {
      console.log(`  - Blog [${b.id}] note:`, e.message);
    }
  }

  // 2. Update Stories - Diversified & Local Images
  const storyUpdates = [
    {
      id: 1,
      title: 'Ninh Bình: Chuyến Đi Về Nơi Trái Tim Tìm Lại Nhịp Đập An Nhiên ✨',
      image: '/uploads/stories/story-ninhbinh-trangan.jpg',
      author: 'Nguyễn Minh Anh',
      destinationId: 1, // Ninh Bình
    },
    {
      id: 2,
      title: 'Sa Pa Sương Mờ: Chinh Phục Đỉnh Fansipan và Những Bản Làng Bình Dị',
      image: '/uploads/stories/story-sapa-fansipan.jpg',
      author: 'Trần Mai Phương',
      destinationId: 7, // Sa Pa
    },
    {
      id: 3,
      title: 'Đà Nẵng & Cầu Vàng: Bước Chân Giữa Mây Trời Ngắm Bán Đảo Sơn Trà',
      image: '/uploads/stories/story-danang-cauvang.jpg',
      author: 'Lê Văn Hoàng',
      destinationId: 6, // Đà Nẵng
    },
    {
      id: 4,
      title: 'Đảo Ngọc Phú Quốc: Lặn Ngắm Rạn San Hô & Hoàng Hôn Bãi Khem',
      image: '/uploads/stories/story-phuquoc-sunset.jpg',
      author: 'Phạm Thị Mai',
      destinationId: 4, // Phú Quốc
    },
    {
      id: 5,
      title: 'Vịnh Hạ Long: Đêm Huyền Ảo Trên Du Thuyền 5 Sao Giữa Ngàn Đảo Đá',
      image: '/uploads/stories/story-halong-heritage.jpg',
      author: 'Hoàng Văn Đức',
      destinationId: 2, // Hạ Long
    },
    {
      id: 6,
      title: 'Phố Cổ Hội An: Tiếng Thì Thầm Của Hoài Phố & Lễ Hội Hoa Đăng Đêm Rằm',
      image: '/uploads/stories/story-hoian-lanterns.jpg',
      author: 'Đỗ Thị Hương',
      destinationId: 8, // Hội An
    },
  ];

  for (const s of storyUpdates) {
    try {
      await prisma.story.update({
        where: { id: s.id },
        data: {
          title: s.title,
          image: s.image,
          author: s.author,
          destinationId: s.destinationId,
        },
      });
      console.log(`  ✓ Updated Story [${s.id}]: ${s.title}`);
    } catch (e) {
      console.log(`  - Story [${s.id}] note:`, e.message);
    }
  }

  // 3. Seed Banners
  const existingBanners = await prisma.banner.findMany();
  if (existingBanners.length === 0) {
    const bannersToCreate = [
      {
        name: 'Vịnh Hạ Long - Kỳ Quan Di Sản 5 Sao',
        imageUrl: '/uploads/banners/banner-hero-halong.jpg',
        linkUrl: '/tours/du-thuyen-ha-long-2n1d',
        description: 'Trải nghiệm du thuyền thượng hạng giữa kỳ quan thiên nhiên thế giới',
        position: 'HOME_HERO',
        isActive: true,
      },
      {
        name: 'Đà Nẵng - Cầu Vàng & Bán Đảo Sơn Trà',
        imageUrl: '/uploads/banners/banner-danang-goldenbridge.jpg',
        linkUrl: '/destinations/da-nang',
        description: 'Check-in tuyệt tác Cầu Vàng trên đỉnh Bà Nà Hills',
        position: 'DESTINATION_PAGE',
        isActive: true,
      },
      {
        name: 'Thiên Đường Nghỉ Dưỡng Phú Quốc',
        imageUrl: '/uploads/banners/banner-phuquoc-paradise.jpg',
        linkUrl: '/tours?destination=phu-quoc',
        description: 'Bãi cát trắng mịn, lặn ngắm san hô và hoàng hôn tuyệt mỹ',
        position: 'TOUR_PAGE',
        isActive: true,
      },
    ];

    for (const b of bannersToCreate) {
      await prisma.banner.create({ data: b });
      console.log(`  ✓ Created Banner: ${b.name}`);
    }
  } else {
    console.log(`  ✓ Banners already exist (${existingBanners.length} records)`);
  }
}

async function main() {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  
  await downloadSet('Blogs', blogImages, path.join(uploadsDir, 'blogs'));
  await downloadSet('Stories', storyImages, path.join(uploadsDir, 'stories'));
  await downloadSet('Banners', bannerImages, path.join(uploadsDir, 'banners'));

  await updateDatabase();

  console.log('\n🎉 ALL DONE! Images downloaded locally and database updated successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
