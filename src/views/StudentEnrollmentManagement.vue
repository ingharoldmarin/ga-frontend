<template>
  <div class="space-y-5">

    <!-- Encabezado -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h2 class="page-title">Matrícula de Estudiantes</h2>
        <p class="page-subtitle">Asigna estudiantes a grados y materias</p>
      </div>
      <div v-if="enrolled.length" class="badge-blue text-sm px-3 py-1">
        {{ enrolled.length }} matriculado(s)
      </div>
    </div>

    <!-- Panel de selección -->
    <div class="card border-t-4 border-violet-500">
      <div class="card-header">
        <h3 class="font-semibold text-gray-800 text-sm">Configuración de matrícula</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="label">Grado <span class="text-red-500">*</span></label>
            <select v-model="selectedGrade" @change="onFilterChange" class="input">
              <option :value="null">Seleccionar grado...</option>
              <option v-for="g in grades" :key="g.id" :value="g">{{ g.name }}</option>
            </select>
          </div>
          <div>
            <label class="label">Materia <span class="text-red-500">*</span></label>
            <select v-model="selectedSubject" @change="onFilterChange" :disabled="!selectedGrade" class="input">
              <option :value="null">Seleccionar materia...</option>
              <option v-for="s in subjects" :key="s.id" :value="s">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="label">Año escolar</label>
            <input v-model="academicYear" type="number" class="input" placeholder="2025" @change="onFilterChange"/>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal (solo si hay grado + materia seleccionados) -->
    <div v-if="selectedGrade && selectedSubject" class="grid grid-cols-1 xl:grid-cols-2 gap-5">

      <!-- ── Panel izquierdo: Estudiantes disponibles ── -->
      <div class="card border-t-4 border-indigo-500">
        <div class="card-header flex items-center justify-between">
          <h3 class="font-semibold text-gray-800 text-sm">Estudiantes disponibles</h3>
          <span class="badge-gray">{{ filteredAvailable.length }}</span>
        </div>
        <div class="card-body pt-3">
          <!-- Buscador -->
          <div class="relative mb-3">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input v-model="searchTerm" type="text" class="input input-icon" placeholder="Buscar estudiante..."/>
          </div>

          <!-- Loading -->
          <div v-if="loadingStudents" class="py-8 text-center">
            <div class="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p class="text-xs text-gray-400">Cargando estudiantes...</p>
          </div>

          <!-- Lista vacía -->
          <div v-else-if="filteredAvailable.length === 0" class="py-8 text-center">
            <svg class="w-10 h-10 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <p class="text-sm text-gray-400">
              {{ allStudents.length === 0 ? 'No hay estudiantes registrados' : 'Todos ya están matriculados' }}
            </p>
          </div>

          <!-- Lista de estudiantes disponibles -->
          <div v-else class="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            <div v-for="student in filteredAvailable" :key="student.id"
              class="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs flex-shrink-0">
                  {{ initials(student) }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-800 truncate">{{ fullName(student) }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ student.email }}</p>
                </div>
              </div>
              <button @click="enroll(student)"
                :disabled="enrolling === student.id"
                class="btn-primary btn-sm flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg v-if="enrolling === student.id" class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Matricular
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Panel derecho: Estudiantes matriculados ── -->
      <div class="card border-t-4 border-emerald-500">
        <div class="card-header flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-800 text-sm">Matriculados</h3>
            <p class="text-xs text-gray-500 mt-0.5">{{ selectedGrade.name }} · {{ selectedSubject.name }}</p>
          </div>
          <span class="badge-green">{{ enrolled.length }}</span>
        </div>
        <div class="card-body pt-3">

          <div v-if="loadingEnrolled" class="py-8 text-center">
            <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p class="text-xs text-gray-400">Cargando matrícula...</p>
          </div>

          <div v-else-if="enrolled.length === 0" class="py-8 text-center">
            <svg class="w-10 h-10 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p class="text-sm text-gray-400">Aún no hay estudiantes matriculados</p>
            <p class="text-xs text-gray-400 mt-1">Selecciona estudiantes del panel izquierdo</p>
          </div>

          <div v-else class="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            <div v-for="entry in enrolled" :key="entry.id"
              class="flex items-center justify-between px-3 py-2 rounded-lg border border-emerald-100 bg-emerald-50/50 group">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-xs flex-shrink-0">
                  {{ initials(entry.student || entry) }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-800 truncate">
                    {{ entry.student ? fullName(entry.student) : (entry.student_name || 'Estudiante') }}
                  </p>
                  <p class="text-xs text-gray-400 truncate">{{ entry.student?.email || entry.student_email || '' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="badge-green text-xs">Activo</span>
                <button @click="unenroll(entry)"
                  :disabled="unenrolling === entry.id"
                  class="btn-ghost btn-sm text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Acción masiva -->
          <div v-if="enrolled.length > 0" class="mt-4 pt-3 border-t border-gray-100">
            <button @click="exportList"
              class="btn-secondary btn-sm w-full">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Exportar lista (CSV)
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Estado inicial -->
    <div v-else class="card p-12 text-center">
      <svg class="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
      <p class="text-gray-500 font-medium">Selecciona un grado y una materia</p>
      <p class="text-gray-400 text-sm mt-1">para ver y gestionar la lista de estudiantes matriculados</p>
    </div>

    <!-- Toast -->
    <Transition name="slide-up">
      <div v-if="toast.msg" class="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white flex items-center gap-2"
        :class="toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'">
        <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path v-if="toast.type === 'success'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        {{ toast.msg }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gradeService, subjectService } from '@/api/curriculumService'
import { enrollmentService } from '@/api/enrollmentService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// IDs de los colegios del coordinador/profesor actual
const mySchoolIds = computed(() =>
  (authStore.user?.schools || []).map(s => s.id)
)

// ── Estado ──
const grades        = ref([])
const subjects      = ref([])
const allStudents   = ref([])
const enrolled      = ref([])
const selectedGrade   = ref(null)
const selectedSubject = ref(null)
const academicYear    = ref(new Date().getFullYear())
const searchTerm      = ref('')
const loadingStudents = ref(false)
const loadingEnrolled = ref(false)
const enrolling       = ref(null)
const unenrolling     = ref(null)
const toast           = ref({ msg: '', type: 'success' })

// ── Computed ──
const enrolledIds = computed(() => new Set(
  enrolled.value.map(e => e.student_id ?? e.student?.id)
))

const filteredAvailable = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return allStudents.value
    .filter(s => !enrolledIds.value.has(s.id))
    .filter(s => !term || fullName(s).toLowerCase().includes(term) || (s.email || '').toLowerCase().includes(term))
})

// Verifica que el usuario tiene rol 'estudiante'
const isStudent = (u) => u?.roles?.some(r => r.name === 'estudiante')

// Verifica que el usuario pertenece a alguno de los colegios del coordinador
const inMySchool = (u) => {
  if (authStore.isAdmin) return true          // admin ve todos
  if (!mySchoolIds.value.length) return true  // si no hay colegios asignados, no filtra
  return (u?.schools || []).some(s => mySchoolIds.value.includes(s.id))
}

// ── Helpers ──
const fullName = (s) => `${s?.first_name || ''} ${s?.last_name || ''}`.trim() || s?.name || 'Sin nombre'
const initials  = (s) => ((s?.first_name?.[0] || '') + (s?.last_name?.[0] || '')).toUpperCase() || '?'

const showToast = (msg, type = 'success') => {
  toast.value = { msg, type }
  setTimeout(() => { toast.value.msg = '' }, 3000)
}

// ── Carga inicial ──
const loadCatalogos = async () => {
  try {
    const [g, s] = await Promise.all([
      gradeService.getAll({ per_page: 100 }),
      subjectService.getAll({ per_page: 100 }),
    ])
    grades.value   = g.data?.data || g.data || []
    subjects.value = s.data?.data || s.data || []
  } catch { /* silencioso */ }
}

const loadStudents = async () => {
  loadingStudents.value = true
  try {
    const all = await enrollmentService.getStudents()
    // Solo estudiantes del colegio del coordinador/profesor
    allStudents.value = all.filter(u => isStudent(u) && inMySchool(u))
  } catch {
    allStudents.value = []
  } finally {
    loadingStudents.value = false
  }
}

const loadEnrolled = async () => {
  if (!selectedGrade.value || !selectedSubject.value) return
  loadingEnrolled.value = true
  try {
    enrolled.value = await enrollmentService.getAll({
      grade_id:   selectedGrade.value.id,
      subject_id: selectedSubject.value.id,
    })
  } catch {
    enrolled.value = []
  } finally {
    loadingEnrolled.value = false
  }
}

// ── Acciones ──
const onFilterChange = () => {
  enrolled.value = []
  if (selectedGrade.value && selectedSubject.value) loadEnrolled()
}

const enroll = async (student) => {
  enrolling.value = student.id
  try {
    const entry = await enrollmentService.create({
      student_id:    student.id,
      student_name:  fullName(student),
      student_email: student.email,
      grade_id:      selectedGrade.value.id,
      grade_name:    selectedGrade.value.name,
      subject_id:    selectedSubject.value.id,
      subject_name:  selectedSubject.value.name,
      academic_year: academicYear.value,
      student:       student,
    })
    enrolled.value.push(entry)
    showToast(`${fullName(student)} matriculado/a correctamente`)
  } catch (e) {
    showToast(e.message || 'Error al matricular', 'error')
  } finally {
    enrolling.value = null
  }
}

const unenroll = async (entry) => {
  if (!confirm(`¿Quitar a ${entry.student ? fullName(entry.student) : entry.student_name} de esta materia?`)) return
  unenrolling.value = entry.id
  try {
    await enrollmentService.delete(entry.id)
    enrolled.value = enrolled.value.filter(e => e.id !== entry.id)
    showToast('Estudiante retirado de la matrícula')
  } catch {
    showToast('Error al retirar estudiante', 'error')
  } finally {
    unenrolling.value = null
  }
}

const exportList = () => {
  const rows = [
    ['Nombre', 'Email', 'Grado', 'Materia', 'Año escolar'],
    ...enrolled.value.map(e => [
      e.student ? fullName(e.student) : (e.student_name || ''),
      e.student?.email || e.student_email || '',
      selectedGrade.value.name,
      selectedSubject.value.name,
      academicYear.value,
    ])
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `matricula-${selectedGrade.value.name}-${selectedSubject.value.name}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Init ──
loadCatalogos()
loadStudents()
</script>
