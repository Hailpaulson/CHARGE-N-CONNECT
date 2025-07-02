import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChargingStation',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 24
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Create compound index for checking availability
bookingSchema.index({ station: 1, startTime: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking; 