import apiClient, { tokenStorage } from './client';

export const authApi = {
  login: async (username, password) => {
    const { data } = await apiClient.post('/api/login', { username, password });
    tokenStorage.setTokens(data);
    return data;
  },

  logout: () => {
    tokenStorage.clear();
  },

  getUserProfile: () => apiClient.get('/api/profile'),
};