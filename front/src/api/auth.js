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

  	getUserProfile: () => apiClient.get('/api/profile', { refresh_token: tokenStorage.getRefresh() }),

	register: async (username, password, confirmPassword) => {
		const { data } = await apiClient.post('/api/register', { username, password, confirmPassword });
		return data;
	},

	updateUser: async (username, password, confirmPassword) => {
		const { data } = await apiClient.post('/api/updateUser', { username, password, confirmPassword, refresh_token: tokenStorage.getRefresh() });
		return data;
	},

	deleteUser: async (username) => {
		await apiClient.post('/api/deleteUser', { username, refresh_token: tokenStorage.getRefresh() });
	},
};