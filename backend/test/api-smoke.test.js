process.env.NODE_ENV = 'test';

const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const { after, before, test } = require('node:test');
const { app } = require('../index');
const prisma = require('../lib/prisma');

let server;
let baseUrl;
let testUser;
let testAdmin;
const testPassword = 'QaTest-Passw0rd!';

before(async () => {
  await prisma.$connect();
  const runId = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(testPassword, 10);
  testUser = await prisma.user.create({
    data: {
      email: `qa-user-${runId}@example.invalid`,
      passwordHash,
      name: 'QA Test User',
      role: 'USER',
    },
  });
  testAdmin = await prisma.user.create({
    data: {
      email: `qa-admin-${runId}@example.invalid`,
      passwordHash,
      name: 'QA Test Admin',
      role: 'ADMIN',
    },
  });
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await prisma.refreshToken.deleteMany({
    where: { userId: { in: [testUser.id, testAdmin.id] } },
  });
  await prisma.user.deleteMany({
    where: { id: { in: [testUser.id, testAdmin.id] } },
  });
  await prisma.$disconnect();
});

async function get(path) {
  return fetch(`${baseUrl}${path}`);
}

async function login(email, password = testPassword) {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return { response, body: await response.json() };
}

test('serves the public data APIs', async () => {
  const paths = [
    '/',
    '/api/category',
    '/api/destination',
    '/api/tour',
    '/api/hotel',
    '/api/restaurant',
    '/api/blog',
    '/api/stories',
    '/api/banner',
    '/api/support',
    '/robots.txt',
  ];

  for (const path of paths) {
    const response = await get(path);
    assert.equal(response.status, 200, `${path} should return HTTP 200`);
  }
});

test('accepts the local frontend origin used by the development proxy', async () => {
  const response = await fetch(`${baseUrl}/api/tour`, {
    headers: { Origin: 'http://127.0.0.1:3001' },
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://127.0.0.1:3001');
});

test('serves discount data without obsolete Prisma fields', async () => {
  const [flashSale, seasonal] = await Promise.all([
    get('/api/flash-sale'),
    get('/api/landing/seasonal'),
  ]);

  assert.equal(flashSale.status, 200);
  assert.equal(seasonal.status, 200);

  const flashSaleBody = await flashSale.json();
  const seasonalBody = await seasonal.json();
  assert.equal(flashSaleBody.success, true);
  assert.ok(Array.isArray(flashSaleBody.tours));
  assert.ok(Array.isArray(seasonalBody.flashSales));
});

test('keeps tour list, detail and approved reviews consistent', async () => {
  const listing = await get('/api/tour?q=Da%20Nang&limit=20');
  assert.equal(listing.status, 200);
  const { items } = await listing.json();
  const daNang = items.find((tour) => tour.slug === 'da-nang-hoi-an-3n2d');
  assert.ok(daNang, 'Da Nang tour must appear in search results');

  const [detailResponse, reviewsResponse] = await Promise.all([
    get(`/api/tour/${daNang.slug}`),
    get(`/api/tour/${daNang.id}/reviews`),
  ]);
  assert.equal(detailResponse.status, 200);
  assert.equal(reviewsResponse.status, 200);
  const detail = await detailResponse.json();
  const reviews = await reviewsResponse.json();
  assert.equal(detail.price, daNang.price);
  assert.equal(detail.duration, daNang.duration);
  assert.equal(detail.itinerary.length, detail.duration);
  assert.equal(detail.reviewCount, reviews.length);
  assert.equal(daNang.reviewCount, reviews.length);
});

test('keeps hotel and restaurant listings consistent with their detail URLs', async () => {
  for (const category of ['hotel', 'restaurant']) {
    const listing = await get(`/api/${category}?page=1&pageSize=12`);
    assert.equal(listing.status, 200);
    const { items, total } = await listing.json();
    assert.ok(total > 0, `${category} list should contain records`);
    assert.ok(items.length > 0);
    const item = items[0];
    const detailResponse = await get(`/api/${category}/${item.slug}`);
    assert.equal(detailResponse.status, 200);
    const detail = await detailResponse.json();
    assert.equal(detail.id, item.id);
    assert.equal(detail.name, item.name);
    assert.equal(detail.city, item.city);
  }

  const pho = await get('/api/restaurant/pho-gia-truyen-bat-dan');
  assert.equal(pho.status, 200);
  const detail = await pho.json();
  assert.match(detail.name, /Phở/);
  assert.equal(detail.city, 'Hà Nội');
  assert.match(detail.cuisine, /Hà Nội/);
  assert.match(detail.priceRange, /50\.000/);
});

test('lists only live vouchers and blocks unverified services', async () => {
  const voucherResponse = await get('/api/promo/active');
  assert.equal(voucherResponse.status, 200);
  const vouchers = await voucherResponse.json();
  assert.ok(Array.isArray(vouchers));
  const now = Date.now();
  for (const voucher of vouchers) {
    assert.equal(voucher.active, true);
    assert.ok(Date.parse(voucher.validFrom) <= now);
    assert.ok(Date.parse(voucher.validUntil) >= now);
  }

  for (const payload of [
    { type: 'combo', totalAmount: 6780000 },
    { type: 'hotel', totalAmount: 1000000 },
    { type: 'restaurant', totalAmount: 0 },
    { type: 'cart', items: [{ type: 'hotel' }], totalAmount: 1000000 },
  ]) {
    const response = await fetch(`${baseUrl}/api/booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.equal(response.status, 422, `${payload.type} should not create a payable booking`);
  }
});

test('rejects a forged discount without a valid voucher', async () => {
  const response = await fetch(`${baseUrl}/api/booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'destination',
      destination: 'da-nang',
      guests: 1,
      email: testUser.email,
      price: 1000000,
      totalAmount: 1000000,
      discountAmount: 100,
    }),
  });
  assert.equal(response.status, 400);

  const guestCoupon = await fetch(`${baseUrl}/api/booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'destination',
      destination: 'da-nang',
      email: testUser.email,
      price: 900000,
      totalAmount: 900000,
      promoBaseAmount: 1000000,
      discountAmount: 100000,
      couponCode: 'MEMBER10',
    }),
  });
  assert.equal(guestCoupon.status, 401);
});

test('rejects tour payment while its refund terms are unpublished', async () => {
  const tour = (await prisma.tour.findMany({ take: 20 })).find((item) => !item.policies);
  assert.ok(tour, 'fixture should contain an unpublished refund policy');
  const response = await fetch(`${baseUrl}/api/booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'tour', tourId: tour.id, email: testUser.email, totalAmount: tour.price }),
  });
  assert.equal(response.status, 422);
});

