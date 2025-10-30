import api from './auth';

export const getUsers = (params?: any) => api.get('/api/users', { params });
export const getUser = (id: number) => api.get(`/api/users/${id}`);
