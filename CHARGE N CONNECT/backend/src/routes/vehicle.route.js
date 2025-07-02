import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { addVehicle, getUserVehicles } from '../controllers/vehicle.controller.js';

const router = express.Router();

router.post('/', protectRoute, addVehicle);
router.get('/my-vehicles', protectRoute, getUserVehicles);

export default router; 