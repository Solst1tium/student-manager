<template>
  <div class="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      
      <header class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">
          Gestor de Estudiantes 🎓
        </h1>
        <p class="mt-2 text-slate-600">CRUD básico con Vue 3 + Pinia + Tailwind</p>
      </header>

      <!-- Formulario -->
      <StudentForm ref="formRef" />

      <!-- Filtro de búsqueda -->
      <SearchFilter />

      <!-- Lista -->
      <StudentList @edit="handleEdit" />
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StudentForm from './components/StudentForm.vue'
import StudentList from './components/StudentList.vue'
import SearchFilter from './components/SearchFilter.vue'

// Referencia al formulario para poder llamar a su método startEdit
const formRef = ref(null)

const handleEdit = (student) => {
  formRef.value.startEdit(student)
  // Hacemos scroll hacia arriba para que se vea el formulario
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>