// Run with: node test-socket.js
// Tests socket connection and all events

const { io } = require('socket.io-client');

const SERVER_URL = 'http://localhost:5000';

// Simulate a driver
const driverSocket = io(SERVER_URL);
driverSocket.on('connect', () => {
  console.log('[Driver] Connected:', driverSocket.id);
  
  // Register as driver
  driverSocket.emit('register', { userId: 'TEST_DRIVER_ID', role: 'driver' });
  
  // Start sending location
  setInterval(() => {
    driverSocket.emit('driver:updateLocation', {
      driverId: 'TEST_DRIVER_ID',
      lat: 12.9174 + (Math.random() * 0.001),
      lng: 75.7849 + (Math.random() * 0.001),
      bearing: Math.floor(Math.random() * 360)
    });
    console.log('[Driver] Sent location update');
  }, 3000);
});

driverSocket.on('driver:sendNewRideRequest', (data) => {
  console.log('[Driver] New ride request received:', data);
  // Auto-accept after 2 seconds
  setTimeout(() => {
    driverSocket.emit('driver:acceptRide', {
      bookingId: data.bookingId,
      driverId: 'TEST_DRIVER_ID'
    });
    console.log('[Driver] Accepted ride:', data.bookingId);
  }, 2000);
});

// Simulate a user
const userSocket = io(SERVER_URL);
userSocket.on('connect', () => {
  console.log('[User] Connected:', userSocket.id);
  userSocket.emit('register', { userId: 'TEST_USER_ID', role: 'user' });
});

userSocket.on('user:driverLocation', (data) => {
  console.log('[User] Driver location update:', data);
});

userSocket.on('booking:accepted', (data) => {
  console.log('[User] Booking accepted by driver:', data);
});

userSocket.on('booking:completed', (data) => {
  console.log('[User] Ride completed:', data);
});

driverSocket.on('connect_error', (err) => console.error('[Driver] Connection error:', err.message));
userSocket.on('connect_error', (err) => console.error('[User] Connection error:', err.message));
