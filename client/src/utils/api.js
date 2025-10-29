import axios from 'axios';

// Create an instance of axios with a base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach auth token automatically from storage for every request
api.interceptors.request.use((config) => {
  try {
    const token =
      (typeof window !== 'undefined') && (localStorage.getItem('token') || sessionStorage.getItem('token'));
    if (token) {
      config.headers['x-auth-token'] = token;
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export default api;
export const withAdminAuth = (config = {}) => {
  const token = (typeof window !== 'undefined') && (localStorage.getItem('token') || sessionStorage.getItem('token'));
  return {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...(config.headers || {}),
      ...(token ? { 'x-auth-token': token, Authorization: `Bearer ${token}` } : {}),
    },
    baseURL: api.defaults.baseURL,
  };
};