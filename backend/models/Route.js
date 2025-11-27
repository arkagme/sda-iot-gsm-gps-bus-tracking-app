const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  name: {
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
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  order: {
    type: Number,
    required: true
  },
  estimatedArrivalTime: {
    type: String, // Format: "HH:MM"
    required: true
  }
}, { _id: false });

const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  routeNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  stops: [stopSchema],
  startTime: {
    type: String, // Format: "HH:MM"
    required: true
  },
  endTime: {
    type: String, // Format: "HH:MM"
    required: true
  },
  daysOperating: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  totalDistance: {
    type: Number, // in kilometers
    default: 0
  },
  averageDuration: {
    type: Number, // in minutes
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#4285F4' // For displaying on maps
  }
}, {
  timestamps: true
});

// Index for geospatial queries
routeSchema.index({ 'stops.location': '2dsphere' });
routeSchema.index({ routeNumber: 1 });
routeSchema.index({ routeName: 1 });

module.exports = mongoose.model('Route', routeSchema);