// src/views/CurriculumManagement.vue
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  topicService,
  componentService,
  standardService,
  tipeCompetenceService,
  competenceService,
  affirmationService,
  evidenceService
} from '@/api/curriculumService'

const authStore = useAuthStore()

// ============================================
// ESTADO GLOBAL
// ============================================
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const activeTab = ref('topics') // topics, components, standards, competences, affirmations, evidences

// ============================================
// DATOS DE CADA SECCIÓN
// ============================================
const topics = ref([])
const components = ref([])
const standards = ref([])
const tipeCompetences = ref([])
const competences = ref([])
const affirmations = ref([])
const evidences = ref([])

// ============================================
// MODALES
// ============================================
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const currentSection = ref('') // Para saber qué sección está editando

// ============================================
// FORMULARIOS
// ============================================
const topicForm = ref({ name: '', description: '' })
const componentForm = ref({ name: '', description: '' })
const standardForm = ref({ name: '', description: '' })
const tipeCompetenceForm = ref({ name: '' })
const competenceForm = ref({ description: '', tipe_competence_id: null })
const affirmationForm = ref({ name: '', description: '' })
const evidenceForm = ref({ name: '', description: '' })

// ============================================
// COMPUTED
// ============================================
const canManageCurriculum = computed(() => {
  return authStore.isAdmin
})

const currentItems = computed(() => {
  switch (activeTab.value) {
    case 'topics': return topics.value
    case 'components': return components.value
    case 'standards': return standards.value
    case 'tipe-competences': return tipeCompetences.value
    case 'competences': return competences.value
    case 'affirmations': return affirmations.value
    case 'evidences': return evidences.value
    default: return []
  }
})

const tabTitle = computed(() => {
  const titles = {
    'topics': 'Ejes Temáticos',
    'components': 'Componentes',
    'standards': 'Estándares',
    'tipe-competences': 'Tipos de Competencia',
    'competences': 'Competencias',
    'affirmations': 'Afirmaciones DNA/DBA',
    'evidences': 'Evidencias DNA/DBA'
  }
  return titles[activeTab.value] || ''
})

// ============================================
// CARGAR DATOS
// ============================================
const loadTopics = async () => {
  try {
    const response = await topicService.getAll(1, 100)
    topics.value = response.data || response
    console.log('✅ Ejes Temáticos cargados:', topics.value.length)
  } catch (error) {
    console.error('Error al cargar ejes temáticos:', error)
  }
}

const loadComponents = async () => {
  try {
    const response = await componentService.getAll(1, 100)
    components.value = response.data || response
    console.log('✅ Componentes cargados:', components.value.length)
  } catch (error) {
    console.error('Error al cargar componentes:', error)
  }
}

const loadStandards = async () => {
  try {
    const response = await standardService.getAll(1, 100)
    standards.value = response.data || response
    console.log('✅ Estándares cargados:', standards.value.length)
  } catch (error) {
    console.error('Error al cargar estándares:', error)
  }
}

const loadTipeCompetences = async () => {
  try {
    const response = await tipeCompetenceService.getAll(1, 100)
    tipeCompetences.value = response.data || response
    console.log('✅ Tipos de Competencia cargados:', tipeCompetences.value.length)
  } catch (error) {
    console.error('Error al cargar tipos de competencia:', error)
  }
}

const loadCompetences = async () => {
  try {
    const response = await competenceService.getAll(1, 100)
    competences.value = response.data || response
    console.log('✅ Competencias cargadas:', competences.value.length)
  } catch (error) {
    console.error('Error al cargar competencias:', error)
  }
}

const loadAffirmations = async () => {
  try {
    const response = await affirmationService.getAll(1, 100)
    affirmations.value = response.data || response
    console.log('✅ Afirmaciones cargadas:', affirmations.value.length)
  } catch (error) {
    console.error('Error al cargar afirmaciones:', error)
  }
}

const loadEvidences = async () => {
  try {
    const response = await evidenceService.getAll(1, 100)
    evidences.value = response.data || response
    console.log('✅ Evidencias cargadas:', evidences.value.length)
  } catch (error) {
    console.error('Error al cargar evidencias:', error)
  }
}

