<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserManagement from './UserManagement.vue'
import SchoolManagement from './SchoolManagement.vue'
import CurriculumManagement from './CurriculumManagement.vue'
import CurriculumAssignment from '@/components/CurriculumAssignment.vue'
import { curriculumGridService } from '@/api/curriculumGridService'
import { curriculumAssignmentService } from '@/api/curriculumAssignmentService'
import { gradeService, subjectService } from '@/api/curriculumService'
import { scheduleService, weekService } from '@/api/scheduleService'

const router = useRouter()
const authStore = useAuthStore()
const activeTab = ref('home')

// ═══════════════════════════════════════════════════════════════════
// ESTADO PARA COORDINADORES
// ═══════════════════════════════════════════════════════════════════
const loadingGrids = ref(false)
const loadingTeachers = ref(false)
const allGrids = ref([])
const teachers = ref([])
const grades = ref([])
const subjects = ref([])
const selectedSchool = ref(null)
const selectedGrade = ref(null)
const selectedSubject = ref(null)
const showAssignmentModal = ref(false)
const selectedGridForAssignment = ref(null)
const showGridDetails = ref(false)
const selectedGrid = ref(null)

// ═══════════════════════════════════════════════════════════════════
// ESTADO PARA PROFESORES
// ═══════════════════════════════════════════════════════════════════
const loadingAssignments = ref(false)
const myAssignments = ref([])
const mySchedules = ref([])
const loadingSchedules = ref(false)
const showScheduleModal = ref(false)
const scheduleForm = ref({
  week_ids: [],
  topic_id: null,
  component_id: null,
  didactic_unit_id: null,
  standard_id: null,
  competence_id: null,
  affirmation_id: null,
  evidence_id: null,
  school_id: null,
  executed: false,
  observation: ''
})
const weeks = ref([])
const selectedAssignmentForSchedule = ref(null)

// ═══════════════════════════════════════════════════════════════════
// HELPER: Filtrar array eliminando nulls/undefined
// ═══════════════════════════════════════════════════════════════════
const filterValidItems = (arr) => {
  if (!Array.isArray(arr)) return []
  return arr.filter(item => item != null && item !== undefined && typeof item === 'object')
}

// ═══════════════════════════════════════════════════════════════════
// COMPUTED
// ═══════════════════════════════════════════════════════════════════
const userSchools = computed(() => filterValidItems(authStore.user?.schools))

const validGrades = computed(() => filterValidItems(grades.value))
const validSubjects = computed(() => filterValidItems(subjects.value))
const validTeachers = computed(() => filterValidItems(teachers.value))
const validWeeks = computed(() => filterValidItems(weeks.value))

const filteredGrids = computed(() => {
  let filtered = filterValidItems(allGrids.value)
  
  if (selectedGrade.value) {
    filtered = filtered.filter(g => g.grade_id === selectedGrade.value)
  }
  if (selectedSubject.value) {
    filtered = filtered.filter(g => g.subject_id === selectedSubject.value)
  }
  
  return filtered.filter(g => g.active)
})

const totalGrids = computed(() => filterValidItems(allGrids.value).filter(g => g.active).length)
const totalTeachers = computed(() => validTeachers.value.length)

const executedSchedules = computed(() => {
  return filterValidItems(mySchedules.value).filter(s => s.executed).length
})

const progressPercentage = computed(() => {
  const total = filterValidItems(mySchedules.value).length
  if (total === 0) return 0
  return Math.round((executedSchedules.value / total) * 100)
})

const coordinatorFirstSchool = computed(() => {
  const schools = userSchools.value
  return schools.length > 0 ? schools[0].id : null
})

const safeAssignmentData = computed(() => {
  if (!selectedAssignmentForSchedule.value) return null
  
  const assignment = selectedAssignmentForSchedule.value
  return {
    ...assignment,
    topics: filterValidItems(assignment.topics),
    components: filterValidItems(assignment.components),
    standards: filterValidItems(assignment.standards),
    competences: filterValidItems(assignment.competences),
    affirmations: filterValidItems(assignment.affirmations),
    evidences: filterValidItems(assignment.evidences)
  }
})

