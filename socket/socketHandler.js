const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const User = require('../models/User');

// In-memory maps for fast socket lookups (no DB query needed)
// Key: userId or driverId string, Value: socket.id
const userSockets = new Map();
const driverSockets = new Map();

// Key: socket.id, Value: { id, role }
const socketIdentities = new Map();

const initSocket = (io) => {

  io.on('connection', (socket) => {
    console.log(`[Socket] New connection: ${socket.id}`);

    // IDENTITY REGISTRATION
    socket.on('register', ({ userId, role }) => {
      try {
        if (!userId || !role) return;
        socketIdentities.set(socket.id, { id: userId, role });
        if (role === 'driver') {
          driverSockets.set(userId, socket.id);
          console.log(`[Socket] Driver registered: ${userId}`);
        } else if (role === 'user') {
          userSockets.set(userId, socket.id);
          console.log(`[Socket] User registered: ${userId}`);
        }
      } catch (err) {
        console.error('[Socket] register error:', err.message);
      }
    });

    // JOIN BOOKING ROOM
    socket.on('user:joinBookingRoom', ({ bookingId }) => {
      try {
        if (!bookingId) return;
        socket.join(`booking_${bookingId}`);
        console.log(`[Socket] User joined booking room: booking_${bookingId}`);
      } catch (err) {
        console.error('[Socket] user:joinBookingRoom error:', err.message);
      }
    });

    socket.on('driver:joinBookingRoom', ({ bookingId }) => {
      try {
        if (!bookingId) return;
        socket.join(`booking_${bookingId}`);
        console.log(`[Socket] Driver joined booking room: booking_${bookingId}`);
      } catch (err) {
        console.error('[Socket] driver:joinBookingRoom error:', err.message);
      }
    });

    // DRIVER LOCATION UPDATE
    socket.on('driver:updateLocation', async ({ driverId, lat, lng, bearing }) => {
      try {
        if (!driverId || lat === undefined || lng === undefined) return;

        await Driver.findByIdAndUpdate(driverId, {
          currentLocation: {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            bearing: parseFloat(bearing) || 0,
            updatedAt: new Date()
          }
        });

        const activeBooking = await Booking.findOne({
          driverId,
          status: { $in: ['accepted', 'started'] }
        }).select('_id userId');

        if (activeBooking) {
          io.to(`booking_${activeBooking._id}`).emit('user:driverLocation', {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            bearing: parseFloat(bearing) || 0,
            timestamp: Date.now()
          });
        }
      } catch (err) {
        console.error('[Socket] driver:updateLocation error:', err.message);
      }
    });

    // DRIVER ACCEPTS RIDE
    socket.on('driver:acceptRide', async ({ bookingId, driverId }) => {
      try {
        if (!bookingId || !driverId) return;

        const booking = await Booking.findById(bookingId)
          .populate('pickupPlace', 'name lat lng')
          .populate('dropPlace', 'name lat lng')
          .populate('userId', 'name mobile');

        if (!booking) {
          socket.emit('error', { message: 'Booking not found' });
          return;
        }

        if (booking.status !== 'searching') {
          socket.emit('error', { message: 'Booking no longer available' });
          return;
        }

        await Booking.findByIdAndUpdate(bookingId, {
          driverId,
          status: 'accepted',
          driverAssignedAt: new Date()
        });

        const driver = await Driver.findById(driverId)
          .select('name mobile vehicleNumber vehicleModel vehicleColor rating currentLocation');

        socket.join(`booking_${bookingId}`);

        io.to(`booking_${bookingId}`).emit('booking:accepted', {
          bookingId,
          driver: {
            _id: driver._id,
            name: driver.name,
            mobile: driver.mobile,
            vehicleNumber: driver.vehicleNumber,
            vehicleModel: driver.vehicleModel,
            vehicleColor: driver.vehicleColor,
            rating: driver.rating,
            currentLocation: driver.currentLocation
          },
          message: 'Driver is on the way!'
        });

        const userSocketId = userSockets.get(booking.userId._id.toString());
        if (userSocketId) {
          io.to(userSocketId).emit('booking:accepted', {
            bookingId,
            driver: {
              _id: driver._id,
              name: driver.name,
              mobile: driver.mobile,
              vehicleNumber: driver.vehicleNumber,
              vehicleModel: driver.vehicleModel,
              vehicleColor: driver.vehicleColor,
              rating: driver.rating
            }
          });
        }

        console.log(`[Socket] Driver ${driverId} accepted booking ${bookingId}`);
      } catch (err) {
        console.error('[Socket] driver:acceptRide error:', err.message);
        socket.emit('error', { message: 'Failed to accept ride' });
      }
    });

    // DRIVER DECLINES RIDE
    socket.on('driver:declineRide', async ({ bookingId, driverId }) => {
      try {
        if (!bookingId || !driverId) return;
        console.log(`[Socket] Driver ${driverId} declined booking ${bookingId}`);

        const booking = await Booking.findById(bookingId)
          .populate('pickupPlace', 'lat lng name');

        if (!booking || booking.status !== 'searching') return;

        const allOnlineDrivers = await Driver.find({
          isOnline: true,
          isApproved: true,
          _id: { $ne: driverId },
          'currentLocation.lat': { $exists: true }
        }).select('_id currentLocation name mobile vehicleNumber');

        const haversineDistance = (lat1, lng1, lat2, lng2) => {
          const R = 6371;
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLng = (lng2 - lng1) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
                    Math.sin(dLng/2) * Math.sin(dLng/2);
          return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        };

        const nearbyDrivers = allOnlineDrivers
          .filter(d => d.currentLocation && d.currentLocation.lat && d.currentLocation.lng)
          .map(d => ({
            ...d.toObject(),
            distance: haversineDistance(
              booking.pickupPlace.lat,
              booking.pickupPlace.lng,
              d.currentLocation.lat,
              d.currentLocation.lng
            )
          }))
          .filter(d => d.distance <= 10)
          .sort((a, b) => a.distance - b.distance);

        if (nearbyDrivers.length === 0) {
          await Booking.findByIdAndUpdate(bookingId, {
            status: 'cancelled',
            cancelReason: 'No drivers available nearby',
            cancelledBy: 'admin'
          });

          io.to(`booking_${bookingId}`).emit('booking:noDrivers', {
            bookingId,
            message: 'Sorry, no drivers are available nearby right now. Please try again.'
          });

          const userSocketId = userSockets.get(booking.userId.toString());
          if (userSocketId) {
            io.to(userSocketId).emit('booking:noDrivers', {
              message: 'No drivers available. Please try again in a few minutes.'
            });
          }
          return;
        }

        const nextDriver = nearbyDrivers[0];
        const nextDriverSocketId = driverSockets.get(nextDriver._id.toString());

        if (nextDriverSocketId) {
          io.to(nextDriverSocketId).emit('driver:sendNewRideRequest', {
            bookingId: booking._id,
            pickup: {
              name: booking.pickupPlace.name,
              lat: booking.pickupPlace.lat,
              lng: booking.pickupPlace.lng
            },
            drop: { name: booking.dropPlace },
            fare: booking.fare,
            distance: Math.round(nextDriver.distance * 10) / 10,
            timeoutSeconds: 15
          });
        }

      } catch (err) {
        console.error('[Socket] driver:declineRide error:', err.message);
      }
    });

    // DRIVER STARTS RIDE
    socket.on('driver:startRide', async ({ bookingId, driverId, rideOtp }) => {
      try {
        if (!bookingId || !driverId || !rideOtp) {
          socket.emit('error', { message: 'bookingId, driverId, and rideOtp are required' });
          return;
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
          socket.emit('error', { message: 'Booking not found' });
          return;
        }

        if (booking.status !== 'accepted') {
          socket.emit('error', { message: 'Ride cannot be started. Invalid status: ' + booking.status });
          return;
        }

        if (booking.rideOtp !== rideOtp.toString()) {
          socket.emit('ride:otpInvalid', { message: 'Invalid OTP. Ask passenger for the correct OTP.' });
          return;
        }

        await Booking.findByIdAndUpdate(bookingId, {
          status: 'started',
          startTime: new Date()
        });

        io.to(`booking_${bookingId}`).emit('ride:started', {
          bookingId,
          startTime: new Date(),
          message: 'Ride has started. Enjoy your journey!'
        });

        console.log(`[Socket] Ride started: booking ${bookingId} by driver ${driverId}`);
      } catch (err) {
        console.error('[Socket] driver:startRide error:', err.message);
        socket.emit('error', { message: 'Failed to start ride' });
      }
    });

    // DRIVER COMPLETES RIDE
    socket.on('driver:completeRide', async ({ bookingId, driverId }) => {
      try {
        if (!bookingId || !driverId) return;

        const booking = await Booking.findById(bookingId)
          .populate('pickupPlace', 'name')
          .populate('dropPlace', 'name');

        if (!booking) {
          socket.emit('error', { message: 'Booking not found' });
          return;
        }

        if (booking.status !== 'started') {
          socket.emit('error', { message: 'Cannot complete ride. Status is: ' + booking.status });
          return;
        }

        const endTime = new Date();
        const driverEarning = booking.driverEarning || Math.round(booking.fare * 0.9);

        await Booking.findByIdAndUpdate(bookingId, {
          status: 'completed',
          endTime,
          paymentStatus: booking.paymentMethod === 'cash' ? 'pending' : booking.paymentStatus
        });

        await Driver.findByIdAndUpdate(driverId, {
          $inc: {
            totalRides: 1,
            totalEarnings: driverEarning
          },
          isOnline: true
        });

        io.to(`booking_${bookingId}`).emit('booking:completed', {
          bookingId,
          endTime,
          fare: booking.fare,
          driverEarning,
          paymentMethod: booking.paymentMethod,
          paymentStatus: booking.paymentStatus,
          pickup: booking.pickupPlace.name,
          drop: booking.dropPlace.name,
          message: 'You have reached your destination!'
        });

        console.log(`[Socket] Ride completed: booking ${bookingId}, driver earned ₹${driverEarning}`);
      } catch (err) {
        console.error('[Socket] driver:completeRide error:', err.message);
        socket.emit('error', { message: 'Failed to complete ride' });
      }
    });

    // USER CANCELS RIDE
    socket.on('user:cancelRide', async ({ bookingId, userId, reason }) => {
      try {
        if (!bookingId || !userId) return;

        const booking = await Booking.findById(bookingId);
        if (!booking) return;
        if (['completed', 'cancelled'].includes(booking.status)) return;

        await Booking.findByIdAndUpdate(bookingId, {
          status: 'cancelled',
          cancelReason: reason || 'Cancelled by user',
          cancelledBy: 'user'
        });

        if (booking.driverId) {
          const driverSocketId = driverSockets.get(booking.driverId.toString());
          if (driverSocketId) {
            io.to(driverSocketId).emit('booking:cancelledByUser', {
              bookingId,
              message: 'User has cancelled the ride.'
            });
          }
        }

        io.to(`booking_${bookingId}`).emit('booking:cancelled', {
          bookingId,
          message: 'Booking cancelled'
        });

        console.log(`[Socket] Ride cancelled by user: booking ${bookingId}`);
      } catch (err) {
        console.error('[Socket] user:cancelRide error:', err.message);
      }
    });

    // DISCONNECT
    socket.on('disconnect', async () => {
      try {
        const identity = socketIdentities.get(socket.id);
        if (identity) {
          if (identity.role === 'driver') {
            driverSockets.delete(identity.id);
            try {
              await Driver.findByIdAndUpdate(identity.id, { isOnline: false });
              console.log(`[Socket] Driver went offline on disconnect: ${identity.id}`);
            } catch (err) {
              console.error('[Socket] Failed to set driver offline:', err.message);
            }
          } else if (identity.role === 'user') {
            userSockets.delete(identity.id);
          }
          socketIdentities.delete(socket.id);
        }
        console.log(`[Socket] Disconnected: ${socket.id}`);
      } catch (err) {
        console.error('[Socket] disconnect handling error:', err.message);
      }
    });

  });

  // Export maps so bookingController can use them to dispatch rides
  return { userSockets, driverSockets };
};

module.exports = { initSocket };

