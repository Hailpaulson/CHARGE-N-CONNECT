import ChargingStation from '../models/ChargingStation.js';

// Get all stations
export const getAllStations = async (req, res) => {
  try {
    console.log('Fetching all stations');
    const query = {};

    // If user is not authenticated or is a customer, only show available stations
    if (!req.user || req.user.role === 'customer') {
      query.available = true;
    }
    // If user is a provider, only show their stations
    else if (req.user.role === 'provider') {
      query.provider = req.user.id;
    }

    const stations = await ChargingStation.find(query)
      .populate({
        path: 'provider',
        select: 'firstName lastName phone email'
      })
      .sort({ createdAt: -1 });

    console.log(`Found ${stations.length} stations`);
    res.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get station by ID
export const getStationById = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id)
      .populate({
        path: 'provider',
        select: 'firstName lastName phone email'
      })
      .populate({
        path: 'reviews.user',
        select: 'firstName lastName'
      });

    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    res.json(station);
  } catch (error) {
    console.error('Error fetching station:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update station availability status
export const updateStationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    // Find station and verify ownership
    const station = await ChargingStation.findOne({
      _id: id,
      provider: req.user.id
    });

    if (!station) {
      return res.status(404).json({ message: 'Station not found or unauthorized' });
    }

    // Update availability
    station.available = available;
    await station.save();

    res.json(station);
  } catch (error) {
    console.error('Error updating station status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search stations with filters
export const searchStations = async (req, res) => {
  try {
    const {
      available,
      connectorType,
      minPower,
      maxPrice,
      city,
      state
    } = req.query;

    const filter = {};

    // If user is not authenticated or is a customer, only show available stations
    if (!req.user || req.user.role === 'customer') {
      filter.available = true;
    }

    if (available !== undefined) {
      filter.available = available === 'true';
    }

    if (connectorType) {
      filter.connectorType = connectorType;
    }

    if (minPower) {
      filter.powerOutput = { $gte: parseFloat(minPower) };
    }

    if (maxPrice) {
      filter.pricePerHour = { $lte: parseFloat(maxPrice) };
    }

    if (city) {
      filter.city = new RegExp(city, 'i');
    }

    if (state) {
      filter.state = new RegExp(state, 'i');
    }

    const stations = await ChargingStation.find(filter)
      .populate({
        path: 'provider',
        select: 'firstName lastName phone email'
      })
      .sort({ createdAt: -1 });

    res.json(stations);
  } catch (error) {
    console.error('Error searching stations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get provider stations
export const getProviderStations = async (req, res) => {
  try {
    const stations = await ChargingStation.find({ provider: req.user._id })
      .sort({ createdAt: -1 });
    res.json(stations);
  } catch (error) {
    console.error('Error fetching provider stations:', error);
    res.status(500).json({ message: 'Error fetching stations' });
  }
}; 