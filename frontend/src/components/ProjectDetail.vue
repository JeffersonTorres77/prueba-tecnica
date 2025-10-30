<template>
  <div class="container">
    <button @click="$router.back()">Volver</button>
    <h2>Proyecto: {{ project?.title }}</h2>
    <p><strong>Descripción:</strong> {{ project?.description }}</p>

    

    <!-- Filtros de tareas -->
    <div class="filtros">
      <input v-model="filtros.texto" placeholder="Buscar tarea..." />
      <select v-model="filtros.estado">
        <option value="">Todos los estados</option>
        <option value="todo">Pendiente</option>
        <option value="in_progress">En progreso</option>
        <option value="done">Finalizada</option>
      </select>
      <select v-model="filtros.usuario">
        <option value="">Todos los usuarios</option>
        <option v-for="u in usuariosLista" :key="u.id" :value="u.id">{{ u.name }}</option>
      </select>
      <button @click="aplicarFiltros">Filtrar</button>
      <button @click="limpiarFiltros" type="button">Limpiar</button>
    </div>

    <h3>Tareas</h3>
    <div v-if="tasksStore.loading">Cargando tareas...</div>
    <div v-if="tasksStore.error" style="color:red">{{ tasksStore.error }}</div>
    <TaskForm v-if="showForm" :projectId="projectId" :usuarios="usuariosLista" :tarea="tareaSeleccionada" :editMode="editMode" @saved="onTaskSaved" @cancel="onCancelEdit" />
    <button v-if="!showForm" @click="nuevaTarea">Nueva Tarea</button>
    <ul>
      <li v-for="t in tareasFiltradas" :key="t.id">
        {{ t.title }} - <b>{{ t.status }}</b>
        <span v-if="t.assigned_user">(Asignada a: {{ t.assigned_user?.name || '-' }})</span>
        <button @click="editarTarea(t)">Editar</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectsStore, useTasksStore, useUserStore, useUsersStore } from '../store';
import TaskForm from './TaskForm.vue';

export default defineComponent({
  components: { TaskForm },
  setup() {
    const route = useRoute();
    const projectsStore = useProjectsStore();
    const tasksStore = useTasksStore();
    const userStore = useUserStore();
    const usersStore = useUsersStore();
    const projectId = Number(route.params.id);
    const filtros = ref({ texto: '', estado: '', usuario: '' });
    const project = computed(() => projectsStore.projects.find((p:any) => p.id === projectId));
    const tareasProyecto = computed(() => tasksStore.tasks.filter((t: any) => t.project_id === projectId));
    // Filtrado local en frontend
    const tareasFiltradas = computed(() => {
      let tareas: any[] = tareasProyecto.value;
      if (filtros.value.texto) {
        tareas = tareas.filter(t => t.title?.toLowerCase().includes(filtros.value.texto.toLowerCase()));
      }
      if (filtros.value.estado) {
        tareas = tareas.filter(t => t.status === filtros.value.estado);
      }
      if (filtros.value.usuario) {
        tareas = tareas.filter(t => t.assigned_user_id == filtros.value.usuario);
      }
      return tareas;
    });
    const showForm = ref(false);
    const editMode = ref(false);
    const tareaSeleccionada = ref(null);
    // Usuarios disponibles: admin puede asignar a otros, dev solo a sí mismo
    const usuariosLista = computed(() => {
      if (!userStore.user) return [];
      if (userStore.user.role === 'administrador') return usersStore.users;
      return [userStore.user];
    });
    onMounted(async () => {
      if (!projectsStore.projects.length) await projectsStore.fetchProjects();
      await tasksStore.fetchTasks({ project_id: projectId });
      if (userStore.user?.role === 'administrador') {
        await usersStore.fetchUsers({ role: 'desarrollador' });
      }
    });
    // Filtros llamando endpoint (opcional)
    const aplicarFiltros = async () => {
      // Si quieres filtrar en backend, descomenta la línea:
      // await tasksStore.fetchTasks({ project_id: projectId, status: filtros.value.estado, assigned_user_id: filtros.value.usuario, title: filtros.value.texto });
      // Por defecto el filtrado es local
    };
    const limpiarFiltros = async () => {
      filtros.value = { texto: '', estado: '', usuario: '' };
      // await tasksStore.fetchTasks({ project_id: projectId }); // para recargar todos
    };
    const nuevaTarea = () => {
      tareaSeleccionada.value = null;
      editMode.value = false;
      showForm.value = true;
    };
    const editarTarea = (t: any) => {
      tareaSeleccionada.value = t;
      editMode.value = true;
      showForm.value = true;
    };
    const onTaskSaved = async () => {
      showForm.value = false;
      await tasksStore.fetchTasks({ project_id: projectId });
    };
    const onCancelEdit = () => {
      showForm.value = false;
    };
    return {
      project,
      tareasProyecto,
      tareasFiltradas,
      tasksStore,
      usuariosLista,
      filtros,
      showForm,
      tareaSeleccionada,
      editMode,
      nuevaTarea,
      editarTarea,
      onTaskSaved,
      onCancelEdit,
      projectId,
      aplicarFiltros,
      limpiarFiltros
    };
  }
});
</script>

<style>
.container { padding:2rem; }
.progress-bar {
  width: 100%;
  height: 20px;
  background: #eee;
  margin: 0.5rem 0;
}
.progress {
  height: 100%;
  background: #67c23a;
}
.filtros { margin:1rem 0; border:1px solid #f0f0f0; padding:0.5rem; background:#fafbfc; }
.filtros input, .filtros select { margin-right: 8px; }
</style>
