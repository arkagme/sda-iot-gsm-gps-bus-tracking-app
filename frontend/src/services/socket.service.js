import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(userId, routeId) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    const WS_URL = import.meta.env.VITE_WS_URL || 'http://sda.arkagme.me';
    
    this.socket = io(WS_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      
      // Authenticate
      if (userId && routeId) {
        this.socket.emit('authenticate', { userId, routeId });
      }
    });

    this.socket.on('authenticated', (data) => {
      console.log('Socket authenticated:', data);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  subscribeToRoute(routeId) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('subscribe_route', { routeId });
    console.log('Subscribed to route:', routeId);
  }

  unsubscribeFromRoute(routeId) {
    if (!this.socket) return;

    this.socket.emit('unsubscribe_route', { routeId });
    console.log('Unsubscribed from route:', routeId);
  }

  onGPSUpdate(callback) {
    if (!this.socket) return;

    this.socket.on('gps_update', callback);
    this.listeners.set('gps_update', callback);
  }

  onNotification(callback) {
    if (!this.socket) return;

    this.socket.on('notification', callback);
    this.listeners.set('notification', callback);
  }

  offListener(event) {
    if (!this.socket) return;

    const callback = this.listeners.get(event);
    if (callback) {
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  disconnect() {
    if (this.socket) {
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();
      
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket disconnected and cleaned up');
    }
  }
}

export default new SocketService();
