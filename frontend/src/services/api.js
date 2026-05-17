import axios from 'axios';

const BASE_URL = 'https://vtu-app-production.up.railway.app/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth endpoints
export const registerUser = (data) => api.post('/auth/register/', data);
export const loginUser = (data) => api.post('/auth/login/', data);
export const getWallet = () => api.get('/auth/wallet/');
export const fundWallet = (data) => api.post('/auth/wallet/fund/', data);
export const verifyFunding = (reference) => api.get(`/auth/wallet/verify/${reference}/`);

// VTU endpoints
export const buyAirtime = (data) => api.post('/vtu/airtime/', data);
export const buyData = (data) => api.post('/vtu/data/', data);
export const getDataBundles = (network) => api.get(`/vtu/data/bundles/${network}/`);
export const getTransactions = () => api.get('/vtu/transactions/');
export const getAirtimeHistory = () => api.get('/vtu/airtime/history/');
export const getDataHistory = () => api.get('/vtu/data/history/');

export default api;