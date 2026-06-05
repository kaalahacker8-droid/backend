# Sakleshpur Cabs - Complete API Documentation

## Base URL
`http://localhost:5000/api`

---

## AUTH ENDPOINTS

### 1. User OTP Request
- **Method**: `POST`
- **URL**: `/auth/sendotp`
- **Auth**: None
- **Body**:
  ```json
  {
    "mobile": "9876543210"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "OTP sent to your mobile",
    "mobile": "9876543210"
  }
  ```
- **Error Response** (400):
  ```json
  {
    "success": false,
    "message": "Mobile number is required"
  }
  ```

### 2. User OTP Verify & Register
- **Method**: `POST`
- **URL**: `/auth/verify`
- **Auth**: None
- **Body**:
  ```json
  {
    "mobile": "9876543210",
    "otp": "123456",
    "name": "John Doe"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "mobile": "9876543210",
      "role": "user"
    }
  }
  ```

### 3. Driver OTP Request
- **Method**: `POST`
- **URL**: `/auth/driver/sendotp`
- **Auth**: None
- **Body**:
  ```json
  {
    "mobile": "9876543211"
  }
  ```
- **Success Response** (200): Same format as User OTP Request

### 4. Driver OTP Verify
- **Method**: `POST`
- **URL**: `/auth/driver/verify`
- **Auth**: None
- **Body**:
  ```json
  {
    "mobile": "9876543211",
    "otp": "123456",
    "name": "Driver Name"
  }
  ```
- **Success Response** (200): JWT token for driver

---

## DRIVER ENDPOINTS (Protected - Bearer Driver Token)

### 1. Get Driver Profile
- **Method**: `GET`
- **URL**: `/driver/profile`
- **Auth**: Bearer driver token
- **Success Response** (200):
  ```json
  {
    "success": true,
    "driver": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Driver Name",
      "mobile": "9876543211",
      "vehicleNumber": "KA-01-AB-1234",
      "isOnline": true,
      "rating": 4.8,
      "totalRides": 150
    }
  }
  ```

### 2. Submit KYC
- **Method**: `POST`
- **URL**: `/driver/submit-kyc`
- **Auth**: Bearer driver token
- **Body**: Multipart form data:
  - `aadhaarNumber`: string
  - `drivingLicenseNumber`: string
  - `rcBookNumber`: string
  - `vehicleNumber`: string
  - `vehicleModel`: string
  - `vehicleColor`: string
  - `vehicleYear`: string
  - Files: `aadhaarPhoto`, `drivingLicensePhoto`, `rcBookPhoto`, `profilePhoto`
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "KYC submitted successfully. Awaiting admin approval."
  }
  ```

### 3. Go Online
- **Method**: `POST`
- **URL**: `/driver/go-online`
- **Auth**: Bearer driver token
- **Body**:
  ```json
  {
    "lat": 13.3667,
    "lng": 75.7417
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "You are now online"
  }
  ```

### 4. Go Offline
- **Method**: `POST`
- **URL**: `/driver/go-offline`
- **Auth**: Bearer driver token
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "You are now offline"
  }
  ```

### 5. Update Location
- **Method**: `POST`
- **URL**: `/driver/location`
- **Auth**: Bearer driver token
- **Body**:
  ```json
  {
    "lat": 13.3667,
    "lng": 75.7417,
    "bearing": 45
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Location updated"
  }
  ```

### 6. Get Ride Details
- **Method**: `GET`
- **URL**: `/driver/ride/:bookingId`
- **Auth**: Bearer driver token
- **Success Response** (200):
  ```json
  {
    "success": true,
    "ride": {
      "_id": "507f1f77bcf86cd799439011",
      "userId": { "name": "User Name", "mobile": "9876543210" },
      "pickupPlace": { "name": "Main Street" },
      "dropPlace": { "name": "Bus Stand" },
      "fare": 150,
      "status": "accepted"
    }
  }
  ```

### 7. Accept Ride
- **Method**: `POST`
- **URL**: `/driver/accept-ride/:bookingId`
- **Auth**: Bearer driver token
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Ride accepted"
  }
  ```

### 8. Decline Ride
- **Method**: `POST`
- **URL**: `/driver/decline-ride/:bookingId`
- **Auth**: Bearer driver token
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Ride declined"
  }
  ```

