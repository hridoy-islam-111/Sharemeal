import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create configured Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor to attach Authorization JWT token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('sharemeal_token') || localStorage.getItem('sharemeal_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Let axios auto-detect FormData and remove our default Content-Type header
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('sharemeal_token');
      localStorage.removeItem('sharemeal_token');
    }
    return Promise.reject(error);
  }
);

export default api;
