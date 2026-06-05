const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'user') {
      const user = await User.findById(decoded.id).select('-otp -otpExpiry');
      if (!user) return res.status(401).json({ success: false, message: 'User not found.' });
      req.user = user;
    } else if (decoded.role === 'driver') {
      const driver = await Driver.findById(decoded.id).select('-otp -otpExpiry');
      if (!driver) return res.status(401).json({ success: false, message: 'Driver not found.' });
      req.user = driver;
    } else if (decoded.role === 'admin') {
      req.user = { _id: decoded.id, role: 'admin' };
    }

    req.role = decoded.role;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ success: false, message: 'Token invalid or expired. Please login again.' });
  }
};

const protectDriver = async (req, res, next) => {
  await protect(req, res, () => {
    if (req.role !== 'driver') {
      return res.status(403).json({ success: false, message: 'Access denied. Drivers only.' });
    }
    next();
  });
};

const protectUser = async (req, res, next) => {
  await protect(req, res, () => {
    if (req.role !== 'user') {
      return res.status(403).json({ success: false, message: 'Access denied. Users only.' });
    }
    next();
  });
};

module.exports = { protect, protectDriver, protectUser};