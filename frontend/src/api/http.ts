import axios from 'axios';

const API_BASE = 'http://localhost:8888/api';

export const http = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically attach token if present
http.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default http;
