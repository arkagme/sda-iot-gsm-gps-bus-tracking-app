import React, { createContext, useState, useContext } from 'react';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = (role = 'user') => {
    const selectedUser = role === 'admin' ? MOCK_USERS.admin : MOCK_USERS.student;
    setUser(selectedUser);
    setAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setAuthenticated(false);
    window.location.href = '/login';
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    authenticated,
    login,
    logout,
    isAdmin,
    refreshUser: () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
