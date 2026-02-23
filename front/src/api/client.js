import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

// storage keys (for API tokens)
const ACCESS_TOKEN_KEY  = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Helpers

export const tokenStorage = {
    getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY),
    getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
    setAccess: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
    setRefresh: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
    setTokens: ({ token, refresh_token }) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        if (refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    },
    clear: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
};

// Axios Instanciation

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// inject Bearer token 

apiClient.interceptors.request.use(
    (config) => {
        const token = tokenStorage.getAccess();
        console.log(token)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(token)
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// manage expired tokens

let isRefreshing    = false;
let failedQueue     = [];   // queued requests during refresh

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) =>
        error ? reject(error) : resolve(token)
    );
    failedQueue = [];
};

apiClient.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    // if token expired (401) and there is no retry of the original request
    if (error.response?.status === 401 && !originalRequest._retry) {
        const refreshToken = tokenStorage.getRefresh();
        const accessToken = tokenStorage.getAccess();

        // No refresh token → logout
        if (!refreshToken) {
            tokenStorage.clear();
            window.dispatchEvent(new Event('auth:logout'));
            return Promise.reject(error);
        }

        // queue the request if there is another request being refreshed
        if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
        });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/api/token/refresh`,
                { refresh_token: refreshToken, token: accessToken}
            );

            tokenStorage.setTokens(data);
            processQueue(null, data.token);

            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            return apiClient(originalRequest);

        } catch (refreshError) {
            processQueue(refreshError, null);
            tokenStorage.clear();
            window.dispatchEvent(new Event('auth:logout'));
            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }

    return Promise.reject(error);
});

export default apiClient;