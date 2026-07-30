import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Private instance - attaches JWT token
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public instance - no auth headers
const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Auth endpoints (public)
export const registerUser = (data) => publicApi.post("/auth/register/", data);
export const loginUser = (data) => publicApi.post("/auth/login/", data);
export const forgotPassword = (data) => publicApi.post("/auth/forgot-password/", data);
export const resetPassword = (data) => publicApi.post("/auth/reset-password/", data);

// Wallet endpoints (private)
export const getWallet = () => api.get("/auth/wallet/");
export const fundWallet = (data) => api.post("/auth/wallet/fund/", data);
export const verifyFunding = (reference) => api.get(`/auth/wallet/verify/${reference}/`);

// VTU endpoints (private)
export const buyAirtime = (data) => api.post("/vtu/airtime/", data);
export const buyData = (data) => api.post("/vtu/data/", data);
export const getDataBundles = (network) => api.get(`/vtu/data/bundles/${network}/`);
export const getTransactions = () => api.get("/vtu/transactions/");
export const getAirtimeHistory = () => api.get("/vtu/airtime/history/");
export const getDataHistory = () => api.get("/vtu/data/history/");

export default api;
