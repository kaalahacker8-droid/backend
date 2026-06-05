const express = require('express');
const router = express.Router();
const {
  createBooking,
  confirmPayment,
  getBooking,
  cancelBooking,
  rideHistory,
  activeBooking
} = require('../controllers/bookingController');
const { protect, protectUser, protectDriver } = require('../middleware/authMiddleware');

router.post('/create', protectUser, createBooking);
router.post('/confirm-payment', protectUser, confirmPayment);
router.get('/history', protect, rideHistory);
router.get('/active', protect, activeBooking);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

// REST fallback for driver actions
router.put('/:id/start', protectDriver, require('../controllers/bookingController').startRide);
router.put('/:id/complete', protectDriver, require('../controllers/bookingController').completeRide);

module.exports = router;
