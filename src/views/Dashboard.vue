<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppNavbar from '@/components/AppNavbar.vue'
import UserManagement from './UserManagement.vue'
import SchoolManagement from './SchoolManagement.vue'
import CurriculumManagement from './CurriculumManagement.vue'
import GradesSubjectsManagement from './GradesSubjectsManagement.vue'
import CurriculumAssignment from '@/components/CurriculumAssignment.vue'
import StudentEnrollmentManagement from './StudentEnrollmentManagement.vue'
import { curriculumGridService } from '@/api/curriculumGridService'
import { curriculumAssignmentService } from '@/api/curriculumAssignmentService'
import { gradeService, subjectService } from '@/api/curriculumService'
import { scheduleService, weekService } from '@/api/scheduleService'

const router = useRouter()
const route  = useRoute()
const authStore = useAuthStore()
const activeTab = ref(route.query.tab || 'home')

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

const tabClass = (tab) => [
  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
  activeTab.value === tab
    ? 'bg-white/20 text-white shadow-sm'
    : 'text-white/70 hover:text-white hover:bg-white/10'
]

const setActiveTab = (tab) => {
  activeTab.value = tab
  router.replace({ query: tab === 'home' ? {} : { tab } })
  if (tab === 'assign-grids' && authStore.isCoordinator) {
    loadCoordinatorData()
  } else if (tab === 'my-grids' && authStore.isTeacher) {
    loadTeacherAssignments()
  } else if (tab === 'my-schedules' && authStore.isTeacher) {
    loadTeacherSchedules()
  }
}

