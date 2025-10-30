import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true
});

export const register = async (payload: any) => {
  const { data } = await api.post('/api/register', payload);
  if (data.token) {
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  }
  return data;
};

export const login = async (payload: any) => {
  const { data } = await api.post('/api/login', payload);
  if (data.token) {
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  }
  return data;
};

export const logout = async () => {
  await api.post('/api/logout');
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

export const setTokenFromStorage = () => {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export default api;
