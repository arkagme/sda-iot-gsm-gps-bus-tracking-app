# SASTRA SDA Bus Tracking System - Frontend

A modern, feature-rich web application for real-time bus tracking, route management, and support ticket handling built with React and Vite.

## 🚀 Features

### User Features
- **Real-Time Bus Tracking**: Live GPS tracking of buses on interactive maps using Leaflet
- **Route Information**: View detailed information about bus routes, schedules, and stops
- **Live Notifications**: Receive real-time updates about bus delays, cancellations, and route changes via WebSocket
- **User Dashboard**: Personalized dashboard showing current route information, bus status, and active notifications
- **User Profile**: Manage user profile and preferences
- **Support System**: Create and track support tickets for issues and inquiries

### Admin Features
- **Analytics Dashboard**: Comprehensive analytics including bus utilization, route performance, and user statistics
- **Bus Management**: Manage bus fleet, track bus status, and monitor GPS locations
- **Route Management**: Create, update, and manage bus routes
- **User Management**: View and manage system users
- **Notification Management**: Send targeted notifications to users and specific routes
- **Support Ticket Management**: Handle and resolve user support tickets

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router DOM 7.9
- **HTTP Client**: Axios 1.13
- **Real-Time Communication**: Socket.IO Client 4.8
- **Maps**: Leaflet 1.9 & React-Leaflet 5.0
- **Charts**: Chart.js 4.5 & React-ChartJS-2 5.3
- **UI Components**: Lucide React (icons) & React Hot Toast (notifications)
- **Date Handling**: date-fns 4.1
- **Linting**: ESLint 9.39
- **PostCSS**: Autoprefixer 10.4

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🚀 Getting Started

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/arkagme/sda-bus-tracking-backend.git
cd sastra-sda-bus-track-proj/frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the frontend root directory:

```bash
# Create the file
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
EOF
```

**Environment Variables:**
- `VITE_API_BASE_URL`: Backend API base URL (default: `http://localhost:5000`)
- `VITE_SOCKET_URL`: WebSocket server URL (default: `http://localhost:5000`)

**For different environments:**

**Development:**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

**Production:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_SOCKET_URL=https://api.yourdomain.com
```

### Development

Start the development server with hot reload:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

**Features in development mode:**
- Fast Refresh for instant updates
- Source maps for debugging
- Console warnings for best practices

### Build

Create an optimized production build:
```bash
npm run build
```

Output will be in the `dist/` directory

### Preview

Preview the production build locally:
```bash
npm run preview
```

### Linting

Check code quality with ESLint:
```bash
npm run lint
```

Fix linting issues automatically:
```bash
npm run lint -- --fix
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common UI components (Button, Input, Modal, etc.)
│   ├── layout/         # Layout components (Navbar, SplashScreen)
│   └── map/            # Map components
├── contexts/           # React Context providers
│   ├── AuthContext     # Authentication state management
│   ├── NotificationContext # Real-time notifications
│   └── SocketContext   # WebSocket connection management
├── pages/              # Page components
│   ├── Login           # Login page
│   ├── UserDashboard   # User dashboard
│   ├── LiveTracking    # Live bus tracking page
│   ├── AdminDashboard  # Admin dashboard
│   ├── Profile         # User profile page
│   ├── Support         # Support/tickets page
│   └── NotFound        # 404 page
├── services/           # API and service layer
│   ├── api.js         # Axios instance and interceptors
│   ├── socket.service.js # WebSocket service
│   └── index.js       # Exported services
├── utils/              # Utility functions and constants
│   ├── constants.js    # API endpoints, routes, user roles
│   └── formatters.js   # Data formatting utilities
├── App.jsx             # Main app component with routing
└── main.jsx            # Entry point
```

## 🔐 Authentication

The application uses Google OAuth with domain restriction:

- **Authentication Provider**: Google OAuth 2.0
- **Allowed Domain**: @sastra.ac.in
- **User Types**: 
  - Regular User: Can track buses and manage tickets
  - Admin User: Access to admin dashboard and management features

### Login Flow

1. User clicks "Login with Google"
2. Redirected to Google authentication
3. User logs in with @sastra.ac.in account
4. Backend verifies domain restriction
5. User redirected to appropriate dashboard

Protected routes are enforced via the `ProtectedRoute` component.

## 🌐 API Integration

The application connects to the backend API for all operations:

### API Service Configuration

The API service is configured in `src/services/api.js`:
- Uses Axios for HTTP requests
- Automatically includes authentication tokens
- Handles request/response interceptors
- Centralizes error handling

### Connecting to Backend

Ensure the backend is running before starting the frontend:

```bash
# Terminal 1: Start backend
cd backend
npm run dev
# Backend runs on http://localhost:5000

