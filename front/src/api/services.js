import apiClient, { tokenStorage } from './client';

export const apiService = {
    getVideos: async (options) => {
		const data = await apiClient.post('/api/videos', { ...options , refresh_token: tokenStorage.getRefresh() })
        .then((res) => {return res.data;});
        return data;
	},

	getVideo: async (slugger) => {
		const data = await apiClient.post('/api/videos/'+slugger, { refresh_token: tokenStorage.getRefresh() })
		.then((res) => {return res.data;});
		return data;
	},

	getGallery: async (options) => {
		const data = await apiClient.post('/api/gallery', { ...options ,refresh_token: tokenStorage.getRefresh() })
		.then((res) => {return res.data;});
		return data;
	},

	getGalleryItem: async (slugger) => {
		const data = await apiClient.post('/api/gallery/'+slugger, { refresh_token: tokenStorage.getRefresh() })
		.then((res) => {return res.data;});
		return data;
	},

	getTags: async (options) => {
		const data = await apiClient.post('/api/tags', { ...options , refresh_token: tokenStorage.getRefresh() })
        .then((res) => {return res.data;});
        return data;
	},

	getTag: async (slugger) => {
		const data = await apiClient.post('/api/tags/'+slugger, { refresh_token: tokenStorage.getRefresh() })
		.then((res) => {return res.data;});
		return data;
	},

	getRandomGalleryItem: async () => {
		const data = await apiClient.post('/api/randomcollection', { refresh_token: tokenStorage.getRefresh() })
		.then((res) => {return res.data;});
		return data;
	},

	getRandomTag: async () => {
		const data = await apiClient.post('/api/randomtag', { refresh_token: tokenStorage.getRefresh() })
		.then((res) => {return res.data;});
		return data;
	},

	getRandomVideo: async () => {
		const data = await apiClient.post('/api/randomvideo', { refresh_token: tokenStorage.getRefresh() })
		.then((res) => {return res.data;});
		return data;
	},

	getRandomPhoto: async () => {
		const data = await apiClient.post('/api/randomphoto', { refresh_token: tokenStorage.getRefresh() })
		.then((res) => {return res.data;});
		return data;
	},

	getMemoryPhotos: async (nbpairs) => {
		const data = await apiClient.post('/api/randomphotos', { refresh_token: tokenStorage.getRefresh(), limit: nbpairs})
		.then((res) => {return res.data;});
		return data;
	},

	getPreloadAssets: async () => {
		const data = await apiClient.post('/api/preloadAssets')
        .then((res) => {return res.data;});
        return data;
	}
}