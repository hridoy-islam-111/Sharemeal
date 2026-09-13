import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (formData) => {
    // FormData is automatically handled by the axios interceptor
    const response = await api.post('/auth/signup', formData);
    return response.data;
  },

  googleLogin: async (idToken, role = 'donor') => {
    const response = await api.post('/auth/google', { token: idToken, role });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (formData) => {
    // FormData is automatically handled by the axios interceptor
    const response = await api.put('/auth/profile', formData);
    return response.data;
  },

  verifyUser: async (id) => {
    const response = await api.patch(`/auth/verify/${id}`);
    return response.data;
  }
};

export default authService;
