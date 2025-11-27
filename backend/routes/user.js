const express = require('express');
const User = require('../models/User');
const TripHistory = require('../models/TripHistory');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

router.use(ensureAuthenticated);

// @route   GET /api/users
// @desc    Get all users
// @access  Admin
router.get('/', ensureAdmin, async (req, res) => {
  try {
    const { role, isActive } = req.query;
    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .populate('assignedRoute', 'routeName routeNumber')
      .populate('assignedBus', 'busNumber')
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private (Own profile or Admin)
router.get('/:id', async (req, res) => {
  try {
    // Users can only view their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const user = await User.findById(req.params.id)
      .populate('assignedRoute')
      .populate('assignedBus')
      .select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error(`Error fetching user: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (Own profile) or Admin
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Regular users can only update certain fields
    const userAllowedUpdates = ['preferences'];
    const adminAllowedUpdates = [
      'assignedRoute', 'assignedBus', 'assignedStop',
      'role', 'isActive', 'preferences'
    ];

    const allowedUpdates = req.user.role === 'admin' ? adminAllowedUpdates : userAllowedUpdates;

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    await user.populate(['assignedRoute', 'assignedBus']);

    logger.info(`User updated: ${user.email}`);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// @route   POST /api/users/:id/assign-route
// @desc    Assign route and bus to user
// @access  Admin
router.post('/:id/assign-route', ensureAdmin, async (req, res) => {
  try {
    const { routeId, busId, stopName } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.assignedRoute = routeId;
    user.assignedBus = busId;
    user.assignedStop = stopName;

    await user.save();
    await user.populate(['assignedRoute', 'assignedBus']);

    logger.info(`Route assigned to user ${user.email} by admin ${req.user.email}`);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error(`Error assigning route: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to assign route'
    });
  }
});

// @route   GET /api/users/:id/travel-history
// @desc    Get user's travel history
// @access  Private (Own history or Admin)
router.get('/:id/travel-history', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const { startDate, endDate, limit = 30 } = req.query;

    const query = {
      route: user.assignedRoute,
      status: 'completed'
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const trips = await TripHistory.find(query)
      .populate('bus', 'busNumber')
      .populate('route', 'routeName routeNumber')
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    logger.error(`Error fetching travel history: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch travel history'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (soft delete)
// @access  Admin
router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.isActive = false;
    await user.save();

    logger.info(`User deactivated: ${user.email} by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    logger.error(`Error deactivating user: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to deactivate user'
    });
  }
});

module.exports = router;