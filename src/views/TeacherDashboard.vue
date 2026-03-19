<template>
  <div class="teacher-dashboard">
    <div class="dashboard-header">
      <h1>Panel de Profesor</h1>
      <p class="subtitle">Mis Mallas Curriculares Asignadas</p>
    </div>

    <!-- Estadísticas -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <h3>{{ assignments.length }}</h3>
          <p>Mallas Asignadas</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <h3>{{ totalSchedules }}</h3>
          <p>Cronogramas Creados</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>{{ executedSchedules }}</h3>
          <p>Clases Ejecutadas</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>{{ completionPercentage }}%</h3>
          <p>Progreso</p>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filters-section">
      <div class="filters">
        <select v-model="filterSchool" class="filter-select">
          <option :value="null">Todos los colegios</option>
          <option v-for="school in schools" :key="school.id" :value="school.id">
            {{ school.name }}
          </option>
        </select>

        <select v-model="filterGrade" class="filter-select">
          <option :value="null">Todos los grados</option>
          <option v-for="grade in uniqueGrades" :key="grade" :value="grade">
            {{ grade }}
          </option>
        </select>

        <select v-model="filterSubject" class="filter-select">
          <option :value="null">Todas las materias</option>
          <option v-for="subject in uniqueSubjects" :key="subject" :value="subject">
            {{ subject }}
          </option>
        </select>
      </div>

      <button class="btn-refresh" @click="loadAssignments">
        🔄 Actualizar
      </button>
    </div>

    <!-- Lista de mallas asignadas -->
    <div class="assignments-container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        Cargando mallas asignadas...
      </div>

      <div v-else-if="filteredAssignments.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <h2>No tienes mallas asignadas</h2>
        <p>Espera a que tu coordinador te asigne mallas curriculares para poder crear cronogramas.</p>
      </div>

      <div v-else class="assignments-grid">
        <div 
          v-for="assignment in filteredAssignments" 
          :key="assignment.curriculum_grid_id"
          class="assignment-card"
        >
          <div class="card-header">
            <div class="card-badge" :class="{ active: assignment.active }">
              {{ assignment.active ? 'Activa' : 'Inactiva' }}
            </div>
            <div class="card-school" v-if="assignment.school_name">
              🏫 {{ assignment.school_name }}
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title">
              {{ assignment.grade_name }} - {{ assignment.subject_name }}
            </h3>
            <p class="card-description">
              {{ assignment.description || 'Sin descripción' }}
            </p>

            <div class="card-meta">
              <div class="meta-item">
                <span class="meta-label">Asignado por:</span>
                <span class="meta-value">{{ assignment.assigned_by_name || 'No especificado' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Fecha de asignación:</span>
                <span class="meta-value">{{ formatDate(assignment.assigned_at) }}</span>
              </div>
            </div>

            <div class="card-stats">
              <div class="stat-item">
                <strong>{{ assignment.topics?.length || 0 }}</strong>
                <span>Ejes Temáticos</span>
              </div>
              <div class="stat-item">
                <strong>{{ assignment.components?.length || 0 }}</strong>
                <span>Componentes</span>
              </div>
              <div class="stat-item">
                <strong>{{ assignment.standards?.length || 0 }}</strong>
                <span>Estándares</span>
              </div>
              <div class="stat-item">
                <strong>{{ assignment.competences?.length || 0 }}</strong>
                <span>Competencias</span>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button 
              class="btn-secondary" 
              @click="viewDetails(assignment)"
            >
              👁️ Ver Detalles
            </button>
            <button 
              class="btn-primary" 
              @click="manageSchedule(assignment)"
              :disabled="!assignment.active"
            >
              📅 Gestionar Cronograma
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Detalles de la Malla Curricular</h2>
          <button class="btn-close" @click="closeDetailsModal">✕</button>
        </div>

        <div class="modal-body">
          <div v-if="selectedAssignment">
            <div class="detail-section">
              <h3>Información General</h3>
              <p><strong>Grado:</strong> {{ selectedAssignment.grade_name }}</p>
              <p><strong>Materia:</strong> {{ selectedAssignment.subject_name }}</p>
              <p><strong>Descripción:</strong> {{ selectedAssignment.description || 'N/A' }}</p>
              <p><strong>Estado:</strong> {{ selectedAssignment.active ? 'Activa' : 'Inactiva' }}</p>
            </div>

            <div class="detail-section">
              <h3>📋 Ejes Temáticos ({{ selectedAssignment.topics?.length || 0 }})</h3>
              <ul class="detail-list">
                <li v-for="topic in selectedAssignment.topics" :key="topic.id">
                  {{ topic.name }}
                </li>
              </ul>
            </div>

            <div class="detail-section">
              <h3>🧩 Componentes ({{ selectedAssignment.components?.length || 0 }})</h3>
              <ul class="detail-list">
                <li v-for="comp in selectedAssignment.components" :key="comp.id">
                  {{ comp.name }}
                </li>
              </ul>
            </div>

            <div class="detail-section">
              <h3>📊 Estándares ({{ selectedAssignment.standards?.length || 0 }})</h3>
              <ul class="detail-list">
                <li v-for="std in selectedAssignment.standards" :key="std.id">
                  {{ std.name }}
                </li>
              </ul>
            </div>

            <div class="detail-section">
              <h3>🎯 Competencias ({{ selectedAssignment.competences?.length || 0 }})</h3>
              <ul class="detail-list">
                <li v-for="comp in selectedAssignment.competences" :key="comp.id">
                  {{ comp.description }}
                </li>
              </ul>
            </div>

            <div class="detail-section">
              <h3>✍️ Afirmaciones DNA/DBA ({{ selectedAssignment.affirmations?.length || 0 }})</h3>
              <ul class="detail-list">
                <li v-for="aff in selectedAssignment.affirmations" :key="aff.id">
                  {{ aff.name }}
                </li>
              </ul>
            </div>

            <div class="detail-section">
              <h3>📝 Evidencias DNA/DBA ({{ selectedAssignment.evidences?.length || 0 }})</h3>
              <ul class="detail-list">
                <li v-for="evid in selectedAssignment.evidences" :key="evid.id">
                  {{ evid.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-primary" @click="manageSchedule(selectedAssignment)">
            📅 Gestionar Cronograma
          </button>
          <button class="btn-secondary" @click="closeDetailsModal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { curriculumAssignmentService } from '@/api/curriculumAssignmentService'
import { scheduleService } from '@/api/scheduleService'

export default {
  name: 'TeacherDashboard',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    // Estado
    const loading = ref(false)
    const assignments = ref([])
    const schedules = ref([])
    
    // Filtros
    const filterSchool = ref(null)
    const filterGrade = ref(null)
    const filterSubject = ref(null)

    // Modal
    const showDetailsModal = ref(false)
    const selectedAssignment = ref(null)

    // Computed
    const schools = computed(() => authStore.user?.schools || [])

    const uniqueGrades = computed(() => {
      return [...new Set(assignments.value.map(a => a.grade_name))].sort()
    })

    const uniqueSubjects = computed(() => {
      return [...new Set(assignments.value.map(a => a.subject_name))].sort()
    })

    const filteredAssignments = computed(() => {
      let filtered = assignments.value

      if (filterSchool.value) {
        filtered = filtered.filter(a => a.school_id === filterSchool.value)
      }
      if (filterGrade.value) {
        filtered = filtered.filter(a => a.grade_name === filterGrade.value)
      }
      if (filterSubject.value) {
        filtered = filtered.filter(a => a.subject_name === filterSubject.value)
      }

      return filtered
    })

    const totalSchedules = computed(() => schedules.value.length)

    const executedSchedules = computed(() => {
      return schedules.value.filter(s => s.executed).length
    })

    const completionPercentage = computed(() => {
      if (totalSchedules.value === 0) return 0
      return Math.round((executedSchedules.value / totalSchedules.value) * 100)
    })

    // Métodos
    const loadAssignments = async () => {
      loading.value = true
      try {
        assignments.value = await curriculumAssignmentService.getMyAssignments()
      } catch (error) {
        console.error('Error cargando asignaciones:', error)
        alert('Error al cargar las mallas asignadas')
      } finally {
        loading.value = false
      }
    }

    const loadSchedules = async () => {
      try {
        // Cargar todos los cronogramas del profesor
        const response = await scheduleService.getAll({}, 1, 1000)
        schedules.value = response.data || response
      } catch (error) {
        console.error('Error cargando cronogramas:', error)
      }
    }

    const viewDetails = (assignment) => {
      selectedAssignment.value = assignment
      showDetailsModal.value = true
    }

    const closeDetailsModal = () => {
      showDetailsModal.value = false
      selectedAssignment.value = null
    }

    const manageSchedule = (assignment) => {
      router.push({
        name: 'ScheduleManagement',
        params: {
          gradeId: assignment.grade_id,
          subjectId: assignment.subject_id,
          gridId: assignment.curriculum_grid_id
        }
      })
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
        loadAssignments(),
        loadSchedules()
      ])
    })

    return {
      loading,
      assignments,
      filterSchool,
      filterGrade,
      filterSubject,
      showDetailsModal,
      selectedAssignment,
      schools,
      uniqueGrades,
      uniqueSubjects,
      filteredAssignments,
      totalSchedules,
      executedSchedules,
      completionPercentage,
      loadAssignments,
      viewDetails,
      closeDetailsModal,
      manageSchedule,
      formatDate
    }
  }
}
</script>

