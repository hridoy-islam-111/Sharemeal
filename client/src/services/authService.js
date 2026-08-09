import api from './api';

export const authService = {
  login: async (credentials) => {
    // TODO: implement API call
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    // TODO: implement API call
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getMe: async () => {
    // TODO: implement API call
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    // TODO: implement API call
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  }
};

export default authService;
