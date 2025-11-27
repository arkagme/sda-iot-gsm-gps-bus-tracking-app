const express = require('express');
const Bus = require('../models/Bus');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// All routes require authentication
router.use(ensureAuthenticated);

// @route   GET /api/buses
// @desc    Get all buses (Admin) or user's assigned bus (User)
// @access  Private
router.get('/', async (req, res) => {
  try {
    let buses;

    if (req.user.role === 'admin') {
      // Admin can see all buses
      buses = await Bus.find()
        .populate('route', 'routeName routeNumber')
        .sort({ busNumber: 1 });
    } else {
      // User can only see their assigned bus
      if (!req.user.assignedBus) {
        return res.json({
          success: true,
          data: []
        });
      }

      buses = await Bus.find({ _id: req.user.assignedBus })
        .populate('route', 'routeName routeNumber stops');
    }

    res.json({
      success: true,
      count: buses.length,
      data: buses
    });

  } catch (error) {
    logger.error(`Error fetching buses: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch buses'
    });
  }
});

// @route   GET /api/buses/:id
// @desc    Get single bus by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id)
      .populate('route');

    if (!bus) {
      return res.status(404).json({
        success: false,
        error: 'Bus not found'
      });
    }

    // Check access permissions
    if (req.user.role !== 'admin' && 
        req.user.assignedBus?.toString() !== bus._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: bus
    });

  } catch (error) {
    logger.error(`Error fetching bus: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bus'
    });
  }
});

// @route   POST /api/buses
// @desc    Create new bus
// @access  Admin
router.post('/', ensureAdmin, async (req, res) => {
  try {
    const {
      busNumber,
      deviceId,
      route,
      driver,
      capacity,
      registrationNumber
    } = req.body;

    // Check if bus with same number or device ID exists
    const existing = await Bus.findOne({
      $or: [
        { busNumber },
        { deviceId },
        { registrationNumber }
      ]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Bus with this number, device ID, or registration already exists'
      });
    }

    const bus = await Bus.create({
      busNumber,
      deviceId,
      route,
      driver,
      capacity,
      registrationNumber
    });

    await bus.populate('route');

    logger.info(`Bus created: ${bus.busNumber} by admin ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: bus
    });

  } catch (error) {
    logger.error(`Error creating bus: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to create bus'
    });
  }
});

// @route   PUT /api/buses/:id
// @desc    Update bus
// @access  Admin
router.put('/:id', ensureAdmin, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        error: 'Bus not found'
      });
    }

    const allowedUpdates = [
      'busNumber', 'route', 'driver', 'capacity',
      'registrationNumber', 'status'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        bus[field] = req.body[field];
      }
    });

    await bus.save();
    await bus.populate('route');

    logger.info(`Bus updated: ${bus.busNumber} by admin ${req.user.email}`);

    res.json({
      success: true,
      data: bus
    });

  } catch (error) {
    logger.error(`Error updating bus: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to update bus'
    });
  }
});

// @route   DELETE /api/buses/:id
// @desc    Delete bus
// @access  Admin
router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        error: 'Bus not found'
      });
    }

    logger.info(`Bus deleted: ${bus.busNumber} by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'Bus deleted successfully'
    });

  } catch (error) {
    logger.error(`Error deleting bus: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to delete bus'
    });
  }
});

// @route   GET /api/buses/route/:routeId
// @desc    Get all buses for a specific route
// @access  Private
router.get('/route/:routeId', async (req, res) => {
  try {
    const buses = await Bus.find({ route: req.params.routeId })
      .populate('route', 'routeName routeNumber');

    res.json({
      success: true,
      count: buses.length,
      data: buses
    });

  } catch (error) {
    logger.error(`Error fetching route buses: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch buses'
    });
  }
});

module.exports = router;