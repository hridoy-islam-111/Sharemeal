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
    const data = await authService.login(credentials);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('sharemeal_token', data.token);
      setUser(data.user || null);
    }
    return data;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('sharemeal_token', data.token);
      setUser(data.user || null);
    }
    return data;
  };

  const googleLogin = async (idToken, role) => {
    const data = await authService.googleLogin(idToken, role);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('sharemeal_token', data.token);
      setUser(data.user || null);
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sharemeal_token');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : updatedData));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout, updateUser }}>
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