watch(() => route.query.tab, (tab) => {
  if (tab && tab !== activeTab.value) setActiveTab(tab)
})

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
  <div class="min-h-screen bg-slate-100">

    <AppNavbar @tab="setActiveTab" />

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6">

      <!-- HOME TAB -->
      <div v-if="activeTab === 'home'">

        <!-- Banner de bienvenida -->
        <div class="relative overflow-hidden rounded-2xl mb-6 welcome-gradient p-6 text-white shadow-lg">
          <!-- Círculos decorativos -->
          <div class="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-violet-400/20 rounded-full blur-2xl"></div>
          <!-- Contenido -->
          <div class="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p class="text-white/70 text-sm font-medium mb-1">Bienvenido de vuelta</p>
              <h2 class="text-2xl font-bold tracking-tight">{{ authStore.user?.first_name }} {{ authStore.user?.last_name }}</h2>
              <div class="flex items-center gap-2 mt-2">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 rounded-full text-xs font-medium">
                  <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span class="capitalize">{{ authStore.user?.roles?.[0]?.name || 'Usuario' }}</span>
                </span>
                <span class="text-white/60 text-xs">{{ authStore.user?.email }}</span>
              </div>
            </div>
            <div class="hidden sm:flex w-16 h-16 rounded-2xl bg-white/20 backdrop-blur items-center justify-center text-2xl font-bold flex-shrink-0">
              {{ (authStore.user?.first_name?.[0] || '') + (authStore.user?.last_name?.[0] || '') }}
            </div>
          </div>
        </div>

        <!-- Cards de info del usuario -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="bg-white rounded-xl p-4 flex items-center gap-4 border-l-4 border-brand-500 shadow-sm">
            <div class="w-11 h-11 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Usuario</p>
              <p class="text-sm font-semibold text-gray-800">{{ authStore.user?.username }}</p>
            </div>
          </div>
          <div class="bg-white rounded-xl p-4 flex items-center gap-4 border-l-4 border-violet-500 shadow-sm">
            <div class="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Rol</p>
              <p class="text-sm font-semibold text-gray-800 capitalize">{{ authStore.user?.roles?.[0]?.name || 'Sin rol' }}</p>
            </div>
          </div>
          <div class="bg-white rounded-xl p-4 flex items-center gap-4 border-l-4 border-emerald-500 shadow-sm">
            <div class="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Correo</p>
              <p class="text-sm font-semibold text-gray-800 truncate">{{ authStore.user?.email }}</p>
            </div>
          </div>
        </div>

        <!-- Acceso rápido -->
        <div class="card border-t-4 border-brand-400">
          <div class="card-header bg-gradient-to-r from-slate-50 to-white">
            <h3 class="font-semibold text-gray-900">Acceso Rápido</h3>
          </div>
          <div class="card-body">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <template v-if="authStore.isAdmin">
              <button @click="setActiveTab('schools')"
                class="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-all text-left">
                <div class="w-10 h-10 bg-brand-100 group-hover:bg-brand-200 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <svg class="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-800 text-sm">Colegios</p>
                  <p class="text-xs text-gray-500">Gestionar instituciones</p>
                </div>
              </button>

              <button @click="setActiveTab('curriculum')"
                class="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all text-left">
                <div class="w-10 h-10 bg-violet-100 group-hover:bg-violet-200 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <svg class="w-5 h-5 text-violet-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-800 text-sm">Estructura Curricular</p>
                  <p class="text-xs text-gray-500">Gestiona elementos individuales</p>
                </div>
              </button>

              <button @click="goToMallaCurricular"
                class="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left">
                <div class="w-10 h-10 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <svg class="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-800 text-sm">Malla Curricular</p>
                  <p class="text-xs text-gray-500">Relaciona Grado + Asignatura</p>
                </div>
              </button>
            </template>

            <template v-if="authStore.isCoordinator">
              <button @click="setActiveTab('users')"
                class="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-all text-left">
                <div class="w-10 h-10 bg-brand-100 group-hover:bg-brand-200 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <svg class="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-800 text-sm">Gestión de Usuarios</p>
                  <p class="text-xs text-gray-500">Administrar profesores y estudiantes</p>
                </div>
              </button>

              <button @click="setActiveTab('assign-grids')"
                class="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all text-left">
                <div class="w-10 h-10 bg-violet-100 group-hover:bg-violet-200 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <svg class="w-5 h-5 text-violet-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-800 text-sm">Asignar Mallas</p>
                  <p class="text-xs text-gray-500">Asignar mallas a profesores</p>
                </div>
              </button>
            </template>

            <template v-if="authStore.isTeacher">
              <button @click="setActiveTab('my-grids')"
                class="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left">
                <div class="w-10 h-10 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <svg class="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-800 text-sm">Mis Mallas</p>
                  <p class="text-xs text-gray-500">Ver mallas asignadas</p>
                </div>
              </button>

              <button @click="setActiveTab('my-schedules')"
                class="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-all text-left">
                <div class="w-10 h-10 bg-brand-100 group-hover:bg-brand-200 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <svg class="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-800 text-sm">Cronogramas</p>
                  <p class="text-xs text-gray-500">Gestionar cronogramas de clase</p>
                </div>
              </button>
            </template>

            <template v-if="authStore.isStudent">
              <button @click="openMoodle"
                class="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-left">
                <div class="w-10 h-10 bg-amber-100 group-hover:bg-amber-200 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <svg class="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422A12.083 12.083 0 0121 13.5v5.5M3.5 19v-5.5a12.083 12.083 0 012.84-1.922L12 14"/></svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-800 text-sm">Acceder a Moodle</p>
                  <p class="text-xs text-gray-500">Plataforma de aprendizaje</p>
                </div>
              </button>
            </template>
          </div><!-- /grid -->
          </div><!-- /card-body -->
        </div><!-- /card -->
      </div><!-- /HOME TAB -->

      <!-- SCHOOLS TAB -->
      <div v-if="activeTab === 'schools' && authStore.isAdmin" class="card border-t-4 border-brand-500">
        <SchoolManagement />
      </div>

      <!-- USERS TAB -->
      <div v-if="activeTab === 'users' && (authStore.isAdmin || authStore.isCoordinator)" class="card border-t-4 border-indigo-500">
        <UserManagement />
      </div>

      <!-- CURRICULUM TAB -->
      <div v-if="activeTab === 'curriculum' && authStore.isAdmin" class="card border-t-4 border-amber-500">
        <CurriculumManagement />
      </div>

      <!-- GRADOS Y MATERIAS TAB -->
      <div v-if="activeTab === 'grades-subjects' && authStore.isAdmin" class="card border-t-4 border-indigo-500">
        <GradesSubjectsManagement />
      </div>

      <!-- ASIGNAR MALLAS TAB -->
      <div v-if="activeTab === 'assign-grids' && authStore.isCoordinator">
        <div class="card border-t-4 border-violet-500">
          <div class="card-header">
            <h2 class="page-title">Asignar Mallas a Profesores</h2>
            <p class="page-subtitle">Selecciona una malla y asígnala a profesores de tu colegio</p>
          </div>
          <div class="card-body space-y-5">

          <!-- Estadísticas -->
          <div class="grid grid-cols-3 gap-4">
            <div class="stat-card">
              <div class="stat-icon bg-violet-50">
                <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
              </div>
              <div><p class="stat-label">Mallas Disponibles</p><p class="stat-value">{{ totalGrids }}</p></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon bg-brand-50">
                <svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div><p class="stat-label">Profesores</p><p class="stat-value">{{ totalTeachers }}</p></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon bg-emerald-50">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <div><p class="stat-label">Colegios</p><p class="stat-value">{{ userSchools.length }}</p></div>
            </div>
          </div>

          <!-- Info -->
          <div v-if="userSchools.length > 0" class="alert-info">
            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            <span>Mostrando profesores del colegio <strong>{{ userSchools[0]?.name }}</strong></span>
          </div>

          <!-- Filtros -->
          <div class="flex gap-3">
            <select v-model="selectedGrade" class="input flex-1">
              <option :value="null">Todos los grados</option>
              <option v-for="grade in validGrades" :key="grade.id" :value="grade.id">
                {{ grade.name }}
              </option>
            </select>

            <select v-model="selectedSubject" class="input flex-1">
              <option :value="null">Todas las materias</option>
              <option v-for="subject in validSubjects" :key="subject.id" :value="subject.id">
                {{ subject.name }}
              </option>
            </select>
          </div>

          <!-- Lista de Mallas -->
          <div v-if="loadingGrids" class="text-center py-10 text-gray-400 text-sm">Cargando mallas...</div>
          <div v-else-if="filteredGrids.length === 0" class="text-center py-10 text-gray-400 text-sm">No hay mallas disponibles</div>
          <div v-else class="grid gap-3">
            <div v-for="grid in filteredGrids" :key="grid.id"
                 class="border border-gray-200 rounded-xl p-4 hover:border-brand-300 hover:shadow-sm transition-all">
              <div class="flex justify-between items-start gap-4">
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900">{{ grid.grade_name }} - {{ grid.subject_name }}</h3>
                  <p class="text-gray-500 text-sm mt-0.5 truncate">{{ grid.description || 'Sin descripción' }}</p>
                  <div class="flex gap-3 mt-2">
                    <span class="badge-blue">{{ filterValidItems(grid.topics).length }} ejes</span>
                    <span class="badge-gray">{{ filterValidItems(grid.components).length }} componentes</span>
                    <span class="badge-green">{{ filterValidItems(grid.standards).length }} estándares</span>
                  </div>
                </div>
                <div class="flex gap-2 flex-shrink-0">
                  <button @click="viewGridDetails(grid)" class="btn-secondary btn-sm">Ver</button>
                  <button @click="assignGrid(grid)" class="btn-primary btn-sm">Asignar</button>
                </div>
              </div>
            </div>
          </div>

          </div><!-- /card-body -->
        </div><!-- /card -->
      </div>

      <!-- MATRÍCULA TAB -->
      <div v-if="activeTab === 'enrollment' && (authStore.isAdmin || authStore.isCoordinator || authStore.isTeacher)"
           class="card border-t-4 border-violet-500">
        <div class="card-header">
          <h2 class="page-title">Matrícula de Estudiantes</h2>
          <p class="page-subtitle">Asigna estudiantes a grados y materias del año escolar</p>
        </div>
        <div class="card-body">
          <StudentEnrollmentManagement />
        </div>
      </div>

      <!-- MIS MALLAS TAB (Profesor) -->
      <div v-if="activeTab === 'my-grids' && authStore.isTeacher">
        <div class="card border-t-4 border-emerald-500">
          <div class="card-header">
            <h2 class="page-title">Mis Mallas Asignadas</h2>
            <p class="page-subtitle">Mallas curriculares que tienes asignadas</p>
          </div>
          <div class="card-body">

          <div v-if="loadingAssignments" class="text-center py-10 text-gray-400 text-sm">Cargando mallas...</div>
          <div v-else-if="myAssignments.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <p class="font-semibold text-gray-700">No tienes mallas asignadas</p>
            <p class="text-sm text-gray-500 mt-1">Espera a que tu coordinador te asigne mallas</p>
          </div>
          <div v-else class="grid gap-3">
            <div v-for="assignment in myAssignments" :key="assignment.curriculum_grid_id"
                 class="border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all">
              <div class="flex justify-between items-start gap-4">
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900">{{ assignment.grade_name }} - {{ assignment.subject_name }}</h3>
                  <p class="text-gray-500 text-sm mt-0.5 truncate">{{ assignment.description || 'Sin descripción' }}</p>
                  <div class="flex gap-3 mt-2 text-sm text-gray-500">
                    <span v-if="assignment.school_name">🏫 {{ assignment.school_name }}</span>
                    <span v-if="assignment.assigned_by_name">👤 {{ assignment.assigned_by_name }}</span>
                    <span>{{ formatDate(assignment.assigned_at) }}</span>
                  </div>
                </div>
                <button @click="openScheduleModal(assignment)" class="btn-success btn-sm whitespace-nowrap flex-shrink-0">
                  Crear Cronograma
                </button>
              </div>
            </div>
          </div>

          </div><!-- /card-body -->
        </div><!-- /card -->
      </div>

      <!-- CRONOGRAMAS TAB (Profesor) -->
      <div v-if="activeTab === 'my-schedules' && authStore.isTeacher">
        <div class="card border-t-4 border-brand-500">
          <div class="card-header">
            <h2 class="page-title">Mis Cronogramas</h2>
            <p class="page-subtitle">Gestiona tus cronogramas de clase</p>
          </div>
          <div class="card-body space-y-5">

          <div class="grid grid-cols-3 gap-4">
            <div class="stat-card">
              <div class="stat-icon bg-brand-50">
                <svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <div><p class="stat-label">Total Clases</p><p class="stat-value">{{ mySchedules.length }}</p></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon bg-emerald-50">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div><p class="stat-label">Ejecutadas</p><p class="stat-value">{{ executedSchedules }}</p></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon bg-violet-50">
                <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              </div>
              <div><p class="stat-label">Progreso</p><p class="stat-value">{{ progressPercentage }}%</p></div>
            </div>
          </div>

          <div v-if="loadingSchedules" class="text-center py-10 text-gray-400 text-sm">Cargando...</div>
          <div v-else-if="mySchedules.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <p class="font-semibold text-gray-700">No tienes cronogramas</p>
            <p class="text-sm text-gray-500 mt-1">Ve a "Mis Mallas" para crear tu primer cronograma</p>
          </div>
          <div v-else class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Semana</th>
                  <th>Grado - Materia</th>
                  <th>Estado</th>
                  <th>Observación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="schedule in mySchedules" :key="schedule.id">
                  <td>Semana {{ schedule.week_id }}</td>
                  <td>Grado {{ schedule.grade_id }} - Materia {{ schedule.subject_id }}</td>
                  <td>
                    <span :class="schedule.executed ? 'badge-green' : 'badge-yellow'">
                      {{ schedule.executed ? 'Ejecutada' : 'Pendiente' }}
                    </span>
                  </td>
                  <td class="text-gray-500">{{ schedule.observation || '—' }}</td>
                  <td>
                    <button @click="toggleScheduleExecuted(schedule)"
                            :class="schedule.executed ? 'btn-secondary btn-sm' : 'btn-success btn-sm'">
                      {{ schedule.executed ? 'Marcar pendiente' : 'Marcar ejecutada' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          </div><!-- /card-body -->
        </div><!-- /card -->
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
    <div v-if="showGridDetails" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
         @click="closeGridDetails">
      <div class="bg-white rounded-2xl shadow-modal max-w-3xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 class="page-title">Detalles de la Malla</h2>
          <button @click="closeGridDetails" class="btn-ghost btn-sm w-8 h-8 p-0 rounded-lg">&times;</button>
        </div>
        <div class="p-6" v-if="selectedGrid">
          <p class="font-semibold text-gray-900 text-lg">{{ selectedGrid.grade_name }} - {{ selectedGrid.subject_name }}</p>
          <p class="text-gray-500 text-sm mt-1 mb-5">{{ selectedGrid.description }}</p>

          <div class="space-y-4">
            <div v-if="filterValidItems(selectedGrid.topics).length > 0">
              <p class="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-2">Ejes Temáticos</p>
              <ul class="space-y-1">
                <li v-for="topic in filterValidItems(selectedGrid.topics)" :key="topic.id"
                    class="text-sm text-gray-700 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-violet-400 rounded-full flex-shrink-0"></span>{{ topic.name }}
                </li>
              </ul>
            </div>
            <div v-if="filterValidItems(selectedGrid.components).length > 0">
              <p class="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">Componentes</p>
              <ul class="space-y-1">
                <li v-for="comp in filterValidItems(selectedGrid.components)" :key="comp.id"
                    class="text-sm text-gray-700 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-brand-400 rounded-full flex-shrink-0"></span>{{ comp.name }}
                </li>
              </ul>
            </div>
            <div v-if="filterValidItems(selectedGrid.standards).length > 0">
              <p class="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Estándares</p>
              <ul class="space-y-1">
                <li v-for="std in filterValidItems(selectedGrid.standards)" :key="std.id"
                    class="text-sm text-gray-700 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0"></span>{{ std.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button @click="assignGrid(selectedGrid)" class="btn-primary">Asignar a Profesores</button>
          <button @click="closeGridDetails" class="btn-secondary">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal de Crear Cronograma -->
    <div v-if="showScheduleModal && safeAssignmentData" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
         @click="closeScheduleModal">
      <div class="bg-white rounded-2xl shadow-modal max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h2 class="page-title">Crear Cronograma</h2>
            <p class="page-subtitle">{{ safeAssignmentData.grade_name }} - {{ safeAssignmentData.subject_name }}</p>
          </div>
          <button @click="closeScheduleModal" class="btn-ghost btn-sm w-8 h-8 p-0 rounded-lg">&times;</button>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveSchedule" class="space-y-4">
            <!-- Selección de Semanas -->
            <div>
              <label class="label">Semanas (selecciona una o varias)</label>
              <div class="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                <label v-for="week in validWeeks" :key="week.id"
                       class="flex items-center gap-2 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                  <input type="checkbox" :value="week.id" v-model="scheduleForm.week_ids" class="rounded accent-indigo-600">
                  <span class="text-sm text-gray-700">Semana {{ week.week_number }}</span>
                </label>
              </div>
            </div>

            <!-- Eje Temático -->
            <div v-if="safeAssignmentData.topics.length > 0">
              <label class="label">Eje Temático *</label>
              <select v-model="scheduleForm.topic_id" required class="input">
                <option :value="null">-- Seleccionar --</option>
                <option v-for="topic in safeAssignmentData.topics" :key="topic.id" :value="topic.id">{{ topic.name }}</option>
              </select>
            </div>

            <!-- Componente -->
            <div v-if="safeAssignmentData.components.length > 0">
              <label class="label">Componente *</label>
              <select v-model="scheduleForm.component_id" required class="input">
                <option :value="null">-- Seleccionar --</option>
                <option v-for="comp in safeAssignmentData.components" :key="comp.id" :value="comp.id">{{ comp.name }}</option>
              </select>
            </div>

            <!-- Estándar -->
            <div v-if="safeAssignmentData.standards.length > 0">
              <label class="label">Estándar *</label>
              <select v-model="scheduleForm.standard_id" required class="input">
                <option :value="null">-- Seleccionar --</option>
                <option v-for="std in safeAssignmentData.standards" :key="std.id" :value="std.id">{{ std.name }}</option>
              </select>
            </div>

            <!-- Competencia -->
            <div v-if="safeAssignmentData.competences.length > 0">
              <label class="label">Competencia *</label>
              <select v-model="scheduleForm.competence_id" required class="input">
                <option :value="null">-- Seleccionar --</option>
                <option v-for="comp in safeAssignmentData.competences" :key="comp.id" :value="comp.id">{{ comp.description }}</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div v-if="safeAssignmentData.affirmations.length > 0">
                <label class="label">Afirmación DNA/DBA *</label>
                <select v-model="scheduleForm.affirmation_id" required class="input">
                  <option :value="null">-- Seleccionar --</option>
                  <option v-for="aff in safeAssignmentData.affirmations" :key="aff.id" :value="aff.id">{{ aff.name }}</option>
                </select>
              </div>

              <div v-if="safeAssignmentData.evidences.length > 0">
                <label class="label">Evidencia DNA/DBA *</label>
                <select v-model="scheduleForm.evidence_id" required class="input">
                  <option :value="null">-- Seleccionar --</option>
                  <option v-for="evid in safeAssignmentData.evidences" :key="evid.id" :value="evid.id">{{ evid.name }}</option>
                </select>
              </div>
            </div>

            <!-- Observación -->
            <div>
              <label class="label">Observación (Opcional)</label>
              <textarea v-model="scheduleForm.observation" rows="3" class="input"
                        placeholder="Añadir observaciones..."></textarea>
            </div>
          </form>
        </div>
        <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button @click="closeScheduleModal" class="btn-secondary">Cancelar</button>
          <button @click="saveSchedule" class="btn-success">Guardar Cronograma</button>
        </div>
      </div>
    </div>
  </div>
</template>