const loadAll = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadTopics(),
      loadComponents(),
      loadStandards(),
      loadTipeCompetences(),
      loadCompetences(),
      loadAffirmations(),
      loadEvidences()
    ])
  } finally {
    loading.value = false
  }
}

// ============================================
// ABRIR MODALES
// ============================================
const openCreateModal = (section) => {
  currentSection.value = section
  isEditing.value = false
  editingId.value = null
  resetForm(section)
  showModal.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  // ⭐ FIX: Asegurar que el estado esté limpio
  console.log('🆕 Crear:', section, '| isEditing:', isEditing.value)
  setTimeout(() => {
    if (isEditing.value || editingId.value) {
      isEditing.value = false
      editingId.value = null
    }
  }, 50)
}

const openEditModal = (item, section) => {
  currentSection.value = section
  isEditing.value = true
  editingId.value = item.id
  
  // Llenar formulario según la sección
  switch (section) {
    case 'topics':
      topicForm.value = { name: item.name, description: item.description }
      break
    case 'components':
      componentForm.value = { name: item.name, description: item.description }
      break
    case 'standards':
      standardForm.value = { name: item.name, description: item.description }
      break
    case 'tipe-competences':
      tipeCompetenceForm.value = { name: item.name }
      break
    case 'competences':
      competenceForm.value = { 
        description: item.description, 
        tipe_competence_id: item.tipe_competence_id 
      }
      break
    case 'affirmations':
      affirmationForm.value = { name: item.name, description: item.description }
      break
    case 'evidences':
      evidenceForm.value = { name: item.name, description: item.description }
      break
  }
  
  showModal.value = true
  errorMessage.value = ''
  successMessage.value = ''
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  currentSection.value = ''
}

const resetForm = (section) => {
  switch (section) {
    case 'topics':
      topicForm.value = { name: '', description: '' }
      break
    case 'components':
      componentForm.value = { name: '', description: '' }
      break
    case 'standards':
      standardForm.value = { name: '', description: '' }
      break
    case 'tipe-competences':
      tipeCompetenceForm.value = { name: '' }
      break
    case 'competences':
      competenceForm.value = { description: '', tipe_competence_id: null }
      break
    case 'affirmations':
      affirmationForm.value = { name: '', description: '' }
      break
    case 'evidences':
      evidenceForm.value = { name: '', description: '' }
      break
  }
}

// ============================================
// GUARDAR (CREAR O ACTUALIZAR)
// ============================================
const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    let service, formData, reloadFunction
    
    // Determinar servicio y datos según la sección
    switch (currentSection.value) {
      case 'topics':
        service = topicService
        formData = topicForm.value
        reloadFunction = loadTopics
        break
      case 'components':
        service = componentService
        formData = componentForm.value
        reloadFunction = loadComponents
        break
      case 'standards':
        service = standardService
        formData = standardForm.value
        reloadFunction = loadStandards
        break
      case 'tipe-competences':
        service = tipeCompetenceService
        formData = tipeCompetenceForm.value
        reloadFunction = loadTipeCompetences
        break
      case 'competences':
        service = competenceService
        formData = competenceForm.value
        reloadFunction = loadCompetences
        // Validar que se haya seleccionado un tipo de competencia
        if (!formData.tipe_competence_id) {
          errorMessage.value = 'Debes seleccionar un tipo de competencia'
          loading.value = false
          return
        }
        break
      case 'affirmations':
        service = affirmationService
        formData = affirmationForm.value
        reloadFunction = loadAffirmations
        break
      case 'evidences':
        service = evidenceService
        formData = evidenceForm.value
        reloadFunction = loadEvidences
        break
      default:
        throw new Error('Sección no válida')
    }

    // Validar campos requeridos
    if (currentSection.value !== 'tipe-competences' && currentSection.value !== 'competences') {
      if (!formData.name || !formData.description) {
        errorMessage.value = 'Nombre y descripción son obligatorios'
        loading.value = false
        return
      }
    } else if (currentSection.value === 'tipe-competences') {
      if (!formData.name) {
        errorMessage.value = 'El nombre es obligatorio'
        loading.value = false
        return
      }
    } else if (currentSection.value === 'competences') {
      if (!formData.description) {
        errorMessage.value = 'La descripción es obligatoria'
        loading.value = false
        return
      }
    }

    // Crear o actualizar
    if (isEditing.value) {
      await service.update(editingId.value, formData)
      successMessage.value = 'Actualizado exitosamente'
    } else {
      await service.create(formData)
      successMessage.value = 'Creado exitosamente'
    }

    // Recargar datos
    await reloadFunction()

    // Cerrar modal después de 1 segundo
    setTimeout(() => {
      closeModal()
    }, 1000)
  } catch (error) {
    console.error('Error al guardar:', error)
    errorMessage.value = error.response?.data?.message || 'Error al guardar'
  } finally {
    loading.value = false
  }
}

