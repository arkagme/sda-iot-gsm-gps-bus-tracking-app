import React, { useState, useEffect } from 'react';
import { Bus, Route, Users, BarChart3, Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import { analyticsService, busService, routeService, userService, ticketService, notificationService } from '../services';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';
import { formatDate, formatTime } from '../utils/formatters';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'general',
    severity: 'medium',
    routes: [],
    targetAudience: 'all',
  });

  const tabs = [
    { id:'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'buses', label: 'Buses', icon: Bus },
    { id: 'routes', label: 'Routes', icon: Route },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'tickets', label: 'Support Tickets', icon: MessageSquare },
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'analytics') {
        const statsRes = await analyticsService.getOverview();
        if (statsRes.success) setStats(statsRes.data);
      } else if (activeTab === 'buses') {
        const busRes = await busService.getAllBuses();
        if (busRes.success) setBuses(busRes.data);
      } else if (activeTab === 'routes') {
        const routeRes = await routeService.getAllRoutes();
        if (routeRes.success) setRoutes(routeRes.data);
      } else if (activeTab === 'users') {
        const userRes = await userService.getAllUsers();
        if (userRes.success) setUsers(userRes.data);
      } else if (activeTab === 'tickets') {
        const ticketRes = await ticketService.getTickets();
        if (ticketRes.success) setTickets(ticketRes.data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      const response = await notificationService.createNotification(notificationForm);
      if (response.success) {
        toast.success('Notification sent successfully');
        setShowNotificationModal(false);
        setNotificationForm({
          title: '',
          message: '',
          type: 'general',
          severity: 'medium',
          routes: [],
          targetAudience: 'all',
        });
      }
    } catch (error) {
      toast.error('Failed to create notification');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          {activeTab === 'notifications' && (
            <Button onClick={() => setShowNotificationModal(true)}>
              <Bell className="w-4 h-4 mr-2" />
              Create Alert
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading..." />
          </div>
        ) : (
          <div>
            {/* Analytics */}
            {activeTab === 'analytics' && stats && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Trips</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.trips?.total || 0}
                        </p>
                      </div>
                      <Bus className="w-10 h-10 text-primary-500" />
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Completion Rate</p>
                        <p className="text-2xl font-bold text-green-600">
                          {stats.trips?.completionRate || 0}%
                        </p>
                      </div>
                      <BarChart3 className="w-10 h-10 text-green-500" />
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Punctuality Score</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {stats.averages?.punctualityScore || 0}%
                        </p>
                      </div>
                      <BarChart3 className="w-10 h-10 text-blue-500" />
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Buses</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.fleet?.activeBuses || 0}
                        </p>
                      </div>
                      <Bus className="w-10 h-10 text-orange-500" />
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Buses */}
            {activeTab === 'buses' && (
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">All Buses</h2>
                {buses.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No buses found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bus Number
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Route
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Driver
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Capacity
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {buses.map((bus) => (
                          <tr key={bus._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{bus.busNumber}</div>
                              <div className="text-sm text-gray-500">{bus.registrationNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {bus.route?.routeName || 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{bus.driver?.name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{bus.driver?.phone || ''}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={bus.status === 'active' ? 'success' : 'default'}>
                                {bus.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {bus.capacity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}

            {/* Routes */}
            {activeTab === 'routes' && (
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">All Routes</h2>
                {routes.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No routes found</p>
                ) : (
                  <div className="space-y-4">
                    {routes.map((route) => (
                      <div key={route._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{route.routeName}</h3>
                            <p className="text-sm text-gray-600">Route #{route.routeNumber}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {route.stops?.length || 0} stops • {route.startTime} - {route.endTime}
                            </p>
                          </div>
                          <Badge variant={route.isActive ? 'success' : 'default'}>
                            {route.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">All Users</h2>
                {users.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No users found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assigned Route
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{user.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {user.assignedRoute?.routeName || 'Not Assigned'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}

            {/* Tickets */}
            {activeTab === 'tickets' && (
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Support Tickets</h2>
                {tickets.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No tickets found</p>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant={
                                ticket.status === 'open' ? 'info' :
                                ticket.status === 'resolved' ? 'success' : 'default'
                              }>
                                {ticket.status}
                              </Badge>
                              <Badge color={
                                ticket.priority === 'urgent' || ticket.priority === 'high' ? 'red' :
                                ticket.priority === 'medium' ? 'yellow' : 'blue'
                              }>
                                {ticket.priority}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ticket.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              By {ticket.user?.name} • {formatDate(ticket.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications Management</h2>
                <p className="text-gray-600">
                  Create and manage notifications to send alerts to users about delays, route changes, or general announcements.
                </p>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Notification Modal */}
      <Modal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        title="Create Notification"
        size="lg"
      >
        <form onSubmit={handleCreateNotification} className="space-y-4">
          <Input
            label="Title"
            placeholder="Notification title"
            value={notificationForm.title}
            onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={notificationForm.message}
              onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Notification message..."
              required
            />
          </div>

          <Select
            label="Type"
            value={notificationForm.type}
            onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })}
            options={[
              { value: 'general', label: 'General' },
              { value: 'delay', label: 'Delay' },
              { value: 'cancellation', label: 'Cancellation' },
              { value: 'route_change', label: 'Route Change' },
            ]}
            required
          />

          <Select
            label="Severity"
            value={notificationForm.severity}
            onChange={(e) => setNotificationForm({ ...notificationForm, severity: e.target.value })}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
            required
          />

          <Select
            label="Target Audience"
            value={notificationForm.targetAudience}
            onChange={(e) => setNotificationForm({ ...notificationForm, targetAudience: e.target.value })}
            options={[
              { value: 'all', label: 'All Users' },
              { value: 'route_specific', label: 'Specific Routes' },
            ]}
            required
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowNotificationModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Notification
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
