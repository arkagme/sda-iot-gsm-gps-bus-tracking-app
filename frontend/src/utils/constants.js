export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  ROUTES: '/api/routes',
  BUSES: '/api/buses',
  GPS: '/api/gps',
  USERS: '/api/users',
  NOTIFICATIONS: '/api/notifications',
  TICKETS: '/api/tickets',
  ANALYTICS: '/api/analytics',
};

export const ROUTES_PATH = {
  HOME: '/',
  LOGIN: '/login',
  AUTH_CALLBACK: '/auth/callback',
  DASHBOARD: '/dashboard',
  TRACKING: '/tracking',
  PROFILE: '/profile',
  SUPPORT: '/support',
  ADMIN: '/admin',
  NOT_FOUND: '/404',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const NOTIFICATION_TYPES = {
  DELAY: 'delay',
  CANCELLATION: 'cancellation',
  ROUTE_CHANGE: 'route_change',
  GENERAL: 'general',
};

export const NOTIFICATION_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  REJECTED: 'rejected',
};

export const TICKET_TYPES = {
  ROUTE_CHANGE: 'route_change_request',
  ISSUE_REPORT: 'issue_report',
  QUERY: 'general_query',
  FEEDBACK: 'feedback',
};

export const BUS_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
};

export const DEFAULT_MAP_CENTER = {
  lat: 10.7626,
  lng: 79.0193,
};

export const DEFAULT_MAP_ZOOM = 13;
