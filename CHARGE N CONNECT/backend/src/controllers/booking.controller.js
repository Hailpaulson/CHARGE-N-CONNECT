import Booking from '../models/Booking.js';
import ChargingStation from '../models/ChargingStation.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { stationId, vehicleId, startTime, duration } = req.body;

    // Find the station
    const station = await ChargingStation.findById(stationId);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    if (!station.available) {
      return res.status(400).json({ message: 'Station is not available' });
    }

    // Calculate total price
    const totalPrice = station.pricePerHour * duration;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      station: stationId,
      vehicle: vehicleId,
      startTime: startTime || new Date(),
      duration,
      totalPrice,
      status: 'pending'
    });

    // Update station availability
    station.available = false;
    await station.save();

    // Save booking
    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

// Get customer's bookings
export const getCustomerBookings = async (req, res) => {
  try {
    console.log('Fetching bookings for customer:', req.user._id);
    const bookings = await Booking.find({ user: req.user._id })
      .populate('station')
      .populate('vehicle')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${bookings.length} bookings`);
    res.json(bookings);
  } catch (error) {
    console.error('Error in getCustomerBookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// Get provider's bookings
export const getProviderBookings = async (req, res) => {
  try {
    console.log('Fetching bookings for provider:', req.user._id);
    const bookings = await Booking.find({
      'station.provider': req.user._id
    })
    .populate('user', 'name email')
    .populate('station')
    .sort({ createdAt: -1 });
    
    console.log(`Found ${bookings.length} bookings`);
    res.json(bookings);
  } catch (error) {
    console.error('Error in getProviderBookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    // If booking is completed or cancelled, make station available again
    if (status === 'completed' || status === 'cancelled') {
      const station = await ChargingStation.findById(booking.station);
      if (station) {
        station.available = true;
        await station.save();
      }
    }

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Error updating booking' });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('station')
      .populate('user', 'name email')
      .populate('vehicle');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
}; 