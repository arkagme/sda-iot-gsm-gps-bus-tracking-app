const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/@sastra\.ac\.in$/, 'Only @sastra.ac.in emails are allowed']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    default: null
  },
  assignedBus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    default: null
  },
  assignedStop: {
    type: String,
    default: null
  },
  preferences: {
    notificationsEnabled: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);