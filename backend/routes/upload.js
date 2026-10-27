// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authRequired, isAdminOrStaff } = require('../middleware/auth');
const router = express.Router();

// Whitelist extensions and mime types
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const getSafeFilename = (prefix, originalname) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(originalname).toLowerCase();
  const safeExt = ALLOWED_EXTENSIONS.has(ext) ? ext : '.jpg';
  return `${prefix}-${uniqueSuffix}${safeExt}`;
};

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, '..', 'uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');
const destinationsDir = path.join(uploadsDir, 'destinations');
const hotelsDir = path.join(uploadsDir, 'hotels');
const restaurantsDir = path.join(uploadsDir, 'restaurants');
const blogsDir = path.join(uploadsDir, 'blogs');
const reviewsDir = path.join(uploadsDir, 'reviews');
const bannersDir = path.join(uploadsDir, 'banners');
const toursDir = path.join(uploadsDir, 'tours');

[uploadsDir, avatarsDir, destinationsDir, hotelsDir, restaurantsDir, blogsDir, reviewsDir, bannersDir, toursDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Cấu hình multer cho avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    cb(null, getSafeFilename('avatar', file.originalname));
  }
});

// Cấu hình multer cho destinations
const destinationStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destinationsDir);
  },
  filename: (req, file, cb) => {
    cb(null, getSafeFilename('destination', file.originalname));
  }
});

// Cấu hình multer cho hotels
const hotelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, hotelsDir);
  },
  filename: (req, file, cb) => {
    cb(null, getSafeFilename('hotel', file.originalname));
  }
});

// Cấu hình multer cho restaurants
const restaurantStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, restaurantsDir);
  },
  filename: (req, file, cb) => {
    cb(null, getSafeFilename('restaurant', file.originalname));
  }
});

// Cấu hình multer cho blogs
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, blogsDir);
  },
  filename: (req, file, cb) => {
    cb(null, getSafeFilename('blog', file.originalname));
  }
});

// Cấu hình multer cho reviews
const reviewStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, reviewsDir);
  },
  filename: (req, file, cb) => {
    cb(null, getSafeFilename('review', file.originalname));
  }
});

// Cấu hình multer cho banners
const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, bannersDir);
  },
  filename: (req, file, cb) => {
    cb(null, getSafeFilename('banner', file.originalname));
  }
});

// File filter - chỉ cho phép ảnh hợp lệ
const imageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXTENSIONS.has(ext) && ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file ảnh hợp lệ (.jpg, .jpeg, .png, .webp, .gif)!'), false);
  }
};

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter
});

const uploadDestination = multer({
  storage: destinationStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imageFilter
});

const uploadHotel = multer({
  storage: hotelStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imageFilter
});

const uploadRestaurant = multer({
  storage: restaurantStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imageFilter
});

const uploadBlog = multer({
  storage: blogStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imageFilter
});

const uploadReview = multer({
  storage: reviewStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imageFilter
});

const uploadBanner = multer({
  storage: bannerStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imageFilter
});

// Cấu hình multer cho tours
const tourStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, toursDir);
  },
  filename: (req, file, cb) => {
    cb(null, getSafeFilename('tour', file.originalname));
  }
});

const uploadTour = multer({
  storage: tourStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imageFilter
});

// POST /api/upload/avatar - Upload avatar
const uploadAvatarHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload' });
    }

    const userId = req.user.id;
    const fileUrl = `/uploads/avatars/${req.file.filename}`;

    // Update user avatarUrl in database
    const prisma = require('../lib/prisma');
    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: fileUrl }
    });

    res.json({
      success: true,
      url: fileUrl,
      message: 'Upload avatar thành công'
    });
  } catch (error) {
    console.error('❌ Error uploading avatar:', error);
    res.status(500).json({ error: 'Lỗi khi upload avatar', message: error.message });
  }
};

router.post('/avatar', authRequired, uploadAvatar.single('file'), uploadAvatarHandler);

// POST /api/upload/destination - Upload destination image
router.post('/destination', authRequired, isAdminOrStaff, uploadDestination.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload' });
    }

    const fileUrl = `/uploads/destinations/${req.file.filename}`;

    console.log('✅ Destination image uploaded successfully:', { 
      userId: req.user.id, 
      fileUrl, 
      filename: req.file.filename 
    });

    res.json({
      success: true,
      url: fileUrl,
      message: 'Upload ảnh điểm đến thành công'
    });
  } catch (error) {
    console.error('❌ Error uploading destination image:', error);
    res.status(500).json({ error: 'Lỗi khi upload ảnh', message: error.message });
  }
});

