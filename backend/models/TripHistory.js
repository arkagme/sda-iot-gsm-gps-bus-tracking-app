const mongoose = require('mongoose');

const stopTimingSchema = new mongoose.Schema({
  stop: {
    name: String,
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: [Number]
    }
  },
  scheduledArrival: String,
  actualArrival: Date,
  delay: Number, // in minutes
  departed: Date
}, { _id: false });

const tripHistorySchema = new mongoose.Schema({
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['completed', 'in_progress', 'cancelled', 'delayed'],
    default: 'in_progress'
  },
  stopTimings: [stopTimingSchema],
  totalDistance: {
    type: Number, // in kilometers
    default: 0
  },
  averageSpeed: {
    type: Number, // in km/h
    default: 0
  },
  delays: {
    total: {
      type: Number, // total delay in minutes
      default: 0
    },
    reasons: [{
      reason: String,
      duration: Number,
      timestamp: Date
    }]
  },
  punctualityScore: {
    type: Number, // 0-100
    default: 100
  },
  gpsTrack: [{
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: [Number]
    },
    timestamp: Date,
    speed: Number
  }],
  passengers: {
    estimated: Number,
    boarded: Number,
    alighted: Number
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
tripHistorySchema.index({ bus: 1, date: -1 });
tripHistorySchema.index({ route: 1, date: -1 });
tripHistorySchema.index({ date: -1 });
tripHistorySchema.index({ status: 1, date: -1 });

module.exports = mongoose.model('TripHistory', tripHistorySchema);