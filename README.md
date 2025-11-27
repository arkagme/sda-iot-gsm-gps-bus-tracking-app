# SASTRA SDA Bus Tracking System

A comprehensive real-time bus tracking platform for SASTRA University's SDA (Student Development Activity) with live GPS tracking, route management, and support services.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Documentation](#documentation)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 📖 Overview

This is a full-stack bus tracking application designed specifically for SASTRA University. It provides students, staff, and administrators with real-time bus tracking, route information, notifications, and a comprehensive support system. The application uses modern web technologies and WebSocket for real-time communication.

### Key Capabilities

- **Real-time GPS Tracking**: Live location updates from ESP32+GPS+GSM hardware
- **Interactive Maps**: View bus locations on interactive maps
- **Route Management**: Manage and view bus routes with detailed stop information
- **Push Notifications**: Receive real-time alerts about delays and cancellations
- **Admin Dashboard**: Comprehensive analytics and management interface
- **Support Tickets**: Users can submit and track support requests
- **Role-Based Access**: Secure access control for users and administrators

## 📁 Project Structure

```
sastra-sda-bus-track-proj/
├── backend/              # Node.js Express REST API
│   ├── config/          # Database configuration
│   ├── middleware/      # Authentication & middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Utilities & helpers
│   ├── websocket/       # WebSocket handlers
│   ├── scripts/         # Seed scripts
│   └── server.js        # Entry point
│
├── frontend/            # React Vite Application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── services/    # API services
│   │   └── utils/       # Utilities
│   ├── public/          # Static assets
│   └── vite.config.js   # Vite configuration
│
└── README.md            # This file
```

## ✨ Features

### Frontend Features

- **Real-Time Bus Tracking** with interactive Leaflet maps
- **Route Information** system with schedules and stops
- **Live Notifications** via WebSocket
- **User Dashboard** with personalized information
- **Admin Analytics Dashboard**
- **Support Ticket Management**
- **Responsive Design** optimized for mobile and desktop
- **Google OAuth Authentication** (SASTRA domain)

### Backend Features

- **RESTful API** with comprehensive endpoints
- **MongoDB** database with Mongoose ODM
- **WebSocket** support via Socket.IO
- **Session-Based Authentication** with Passport.js
- **Role-Based Access Control** (Admin, User)
- **GPS Tracking** and geospatial queries
- **Push Notifications** system
- **Comprehensive Logging** with Winston

## 📦 Prerequisites

### System Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn)
- **MongoDB**: v6.0 or higher

### External Services

- Google Cloud Console account (for OAuth authentication)
- Email service configuration (for notifications)

## 🚀 Installation & Setup

### Quick Start (Run Both Frontend & Backend)

1. **Clone the repository**
   ```bash
   git clone https://github.com/arkagme/sda-bus-tracking-backend.git
   cd sastra-sda-bus-track-proj
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   
   For Backend (`backend/.env`):
   ```bash
   cd ../backend
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/bus-tracker
   PORT=5000
   NODE_ENV=development
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   SESSION_SECRET=your_session_secret
   CORS_ORIGIN=http://localhost:5173
   ```

   For Frontend (`frontend/.env`):
   ```bash
   cd ../frontend
   cat > .env << EOF
   VITE_API_BASE_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   EOF
   ```

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Start the backend**
   ```bash
   cd backend
   npm run dev
   ```

7. **In a new terminal, start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Detailed Setup Guides

For detailed installation and configuration instructions, see:
- **[Backend Setup Guide](./backend/README.md)** - API configuration, database setup, and development guide
- **[Frontend Setup Guide](./frontend/README.md)** - Frontend development, build, and deployment instructions

## 📚 Documentation

### API Documentation

- All API endpoints are documented in the backend README
- Base URL: `http://localhost:5000/api`
- WebSocket URL: `ws://localhost:5000`

### Key Endpoints

```
Authentication:
POST   /api/auth/login          - User login
POST   /api/auth/logout         - User logout
GET    /api/auth/profile        - Get current user profile

Buses:
GET    /api/buses               - Get all buses
POST   /api/buses               - Create new bus (Admin)
GET    /api/buses/:id           - Get bus details
PUT    /api/buses/:id           - Update bus (Admin)

Routes:
GET    /api/routes              - Get all routes
POST   /api/routes              - Create route (Admin)
GET    /api/routes/:id          - Get route details

GPS Data:
GET    /api/gps/latest          - Get latest GPS data
POST   /api/gps                 - Submit GPS data

Tickets:
GET    /api/tickets             - Get user tickets
POST   /api/tickets             - Create ticket
PUT    /api/tickets/:id         - Update ticket (Admin)

Analytics:
GET    /api/analytics/dashboard - Dashboard stats
GET    /api/analytics/performance - Performance metrics
```

## 💻 Development

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Backend: Edit files in `backend/` directory
   - Frontend: Edit files in `frontend/` directory

3. **Test your changes**
   ```bash
   # Backend tests
   cd backend && npm test

   # Frontend linting
   cd frontend && npm run lint
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature/your-feature-name
   ```

### Available Scripts

**Backend:**
```bash
npm run dev       # Start development server with hot reload
npm start         # Start production server
npm test          # Run tests with coverage
npm run seed      # Seed database with sample data
```

**Frontend:**
```bash
npm run dev       # Start development server with hot reload
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

#### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB is accessible on localhost:27017

#### CORS Errors
- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL
- Default: `http://localhost:5173` for development

#### Google OAuth Issues
- Verify Google Client ID and Secret in `.env`
- Add localhost URLs to Google Cloud Console authorized origins
- Ensure user email is whitelisted (SASTRA domain: @sastra.ac.in)

#### Module Not Found
```bash
# Clean install dependencies
cd backend && rm -rf node_modules package-lock.json && npm install
cd ../frontend && rm -rf node_modules package-lock.json && npm install
```

## 📱 Access the Application

### For Users

1. Open http://localhost:5173 in your browser
2. Click "Login with Google"
3. Sign in with your SASTRA account (@sastra.ac.in)
4. View bus locations and routes on the dashboard

### For Administrators

1. Log in with an admin account
2. Navigate to Admin Dashboard
3. Access management features:
   - Bus management
   - Route management
   - User management
   - Analytics dashboard

---

**Last Updated**: November 2025

For more detailed information, please refer to:
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
