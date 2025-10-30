<template>
  <div id="app">
    <nav style="margin-bottom:1rem">
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link> |
      <router-link to="/dashboard">Dashboard</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {
    return {};
  }
});
</script>

<style>
#app { padding: 2rem; }
nav a { margin-right: .5rem }
</style>
