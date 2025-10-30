import { defineStore } from 'pinia';
import api, { setTokenFromStorage } from './services/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null as null | {
      id: number,
      name: string,
      email: string,
      role: string
    },
    loading: false,
    error: null as null | string
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
      setTokenFromStorage();
    },
    setUser(user: any) {
      this.user = user;
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
    },
    setError(message: string) {
      this.error = message;
    },
    clearError() {
      this.error = null;
    },
    async fetchUser() {
      try {
        this.loading = true;
        this.clearError();
        const { data } = await api.get('/api/user');
        this.user = data.user || data;
      } catch (e: any) {
        this.setError(e?.response?.data?.message || 'Error al cargar usuario');
      } finally {
        this.loading = false;
      }
    }
  }
});

// --- Store para proyectos ---
export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as any[],
    loading: false,
    error: null as null | string
  }),
  actions: {
    async fetchProjects() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await import('./services/projects').then(m => m.getProjects());
        this.projects = data.projects || data;
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Error al cargar proyectos';
      } finally {
        this.loading = false;
      }
    }
  }
});

// --- Store para tareas ---
export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as any[],
    loading: false,
    error: null as null | string
  }),
  actions: {
    async fetchTasks(params?: any) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await import('./services/projects').then(m => m.getTasks(params));
        this.tasks = data.tasks || data;
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Error al cargar tareas';
      } finally {
        this.loading = false;
      }
    }
  }
});

// --- Store para usuarios ---
export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as any[],
    loading: false,
    error: null as null | string
  }),
  actions: {
    async fetchUsers(params?: any) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await import('./services/users').then(m => m.getUsers(params));
        this.users = data.users || data;
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Error al cargar usuarios';
      } finally {
        this.loading = false;
      }
    }
  }
});