# Terminal 2: Start frontend
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### API Base URL

The API base URL is read from the environment variable `VITE_API_BASE_URL`:
- **Development**: `http://localhost:5000`
- **Production**: Your API domain

Update `.env.local` to match your backend URL.

## 🔔 Real-Time Features

The application uses WebSocket (Socket.IO) for real-time communication:

- Live bus location updates
- Real-time notifications (delays, cancellations, route changes)
- Live ticket status updates
- Admin notifications broadcast

## 🎨 UI Components

Reusable components available in `src/components/common/`:

- **Button**: Customizable action button
- **Card**: Container for content sections
- **Input**: Text input field
- **Select**: Dropdown selection
- **Badge**: Status and category badges
- **Modal**: Dialog component
- **LoadingSpinner**: Loading indicator

## 📊 State Management

- **AuthContext**: Manages user authentication and role-based access
- **NotificationContext**: Handles in-app notifications
- **SocketContext**: Manages WebSocket connections and real-time data

## 🎯 Key Pages

### User Pages
- **Login**: Role selection and authentication
- **Dashboard**: Overview of routes and notifications
- **Live Tracking**: Real-time bus tracking with map
- **Profile**: User information and settings
- **Support**: Create and view support tickets

### Admin Pages
- **Analytics**: System statistics and performance metrics
- **Bus Management**: View and manage bus fleet
- **Route Management**: Create and manage routes
- **User Management**: View system users
- **Notifications**: Send targeted notifications
- **Support Tickets**: Manage user tickets

## 🚨 Error Handling

- API errors are caught and displayed via toast notifications
- Protected routes redirect unauthorized users to login
- 404 page for undefined routes
- Request/response interceptors handle common error scenarios

## 📝 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Environment-Specific Configurations

**Development (.env.local):**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

**Staging (.env.staging):**
```env
VITE_API_BASE_URL=https://staging-api.yourdomain.com
VITE_SOCKET_URL=https://staging-api.yourdomain.com
```

**Production (.env.production):**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_SOCKET_URL=https://api.yourdomain.com
```

To use different environment files, update `vite.config.js` accordingly.

## 🤝 Contributing

When contributing to this project, please ensure:

1. Code follows the ESLint configuration
2. Components are placed in appropriate directories
3. New pages are added to the routing configuration in `App.jsx`
4. API calls are made through the centralized API service
5. State management uses provided contexts

## 📊 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to a Web Server

The `dist/` directory contains the production build:

**Using a static server:**
```bash
# Preview the build
npm run preview

# Or serve the dist folder with any HTTP server
npx serve dist
```

**Using Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Using Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Using Docker:**
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🐛 Troubleshooting

### Development Server Won't Start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite

# Try again
npm run dev
```

### API Requests Failing

1. **Check backend is running:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Verify environment variables:**
   ```bash
   cat .env.local
   # Should show correct VITE_API_BASE_URL
   ```

3. **Check browser console for CORS errors**

4. **Verify backend CORS configuration**

### Build Fails

```bash
# Clear build cache
rm -rf dist

# Rebuild
npm run build

# Check for linting errors
npm run lint
```

### Socket Connection Issues

1. Ensure WebSocket URL matches backend WebSocket server
2. Check firewall/network settings
3. Verify backend is running on correct port
4. Check browser console for connection errors

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)
- [Leaflet Documentation](https://leafletjs.com/)

## 📄 License

This project is licensed under the MIT License.

## 📞 Support & Documentation

For issues and support, refer to:
- **Main Project README**: [../README.md](../README.md) - Complete project overview
- **Backend Documentation**: [../backend/README.md](../backend/README.md) - Backend setup and API details
- **GitHub Issues**: Report bugs and feature requests
- **Support Tickets**: Use the in-app support system

---

Built with ❤️ for SASTRA University
