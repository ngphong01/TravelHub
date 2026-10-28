const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authRequired } = require('../middleware/auth');
const { sendBookingConfirmationEmail } = require('../lib/email');

const hasPublishedRefundPolicy = (policies) =>
  policies && typeof policies === 'object' &&
  typeof policies.cancellation === 'string' && policies.cancellation.trim() &&
  typeof policies.refund === 'string' && policies.refund.trim();

// Tạo mã booking ngẫu nhiên
const generateBookingCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'BK';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// POST /api/booking - Tạo booking mới
router.post('/', async (req, res) => {
  try {
    if (req.body.type === 'combo' || req.body.comboId) {
      return res.status(422).json({ message: 'Đặt combo trực tuyến tạm dừng cho đến khi lịch, số đêm và giá được xác thực.' });
    }
    if (['hotel', 'restaurant'].includes(req.body.type) ||
        (req.body.type === 'cart' && Array.isArray(req.body.items) &&
          req.body.items.some(item => ['hotel', 'restaurant'].includes(item?.type)))) {
      return res.status(422).json({ message: 'Khách sạn và nhà hàng chưa có dữ liệu phòng/bàn trống được xác thực. Chưa thể nhận thanh toán trực tuyến.' });
    }
    if (req.body.type === 'cart') {
      if (!Array.isArray(req.body.items) || !req.body.items.length) {
        return res.status(422).json({ message: 'Giỏ hàng chưa có dịch vụ hợp lệ.' });
      }
      for (const item of req.body.items) {
        if (item?.type !== 'tour' || !Number.isInteger(Number(item.itemId))) {
          return res.status(422).json({ message: 'Giỏ hàng có dịch vụ chưa được xác thực.' });
        }
        const cartTour = await prisma.tour.findUnique({ where: { id: Number(item.itemId) } });
        if (!cartTour || !hasPublishedRefundPolicy(cartTour.policies)) {
          return res.status(422).json({ message: 'Tour trong giỏ chưa công bố chính sách hoàn hủy. Chưa thể thanh toán trực tuyến.' });
        }
        if (Number(item.children) > 0 && cartTour.childPrice == null) {
          return res.status(422).json({ message: 'Tour trong giỏ chưa công bố giá trẻ em.' });
        }
      }
    }
    console.log('📦 Booking Request Body:', JSON.stringify(req.body, null, 2));

    const {
      type,
      destination,
      destinationName,
      tourId,
      comboId,
      comboName,
      comboTitle,
      from,
      to,
      guests,
      adults,
      children,
      name,
      email,
      phone,
      price,
      totalAmount,
      paymentMethod,
      couponCode,
      promoBaseAmount,
      discountPercent,
      discountAmount,
      cardMeta,
      cardInfo,
      notes
    } = req.body;

    let dest = null;
    let tour = null;
    let userId = null;
    let isAuthenticatedBooking = false;

    // ========== XỬ LÝ COMBO BOOKING ==========
    if (type === 'combo' || comboId) {
      console.log('🎯 Processing COMBO booking');
      
      // Tìm hoặc tạo destination cho combo
      dest = await prisma.destination.upsert({
        where: { slug: 'combo' },
        update: {},
        create: {
          name: 'Combo Tours',
          slug: 'combo',
          description: 'Combo tour packages'
        }
      });
    }
    // ========== XỬ LÝ CART BOOKING ==========
    else if (type === 'cart' || destination === 'cart') {
      console.log('🎯 Processing CART booking');
      dest = await prisma.destination.upsert({
        where: { slug: 'cart' },
        update: {},
        create: {
          name: 'Giỏ hàng TravelHub',
          slug: 'cart',
          description: 'Đơn đặt dịch vụ giỏ hàng'
        }
      });
    }
    // ========== XỬ LÝ TOUR BOOKING ==========
    else if (tourId) {
      console.log('🎯 Processing TOUR booking with tourId:', tourId);
      
      // Tìm tour
      tour = await prisma.tour.findUnique({
        where: { id: parseInt(tourId) }
      });
      
      if (!tour) {
        console.log('❌ Tour not found with id:', tourId);
        return res.status(404).json({ message: 'Tour not found' });
      }
      if (!hasPublishedRefundPolicy(tour.policies)) {
        return res.status(422).json({ message: 'Tour chưa công bố chính sách hoàn hủy. Chưa thể thanh toán trực tuyến.' });
      }
      if (Number(children) > 0 && tour.childPrice == null) {
        return res.status(422).json({ message: 'Tour chưa công bố giá trẻ em.' });
      }
      
      console.log('✅ Found tour:', tour.name, '| destinationId:', tour.destinationId);
      
      // Nếu tour có destinationId, tìm destination
      if (tour.destinationId) {
        dest = await prisma.destination.findUnique({
          where: { id: tour.destinationId }
        });
        console.log('✅ Found destination from tour:', dest?.name);
      }
      
      // Nếu tour KHÔNG có destinationId hoặc destination không tìm thấy
      if (!dest) {
        console.log('⚠️ Tour không có destination, tạo/tìm destination mặc định');
        
        // Tạo slug từ tour
        const tourSlug = tour.slug || `tour-${tourId}`;
        const tourName = tour.name || `Tour ${tourId}`;
        
        // Thử tìm destination bằng slug của tour
        dest = await prisma.destination.findUnique({
          where: { slug: tourSlug }
        });
        
        // Nếu vẫn không có, tạo destination mới
        if (!dest) {
          console.log('📝 Creating new destination for tour:', tourSlug);
          
          dest = await prisma.destination.create({
            data: {
              name: tourName,
              slug: tourSlug,
              description: `Destination for ${tourName}`,
              image: tour.image || null
            }
          });
          
          console.log('✅ Created new destination:', dest.id, dest.name);
        }
        
        // Cập nhật tour với destinationId mới
        await prisma.tour.update({
          where: { id: tour.id },
          data: { destinationId: dest.id }
        });
        console.log('✅ Updated tour with destinationId:', dest.id);
      }
    }
    // ========== XỬ LÝ DESTINATION BOOKING ==========
    else if (destination) {
      console.log('🎯 Processing DESTINATION booking with slug:', destination);
      
      // Tìm destination bằng slug
      dest = await prisma.destination.findUnique({
        where: { slug: destination }
      });
      
      // Nếu không tìm thấy, thử tìm tour bằng slug đó
      if (!dest) {
        console.log('⚠️ Destination not found, trying to find tour with slug:', destination);
        
        tour = await prisma.tour.findUnique({
          where: { slug: destination }
        });
        
        if (tour) {
          if (!hasPublishedRefundPolicy(tour.policies)) {
            return res.status(422).json({ message: 'Tour chưa công bố chính sách hoàn hủy. Chưa thể thanh toán trực tuyến.' });
          }
          if (Number(children) > 0 && tour.childPrice == null) {
            return res.status(422).json({ message: 'Tour chưa công bố giá trẻ em.' });
          }
          console.log('✅ Found tour by slug:', tour.name);
          
          // Nếu tour có destinationId
          if (tour.destinationId) {
            dest = await prisma.destination.findUnique({
              where: { id: tour.destinationId }
            });
          }
          
          // Nếu vẫn không có destination, tạo mới
          if (!dest) {
            const tourName = tour.name || destination;
            
            dest = await prisma.destination.create({
              data: {
                name: tourName,
                slug: destination,
                description: `Destination for ${tourName}`,
                image: tour.image || null
              }
            });
            
            // Cập nhật tour
            await prisma.tour.update({
              where: { id: tour.id },
              data: { destinationId: dest.id }
            });
            console.log('✅ Created destination and updated tour');
          }
        } else {
          // Không tìm thấy cả destination lẫn tour, tạo destination mới
          console.log('📝 Creating new destination:', destination);
          
          dest = await prisma.destination.create({
            data: {
              name: destinationName || destination,
              slug: destination,
              description: `Destination ${destinationName || destination}`
            }
          });
        }
      }
    }

    // Kiểm tra destination cuối cùng
    if (!dest) {
      console.log('❌ Could not find or create destination');
      return res.status(404).json({ 
        message: 'Destination not found',
        debug: { type, destination, tourId, comboId }
      });
    }

    console.log('✅ Final destination:', dest.id, dest.name);

    // ========== XỬ LÝ USER ==========
    // Lấy userId từ token nếu có
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token && process.env.JWT_SECRET) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        userId = decoded.userId || decoded.id;
        isAuthenticatedBooking = Boolean(userId);
        console.log('✅ User authenticated:', userId);
      } catch (err) {
        console.log('⚠️ Token invalid, continuing without userId');
      }
    }

    // Nếu không có userId từ token, tìm hoặc tạo user bằng email
    if (!userId && email) {
      let user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) {
        // Tạo user mới
        const bcrypt = require('bcryptjs');
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        
        user = await prisma.user.create({
          data: {
            email,
            passwordHash: hashedPassword,
            name: name || 'Guest',
            phone: phone || null
          }
        });
        console.log('✅ Created new guest user:', user.id);
      }
      
      userId = user.id;
    }

    // Đảm bảo có userId
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required. Please login or provide email.' });
    }

    // ========== XỬ LÝ PROMO CODE ==========
    let finalAmount = Number(totalAmount || price);
    let appliedPromo = null;

    if (couponCode) {
      if (!isAuthenticatedBooking) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập để sử dụng mã giảm giá.' });
      }
      const promo = await prisma.promoCode.findFirst({
        where: {
          code: couponCode.toUpperCase(),
          active: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() }
        }
      });

      const baseAmount = Number(promoBaseAmount);
      if (!promo || !Number.isFinite(baseAmount) || baseAmount <= 0 || baseAmount < promo.minAmount ||
          (promo.usageLimit && promo.usedCount >= promo.usageLimit)) {
        return res.status(400).json({ message: 'Mã giảm giá không hợp lệ hoặc đã hết hiệu lực' });
      }
      const rawDiscount = promo.discountType === 'PERCENTAGE'
        ? Math.floor(baseAmount * promo.discountValue / 100)
        : promo.discountValue;
      const expectedDiscount = Math.min(baseAmount, promo.maxDiscount ? Math.min(rawDiscount, promo.maxDiscount) : rawDiscount);
      const priorUse = await prisma.promoCodeUsage.findFirst({
        where: { promoCodeId: promo.id, userId },
      });
      if (priorUse) {
        return res.status(400).json({ message: 'Bạn đã sử dụng mã giảm giá này rồi' });
      }
      if (Number(discountAmount) !== expectedDiscount || finalAmount !== Number(price)) {
        return res.status(400).json({ message: 'Số tiền giảm giá không khớp mã ưu đãi' });
      }
      appliedPromo = promo;
    }

    if (discountAmount && !appliedPromo) {
      return res.status(400).json({ message: 'Giảm giá phải có mã ưu đãi hợp lệ' });
    }

    // ========== SERVER-SIDE PRICE TAMPERING PROTECTION ==========
    if (tour && tour.price) {
      const guestCount = Math.max(1, parseInt(guests) || ((parseInt(adults) || 1) + (parseInt(children) || 0)));
      const baseExpected = Number(tour.price) * guestCount;
      const minAcceptablePrice = Math.round(baseExpected * 0.5);
      if (finalAmount < minAcceptablePrice) {
        console.warn(`🚨 Price tampering detected for tour ${tour.id}: submitted ${finalAmount}, minimum expected ${minAcceptablePrice}`);
        return res.status(400).json({ 
          message: 'Số tiền thanh toán không hợp lệ với giá tour niêm yết. Vui lòng kiểm tra lại.',
          expectedPrice: baseExpected
        });
      }
    }

    // ========== TẠO BOOKING ==========
    const bookingCode = generateBookingCode();
    
    const bookingData = {
      code: bookingCode,
      userId: userId,
      destinationId: dest.id,
      status: 'PENDING',
      totalAmount: parseInt(finalAmount) || parseInt(price) || 0,
    };

    console.log('📝 Creating booking with data:', JSON.stringify(bookingData, null, 2));

    const booking = await prisma.booking.create({
      data: bookingData,
      include: {
        destination: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    if (appliedPromo) {
      await prisma.promoCode.update({
        where: { id: appliedPromo.id },
        data: { usedCount: { increment: 1 } },
      });
    }
    console.log('✅ Booking created:', booking.id, booking.code);

    // ========== TẠO PAYMENT RECORD ==========
    const paymentData = {
      bookingId: booking.id,
      amount: parseInt(finalAmount) || parseInt(price) || 0,
      provider: (paymentMethod || 'BANK_TRANSFER').toUpperCase().replace('-', '_'),
      status: 'PENDING',
    };

    const payment = await prisma.payment.create({
      data: paymentData
    });
    console.log('✅ Payment created:', payment.id);

    // ========== GỬI EMAIL XÁC NHẬN ==========
    if (email) {
      try {
        // Lấy thông tin user để gửi email
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true, email: true }
        });
        
        if (user) {
          await sendBookingConfirmationEmail(
            {
              ...booking,
              guests: parseInt(guests) || parseInt(adults) + parseInt(children) || 1,
              from: from ? new Date(from) : new Date(),
              to: to ? new Date(to) : new Date(),
            },
            user,
            dest
          );
          console.log('✅ Confirmation email sent to:', email);
        }
      } catch (emailErr) {
        console.error('⚠️ Failed to send email:', emailErr.message);
        // Không throw error, vẫn tiếp tục
      }
    }

    // ========== RESPONSE ==========
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        code: booking.code,
        status: booking.status,
        totalAmount: booking.totalAmount,
        destinationId: booking.destinationId,
        destination: booking.destination
      },
      payment: {
        id: payment.id,
        status: payment.status,
        provider: payment.provider
      }
    });

  } catch (error) {
    console.error('❌ Booking Error:', error);
    res.status(500).json({
      message: 'Failed to create booking',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET /api/booking/user/:userId - Lấy bookings của user
router.get('/user/:userId', authRequired, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Kiểm tra quyền truy cập
    if (req.user.id !== parseInt(userId) && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: parseInt(userId) },
      include: {
        destination: true,
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Failed to get bookings', error: error.message });
  }
});

// GET /api/booking/code/:code - Lấy booking theo mã code
router.get('/code/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { code: String(code).trim().toUpperCase() },
      include: {
        destination: true,
        payment: true,
        user: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking by code error:', error);
    res.status(500).json({ message: 'Failed to get booking', error: error.message });
  }
});

// POST /api/booking/:id/cancel - Hủy đặt chỗ
router.post('/:id/cancel', authRequired, async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: 'Mã booking không hợp lệ' });
    }

    const existing = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (existing.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Không có quyền hủy đặt chỗ này' });
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      include: { destination: true, payment: true }
    });

    res.json({ success: true, message: 'Đã hủy đặt chỗ thành công', booking });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
  }
});