// ═══════════════════════════════════════════════════════════════════
// MÉTODOS GENERALES
// ═══════════════════════════════════════════════════════════════════
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const setActiveTab = (tab) => {
  activeTab.value = tab
  
  if (tab === 'assign-grids' && authStore.isCoordinator) {
    loadCoordinatorData()
  } else if (tab === 'my-grids' && authStore.isTeacher) {
    loadTeacherAssignments()
  } else if (tab === 'my-schedules' && authStore.isTeacher) {
    loadTeacherSchedules()
  }
}

const goToMallaCurricular = () => {
  router.push('/malla-curricular')
}

// ═══════════════════════════════════════════════════════════════════
// MÉTODOS PARA COORDINADORES
// ═══════════════════════════════════════════════════════════════════
const loadCoordinatorData = async () => {
  if (coordinatorFirstSchool.value && !selectedSchool.value) {
    selectedSchool.value = coordinatorFirstSchool.value
  }
  
  await Promise.all([
    loadGrids(),
    loadTeachers(),
    loadGrades(),
    loadSubjects()
  ])
}

const loadGrids = async () => {
  loadingGrids.value = true
  try {
    const response = await curriculumGridService.getAll(1, 100)
    const data = response.data || response
    allGrids.value = filterValidItems(data)
    console.log('✅ Mallas cargadas:', allGrids.value.length)
  } catch (error) {
    console.error('Error cargando mallas:', error)
    allGrids.value = []
  } finally {
    loadingGrids.value = false
  }
}

const loadTeachers = async () => {
  loadingTeachers.value = true
  try {
    const schoolId = selectedSchool.value || coordinatorFirstSchool.value
    const data = await curriculumAssignmentService.getAvailableTeachers(schoolId)
    teachers.value = filterValidItems(data)
    console.log('✅ Profesores cargados:', teachers.value.length)
  } catch (error) {
    console.error('Error cargando profesores:', error)
    teachers.value = []
  } finally {
    loadingTeachers.value = false
  }
}

const loadGrades = async () => {
  try {
    const response = await gradeService.getAll()
    const data = response.data || response
    grades.value = filterValidItems(data)
    console.log('✅ Grados cargados:', grades.value.length)
  } catch (error) {
    console.error('Error cargando grados:', error)
    grades.value = []
  }
}

const loadSubjects = async () => {
  try {
    const response = await subjectService.getAll()
    const data = response.data || response
    subjects.value = filterValidItems(data)
    console.log('✅ Materias cargadas:', subjects.value.length)
  } catch (error) {
    console.error('Error cargando materias:', error)
    subjects.value = []
  }
}

const assignGrid = (grid) => {
  console.log('📋 Abriendo modal de asignación...')
  console.log('Malla:', grid.grade_name, '-', grid.subject_name)
  console.log('Profesores disponibles:', validTeachers.value.length)
  
  selectedGridForAssignment.value = grid
  showAssignmentModal.value = true
}

const closeAssignmentModal = () => {
  console.log('❌ Cerrando modal de asignación')
  showAssignmentModal.value = false
  selectedGridForAssignment.value = null
}

const handleAssignmentSuccess = () => {
  closeAssignmentModal()
  alert('✅ Malla asignada exitosamente')
  // Recargar datos si es necesario
  loadGrids()
}

const viewGridDetails = (grid) => {
  selectedGrid.value = grid
  showGridDetails.value = true
}

const closeGridDetails = () => {
  showGridDetails.value = false
  selectedGrid.value = null
}

// ═══════════════════════════════════════════════════════════════════
// MÉTODOS PARA PROFESORES
// ═══════════════════════════════════════════════════════════════════
const loadTeacherAssignments = async () => {
  loadingAssignments.value = true
  try {
    const data = await curriculumAssignmentService.getMyAssignments()
    myAssignments.value = filterValidItems(data)
  } catch (error) {
    console.error('Error cargando asignaciones:', error)
    myAssignments.value = []
  } finally {
    loadingAssignments.value = false
  }
}

const loadTeacherSchedules = async () => {
  loadingSchedules.value = true
  try {
    const response = await scheduleService.getAll({}, 1, 1000)
    const data = response.data || response
    mySchedules.value = filterValidItems(data)
  } catch (error) {
    console.error('Error cargando cronogramas:', error)
    mySchedules.value = []
  } finally {
    loadingSchedules.value = false
  }
}

const loadWeeks = async () => {
  try {
    const response = await weekService.getAll()
    const data = response.data || response
    weeks.value = filterValidItems(data)
  } catch (error) {
    console.error('Error cargando semanas:', error)
    weeks.value = []
  }
}