### 9. Start Ride
- **Method**: `POST`
- **URL**: `/driver/start-ride/:bookingId`
- **Auth**: Bearer driver token
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Ride started"
  }
  ```

### 10. End Ride
- **Method**: `POST`
- **URL**: `/driver/end-ride/:bookingId`
- **Auth**: Bearer driver token
- **Body**:
  ```json
  {
    "lat": 13.3667,
    "lng": 75.7417
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Ride completed"
  }
  ```

### 11. Rate User
- **Method**: `POST`
- **URL**: `/driver/rate-user/:bookingId`
- **Auth**: Bearer driver token
- **Body**:
  ```json
  {
    "rating": 5,
    "comment": "Polite and respectful passenger"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Rating submitted"
  }
  ```

### 12. Get Earnings
- **Method**: `GET`
- **URL**: `/driver/earnings`
- **Auth**: Bearer driver token
- **Query Params**: `period` (today/week/month)
- **Success Response** (200):
  ```json
  {
    "success": true,
    "earnings": {
      "totalRides": 12,
      "totalEarnings": 1800,
      "platformFee": 180,
      "netEarnings": 1620
    }
  }
  ```

---

## BOOKING ENDPOINTS (Protected - Bearer User Token)

### 1. Book a Ride
- **Method**: `POST`
- **URL**: `/booking/create`
- **Auth**: Bearer user token
- **Body**:
  ```json
  {
    "pickupPlaceId": "507f1f77bcf86cd799439011",
    "dropPlaceId": "507f1f77bcf86cd799439012",
    "pickupLat": 13.3667,
    "pickupLng": 75.7417,
    "dropLat": 13.2667,
    "dropLng": 75.6417
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Ride booking created. Finding nearby drivers...",
    "booking": {
      "_id": "507f1f77bcf86cd799439013",
      "status": "searching",
      "fare": 150,
      "platformFee": 15,
      "totalFare": 165
    }
  }
  ```

### 2. Cancel Booking
- **Method**: `POST`
- **URL**: `/booking/:bookingId/cancel`
- **Auth**: Bearer user token
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Booking cancelled"
  }
  ```

### 3. Get Booking Details
- **Method**: `GET`
- **URL**: `/booking/:bookingId`
- **Auth**: Bearer user token
- **Success Response** (200):
  ```json
  {
    "success": true,
    "booking": {
      "_id": "507f1f77bcf86cd799439013",
      "userId": { "name": "User Name" },
      "driverId": { "name": "Driver Name", "vehicleNumber": "KA-01-AB-1234" },
      "pickupPlace": { "name": "Main Street" },
      "dropPlace": { "name": "Bus Stand" },
      "fare": 150,
      "status": "completed",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  }
  ```

### 4. Get My Bookings
- **Method**: `GET`
- **URL**: `/booking/my-bookings`
- **Auth**: Bearer user token
- **Query Params**: `status` (all/completed/cancelled), `page`, `limit`
- **Success Response** (200):
  ```json
  {
    "success": true,
    "bookings": [...],
    "total": 25,
    "page": 1,
    "pages": 2
  }
  ```

### 5. Rate Driver
- **Method**: `POST`
- **URL**: `/booking/:bookingId/rate-driver`
- **Auth**: Bearer user token
- **Body**:
  ```json
  {
    "rating": 5,
    "comment": "Great driver, smooth ride"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Rating submitted"
  }
  ```

---

## PLACES ENDPOINTS

### 1. Get All Places
- **Method**: `GET`
- **URL**: `/places`
- **Auth**: None
- **Success Response** (200):
  ```json
  {
    "success": true,
    "places": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Bus Stand",
        "lat": 13.3667,
        "lng": 75.7417,
        "fareFromTown": 50
      },
      ...
    ]
  }
  ```

### 2. Get Place by ID
- **Method**: `GET`
- **URL**: `/places/:id`
- **Auth**: None
- **Success Response** (200):
  ```json
  {
    "success": true,
    "place": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Bus Stand",
      "lat": 13.3667,
      "lng": 75.7417,
      "fareFromTown": 50
    }
  }
  ```

---

## ADMIN ENDPOINTS (Protected - Bearer Admin Token)

### 1. Admin Login
- **Method**: `POST`
- **URL**: `/admin/login`
- **Auth**: None
- **Body**:
  ```json
  {
    "email": "admin@sakleshpur.com",
    "password": "admin123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Admin login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "email": "admin@sakleshpur.com",
      "role": "admin"
    }
  }
  ```
- **Error Response** (401):
  ```json
  {
    "success": false,
    "message": "Invalid admin credentials"
  }
  ```

### 2. Get Dashboard Stats
- **Method**: `GET`
- **URL**: `/admin/stats`
- **Auth**: Bearer admin token
- **Success Response** (200):
  ```json
  {
    "success": true,
    "stats": {
      "today": {
        "totalRides": 45,
        "completedRides": 42,
        "cancelledRides": 3,
        "revenue": 4500
      },
      "allTime": {
        "totalRides": 2345,
        "totalRevenue": 234500
      },
      "drivers": {
        "total": 120,
        "pending": 5,
        "approved": 110,
        "online": 45
      },
      "users": {
        "total": 890
      },
      "activeRides": 8
    }
  }
  ```

### 3. Get Live Data
- **Method**: `GET`
- **URL**: `/admin/live`
- **Auth**: Bearer admin token
- **Success Response** (200):
  ```json
  {
    "success": true,
    "onlineDrivers": [...],
    "activeBookings": [...],
    "counts": {
      "onlineDrivers": 45,
      "activeBookings": 8
    }
  }
  ```

### 4. Get All Drivers
- **Method**: `GET`
- **URL**: `/admin/drivers`
- **Auth**: Bearer admin token
- **Query Params**: `status` (pending/approved/rejected/all), `page` (default 1), `limit` (default 20), `search`
- **Success Response** (200):
  ```json
  {
    "success": true,
    "drivers": [...],
    "total": 120,
    "page": 1,
    "pages": 6
  }
  ```

