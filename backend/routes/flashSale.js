// routes/flashSale.js - Flash sale management
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authRequired, isAdmin } = require('../middleware/auth');

// GET /api/flash-sale - Get active flash sales (public)
router.get('/', async (req, res) => {
  try {
    const tours = await prisma.tour.findMany({
      where: {
        originalPrice: { not: null },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        price: true,
        originalPrice: true,
        duration: true,
        rating: true,
        destination: {
          select: {
            name: true,
            country: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // The current Tour schema represents discounted tours with price and
    // originalPrice. The former flashSale* columns are not part of this
    // schema, so deriving the active deals here prevents Prisma validation
    // failures and keeps the API contract useful to clients.
    const flashSales = tours.filter((tour) => tour.originalPrice > tour.price);

    res.json({
      success: true,
      tours: flashSales.map((tour) => ({
        ...tour,
        flashSalePrice: tour.price,
        discountPercent: Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100),
        timeRemaining: null,
      })),
    });
  } catch (error) {
    console.error('Error fetching flash sales:', error);
    res.status(500).json({ message: 'Error fetching flash sales' });
  }
});

// GET /api/flash-sale/:tourId - Get flash sale details for a tour
router.get('/:tourId', async (req, res) => {
  try {
    const tourId = parseInt(req.params.tourId);
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        originalPrice: true,
      },
    });

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    const isActive = Boolean(tour.originalPrice && tour.originalPrice > tour.price);

    res.json({
      success: true,
      flashSale: isActive,
      originalPrice: tour.originalPrice || tour.price,
      flashSalePrice: isActive ? tour.price : null,
      discountPercent: isActive && tour.originalPrice
        ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
        : 0,
      startTime: null,
      endTime: null,
      timeRemaining: null,
    });
  } catch (error) {
    console.error('Error fetching flash sale details:', error);
    res.status(500).json({ message: 'Error fetching flash sale details' });
  }
});

// POST /api/flash-sale/admin - Create/update flash sale (Admin)
router.post('/admin', authRequired, isAdmin, async (req, res) => {
  try {
    const { tourId, flashSalePrice } = req.body;

    if (!tourId || !flashSalePrice) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const tour = await prisma.tour.findUnique({
      where: { id: parseInt(tourId) },
      select: { price: true, originalPrice: true },
    });

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    if (parseInt(flashSalePrice) >= tour.price) {
      return res.status(400).json({ message: 'Flash sale price must be less than original price' });
    }

    const updatedTour = await prisma.tour.update({
      where: { id: parseInt(tourId) },
      data: {
        // price is the selling price; originalPrice retains the crossed-out
        // price used throughout the existing Tour UI.
        price: parseInt(flashSalePrice),
        originalPrice: tour.originalPrice && tour.originalPrice > tour.price
          ? tour.originalPrice
          : tour.price,
      },
    });

    res.json({
      success: true,
      tour: updatedTour,
      message: 'Flash sale created successfully',
    });
  } catch (error) {
    console.error('Error creating flash sale:', error);
    res.status(500).json({ message: 'Error creating flash sale' });
  }
});

// DELETE /api/flash-sale/admin/:tourId - End flash sale (Admin)
router.delete('/admin/:tourId', authRequired, isAdmin, async (req, res) => {
  try {
    const tourId = parseInt(req.params.tourId);

    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      select: { price: true, originalPrice: true },
    });

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        price: tour.originalPrice || tour.price,
        originalPrice: null,
      },
    });

    res.json({
      success: true,
      message: 'Flash sale ended successfully',
    });
  } catch (error) {
    console.error('Error ending flash sale:', error);
    res.status(500).json({ message: 'Error ending flash sale' });
  }
});

module.exports = router;

