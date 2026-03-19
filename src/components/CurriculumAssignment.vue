<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>
          {{ grid ? 'Asignar Malla Curricular' : 'Seleccionar Malla y Profesores' }}
        </h2>
        <button class="btn-close" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <!-- Paso 1: Seleccionar Malla (si no viene pre-seleccionada) -->
        <div v-if="!grid" class="form-section">
          <h3>Paso 1: Seleccionar Malla Curricular</h3>
          
          <div class="form-group">
            <label>Grado</label>
            <select v-model="selectedGrade" class="form-control" @change="filterGrids">
              <option :value="null">-- Seleccionar Grado --</option>
              <option v-for="grade in grades" :key="grade.id" :value="grade.id">
                {{ grade.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Materia</label>
            <select v-model="selectedSubject" class="form-control" @change="filterGrids">
              <option :value="null">-- Seleccionar Materia --</option>
              <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                {{ subject.name }}
              </option>
            </select>
          </div>

          <div v-if="availableGrids.length > 0" class="form-group">
            <label>Malla Curricular</label>
            <select v-model="selectedGrid" class="form-control">
              <option :value="null">-- Seleccionar Malla --</option>
              <option v-for="g in availableGrids" :key="g.id" :value="g">
                {{ g.grade_name }} - {{ g.subject_name }}
                {{ g.description ? `(${g.description})` : '' }}
              </option>
            </select>
          </div>

          <div v-if="selectedGrade && selectedSubject && availableGrids.length === 0" class="alert-warning">
            No hay mallas disponibles para esta combinación
          </div>
        </div>

        <!-- Información de la malla seleccionada -->
        <div v-if="currentGrid" class="selected-grid-info">
          <h3>Malla Seleccionada</h3>
          <div class="grid-summary">
            <strong>{{ currentGrid.grade_name }} - {{ currentGrid.subject_name }}</strong>
            <p>{{ currentGrid.description || 'Sin descripción' }}</p>
            <div class="grid-stats">
              <span>📋 {{ currentGrid.topics?.length || 0 }} Ejes Temáticos</span>
              <span>🧩 {{ currentGrid.components?.length || 0 }} Componentes</span>
              <span>📊 {{ currentGrid.standards?.length || 0 }} Estándares</span>
            </div>
          </div>
        </div>

        <!-- Paso 2: Seleccionar Colegio (opcional) -->
        <div v-if="currentGrid" class="form-section">
          <h3>{{ !grid ? 'Paso 2: ' : '' }}Filtrar por Colegio (Opcional)</h3>
          
          <div class="form-group">
            <label>Colegio</label>
            <select v-model="selectedSchool" class="form-control" @change="loadTeachers">
              <option :value="null">Todos los colegios</option>
              <option v-for="school in schools" :key="school.id" :value="school.id">
                {{ school.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Paso 3: Seleccionar Profesores -->
        <div v-if="currentGrid" class="form-section">
          <h3>{{ !grid ? 'Paso 3: ' : '' }}Seleccionar Profesores</h3>
          
          <div class="teachers-selection">
            <div class="selection-header">
              <label>
                <input 
                  type="checkbox" 
                  v-model="selectAll" 
                  @change="toggleSelectAll"
                />
                Seleccionar Todos ({{ filteredTeachers.length }})
              </label>
              <div class="search-box">
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="🔍 Buscar profesor..."
                  class="form-control"
                />
              </div>
            </div>

            <div v-if="loadingTeachers" class="loading">
              Cargando profesores...
            </div>

            <div v-else-if="filteredTeachers.length === 0" class="alert-warning">
              No hay profesores disponibles
            </div>

            <div v-else class="teachers-list">
              <label 
                v-for="teacher in filteredTeachers" 
                :key="teacher.id" 
                class="teacher-item"
              >
                <input 
                  type="checkbox" 
                  :value="teacher.id" 
                  v-model="selectedTeachers"
                />
                <div class="teacher-details">
                  <strong>{{ teacher.name }}</strong>
                  <span class="teacher-email">{{ teacher.email }}</span>
                  <div v-if="teacher.schools && teacher.schools.length > 0" class="teacher-schools">
                    <span 
                      v-for="school in teacher.schools" 
                      :key="school.id" 
                      class="badge-school"
                    >
                      🏫 {{ school.name }}
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div v-if="selectedTeachers.length > 0" class="selection-summary">
            {{ selectedTeachers.length }} profesor(es) seleccionado(s)
          </div>
        </div>

        <!-- Mensajes de error -->
        <div v-if="error" class="alert-error">
          {{ error }}
        </div>

        <!-- Resultado de asignación -->
        <div v-if="assignmentResult" class="assignment-result">
          <div class="alert-success">
            ✅ Asignación completada:
            <ul>
              <li>{{ assignmentResult.success_count }} asignaciones exitosas</li>
              <li v-if="assignmentResult.error_count > 0" class="text-error">
                {{ assignmentResult.error_count }} errores
              </li>
            </ul>
          </div>

          <div v-if="assignmentResult.errors && assignmentResult.errors.length > 0" class="errors-list">
            <h4>Errores:</h4>
            <ul>
              <li v-for="(err, idx) in assignmentResult.errors" :key="idx" class="error-item">
                Profesor ID {{ err.teacher_id }}: {{ err.message }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')" :disabled="loading">
          Cancelar
        </button>
        <button 
          class="btn-primary" 
          @click="handleAssignment"
          :disabled="!canAssign || loading"
        >
          {{ loading ? 'Asignando...' : 'Asignar Malla' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { curriculumGridService } from '@/api/curriculumGridService'
import { curriculumAssignmentService } from '@/api/curriculumAssignmentService'
import { gradeService, subjectService } from '@/api/curriculumService'

export default {
  name: 'CurriculumAssignment',
  props: {
    grid: {
      type: Object,
      default: null
    },
    teachers: {
      type: Array,
      default: () => []
    },
    schools: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'assigned'],
  setup(props, { emit }) {
    // Estado
    const loading = ref(false)
    const loadingTeachers = ref(false)
    const error = ref(null)
    const assignmentResult = ref(null)

    // Selección de malla (si no viene pre-seleccionada)
    const grades = ref([])
    const subjects = ref([])
    const allGrids = ref([])
    const selectedGrade = ref(null)
    const selectedSubject = ref(null)
    const selectedGrid = ref(null)

    // Selección de profesores
    const availableTeachers = ref([])
    const selectedTeachers = ref([])
    const selectedSchool = ref(null)
    const searchQuery = ref('')
    const selectAll = ref(false)

    // Computed
    const currentGrid = computed(() => {
      return props.grid || selectedGrid.value
    })

    const availableGrids = computed(() => {
      let filtered = allGrids.value

      if (selectedGrade.value) {
        filtered = filtered.filter(g => g.grade_id === selectedGrade.value)
      }
      if (selectedSubject.value) {
        filtered = filtered.filter(g => g.subject_id === selectedSubject.value)
      }

      return filtered.filter(g => g.active)
    })

    const filteredTeachers = computed(() => {
      if (!searchQuery.value) {
        return availableTeachers.value
      }

      const query = searchQuery.value.toLowerCase()
      return availableTeachers.value.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.email.toLowerCase().includes(query)
      )
    })

    const canAssign = computed(() => {
      return currentGrid.value && selectedTeachers.value.length > 0
    })

    // Métodos
    const loadGrades = async () => {
      try {
        const response = await gradeService.getAll()
        grades.value = response.data || response
      } catch (err) {
        console.error('Error cargando grados:', err)
      }
    }

    const loadSubjects = async () => {
      try {
        const response = await subjectService.getAll()
        subjects.value = response.data || response
      } catch (err) {
        console.error('Error cargando materias:', err)
      }
    }

    const loadGrids = async () => {
      try {
        const response = await curriculumGridService.getAll(1, 100)
        allGrids.value = response.data || response
      } catch (err) {
        console.error('Error cargando mallas:', err)
      }
    }

    const filterGrids = () => {
      selectedGrid.value = null
    }

    const loadTeachers = async () => {
      loadingTeachers.value = true
      try {
        const schoolId = selectedSchool.value
        availableTeachers.value = await curriculumAssignmentService.getAvailableTeachers(schoolId)
      } catch (err) {
        console.error('Error cargando profesores:', err)
        error.value = 'Error al cargar la lista de profesores'
      } finally {
        loadingTeachers.value = false
      }
    }

    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedTeachers.value = filteredTeachers.value.map(t => t.id)
      } else {
        selectedTeachers.value = []
      }
    }

    const handleAssignment = async () => {
      if (!canAssign.value) return

      loading.value = true
      error.value = null
      assignmentResult.value = null

      try {
        const result = await curriculumAssignmentService.assignToTeachers(
          currentGrid.value.id,
          selectedTeachers.value,
          selectedSchool.value
        )

        assignmentResult.value = result

        if (result.success_count > 0) {
          emit('assigned', result)
          
          // Cerrar después de 2 segundos si todo fue exitoso
          if (result.error_count === 0) {
            setTimeout(() => {
              emit('close')
            }, 2000)
          }
        }
      } catch (err) {
        console.error('Error asignando malla:', err)
        error.value = err.response?.data?.message || 'Error al asignar la malla'
      } finally {
        loading.value = false
      }
    }

    // Watchers
    watch(() => props.teachers, (newTeachers) => {
      if (newTeachers && newTeachers.length > 0) {
        availableTeachers.value = newTeachers
      }
    }, { immediate: true })

    watch(selectedTeachers, () => {
      selectAll.value = selectedTeachers.value.length === filteredTeachers.value.length
    })

    // Lifecycle
    onMounted(async () => {
      if (!props.grid) {
        await Promise.all([
          loadGrades(),
          loadSubjects(),
          loadGrids()
        ])
      }

      if (props.teachers.length === 0) {
        await loadTeachers()
      } else {
        availableTeachers.value = props.teachers
      }
    })

    return {
      loading,
      loadingTeachers,
      error,
      assignmentResult,
      grades,
      subjects,
      allGrids,
      selectedGrade,
      selectedSubject,
      selectedGrid,
      availableTeachers,
      selectedTeachers,
      selectedSchool,
      searchQuery,
      selectAll,
      currentGrid,
      availableGrids,
      filteredTeachers,
      canAssign,
      filterGrids,
      loadTeachers,
      toggleSelectAll,
      handleAssignment
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
}

.btn-close:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  font-size: 1.125rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.selected-grid-info {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.selected-grid-info h3 {
  font-size: 1rem;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.grid-summary strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.grid-stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.teachers-selection {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 1rem;
}

.selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.selection-header label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.search-box {
  flex: 1;
  max-width: 300px;
}

.teachers-list {
  max-height: 300px;
  overflow-y: auto;
}

.teacher-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background 0.2s;
}

.teacher-item:hover {
  background: #f9fafb;
}

.teacher-item input[type="checkbox"] {
  margin-top: 0.25rem;
}

.teacher-details {
  flex: 1;
}

.teacher-details strong {
  display: block;
  color: #333;
  margin-bottom: 0.25rem;
}

.teacher-email {
  display: block;
  color: #666;
  font-size: 0.875rem;
}

.teacher-schools {
  margin-top: 0.5rem;
}

.badge-school {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e0e7ff;
  color: #4338ca;
  border-radius: 9999px;
  font-size: 0.75rem;
  margin-right: 0.5rem;
}

.selection-summary {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 8px;
  font-weight: 500;
}

.alert-warning,
.alert-error,
.alert-success {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.alert-warning {
  background: #fef3c7;
  color: #92400e;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
}

.alert-success {
  background: #d1fae5;
  color: #065f46;
}

.assignment-result ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.errors-list {
  margin-top: 1rem;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 8px;
}

.errors-list h4 {
  color: #991b1b;
  margin-bottom: 0.5rem;
}

.error-item {
  color: #dc2626;
  font-size: 0.875rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-secondary:hover:not(:disabled) {
  background: #f3f4f6;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
