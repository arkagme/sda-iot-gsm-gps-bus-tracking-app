# SASTRA Bus Tracking System - Backend API

A comprehensive real-time bus tracking system built for SASTRA University with GPS tracking, WebSocket support, and role-based access control.

## 🚀 Features

### Core Features
- **Real-time GPS Tracking**: Live location updates from ESP32+GPS+GSM hardware
- **WebSocket Support**: Real-time location broadcasting to connected clients
- **Google OAuth Authentication**: Restricted to @sastra.ac.in domain
- **Role-Based Access Control**: Admin and User roles with different permissions
- **Route Management**: Complete CRUD operations for bus routes
- **Bus Fleet Management**: Track and manage multiple buses
- **Support Ticket System**: User queries and issue reporting
- **Push Notifications**: Route-specific alerts and announcements
- **Analytics Dashboard**: Punctuality tracking, delay analysis, and performance metrics
- **Travel History**: Historical trip data for all users

### Technical Features
- RESTful API architecture
- MongoDB with Mongoose ODM
- Session-based authentication with Passport.js
- WebSocket communication using Socket.IO
- Comprehensive logging with Winston
- Geospatial queries for location-based features
- Automated data aggregation for analytics

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0
- Google Cloud Console account (for OAuth)
- npm or yarn package manager

## 🛠️ Installation

