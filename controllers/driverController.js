const fs = require('node:fs');
const path = require('node:path');
const Driver = require('../models/Driver');

const getUploadDir = (driverId) => {
  const uploadDir = path.join(__dirname, '..', 'uploads', 'drivers', driverId.toString());
  fs.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
};

const saveUploadFile = async (file, uploadDir, fileName) => {
  const filePath = path.join(uploadDir, fileName);
  await file.mv(filePath);
  return filePath.replaceAll('\\', '/');
};

const submitKYC = async (req, res) => {
  try {
    const driverId = req.user._id;
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    if (driver.kycSubmitted) {
      return res.status(400).json({ success: false, message: 'KYC already submitted. Please wait for admin approval.' });
    }

    const {
      name,
      aadhaarNumber,
      drivingLicenseNumber,
      rcBookNumber,
      vehicleNumber,
      vehicleModel,
      vehicleColor,
      vehicleYear,
    } = req.body;

    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!aadhaarNumber) missingFields.push('aadhaarNumber');
    if (!drivingLicenseNumber) missingFields.push('drivingLicenseNumber');
    if (!rcBookNumber) missingFields.push('rcBookNumber');
    if (!vehicleNumber) missingFields.push('vehicleNumber');
    if (!vehicleModel) missingFields.push('vehicleModel');

    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({ success: false, message: 'Aadhaar number must be exactly 12 digits' });
    }

    if (drivingLicenseNumber.length < 10 || drivingLicenseNumber.length > 20) {
      return res.status(400).json({ success: false, message: 'Driving license number must be between 10 and 20 characters' });
    }

    const files = req.files || {};
    const requiredFiles = ['aadhaarPhoto', 'drivingLicensePhoto', 'rcBookPhoto'];
    const missingFiles = requiredFiles.filter((field) => !files[field]);
    if (missingFiles.length) {
      return res.status(400).json({
        success: false,
        message: 'Please upload Aadhaar photo, Driving License photo, and RC Book photo',
      });
    }

    const uploadDir = getUploadDir(driverId);
    const updateData = {
      name: name.trim(),
      aadhaarNumber: aadhaarNumber.trim(),
      drivingLicenseNumber: drivingLicenseNumber.trim(),
      rcBookNumber: rcBookNumber.trim(),
      vehicleNumber: vehicleNumber.trim(),
      vehicleModel: vehicleModel.trim(),
      vehicleColor: vehicleColor ? vehicleColor.trim() : undefined,
      vehicleYear: vehicleYear ? vehicleYear.trim() : undefined,
      kycSubmitted: true,
      kycSubmittedAt: new Date(),
    };

    const processFile = async (fieldName) => {
      const file = files[fieldName];
      if (!file.mimetype.startsWith('image/')) {
        throw new Error(`${fieldName} must be an image file`);
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`${fieldName} must be smaller than 5MB`);
      }
      const ext = path.extname(file.name);
      const savedName = `${fieldName}-${Date.now()}${ext}`;
      const savedPath = await saveUploadFile(file, uploadDir, savedName);
      return savedPath;
    };

    try {
      updateData.aadhaarPhoto = await processFile('aadhaarPhoto');
      updateData.drivingLicensePhoto = await processFile('drivingLicensePhoto');
      updateData.rcBookPhoto = await processFile('rcBookPhoto');

      if (files.profilePhoto) {
        const profilePath = await processFile('profilePhoto');
        updateData.profilePhoto = profilePath;
      }
    } catch (uploadError) {
      return res.status(400).json({ success: false, message: uploadError.message });
    }

    const updatedDriver = await Driver.findByIdAndUpdate(driverId, updateData, { new: true });
    return res.status(200).json({
      success: true,
      message: 'KYC submitted successfully. Waiting for admin approval.',
      driver: {
        _id: updatedDriver._id,
        name: updatedDriver.name,
        mobile: updatedDriver.mobile,
        kycSubmitted: updatedDriver.kycSubmitted,
        isApproved: updatedDriver.isApproved,
      },
    });
  } catch (error) {
    console.error('submitKYC error:', error);
    return res.status(500).json({ success: false, message: 'Unable to submit KYC. Please try again later.' });
  }
};

