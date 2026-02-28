import apiClient, { tokenStorage } from './client';

export const apiService = {
    getVideos: async () => {
		const data = await apiClient.post('/api/videos', { refresh_token: tokenStorage.getRefresh() })
        .then((res) => {return res.data;});
        return data;
	},

	getGallery: async () => {
		const data = await apiClient.post('/api/gallery', { refresh_token: tokenStorage.getRefresh() })
		.then((res) => {return res.data;});
		return data;
	},

	getVideo: async (slugger) => {
		const data = await apiClient.post('/api/videos/'+slugger, { refresh_token: tokenStorage.getRefresh() })
		.then((res) => {return res.data;});
		return data;
	},

	getGalleryItem: async (slugger) => {
		const data = await apiClient.post('/api/gallery/'+slugger, { refresh_token: tokenStorage.getRefresh() })
		.then((res) => {return res.data;});
		return data;
	},
}