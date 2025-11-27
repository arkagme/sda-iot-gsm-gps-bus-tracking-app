const express = require('express');
const GPSData = require('../models/GPSData');
const Bus = require('../models/Bus');
const { broadcastGPSUpdate } = require('../websocket/handler');
const logger = require('../utils/logger');

const router = express.Router();

// @route   POST /api/gps
// @desc    Receive GPS data from hardware device
// @access  Public (but should be validated with device authentication)
router.post('/', async (req, res) => {
  try {
    const {
      device_id,
      timestamp,
      latitude,
      longitude,
      altitude,
      speed,
      satellites,
      hdop
    } = req.body;

    // Validate required fields
    if (!device_id || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required GPS data'
      });
    }

    // Find bus by device ID
    const bus = await Bus.findOne({ deviceId: device_id }).populate('route');

    if (!bus) {
      logger.warn(`GPS data received from unknown device: ${device_id}`);
      return res.status(404).json({
        success: false,
        error: 'Device not registered'
      });
    }

    // Create GPS data record
    const gpsData = await GPSData.create({
      deviceId: device_id,
      bus: bus._id,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      altitude: altitude || 0,
      speed: speed || 0,
      satellites: satellites || 0,
      hdop: hdop || 0,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    // Update bus current location
    bus.currentLocation = {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
      timestamp: gpsData.timestamp
    };
    bus.lastUpdated = new Date();
    await bus.save();

    // Broadcast to connected clients
    if (bus.route) {
      broadcastGPSUpdate(bus.route._id, bus._id, {
        device_id,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        altitude: altitude || 0,
        speed: speed || 0,
        satellites: satellites || 0,
        hdop: hdop || 0,
        timestamp: gpsData.timestamp,
        busNumber: bus.busNumber,
        routeName: bus.route.routeName
      });
    }

    logger.info(`GPS data saved for device ${device_id}: ${latitude}, ${longitude}`);

    res.status(200).json({
      success: true,
      message: 'GPS data received successfully',
      data: {
        id: gpsData._id,
        timestamp: gpsData.timestamp
      }
    });

  } catch (error) {
    logger.error(`GPS data error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to process GPS data'
    });
  }
});

// @route   GET /api/gps/bus/:busId/latest
// @desc    Get latest GPS position for a bus
// @access  Private
router.get('/bus/:busId/latest', async (req, res) => {
  try {
    const { busId } = req.params;

    const latestGPS = await GPSData.findOne({ bus: busId })
      .sort({ timestamp: -1 })
      .limit(1)
      .populate('bus', 'busNumber deviceId');

    if (!latestGPS) {
      return res.status(404).json({
        success: false,
        error: 'No GPS data found for this bus'
      });
    }

    res.json({
      success: true,
      data: latestGPS
    });

  } catch (error) {
    logger.error(`Error fetching latest GPS: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch GPS data'
    });
  }
});

// @route   GET /api/gps/bus/:busId/history
// @desc    Get GPS history for a bus
// @access  Private
router.get('/bus/:busId/history', async (req, res) => {
  try {
    const { busId } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;

    const query = { bus: busId };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const gpsHistory = await GPSData.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      count: gpsHistory.length,
      data: gpsHistory
    });

  } catch (error) {
    logger.error(`Error fetching GPS history: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch GPS history'
    });
  }
});

// @route   GET /api/gps/route/:routeId/active
// @desc    Get active GPS data for all buses on a route
// @access  Private
router.get('/route/:routeId/active', async (req, res) => {
  try {
    const { routeId } = req.params;

    // Find all buses on this route
    const buses = await Bus.find({ route: routeId, status: 'active' })
      .select('_id busNumber deviceId currentLocation lastUpdated driver');

    if (buses.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Get latest GPS for each bus
    const busIds = buses.map(b => b._id);
    const latestGPSData = await GPSData.aggregate([
      { $match: { bus: { $in: busIds } } },
      { $sort: { timestamp: -1 } },
      { $group: {
        _id: '$bus',
        latestData: { $first: '$$ROOT' }
      }}
    ]);

    // Combine bus info with GPS data
    const result = buses.map(bus => {
      const gpsEntry = latestGPSData.find(g => g._id.toString() === bus._id.toString());
      return {
        bus: {
          id: bus._id,
          busNumber: bus.busNumber,
          deviceId: bus.deviceId,
          driver: bus.driver
        },
        currentLocation: bus.currentLocation,
        lastUpdated: bus.lastUpdated,
        gpsData: gpsEntry ? gpsEntry.latestData : null
      };
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    logger.error(`Error fetching route GPS data: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch route GPS data'
    });
  }
});

module.exports = router;