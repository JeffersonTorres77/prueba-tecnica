import api from './auth';

// Proyectos
export const getProjects = () => api.get('/api/projects');
export const getProject = (id: number) => api.get(`/api/projects/${id}`);
export const createProject = (payload: any) => api.post('/api/projects', payload);
export const updateProject = (id: number, payload: any) => api.put(`/api/projects/${id}`, payload);
export const deleteProject = (id: number) => api.delete(`/api/projects/${id}`);

// Tareas
export const getTasks = (params?: any) => api.get('/api/tasks', { params });
export const getTask = (id: number) => api.get(`/api/tasks/${id}`);
export const createTask = (payload: any) => api.post('/api/tasks', payload);
export const updateTask = (id: number, payload: any) => api.put(`/api/tasks/${id}`, payload);
export const deleteTask = (id: number) => api.delete(`/api/tasks/${id}`);
