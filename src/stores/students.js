import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStudentsStore = defineStore('students', () => {
  // ==========================================
  // 1. STATE
  // ==========================================
  const storedStudents = localStorage.getItem('students')

  const students = ref(
    storedStudents
      ? JSON.parse(storedStudents)
      : [
          {
            id: 1,
            name: 'Ana González',
            email: 'ana.gonzalez@email.com',
            course: 'Vue.js Avanzado',
            status: 'activo',
            enrolledAt: '15-03-2026'
          },
          {
            id: 2,
            name: 'Carlos Muñoz',
            email: 'carlos.munoz@email.com',
            course: 'Angular Fundamentos',
            status: 'activo',
            enrolledAt: '22-04-2026'
          },
          {
            id: 3,
            name: 'María Rojas',
            email: 'maria.rojas@email.com',
            course: 'TypeScript',
            status: 'inactivo',
            enrolledAt: '10-02-2026'
          }
        ]
  )

  const searchQuery = ref('')
  const filterStatus = ref('todos')

  // ==========================================
  // 2. GETTERS
  // ==========================================
  const filteredStudents = computed(() => {
    return students.value.filter((student) => {
      const query = searchQuery.value.toLowerCase()

      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.course.toLowerCase().includes(query)

      const matchesStatus =
        filterStatus.value === 'todos' || student.status === filterStatus.value

      return matchesSearch && matchesStatus
    })
  })

  const totalStudents = computed(() => students.value.length)

  const activeStudents = computed(
    () => students.value.filter((s) => s.status === 'activo').length
  )

  const inactiveStudents = computed(
    () => students.value.filter((s) => s.status === 'inactivo').length
  )

  // ==========================================
  // 3. ACTIONS
  // ==========================================
  const saveToStorage = () => {
    localStorage.setItem('students', JSON.stringify(students.value))
  }

  const addStudent = (studentData) => {
    const newStudent = {
      id: Date.now(),
      ...studentData,
      enrolledAt: new Date().toLocaleDateString('es-CL')
    }

    students.value.push(newStudent)
    saveToStorage()
  }

  const updateStudent = (id, updatedData) => {
    const index = students.value.findIndex((s) => s.id === id)

    if (index !== -1) {
      students.value[index] = {
        ...students.value[index],
        ...updatedData
      }

      saveToStorage()
    }
  }

  const deleteStudent = (id) => {
    students.value = students.value.filter((s) => s.id !== id)
    saveToStorage()
  }

  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  const setFilterStatus = (status) => {
    filterStatus.value = status
  }

  return {
    // state
    students,
    searchQuery,
    filterStatus,
    // getters
    filteredStudents,
    totalStudents,
    activeStudents,
    inactiveStudents,    
    // actions
    addStudent,
    updateStudent,
    deleteStudent,
    setSearchQuery,
    setFilterStatus
  }
})