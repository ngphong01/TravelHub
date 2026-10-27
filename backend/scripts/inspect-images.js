const prisma = require('../lib/prisma');

async function inspect() {
  try {
    const tours = await prisma.tour.findMany({
      select: { id: true, name: true, image: true, destinationId: true },
      orderBy: { id: 'asc' }
    });
    console.log(`=== TOTAL TOURS: ${tours.length} ===`);
    tours.forEach(t => {
      console.log(`Tour #${t.id} (Dest: ${t.destinationId}): "${t.name}" -> ${t.image}`);
    });

    const dests = await prisma.destination.findMany({
      select: { id: true, name: true, image: true },
      orderBy: { id: 'asc' }
    });
    console.log(`\n=== TOTAL DESTINATIONS: ${dests.length} ===`);
    dests.forEach(d => {
      console.log(`Dest #${d.id}: "${d.name}" -> ${d.image}`);
    });

    const hotels = await prisma.hotel.findMany({
      select: { id: true, name: true, image: true },
      take: 20,
      orderBy: { id: 'asc' }
    });
    console.log(`\n=== HOTELS (sample): ${hotels.length} ===`);
    hotels.forEach(h => {
      console.log(`Hotel #${h.id}: "${h.name}" -> ${h.image}`);
    });

    const restaurants = await prisma.restaurant.findMany({
      select: { id: true, name: true, image: true },
      take: 20,
      orderBy: { id: 'asc' }
    });
    console.log(`\n=== RESTAURANTS (sample): ${restaurants.length} ===`);
    restaurants.forEach(r => {
      console.log(`Restaurant #${r.id}: "${r.name}" -> ${r.image}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error inspecting images:', err);
    process.exit(1);
  }
}

inspect();
