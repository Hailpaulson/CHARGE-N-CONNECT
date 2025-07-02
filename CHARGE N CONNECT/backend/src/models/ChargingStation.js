import mongoose from 'mongoose';

const chargingStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  available: {
    type: Boolean,
    default: true
  },
  pricePerHour: {
    type: Number,
    required: true,
    min: 0
  },
  powerOutput: {
    type: Number,
    required: true,
    min: 0
  },
  connectorType: {
    type: String,
    required: true,
    enum: ['Type 1 (J1772)', 'Type 2 (Mennekes)', 'CCS1', 'CCS2', 'CHAdeMO', 'Tesla']
  },
  operatingHours: {
    start: {
      type: String,
      default: '00:00'
    },
    end: {
      type: String,
      default: '23:59'
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
}, {
  timestamps: true
});

// Add geospatial index for location-based queries
chargingStationSchema.index({ location: '2dsphere' });

const ChargingStation = mongoose.model('ChargingStation', chargingStationSchema);

export default ChargingStation; 