const openScheduleModal = (assignment) => {
  console.log('📋 Abriendo modal de cronograma')
  console.log('Assignment recibido:', assignment)
  
  selectedAssignmentForSchedule.value = assignment
  
  const schools = userSchools.value
  const firstSchoolId = schools.length > 0 ? schools[0].id : null
  const assignmentSchoolId = assignment.school_id || firstSchoolId
  
  const safeTopics = filterValidItems(assignment.topics)
  const safeComponents = filterValidItems(assignment.components)
  const safeStandards = filterValidItems(assignment.standards)
  const safeCompetences = filterValidItems(assignment.competences)
  const safeAffirmations = filterValidItems(assignment.affirmations)
  const safeEvidences = filterValidItems(assignment.evidences)
  
  console.log('📊 Elementos disponibles:')
  console.log('- Topics:', safeTopics.length)
  console.log('- Components:', safeComponents.length)
  console.log('- Standards:', safeStandards.length)
  console.log('- Competences:', safeCompetences.length)
  console.log('- Affirmations:', safeAffirmations.length)
  console.log('- Evidences:', safeEvidences.length)
  
  scheduleForm.value = {
    week_ids: [],
    topic_id: safeTopics.length > 0 ? safeTopics[0].id : null,
    component_id: safeComponents.length > 0 ? safeComponents[0].id : null,
    didactic_unit_id: null,  // ⭐ El backend lo auto-asignará
    standard_id: safeStandards.length > 0 ? safeStandards[0].id : null,
    competence_id: safeCompetences.length > 0 ? safeCompetences[0].id : null,
    affirmation_id: safeAffirmations.length > 0 ? safeAffirmations[0].id : null,
    evidence_id: safeEvidences.length > 0 ? safeEvidences[0].id : null,
    school_id: assignmentSchoolId,
    executed: false,
    observation: ''
  }
  
  console.log('📝 Formulario inicializado:', scheduleForm.value)
  
  showScheduleModal.value = true
}

const closeScheduleModal = () => {
  showScheduleModal.value = false
  selectedAssignmentForSchedule.value = null
}

const saveSchedule = async () => {
  // Validar selección de semanas
  if (scheduleForm.value.week_ids.length === 0) {
    alert('⚠️ Debes seleccionar al menos una semana')
    return
  }

  if (!selectedAssignmentForSchedule.value) {
    alert('❌ Error: No hay asignación seleccionada')
    return
  }

  const assignment = selectedAssignmentForSchedule.value

  // ⭐ didactic_unit_id siempre será null - El backend lo auto-asignará
  let didacticUnitId = null

  // ⭐ INTENTAR OBTENER school_id
  let schoolId = assignment.school_id
  
  if (!schoolId && userSchools.value.length > 0) {
    schoolId = userSchools.value[0].id
  }
  
  if (!schoolId && authStore.user?.schools && authStore.user.schools.length > 0) {
    schoolId = authStore.user.schools[0].id
  }

  // ⭐ MOSTRAR ADVERTENCIAS
  const warnings = []
  
  if (!didacticUnitId) {
    warnings.push('⚠️ Unidad Didáctica no encontrada')
  }
  
  if (!schoolId) {
    warnings.push('⚠️ Colegio no encontrado')
  }

  if (warnings.length > 0) {
    console.warn('⚠️ ADVERTENCIAS:', warnings)
    
    const shouldContinue = confirm(
      `Se detectaron problemas:\n\n${warnings.join('\n')}\n\n` +
      '¿Intentar crear el cronograma de todas formas?\n\n' +
      'NOTA: Puede fallar si el backend requiere estos campos.'
    )
    
    if (!shouldContinue) {
      return
    }
  }

  // ⭐ PREPARAR DATOS SIN CAMPOS NULL
  const scheduleData = {
    curriculum_grid_id: assignment.curriculum_grid_id, // ⭐ IMPORTANTE para auto-asignación
    grade_id: assignment.grade_id,
    subject_id: assignment.subject_id,
    topic_id: scheduleForm.value.topic_id,
    component_id: scheduleForm.value.component_id,
    standard_id: scheduleForm.value.standard_id,
    competence_id: scheduleForm.value.competence_id,
    affirmation_id: scheduleForm.value.affirmation_id,
    evidence_id: scheduleForm.value.evidence_id,
    executed: scheduleForm.value.executed || false,
    observation: scheduleForm.value.observation || ''
  }
  
  if (didacticUnitId) scheduleData.didactic_unit_id = didacticUnitId
  if (schoolId) scheduleData.school_id = schoolId

  console.log('📋 DATOS A ENVIAR:')
  console.log(JSON.stringify(scheduleData, null, 2))
  console.log('Week IDs:', scheduleForm.value.week_ids)
  console.log('')
  console.log('🔍 DEBUG INFO:')
  console.log('Didactic Unit ID:', didacticUnitId)
  console.log('School ID:', schoolId)

  try {
    console.log('🔄 Enviando al servidor...')
    
    const response = await scheduleService.createBatch(
      scheduleData,
      scheduleForm.value.week_ids
    )
    
    console.log('✅ Éxito:', response)
    
    closeScheduleModal()
    loadTeacherSchedules()
    alert('✅ Cronograma creado exitosamente')
  } catch (error) {
    console.error('❌ ERROR:', error)
    console.error('Response:', error.response?.data)
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      const messages = Object.entries(errors)
        .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
        .join('\n')
      
      alert(
        `❌ Errores de validación:\n\n${messages}\n\n` +
        '🔧 SOLUCIÓN:\n' +
        '1. Asigna un colegio al profesor\n' +
        '2. Verifica que los topics tengan didactic_unit_id\n' +
        '3. Asegura que la asignación tenga school_id'
      )
    } else {
      alert('❌ Error al guardar. Revisa la consola.')
    }
  }
}

