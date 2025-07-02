import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import {
  getStations,
  updateStationDetails,
  updateStationStatus,
  getProviderDetails,
  createStation
} from '../controllers/provider.controller.js';

const router = express.Router();

// Get all stations for the logged-in provider
router.get('/stations', protectRoute, getStations);

// Create new station
router.post('/stations', protectRoute, createStation);

// Update station details
router.put('/stations/:id', protectRoute, updateStationDetails);

// Update station status
router.patch('/stations/:id/status', protectRoute, updateStationStatus);

// Fetch provider details
router.get('/details', protectRoute, getProviderDetails);

export default router; 