const getDriverStatus = async (req, res) => {
  try {
    const driverId = req.user._id;
    const driver = await Driver.findById(driverId).select('-otp -otpExpiry');
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    return res.status(200).json({
      success: true,
      driver: {
        _id: driver._id,
        name: driver.name,
        mobile: driver.mobile,
        kycSubmitted: driver.kycSubmitted,
        isApproved: driver.isApproved,
        isRejected: driver.isRejected,
        rejectionReason: driver.rejectionReason,
        isOnline: driver.isOnline,
        rating: driver.rating,
        totalRides: driver.totalRides,
        vehicleNumber: driver.vehicleNumber,
        vehicleModel: driver.vehicleModel,
      },
    });
  } catch (error) {
    console.error('getDriverStatus error:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch driver status' });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const driverId = req.user._id;
    const { vehicleNumber, vehicleModel, vehicleColor, vehicleYear } = req.body;

    if (!vehicleNumber || !vehicleModel) {
      return res.status(400).json({ success: false, message: 'vehicleNumber and vehicleModel are required' });
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      driverId,
      {
        vehicleNumber: vehicleNumber.trim(),
        vehicleModel: vehicleModel.trim(),
        vehicleColor: vehicleColor ? vehicleColor.trim() : undefined,
        vehicleYear: vehicleYear ? vehicleYear.trim() : undefined,
      },
      { new: true }
    );

    return res.status(200).json({ success: true, message: 'Vehicle info updated', driver: updatedDriver });
  } catch (error) {
    console.error('updateVehicle error:', error);
    return res.status(500).json({ success: false, message: 'Unable to update vehicle information' });
  }
};

const updateBank = async (req, res) => {
  try {
    const driverId = req.user._id;
    const { accountNumber, ifsc, accountName } = req.body;

    if (!accountNumber || !ifsc || !accountName) {
      return res.status(400).json({ success: false, message: 'accountNumber, ifsc, and accountName are all required' });
    }

    const formattedIFSC = ifsc.toString().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formattedIFSC)) {
      return res.status(400).json({ success: false, message: 'IFSC must be 11 characters in the format AAAA0XXXXXX' });
    }

    await Driver.findByIdAndUpdate(driverId, {
      bankAccount: {
        accountNumber: accountNumber.toString().trim(),
        ifsc: formattedIFSC,
        accountName: accountName.toString().trim(),
        isVerified: false,
      },
    });

    return res.status(200).json({ success: true, message: 'Bank details saved' });
  } catch (error) {
    console.error('updateBank error:', error);
    return res.status(500).json({ success: false, message: 'Unable to update bank details' });
  }
};

const toggleOnline = async (req, res) => {
  try {
    const driverId = req.user._id;
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    if (!driver.isApproved) {
      return res.status(403).json({ success: false, message: 'Your account is not approved yet. Please wait for admin approval.' });
    }

    if (!driver.kycSubmitted) {
      return res.status(403).json({ success: false, message: 'Please complete KYC before going online.' });
    }

    const newStatus = !driver.isOnline;
    const updateData = { isOnline: newStatus };
    if (!newStatus) {
      updateData.currentLocation = null;
    }

    const updatedDriver = await Driver.findByIdAndUpdate(driverId, updateData, { new: true });
    return res.status(200).json({
      success: true,
      isOnline: updatedDriver.isOnline,
      message: updatedDriver.isOnline ? 'You are now online' : 'You are now offline',
    });
  } catch (error) {
    console.error('toggleOnline error:', error);
    return res.status(500).json({ success: false, message: 'Unable to toggle online status' });
  }
};

const updateLocation = async (req, res) => {
  try {
    const driverId = req.user._id;
    const { lat, lng, bearing } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: 'lat and lng are required' });
    }
    const numericLat = Number(lat);
    const numericLng = Number(lng);
    if (Number.isNaN(numericLat) || Number.isNaN(numericLng)) {
      return res.status(400).json({ success: false, message: 'lat and lng must be valid numbers' });
    }

    await Driver.findByIdAndUpdate(driverId, {
      currentLocation: {
        lat: numericLat,
        lng: numericLng,
        bearing: Number(bearing || 0),
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({ success: true, message: 'Location updated' });
  } catch (error) {
    console.error('updateLocation error:', error);
    return res.status(500).json({ success: false, message: 'Unable to update location' });
  }
};

const getOnlineDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ isOnline: true, isApproved: true }).select(
      '_id name vehicleNumber vehicleModel vehicleColor rating currentLocation'
    );
    return res.status(200).json({ success: true, count: drivers.length, drivers });
  } catch (error) {
    console.error('getOnlineDrivers error:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch online drivers' });
  }
};

const getDriverProfile = async (req, res) => {
  try {
    const driverId = req.user._id;
    const driver = await Driver.findById(driverId).select('-otp -otpExpiry -bankAccount.accountNumber');
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    return res.status(200).json({ success: true, driver });
  } catch (error) {
    console.error('getDriverProfile error:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch driver profile' });
  }
};

module.exports = {
  submitKYC,
  getDriverStatus,
  updateVehicle,
  updateBank,
  toggleOnline,
  updateLocation,
  getOnlineDrivers,
  getDriverProfile,
};