const toggleScheduleExecuted = async (schedule) => {
  try {
    await scheduleService.markAsExecuted(schedule.id, !schedule.executed, schedule.observation)
    loadTeacherSchedules()
  } catch (error) {
    console.error('Error actualizando estado:', error)
  }
}


// ═══════════════════════════════════════════════════════════════════
// FUNCIÓN PARA ESTUDIANTES - MOODLE
// ═══════════════════════════════════════════════════════════════════
const openMoodle = () => {
  window.open('https://gestionacademica.mediasoftwarerionegro.site/', '_blank')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// ═══════════════════════════════════════════════════════════════════
// LIFECYCLE
// ═══════════════════════════════════════════════════════════════════
onMounted(async () => {
  await loadWeeks()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Sistema de Gestión Académica</h1>
        <div class="flex items-center gap-4">
          <div class="text-sm text-gray-600">
            <p class="font-medium">{{ authStore.user?.first_name }} {{ authStore.user?.last_name }}</p>
            <p class="text-xs">{{ authStore.user?.email }}</p>
          </div>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex space-x-4 overflow-x-auto">
          <button
            @click="setActiveTab('home')"
            :class="[
              'px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap',
              activeTab === 'home' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            🏠 Inicio
          </button>

          <button
            v-if="authStore.isAdmin"
            @click="setActiveTab('schools')"
            :class="[
              'px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap',
              activeTab === 'schools' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            🏫 Colegios
          </button>

          <button
            v-if="authStore.isAdmin || authStore.isCoordinator"
            @click="setActiveTab('users')"
            :class="[
              'px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap',
              activeTab === 'users' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            👥 Gestión de Usuarios
          </button>

          <button
            v-if="authStore.isAdmin"
            @click="setActiveTab('curriculum')"
            :class="[
              'px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap',
              activeTab === 'curriculum' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            📚 Estructura Curricular
          </button>

          <button
            v-if="authStore.isAdmin"
            @click="goToMallaCurricular"
            class="px-4 py-3 font-medium text-sm transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-50 whitespace-nowrap"
          >
            📊 Malla Curricular
          </button>

          <button
            v-if="authStore.isCoordinator"
            @click="setActiveTab('assign-grids')"
            :class="[
              'px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap',
              activeTab === 'assign-grids' 
                ? 'border-b-2 border-purple-600 text-purple-600' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            ✏️ Asignar Mallas
          </button>

          <button
            v-if="authStore.isTeacher"
            @click="setActiveTab('my-grids')"
            :class="[
              'px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap',
              activeTab === 'my-grids' 
                ? 'border-b-2 border-green-600 text-green-600' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            📚 Mis Mallas
          </button>

          <button
            v-if="authStore.isTeacher"
            @click="setActiveTab('my-schedules')"
            :class="[
              'px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap',
              activeTab === 'my-schedules' 
                ? 'border-b-2 border-green-600 text-green-600' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            📅 Cronogramas
          </button>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- HOME TAB -->
      <div v-if="activeTab === 'home'" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Bienvenido al Sistema de Gestión Académica</h2>
        
        <div class="space-y-2">
          <p><strong>Usuario:</strong> {{ authStore.user?.username }}</p>
          <p><strong>Email:</strong> {{ authStore.user?.email }}</p>
          <p><strong>Roles:</strong> 
            <span v-for="role in (authStore.user?.roles || [])" :key="role?.id || Math.random()" class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {{ role?.name }}
            </span>
          </p>
        </div>

        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-semibold mb-2">Permisos:</h3>
          <ul class="list-disc list-inside text-sm text-gray-700">
            <li v-if="authStore.isAdmin">✅ Acceso total a la API (Admin)</li>
            <li v-if="authStore.isCoordinator">✅ Ver información, registrar usuarios, asignar mallas (Coordinador)</li>
            <li v-if="authStore.isTeacher">✅ Ver mallas asignadas, crear cronogramas (Profesor)</li>
            <li v-if="authStore.isStudent">✅ Solo ver información (Estudiante)</li>
          </ul>
        </div>

        <div class="mt-6">
          <h3 class="font-semibold mb-3">Acceso Rápido:</h3>
          <div class="grid grid-cols-2 gap-4">
            <template v-if="authStore.isAdmin">
              <button
                @click="setActiveTab('curriculum')"
                class="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
              >
                <div class="text-3xl mb-2">📚</div>
                <div class="font-semibold">Estructura Curricular</div>
                <div class="text-sm text-gray-600">Gestiona elementos individuales</div>
              </button>
              
              <button
                @click="goToMallaCurricular"
                class="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-left"
              >
                <div class="text-3xl mb-2">📊</div>
                <div class="font-semibold">Malla Curricular</div>
                <div class="text-sm text-gray-600">Relaciona Grado + Asignatura</div>
              </button>
            </template>

            <template v-if="authStore.isCoordinator">
              <button
                @click="setActiveTab('users')"
                class="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
              >
                <div class="text-3xl mb-2">👥</div>
                <div class="font-semibold">Gestión de Usuarios</div>
                <div class="text-sm text-gray-600">Administrar profesores y estudiantes</div>
              </button>
              
              <button
                @click="setActiveTab('assign-grids')"
                class="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
              >
                <div class="text-3xl mb-2">✏️</div>
                <div class="font-semibold">Asignar Mallas</div>
                <div class="text-sm text-gray-600">Asignar mallas a profesores</div>
              </button>
            </template>

            <template v-if="authStore.isTeacher">
              <button
                @click="setActiveTab('my-grids')"
                class="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-left"
              >
                <div class="text-3xl mb-2">📚</div>
                <div class="font-semibold">Mis Mallas</div>
                <div class="text-sm text-gray-600">Ver mallas asignadas</div>
              </button>
              
              <button
                @click="setActiveTab('my-schedules')"
                class="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-left"
              >
                <div class="text-3xl mb-2">📅</div>
                <div class="font-semibold">Cronogramas</div>
                <div class="text-sm text-gray-600">Gestionar cronogramas de clase</div>
              </button>
            </template>

            <!-- ⭐ BOTONES PARA ESTUDIANTES -->
            <template v-if="authStore.isStudent">
              <button
                @click="openMoodle"
                class="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all text-left"
              >
                <div class="text-3xl mb-2">🎓</div>
                <div class="font-semibold">Acceder a Moodle</div>
                <div class="text-sm text-gray-600">Plataforma de aprendizaje</div>
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- SCHOOLS TAB -->
      <div v-if="activeTab === 'schools' && authStore.isAdmin" class="bg-white rounded-lg shadow">
        <SchoolManagement />
      </div>

      <!-- USERS TAB -->
      <div v-if="activeTab === 'users' && (authStore.isAdmin || authStore.isCoordinator)" class="bg-white rounded-lg shadow">
        <UserManagement />
      </div>

      <!-- CURRICULUM TAB -->
      <div v-if="activeTab === 'curriculum' && authStore.isAdmin">
        <CurriculumManagement />
      </div>

      <!-- ASIGNAR MALLAS TAB -->
      <div v-if="activeTab === 'assign-grids' && authStore.isCoordinator">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Asignar Mallas a Profesores</h2>
            <p class="text-gray-600">Selecciona una malla y asígnala a profesores de tu colegio</p>
          </div>

          <!-- Estadísticas -->
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-4 rounded-lg">
              <div class="text-3xl font-bold">{{ totalGrids }}</div>
              <div class="text-sm opacity-90">Mallas Disponibles</div>
            </div>
            <div class="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-4 rounded-lg">
              <div class="text-3xl font-bold">{{ totalTeachers }}</div>
              <div class="text-sm opacity-90">Profesores</div>
            </div>
            <div class="bg-gradient-to-br from-green-500 to-green-700 text-white p-4 rounded-lg">
              <div class="text-3xl font-bold">{{ userSchools.length }}</div>
              <div class="text-sm opacity-90">Colegios</div>
            </div>
          </div>

          <!-- Info -->
          <div v-if="userSchools.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div class="flex items-start gap-3">
              <span class="text-2xl">ℹ️</span>
              <div>
                <p class="font-semibold text-blue-900">Profesores de tu colegio</p>
                <p class="text-sm text-blue-700">Colegio: <strong>{{ userSchools[0]?.name }}</strong></p>
              </div>
            </div>
          </div>

          <!-- Filtros -->
          <div class="flex gap-4 mb-6">
            <select v-model="selectedGrade" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
              <option :value="null">Todos los grados</option>
              <option v-for="grade in validGrades" :key="grade.id" :value="grade.id">
                {{ grade.name }}
              </option>
            </select>

            <select v-model="selectedSubject" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
              <option :value="null">Todas las materias</option>
              <option v-for="subject in validSubjects" :key="subject.id" :value="subject.id">
                {{ subject.name }}
              </option>
            </select>
          </div>

          <!-- Lista de Mallas -->
          <div v-if="loadingGrids" class="text-center py-8 text-gray-600">
            Cargando mallas...
          </div>
          <div v-else-if="filteredGrids.length === 0" class="text-center py-8 text-gray-600">
            No hay mallas disponibles
          </div>
          <div v-else class="grid gap-4">
            <div v-for="grid in filteredGrids" :key="grid.id" 
                 class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-semibold text-lg">{{ grid.grade_name }} - {{ grid.subject_name }}</h3>
                  <p class="text-gray-600 text-sm mt-1">{{ grid.description || 'Sin descripción' }}</p>
                  <div class="flex gap-3 mt-2 text-sm text-gray-500">
                    <span>📋 {{ filterValidItems(grid.topics).length }} ejes</span>
                    <span>🧩 {{ filterValidItems(grid.components).length }} componentes</span>
                    <span>📊 {{ filterValidItems(grid.standards).length }} estándares</span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button @click="viewGridDetails(grid)"
                          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    👁️ Ver
                  </button>
                  <button @click="assignGrid(grid)"
                          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                    ✏️ Asignar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MIS MALLAS TAB (Profesor) -->
      <div v-if="activeTab === 'my-grids' && authStore.isTeacher">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Mis Mallas Asignadas</h2>
            <p class="text-gray-600">Mallas curriculares que tienes asignadas</p>
          </div>

          <div v-if="loadingAssignments" class="text-center py-8 text-gray-600">
            Cargando mallas...
          </div>
          <div v-else-if="myAssignments.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">📚</div>
            <h3 class="text-xl font-semibold text-gray-700">No tienes mallas asignadas</h3>
            <p class="text-gray-600 mt-2">Espera a que tu coordinador te asigne mallas</p>
          </div>
          <div v-else class="grid gap-4">
            <div v-for="assignment in myAssignments" :key="assignment.curriculum_grid_id"
                 class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-semibold text-lg">{{ assignment.grade_name }} - {{ assignment.subject_name }}</h3>
                  <p class="text-gray-600 text-sm mt-1">{{ assignment.description || 'Sin descripción' }}</p>
                  <div class="flex gap-3 mt-2 text-sm text-gray-500">
                    <span v-if="assignment.school_name">🏫 {{ assignment.school_name }}</span>
                    <span v-if="assignment.assigned_by_name">👤 {{ assignment.assigned_by_name }}</span>
                    <span>📅 {{ formatDate(assignment.assigned_at) }}</span>
                  </div>
                </div>
                <button @click="openScheduleModal(assignment)"
                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm whitespace-nowrap">
                  📅 Crear Cronograma
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CRONOGRAMAS TAB (Profesor) -->
      <div v-if="activeTab === 'my-schedules' && authStore.isTeacher">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Mis Cronogramas</h2>
            <p class="text-gray-600">Gestiona tus cronogramas de clase</p>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-4 rounded-lg">
              <div class="text-3xl font-bold">{{ mySchedules.length }}</div>
              <div class="text-sm opacity-90">Total Clases</div>
            </div>
            <div class="bg-gradient-to-br from-green-500 to-green-700 text-white p-4 rounded-lg">
              <div class="text-3xl font-bold">{{ executedSchedules }}</div>
              <div class="text-sm opacity-90">Ejecutadas</div>
            </div>
            <div class="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-4 rounded-lg">
              <div class="text-3xl font-bold">{{ progressPercentage }}%</div>
              <div class="text-sm opacity-90">Progreso</div>
            </div>
          </div>

          <div v-if="loadingSchedules" class="text-center py-8 text-gray-600">
            Cargando...
          </div>
          <div v-else-if="mySchedules.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">📅</div>
            <h3 class="text-xl font-semibold text-gray-700">No tienes cronogramas</h3>
            <p class="text-gray-600 mt-2">Ve a "Mis Mallas" para crear tu primer cronograma</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semana</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grado - Materia</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observación</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="schedule in mySchedules" :key="schedule.id"
                    :class="{ 'bg-green-50': schedule.executed }">
                  <td class="px-4 py-3 text-sm">Semana {{ schedule.week_id }}</td>
                  <td class="px-4 py-3 text-sm">Grado {{ schedule.grade_id }} - Materia {{ schedule.subject_id }}</td>
                  <td class="px-4 py-3">
                    <span :class="[
                      'px-2 py-1 text-xs rounded-full',
                      schedule.executed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    ]">
                      {{ schedule.executed ? '✅ Ejecutada' : '⏳ Pendiente' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600">
                    {{ schedule.observation || '-' }}
                  </td>
                  <td class="px-4 py-3">
                    <button @click="toggleScheduleExecuted(schedule)"
                            :class="[
                              'px-3 py-1 rounded text-sm',
                              schedule.executed
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            ]">
                      {{ schedule.executed ? '↩️ Pendiente' : '✓ Ejecutada' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>


    </main>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- MODALES -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->

    <!-- ⭐ MODAL REAL DE ASIGNACIÓN ⭐ -->
    <CurriculumAssignment
      v-if="showAssignmentModal"
      :grid="selectedGridForAssignment"
      :teachers="validTeachers"
      :schools="userSchools"
      @close="closeAssignmentModal"
      @assigned="handleAssignmentSuccess"
    />

    <!-- Modal de Detalles de Malla -->
    <div v-if="showGridDetails" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
         @click="closeGridDetails">
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">Detalles de la Malla</h2>
            <button @click="closeGridDetails" class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
          </div>
        </div>
        <div class="p-6" v-if="selectedGrid">
          <h3 class="text-xl font-semibold mb-2">{{ selectedGrid.grade_name }} - {{ selectedGrid.subject_name }}</h3>
          <p class="text-gray-600 mb-4">{{ selectedGrid.description }}</p>
          
          <div class="space-y-4">
            <div v-if="filterValidItems(selectedGrid.topics).length > 0">
              <h4 class="font-semibold text-purple-600 mb-2">📋 Ejes Temáticos</h4>
              <ul class="list-disc list-inside text-sm text-gray-700">
                <li v-for="topic in filterValidItems(selectedGrid.topics)" :key="topic.id">{{ topic.name }}</li>
              </ul>
            </div>
            <div v-if="filterValidItems(selectedGrid.components).length > 0">
              <h4 class="font-semibold text-blue-600 mb-2">🧩 Componentes</h4>
              <ul class="list-disc list-inside text-sm text-gray-700">
                <li v-for="comp in filterValidItems(selectedGrid.components)" :key="comp.id">{{ comp.name }}</li>
              </ul>
            </div>
            <div v-if="filterValidItems(selectedGrid.standards).length > 0">
              <h4 class="font-semibold text-green-600 mb-2">📊 Estándares</h4>
              <ul class="list-disc list-inside text-sm text-gray-700">
                <li v-for="std in filterValidItems(selectedGrid.standards)" :key="std.id">{{ std.name }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="p-6 border-t flex justify-end gap-3">
          <button @click="assignGrid(selectedGrid)"
                  class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Asignar a Profesores
          </button>
          <button @click="closeGridDetails"
                  class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Crear Cronograma -->
    <div v-if="showScheduleModal && safeAssignmentData" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
         @click="closeScheduleModal">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold">Crear Cronograma</h2>
              <p class="text-gray-600 text-sm mt-1">
                {{ safeAssignmentData.grade_name }} - {{ safeAssignmentData.subject_name }}
              </p>
            </div>
            <button @click="closeScheduleModal" class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
          </div>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveSchedule" class="space-y-4">
            <!-- Selección de Semanas -->
            <div>
              <label class="block font-medium mb-2">Semanas (selecciona una o varias)</label>
              <div class="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border rounded">
                <label v-for="week in validWeeks" :key="week.id" 
                       class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input type="checkbox" :value="week.id" v-model="scheduleForm.week_ids" class="rounded">
                  <span class="text-sm">Semana {{ week.week_number }}</span>
                </label>
              </div>
            </div>

            <!-- Eje Temático -->
            <div v-if="safeAssignmentData.topics.length > 0">
              <label class="block font-medium mb-2">Eje Temático *</label>
              <select v-model="scheduleForm.topic_id" required class="w-full px-4 py-2 border rounded-lg">
                <option :value="null">-- Seleccionar --</option>
                <option v-for="topic in safeAssignmentData.topics" :key="topic.id" :value="topic.id">
                  {{ topic.name }}
                </option>
              </select>
            </div>

            <!-- Componente -->
            <div v-if="safeAssignmentData.components.length > 0">
              <label class="block font-medium mb-2">Componente *</label>
              <select v-model="scheduleForm.component_id" required class="w-full px-4 py-2 border rounded-lg">
                <option :value="null">-- Seleccionar --</option>
                <option v-for="comp in safeAssignmentData.components" :key="comp.id" :value="comp.id">
                  {{ comp.name }}
                </option>
              </select>
            </div>

            <!-- Estándar -->
            <div v-if="safeAssignmentData.standards.length > 0">
              <label class="block font-medium mb-2">Estándar *</label>
              <select v-model="scheduleForm.standard_id" required class="w-full px-4 py-2 border rounded-lg">
                <option :value="null">-- Seleccionar --</option>
                <option v-for="std in safeAssignmentData.standards" :key="std.id" :value="std.id">
                  {{ std.name }}
                </option>
              </select>
            </div>

            <!-- Competencia -->
            <div v-if="safeAssignmentData.competences.length > 0">
              <label class="block font-medium mb-2">Competencia *</label>
              <select v-model="scheduleForm.competence_id" required class="w-full px-4 py-2 border rounded-lg">
                <option :value="null">-- Seleccionar --</option>
                <option v-for="comp in safeAssignmentData.competences" :key="comp.id" :value="comp.id">
                  {{ comp.description }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- Afirmación -->
              <div v-if="safeAssignmentData.affirmations.length > 0">
                <label class="block font-medium mb-2">Afirmación DNA/DBA *</label>
                <select v-model="scheduleForm.affirmation_id" required class="w-full px-4 py-2 border rounded-lg">
                  <option :value="null">-- Seleccionar --</option>
                  <option v-for="aff in safeAssignmentData.affirmations" :key="aff.id" :value="aff.id">
                    {{ aff.name }}
                  </option>
                </select>
              </div>

              <!-- Evidencia -->
              <div v-if="safeAssignmentData.evidences.length > 0">
                <label class="block font-medium mb-2">Evidencia DNA/DBA *</label>
                <select v-model="scheduleForm.evidence_id" required class="w-full px-4 py-2 border rounded-lg">
                  <option :value="null">-- Seleccionar --</option>
                  <option v-for="evid in safeAssignmentData.evidences" :key="evid.id" :value="evid.id">
                    {{ evid.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Observación -->
            <div>
              <label class="block font-medium mb-2">Observación (Opcional)</label>
              <textarea v-model="scheduleForm.observation" rows="3"
                        class="w-full px-4 py-2 border rounded-lg"
                        placeholder="Añadir observaciones..."></textarea>
            </div>
          </form>
        </div>
        <div class="p-6 border-t flex justify-end gap-3">
          <button @click="closeScheduleModal"
                  class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button @click="saveSchedule"
                  class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Guardar Cronograma
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>