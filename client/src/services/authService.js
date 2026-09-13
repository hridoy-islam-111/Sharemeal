import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (formData) => {
    // If formData is FormData instance, send multipart header
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await api.post('/auth/signup', formData, { headers });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  verifyUser: async (id) => {
    const response = await api.patch(`/auth/verify/${id}`);
    return response.data;
  }
};

export default authService;
