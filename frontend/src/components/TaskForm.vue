<template>
  <div class="task-form">
    <h4>{{ editMode ? 'Editar Tarea' : 'Nueva Tarea' }}</h4>
    <form @submit.prevent="onSubmit">
      <input v-model="title" placeholder="Título" required />
      <select v-model="status">
        <option value="todo">Pendiente</option>
        <option value="in_progress">En progreso</option>
        <option value="done">Finalizada</option>
      </select>
      <select v-model="assigned_user_id">
        <option disabled value="">Asignar a...</option>
        <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.name }}</option>
      </select>
      <button type="submit">{{ editMode ? 'Actualizar' : 'Crear' }}</button>
      <button v-if="editMode" type="button" @click="$emit('cancel')">Cancelar</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { createTask, updateTask } from '../services/projects';

export default defineComponent({
  props: {
    projectId: { type: Number, required: true },
    usuarios: { type: Array, required: true },
    tarea: { type: Object, required: false, default: null },
    editMode: { type: Boolean, default: false }
  },
  emits: ['saved', 'cancel'],
  setup(props, { emit }) {
    const title = ref(props.tarea?.title || '');
    const status = ref(props.tarea?.status || 'todo');
    const assigned_user_id = ref(props.tarea?.assigned_user_id || '');
    const error = ref('');

    watch(() => props.tarea, (newVal) => {
      title.value = newVal?.title || '';
      status.value = newVal?.status || 'todo';
      assigned_user_id.value = newVal?.assigned_user_id || '';
    });

    const onSubmit = async () => {
      error.value = '';
      const payload = {
        title: title.value,
        status: status.value,
        assigned_user_id: assigned_user_id.value,
        project_id: props.projectId
      };
      try {
        if (props.editMode && props.tarea?.id) {
          await updateTask(props.tarea.id, payload);
        } else {
          await createTask(payload);
        }
        emit('saved');
      } catch (e: any) {
        error.value = e?.response?.data?.message || 'Error al guardar tarea';
      }
    };

    return { title, status, assigned_user_id, error, onSubmit };
  }
});
</script>

<style>
.task-form { margin:1rem 0; border:1px solid #ddd; padding:1rem; }
input,select { display:block; margin:8px 0; }
button { margin-right: 8px; }
</style>
