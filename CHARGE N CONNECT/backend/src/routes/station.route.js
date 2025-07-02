import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import {
  getAllStations,
  getStationById,
  searchStations,
  updateStationStatus,
  getProviderStations
} from '../controllers/station.controller.js';

const router = express.Router();

// Debug middleware for station routes
router.use((req, res, next) => {
  console.log('Station Route:', req.method, req.url);
  next();
});

// Get all stations (no auth required for viewing)
router.get('/', getAllStations);

// Search stations with filters
router.get('/search', searchStations);

// Get provider's stations
router.get('/provider', protectRoute, getProviderStations);

// Get station by ID
router.get('/:id', getStationById);

// Protected routes
router.patch('/:id/status', protectRoute, updateStationStatus);

export default router; 