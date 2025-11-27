const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['delay', 'cancellation', 'route_change', 'general', 'emergency'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  routes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  }],
  targetAudience: {
    type: String,
    enum: ['all', 'route_specific', 'specific_users'],
    default: 'route_specific'
  },
  targetUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sentCount: {
    type: Number,
    default: 0
  },
  metadata: {
    estimatedDelay: Number,
    affectedDate: Date,
    alternativeRoute: String
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ routes: 1 });
notificationSchema.index({ createdBy: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ isActive: 1 });

// TTL index to automatically delete expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);