// customer.route.js
import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { 
    getCustomerDashboard, 
    getCustomerProfile, 
    updateCustomerProfile,
    registerVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle,
    getChargingStations,
    getChargingStationDetails,
    createBooking,
    getBookings,
    getBookingDetails,
    cancelBooking
} from '../controllers/customer.controller.js';

import Vehicle from '../models/Vehicle.js';
import ChargingStation from '../models/ChargingStation.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/charging-stations', getChargingStations);
router.get('/charging-stations/:id', getChargingStationDetails);

// Protected routes (authentication required)
router.get('/dashboard', protectRoute, getCustomerDashboard);
router.get('/profile', protectRoute, getCustomerProfile);
router.put('/profile', protectRoute, updateCustomerProfile);

// Vehicle routes
router.post('/vehicles', protectRoute, registerVehicle);
router.get('/vehicles', protectRoute, getVehicles);
router.put('/vehicles/:id', protectRoute, updateVehicle);
router.delete('/vehicles/:id', protectRoute, deleteVehicle);

// Booking routes
router.post('/bookings', protectRoute, createBooking);
router.get('/bookings', protectRoute, getBookings);
router.get('/bookings/:id', protectRoute, getBookingDetails);
router.put('/bookings/:id/cancel', protectRoute, cancelBooking);

router.get("/api/stations", async (req, res) => {
    const stations = await ChargingStation.find();
    res.json(stations);
  });

  router.get("/api/vehicles", async (req, res) => {
    const vehicles = await Vehicle.find({ customerId: req.user._id });
    res.json(vehicles);
  });
  
  

export default router;