// POST /api/upload/hotel - Upload hotel image
router.post('/hotel', authRequired, isAdminOrStaff, uploadHotel.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload' });
    }

    const fileUrl = `/uploads/hotels/${req.file.filename}`;

    console.log('✅ Hotel image uploaded successfully:', { 
      userId: req.user.id, 
      fileUrl, 
      filename: req.file.filename 
    });

    res.json({
      success: true,
      url: fileUrl,
      message: 'Upload ảnh khách sạn thành công'
    });
  } catch (error) {
    console.error('❌ Error uploading hotel image:', error);
    res.status(500).json({ error: 'Lỗi khi upload ảnh', message: error.message });
  }
});

// POST /api/upload/restaurant - Upload restaurant image
router.post('/restaurant', authRequired, isAdminOrStaff, uploadRestaurant.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload' });
    }

    const fileUrl = `/uploads/restaurants/${req.file.filename}`;

    console.log('✅ Restaurant image uploaded successfully:', { 
      userId: req.user.id, 
      fileUrl, 
      filename: req.file.filename 
    });

    res.json({
      success: true,
      url: fileUrl,
      message: 'Upload ảnh nhà hàng thành công'
    });
  } catch (error) {
    console.error('❌ Error uploading restaurant image:', error);
    res.status(500).json({ error: 'Lỗi khi upload ảnh', message: error.message });
  }
});

// POST /api/upload/blog - Upload blog featured image
router.post('/blog', authRequired, isAdminOrStaff, uploadBlog.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload' });
    }

    const fileUrl = `/uploads/blogs/${req.file.filename}`;

    console.log('✅ Blog image uploaded successfully:', { 
      userId: req.user.id, 
      fileUrl, 
      filename: req.file.filename 
    });

    res.json({
      success: true,
      url: fileUrl,
      message: 'Upload ảnh blog thành công'
    });
  } catch (error) {
    console.error('❌ Error uploading blog image:', error);
    res.status(500).json({ error: 'Lỗi khi upload ảnh', message: error.message });
  }
});

// POST /api/upload/review - Upload review images (public, no auth required for guest reviews)
router.post('/review', uploadReview.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload' });
    }

    const fileUrl = `/uploads/reviews/${req.file.filename}`;

    console.log('✅ Review image uploaded successfully:', { 
      fileUrl, 
      filename: req.file.filename 
    });

    res.json({
      success: true,
      url: fileUrl,
      message: 'Upload ảnh đánh giá thành công'
    });
  } catch (error) {
    console.error('❌ Error uploading review image:', error);
    res.status(500).json({ error: 'Lỗi khi upload ảnh', message: error.message });
  }
});

// POST /api/upload/banner - Upload banner image
router.post('/banner', authRequired, isAdminOrStaff, uploadBanner.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload' });
    }

    const fileUrl = `/uploads/banners/${req.file.filename}`;

    console.log('✅ Banner image uploaded successfully:', { 
      userId: req.user.id, 
      fileUrl, 
      filename: req.file.filename 
    });

    res.json({
      success: true,
      url: fileUrl,
      message: 'Upload ảnh banner thành công'
    });
  } catch (error) {
    console.error('❌ Error uploading banner image:', error);
    res.status(500).json({ error: 'Lỗi khi upload ảnh', message: error.message });
  }
});

// POST /api/upload/tour - Upload tour image
router.post('/tour', authRequired, isAdminOrStaff, uploadTour.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload' });
    }

    const fileUrl = `/uploads/tours/${req.file.filename}`;

    console.log('✅ Tour image uploaded successfully:', { 
      userId: req.user.id, 
      fileUrl, 
      filename: req.file.filename 
    });

    res.json({
      success: true,
      url: fileUrl,
      message: 'Upload ảnh tour thành công'
    });
  } catch (error) {
    console.error('❌ Error uploading tour image:', error);
    res.status(500).json({ error: 'Lỗi khi upload ảnh', message: error.message });
  }
});

// Serve static files from uploads directory
router.use('/files', express.static(uploadsDir));

// Export handler for /api/account/avatar route
router.uploadAvatarHandler = uploadAvatarHandler;
router.uploadAvatar = uploadAvatar;

module.exports = router;
