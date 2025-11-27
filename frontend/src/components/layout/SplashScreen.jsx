import React, { useEffect, useState } from 'react';
import { Bus } from 'lucide-react';

const SplashScreen = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center animate-fade-in">
        <div className="mb-6">
          <Bus className="w-24 h-24 text-white mx-auto animate-pulse-slow" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          {import.meta.env.VITE_APP_NAME || 'SASTRA Bus Tracker'}
        </h1>
        <p className="text-primary-100 text-lg">Track your bus in real-time</p>
        <div className="mt-8">
          <div className="inline-block">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
