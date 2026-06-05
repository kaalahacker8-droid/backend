const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getDashboardStats,
  getLiveData,
  getAllDrivers,
  getDriverById,
  approveDriver,
  rejectDriver,
  blockDriver,
  getAllBookings,
  getBookingById,
  getAllUsers,
  getRevenueChart,
  updatePlaceFare,
  getAnalytics
} = require('../controllers/adminController');
const { adminAuth } = require('../middleware/adminMiddleware');

// Public
router.post('/login', adminLogin);

// Protected — all below require admin JWT
router.get('/stats', adminAuth, getDashboardStats);
router.get('/live', adminAuth, getLiveData);
router.get('/drivers', adminAuth, getAllDrivers);
router.get('/drivers/:id', adminAuth, getDriverById);
router.put('/drivers/:id/approve', adminAuth, approveDriver);
router.put('/drivers/:id/reject', adminAuth, rejectDriver);
router.put('/drivers/:id/block', adminAuth, blockDriver);
router.get('/bookings', adminAuth, getAllBookings);
router.get('/bookings/:id', adminAuth, getBookingById);
router.get('/users', adminAuth, getAllUsers);
router.get('/revenue', adminAuth, getRevenueChart);
router.put('/places/:id/fare', adminAuth, updatePlaceFare);
router.get('/analytics', adminAuth, getAnalytics);

module.exports = router;
