<template>
  <div class="project-form">
    <h4>{{ editMode ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</h4>
    <form @submit.prevent="onSubmit">
      <input v-model="name" placeholder="Nombre del proyecto" required />
      <textarea v-model="description" placeholder="Descripción"></textarea>
      <button type="submit">{{ editMode ? 'Actualizar' : 'Crear' }}</button>
      <button v-if="editMode" type="button" @click="$emit('cancel')">Cancelar</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { createProject, updateProject } from '../services/projects';

export default defineComponent({
  props: {
    proyecto: { type: Object, default: null },
    editMode: { type: Boolean, default: false }
  },
  emits: ['saved', 'cancel'],
  setup(props, { emit }) {
    const name = ref(props.proyecto?.title || '');
    const description = ref(props.proyecto?.description || '');
    const error = ref('');

    watch(() => props.proyecto, (val) => {
      name.value = val?.title || '';
      description.value = val?.description || '';
    });

    const onSubmit = async () => {
      error.value = '';
      try {
        if (props.editMode && props.proyecto?.id) {
          await updateProject(props.proyecto.id, {
            title: name.value,
            description: description.value
          });
        } else {
          await createProject({
            title: name.value,
            description: description.value
          });
        }
        emit('saved');
      } catch (e: any) {
        error.value = e?.response?.data?.message || 'Error al guardar proyecto';
      }
    };

    return { name, description, error, onSubmit };
  }
});
</script>

<style>
.project-form { margin:1rem 0; border:1px solid #bbb; padding:1rem; }
input, textarea { display:block; width:100%; margin:8px 0; }
button { margin-right: 8px; }
</style>
