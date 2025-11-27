const express = require('express');
const Route = require('../models/Route');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');
const { getDistance } = require('geolib');

const router = express.Router();

router.use(ensureAuthenticated);

// @route   GET /api/routes
// @desc    Get all routes
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { isActive } = req.query;
    const query = isActive !== undefined ? { isActive: isActive === 'true' } : {};

    const routes = await Route.find(query).sort({ routeNumber: 1 });

    res.json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    logger.error(`Error fetching routes: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch routes'
    });
  }
});

// @route   GET /api/routes/:id
// @desc    Get single route
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }

    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    logger.error(`Error fetching route: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch route'
    });
  }
});

// @route   POST /api/routes
// @desc    Create new route
// @access  Admin
router.post('/', ensureAdmin, async (req, res) => {
  try {
    const {
      routeName,
      routeNumber,
      stops,
      startTime,
      endTime,
      daysOperating,
      color
    } = req.body;

    // Calculate total distance
    let totalDistance = 0;
    if (stops && stops.length > 1) {
      for (let i = 0; i < stops.length - 1; i++) {
        const distance = getDistance(
          { latitude: stops[i].location.coordinates[1], longitude: stops[i].location.coordinates[0] },
          { latitude: stops[i + 1].location.coordinates[1], longitude: stops[i + 1].location.coordinates[0] }
        );
        totalDistance += distance;
      }
      totalDistance = totalDistance / 1000; // Convert to km
    }

    const route = await Route.create({
      routeName,
      routeNumber,
      stops,
      startTime,
      endTime,
      daysOperating,
      totalDistance,
      color
    });

    logger.info(`Route created: ${route.routeName} by admin ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: route
    });
  } catch (error) {
    logger.error(`Error creating route: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to create route'
    });
  }
});

// @route   PUT /api/routes/:id
// @desc    Update route
// @access  Admin
router.put('/:id', ensureAdmin, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }

    const allowedUpdates = [
      'routeName', 'stops', 'startTime', 'endTime',
      'daysOperating', 'isActive', 'color', 'averageDuration'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        route[field] = req.body[field];
      }
    });

    // Recalculate distance if stops changed
    if (req.body.stops) {
      let totalDistance = 0;
      const stops = req.body.stops;
      if (stops.length > 1) {
        for (let i = 0; i < stops.length - 1; i++) {
          const distance = getDistance(
            { latitude: stops[i].location.coordinates[1], longitude: stops[i].location.coordinates[0] },
            { latitude: stops[i + 1].location.coordinates[1], longitude: stops[i + 1].location.coordinates[0] }
          );
          totalDistance += distance;
        }
        route.totalDistance = totalDistance / 1000;
      }
    }

    await route.save();

    logger.info(`Route updated: ${route.routeName} by admin ${req.user.email}`);

    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    logger.error(`Error updating route: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to update route'
    });
  }
});

// @route   DELETE /api/routes/:id
// @desc    Delete route
// @access  Admin
router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }

    logger.info(`Route deleted: ${route.routeName} by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting route: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to delete route'
    });
  }
});

// @route   GET /api/routes/:id/eta/:stopName
// @desc    Calculate ETA for a specific stop
// @access  Private
router.get('/:id/eta/:stopName', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }

    const Bus = require('../models/Bus');
    const buses = await Bus.find({ route: req.params.id, status: 'active' });

    if (buses.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No active bus on this route'
      });
    }

    const bus = buses[0];
    const stop = route.stops.find(s => s.name === req.params.stopName);

    if (!stop) {
      return res.status(404).json({
        success: false,
        error: 'Stop not found'
      });
    }

    // Calculate distance from current location to stop
    const distance = getDistance(
      { latitude: bus.currentLocation.coordinates[1], longitude: bus.currentLocation.coordinates[0] },
      { latitude: stop.location.coordinates[1], longitude: stop.location.coordinates[0] }
    );

    // Estimate ETA (assuming average speed of 30 km/h in traffic)
    const avgSpeed = 30;
    const etaMinutes = Math.round((distance / 1000) / avgSpeed * 60);
    const etaTime = new Date(Date.now() + etaMinutes * 60000);

    res.json({
      success: true,
      data: {
        stopName: stop.name,
        distanceMeters: distance,
        estimatedArrival: etaTime,
        estimatedMinutes: etaMinutes,
        currentBusLocation: {
          latitude: bus.currentLocation.coordinates[1],
          longitude: bus.currentLocation.coordinates[0]
        }
      }
    });
  } catch (error) {
    logger.error(`Error calculating ETA: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate ETA'
    });
  }
});

module.exports = router;