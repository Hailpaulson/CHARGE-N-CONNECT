import mongoose from 'mongoose';

// Check if the model is already registered to prevent the OverwriteModelError
const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Only create the model if it hasn't been registered yet
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking; 