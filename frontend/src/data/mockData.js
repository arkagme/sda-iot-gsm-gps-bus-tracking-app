// Mock data for the SASTRA Bus Tracking App
// Location: SASTRA University, Thanjavur, Tamil Nadu

export const SASTRA_LOCATION = {
  latitude: 10.729351,
  longitude: 79.019799
};

export const MOCK_ROUTES = [
  {
    _id: 'route_1',
    routeNumber: 'R1',
    routeName: 'Academic Block - Hostel Circuit',
    startTime: '07:00 AM',
    endTime: '10:00 PM',
    daysOperating: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    stops: [
      { name: 'Main Gate', order: 1, location: { coordinates: [79.019799, 10.729351] } },
      { name: 'Academic Block A', order: 2, location: { coordinates: [79.020456, 10.730124] } },
      { name: 'Central Library', order: 3, location: { coordinates: [79.021234, 10.729867] } },
      { name: 'Boys Hostel Block 1', order: 4, location: { coordinates: [79.022011, 10.728654] } },
      { name: 'Girls Hostel Block 1', order: 5, location: { coordinates: [79.021456, 10.727891] } },
      { name: 'Sports Complex', order: 6, location: { coordinates: [79.020789, 10.728234] } },
    ],
    isActive: true
  },
  {
    _id: 'route_2',
    routeNumber: 'R2',
    routeName: 'Railway Station - Campus Express',
    startTime: '06:30 AM',
    endTime: '09:30 PM',
    daysOperating: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    stops: [
      { name: 'Thanjavur Railway Station', order: 1, location: { coordinates: [79.136789, 10.787234] } },
      { name: 'City Bus Stand', order: 2, location: { coordinates: [79.128345, 10.782456] } },
      { name: 'SASTRA Main Gate', order: 3, location: { coordinates: [79.019799, 10.729351] } },
      { name: 'Administrative Block', order: 4, location: { coordinates: [79.020123, 10.730567] } },
    ],
    isActive: true
  },
  {
    _id: 'route_3',
    routeNumber: 'R3',
    routeName: 'Medical Center Circuit',
    startTime: '08:00 AM',
    endTime: '06:00 PM',
    daysOperating: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    stops: [
      { name: 'Campus Entry', order: 1, location: { coordinates: [79.019799, 10.729351] } },
      { name: 'Medical Center', order: 2, location: { coordinates: [79.019456, 10.731234] } },
      { name: 'Faculty Quarters', order: 3, location: { coordinates: [79.020234, 10.732011] } },
      { name: 'Guest House', order: 4, location: { coordinates: [79.021123, 10.731567] } },
    ],
    isActive: true
  }
];

export const MOCK_BUSES = [
  {
    _id: 'bus_1',
    busNumber: 'TN 48 AB 1234',
    routeId: 'route_1',
    capacity: 45,
    status: 'active',
    driver: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      licenseNumber: 'TN1234567890'
    },
    currentLocation: {
      latitude: SASTRA_LOCATION.latitude,
      longitude: SASTRA_LOCATION.longitude
    }
  },
  {
    _id: 'bus_2',
    busNumber: 'TN 48 CD 5678',
    routeId: 'route_2',
    capacity: 50,
    status: 'active',
    driver: {
      name: 'Murugan S',
      phone: '+91 98765 43211',
      licenseNumber: 'TN1234567891'
    },
    currentLocation: {
      latitude: 10.730124,
      longitude: 79.020456
    }
  },
  {
    _id: 'bus_3',
    busNumber: 'TN 48 EF 9012',
    routeId: 'route_3',
    capacity: 40,
    status: 'maintenance',
    driver: {
      name: 'Senthil M',
      phone: '+91 98765 43212',
      licenseNumber: 'TN1234567892'
    },
    currentLocation: {
      latitude: 10.729867,
      longitude: 79.021234
    }
  }
];

export const MOCK_GPS_HISTORY = [
  {
    busId: 'bus_1',
    location: {
      coordinates: [SASTRA_LOCATION.longitude, SASTRA_LOCATION.latitude]
    },
    speed: 25,
    timestamp: new Date().toISOString()
  },
  {
    busId: 'bus_1',
    location: {
      coordinates: [79.020123, 10.729567]
    },
    speed: 28,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    busId: 'bus_1',
    location: {
      coordinates: [79.020456, 10.730124]
    },
    speed: 22,
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    busId: 'bus_1',
    location: {
      coordinates: [79.021234, 10.729867]
    },
    speed: 30,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    _id: 'notif_1',
    title: 'Route Update',
    message: 'R1 bus is running on schedule',
    severity: 'info',
    type: 'route_update',
    createdAt: new Date().toISOString(),
    read: false
  },
  {
    _id: 'notif_2',
    title: 'Service Alert',
    message: 'R3 bus temporarily out of service for maintenance',
    severity: 'warning',
    type: 'service_alert',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    _id: 'notif_3',
    title: 'Delay Notice',
    message: 'R2 bus delayed by 10 minutes due to heavy traffic',
    severity: 'low',
    type: 'delay',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true
  }
];

export const MOCK_USERS = {
  student: {
    _id: 'user_1',
    name: 'Student',
    email: 'student@sastra.ac.in',
    role: 'user',
    profilePicture: null,
    assignedRoute: MOCK_ROUTES[0],
    assignedStop: 'Main Gate',
    travelHistory: [
      {
        date: new Date().toISOString(),
        route: 'R1',
        boarding: 'Main Gate',
        destination: 'Academic Block A',
        duration: 15
      },
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        route: 'R1',
        boarding: 'Academic Block A',
        destination: 'Boys Hostel Block 1',
        duration: 20
      }
    ]
  },
  admin: {
    _id: 'user_2',
    name: 'Administrator',
    email: 'admin@sastra.ac.in',
    role: 'admin',
    profilePicture: null
  }
};

export const MOCK_ANALYTICS = {
  overview: {
    totalBuses: MOCK_BUSES.length,
    activeBuses: MOCK_BUSES.filter(b => b.status === 'active').length,
    totalRoutes: MOCK_ROUTES.length,
    activeRoutes: MOCK_ROUTES.filter(r => r.isActive).length,
    totalStudents: 1247,
    averageDelay: 3.5,
    punctualityRate: 92.5
  },
  punctualityTrends: [
    { date: '2024-01-20', onTime: 45, delayed: 5 },
    { date: '2024-01-21', onTime: 48, delayed: 2 },
    { date: '2024-01-22', onTime: 46, delayed: 4 },
    { date: '2024-01-23', onTime: 49, delayed: 1 },
    { date: '2024-01-24', onTime: 47, delayed: 3 }
  ],
  delayReasons: [
    { reason: 'Traffic', count: 45, percentage: 45 },
    { reason: 'Maintenance', count: 25, percentage: 25 },
    { reason: 'Weather', count: 15, percentage: 15 },
    { reason: 'Other', count: 15, percentage: 15 }
  ]
};
