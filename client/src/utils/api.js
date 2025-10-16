import axios from 'axios';

// Create an instance of axios with a base URL
const api = axios.create({
  baseURL: 'http://localhost:5000',
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
    }
  } catch {}
  return config;
});

export default api;