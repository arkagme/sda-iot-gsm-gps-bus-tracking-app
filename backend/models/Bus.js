const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  deviceId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  driver: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    licenseNumber: {
      type: String,
      trim: true
    }
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    timestamp: {
      type: Date
    }
  },
  lastUpdated: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Geospatial index for location queries
busSchema.index({ currentLocation: '2dsphere' });
busSchema.index({ deviceId: 1 });
busSchema.index({ busNumber: 1 });
busSchema.index({ route: 1 });

module.exports = mongoose.model('Bus', busSchema);