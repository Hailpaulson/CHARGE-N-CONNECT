import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import {
  createBooking,
  getCustomerBookings,
  getProviderBookings,
  updateBookingStatus,
  getBookingById
} from '../controllers/booking.controller.js';

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log('Booking Route:', req.method, req.url);
  next();
});

// Create a new booking
router.post('/', protectRoute, createBooking);

// Get customer's bookings
router.get('/customer', protectRoute, getCustomerBookings);

// Get provider's bookings
router.get('/provider', protectRoute, getProviderBookings);

// Get booking by ID
router.get('/:id', protectRoute, getBookingById);

// Update booking status
router.patch('/:id/status', protectRoute, updateBookingStatus);

export default router; 