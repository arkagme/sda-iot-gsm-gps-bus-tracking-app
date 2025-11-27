import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SplashScreen from './components/layout/SplashScreen';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import LiveTracking from './pages/LiveTracking';
import Profile from './pages/Profile';
import Support from './pages/Support';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (!hasSeenSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
      }, 2500);
      
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/tracking"
                element={
                  <ProtectedRoute>
                    <LiveTracking />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/support"
                element={
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Router>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
