<template>
  <div class="bg-white rounded-xl shadow-md p-5 mb-6 border border-slate-200">
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Búsqueda -->
      <div class="flex-1">
        <label class="block text-sm font-medium text-slate-700 mb-1">Buscar estudiante</label>
        <input
          :value="searchQuery"
          @input="setSearchQuery($event.target.value)"
          type="text"
          placeholder="Buscar por nombre, email o curso..."
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Filtro -->
      <div class="md:w-64">
        <label class="block text-sm font-medium text-slate-700 mb-1">Filtrar por estado</label>
        <select
          :value="filterStatus"
          @change="setFilterStatus($event.target.value)"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="todos">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useStudentsStore } from '../stores/students'

const store = useStudentsStore()

const { searchQuery, filterStatus } = storeToRefs(store)

const { setSearchQuery, setFilterStatus } = store
</script>