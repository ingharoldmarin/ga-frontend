<script setup>
import { ref, onMounted, computed } from 'vue'
import { userService, roleService } from '@/api/userService'
import { schoolService } from '@/api/schoolService'
import { useAuthStore } from '@/stores/auth'
import { excelService } from '@/utils/excelService'
import { useUsers } from '@/composables/useUsers'

const authStore = useAuthStore()
const roles = ref([])
const schools = ref([])
const showModal = ref(false)
const showBulkModal = ref(false)
const isEditing = ref(false)
const editingUserId = ref(null)
const successMessage = ref('')
const bulkErrors = ref([])
const previewData = ref([])
const uploadProgress = ref(0)

const {
  users, loading, errorMessage,
  searchQuery, currentPage, totalUsers, totalPages,
  coordinatorSchoolIds,
  loadUsers, goToPage, visiblePages,
} = useUsers()

// Formulario de nuevo usuario
const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
  username: '',
  password: '',
  password_confirmation: '',
  school_ids: [],
  roles: []
})

const loadRoles = async () => {
  try {
    const response = await roleService.getAll()
    console.log('Respuesta roles completa:', response)
    
    // Determinar estructura de datos
    let allRoles = []
    if (response.data && Array.isArray(response.data)) {
      allRoles = response.data
    } else if (Array.isArray(response)) {
      allRoles = response
    }
    
    console.log('Todos los roles:', allRoles)
    console.log('Es admin?', authStore.isAdmin)
    console.log('Es coordinador?', authStore.isCoordinator)
    
    // Filtrar roles según el rol del usuario autenticado
    if (authStore.isAdmin) {
      // Admin puede asignar cualquier rol excepto admin
      roles.value = allRoles.filter(role => role.name !== 'admin')
      console.log('Roles para admin:', roles.value)
    } else if (authStore.isCoordinator) {
      // Coordinador solo puede asignar estudiante y profesor
      roles.value = allRoles.filter(role => 
        role.name === 'estudiante' || role.name === 'profesor'
      )
      console.log('Roles para coordinador:', roles.value)
    } else {
      roles.value = []
      console.log('Usuario sin permisos para asignar roles')
    }
    
    console.log('Roles finales disponibles:', roles.value)
  } catch (error) {
    console.error('Error al cargar roles:', error)
    errorMessage.value = 'Error al cargar roles: ' + (error.response?.data?.message || error.message)
  }
}

// Cargar colegios
const loadSchools = async () => {
  try {
    const response = await schoolService.getAll(1, 100)
    
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
  }
}

// Computed: verificar si el coordinador tiene colegio asignado
const coordinatorHasSchool = computed(() => {
  if (!authStore.isCoordinator) return true
  return coordinatorSchoolIds.value.length > 0
})

// Computed: verificar si puede crear usuarios
const canCreateUsers = computed(() => {
  if (authStore.isAdmin) return true
  if (authStore.isCoordinator) return coordinatorHasSchool.value
  return false
})

// Computed property para el título según el rol
const pageTitle = computed(() => {
  if (authStore.isAdmin) {
    return 'Gestión de Usuarios (Administrador)'
  } else if (authStore.isCoordinator) {
    return 'Registro de Estudiantes y Profesores'
  }
  return 'Gestión de Usuarios'
})

// Abrir modal de registro
const openModal = () => {
  isEditing.value = false
  editingUserId.value = null
  resetForm()
  showModal.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  // Debug: verificar datos del coordinador al abrir modal
  console.log('🔍 ABRIENDO MODAL - Verificación de coordinador')
  console.log('authStore.user completo:', authStore.user)
  console.log('authStore.isCoordinator:', authStore.isCoordinator)
  console.log('authStore.user?.schools:', authStore.user?.schools)
}

const openEditModal = async (user) => {
  isEditing.value = true
  editingUserId.value = user.id
  
  formData.value = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    username: user.username,
    password: '',
    password_confirmation: '',
    school_ids: user.schools ? user.schools.map(s => s.id) : [],
    roles: user.roles ? user.roles.map(r => r.id) : []
  }
  
  showModal.value = true
  errorMessage.value = ''
  successMessage.value = ''
}

