import React, { useState } from 'react';
import { HelpCircle, MessageSquare, FileText, ChevronDown } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import toast from 'react-hot-toast';
import { ticketService } from '../services';

const Support = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    type: 'general_query',
    priority: 'medium',
  });
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: 'How do I track my bus in real-time?',
      answer: 'Navigate to the "Live Tracking" page from the main dashboard. You will see a map showing your bus\'s current location and estimated arrival time at your stop.',
    },
    {
      question: 'What should I do if my bus is delayed?',
      answer: 'Check the notifications panel for any delay alerts. Admins will post updates about delays. You can also view the live tracking to see the current bus location.',
    },
    {
      question: 'How can I change my assigned route or stop?',
      answer: 'Go to your Profile page and select the "Route Change" tab. Fill out the form explaining why you need the change, and submit it. An administrator will review your request.',
    },
    {
      question: 'I\'m not receiving notifications. What should I do?',
      answer: 'Check your browser notification permissions. Make sure you have allowed notifications for this website. Contact support if the issue persists.',
    },
    {
      question: 'Who can I contact for emergency situations?',
      answer: 'For emergencies, contact the bus driver directly (phone number available on dashboard) or submit an urgent support ticket through the "Report Issue" tab.',
    },
  ];

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await ticketService.createTicket({
        ...ticketForm,
        category: 'general',
      });

      if (response.success) {
        toast.success('Support ticket submitted successfully');
        setTicketForm({
          subject: '',
          description: '',
          type: 'general_query',
          priority: 'medium',
        });
      }
    } catch (error) {
      toast.error('Failed to submit ticket');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Support Center</h1>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {[
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'ticket', label: 'Report Issue', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
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

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 text-left">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedFaq === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Report Issue Tab */}
        {activeTab === 'ticket' && (
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Report an Issue
            </h2>
            <p className="text-gray-600 mb-6">
              Submit a support ticket and our team will get back to you as soon as possible.
            </p>

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <Select
                label="Issue Type"
                value={ticketForm.type}
                onChange={(e) => setTicketForm({ ...ticketForm, type: e.target.value })}
                options={[
                  { value: 'general_query', label: 'General Query' },
                  { value: 'issue_report', label: 'Bug/Issue Report' },
                  { value: 'route_change_request', label: 'Route Change Request' },
                  { value: 'feedback', label: 'Feedback' },
                ]}
                required
              />

              <Select
                label="Priority"
                value={ticketForm.priority}
                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' },
                ]}
                required
              />

              <Input
                label="Subject"
                placeholder="Brief description of your issue"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Please describe your issue in detail..."
                  required
                />
              </div>

              <Button type="submit" variant="primary" className="w-full sm:w-auto">
                Submit Ticket
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Support;
