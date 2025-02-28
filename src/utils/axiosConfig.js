import axios from 'axios';
import { isTokenExpired, handleLogout } from './auth';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3002'
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await handleLogout();
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 