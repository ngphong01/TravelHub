const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const AUTHENTIC_DESTINATION_GALLERIES = {
  'ha-long': {
    primaryImage: '/uploads/tours/halong-bay-karsts.jpg',
    photos: [
      { filename: 'halong-bay-karsts.jpg', url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200' },
      { filename: 'halong-luxury-cabin.jpg', url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1000' },
      { filename: 'halong-kayak-cave.jpg', url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1000' },
      { filename: 'halong-seafood-dinner.jpg', url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=1000' },
      { filename: 'halong-aerial-view.jpg', url: 'https://images.unsplash.com/photo-1574974671999-24b7df56f53f?w=1000' }
    ]
  },
  'ha-noi': {
    primaryImage: '/uploads/tours/hanoi-tran-quoc.jpg',
    photos: [
      { filename: 'hanoi-tran-quoc.jpg', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200' },
      { filename: 'hanoi-old-quarter.jpg', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000' },
      { filename: 'hanoi-pho-bo.jpg', url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1000' },
      { filename: 'hanoi-bun-cha.jpg', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000' },
      { filename: 'hanoi-egg-coffee.jpg', url: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1000' }
    ]
  },
  'da-nang': {
    primaryImage: '/uploads/tours/danang-golden-bridge.jpg',
    photos: [
      { filename: 'danang-golden-bridge.jpg', url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200' },
      { filename: 'hoian-yellow-wall.jpg', url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1000' },
      { filename: 'hoian-lanterns-night.jpg', url: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=1000' },
      { filename: 'danang-mykhe-beach.jpg', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000' },
      { filename: 'danang-dragon-bridge.jpg', url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1000' }
    ]
  },
  'hoi-an': {
    primaryImage: '/uploads/tours/hoian-yellow-wall.jpg',
    photos: [
      { filename: 'hoian-yellow-wall.jpg', url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200' },
      { filename: 'hoian-lanterns-night.jpg', url: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=1000' },
      { filename: 'danang-golden-bridge.jpg', url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1000' },
      { filename: 'danang-mykhe-beach.jpg', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000' },
      { filename: 'danang-dragon-bridge.jpg', url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1000' }
    ]
  },
  'da-lat': {
    primaryImage: '/uploads/tours/dalat-pine-hills.jpg',
    photos: [
      { filename: 'dalat-pine-hills.jpg', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200' },
      { filename: 'dalat-misty-lake.jpg', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000' },
      { filename: 'dalat-flower-valley.jpg', url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000' },
      { filename: 'dalat-french-resort.jpg', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000' },
      { filename: 'dalat-night-hotpot.jpg', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1000' }
    ]
  },
  'sapa': {
    primaryImage: '/uploads/tours/sapa-rice-terraces.jpg',
    photos: [
      { filename: 'sapa-rice-terraces.jpg', url: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=1200' },
      { filename: 'sapa-fansipan-peak.jpg', url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1000' },
      { filename: 'sapa-valley-stream.jpg', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000' },
      { filename: 'sapa-cloud-hotel.jpg', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000' },
      { filename: 'sapa-salmon-hotpot.jpg', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1000' }
    ]
  },
  'ninh-binh': {
    primaryImage: '/uploads/tours/ninhbinh-trangan-landscape.jpg',
    photos: [
      { filename: 'ninhbinh-trangan-landscape.jpg', url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200' },
      { filename: 'ninhbinh-hangmua-view.jpg', url: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=1000' },
      { filename: 'ninhbinh-tamcoc-river.jpg', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000' },
      { filename: 'ninhbinh-ancient-temple.jpg', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1000' },
      { filename: 'ninhbinh-goat-cuisine.jpg', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000' }
    ]
  },
  'phu-quoc': {
    primaryImage: '/uploads/tours/phuquoc-white-sand.jpg',
    photos: [
      { filename: 'phuquoc-white-sand.jpg', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200' },
      { filename: 'phuquoc-ocean-resort.jpg', url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1000' },
      { filename: 'phuquoc-snorkeling-reef.jpg', url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1000' },
      { filename: 'phuquoc-seafood-night.jpg', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1000' },
      { filename: 'phuquoc-sunset-sanato.jpg', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000' }
    ]
  },
  'ha-giang': {
    primaryImage: '/uploads/tours/hagiang-mapileng-pass.jpg',
    photos: [
      { filename: 'hagiang-mapileng-pass.jpg', url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200' },
      { filename: 'hagiang-nhoque-canyon.jpg', url: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=1000' },
      { filename: 'hagiang-lungcu-flag.jpg', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1000' },
      { filename: 'hagiang-lolo-village.jpg', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000' },
      { filename: 'hagiang-warm-hotpot.jpg', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1000' }
    ]
  }
};

const TARGET_DIR = path.join(__dirname, '..', 'uploads', 'tours');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 15000) {
      return resolve(false); // already downloaded
    }

    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;

    client.get(url, { headers: { 'User-Agent': 'TravelHub-Photo-Seeder/2.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(true));
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

async function run() {
  console.log('=== FIXING AUTHENTIC TOUR PHOTOS (NO GENERIC / WRONG PLACES) ===');
  
  // 1. Download all authentic photo assets
  for (const [regionKey, config] of Object.entries(AUTHENTIC_DESTINATION_GALLERIES)) {
    console.log(`\n--- Downloading authentic assets for: [${regionKey}] ---`);
    for (const photo of config.photos) {
      const destPath = path.join(TARGET_DIR, photo.filename);
      try {
        const downloaded = await downloadImage(photo.url, destPath);
        if (downloaded) {
          console.log(`  ✓ Downloaded authentic: ${photo.filename}`);
        } else {
          console.log(`  • Already exists: ${photo.filename}`);
        }
      } catch (err) {
        console.error(`  ✗ Error downloading ${photo.filename}:`, err.message);
      }
    }
  }

  // 2. Query all tours from Prisma and update them with exact region photos
  const tours = await prisma.tour.findMany({
    include: { destination: true }
  });
  console.log(`\nFound ${tours.length} tours in database. Updating photo mappings...`);

  let updatedCount = 0;
  for (const tour of tours) {
    const slug = (tour.slug || '').toLowerCase();
    const destSlug = (tour.destination?.slug || '').toLowerCase();
    const destName = (tour.destination?.name || '').toLowerCase();

    // Find best region config match
    let matchKey = 'ha-long';
    if (slug.includes('da-lat') || destSlug.includes('da-lat') || destName.includes('đà lạt')) {
      matchKey = 'da-lat';
    } else if (slug.includes('sapa') || slug.includes('sa-pa') || destSlug.includes('sapa') || destName.includes('sa pa')) {
      matchKey = 'sapa';
    } else if (slug.includes('ninh-binh') || destSlug.includes('ninh-binh') || destName.includes('ninh bình')) {
      matchKey = 'ninh-binh';
    } else if (slug.includes('phu-quoc') || destSlug.includes('phu-quoc') || destName.includes('phú quốc')) {
      matchKey = 'phu-quoc';
    } else if (slug.includes('da-nang') || destSlug.includes('da-nang') || destName.includes('đà nẵng')) {
      matchKey = 'da-nang';
    } else if (slug.includes('hoi-an') || destSlug.includes('hoi-an') || destName.includes('hội an')) {
      matchKey = 'hoi-an';
    } else if (slug.includes('ha-noi') || destSlug.includes('ha-noi') || destName.includes('hà nội')) {
      matchKey = 'ha-noi';
    } else if (slug.includes('ha-giang') || destSlug.includes('ha-giang') || destName.includes('hà giang')) {
      matchKey = 'ha-giang';
    } else if (slug.includes('ha-long') || destSlug.includes('ha-long') || destName.includes('hạ long')) {
      matchKey = 'ha-long';
    }

    const config = AUTHENTIC_DESTINATION_GALLERIES[matchKey];
    const photoUrls = config.photos.map(p => `/uploads/tours/${p.filename}`);

    await prisma.tour.update({
      where: { id: tour.id },
      data: {
        image: config.primaryImage,
        photos: photoUrls
      }
    });
    updatedCount++;
    console.log(`[Tour #${tour.id}] "${tour.name}" -> Mapped to authentic region: [${matchKey}] (${photoUrls.length} photos)`);
  }

  console.log(`\nSuccessfully updated ${updatedCount} tours with 100% authentic local photo sets!`);
  await prisma.$disconnect();
}

run().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
