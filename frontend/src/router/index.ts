import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Dashboard from '../components/Dashboard.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/proyectos/:id', component: () => import('../components/ProjectDetail.vue'), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const token = localStorage.getItem('token');
  if ((to.meta as any).requiresAuth && !token) {
    return next('/login');
  }
  if ((to.path === '/login' || to.path === '/register') && token) {
    return next('/dashboard');
  }
  next();
});

export default router;
