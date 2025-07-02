import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  powerOutput: {
    type: Number,
    required: true
  },
  connectorType: {
    type: String,
    required: true,
    enum: ['Type 1 (J1772)', 'Type 2 (Mennekes)', 'CCS1', 'CCS2', 'CHAdeMO', 'Tesla']
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
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  }
}, {
  timestamps: true
});

// Add geospatial index for location-based queries
stationSchema.index({ location: '2dsphere' });

const Station = mongoose.model('Station', stationSchema);

export default Station; 