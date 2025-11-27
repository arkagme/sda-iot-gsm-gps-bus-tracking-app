import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { MOCK_ROUTES, MOCK_BUSES, MOCK_GPS_HISTORY, SASTRA_LOCATION } from '../data/mockData';
import Navbar from '../components/layout/Navbar';
import BusMap from '../components/map/BusMap';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { formatSpeed, formatTimeAgo } from '../utils/formatters';
import { MapPin, Activity, Wifi } from 'lucide-react';

const LiveTracking = () => {
  const { connected } = useSocket();
  const [selectedRoute] = useState(MOCK_ROUTES[0]);
  const [selectedBus] = useState(MOCK_BUSES[0]);

  const busLocation = {
    latitude: SASTRA_LOCATION.latitude,
    longitude: SASTRA_LOCATION.longitude,
    speed: 25,
    timestamp: new Date().toISOString()
  };

  const gpsHistory = MOCK_GPS_HISTORY.map(point => ({
    location: {
      coordinates: point.location.coordinates
    },
    speed: point.speed,
    timestamp: point.timestamp
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Live Bus Tracking</h1>
          <Badge variant="success" className="flex items-center">
            <Wifi className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card padding={false}>
              <BusMap
                route={selectedRoute}
                busLocation={busLocation}
                gpsHistory={gpsHistory}
                height="600px"
                showControls
              />
            </Card>
            
            {/* GPS History Info */}
            <Card className="mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">GPS Data Points</h3>
                  <p className="text-sm text-gray-600">
                    Showing {gpsHistory.length} historical locations
                  </p>
                </div>
                <Badge variant="info">{gpsHistory.length} points</Badge>
              </div>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Bus Status */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Bus Status</h3>
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Speed</span>
                  <span className="font-medium">{formatSpeed(busLocation.speed)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Update</span>
                  <span className="font-medium text-xs">{formatTimeAgo(busLocation.timestamp)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bus Number</span>
                  <span className="font-medium">{selectedBus.busNumber}</span>
                </div>
              </div>
            </Card>

            {/* Location Info */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Current Location</h3>
                <MapPin className="w-5 h-5 text-primary-500" />
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Latitude</span>
                  <p className="font-medium font-mono">{busLocation.latitude}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Longitude</span>
                  <p className="font-medium font-mono">{busLocation.longitude}</p>
                </div>
              </div>
            </Card>

            {/* Route Info */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Route Details</h3>
                <MapPin className="w-5 h-5 text-primary-500" />
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Route</span>
                  <p className="font-medium">{selectedRoute.routeName}</p>
                  <p className="text-xs text-gray-500">{selectedRoute.routeNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Total Stops</span>
                  <p className="font-medium">{selectedRoute.stops.length}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Operating Hours</span>
                  <p className="font-medium">{selectedRoute.startTime} - {selectedRoute.endTime}</p>
                </div>
              </div>
            </Card>

            {/* Connection Info */}
            <Card>
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Real-time tracking:</strong> Active
                </p>
                <p className="text-xs text-gray-500">
                  The map updates automatically when new GPS data is available.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
