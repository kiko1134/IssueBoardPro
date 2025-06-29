import axios from 'axios';

const API_BASE = 'http://localhost:8888/api';

export const http = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials:true
});

export default http;
