import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

let accessToken = null;
export const setAccessToken = (t) => { accessToken = t; };

api.interceptors.request.use((cfg) => {
  if (accessToken) cfg.headers.Authorization = `Bearer ${accessToken}`;
  return cfg;
});

let refreshing = null;
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry && !orig.url.includes('/auth/')) {
      orig._retry = true;
      try {
        refreshing = refreshing || api.post('/auth/refresh');
        const { data } = await refreshing;
        refreshing = null;
        setAccessToken(data.accessToken);
        orig.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(orig);
      } catch (e) {
        refreshing = null;
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
