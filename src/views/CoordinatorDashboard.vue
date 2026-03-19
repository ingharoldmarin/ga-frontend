<template>
  <div class="coordinator-dashboard">
    <div class="dashboard-header">
      <h1>Panel de Coordinador</h1>
      <p class="subtitle">Gestión de Mallas Curriculares</p>
    </div>

    <!-- Sección de estadísticas -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <h3>{{ totalGrids }}</h3>
          <p>Mallas Disponibles</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👨‍🏫</div>
        <div class="stat-content">
          <h3>{{ totalTeachers }}</h3>
          <p>Profesores</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>{{ totalAssignments }}</h3>
          <p>Asignaciones Activas</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏫</div>
        <div class="stat-content">
          <h3>{{ userSchools.length }}</h3>
          <p>Colegios</p>
        </div>
      </div>
    </div>

    <!-- Pestañas de navegación -->
    <div class="tabs">
      <button 
        :class="{ active: activeTab === 'assign' }" 
        @click="activeTab = 'assign'"
      >
        Asignar Mallas
      </button>
      <button 
        :class="{ active: activeTab === 'teachers' }" 
        @click="activeTab = 'teachers'"
      >
        Ver por Profesor
      </button>
      <button 
        :class="{ active: activeTab === 'grids' }" 
        @click="activeTab = 'grids'"
      >
        Ver por Malla
      </button>
    </div>

    <!-- Contenido de pestañas -->
    <div class="tab-content">
      <!-- Pestaña: Asignar Mallas -->
      <div v-if="activeTab === 'assign'" class="assign-section">
        <div class="section-header">
          <h2>Asignar Mallas a Profesores</h2>
          <button class="btn-primary" @click="openAssignmentModal">
            ➕ Nueva Asignación
          </button>
        </div>

        <!-- Filtros -->
        <div class="filters">
          <select v-model="selectedSchool" class="filter-select">
            <option :value="null">Todos los colegios</option>
            <option v-for="school in userSchools" :key="school.id" :value="school.id">
              {{ school.name }}
            </option>
          </select>

          <select v-model="selectedGrade" class="filter-select">
            <option :value="null">Todos los grados</option>
            <option v-for="grade in grades" :key="grade.id" :value="grade.id">
              {{ grade.name }}
            </option>
          </select>

          <select v-model="selectedSubject" class="filter-select">
            <option :value="null">Todas las materias</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>

        <!-- Lista de mallas disponibles -->
        <div class="grids-list">
          <div v-if="loading" class="loading">Cargando...</div>
          <div v-else-if="filteredGrids.length === 0" class="empty-state">
            No hay mallas disponibles
          </div>
          <div 
            v-else
            v-for="grid in filteredGrids" 
            :key="grid.id" 
            class="grid-card"
          >
            <div class="grid-info">
              <h3>{{ grid.grade_name }} - {{ grid.subject_name }}</h3>
              <p class="grid-description">{{ grid.description || 'Sin descripción' }}</p>
              <div class="grid-meta">
                <span class="badge" :class="{ active: grid.active }">
                  {{ grid.active ? 'Activa' : 'Inactiva' }}
                </span>
                <span class="grid-topics">
                  📋 {{ grid.topics?.length || 0 }} ejes temáticos
                </span>
              </div>
            </div>
            <div class="grid-actions">
              <button 
                class="btn-secondary" 
                @click="viewGridDetails(grid)"
              >
                👁️ Ver Detalles
              </button>
              <button 
                class="btn-primary" 
                @click="assignGrid(grid)"
              >
                ➕ Asignar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pestaña: Ver por Profesor -->
      <div v-if="activeTab === 'teachers'" class="teachers-section">
        <h2>Profesores y sus Asignaciones</h2>
        
        <div class="teachers-list">
          <div v-if="loadingTeachers" class="loading">Cargando profesores...</div>
          <div v-else-if="teachers.length === 0" class="empty-state">
            No hay profesores disponibles
          </div>
          <div 
            v-else
            v-for="teacher in teachers" 
            :key="teacher.id" 
            class="teacher-card"
            @click="viewTeacherAssignments(teacher)"
          >
            <div class="teacher-info">
              <div class="teacher-avatar">👨‍🏫</div>
              <div>
                <h3>{{ teacher.name }}</h3>
                <p class="teacher-email">{{ teacher.email }}</p>
                <div class="teacher-schools">
                  <span 
                    v-for="school in teacher.schools" 
                    :key="school.id" 
                    class="badge-school"
                  >
                    🏫 {{ school.name }}
                  </span>
                </div>
              </div>
            </div>
            <div class="teacher-stats">
              <button class="btn-link">
                Ver Asignaciones →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pestaña: Ver por Malla -->
      <div v-if="activeTab === 'grids'" class="grids-assignments-section">
        <h2>Mallas y Profesores Asignados</h2>
        
        <div class="grids-assignments-list">
          <div v-if="loading" class="loading">Cargando...</div>
          <div 
            v-else
            v-for="grid in allGrids" 
            :key="grid.id" 
            class="grid-assignment-card"
            @click="viewGridAssignments(grid)"
          >
            <div class="grid-assignment-info">
              <h3>{{ grid.grade_name }} - {{ grid.subject_name }}</h3>
              <p>{{ grid.description }}</p>
            </div>
            <div class="grid-assignment-stats">
              <button class="btn-link">
                Ver Profesores →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Asignación -->
    <CurriculumAssignment
      v-if="showAssignmentModal"
      :grid="selectedGridForAssignment"
      :teachers="teachers"
      :schools="userSchools"
      @close="closeAssignmentModal"
      @assigned="handleAssignmentSuccess"
    />

    <!-- Modal de Detalles de Malla -->
    <div v-if="showGridDetails" class="modal-overlay" @click="closeGridDetails">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Detalles de la Malla Curricular</h2>
          <button class="btn-close" @click="closeGridDetails">✕</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedGrid">
            <h3>{{ selectedGrid.grade_name }} - {{ selectedGrid.subject_name }}</h3>
            <p><strong>Descripción:</strong> {{ selectedGrid.description || 'N/A' }}</p>
            
            <div class="grid-details-section">
              <h4>📋 Ejes Temáticos ({{ selectedGrid.topics?.length || 0 }})</h4>
              <ul>
                <li v-for="topic in selectedGrid.topics" :key="topic.id">
                  {{ topic.name }}
                </li>
              </ul>
            </div>

            <div class="grid-details-section">
              <h4>🧩 Componentes ({{ selectedGrid.components?.length || 0 }})</h4>
              <ul>
                <li v-for="comp in selectedGrid.components" :key="comp.id">
                  {{ comp.name }}
                </li>
              </ul>
            </div>

            <div class="grid-details-section">
              <h4>📊 Estándares ({{ selectedGrid.standards?.length || 0 }})</h4>
              <ul>
                <li v-for="std in selectedGrid.standards" :key="std.id">
                  {{ std.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" @click="assignGrid(selectedGrid)">
            Asignar a Profesores
          </button>
          <button class="btn-secondary" @click="closeGridDetails">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Asignaciones de Profesor -->
    <div v-if="showTeacherAssignmentsModal" class="modal-overlay" @click="closeTeacherAssignmentsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Asignaciones de {{ selectedTeacher?.name }}</h2>
          <button class="btn-close" @click="closeTeacherAssignmentsModal">✕</button>
        </div>
        <div class="modal-body">
          <div v-if="loadingAssignments" class="loading">Cargando asignaciones...</div>
          <div v-else-if="teacherAssignments.length === 0" class="empty-state">
            Este profesor no tiene mallas asignadas
          </div>
          <div v-else>
            <div 
              v-for="assignment in teacherAssignments" 
              :key="assignment.curriculum_grid_id"
              class="assignment-item"
            >
              <h4>{{ assignment.grade_name }} - {{ assignment.subject_name }}</h4>
              <p>{{ assignment.description }}</p>
              <div class="assignment-meta">
                <span v-if="assignment.school_name">🏫 {{ assignment.school_name }}</span>
                <span v-if="assignment.assigned_by_name">👤 Asignado por: {{ assignment.assigned_by_name }}</span>
                <span>📅 {{ formatDate(assignment.assigned_at) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeTeacherAssignmentsModal">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Profesores Asignados a una Malla -->
    <div v-if="showGridTeachersModal" class="modal-overlay" @click="closeGridTeachersModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Profesores Asignados</h2>
          <button class="btn-close" @click="closeGridTeachersModal">✕</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedGridForTeachers">
            <h3>{{ selectedGridForTeachers.grade_name }} - {{ selectedGridForTeachers.subject_name }}</h3>
          </div>
          <div v-if="loadingGridTeachers" class="loading">Cargando profesores...</div>
          <div v-else-if="gridTeachers.length === 0" class="empty-state">
            Esta malla no está asignada a ningún profesor
          </div>
          <div v-else>
            <div 
              v-for="teacher in gridTeachers" 
              :key="teacher.teacher_id"
              class="teacher-assignment-item"
            >
              <div class="teacher-assignment-info">
                <h4>{{ teacher.first_name }} {{ teacher.last_name }}</h4>
                <p>{{ teacher.email }}</p>
                <div class="assignment-meta">
                  <span v-if="teacher.school_name">🏫 {{ teacher.school_name }}</span>
                  <span>📅 {{ formatDate(teacher.assigned_at) }}</span>
                </div>
              </div>
              <button 
                class="btn-danger-small"
                @click="unassignTeacher(teacher.teacher_id)"
              >
                Desasignar
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeGridTeachersModal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { curriculumGridService } from '@/api/curriculumGridService'
import { curriculumAssignmentService } from '@/api/curriculumAssignmentService'
import { gradeService, subjectService } from '@/api/curriculumService'
import CurriculumAssignment from '@/components/CurriculumAssignment.vue'

export default {
  name: 'CoordinatorDashboard',
  components: {
    CurriculumAssignment
  },
  setup() {
    const authStore = useAuthStore()

    // Estados
    const loading = ref(false)
    const loadingTeachers = ref(false)
    const loadingAssignments = ref(false)
    const loadingGridTeachers = ref(false)
    const activeTab = ref('assign')
    const allGrids = ref([])
    const teachers = ref([])
    const grades = ref([])
    const subjects = ref([])
    
    // Filtros
    const selectedSchool = ref(null)
    const selectedGrade = ref(null)
    const selectedSubject = ref(null)

    // Modales
    const showAssignmentModal = ref(false)
    const showGridDetails = ref(false)
    const showTeacherAssignmentsModal = ref(false)
    const showGridTeachersModal = ref(false)
    const selectedGrid = ref(null)
    const selectedGridForAssignment = ref(null)
    const selectedTeacher = ref(null)
    const selectedGridForTeachers = ref(null)
    const teacherAssignments = ref([])
    const gridTeachers = ref([])

    // Computed
    const userSchools = computed(() => authStore.user?.schools || [])
    
    const filteredGrids = computed(() => {
      let filtered = allGrids.value

      if (selectedGrade.value) {
        filtered = filtered.filter(g => g.grade_id === selectedGrade.value)
      }
      if (selectedSubject.value) {
        filtered = filtered.filter(g => g.subject_id === selectedSubject.value)
      }

      return filtered.filter(g => g.active)
    })

    const totalGrids = computed(() => allGrids.value.filter(g => g.active).length)
    const totalTeachers = computed(() => teachers.value.length)
    const totalAssignments = computed(() => {
      // Este número se podría obtener del backend si se implementa un endpoint
      return 0
    })

    // Métodos
    const loadGrids = async () => {
      loading.value = true
      try {
        const response = await curriculumGridService.getAll(1, 100)
        allGrids.value = response.data || response
      } catch (error) {
        console.error('Error cargando mallas:', error)
        alert('Error al cargar las mallas curriculares')
      } finally {
        loading.value = false
      }
    }

    const loadTeachers = async () => {
      loadingTeachers.value = true
      try {
        const schoolId = selectedSchool.value
        teachers.value = await curriculumAssignmentService.getAvailableTeachers(schoolId)
      } catch (error) {
        console.error('Error cargando profesores:', error)
        alert('Error al cargar los profesores')
      } finally {
        loadingTeachers.value = false
      }
    }

    const loadGrades = async () => {
      try {
        const response = await gradeService.getAll()
        grades.value = response.data || response
      } catch (error) {
        console.error('Error cargando grados:', error)
      }
    }

    const loadSubjects = async () => {
      try {
        const response = await subjectService.getAll()
        subjects.value = response.data || response
      } catch (error) {
        console.error('Error cargando materias:', error)
      }
    }

    const openAssignmentModal = () => {
      selectedGridForAssignment.value = null
      showAssignmentModal.value = true
    }

    const assignGrid = (grid) => {
      selectedGridForAssignment.value = grid
      showAssignmentModal.value = true
    }

    const closeAssignmentModal = () => {
      showAssignmentModal.value = false
      selectedGridForAssignment.value = null
    }

    const handleAssignmentSuccess = () => {
      closeAssignmentModal()
      // Opcional: recargar datos
    }

    const viewGridDetails = (grid) => {
      selectedGrid.value = grid
      showGridDetails.value = true
    }

    const closeGridDetails = () => {
      showGridDetails.value = false
      selectedGrid.value = null
    }

    const viewTeacherAssignments = async (teacher) => {
      selectedTeacher.value = teacher
      loadingAssignments.value = true
      showTeacherAssignmentsModal.value = true
      
      try {
        const response = await curriculumAssignmentService.getTeacherAssignments(teacher.id)
        teacherAssignments.value = response.assignments || []
      } catch (error) {
        console.error('Error cargando asignaciones del profesor:', error)
        teacherAssignments.value = []
      } finally {
        loadingAssignments.value = false
      }
    }

    const closeTeacherAssignmentsModal = () => {
      showTeacherAssignmentsModal.value = false
      selectedTeacher.value = null
      teacherAssignments.value = []
    }

    const viewGridAssignments = async (grid) => {
      selectedGridForTeachers.value = grid
      loadingGridTeachers.value = true
      showGridTeachersModal.value = true
      
      try {
        const response = await curriculumAssignmentService.getGridAssignments(grid.id)
        gridTeachers.value = response.teachers || []
      } catch (error) {
        console.error('Error cargando profesores de la malla:', error)
        gridTeachers.value = []
      } finally {
        loadingGridTeachers.value = false
      }
    }

    const closeGridTeachersModal = () => {
      showGridTeachersModal.value = false
      selectedGridForTeachers.value = null
      gridTeachers.value = []
    }

    const unassignTeacher = async (teacherId) => {
      if (!confirm('¿Estás seguro de desasignar esta malla del profesor?')) {
        return
      }

      try {
        await curriculumAssignmentService.unassignFromTeacher(
          selectedGridForTeachers.value.id,
          teacherId
        )
        // Recargar la lista de profesores
        await viewGridAssignments(selectedGridForTeachers.value)
        alert('Malla desasignada exitosamente')
      } catch (error) {
        console.error('Error desasignando malla:', error)
        alert('Error al desasignar la malla')
      }
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

    // Lifecycle
    onMounted(async () => {
      await Promise.all([
        loadGrids(),
        loadTeachers(),
        loadGrades(),
        loadSubjects()
      ])
    })

    return {
      loading,
      loadingTeachers,
      loadingAssignments,
      loadingGridTeachers,
      activeTab,
      allGrids,
      teachers,
      grades,
      subjects,
      selectedSchool,
      selectedGrade,
      selectedSubject,
      showAssignmentModal,
      showGridDetails,
      showTeacherAssignmentsModal,
      showGridTeachersModal,
      selectedGrid,
      selectedGridForAssignment,
      selectedTeacher,
      selectedGridForTeachers,
      teacherAssignments,
      gridTeachers,
      userSchools,
      filteredGrids,
      totalGrids,
      totalTeachers,
      totalAssignments,
      openAssignmentModal,
      assignGrid,
      closeAssignmentModal,
      handleAssignmentSuccess,
      viewGridDetails,
      closeGridDetails,
      viewTeacherAssignments,
      closeTeacherAssignmentsModal,
      viewGridAssignments,
      closeGridTeachersModal,
      unassignTeacher,
      formatDate
    }
  }
}
</script>

<style scoped>
.coordinator-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content h3 {
  font-size: 2rem;
  margin: 0;
  font-weight: 700;
}

.stat-content p {
  margin: 0;
  opacity: 0.9;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.tabs button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tabs button:hover {
  color: #667eea;
}

.tabs button.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  color: #333;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  min-width: 200px;
}

.grids-list,
.teachers-list,
.grids-assignments-list {
  display: grid;
  gap: 1rem;
}

.grid-card,
.teacher-card,
.grid-assignment-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.grid-card:hover,
.teacher-card:hover,
.grid-assignment-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.grid-info h3,
.teacher-info h3 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.grid-description {
  color: #666;
  margin-bottom: 0.75rem;
}

.grid-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #fef3c7;
  color: #92400e;
}

.badge.active {
  background: #d1fae5;
  color: #065f46;
}

.badge-school {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e0e7ff;
  color: #4338ca;
  border-radius: 9999px;
  font-size: 0.875rem;
  margin-right: 0.5rem;
}

.grid-topics {
  color: #666;
  font-size: 0.875rem;
}

.grid-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary,
.btn-secondary,
.btn-link {
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

.btn-primary:hover {
  background: #5568d3;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

.btn-link {
  background: none;
  color: #667eea;
  padding: 0.5rem 1rem;
}

.btn-link:hover {
  text-decoration: underline;
}

.btn-danger-small {
  padding: 0.5rem 1rem;
  background: #fee2e2;
  color: #991b1b;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.btn-danger-small:hover {
  background: #fecaca;
}

.teacher-card {
  cursor: pointer;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.teacher-avatar {
  font-size: 3rem;
}

.teacher-email {
  color: #666;
  font-size: 0.9rem;
}

.teacher-schools {
  margin-top: 0.5rem;
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

/* Modal Styles */
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
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
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
}

.modal-body {
  padding: 1.5rem;
}

.grid-details-section {
  margin-bottom: 1.5rem;
}

.grid-details-section h4 {
  color: #667eea;
  margin-bottom: 0.75rem;
}

.grid-details-section ul {
  list-style: none;
  padding-left: 0;
}

.grid-details-section li {
  padding: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.assignment-item,
.teacher-assignment-item {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.assignment-item h4,
.teacher-assignment-item h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.assignment-item p {
  margin: 0 0 0.5rem 0;
  color: #666;
}

.assignment-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
  flex-wrap: wrap;
}

.teacher-assignment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.teacher-assignment-info {
  flex: 1;
}

.teacher-assignment-info h4 {
  margin-bottom: 0.25rem;
}

.teacher-assignment-info p {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}
</style>