// ============================================
// ELIMINAR
// ============================================
const handleDelete = async (id, section) => {
  if (!confirm('¿Estás seguro de eliminar este elemento?')) return

  loading.value = true
  errorMessage.value = ''

  try {
    let service, reloadFunction

    switch (section) {
      case 'topics':
        service = topicService
        reloadFunction = loadTopics
        break
      case 'components':
        service = componentService
        reloadFunction = loadComponents
        break
      case 'standards':
        service = standardService
        reloadFunction = loadStandards
        break
      case 'tipe-competences':
        service = tipeCompetenceService
        reloadFunction = loadTipeCompetences
        break
      case 'competences':
        service = competenceService
        reloadFunction = loadCompetences
        break
      case 'affirmations':
        service = affirmationService
        reloadFunction = loadAffirmations
        break
      case 'evidences':
        service = evidenceService
        reloadFunction = loadEvidences
        break
      default:
        throw new Error('Sección no válida')
    }

    await service.delete(id)
    successMessage.value = 'Eliminado exitosamente'
    await reloadFunction()

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error al eliminar:', error)
    errorMessage.value = error.response?.data?.message || 'Error al eliminar'
  } finally {
    loading.value = false
  }
}

// ============================================
// OBTENER NOMBRE DEL TIPO DE COMPETENCIA
// ============================================
const getTipeCompetenceName = (tipeCompetenceId) => {
  const tipe = tipeCompetences.value.find(t => t.id === tipeCompetenceId)
  return tipe ? tipe.name : 'N/A'
}

// ============================================
// LIFECYCLE
// ============================================
onMounted(() => {
  loadAll()
})
</script>

