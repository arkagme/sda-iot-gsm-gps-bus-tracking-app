import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { refreshUser, authenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const handleCallback = async () => {
      console.log('Auth callback triggered');
      
      // Wait a bit for cookie to be set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to refresh user data
      await refreshUser();
      
      // Check if authenticated after a short delay
      setTimeout(() => {
        if (!authenticated && retryCount < 3) {
          console.log(`Retry ${retryCount + 1}: User not authenticated yet, refreshing...`);
          setRetryCount(prev => prev + 1);
          refreshUser();
        }
      }, 1000);
    };

    handleCallback();
  }, [retryCount]);

  // Redirect when authenticated
  useEffect(() => {
    if (authenticated) {
      console.log('User authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [authenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-white text-lg">Completing sign in...</p>
        {retryCount > 0 && (
          <p className="mt-2 text-blue-200 text-sm">Verifying authentication...</p>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