// Cerrar modal
const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingUserId.value = null
  resetForm()
}

// Resetear formulario
const resetForm = () => {
  formData.value = {
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    school_ids: [],
    roles: []
  }
}

// Crear o actualizar usuario
const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  // Validaciones básicas
  if (!formData.value.first_name || !formData.value.last_name || !formData.value.email || 
      !formData.value.username) {
    errorMessage.value = 'Nombre, apellido, email y usuario son obligatorios'
    return
  }

  // ⭐ Password solo es obligatorio al CREAR, no al EDITAR
  if (!isEditing.value && !formData.value.password) {
    errorMessage.value = 'La contraseña es obligatoria al crear un usuario'
    return
  }

  // Validar contraseñas si se ingresó alguna
  if (formData.value.password || formData.value.password_confirmation) {
    if (formData.value.password !== formData.value.password_confirmation) {
      errorMessage.value = 'Las contraseñas no coinciden'
      return
    }
    if (formData.value.password.length < 6) {
      errorMessage.value = 'La contraseña debe tener al menos 6 caracteres'
      return
    }
  }

  if (formData.value.roles.length === 0) {
    errorMessage.value = 'Debes seleccionar al menos un rol'
    return
  }

  loading.value = true
  try {
    const userData = {
      first_name: formData.value.first_name,
      last_name: formData.value.last_name,
      email: formData.value.email,
      username: formData.value.username,
      roles: formData.value.roles,
      school_ids: [] // Inicializar el array
    }

    // ⭐ Solo incluir password si se proporcionó
    if (formData.value.password && formData.value.password.trim() !== '') {
      userData.password = formData.value.password
    }

    // Si es coordinador, asignar sus colegios automáticamente
    if (authStore.isCoordinator) {
      if (coordinatorSchoolIds.value.length === 0) {
        errorMessage.value = 'Error: No tienes colegios asignados. Contacta al administrador.'
        loading.value = false
        return
      }
      userData.school_ids = coordinatorSchoolIds.value
    } else if (authStore.isAdmin && formData.value.school_ids.length > 0) {
      userData.school_ids = formData.value.school_ids
    }

    let response
    if (isEditing.value) {
      // ACTUALIZAR usuario existente
      console.log('Actualizando usuario ID:', editingUserId.value)
      response = await userService.update(editingUserId.value, userData)
      successMessage.value = 'Usuario actualizado exitosamente'
    } else {
      // CREAR nuevo usuario
      response = await userService.create(userData)
      successMessage.value = 'Usuario creado exitosamente'
    }
    
    console.log('✅ Respuesta del backend:', response)
    
    await loadUsers()
    setTimeout(() => closeModal(), 1500)
  } catch (error) {
    console.error('❌ Error al crear/actualizar usuario:', error)
    errorMessage.value = error.response?.data?.message || 'Error al procesar el usuario'
  } finally {
    loading.value = false
  }
}

// Verificar si el usuario puede ser eliminado
const canDeleteUser = (user) => {
  // Admin puede eliminar a cualquiera
  if (authStore.isAdmin) return true
  
  // Coordinador no puede eliminar admins
  if (authStore.isCoordinator) {
    const hasAdminRole = user.roles?.some(role => role.name === 'admin')
    return !hasAdminRole
  }
  
  return false
}

// Eliminar usuario
const deleteUser = async (userId) => {
  if (!confirm('¿Estás seguro de eliminar este usuario?')) return

  loading.value = true
  errorMessage.value = ''
  try {
    await userService.delete(userId)
    successMessage.value = 'Usuario eliminado exitosamente'
    await loadUsers()
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    console.error('Error al eliminar:', error)
    errorMessage.value = error.response?.data?.message || 'Error al eliminar usuario'
  } finally {
    loading.value = false
  }
}

