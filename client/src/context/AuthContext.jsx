import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sharemeal_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          // TODO: implement fetch profile call
          const userData = await authService.getMe();
          setUser(userData.user || null);
        } catch (error) {
          console.error('Failed to load authenticated user:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (credentials) => {
    // TODO: implement login logic
    const data = await authService.login(credentials);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('sharemeal_token', data.token);
      setUser(data.user || null);
    }
    return data;
  };

  const register = async (userData) => {
    // TODO: implement register logic
    return await authService.register(userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sharemeal_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
