const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const socketIO = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/database');
const logger = require('./utils/logger');
const { setupPassport } = require('./middleware/auth');
const { initializeWebSocket } = require('./websocket/handler');

// Import Routes
const authRoutes = require('./routes/auth');
const busRoutes = require('./routes/bus');
const routeRoutes = require('./routes/route');
const userRoutes = require('./routes/user');
const gpsRoutes = require('./routes/gps');
const notificationRoutes = require('./routes/notification');
const ticketRoutes = require('./routes/ticket');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: [ process.env.CLIENT_REDIRECT_URL || 'http://localhost:5000',],
  credentials: true
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// Passport Configuration
setupPassport(app, passport);

// Initialize WebSocket with CORS for multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5501',
  'http://127.0.0.1:5501',
  'http://sda.arkagme.me',
  process.env.CLIENT_URL
].filter(Boolean);

const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST']
  }
});
initializeWebSocket(io);

// Make io accessible in routes
app.set('io', io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gps', gpsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});