// Toggle de selección de rol
const toggleRole = (roleId) => {
  const index = formData.value.roles.indexOf(roleId)
  if (index > -1) {
    formData.value.roles.splice(index, 1)
  } else {
    formData.value.roles.push(roleId)
  }
}

// Toggle de selección de colegio
const toggleSchool = (schoolId) => {
  const index = formData.value.school_ids.indexOf(schoolId)
  if (index > -1) {
    formData.value.school_ids.splice(index, 1)
  } else {
    formData.value.school_ids.push(schoolId)
  }
}

const nextPage = () => { if (currentPage.value < totalPages.value) goToPage(currentPage.value + 1) }
const previousPage = () => { if (currentPage.value > 1) goToPage(currentPage.value - 1) }

// Descargar plantilla de Excel
const downloadTemplate = () => {
  excelService.downloadTemplate()
}

// Abrir modal de carga masiva
const openBulkModal = () => {
  showBulkModal.value = true
  previewData.value = []
  bulkErrors.value = []
  errorMessage.value = ''
  successMessage.value = ''
}

// Cerrar modal de carga masiva
const closeBulkModal = () => {
  showBulkModal.value = false
  previewData.value = []
  bulkErrors.value = []
  uploadProgress.value = 0
}

// Manejar selección de archivo
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validar que sea un archivo Excel
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ]
  
  if (!validTypes.includes(file.type)) {
    errorMessage.value = 'Por favor selecciona un archivo Excel válido (.xlsx o .xls)'
    return
  }

  loading.value = true
  errorMessage.value = ''
  bulkErrors.value = []

  try {
    // Leer archivo Excel
    const data = await excelService.readExcel(file)
    
    if (data.length === 0) {
      errorMessage.value = 'El archivo Excel está vacío'
      loading.value = false
      return
    }

    // Obtener school_ids del coordinador si aplica
    let schoolIds = []
    if (authStore.isCoordinator && authStore.user?.schools) {
      schoolIds = authStore.user.schools.map(school => school.id)
      console.log('🏫 Coordinador - School IDs para carga masiva:', schoolIds)
    }

    // Validar datos y asignar school_ids automáticamente
    const { validData, errors } = excelService.validateUserData(data, roles.value, schoolIds)
    
    bulkErrors.value = errors
    previewData.value = validData

    if (errors.length > 0 && validData.length === 0) {
      errorMessage.value = 'No hay datos válidos para importar'
    } else if (errors.length > 0) {
      errorMessage.value = `Se encontraron ${errors.length} errores. Solo se importarán ${validData.length} usuarios válidos.`
    } else {
      successMessage.value = `${validData.length} usuarios listos para importar`
    }

  } catch (error) {
    console.error('Error al leer Excel:', error)
    errorMessage.value = 'Error al procesar el archivo Excel'
  } finally {
    loading.value = false
  }
}

