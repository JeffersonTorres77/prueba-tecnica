<template>
  <div class="container">
    <h2>Dashboard</h2>
    <div v-if="userStore.user">
      <p>Bienvenido, {{ userStore.user.name }} ({{ userStore.user.role }})</p>
    </div>
    <div v-else>
      <p>Cargando datos de usuario...</p>
    </div>
    <!-- Panel para admin -->
    <div v-if="userStore.user?.role === 'administrador'">
      <h3>Admin: Todos los proyectos</h3>
      <button @click="nuevoProyecto" v-if="!showProyectoForm">Nuevo Proyecto</button>
      <ProjectForm v-if="showProyectoForm" :proyecto="proyectoSeleccionado" :editMode="editModeProyecto" @saved="onProyectoSaved" @cancel="onCancelProyectoEdit"/>
      <div v-if="projectsStore.loading">Cargando proyectos...</div>
      <div v-if="projectsStore.error" style="color:red">{{ projectsStore.error }}</div>
      <ul v-if="projectsStore.projects.length">
        <li v-for="p in projectsStore.projects" :key="p.id">
          <router-link :to="`/proyectos/${p.id}`">{{ p.title }}</router-link>
          <button @click="editarProyecto(p)">Editar</button>
        </li>
      </ul>
    </div>
    <!-- Panel para desarrollador -->
    <div v-else-if="userStore.user?.role === 'desarrollador'">
      <h3>Dev: Tus proyectos</h3>
      <div v-if="projectsStore.loading">Cargando proyectos...</div>
      <div v-if="projectsStore.error" style="color:red">{{ projectsStore.error }}</div>
      <ul v-if="projectsUsuario.length">
        <li v-for="p in projectsUsuario" :key="p.id">
          <router-link :to="`/proyectos/${p.id}`">{{ p.title }}</router-link>
        </li>
      </ul>
    </div>
    <button @click="onLogout">Logout</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useUserStore, useProjectsStore } from '../store';
import { logout } from '../services/auth';
import router from '../router';
import ProjectForm from './ProjectForm.vue';

export default defineComponent({
  components: { ProjectForm },
  setup() {
    const userStore = useUserStore();
    const projectsStore = useProjectsStore();
    const showProyectoForm = ref(false);
    const editModeProyecto = ref(false);
    const proyectoSeleccionado = ref(null);
    onMounted(() => {
      if (!userStore.user) userStore.fetchUser();
      projectsStore.fetchProjects();
    });
    // Proyectos asociados al dev
    const projectsUsuario = computed(() => {
      if (userStore.user?.role === 'desarrollador') {
        return projectsStore.projects.filter((p: any) => p.user_id === userStore.user.id);
      }
      return [];
    });
    // Lógica para crear y editar proyectos
    const nuevoProyecto = () => {
      proyectoSeleccionado.value = null;
      editModeProyecto.value = false;
      showProyectoForm.value = true;
    };
    const editarProyecto = (p:any) => {
      proyectoSeleccionado.value = p;
      editModeProyecto.value = true;
      showProyectoForm.value = true;
    };
    const onProyectoSaved = async () => {
      showProyectoForm.value = false;
      await projectsStore.fetchProjects();
    };
    const onCancelProyectoEdit = () => {
      showProyectoForm.value = false;
    };
    const onLogout = async () => {
      await logout();
      userStore.logout();
      router.push('/login');
    };
    return {
      userStore,
      projectsStore,
      onLogout,
      projectsUsuario,
      showProyectoForm,
      proyectoSeleccionado,
      editModeProyecto,
      nuevoProyecto,
      editarProyecto,
      onProyectoSaved,
      onCancelProyectoEdit
    };
  }
});
</script>

<style>
.container { padding: 2rem; }
</style>
