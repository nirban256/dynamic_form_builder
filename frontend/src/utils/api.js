import axios from 'axios';

// Get the backend URL from environment variables.
// Use a fallback for local development if the variable is not set.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a new Axios instance with a base URL.
// This means you don't have to type the full URL for every request.
const api = axios.create({
    baseURL: `${API_URL}/api`,
});

// Use an interceptor to automatically add the auth token to every request.
// This is a powerful feature that keeps your component code clean.
api.interceptors.request.use(
    (config) => {
        // 1. Get the token from local storage.
        const token = localStorage.getItem('authToken');

        // 2. If the token exists, add it to the Authorization header.
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // 3. Return the modified config to be sent.
        return config;
    },
    (error) => {
        // Handle any errors that occur during the request setup.
        return Promise.reject(error);
    }
);

// Export the configured Axios instance as the default export.
export default api;