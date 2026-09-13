import api from './api';

export const foodPostService = {
  getAllPosts: async (params) => {
    const response = await api.get('/food-posts', { params });
    return response.data;
  },

  getNearbyPosts: async ({ latitude, longitude, radius = 5000 }) => {
    // Validate coordinates before sending to API
    const lat = Number(latitude);
    const lon = Number(longitude);
    const rad = Number(radius);
    
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      throw new Error('Invalid latitude. Must be between -90 and 90.');
    }
    if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
      throw new Error('Invalid longitude. Must be between -180 and 180.');
    }
    if (!Number.isFinite(rad) || rad <= 0) {
      throw new Error('Invalid radius. Must be a positive number.');
    }
    
    // The API attaches the JWT through the shared Axios interceptor.
    const response = await api.get('/food-posts/nearby', {
      params: { latitude: lat, longitude: lon, radius: rad }
    });
    return response.data;
  },

  getPostById: async (id) => {
    const response = await api.get(`/food-posts/${id}`);
    return response.data;
  },

  getMyDonations: async () => {
    const response = await api.get('/food-posts/my-donations');
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/food-posts', postData);
    return response.data;
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/food-posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/food-posts/${id}`);
    return response.data;
  }
};

export default foodPostService;