<style scoped>
.teacher-dashboard {
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  flex: 1;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  min-width: 200px;
}

.btn-refresh {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-refresh:hover {
  background: #f3f4f6;
}

.assignments-container {
  min-height: 400px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.assignments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.assignment-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.assignment-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.card-header {
  background: #f9fafb;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.card-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #fef3c7;
  color: #92400e;
}

.card-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.card-school {
  font-size: 0.875rem;
  color: #666;
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 0.75rem;
}

.card-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.card-meta {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.meta-label {
  color: #666;
}

.meta-value {
  color: #333;
  font-weight: 500;
}

.card-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stat-item {
  text-align: center;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 8px;
}

.stat-item strong {
  display: block;
  font-size: 1.25rem;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.stat-item span {
  font-size: 0.75rem;
  color: #666;
}

.card-actions {
  padding: 1rem 1.5rem;
  background: #f9fafb;
  display: flex;
  gap: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-size: 0.875rem;
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

.btn-secondary:hover {
  background: #f3f4f6;
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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
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
}

.btn-close:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  color: #667eea;
  margin-bottom: 0.75rem;
  font-size: 1.125rem;
}

.detail-section p {
  margin-bottom: 0.5rem;
  color: #333;
}

.detail-list {
  list-style: none;
  padding: 0;
}

.detail-list li {
  padding: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
  color: #666;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
