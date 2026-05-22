<template>
  <div>
    <!-- Header + subtabs -->
    <div class="card-header flex items-center justify-between flex-wrap gap-3">
      <div>
        <h2 class="page-title">Grados y Materias</h2>
        <p class="page-subtitle">Catálogo académico del sistema</p>
      </div>
      <div class="flex gap-1.5 bg-gray-100 rounded-xl p-1">
        <button @click="panel = 'grades'"
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
          :class="panel === 'grades' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
          🎓 Grados
        </button>
        <button @click="panel = 'subjects'"
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
          :class="panel === 'subjects' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
          📚 Materias
        </button>
      </div>
    </div>

    <div class="card-body">

      <!-- ══ GRADOS ══ -->
      <div v-if="panel === 'grades'">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Formulario -->
          <div class="lg:col-span-1">
            <div class="card border-t-4 border-indigo-500 sticky top-20">
              <div class="card-header">
                <h3 class="font-semibold text-gray-800 text-sm">
                  {{ editingGrade ? 'Editar grado' : 'Nuevo grado' }}
                </h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="saveGrade" class="space-y-3">
                  <div>
                    <label class="label">Nombre del grado <span class="text-red-500">*</span></label>
                    <input v-model="gradeForm.name" type="text" class="input"
                      placeholder="Ej: Primero, 9°, Undécimo" required/>
                  </div>
                  <div>
                    <label class="label">Descripción</label>
                    <input v-model="gradeForm.description" type="text" class="input"
                      placeholder="Descripción opcional"/>
                  </div>
                  <div class="flex gap-2 pt-1">
                    <button type="submit" :disabled="savingGrade" class="btn-primary flex-1">
                      <svg v-if="savingGrade" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      {{ savingGrade ? 'Guardando...' : (editingGrade ? 'Actualizar' : 'Crear grado') }}
                    </button>
                    <button v-if="editingGrade" type="button" @click="cancelGrade" class="btn-secondary">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Lista de grados -->
          <div class="lg:col-span-2">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-gray-800">Grados registrados</h3>
              <div class="flex items-center gap-2">
                <input v-model="gradeSearch" type="text" placeholder="Buscar..." class="input text-xs py-1.5 w-40"/>
                <button @click="loadGrades" class="btn-ghost btn-sm">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                </button>
              </div>
            </div>

            <div v-if="loadingGrades" class="card p-10 text-center">
              <div class="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p class="text-gray-400 text-sm">Cargando grados...</p>
            </div>

            <div v-else-if="filteredGrades.length === 0" class="card p-10 text-center">
              <p class="text-2xl mb-2">🎓</p>
              <p class="text-gray-500 font-medium">No hay grados registrados</p>
              <p class="text-gray-400 text-sm mt-1">Crea el primer grado usando el formulario</p>
            </div>

            <div v-else class="card overflow-hidden">
              <div class="table-wrapper">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Grado</th>
                      <th>Descripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="g in filteredGrades" :key="g.id"
                      :class="editingGrade?.id === g.id ? 'bg-indigo-50' : ''">
                      <td>
                        <p class="font-semibold text-gray-900">{{ g.name }}</p>
                      </td>
                      <td class="max-w-[220px]">
                        <span class="truncate block text-xs text-gray-500">{{ g.description || '—' }}</span>
                      </td>
                      <td>
                        <div class="flex items-center gap-1.5">
                          <button @click="startEditGrade(g)" class="btn-secondary btn-sm text-xs">Editar</button>
                          <button @click="deleteGrade(g.id)" class="btn-ghost btn-sm text-xs text-red-500 hover:text-red-700">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ MATERIAS ══ -->
      <div v-else-if="panel === 'subjects'">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Formulario -->
          <div class="lg:col-span-1">
            <div class="card border-t-4 border-violet-500 sticky top-20">
              <div class="card-header">
                <h3 class="font-semibold text-gray-800 text-sm">
                  {{ editingSubject ? 'Editar materia' : 'Nueva materia' }}
                </h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="saveSubject" class="space-y-3">
                  <div>
                    <label class="label">Nombre de la materia <span class="text-red-500">*</span></label>
                    <input v-model="subjectForm.name" type="text" class="input"
                      placeholder="Ej: Matemáticas, Español, Ciencias" required/>
                  </div>
                  <div>
                    <label class="label">Descripción</label>
                    <textarea v-model="subjectForm.description" class="input resize-none" rows="2"
                      placeholder="Descripción opcional de la materia..."></textarea>
                  </div>
                  <div class="flex gap-2 pt-1">
                    <button type="submit" :disabled="savingSubject" class="btn-primary flex-1">
                      <svg v-if="savingSubject" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      {{ savingSubject ? 'Guardando...' : (editingSubject ? 'Actualizar' : 'Crear materia') }}
                    </button>
                    <button v-if="editingSubject" type="button" @click="cancelSubject" class="btn-secondary">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Lista de materias -->
          <div class="lg:col-span-2">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-gray-800">Materias registradas</h3>
              <div class="flex items-center gap-2">
                <input v-model="subjectSearch" type="text" placeholder="Buscar..." class="input text-xs py-1.5 w-40"/>
                <button @click="loadSubjects" class="btn-ghost btn-sm">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                </button>
              </div>
            </div>


            <div v-if="loadingSubjects" class="card p-10 text-center">
              <div class="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p class="text-gray-400 text-sm">Cargando materias...</p>
            </div>

            <div v-else-if="filteredSubjects.length === 0" class="card p-10 text-center">
              <p class="text-2xl mb-2">📚</p>
              <p class="text-gray-500 font-medium">No hay materias registradas</p>
              <p class="text-gray-400 text-sm mt-1">Crea la primera materia usando el formulario</p>
            </div>

            <div v-else class="card overflow-hidden">
              <div class="table-wrapper">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Materia</th>
                      <th>Descripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="s in filteredSubjects" :key="s.id"
                      :class="editingSubject?.id === s.id ? 'bg-violet-50' : ''">
                      <td>
                        <p class="font-semibold text-gray-900">{{ s.name }}</p>
                      </td>
                      <td class="max-w-[220px]">
                        <span class="truncate block text-xs text-gray-500">{{ s.description || '—' }}</span>
                      </td>
                      <td>
                        <div class="flex items-center gap-1.5">
                          <button @click="startEditSubject(s)" class="btn-secondary btn-sm text-xs">Editar</button>
                          <button @click="deleteSubject(s.id)" class="btn-ghost btn-sm text-xs text-red-500 hover:text-red-700">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Toast -->
    <Transition name="slide-up">
      <div v-if="toast.msg"
        class="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white flex items-center gap-2"
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
import { ref, computed, onMounted } from 'vue'
import { gradeService, subjectService } from '@/api/curriculumService'

