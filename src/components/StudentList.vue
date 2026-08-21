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
                <button @click="openConfirmModal(student)" class="text-red-600 hover:text-red-900 transition-colors">Eliminar</button>
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

          <div class="space-y-1 mb-4">
            <p class="text-sm text-slate-600">📚 {{ student.course }}</p>
            <p class="text-xs text-slate-400">Inscrito: {{ student.enrolledAt }}</p>
          </div>

          <div class="flex gap-2">
            <button
              @click="$emit('edit', student)"
              class="flex-1 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              ✏️ Editar
            </button>
            <button
              @click="openConfirmModal(student)"
              class="flex-1 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- ========== MODAL DE CONFIRMACIÓN ========== -->
    <Transition name="modal">
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="closeConfirmModal"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <!-- Icono de advertencia -->
          <div class="flex justify-center mb-4">
            <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
          </div>

          <!-- Contenido -->
          <div class="text-center mb-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-2">
              ¿Eliminar estudiante?
            </h3>
            <p class="text-sm text-slate-600">
              Estás a punto de eliminar a
              <strong class="text-slate-900">{{ studentToDelete?.name }}</strong>.
              Esta acción no se puede deshacer.
            </p>
          </div>

          <!-- Acciones -->
          <div class="flex gap-3">
            <button
              @click="closeConfirmModal"
              class="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="confirmDelete"
              class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStudentsStore } from '../stores/students'
import { onMounted, onUnmounted } from 'vue'

const store = useStudentsStore()

const { filteredStudents, totalStudents, activeStudents, inactiveStudents } = storeToRefs(store)
const { deleteStudent } = store

const emit = defineEmits(['edit'])

// ==========================================
// MODAL DE CONFIRMACIÓN
// ==========================================
const showConfirmModal = ref(false)
const studentToDelete = ref(null)

const openConfirmModal = (student) => {
  studentToDelete.value = student
  showConfirmModal.value = true
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  studentToDelete.value = null
}

const confirmDelete = () => {
  if (studentToDelete.value) {
    deleteStudent(studentToDelete.value.id)
  }
  closeConfirmModal()
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && showConfirmModal.value) {
    closeConfirmModal()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

</script>

<style scoped>
/* Animación del modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div {
  transform: scale(0.95);
}
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>