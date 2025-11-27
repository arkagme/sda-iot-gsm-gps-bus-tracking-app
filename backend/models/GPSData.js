const mongoose = require('mongoose');

const gpsDataSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: true
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
    index: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  altitude: {
    type: Number,
    default: 0
  },
  speed: {
    type: Number, // in km/h
    default: 0
  },
  heading: {
    type: Number, // direction in degrees
    default: 0
  },
  satellites: {
    type: Number,
    default: 0
  },
  hdop: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  accuracy: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
gpsDataSchema.index({ deviceId: 1, timestamp: -1 });
gpsDataSchema.index({ bus: 1, timestamp: -1 });
gpsDataSchema.index({ location: '2dsphere' });

// TTL index to automatically delete old GPS data after 90 days
gpsDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('GPSData', gpsDataSchema);