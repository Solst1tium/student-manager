<template>
  <div class="bg-white rounded-xl shadow-md p-6 mb-6 border border-slate-200">
    <h2 class="text-xl font-bold text-slate-800 mb-4">
      {{ editingId ? '✏️ Editar Estudiante' : '➕ Nuevo Estudiante' }}
    </h2>

    <!-- novalidate desactiva la validación del navegador para usar la nuestra -->
    <form @submit.prevent="handleSubmit" novalidate class="grid grid-cols-1 md:grid-cols-2 gap-4">

      <!-- Nombre -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
        <input
          v-model.trim="form.name"
          @blur="validateField('name')"
          :class="inputClass('name')"
          placeholder="Ej: Ana Pérez"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-600">⚠️ {{ errors.name }}</p>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Email *</label>
        <input
          v-model.trim="form.email"
          type="email"
          @blur="validateField('email')"
          :class="inputClass('email')"
          placeholder="ana@email.com"
        />
        <p v-if="errors.email" class="mt-1 text-xs text-red-600">⚠️ {{ errors.email }}</p>
      </div>

      <!-- Curso -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Curso *</label>
        <input
          v-model.trim="form.course"
          @blur="validateField('course')"
          :class="inputClass('course')"
          placeholder="Ej: Vue 3 Avanzado"
        />
        <p v-if="errors.course" class="mt-1 text-xs text-red-600">⚠️ {{ errors.course }}</p>
      </div>

      <!-- Estado -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Estado *</label>
        <select
          v-model="form.status"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div class="md:col-span-2 flex gap-3 mt-2">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          {{ editingId ? 'Guardar Cambios' : 'Agregar Estudiante' }}
        </button>
        <button
          v-if="editingId"
          type="button"
          @click="cancelEdit"
          class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStudentsStore } from '../stores/students'

const store = useStudentsStore()

const editingId = ref(null)
const form = ref({
  name: '',
  email: '',
  course: '',
  status: 'activo'
})
const errors = ref({})

// ==========================================
// VALIDACIÓN
// ==========================================

// Objeto con una regla por campo (limpio y escalable)
const validators = {
  name: (value) => {
    if (!value) return 'El nombre es obligatorio'
    if (value.length < 3) return 'Debe tener al menos 3 caracteres'
    return ''
  },
  email: (value) => {
    if (!value) return 'El email es obligatorio'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un email válido'
    return ''
  },
  course: (value) => {
    if (!value) return 'El curso es obligatorio'
    return ''
  }
}

// Valida UN campo y guarda/limpia su error
const validateField = (field) => {
  const error = validators[field](form.value[field])
  if (error) {
    errors.value[field] = error
  } else {
    delete errors.value[field]
  }
  return !error
}

// Valida TODOS los campos (se usa al enviar)
const validateForm = () => {
  let isValid = true
  Object.keys(validators).forEach((field) => {
    if (!validateField(field)) isValid = false
  })
  return isValid
}

// Clase dinámica: borde rojo si hay error, normal si no
const inputClass = (field) => [
  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2',
  errors.value[field]
    ? 'border-red-500 focus:ring-red-400'
    : 'border-slate-300 focus:ring-blue-500'
]

// ==========================================
// LÓGICA CRUD
// ==========================================
const handleSubmit = () => {
  // Si hay errores, NO guardamos
  if (!validateForm()) return

  if (editingId.value) {
    store.updateStudent(editingId.value, { ...form.value })
    cancelEdit()
  } else {
    store.addStudent({ ...form.value })
    resetForm()
  }
}

const startEdit = (student) => {
  editingId.value = student.id
  form.value = { ...student }
  errors.value = {}
}

const cancelEdit = () => {
  editingId.value = null
  resetForm()
}

const resetForm = () => {
  form.value = { name: '', email: '', course: '', status: 'activo' }
  errors.value = {}
}

defineExpose({ startEdit })
</script>