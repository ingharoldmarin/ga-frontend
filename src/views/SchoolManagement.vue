<script setup>
import { ref, onMounted } from 'vue'
import { schoolService } from '@/api/schoolService'

const schools = ref([])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Formulario de colegio
const formData = ref({
  id: null,
  name: '',
  nit: '',
  resolution: '',
  phone: '',
  address: ''
})

// Cargar colegios
const loadSchools = async () => {
  loading.value = true
  try {
    const response = await schoolService.getAll(1, 100)
    
    // Manejar respuesta paginada
    if (response.data && Array.isArray(response.data)) {
      schools.value = response.data
    } else if (Array.isArray(response)) {
      schools.value = response
    } else {
      schools.value = []
    }
    
    console.log('Colegios cargados:', schools.value)
  } catch (error) {
    console.error('Error al cargar colegios:', error)
    errorMessage.value = 'Error al cargar colegios: ' + (error.response?.data?.message || error.message)
  } finally {
    loading.value = false
  }
}

// Abrir modal para crear
const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showModal.value = true
  errorMessage.value = ''
  successMessage.value = ''
}

// Abrir modal para editar
const openEditModal = (school) => {
  isEditing.value = true
  formData.value = {
    id: school.id,
    name: school.name,
    nit: school.nit || '',
    resolution: school.resolution || '',
    phone: school.phone || '',
    address: school.address || ''
  }
  showModal.value = true
  errorMessage.value = ''
  successMessage.value = ''
}

// Cerrar modal
const closeModal = () => {
  showModal.value = false
  resetForm()
}

// Resetear formulario
const resetForm = () => {
  formData.value = {
    id: null,
    name: '',
    nit: '',
    resolution: '',
    phone: '',
    address: ''
  }
}

// Guardar colegio (crear o actualizar)
const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  // Validación básica
  if (!formData.value.name || formData.value.name.trim() === '') {
    errorMessage.value = 'El nombre del colegio es requerido'
    return
  }

  loading.value = true
  try {
    const schoolData = {
      name: formData.value.name.trim(),
      nit: formData.value.nit.trim(),
      resolution: formData.value.resolution.trim(),
      phone: formData.value.phone.trim(),
      address: formData.value.address.trim()
    }

    if (isEditing.value) {
      await schoolService.update(formData.value.id, schoolData)
      successMessage.value = 'Colegio actualizado exitosamente'
    } else {
      await schoolService.create(schoolData)
      successMessage.value = 'Colegio creado exitosamente'
    }
    
    await loadSchools()
    
    setTimeout(() => {
      closeModal()
      successMessage.value = ''
    }, 1500)
  } catch (error) {
    console.error('Error al guardar:', error)
    errorMessage.value = error.response?.data?.message || 'Error al guardar el colegio'
  } finally {
    loading.value = false
  }
}

// Eliminar colegio
const deleteSchool = async (schoolId, schoolName) => {
  if (!confirm(`¿Estás seguro de eliminar el colegio "${schoolName}"?`)) return

  loading.value = true
  errorMessage.value = ''
  try {
    await schoolService.delete(schoolId)
    successMessage.value = 'Colegio eliminado exitosamente'
    await loadSchools()
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error al eliminar:', error)
    errorMessage.value = error.response?.data?.message || 'Error al eliminar el colegio'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSchools()
})
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Gestión de Colegios</h2>
        <p class="text-sm text-gray-600 mt-1">Administra los colegios del sistema</p>
      </div>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        + Nuevo Colegio
      </button>
    </div>

    <!-- Mensajes -->
    <div v-if="successMessage" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage && !showModal" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      {{ errorMessage }}
    </div>

    <!-- Tabla de colegios -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIT</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolución</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">Cargando...</td>
          </tr>
          <tr v-else-if="schools.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">No hay colegios registrados</td>
          </tr>
          <tr v-else v-for="school in schools" :key="school.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ school.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ school.nit || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ school.resolution || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ school.phone || '-' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ school.address || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
              <button
                @click="openEditModal(school)"
                class="text-blue-600 hover:text-blue-800"
                :disabled="loading"
              >
                Editar
              </button>
              <button
                @click="deleteSchool(school.id, school.name)"
                class="text-red-600 hover:text-red-800"
                :disabled="loading"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de crear/editar -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h3 class="text-xl font-bold mb-4">
          {{ isEditing ? 'Editar Colegio' : 'Nuevo Colegio' }}
        </h3>

        <!-- Mensajes en modal -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- Nombre -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Colegio <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Ej: Institución Educativa San José"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="loading"
            />
          </div>

          <!-- NIT -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">NIT</label>
            <input
              v-model="formData.nit"
              type="text"
              placeholder="Ej: 900123456-7"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="loading"
            />
          </div>

          <!-- Resolución -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Resolución</label>
            <input
              v-model="formData.resolution"
              type="text"
              placeholder="Ej: Resolución 1234 de 2023"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="loading"
            />
          </div>

          <!-- Teléfono -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              v-model="formData.phone"
              type="text"
              placeholder="Ej: 3001234567"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="loading"
            />
          </div>

          <!-- Dirección -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <textarea
              v-model="formData.address"
              placeholder="Ej: Calle 123 #45-67, Medellín"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="loading"
            ></textarea>
          </div>

          <!-- Botones -->
          <div class="flex gap-2">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {{ loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              :disabled="loading"
              class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>