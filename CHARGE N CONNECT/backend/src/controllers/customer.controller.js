// customer.controller.js
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import ChargingStation from '../models/ChargingStation.js';
import Booking from '../models/Booking.js';

// Dashboard/Home function for customers
export const getCustomerDashboard = async (req, res) => {
    try {
        // Get the authenticated user from request (set by protectRoute middleware)
        const user = req.user;
        
        // Verify that the user has customer role
        if (user.role !== "customer") {
            return res.status(403).json({ message: "Access denied. Only customers can access this dashboard." });
        }
        
        // Fetch any data needed for the customer dashboard
        const featuredProviders = await User.find({ 
            role: "provider" 
        })
        .select("firstName lastName")
        .limit(5);
        
        // Construct response data
        const dashboardData = {
            user: {
                name: `${user.firstName} ${user.lastName}`,
            },
            welcomeMessage: `Welcome back, ${user.firstName}!`,
            featuredProviders,
            // Add more dashboard data as needed
        };
        
        res.status(200).json(dashboardData);
    } catch (error) {
        console.error("Error in customer dashboard:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Profile function for customers
export const getCustomerProfile = async (req, res) => {
    try {
        // Get the authenticated user from request
        const user = req.user;
        
        // Verify user has customer role
        if (user.role !== "customer") {
            return res.status(403).json({ message: "Access denied. Only customers can access this profile." });
        }
        
        // Construct profile data
        const profileData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode,
            createdAt: user.createdAt
        };
        
        res.status(200).json(profileData);
    } catch (error) {
        console.error("Error in customer profile route:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update profile function for customers
export const updateCustomerProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, address, city, state, zipCode } = req.body;
        const userId = req.user._id;
        
        // Check if user has customer role
        if (req.user.role !== "customer") {
            return res.status(403).json({ message: "Access denied. Only customers can update this profile." });
        }
        
        // Fields that can be updated
        const updateFields = {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(phone && { phone }),
            ...(address && { address }),
            ...(city && { city }),
            ...(state && { state }),
            ...(zipCode && { zipCode })
        };
        
        // Update the user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select("-password");
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in update profile route:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Profile Controllers
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, state, zipCode } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName,
        lastName,
        phone,
        address,
        city,
        state,
        zipCode
      },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Vehicle Controllers
export const registerVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle({
      ...req.body,
      owner: req.user.id
    });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'License plate already registered' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id });
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Charging Station Controllers
export const getChargingStations = async (req, res) => {
  try {
    const { lat, lng, radius = 10000 } = req.query; // radius in meters, default 10km
    
    let query = { available: true };
    
    // If coordinates are provided, find stations within radius
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius
        }
      };
    }
    
    const stations = await ChargingStation.find(query)
      .populate('provider', 'firstName lastName rating')
      .select('-reviews');
      
    res.json(stations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getChargingStationDetails = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id)
      .populate('provider', 'firstName lastName rating')
      .populate('reviews.user', 'firstName lastName');
      
    if (!station) {
      return res.status(404).json({ message: 'Charging station not found' });
    }
    
    res.json(station);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Booking Controllers
export const createBooking = async (req, res) => {
  try {
    const { stationId, vehicleId, date, startTime, duration } = req.body;
    
    // Check if station exists and is available
    const station = await ChargingStation.findById(stationId);
    if (!station || !station.available) {
      return res.status(400).json({ message: 'Charging station is not available' });
    }
    
    // Check if vehicle exists and belongs to user
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      owner: req.user.id
    });
    if (!vehicle) {
      return res.status(400).json({ message: 'Vehicle not found' });
    }
    
    // Calculate total price
    const totalPrice = station.pricePerHour * duration;
    
    // Create booking
    const booking = new Booking({
      customer: req.user.id,
      station: stationId,
      vehicle: vehicleId,
      date,
      startTime,
      duration,
      totalPrice
    });
    
    await booking.save();
    
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('station', 'name address')
      .populate('vehicle', 'model licensePlate')
      .sort({ date: -1 });
      
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customer: req.user.id
    })
      .populate('station')
      .populate('vehicle');
      
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customer: req.user.id,
      status: 'pending'
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or cannot be cancelled' });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};