import React, { createContext, useState, useContext } from 'react';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(true);
  const [gpsUpdates, setGpsUpdates] = useState({});

  const subscribeToRoute = (routeId) => {
    console.log('Subscribed to route:', routeId);
  };

  const unsubscribeFromRoute = (routeId) => {
    console.log('Unsubscribed from route:', routeId);
  };

  const value = {
    connected,
    gpsUpdates,
    subscribeToRoute,
    unsubscribeFromRoute,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export default SocketContext;
