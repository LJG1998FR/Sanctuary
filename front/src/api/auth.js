import apiClient, { tokenStorage } from './client';

export const authApi = {
	login: async (username, password) => {
		const { data } = await apiClient.post('/api/login', { username, password });
		tokenStorage.setTokens(data);
		return data;
	},

	logout: async () => {
		const resp = await apiClient.post('/api/token/invalidate', { refresh_token: tokenStorage.getRefresh() });
		tokenStorage.clear();
	},

  	getUserProfile: () => apiClient.get('/api/profile'),
};