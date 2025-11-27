import api from './api';

export const authService = {
  checkAuth: () => api.get('/api/auth/check'),
  getCurrentUser: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
  initiateGoogleAuth: () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
  },
};

export const routeService = {
  getAllRoutes: (params) => api.get('/api/routes', { params }),
  getRoute: (id) => api.get(`/api/routes/${id}`),
  createRoute: (data) => api.post('/api/routes', data),
  updateRoute: (id, data) => api.put(`/api/routes/${id}`, data),
  deleteRoute: (id) => api.delete(`/api/routes/${id}`),
  getETA: (routeId, stopName) => api.get(`/api/routes/${routeId}/eta/${encodeURIComponent(stopName)}`),
};

export const busService = {
  getAllBuses: (params) => api.get('/api/buses', { params }),
  getBus: (id) => api.get(`/api/buses/${id}`),
  getBusesByRoute: (routeId) => api.get(`/api/buses/route/${routeId}`),
  createBus: (data) => api.post('/api/buses', data),
  updateBus: (id, data) => api.put(`/api/buses/${id}`, data),
};

export const gpsService = {
  getLatestPosition: (busId) => api.get(`/api/gps/bus/${busId}/latest`),
  getGPSHistory: (busId, params) => api.get(`/api/gps/bus/${busId}/history`, { params }),
  getActiveGPSForRoute: (routeId) => api.get(`/api/gps/route/${routeId}/active`),
};

export const userService = {
  getAllUsers: (params) => api.get('/api/users', { params }),
  getUser: (id) => api.get(`/api/users/${id}`),
  updateUser: (id, data) => api.put(`/api/users/${id}`, data),
  assignRoute: (userId, data) => api.post(`/api/users/${userId}/assign-route`, data),
  getTravelHistory: (userId, params) => api.get(`/api/users/${userId}/travel-history`, { params }),
};

export const notificationService = {
  getNotifications: (params) => api.get('/api/notifications', { params }),
  createNotification: (data) => api.post('/api/notifications', data),
  updateNotification: (id, data) => api.put(`/api/notifications/${id}`, data),
  deleteNotification: (id) => api.delete(`/api/notifications/${id}`),
};

export const ticketService = {
  getTickets: (params) => api.get('/api/tickets', { params }),
  getTicket: (id) => api.get(`/api/tickets/${id}`),
  createTicket: (data) => api.post('/api/tickets', data),
  addResponse: (id, data) => api.post(`/api/tickets/${id}/response`, data),
  updateStatus: (id, data) => api.put(`/api/tickets/${id}/status`, data),
  assignTicket: (id, data) => api.put(`/api/tickets/${id}/assign`, data),
  getStats: () => api.get('/api/tickets/stats/overview'),
};

export const analyticsService = {
  getOverview: (params) => api.get('/api/analytics/overview', { params }),
  getBusAnalytics: (busId, params) => api.get(`/api/analytics/bus/${busId}`, { params }),
  getRouteAnalytics: (routeId, params) => api.get(`/api/analytics/route/${routeId}`, { params }),
  getPunctualityTrends: (params) => api.get('/api/analytics/punctuality', { params }),
  getDelayReasons: (params) => api.get('/api/analytics/delay-reasons', { params }),
};