<template>
  <div class="p-6">
    <!-- Alerta si no es admin -->
    <div v-if="!canManageCurriculum" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      <p class="font-semibold">⚠️ No tienes permisos</p>
      <p class="text-sm mt-1">Solo los administradores pueden gestionar la estructura curricular.</p>
    </div>

    <div v-else>
      <!-- Título -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Gestión de Estructura Curricular</h2>
        <p class="text-sm text-gray-600 mt-1">
          Administra los elementos del currículo: Ejes Temáticos, Componentes, Estándares, Competencias, Afirmaciones y Evidencias
        </p>
      </div>

      <!-- Mensajes globales -->
      <div v-if="successMessage" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage && !showModal" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ errorMessage }}
      </div>

      <!-- Tabs de navegación -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="flex space-x-4 overflow-x-auto">
          <button
            @click="activeTab = 'topics'"
            :class="[
              'px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors',
              activeTab === 'topics'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            1️⃣ Ejes Temáticos
          </button>
          <button
            @click="activeTab = 'components'"
            :class="[
              'px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors',
              activeTab === 'components'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            2️⃣ Componentes
          </button>
          <button
            @click="activeTab = 'standards'"
            :class="[
              'px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors',
              activeTab === 'standards'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            3️⃣ Estándares
          </button>
          <button
            @click="activeTab = 'tipe-competences'"
            :class="[
              'px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors',
              activeTab === 'tipe-competences'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            4️⃣ Tipos de Competencia
          </button>
          <button
            @click="activeTab = 'competences'"
            :class="[
              'px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors',
              activeTab === 'competences'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            5️⃣ Competencias
          </button>
          <button
            @click="activeTab = 'affirmations'"
            :class="[
              'px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors',
              activeTab === 'affirmations'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            6️⃣ Afirmaciones
          </button>
          <button
            @click="activeTab = 'evidences'"
            :class="[
              'px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors',
              activeTab === 'evidences'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            7️⃣ Evidencias
          </button>
        </nav>
      </div>

      <!-- Botón de crear -->
      <div class="mb-4">
        <button
          @click="openCreateModal(activeTab)"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Crear {{ tabTitle }}
        </button>
      </div>

      <!-- Tabla de datos -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th v-if="activeTab !== 'competences'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              <th v-if="activeTab === 'competences'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td :colspan="activeTab === 'competences' ? 4 : 4" class="px-6 py-4 text-center text-gray-500">
                Cargando...
              </td>
            </tr>
            <tr v-else-if="currentItems.length === 0">
              <td :colspan="activeTab === 'competences' ? 4 : 4" class="px-6 py-4 text-center text-gray-500">
                No hay {{ tabTitle.toLowerCase() }} registrados
              </td>
            </tr>
            <tr v-else v-for="item in currentItems" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.id }}</td>
              <td v-if="activeTab !== 'competences'" class="px-6 py-4 text-sm font-medium text-gray-900">
                {{ item.name }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ item.description }}</td>
              <td v-if="activeTab === 'competences'" class="px-6 py-4 text-sm text-gray-500">
                <span class="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">
                  {{ getTipeCompetenceName(item.tipe_competence_id) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button
                  @click="openEditModal(item, activeTab)"
                  class="text-blue-600 hover:text-blue-800"
                  :disabled="loading"
                >
                  Editar
                </button>
                <button
                  @click="handleDelete(item.id, activeTab)"
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
    </div>

    <!-- Modal de creación/edición -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div class="p-6 border-b">
          <h3 class="text-xl font-bold">
            {{ isEditing ? 'Editar' : 'Crear' }} {{ tabTitle }}
          </h3>
        </div>

        <div class="overflow-y-auto p-6 flex-1">
          <!-- Mensajes en modal -->
          <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {{ errorMessage }}
          </div>

          <!-- Formulario para Ejes Temáticos -->
          <form v-if="currentSection === 'topics'" @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                v-model="topicForm.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
                placeholder="Ej: Pensamiento Numérico"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea
                v-model="topicForm.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
                placeholder="Describe el eje temático..."
              ></textarea>
            </div>
          </form>

          <!-- Formulario para Componentes -->
          <form v-if="currentSection === 'components'" @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                v-model="componentForm.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
                placeholder="Ej: Numérico-Variacional"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea
                v-model="componentForm.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
                placeholder="Describe el componente..."
              ></textarea>
            </div>
          </form>

          <!-- Formulario para Estándares -->
          <form v-if="currentSection === 'standards'" @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                v-model="standardForm.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
                placeholder="Ej: Estándar Básico de Competencias"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea
                v-model="standardForm.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
                placeholder="Describe el estándar..."
              ></textarea>
            </div>
          </form>

          <!-- Formulario para Tipos de Competencia -->
          <form v-if="currentSection === 'tipe-competences'" @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                v-model="tipeCompetenceForm.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
                placeholder="Ej: Comunicativa, Científica, Ciudadana"
              />
            </div>
          </form>

          <!-- Formulario para Competencias -->
          <form v-if="currentSection === 'competences'" @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Competencia *</label>
              <select
                v-model="competenceForm.tipe_competence_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
              >
                <option :value="null">Selecciona un tipo</option>
                <option v-for="tipe in tipeCompetences" :key="tipe.id" :value="tipe.id">
                  {{ tipe.name }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea
                v-model="competenceForm.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
                placeholder="Describe la competencia..."
              ></textarea>
            </div>
          </form>

          <!-- Formulario para Afirmaciones -->
          <form v-if="currentSection === 'affirmations'" @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                v-model="affirmationForm.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
                placeholder="Ej: Afirmación DNA/DBA"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea
                v-model="affirmationForm.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
                placeholder="Describe la afirmación..."
              ></textarea>
            </div>
          </form>

          <!-- Formulario para Evidencias -->
          <form v-if="currentSection === 'evidences'" @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                v-model="evidenceForm.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
                placeholder="Ej: Evidencia de Aprendizaje"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea
                v-model="evidenceForm.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
                placeholder="Describe la evidencia..."
              ></textarea>
            </div>
          </form>
        </div>

        <!-- Botones del modal -->
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
  </div>
</template>
