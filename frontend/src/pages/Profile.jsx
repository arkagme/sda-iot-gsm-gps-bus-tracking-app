import React, { useState } from 'react';
import { User as UserIcon, MapPin, History, Mail, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import toast from 'react-hot-toast';
import { userService, ticketService } from '../services';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [routeChangeRequest, setRouteChangeRequest] = useState({
    reason: '',
    requestedRoute: '',
  });

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: UserIcon },
    { id: 'history', label: 'Travel History', icon: History },
    { id: 'route-change', label: 'Route Change', icon: MapPin },
    { id: 'support', label: 'Support', icon: FileText },
  ];

  const handleRouteChangeRequest = async (e) => {
    e.preventDefault();
    
    try {
      const response = await ticketService.createTicket({
        type: 'route_change_request',
        category: 'route_issue',
        subject: 'Route Change Request',
        description: routeChangeRequest.reason,
        requestedRoute: routeChangeRequest.requestedRoute,
        priority: 'medium',
      });

      if (response.success) {
        toast.success('Route change request submitted successfully');
        setRouteChangeRequest({ reason: '', requestedRoute: '' });
      }
    } catch (error) {
      toast.error('Failed to submit request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

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
        {activeTab === 'profile' && (
          <Card>
            <div className="flex items-center space-x-6 mb-6">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Route
                </label>
                <p className="text-gray-900 font-medium">
                  {user?.assignedRoute?.routeName || 'Not Assigned'}
                </p>
                <p className="text-sm text-gray-600">
                  {user?.assignedRoute?.routeNumber || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Stop
                </label>
                <p className="text-gray-900 font-medium">
                  {user?.assignedStop || 'Not Assigned'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <p className="text-gray-900 font-medium capitalize">
                  {user?.role || 'User'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Status
                </label>
                <p className="text-green-600 font-medium">Active</p>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'history' && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Travel History</h2>
            <p className="text-gray-600 text-center py-8">
              No travel history available yet.
            </p>
          </Card>
        )}

        {activeTab === 'route-change' && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Request Route Change
            </h2>
            <p className="text-gray-600 mb-6">
              Submit a request to change your assigned route or stop.
            </p>

            <form onSubmit={handleRouteChangeRequest} className="space-y-4">
              <Input
                label="Requested Route/Stop"
                placeholder="Enter the route or stop you'd like to change to"
                value={routeChangeRequest.requestedRoute}
                onChange={(e) => setRouteChangeRequest({
                  ...routeChangeRequest,
                  requestedRoute: e.target.value
                })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Change <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={routeChangeRequest.reason}
                  onChange={(e) => setRouteChangeRequest({
                    ...routeChangeRequest,
                    reason: e.target.value
                  })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Please explain why you need this route change..."
                  required
                />
              </div>

              <Button type="submit" variant="primary">
                Submit Request
              </Button>
            </form>
          </Card>
        )}

        {activeTab === 'support' && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-6">
              For support and FAQs, please visit our Support page.
            </p>
            <Button onClick={() => window.location.href = '/support'}>
              Go to Support
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
