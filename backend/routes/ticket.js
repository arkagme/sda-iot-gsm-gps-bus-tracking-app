const express = require('express');
const Ticket = require('../models/Ticket');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

router.use(ensureAuthenticated);

// @route   GET /api/tickets
// @desc    Get tickets (all for admin, own for users)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, type, priority } = req.query;
    let query = {};

    // Non-admin users can only see their own tickets
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    if (status) query.status = status;
    if (type) query.type = type;
    if (priority) query.priority = priority;

    const tickets = await Ticket.find(query)
      .populate('user', 'name email')
      .populate('relatedBus', 'busNumber')
      .populate('relatedRoute', 'routeName routeNumber')
      .populate('requestedRoute', 'routeName routeNumber')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    logger.error(`Error fetching tickets: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tickets'
    });
  }
});

// @route   GET /api/tickets/:id
// @desc    Get single ticket
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'name email')
      .populate('relatedBus', 'busNumber')
      .populate('relatedRoute', 'routeName routeNumber')
      .populate('requestedRoute', 'routeName routeNumber')
      .populate('assignedTo', 'name email')
      .populate('responses.respondedBy', 'name email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    // Check access
    if (req.user.role !== 'admin' && ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    logger.error(`Error fetching ticket: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ticket'
    });
  }
});

// @route   POST /api/tickets
// @desc    Create new ticket
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      type,
      category,
      subject,
      description,
      priority,
      relatedBus,
      relatedRoute,
      requestedRoute
    } = req.body;

    const ticket = await Ticket.create({
      user: req.user._id,
      type,
      category,
      subject,
      description,
      priority: priority || 'medium',
      relatedBus,
      relatedRoute,
      requestedRoute
    });

    await ticket.populate([
      { path: 'user', select: 'name email' },
      { path: 'relatedBus', select: 'busNumber' },
      { path: 'relatedRoute', select: 'routeName routeNumber' },
      { path: 'requestedRoute', select: 'routeName routeNumber' }
    ]);

    logger.info(`Ticket created: ${ticket.ticketNumber} by user ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    logger.error(`Error creating ticket: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to create ticket'
    });
  }
});

// @route   POST /api/tickets/:id/response
// @desc    Add response to ticket
// @access  Private (Ticket owner or Admin)
router.post('/:id/response', async (req, res) => {
  try {
    const { message, isInternal } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    // Check access
    if (req.user.role !== 'admin' && ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    ticket.responses.push({
      respondedBy: req.user._id,
      message,
      isInternal: isInternal && req.user.role === 'admin' // Only admins can add internal notes
    });

    // Update status if not already in progress
    if (ticket.status === 'open') {
      ticket.status = 'in_progress';
    }

    await ticket.save();
    await ticket.populate('responses.respondedBy', 'name email');

    logger.info(`Response added to ticket ${ticket.ticketNumber}`);

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    logger.error(`Error adding response: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to add response'
    });
  }
});

// @route   PUT /api/tickets/:id/status
// @desc    Update ticket status
// @access  Admin
router.put('/:id/status', ensureAdmin, async (req, res) => {
  try {
    const { status, resolution } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    ticket.status = status;

    if (status === 'resolved' || status === 'closed') {
      ticket.resolvedAt = new Date();
      ticket.resolvedBy = req.user._id;
      if (resolution) {
        ticket.resolution = resolution;
      }
    }

    await ticket.save();

    logger.info(`Ticket ${ticket.ticketNumber} status updated to ${status}`);

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    logger.error(`Error updating ticket status: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to update ticket status'
    });
  }
});

// @route   PUT /api/tickets/:id/assign
// @desc    Assign ticket to admin
// @access  Admin
router.put('/:id/assign', ensureAdmin, async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo,
        status: 'in_progress'
      },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    logger.info(`Ticket ${ticket.ticketNumber} assigned to ${ticket.assignedTo.name}`);

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    logger.error(`Error assigning ticket: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to assign ticket'
    });
  }
});

// @route   GET /api/tickets/stats/overview
// @desc    Get ticket statistics
// @access  Admin
router.get('/stats/overview', ensureAdmin, async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeStats = await Ticket.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Ticket.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        byStatus: stats,
        byType: typeStats,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    logger.error(`Error fetching ticket stats: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ticket statistics'
    });
  }
});

module.exports = router;