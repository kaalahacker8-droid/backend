const Booking = require('../models/Booking');

/**
 * Clean up pending bookings that are older than 5 minutes
 * These are bookings where payment was never completed
 */
async function cleanupPendingBookings() {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const result = await Booking.updateMany(
      {
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: { $lt: fiveMinutesAgo }
      },
      {
        $set: {
          status: 'cancelled',
          cancelReason: 'Payment timeout - booking auto-cancelled',
          cancelledBy: 'system'
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`[BookingCleanup] Auto-cancelled ${result.modifiedCount} pending bookings due to payment timeout`);
    }

    return result;
  } catch (error) {
    console.error('[BookingCleanup] Error cleaning up pending bookings:', error.message);
    return null;
  }
}

/**
 * Clean up searching bookings that have been searching for drivers > 10 minutes
 * This handles cases where driver search failed but status wasn't updated
 */
async function cleanupStaleSearchingBookings() {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const result = await Booking.updateMany(
      {
        status: 'searching',
        createdAt: { $lt: tenMinutesAgo }
      },
      {
        $set: {
          status: 'cancelled',
          cancelReason: 'No drivers available - auto-cancelled after timeout',
          cancelledBy: 'system'
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`[BookingCleanup] Auto-cancelled ${result.modifiedCount} stale searching bookings`);
    }

    return result;
  } catch (error) {
    console.error('[BookingCleanup] Error cleaning up stale bookings:', error.message);
    return null;
  }
}

/**
 * Initialize cleanup intervals
 * Run every 2 minutes
 */
function initializeBookingCleanup() {
  console.log('[BookingCleanup] Initializing booking cleanup scheduler');
  
  // Run immediately on startup
  cleanupPendingBookings();
  cleanupStaleSearchingBookings();
  
  // Then run every 2 minutes
  setInterval(() => {
    cleanupPendingBookings();
    cleanupStaleSearchingBookings();
  }, 2 * 60 * 1000);
}

module.exports = {
  cleanupPendingBookings,
  cleanupStaleSearchingBookings,
  initializeBookingCleanup
};
