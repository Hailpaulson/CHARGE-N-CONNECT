import ChargingStation from '../models/ChargingStation.js';
import User from '../models/User.js';

// Get all stations for the logged-in provider
export const getStations = async (req, res) => {
  try {
    const stations = await ChargingStation.find({ provider: req.user.id });
    res.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update station details
export const updateStationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const station = await ChargingStation.findOneAndUpdate(
      { _id: id, provider: req.user.id },
      updates,
      { new: true }
    );
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.json(station);
  } catch (error) {
    console.error('Error updating station details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update station status
export const updateStationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;
    const station = await ChargingStation.findOneAndUpdate(
      { _id: id, provider: req.user.id },
      { available },
      { new: true }
    );
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.json(station);
  } catch (error) {
    console.error('Error updating station status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch provider details
export const getProviderDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the complete user document
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Verify user has provider role
    if (user.role !== "provider") {
      return res.status(403).json({
        message: "Access denied. Only providers can access this profile."
      });
    }

    // Get the provider's stations count
    const stationsCount = await ChargingStation.countDocuments({ provider: userId });

    // Construct profile data with additional information
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
      role: user.role,
      stationsCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.error('Error fetching provider details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new station
export const createStation = async (req, res) => {
  try {
    const providerId = req.user.id;
    const stationData = {
      ...req.body,
      provider: providerId
    };

    const station = new ChargingStation(stationData);
    await station.save();

    // Update the user's stations array
    await User.findByIdAndUpdate(
      providerId,
      { $push: { stations: station._id } },
      { new: true }
    );

    res.status(201).json(station);
  } catch (error) {
    console.error('Error creating station:', error);
    res.status(500).json({ message: 'Failed to create station', error: error.message });
  }
}; 