// Repair hotel rows whose names were overwritten out of order by an old image seed.
// Reads the canonical hotel records already maintained in prisma/seed.js.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const prisma = require('../lib/prisma');

function field(line, key) {
  const match = line.match(new RegExp(`${key}: '([^']*)'`));
  return match?.[1];
}

async function main() {
  const source = fs.readFileSync(path.join(__dirname, '../prisma/seed.js'), 'utf8');
  const start = source.indexOf('const hotels = [');
  const end = source.indexOf('for (const hotel of hotels)', start);
  if (start < 0 || end < 0) throw new Error('Hotel seed section was not found');
  const canonical = new Map();
  for (const line of source.slice(start, end).split(/\r?\n/)) {
    const slug = field(line, 'slug');
    if (!slug) continue;
    canonical.set(slug, {
      name: field(line, 'name'),
      description: field(line, 'description'),
      pricePerNight: Number(line.match(/pricePerNight: (\d+)/)?.[1]),
      rating: Number(line.match(/rating: ([\d.]+)/)?.[1]),
    });
  }
  if (canonical.size < 50) throw new Error('Hotel seed data is incomplete');

  const hotels = await prisma.hotel.findMany({ select: { id: true, slug: true, name: true } });
  const mismatches = hotels.filter((hotel) => canonical.has(hotel.slug) && hotel.name !== canonical.get(hotel.slug).name);
  for (const hotel of mismatches) {
    const data = canonical.get(hotel.slug);
    console.log(`${hotel.slug}: ${hotel.name} -> ${data.name}`);
    if (process.argv.includes('--apply')) {
      await prisma.hotel.update({ where: { id: hotel.id }, data });
    }
  }
  console.log(`${mismatches.length} mismatched hotel records${process.argv.includes('--apply') ? ' repaired' : ' (dry run)'}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
