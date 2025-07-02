import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  licensePlate: {
    type: String,
    required: true
  },
  chargerType: {
    type: String,
    required: true,
    enum: ['Type 1', 'Type 2 (Mennekes)', 'CHAdeMO', 'CCS']
  }
}, {
  timestamps: true
});

// Use mongoose.models.Vehicle to check if the model exists, otherwise create it
const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);

export default Vehicle; 