### Prerequisites
Ensure you have the following installed:
- **Node.js** v18.0.0 or higher: [Download Node.js](https://nodejs.org/)
- **MongoDB** v6.0 or higher: [Download MongoDB](https://www.mongodb.com/try/download/community)
- **npm** v9.0.0 or higher (comes with Node.js)

### Step-by-Step Installation

#### 1. Clone the repository
```bash
git clone https://github.com/arkagme/sda-bus-tracking-backend.git
cd sastra-sda-bus-track-proj/backend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Configure environment variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```bash
nano .env
# or use your preferred editor
```

**Required environment variables:**
```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/bus-tracker

# Session Configuration
SESSION_SECRET=your-secure-random-string-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Admin Configuration
ADMIN_EMAILS=admin@sastra.ac.in

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# API Configuration
API_PREFIX=/api/v1
```

For detailed setup instructions, see [SETUP.md](./SETUP.md)

#### 4. Start MongoDB

**On macOS (using Homebrew):**
```bash
# Start MongoDB service
brew services start mongodb-community

# Or run in foreground
mongod
```

**On Linux:**
```bash
sudo systemctl start mongod
```

**On Windows:**
```bash
# MongoDB should be in Services, or run directly:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

**Verify MongoDB is running:**
```bash
mongo --eval "db.version()"
# Should return something like: 6.0.0
```

#### 5. Seed the database (Optional)

To populate the database with sample data:
```bash
npm run seed
```

#### 6. Start the server

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**With process manager (PM2):**
```bash
npm install -g pm2
pm2 start server.js --name "bus-tracker-api"
pm2 logs
```

The server will start on `http://localhost:5000` (or your configured PORT).

### Verify Installation

Test if the backend is working:
```bash
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-15T10:30:00Z"}
```

## 📁 Project Structure

```
bus-tracker-backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── middleware/
│   └── auth.js              # Authentication & authorization middleware
├── models/
│   ├── User.js              # User model
│   ├── Bus.js               # Bus model
│   ├── Route.js             # Route model
│   ├── GPSData.js           # GPS data model
│   ├── Notification.js      # Notification model
│   ├── Ticket.js            # Support ticket model
│   └── TripHistory.js       # Trip history model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── bus.js               # Bus management routes
│   ├── route.js             # Route management routes
│   ├── user.js              # User management routes
│   ├── gps.js               # GPS data routes
│   ├── notification.js      # Notification routes
│   ├── ticket.js            # Support ticket routes
│   └── analytics.js         # Analytics routes
├── websocket/
│   └── handler.js           # WebSocket event handlers
├── utils/
│   └── logger.js            # Winston logger configuration
├── logs/                    # Log files directory
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── server.js                # Application entry point
├── README.md                # This file
├── SETUP.md                 # Setup instructions
└── TESTING.md               # API testing guide
```

## 🔑 Key Technologies

- **Express.js**: Web application framework
- **MongoDB & Mongoose**: Database and ODM
- **Socket.IO**: Real-time bidirectional communication
- **Passport.js**: Authentication middleware
- **Google OAuth 2.0**: User authentication
- **Winston**: Logging library
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Geolib**: Geospatial calculations

## 🔐 Security Features

- Helmet.js for security headers
- Session-based authentication with secure cookies
- Domain-restricted OAuth (only @sastra.ac.in)
- Role-based access control
- Input validation
- HTTPS ready (configure reverse proxy)

## 📊 API Endpoints

See [TESTING.md](./TESTING.md) for complete API documentation and testing instructions.

### Main Endpoint Categories:
- `/api/auth` - Authentication endpoints
- `/api/buses` - Bus management and tracking
- `/api/routes` - Route management
- `/api/users` - User management and profiles
- `/api/gps` - GPS data collection and queries
- `/api/notifications` - Push notifications and broadcasts
- `/api/tickets` - Support ticket system
- `/api/analytics` - Analytics & performance reports

### Quick Reference

**Authentication:**
```
POST   /api/auth/login           - User login
POST   /api/auth/logout          - User logout
GET    /api/auth/profile         - Get current user
POST   /api/auth/google/callback - Google OAuth callback
```

**Buses:**
```
GET    /api/buses                - List all buses
POST   /api/buses                - Create bus (Admin)
GET    /api/buses/:id            - Get bus details
PUT    /api/buses/:id            - Update bus (Admin)
DELETE /api/buses/:id            - Delete bus (Admin)
```

**Routes:**
```
GET    /api/routes               - List all routes
POST   /api/routes               - Create route (Admin)
GET    /api/routes/:id           - Get route details
PUT    /api/routes/:id           - Update route (Admin)
```

For complete documentation, refer to [TESTING.md](./TESTING.md)

## 🔌 WebSocket Events

### Client -> Server Events:
- `authenticate`: User authentication
- `subscribe_route`: Subscribe to route updates
- `unsubscribe_route`: Unsubscribe from route
- `subscribe_bus`: Subscribe to specific bus

### Server -> Client Events:
- `authenticated`: Authentication confirmation
- `subscribed`: Subscription confirmation
- `gps_update`: Real-time GPS location update
- `notification`: Push notification broadcast

## 🎯 Hardware Integration

The system receives GPS data from ESP32+GPS+GSM modules via HTTP POST:

```json
POST /api/gps
Content-Type: application/json

{
  "device_id": "TRACKER_001",
  "timestamp": "2024-01-15T10:30:00Z",
  "latitude": 10.7626,
  "longitude": 79.0193,
  "altitude": 45.5,
  "speed": 35.2,
  "satellites": 8,
  "hdop": 1.2
}
```

## 📝 Environment Variables

Key environment variables (see `.env.example` for full list):

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bus-tracker
SESSION_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ALLOWED_DOMAIN=sastra.ac.in
ADMIN_EMAILS=admin1@sastra.ac.in,admin2@sastra.ac.in
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

See [TESTING.md](./TESTING.md) for detailed API testing guide with Postman.

## 📈 Monitoring & Logs

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

Log levels: error, warn, info, http, debug

## 🚀 Deployment

### Using PM2 (Recommended for production):

```bash
npm install -g pm2
pm2 start server.js --name bus-tracker-api
pm2 save
pm2 startup
```

### Using Docker:

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

## 🔄 Version History

- v1.0.0 (2024-01-15) - Initial release
  - Real-time GPS tracking
  - User authentication and authorization
  - Route and bus management
  - Support ticket system
  - Analytics dashboard

---

Built with ❤️ for SASTRA University

## 🔗 Related Documentation

- **Main Project README**: [../README.md](../README.md) - Project overview and quick start
- **Frontend Application**: [../frontend/README.md](../frontend/README.md) - Frontend setup and development guide
- **API Testing Guide**: [TESTING.md](./TESTING.md) - Complete API testing with Postman
- **Setup Instructions**: [SETUP.md](./SETUP.md) - Detailed configuration guide