// GET /api/booking/:id - Lấy chi tiết booking
router.get('/:id', authRequired, async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: 'Mã booking không hợp lệ' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        destination: true,
        payment: true,
        user: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Không có quyền xem chi tiết booking này' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Failed to get booking', error: error.message });
  }
});

// GET /api/booking - Lấy tất cả bookings (Admin)
router.get('/', authRequired, async (req, res) => {
  try {
    // Kiểm tra quyền admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { page = 1, limit = 10, status, type } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status.toUpperCase();

    const [bookings, count] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          destination: true,
          user: {
            select: { id: true, name: true, email: true }
          },
          payment: true
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset)
      }),
      prisma.booking.count({ where })
    ]);

    res.json({
      bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Failed to get bookings', error: error.message });
  }
});

// PATCH /api/booking/:id - Cập nhật booking status
router.patch('/:id', authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Kiểm tra quyền
    if (req.user.id !== booking.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData = {};
    if (status) updateData.status = status.toUpperCase();

    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Cập nhật payment status nếu booking confirmed
    if (status && status.toUpperCase() === 'CONFIRMED') {
      await prisma.payment.updateMany({
        where: { bookingId: parseInt(id) },
        data: { status: 'SUCCESS' }
      });
    }

    res.json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Failed to update booking', error: error.message });
  }
});

// DELETE /api/booking/:id - Xóa booking
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Chỉ admin hoặc owner mới được xóa
    if (req.user.id !== booking.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Xóa payments trước
    await prisma.payment.deleteMany({ 
      where: { bookingId: parseInt(id) } 
    });

    // Xóa booking
    await prisma.booking.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: 'Failed to delete booking', error: error.message });
  }
});

// GET /api/booking/code/:code - Lấy booking bằng code
router.get('/code/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { code },
      include: {
        destination: true,
        payment: true,
        user: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking by code error:', error);
    res.status(500).json({ message: 'Failed to get booking', error: error.message });
  }
});

module.exports = router;