// ⭐⭐⭐ IMPORTAR USUARIOS MASIVAMENTE CON BULK (OPTIMIZADO) ⭐⭐⭐
const importUsers = async () => {
  if (previewData.value.length === 0) {
    errorMessage.value = 'No hay datos para importar'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  uploadProgress.value = 0

  let successCount = 0
  let failCount = 0
  const importErrors = []

  console.log(`🚀 Iniciando importación de ${previewData.value.length} usuarios`)

  // ⭐ Preparar datos con school_ids si es coordinador
  const usersToImport = previewData.value.map(userData => {
    const user = { ...userData }
    
    // Si es coordinador, agregar automáticamente sus colegios
    if (authStore.isCoordinator && authStore.user?.schools && authStore.user.schools.length > 0) {
      user.school_ids = authStore.user.schools.map(school => school.id)
    }
    
    return user
  })

  // ⭐ NUEVO: Importar en batches de 50 usuarios para mejor rendimiento
  const BATCH_SIZE = 50
  const batches = []
  
  for (let i = 0; i < usersToImport.length; i += BATCH_SIZE) {
    batches.push(usersToImport.slice(i, i + BATCH_SIZE))
  }

  console.log(`📦 Dividido en ${batches.length} lotes de hasta ${BATCH_SIZE} usuarios`)

  try {
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      console.log(`📤 Procesando lote ${i + 1}/${batches.length} (${batch.length} usuarios)`)
      
      try {
        const response = await userService.bulkCreate(batch)
        
        successCount += response.created || 0
        failCount += response.failed || 0
        
        if (response.errors && response.errors.length > 0) {
          response.errors.forEach(error => {
            importErrors.push(`Usuario ${error.email}: ${error.error}`)
          })
        }
        
        console.log(`✅ Lote ${i + 1} completado: ${response.created} exitosos, ${response.failed} fallidos`)
      } catch (error) {
        console.error(`❌ Error en lote ${i + 1}:`, error)
        
        // Si falla el batch completo, marcar todos como fallidos
        failCount += batch.length
        
        const errorMsg = error.response?.data?.message || error.message
        importErrors.push(`Lote ${i + 1} (${batch.length} usuarios): ${errorMsg}`)
      }
      
      // Actualizar progreso
      uploadProgress.value = Math.round(((i + 1) / batches.length) * 100)
    }

    console.log(`🎉 Importación completada: ${successCount} exitosos, ${failCount} fallidos`)

    if (failCount > 0) {
      bulkErrors.value = [...bulkErrors.value, ...importErrors]
      errorMessage.value = `Se importaron ${successCount} usuarios. ${failCount} fallaron.`
    } else {
      successMessage.value = `¡${successCount} usuarios importados exitosamente en ${batches.length} lotes!`
    }

    await loadUsers(1)
  } catch (error) {
    console.error('❌ Error general en importación:', error)
    errorMessage.value = 'Error al importar usuarios: ' + (error.message || 'Error desconocido')
  } finally {
    loading.value = false

    if (failCount === 0) {
      setTimeout(() => closeBulkModal(), 2000)
    }
  }
}

onMounted(() => {
  loadUsers()
  loadRoles()
  loadSchools()
})
</script>

