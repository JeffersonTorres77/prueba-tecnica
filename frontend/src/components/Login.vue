<template>
  <div class="container">
    <h2>Login</h2>
    <form @submit.prevent="onSubmit">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    <p v-if="store.error" style="color:red">{{ store.error }}</p>
    <p>¿No tienes cuenta? <router-link to="/register">Regístrate</router-link></p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { login, setTokenFromStorage } from '../services/auth';
import router from '../router';
import { useUserStore } from '../store';

export default defineComponent({
  setup() {
    setTokenFromStorage();
    const store = useUserStore();
    const email = ref('');
    const password = ref('');
    const onSubmit = async () => {
      store.clearError();
      try {
        const res = await login({ email: email.value, password: password.value });
        if (res.token) {
          store.setToken(res.token);
          await store.fetchUser();
          router.push('/dashboard');
        }
      } catch (err: any) {
        store.setError(err?.response?.data?.message || 'Error al iniciar sesión');
      }
    };
    return { email, password, onSubmit, store };
  }
});
</script>

<style>
.container { padding: 2rem; }
input { display:block; margin:8px 0; }
</style>