test('generates a sitemap from published blogs', async () => {
  const response = await get('/sitemap.xml');

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/xml/);
  assert.match(await response.text(), /<urlset/);
});

test('protects booking administration when unauthenticated', async () => {
  const response = await get('/api/booking');

  assert.equal(response.status, 401);
});

test('validates registration input without creating an account', async () => {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email }),
  });

  assert.equal(response.status, 400);
});

test('authenticates a user and limits access to their own account', async () => {
  const { response, body } = await login(testUser.email);

  assert.equal(response.status, 200);
  assert.equal(body.user.email, testUser.email);
  assert.ok(body.token);

  const headers = { Authorization: `Bearer ${body.token}` };
  const [profile, ownBookings, adminBookings] = await Promise.all([
    fetch(`${baseUrl}/api/auth/user`, { headers }),
    fetch(`${baseUrl}/api/booking/user/${testUser.id}`, { headers }),
    fetch(`${baseUrl}/api/booking`, { headers }),
  ]);

  assert.equal(profile.status, 200);
  const profileBody = await profile.json();
  assert.equal(profileBody.authenticated, true);
  assert.equal(profileBody.user.email, testUser.email);
  assert.equal(ownBookings.status, 200);
  assert.equal(adminBookings.status, 403);
});

test('rejects a wrong password and permits an administrator', async () => {
  const invalidLogin = await login(testUser.email, 'wrong-password');
  assert.equal(invalidLogin.response.status, 401);

  const adminLogin = await login(testAdmin.email);
  assert.equal(adminLogin.response.status, 200);
  assert.equal(adminLogin.body.user.role, 'ADMIN');

  const headers = { Authorization: `Bearer ${adminLogin.body.token}` };
  const [bookings, summary] = await Promise.all([
    fetch(`${baseUrl}/api/booking`, { headers }),
    fetch(`${baseUrl}/api/admin/summary`, { headers }),
  ]);
  assert.equal(bookings.status, 200);
  assert.equal(summary.status, 200);
});