<template>
  <div class="p-6">
    <!-- Alerta si coordinador no tiene colegio -->
    <div v-if="authStore.isCoordinator && !coordinatorHasSchool" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      <p class="font-semibold">⚠️ No tienes un colegio asignado</p>
      <p class="text-sm mt-1">Contacta al administrador para que te asigne un colegio antes de poder crear usuarios.</p>
    </div>

    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">{{ pageTitle }}</h2>
        <p v-if="authStore.isCoordinator" class="text-sm text-gray-600 mt-1">
          Puedes registrar estudiantes y profesores
        </p>
      </div>
      <div class="flex gap-2">
        <button
          v-if="canCreateUsers"
          @click="downloadTemplate"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          📥 Descargar Plantilla
        </button>
        <button
          v-if="canCreateUsers"
          @click="openBulkModal"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          📤 Carga Masiva
        </button>
        <button
          v-if="canCreateUsers"
          @click="openModal"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nuevo Usuario
        </button>
        <button
          v-else-if="authStore.isCoordinator"
          disabled
          class="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
          title="Necesitas un colegio asignado"
        >
          + Nuevo Usuario
        </button>
      </div>
    </div>

    <!-- ⭐ Barra de búsqueda -->
    <div class="mb-6">
      <div class="relative">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="🔍 Buscar por nombre, email, usuario, rol o colegio..."
          class="w-full px-4 py-3 pl-12 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg 
          class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p v-if="searchQuery" class="text-sm text-gray-600 mt-2">
        Mostrando {{ totalUsers }} resultado(s) para "{{ searchQuery }}"
      </p>
    </div>

    <!-- Mensajes -->
    <div v-if="successMessage" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage && !showModal" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      {{ errorMessage }}
    </div>

    <!-- Tabla de usuarios -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Colegio</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">Cargando...</td>
          </tr>
          <tr v-else-if="users.length === 0 && searchQuery">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              No se encontraron usuarios que coincidan con "{{ searchQuery }}"
            </td>
          </tr>
          <tr v-else-if="users.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">No hay usuarios registrados</td>
          </tr>
          <tr v-else v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.username }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <div v-if="user.schools && user.schools.length > 0" class="space-y-1">
                <span 
                  v-for="school in user.schools" 
                  :key="school.id"
                  class="inline-block px-2 py-1 mr-1 mb-1 text-xs rounded bg-gray-100 text-gray-700"
                >
                  {{ school.name }}
                </span>
              </div>
              <span v-else class="text-gray-400">Sin colegio</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                v-for="role in user.roles" 
                :key="role.id" 
                class="inline-block px-2 py-1 mr-1 text-xs rounded"
                :class="{
                  'bg-red-100 text-red-800': role.name === 'admin',
                  'bg-blue-100 text-blue-800': role.name === 'coordinador',
                  'bg-green-100 text-green-800': role.name === 'profesor',
                  'bg-yellow-100 text-yellow-800': role.name === 'estudiante'
                }"
              >
                {{ role.name }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
              <button
                @click="openEditModal(user)"
                class="text-blue-600 hover:text-blue-800"
                :disabled="loading"
              >
                Editar
              </button>
              <button
                v-if="canDeleteUser(user)"
                @click="deleteUser(user.id)"
                class="text-red-600 hover:text-red-800"
                :disabled="loading"
              >
                Eliminar
              </button>
              <span v-else class="text-gray-400 text-sm">
                Sin permisos
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Total: <span class="font-medium">{{ totalUsers }}</span> usuarios
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm font-medium rounded-lg border transition-colors"
              :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'"
            >← Anterior</button>

            <div class="flex space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="typeof page === 'number' ? goToPage(page) : null"
                :disabled="typeof page !== 'number'"
                class="min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                :class="[
                  page === currentPage ? 'bg-blue-600 text-white'
                  : typeof page === 'number' ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  : 'bg-white text-gray-400 cursor-default border-0'
                ]"
              >{{ page }}</button>
            </div>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm font-medium rounded-lg border transition-colors"
              :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'"
            >Siguiente →</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de registro -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <div class="p-6 border-b">
          <h3 class="text-xl font-bold">
            {{ isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario' }}
          </h3>
        </div>

        <!-- Contenido scrolleable -->
        <div class="overflow-y-auto p-6 flex-1">
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                v-model="formData.first_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
              />
            </div>

            <!-- Apellido -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                v-model="formData.last_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
              />
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="formData.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
              />
            </div>

            <!-- Username -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input
                v-model="formData.username"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
              />
            </div>

            <!-- Password -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
                <span v-if="isEditing" class="text-xs text-gray-500">(dejar en blanco para mantener la actual)</span>
              </label>
              <input
                v-model="formData.password"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
                :placeholder="isEditing ? 'Dejar vacío para no cambiar' : ''"
              />
            </div>

            <!-- Confirmar Password -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
                <span v-if="isEditing" class="text-xs text-gray-500">(solo si cambia la contraseña)</span>
              </label>
              <input
                v-model="formData.password_confirmation"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
                :placeholder="isEditing ? 'Dejar vacío para no cambiar' : ''"
              />
            </div>

            <!-- Colegio (solo para admin) -->
            <div v-if="authStore.isAdmin && schools.length > 0" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Colegios (opcional, para coordinadores)
              </label>
              <div class="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                <label v-for="school in schools" :key="school.id" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="school.id"
                    :checked="formData.school_ids.includes(school.id)"
                    @change="toggleSchool(school.id)"
                    class="mr-2"
                    :disabled="loading"
                  />
                  <span class="text-sm">{{ school.name }}</span>
                </label>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Solo los coordinadores necesitan colegios asignados para poder crear usuarios
              </p>
            </div>

            <!-- Información para coordinador -->
            <div v-if="authStore.isCoordinator && authStore.user?.schools" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-sm text-blue-800">
                <strong>📍 Colegio(s) asignado(s):</strong>
              </p>
              <ul class="text-sm text-blue-700 mt-1">
                <li v-for="school in authStore.user.schools" :key="school.id">
                  • {{ school.name }}
                </li>
              </ul>
              <p class="text-xs text-blue-600 mt-2">
                Los usuarios que crees se asignarán automáticamente a tu(s) colegio(s)
              </p>
            </div>

            <!-- Roles -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Roles
                <span v-if="authStore.isCoordinator" class="text-xs text-gray-500">
                  (Solo estudiantes y profesores)
                </span>
              </label>
              <div class="space-y-2">
                <label v-for="role in roles" :key="role.id" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="role.id"
                    :checked="formData.roles.includes(role.id)"
                    @change="toggleRole(role.id)"
                    class="mr-2"
                    :disabled="loading"
                  />
                  <span class="text-sm capitalize">{{ role.name }}</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        <!-- Botones fijos en la parte inferior -->
        <div class="p-6 border-t bg-gray-50">
          <div class="flex gap-2">
            <button
              @click="handleSubmit"
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
        </div>
      </div>
    </div>

    <!-- Modal de carga masiva -->
    <div v-if="showBulkModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div class="p-6 border-b">
          <h3 class="text-xl font-bold">Carga Masiva de Usuarios</h3>
        </div>

        <div class="overflow-y-auto p-6 flex-1">
          <!-- Instrucciones -->
          <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <p class="font-semibold mb-2">📋 Instrucciones:</p>
            <ol class="list-decimal list-inside space-y-1">
              <li>Descarga la plantilla de Excel</li>
              <li>Llena los datos de los usuarios (Nombre, Apellido, Email, Usuario, Contraseña, Rol)</li>
              <li>Los roles válidos son: <strong>{{ roles.map(r => r.name).join(', ') }}</strong></li>
              <li>Sube el archivo completado</li>
            </ol>
          </div>

          <!-- Mensajes -->
          <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {{ errorMessage }}
          </div>

          <!-- Errores de validación -->
          <div v-if="bulkErrors.length > 0" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-h-40 overflow-y-auto">
            <p class="font-semibold text-yellow-800 mb-2">⚠️ Errores encontrados:</p>
            <ul class="text-sm text-yellow-700 space-y-1">
              <li v-for="(error, index) in bulkErrors" :key="index">{{ error }}</li>
            </ul>
          </div>

          <!-- Selector de archivo -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar archivo Excel
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              @change="handleFileUpload"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              :disabled="loading"
            />
          </div>

          <!-- Barra de progreso -->
          <div v-if="uploadProgress > 0" class="mb-4">
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-blue-600 h-2.5 rounded-full transition-all"
                :style="{ width: uploadProgress + '%' }"
              ></div>
            </div>
            <p class="text-sm text-gray-600 mt-1 text-center">{{ uploadProgress }}% completado</p>
          </div>

          <!-- Preview de datos -->
          <div v-if="previewData.length > 0" class="mb-4">
            <h4 class="font-semibold mb-2">Vista previa ({{ previewData.length }} usuarios):</h4>
            <div class="border border-gray-300 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
              <table class="min-w-full divide-y divide-gray-200 text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Nombre</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Usuario</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Rol</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(user, index) in previewData" :key="index">
                    <td class="px-4 py-2">{{ user.first_name }} {{ user.last_name }}</td>
                    <td class="px-4 py-2">{{ user.email }}</td>
                    <td class="px-4 py-2">{{ user.username }}</td>
                    <td class="px-4 py-2">
                      <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                        {{ user.roleName }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex gap-2">
            <button
              v-if="previewData.length > 0"
              @click="importUsers"
              :disabled="loading"
              class="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
            >
              {{ loading ? 'Importando...' : `Importar ${previewData.length} Usuarios` }}
            </button>
            <button
              type="button"
              @click="closeBulkModal"
              :disabled="loading"
              class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>