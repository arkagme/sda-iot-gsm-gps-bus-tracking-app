import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Bus as BusIcon, AlertCircle, Navigation, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { MOCK_ROUTES, MOCK_BUSES } from '../data/mockData';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { getSeverityColor } from '../utils/formatters';

const UserDashboard = () => {
  const { user } = useAuth();
  const { notifications } = useNotification();
  const navigate = useNavigate();
  
  const [selectedRoute] = useState(MOCK_ROUTES[0]);
  const [selectedBus] = useState(MOCK_BUSES[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-gray-600">
            Here's your bus tracking information
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Route Info */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Route</p>
                <p className="text-xl font-bold text-gray-900">
                  {selectedRoute.routeNumber}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedRoute.routeName}
                </p>
              </div>
              <MapPin className="w-10 h-10 text-primary-500" />
            </div>
          </Card>

          {/* Bus Number */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Bus Number</p>
                <p className="text-xl font-bold text-gray-900">
                  {selectedBus.busNumber}
                </p>
                <Badge
                  variant={selectedBus.status === 'active' ? 'success' : 'default'}
                  size="sm"
                  className="mt-2"
                >
                  {selectedBus.status}
                </Badge>
              </div>
              <BusIcon className="w-10 h-10 text-primary-500" />
            </div>
          </Card>

          {/* Total Routes */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Routes</p>
                <p className="text-xl font-bold text-gray-900">
                  {MOCK_ROUTES.length}
                </p>
              </div>
              <MapPin className="w-10 h-10 text-green-500" />
            </div>
          </Card>

          {/* Total Buses */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Buses</p>
                <p className="text-xl font-bold text-gray-900">
                  {MOCK_BUSES.filter(b => b.status === 'active').length}
                </p>
              </div>
              <BusIcon className="w-10 h-10 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Route Details */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Route Details</h2>
                <Button onClick={() => navigate('/tracking')} size="sm">
                  <Navigation className="w-4 h-4 mr-2" />
                  Live Tracking
                </Button>
              </div>

              <div className="space-y-6">
                {/* Operating Hours */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Operating Hours
                  </h3>
                  <p className="text-gray-900">
                    {selectedRoute.startTime} - {selectedRoute.endTime}
                  </p>
                </div>

                {/* Operating Days */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Operating Days
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoute.daysOperating.map((day) => (
                      <Badge key={day} variant="primary">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Driver Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Driver Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">{selectedBus.driver.name}</p>
                    <a
                      href={`tel:${selectedBus.driver.phone}`}
                      className="flex items-center text-sm text-primary-600 mt-1 hover:text-primary-700"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      {selectedBus.driver.phone}
                    </a>
                  </div>
                </div>

                {/* Stops */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Bus Stops ({selectedRoute.stops.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                    {selectedRoute.stops
                      .sort((a, b) => a.order - b.order)
                      .map((stop, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center justify-center w-8 h-8 bg-white rounded-full text-sm font-medium text-gray-700">
                              {stop.order}
                            </span>
                            <span className="font-medium text-gray-900">
                              {stop.name}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Notifications */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Recent Alerts
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-4">
                    No alerts at the moment
                  </p>
                ) : (
                  notifications.slice(0, 5).map((notif) => {
                    const severityColor = getSeverityColor(notif.severity);
                    return (
                      <div
                        key={notif._id}
                        className={`p-3 rounded-lg border-l-4 bg-${severityColor}-50 border-${severityColor}-500`}
                      >
                        <h4 className="font-medium text-gray-900 text-sm">
                          {notif.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {notif.message}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/tracking')}
                  variant="primary"
                  className="w-full justify-start"
                >
                  <Navigation className="w-4 h-4 mr-3" />
                  Live Bus Tracking
                </Button>
                <Button
                  onClick={() => navigate('/profile')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <MapPin className="w-4 h-4 mr-3" />
                  View Profile
                </Button>
                <Button
                  onClick={() => navigate('/support')}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <AlertCircle className="w-4 h-4 mr-3" />
                  Get Support
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
