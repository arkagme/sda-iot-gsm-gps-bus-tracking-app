const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['route_change_request', 'issue_report', 'general_query', 'feedback'],
    required: true
  },
  category: {
    type: String,
    enum: ['bus_delay', 'driver_behavior', 'route_issue', 'app_issue', 'other'],
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed', 'rejected'],
    default: 'open'
  },
  attachments: [{
    url: String,
    type: String,
    uploadedAt: Date
  }],
  relatedBus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus'
  },
  relatedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  requestedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  responses: [{
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    }
  }],
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolution: {
    type: String
  }
}, {
  timestamps: true
});

// Auto-generate ticket number
ticketSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    const count = await this.constructor.countDocuments();
    this.ticketNumber = `TKT${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Indexes
ticketSchema.index({ ticketNumber: 1 });
ticketSchema.index({ user: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);