### 5. Get Driver by ID
- **Method**: `GET`
- **URL**: `/admin/drivers/:id`
- **Auth**: Bearer admin token
- **Success Response** (200):
  ```json
  {
    "success": true,
    "driver": {...},
    "completedRides": 150
  }
  ```

### 6. Approve Driver
- **Method**: `PUT`
- **URL**: `/admin/drivers/:id/approve`
- **Auth**: Bearer admin token
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Driver approved successfully. They can now go online.",
    "driver": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Driver Name",
      "mobile": "9876543211",
      "isApproved": true,
      "approvedAt": "2025-01-15T10:30:00Z"
    }
  }
  ```

### 7. Reject Driver
- **Method**: `PUT`
- **URL**: `/admin/drivers/:id/reject`
- **Auth**: Bearer admin token
- **Body**:
  ```json
  {
    "reason": "Documents are not clear. Please resubmit."
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Driver rejected.",
    "driver": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Driver Name",
      "mobile": "9876543211",
      "isRejected": true,
      "rejectionReason": "Documents are not clear. Please resubmit."
    }
  }
  ```

### 8. Block/Unblock Driver
- **Method**: `PUT`
- **URL**: `/admin/drivers/:id/block`
- **Auth**: Bearer admin token
- **Body**:
  ```json
  {
    "block": true
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Driver blocked"
  }
  ```

### 9. Get All Bookings
- **Method**: `GET`
- **URL**: `/admin/bookings`
- **Auth**: Bearer admin token
- **Query Params**: `status`, `startDate`, `endDate`, `page` (default 1), `limit` (default 20), `driverId`, `userId`
- **Success Response** (200):
  ```json
  {
    "success": true,
    "bookings": [...],
    "total": 2345,
    "page": 1,
    "pages": 118
  }
  ```

### 10. Get Booking by ID
- **Method**: `GET`
- **URL**: `/admin/bookings/:id`
- **Auth**: Bearer admin token
- **Success Response** (200):
  ```json
  {
    "success": true,
    "booking": {...}
  }
  ```

### 11. Get All Users
- **Method**: `GET`
- **URL**: `/admin/users`
- **Auth**: Bearer admin token
- **Query Params**: `page` (default 1), `limit` (default 20), `search`
- **Success Response** (200):
  ```json
  {
    "success": true,
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "User Name",
        "mobile": "9876543210",
        "rideCount": 15,
        "createdAt": "2025-01-15T10:30:00Z"
      },
      ...
    ],
    "total": 890,
    "page": 1,
    "pages": 45
  }
  ```

### 12. Get Revenue Chart
- **Method**: `GET`
- **URL**: `/admin/revenue`
- **Auth**: Bearer admin token
- **Query Params**: `days` (default 30)
- **Success Response** (200):
  ```json
  {
    "success": true,
    "data": [
      {
        "date": "2025-01-15",
        "totalRevenue": 4500,
        "platformRevenue": 450,
        "rides": 45
      },
      ...
    ],
    "period": "30 days"
  }
  ```

### 13. Update Place Fare
- **Method**: `PUT`
- **URL**: `/admin/places/:id/fare`
- **Auth**: Bearer admin token
- **Body**:
  ```json
  {
    "fareFromTown": 75
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Fare updated to ₹75",
    "place": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Bus Stand",
      "fareFromTown": 75
    }
  }
  ```

### 14. Get Analytics
- **Method**: `GET`
- **URL**: `/admin/analytics`
- **Auth**: Bearer admin token
- **Success Response** (200):
  ```json
  {
    "success": true,
    "topRoutes": [...],
    "busiestHours": [...],
    "popularDestinations": [...]
  }
  ```

---

## HEALTH CHECK

### Health Check
- **Method**: `GET`
- **URL**: `/health`
- **Auth**: None
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Sakleshpur Cabs API running",
    "timestamp": "2025-01-15T10:30:00Z"
  }
  ```

---

## Error Responses

All endpoints follow this error response format:

| Status Code | Scenario | Response |
|---|---|---|
| 400 | Bad Request | `{ "success": false, "message": "..." }` |
| 401 | Unauthorized / Invalid Token | `{ "success": false, "message": "Invalid or expired token" }` |
| 403 | Forbidden / Insufficient Permissions | `{ "success": false, "message": "Access denied" }` |
| 404 | Not Found | `{ "success": false, "message": "Resource not found" }` |
| 500 | Server Error | `{ "success": false, "message": "Server error" }` |

---

## Authentication

### User/Driver Token
- Obtained from: `/auth/verify` or `/auth/driver/verify`
- Format: `Authorization: Bearer [token]`
- Expires: 7 days

### Admin Token
- Obtained from: `/admin/login`
- Format: `Authorization: Bearer [token]`
- Expires: 1 day

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Currency is in Indian Rupees (₹)
- Coordinates use decimal degrees (lat, lng)
- Pagination: page starts from 1, default limit is 20
- Search is case-insensitive for name and mobile fields
