<template>
  <div>
    <h2 class="text-xl font-bold text-slate-800 mb-4">
      📋 Lista de Estudiantes
      <span class="text-sm font-normal text-slate-500">
        ({{ totalStudents }} total · {{ activeStudents }} activos · {{ inactiveStudents }} inactivos)
      </span>
    </h2>

    <!-- Estado vacío -->
    <div
      v-if="filteredStudents.length === 0"
      class="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300"
    >
      <p class="text-slate-500">No hay estudiantes que coincidan. 🎓</p>
    </div>

    <template v-else>
      <!-- ========== TABLA (solo escritorio) ========== -->
      <div class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-slate-200">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estudiante</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Curso</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-slate-900">{{ student.name }}</div>
                <div class="text-sm text-slate-500">{{ student.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{{ student.course }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="student.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ student.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="$emit('edit', student)" class="text-blue-600 hover:text-blue-900 mr-4 transition-colors">Editar</button>
                <button @click="handleDelete(student)" class="text-red-600 hover:text-red-900 transition-colors">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ========== TARJETAS (solo móvil) ========== -->
      <div class="md:hidden grid grid-cols-1 gap-4">
        <div
          v-for="student in filteredStudents"
          :key="student.id"
          class="bg-white rounded-xl shadow-md border border-slate-200 p-5"
        >
          <!-- Header: nombre + badge -->
          <div class="flex items-start justify-between mb-2">
            <div>
              <h3 class="text-base font-semibold text-slate-900">{{ student.name }}</h3>
              <p class="text-sm text-slate-500">{{ student.email }}</p>
            </div>
            <span
              class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
              :class="student.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ student.status }}
            </span>
          </div>

          <!-- Info -->
          <div class="space-y-1 mb-4">
            <p class="text-sm text-slate-600">📚 {{ student.course }}</p>
            <p class="text-xs text-slate-400">Inscrito: {{ student.enrolledAt }}</p>
          </div>

          <!-- Acciones -->
          <div class="flex gap-2">
            <button
              @click="$emit('edit', student)"
              class="flex-1 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              ✏️ Editar
            </button>
            <button
              @click="handleDelete(student)"
              class="flex-1 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useStudentsStore } from '../stores/students'

const store = useStudentsStore()

const { filteredStudents, totalStudents, activeStudents, inactiveStudents } = storeToRefs(store)
const { deleteStudent } = store

const emit = defineEmits(['edit'])

const handleDelete = (student) => {
  if (confirm(`¿Estás seguro de eliminar a ${student.name}?`)) {
    deleteStudent(student.id)
  }
}
</script>