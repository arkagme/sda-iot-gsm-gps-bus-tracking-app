import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, User, Shield, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (role) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding & Features */}
          <div className="text-white space-y-8 animate-slide-up">
            <div>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mb-6 shadow-glow">
                <Bus className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-shadow-lg">
                SASTRA
                <br />
                <span className="text-yellow-300">Bus Tracker</span>
              </h1>
              <p className="text-xl text-blue-100 font-light">
                Track your university bus in real-time with precision and ease
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              {[
                { icon: MapPin, title: 'Live Tracking', desc: 'Real-time bus location on interactive maps' },
                { icon: Clock, title: 'Accurate ETA', desc: 'Know exactly when your bus will arrive' },
                { icon: Shield, title: 'Secure Access', desc: 'Protected with university authentication' },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 animate-slide-up"
                  style={{animationDelay: `${idx * 0.1}s`}}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-400/30 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-sm text-blue-100">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="animate-scale-in">
            <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Welcome Back
                </h2>
                <p className="text-gray-600">
                  Select your role to continue
                </p>
              </div>

              <div className="space-y-4">
                {/* User Login */}
                <button
                  onClick={() => handleLogin('user')}
                  className="w-full group relative overflow-hidden bg-white border-2 border-blue-200 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 hover:shadow-glow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        Continue as Student
                      </h3>
                      <p className="text-sm text-gray-600">
                        Access tracking and your profile
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {/* Admin Login */}
                <button
                  onClick={() => handleLogin('admin')}
                  className="w-full group relative overflow-hidden bg-white border-2 border-purple-200 hover:border-purple-500 rounded-2xl p-6 transition-all duration-300 hover:shadow-glow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        Continue as Administrator
                      </h3>
                      <p className="text-sm text-gray-600">
                        Access admin dashboard and controls
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-50 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-500">
                  By continuing, you agree to our Terms of Service
                </p>
              </div>
            </div>

            {/* Extra Info */}
            <div className="mt-6 text-center">
              <p className="text-white text-sm">
                Need help? Contact{' '}
                <a href="mailto:support@sastra.ac.in" className="font-semibold hover:text-yellow-300 transition-colors">
                  support@sastra.ac.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-center text-white/70 text-sm z-20">
        © 2024 SASTRA University. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
