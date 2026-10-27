const https = require('https');
const fs = require('fs');
const path = require('path');

const hotelImages = {
  'halong-luxury.jpg': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000',
  'halong-view.jpg': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000',
  'emerald-halong.jpg': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000',
  'phuquoc-beach.jpg': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000',
  'phuquoc-sunset.jpg': 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1000',
  'pearl-phuquoc.jpg': 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1000',
  'hanoi-oldquarter.jpg': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000',
  'hanoi-skyline.jpg': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1000',
  'sofitel-hanoi.jpg': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1000',
  'danang-beach.jpg': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1000',
  'hyatt-danang.jpg': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000',
  'dalat-mountain.jpg': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000',
  'dalat-villa.jpg': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000',
  'hoian-riverside.jpg': 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1000',
  'anantara-hoian.jpg': 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=1000',
  'nhatrang-oceanic.jpg': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000',
  'intercontinental-nhatrang.jpg': 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1000',
  'sapa-charm.jpg': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000',
  'victoria-sapa.jpg': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000',
  'ninhbinh-eco.jpg': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000',
  'patong-phuket.jpg': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000',
  'lemeridien-phuket.jpg': 'https://images.unsplash.com/photo-1519449556851-56233967f026?w=1000',
  'bangkok-riverside.jpg': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1000',
  'mandarin-bangkok.jpg': 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1000',
  'ubud-jungle.jpg': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000',
  'seminyak-bali.jpg': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1000',
  'mbs-singapore.jpg': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1000',
  'raffles-singapore.jpg': 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1000',
  'park-hyatt-tokyo.jpg': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000',
  'fourseasons-seoul.jpg': 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1000',
  'plaza-paris.jpg': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000',
  'savoy-london.jpg': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1000',
  'danieli-venice.jpg': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1000',
  'burj-al-arab.jpg': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1000',
  'langham-sydney.jpg': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1000',
};

const targetDir = path.join(__dirname, '..', 'uploads', 'hotels');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
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
          reject(new Error(`Failed to download: status ${res.statusCode}`));
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
  console.log('🚀 Downloading curated hotel photos...');
  for (const [filename, url] of Object.entries(hotelImages)) {
    const dest = path.join(targetDir, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`✓ Already exists: ${filename}`);
      continue;
    }
    try {
      console.log(`⬇ Downloading ${filename}...`);
      await downloadImage(url, dest);
      console.log(`✓ Saved: ${filename}`);
    } catch (e) {
      console.error(`✗ Error downloading ${filename}:`, e.message);
    }
  }
  console.log('🎉 Done seeding hotel images!');
}

run();
