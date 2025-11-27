const express = require('express');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const { broadcastNotification } = require('../websocket/handler');
const logger = require('../utils/logger');

const router = express.Router();

router.use(ensureAuthenticated);

// @route   GET /api/notifications
// @desc    Get notifications (filtered by user's route for non-admin)
// @access  Private
router.get('/', async (req, res) => {
  try {
    let query = { isActive: true };

    if (req.user.role !== 'admin') {
      // Regular users only see notifications for their route
      if (!req.user.assignedRoute) {
        return res.json({
          success: true,
          data: []
        });
      }

      query.$or = [
        { targetAudience: 'all' },
        { routes: req.user.assignedRoute },
        { targetUsers: req.user._id }
      ];
    }

    // Filter out expired notifications
    query.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ];

    const notifications = await Notification.find(query)
      .populate('routes', 'routeName routeNumber')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    logger.error(`Error fetching notifications: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications'
    });
  }
});

// @route   POST /api/notifications
// @desc    Create and broadcast notification
// @access  Admin
router.post('/', ensureAdmin, async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      severity,
      routes,
      targetAudience,
      targetUsers,
      expiresAt,
      metadata
    } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type,
      severity,
      routes: routes || [],
      targetAudience: targetAudience || 'route_specific',
      targetUsers: targetUsers || [],
      createdBy: req.user._id,
      expiresAt,
      metadata
    });

    await notification.populate(['routes', 'createdBy']);

    // Broadcast to connected clients
    if (targetAudience === 'all' || routes.length > 0) {
      const routeIds = targetAudience === 'all' 
        ? await getAllRouteIds() 
        : routes;

      broadcastNotification(routeIds, {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        severity: notification.severity,
        createdAt: notification.createdAt,
        metadata: notification.metadata
      });

      // Update sent count
      notification.sentCount = routeIds.length;
      await notification.save();
    }

    logger.info(`Notification created by admin ${req.user.email}: ${notification.title}`);

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    logger.error(`Error creating notification: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to create notification'
    });
  }
});

// @route   PUT /api/notifications/:id
// @desc    Update notification
// @access  Admin
router.put('/:id', ensureAdmin, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    const allowedUpdates = [
      'title', 'message', 'type', 'severity',
      'routes', 'isActive', 'expiresAt', 'metadata'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        notification[field] = req.body[field];
      }
    });

    await notification.save();

    logger.info(`Notification updated: ${notification.title}`);

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    logger.error(`Error updating notification: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to update notification'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Admin
router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    logger.info(`Notification deactivated: ${notification.title}`);

    res.json({
      success: true,
      message: 'Notification deactivated successfully'
    });
  } catch (error) {
    logger.error(`Error deleting notification: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification'
    });
  }
});

// Helper function to get all route IDs
async function getAllRouteIds() {
  const Route = require('../models/Route');
  const routes = await Route.find({ isActive: true }).select('_id');
  return routes.map(r => r._id);
}

module.exports = router;