const express = require('express');
const TripHistory = require('../models/TripHistory');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

router.use(ensureAuthenticated);
router.use(ensureAdmin); // All analytics routes are admin-only

// @route   GET /api/analytics/overview
// @desc    Get overall system analytics
// @access  Admin
router.get('/overview', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.date = { $gte: thirtyDaysAgo };
    }

    const [totalTrips, completedTrips, cancelledTrips, averageStats] = await Promise.all([
      TripHistory.countDocuments(dateFilter),
      TripHistory.countDocuments({ ...dateFilter, status: 'completed' }),
      TripHistory.countDocuments({ ...dateFilter, status: 'cancelled' }),
      TripHistory.aggregate([
        { $match: { ...dateFilter, status: 'completed' } },
        {
          $group: {
            _id: null,
            avgPunctuality: { $avg: '$punctualityScore' },
            avgDelay: { $avg: '$delays.total' },
            totalDistance: { $sum: '$totalDistance' }
          }
        }
      ])
    ]);

    const activeBuses = await Bus.countDocuments({ status: 'active' });
    const activeRoutes = await Route.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        trips: {
          total: totalTrips,
          completed: completedTrips,
          cancelled: cancelledTrips,
          completionRate: totalTrips > 0 ? (completedTrips / totalTrips * 100).toFixed(2) : 0
        },
        averages: averageStats.length > 0 ? {
          punctualityScore: averageStats[0].avgPunctuality.toFixed(2),
          delayMinutes: averageStats[0].avgDelay.toFixed(2),
          totalDistanceCovered: averageStats[0].totalDistance.toFixed(2)
        } : null,
        fleet: {
          activeBuses,
          activeRoutes
        }
      }
    });
  } catch (error) {
    logger.error(`Error fetching overview analytics: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

// @route   GET /api/analytics/bus/:busId
// @desc    Get analytics for specific bus
// @access  Admin
router.get('/bus/:busId', async (req, res) => {
  try {
    const { busId } = req.params;
    const { startDate, endDate } = req.query;

    const dateFilter = { bus: busId };

    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    } else {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.date = { $gte: thirtyDaysAgo };
    }

    const trips = await TripHistory.find(dateFilter)
      .populate('route', 'routeName routeNumber')
      .sort({ date: -1 });

    const stats = await TripHistory.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          completedTrips: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          avgPunctuality: { $avg: '$punctualityScore' },
          avgDelay: { $avg: '$delays.total' },
          totalDistance: { $sum: '$totalDistance' },
          avgSpeed: { $avg: '$averageSpeed' }
        }
      }
    ]);

    // Calculate on-time performance
    const onTimeTrips = trips.filter(t => t.punctualityScore >= 90).length;
    const onTimePerformance = trips.length > 0 ? (onTimeTrips / trips.length * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        busId,
        period: {
          startDate: dateFilter.date?.$gte || 'All time',
          endDate: dateFilter.date?.$lte || 'Present'
        },
        statistics: stats.length > 0 ? {
          totalTrips: stats[0].totalTrips,
          completedTrips: stats[0].completedTrips,
          avgPunctualityScore: stats[0].avgPunctuality.toFixed(2),
          avgDelayMinutes: stats[0].avgDelay.toFixed(2),
          totalDistanceKm: stats[0].totalDistance.toFixed(2),
          avgSpeedKmh: stats[0].avgSpeed.toFixed(2),
          onTimePerformance
        } : null,
        recentTrips: trips.slice(0, 10)
      }
    });
  } catch (error) {
    logger.error(`Error fetching bus analytics: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bus analytics'
    });
  }
});

// @route   GET /api/analytics/route/:routeId
// @desc    Get analytics for specific route
// @access  Admin
router.get('/route/:routeId', async (req, res) => {
  try {
    const { routeId } = req.params;
    const { startDate, endDate } = req.query;

    const dateFilter = { route: routeId };

    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    } else {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.date = { $gte: thirtyDaysAgo };
    }

    const stats = await TripHistory.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          completedTrips: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          avgPunctuality: { $avg: '$punctualityScore' },
          avgDelay: { $avg: '$delays.total' },
          totalDistance: { $sum: '$totalDistance' }
        }
      }
    ]);

    // Get delay patterns by day of week
    const delayPatterns = await TripHistory.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      {
        $group: {
          _id: { $dayOfWeek: '$date' },
          avgDelay: { $avg: '$delays.total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get busiest stops (most delays)
    const busiestStops = await TripHistory.aggregate([
      { $match: dateFilter },
      { $unwind: '$stopTimings' },
      {
        $group: {
          _id: '$stopTimings.stop.name',
          avgDelay: { $avg: '$stopTimings.delay' },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgDelay: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        routeId,
        statistics: stats.length > 0 ? stats[0] : null,
        delayPatterns: delayPatterns.map(d => ({
          day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d._id - 1],
          avgDelay: d.avgDelay.toFixed(2),
          tripCount: d.count
        })),
        busiestStops
      }
    });
  } catch (error) {
    logger.error(`Error fetching route analytics: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch route analytics'
    });
  }
});

// @route   GET /api/analytics/punctuality
// @desc    Get punctuality trends
// @access  Admin
router.get('/punctuality', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const punctualityTrend = await TripHistory.aggregate([
      {
        $match: {
          date: { $gte: startDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          avgPunctuality: { $avg: '$punctualityScore' },
          tripCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: punctualityTrend
    });
  } catch (error) {
    logger.error(`Error fetching punctuality trends: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch punctuality trends'
    });
  }
});

// @route   GET /api/analytics/delay-reasons
// @desc    Get common delay reasons
// @access  Admin
router.get('/delay-reasons', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = { status: 'completed' };

    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const delayReasons = await TripHistory.aggregate([
      { $match: dateFilter },
      { $unwind: '$delays.reasons' },
      {
        $group: {
          _id: '$delays.reasons.reason',
          totalDuration: { $sum: '$delays.reasons.duration' },
          occurrences: { $sum: 1 }
        }
      },
      { $sort: { occurrences: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: delayReasons
    });
  } catch (error) {
    logger.error(`Error fetching delay reasons: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch delay reasons'
    });
  }
});

module.exports = router;