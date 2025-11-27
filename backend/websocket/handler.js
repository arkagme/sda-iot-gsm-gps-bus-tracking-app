const logger = require('../utils/logger');

const connectedClients = new Map(); // Map of socketId -> { userId, subscribedRoutes }
const routeRooms = new Map(); // Map of routeId -> Set of socketIds

exports.initializeWebSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info(`WebSocket client connected: ${socket.id}`);

    // Handle user authentication and subscription
    socket.on('authenticate', (data) => {
      const { userId, routeId } = data;
      
      connectedClients.set(socket.id, {
        userId,
        subscribedRoutes: new Set()
      });

      logger.info(`User ${userId} authenticated on socket ${socket.id}`);
      
      socket.emit('authenticated', {
        success: true,
        socketId: socket.id
      });
    });

    // Subscribe to specific route updates
    socket.on('subscribe_route', (data) => {
      const { routeId } = data;
      const client = connectedClients.get(socket.id);

      if (!client) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Add to route room
      socket.join(`route_${routeId}`);
      client.subscribedRoutes.add(routeId);

      if (!routeRooms.has(routeId)) {
        routeRooms.set(routeId, new Set());
      }
      routeRooms.get(routeId).add(socket.id);

      logger.info(`Socket ${socket.id} subscribed to route ${routeId}`);
      
      socket.emit('subscribed', {
        success: true,
        routeId
      });
    });

    // Unsubscribe from route updates
    socket.on('unsubscribe_route', (data) => {
      const { routeId } = data;
      const client = connectedClients.get(socket.id);

      if (client) {
        socket.leave(`route_${routeId}`);
        client.subscribedRoutes.delete(routeId);

        const routeRoom = routeRooms.get(routeId);
        if (routeRoom) {
          routeRoom.delete(socket.id);
          if (routeRoom.size === 0) {
            routeRooms.delete(routeId);
          }
        }

        logger.info(`Socket ${socket.id} unsubscribed from route ${routeId}`);
        
        socket.emit('unsubscribed', {
          success: true,
          routeId
        });
      }
    });

    // Subscribe to specific bus updates
    socket.on('subscribe_bus', (data) => {
      const { busId } = data;
      socket.join(`bus_${busId}`);
      
      logger.info(`Socket ${socket.id} subscribed to bus ${busId}`);
      
      socket.emit('subscribed', {
        success: true,
        busId
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const client = connectedClients.get(socket.id);
      
      if (client) {
        // Clean up route rooms
        client.subscribedRoutes.forEach(routeId => {
          const routeRoom = routeRooms.get(routeId);
          if (routeRoom) {
            routeRoom.delete(socket.id);
            if (routeRoom.size === 0) {
              routeRooms.delete(routeId);
            }
          }
        });

        connectedClients.delete(socket.id);
      }

      logger.info(`WebSocket client disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`WebSocket error on ${socket.id}: ${error.message}`);
    });
  });

  // Store io instance for use in other modules
  global.io = io;
};

// Broadcast GPS update to subscribers
exports.broadcastGPSUpdate = (routeId, busId, gpsData) => {
  if (global.io) {
    // Broadcast to route subscribers
    global.io.to(`route_${routeId}`).emit('gps_update', {
      type: 'gps_update',
      routeId,
      busId,
      data: gpsData
    });

    // Broadcast to bus subscribers
    global.io.to(`bus_${busId}`).emit('gps_update', {
      type: 'gps_update',
      busId,
      data: gpsData
    });

    logger.debug(`GPS update broadcasted for route ${routeId}, bus ${busId}`);
  }
};

// Broadcast notification to users
exports.broadcastNotification = (routeIds, notification) => {
  if (global.io) {
    routeIds.forEach(routeId => {
      global.io.to(`route_${routeId}`).emit('notification', {
        type: 'notification',
        data: notification
      });
    });

    logger.info(`Notification broadcasted to ${routeIds.length} routes`);
  }
};

// Get connection statistics
exports.getConnectionStats = () => {
  return {
    totalConnections: connectedClients.size,
    activeRoutes: routeRooms.size,
    routeSubscriptions: Array.from(routeRooms.entries()).map(([routeId, sockets]) => ({
      routeId,
      subscribers: sockets.size
    }))
  };
};