const panel = ref('grades')

// ── Toast ──
const toast = ref({ msg: '', type: 'success' })
const showToast = (msg, type = 'success') => {
  toast.value = { msg, type }
  setTimeout(() => { toast.value.msg = '' }, 3200)
}

// ══════════════════════════════════════════
// GRADOS
// ══════════════════════════════════════════
const grades       = ref([])
const loadingGrades = ref(false)
const savingGrade  = ref(false)
const editingGrade = ref(null)
const gradeSearch  = ref('')
const gradeForm    = ref({ name: '', description: '' })

const filteredGrades = computed(() => {
  const q = gradeSearch.value.toLowerCase()
  let list = grades.value
  if (q) list = list.filter(g => g.name?.toLowerCase().includes(q) || g.level?.toLowerCase().includes(q))
  return [...list].sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || (a.name ?? '').localeCompare(b.name ?? ''))
})

const loadGrades = async () => {
  loadingGrades.value = true
  try {
    const res = await gradeService.getAll()
    grades.value = Array.isArray(res.data) ? res.data : (res.data?.data || [])
  } catch {
    grades.value = []
    showToast('Error al cargar grados', 'error')
  } finally {
    loadingGrades.value = false
  }
}

const saveGrade = async () => {
  savingGrade.value = true
  try {
    if (editingGrade.value) {
      await gradeService.update(editingGrade.value.id, gradeForm.value)
      showToast('Grado actualizado')
    } else {
      await gradeService.create(gradeForm.value)
      showToast('Grado creado')
    }
    cancelGrade()
    await loadGrades()
  } catch {
    showToast('Error al guardar el grado', 'error')
  } finally {
    savingGrade.value = false
  }
}

const startEditGrade = (g) => {
  editingGrade.value = g
  gradeForm.value = { name: g.name, description: g.description || '' }
}
const cancelGrade = () => {
  editingGrade.value = null
  gradeForm.value = { name: '', description: '' }
}
const deleteGrade = async (id) => {
  if (!confirm('¿Eliminar este grado? Esta acción no se puede deshacer.')) return
  try {
    await gradeService.delete(id)
    showToast('Grado eliminado')
    await loadGrades()
  } catch {
    showToast('Error al eliminar el grado', 'error')
  }
}

// ══════════════════════════════════════════
// MATERIAS
// ══════════════════════════════════════════
const subjects        = ref([])
const loadingSubjects = ref(false)
const savingSubject   = ref(false)
const editingSubject  = ref(null)
const subjectSearch   = ref('')
const subjectForm = ref({ name: '', description: '' })

const filteredSubjects = computed(() => {
  const q = subjectSearch.value.toLowerCase()
  let list = subjects.value
  if (q) list = list.filter(s => s.name?.toLowerCase().includes(q))
  return [...list].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
})

const loadSubjects = async () => {
  loadingSubjects.value = true
  try {
    const res = await subjectService.getAll(1, 200)
    const data = Array.isArray(res.data) ? res.data : (res.data?.data || [])
    subjects.value = data
  } catch {
    subjects.value = []
    showToast('Error al cargar materias', 'error')
  } finally {
    loadingSubjects.value = false
  }
}

const saveSubject = async () => {
  savingSubject.value = true
  try {
    if (editingSubject.value) {
      await subjectService.update(editingSubject.value.id, subjectForm.value)
      showToast('Materia actualizada')
    } else {
      await subjectService.create(subjectForm.value)
      showToast('Materia creada')
    }
    cancelSubject()
    await loadSubjects()
  } catch {
    showToast('Error al guardar la materia', 'error')
  } finally {
    savingSubject.value = false
  }
}

const startEditSubject = (s) => {
  editingSubject.value = s
  subjectForm.value = { name: s.name, description: s.description || '' }
}
const cancelSubject = () => {
  editingSubject.value = null
  subjectForm.value = { name: '', description: '' }
}
const deleteSubject = async (id) => {
  if (!confirm('¿Eliminar esta materia? Esta acción no se puede deshacer.')) return
  try {
    await subjectService.delete(id)
    showToast('Materia eliminada')
    await loadSubjects()
  } catch {
    showToast('Error al eliminar la materia', 'error')
  }
}

onMounted(() => {
  loadGrades()
  loadSubjects()
})
</script>
