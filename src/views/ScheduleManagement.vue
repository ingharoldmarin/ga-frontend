<template>
  <div class="schedule-management">
    <div class="header-section">
      <button class="btn-back" @click="goBack">
        ← Volver
      </button>
      <div class="header-content">
        <h1>Gestión de Cronograma</h1>
        <p class="subtitle" v-if="gridInfo">
          {{ gridInfo.grade_name }} - {{ gridInfo.subject_name }}
        </p>
      </div>
    </div>

    <!-- Estadísticas del cronograma -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <h3>{{ schedules.length }}</h3>
          <p>Clases Programadas</p>
        </div>
      </div>
      <div class="stat-card success">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>{{ executedCount }}</h3>
          <p>Clases Ejecutadas</p>
        </div>
      </div>
      <div class="stat-card pending">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <h3>{{ pendingCount }}</h3>
          <p>Clases Pendientes</p>
        </div>
      </div>
      <div class="stat-card info">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>{{ progressPercentage }}%</h3>
          <p>Progreso</p>
        </div>
      </div>
    </div>

    <!-- Controles -->
    <div class="controls-section">
      <button class="btn-primary" @click="openCreateModal">
        ➕ Crear Cronograma
      </button>
      <button class="btn-secondary" @click="loadSchedules">
        🔄 Actualizar
      </button>
    </div>

    <!-- Lista de cronogramas -->
    <div class="schedules-container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        Cargando cronogramas...
      </div>

      <div v-else-if="schedules.length === 0" class="empty-state">
        <div class="empty-icon">📅</div>
        <h2>No hay cronogramas creados</h2>
        <p>Crea tu primer cronograma de ejecución para esta malla curricular.</p>
        <button class="btn-primary" @click="openCreateModal">
          ➕ Crear Primer Cronograma
        </button>
      </div>

      <div v-else class="schedules-table">
        <table>
          <thead>
            <tr>
              <th>Semana</th>
              <th>Eje Temático</th>
              <th>Componente</th>
              <th>Estándar</th>
              <th>Competencia</th>
              <th>Colegio</th>
              <th>Estado</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="schedule in schedules" :key="schedule.id" :class="{ executed: schedule.executed }">
              <td>{{ getWeekName(schedule.week_id) }}</td>
              <td>{{ getTopicName(schedule.topic_id) }}</td>
              <td>{{ getComponentName(schedule.component_id) }}</td>
              <td>{{ getStandardName(schedule.standard_id) }}</td>
              <td class="truncate">{{ getCompetenceName(schedule.competence_id) }}</td>
              <td>{{ getSchoolName(schedule.school_id) }}</td>
              <td>
                <span class="badge" :class="{ executed: schedule.executed }">
                  {{ schedule.executed ? '✅ Ejecutada' : '⏳ Pendiente' }}
                </span>
              </td>
              <td class="truncate">{{ schedule.observation || '-' }}</td>
              <td>
                <div class="actions-buttons">
                  <button 
                    class="btn-icon btn-success" 
                    @click="toggleExecuted(schedule)"
                    :title="schedule.executed ? 'Marcar como pendiente' : 'Marcar como ejecutada'"
                  >
                    {{ schedule.executed ? '↩️' : '✓' }}
                  </button>
                  <button 
                    class="btn-icon btn-primary" 
                    @click="editSchedule(schedule)"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    class="btn-icon btn-danger" 
                    @click="deleteSchedule(schedule)"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Crear/Editar Cronograma -->
    <div v-if="showScheduleModal" class="modal-overlay" @click="closeScheduleModal">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h2>{{ editingSchedule ? 'Editar Cronograma' : 'Crear Cronograma' }}</h2>
          <button class="btn-close" @click="closeScheduleModal">✕</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="saveSchedule">
            <!-- Selección de semanas (múltiples para crear, única para editar) -->
            <div class="form-group" v-if="!editingSchedule">
              <label>Semanas *</label>
              <div class="weeks-selection">
                <label v-for="week in weeks" :key="week.id" class="week-checkbox">
                  <input 
                    type="checkbox" 
                    :value="week.id" 
                    v-model="scheduleForm.week_ids"
                  />
                  {{ week.name }}
                </label>
              </div>
              <small>Puedes seleccionar múltiples semanas para crear varios cronogramas a la vez</small>
            </div>

            <div class="form-group" v-else>
              <label>Semana *</label>
              <select v-model="scheduleForm.week_id" class="form-control" required>
                <option :value="null">-- Seleccionar Semana --</option>
                <option v-for="week in weeks" :key="week.id" :value="week.id">
                  {{ week.name }}
                </option>
              </select>
            </div>

            <!-- Resto de campos -->
            <div class="form-row">
              <div class="form-group">
                <label>Eje Temático *</label>
                <select v-model="scheduleForm.topic_id" class="form-control" required>
                  <option :value="null">-- Seleccionar --</option>
                  <option v-for="topic in gridInfo?.topics" :key="topic.id" :value="topic.id">
                    {{ topic.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>Componente *</label>
                <select v-model="scheduleForm.component_id" class="form-control" required>
                  <option :value="null">-- Seleccionar --</option>
                  <option v-for="comp in gridInfo?.components" :key="comp.id" :value="comp.id">
                    {{ comp.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Estándar *</label>
              <select v-model="scheduleForm.standard_id" class="form-control" required>
                <option :value="null">-- Seleccionar Estándar --</option>
                <option v-for="std in gridInfo?.standards" :key="std.id" :value="std.id">
                  {{ std.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Competencia *</label>
              <select v-model="scheduleForm.competence_id" class="form-control" required>
                <option :value="null">-- Seleccionar Competencia --</option>
                <option v-for="comp in gridInfo?.competences" :key="comp.id" :value="comp.id">
                  {{ comp.description }}
                </option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Afirmación DNA/DBA *</label>
                <select v-model="scheduleForm.affirmation_id" class="form-control" required>
                  <option :value="null">-- Seleccionar --</option>
                  <option v-for="aff in gridInfo?.affirmations" :key="aff.id" :value="aff.id">
                    {{ aff.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>Evidencia DNA/DBA *</label>
                <select v-model="scheduleForm.evidence_id" class="form-control" required>
                  <option :value="null">-- Seleccionar --</option>
                  <option v-for="evid in gridInfo?.evidences" :key="evid.id" :value="evid.id">
                    {{ evid.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Colegio *</label>
              <select v-model="scheduleForm.school_id" class="form-control" required>
                <option :value="null">-- Seleccionar Colegio --</option>
                <option v-for="school in schools" :key="school.id" :value="school.id">
                  {{ school.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>
                <input type="checkbox" v-model="scheduleForm.executed" />
                Marcar como ejecutada
              </label>
            </div>

            <div class="form-group">
              <label>Observaciones</label>
              <textarea 
                v-model="scheduleForm.observation" 
                class="form-control"
                rows="3"
                placeholder="Añadir observaciones..."
              ></textarea>
            </div>

            <div v-if="saveError" class="alert-error">
              {{ saveError }}
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="closeScheduleModal" :disabled="saving">
            Cancelar
          </button>
          <button class="btn-primary" @click="saveSchedule" :disabled="saving">
            {{ saving ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { curriculumAssignmentService } from '@/api/curriculumAssignmentService'
import { curriculumGridService } from '@/api/curriculumGridService'
import { scheduleService, weekService } from '@/api/scheduleService'

export default {
  name: 'ScheduleManagement',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()

    // Estado
    const loading = ref(false)
    const saving = ref(false)
    const saveError = ref(null)
    const gridInfo = ref(null)
    const schedules = ref([])
    const weeks = ref([])
    const showScheduleModal = ref(false)
    const editingSchedule = ref(null)

    // Formulario
    const scheduleForm = ref({
      week_id: null,
      week_ids: [],
      topic_id: null,
      component_id: null,
      didactic_unit_id: null, // Si tu tabla lo requiere
      standard_id: null,
      competence_id: null,
      affirmation_id: null,
      evidence_id: null,
      school_id: null,
      executed: false,
      observation: ''
    })

    // Computed
    const schools = computed(() => authStore.user?.schools || [])

    const executedCount = computed(() => {
      return schedules.value.filter(s => s.executed).length
    })

    const pendingCount = computed(() => {
      return schedules.value.filter(s => !s.executed).length
    })

    const progressPercentage = computed(() => {
      if (schedules.value.length === 0) return 0
      return Math.round((executedCount.value / schedules.value.length) * 100)
    })

    // Métodos
    const loadGridInfo = async () => {
      try {
        const gridId = route.params.gridId
        const response = await curriculumGridService.getById(gridId)
        gridInfo.value = response
      } catch (error) {
        console.error('Error cargando información de la malla:', error)
        alert('Error al cargar la información de la malla')
      }
    }

    const loadSchedules = async () => {
      loading.value = true
      try {
        const gradeId = route.params.gradeId
        const subjectId = route.params.subjectId
        
        const response = await scheduleService.getByGrid(gradeId, subjectId)
        schedules.value = response.data || response
      } catch (error) {
        console.error('Error cargando cronogramas:', error)
        alert('Error al cargar los cronogramas')
      } finally {
        loading.value = false
      }
    }

    const loadWeeks = async () => {
      try {
        const response = await weekService.getAll()
        weeks.value = response.data || response
      } catch (error) {
        console.error('Error cargando semanas:', error)
      }
    }

    const openCreateModal = () => {
      editingSchedule.value = null
      scheduleForm.value = {
        week_id: null,
        week_ids: [],
        topic_id: null,
        component_id: null,
        didactic_unit_id: null,
        standard_id: null,
        competence_id: null,
        affirmation_id: null,
        evidence_id: null,
        school_id: schools.value[0]?.id || null,
        executed: false,
        observation: ''
      }
      showScheduleModal.value = true
    }

    const editSchedule = (schedule) => {
      editingSchedule.value = schedule
      scheduleForm.value = {
        week_id: schedule.week_id,
        week_ids: [],
        topic_id: schedule.topic_id,
        component_id: schedule.component_id,
        didactic_unit_id: schedule.didactic_unit_id,
        standard_id: schedule.standard_id,
        competence_id: schedule.competence_id,
        affirmation_id: schedule.affirmation_id,
        evidence_id: schedule.evidence_id,
        school_id: schedule.school_id,
        executed: schedule.executed,
        observation: schedule.observation || ''
      }
      showScheduleModal.value = true
    }

    const closeScheduleModal = () => {
      showScheduleModal.value = false
      editingSchedule.value = null
      saveError.value = null
    }

    const saveSchedule = async () => {
      saving.value = true
      saveError.value = null

      try {
        const gradeId = route.params.gradeId
        const subjectId = route.params.subjectId

        if (editingSchedule.value) {
          // Editar cronograma existente
          await scheduleService.update(editingSchedule.value.id, {
            grade_id: gradeId,
            subject_id: subjectId,
            week_id: scheduleForm.value.week_id,
            topic_id: scheduleForm.value.topic_id,
            component_id: scheduleForm.value.component_id,
            didactic_unit_id: scheduleForm.value.didactic_unit_id || gridInfo.value.topics[0]?.id,
            standard_id: scheduleForm.value.standard_id,
            competence_id: scheduleForm.value.competence_id,
            affirmation_id: scheduleForm.value.affirmation_id,
            evidence_id: scheduleForm.value.evidence_id,
            school_id: scheduleForm.value.school_id,
            executed: scheduleForm.value.executed,
            observation: scheduleForm.value.observation
          })
        } else {
          // Crear cronograma(s) nuevo(s)
          if (scheduleForm.value.week_ids.length === 0) {
            saveError.value = 'Debes seleccionar al menos una semana'
            return
          }

          await scheduleService.createBatch({
            grade_id: gradeId,
            subject_id: subjectId,
            topic_id: scheduleForm.value.topic_id,
            component_id: scheduleForm.value.component_id,
            didactic_unit_id: scheduleForm.value.didactic_unit_id || gridInfo.value.topics[0]?.id,
            standard_id: scheduleForm.value.standard_id,
            competence_id: scheduleForm.value.competence_id,
            affirmation_id: scheduleForm.value.affirmation_id,
            evidence_id: scheduleForm.value.evidence_id,
            school_id: scheduleForm.value.school_id,
            executed: scheduleForm.value.executed,
            observation: scheduleForm.value.observation
          }, scheduleForm.value.week_ids)
        }

        closeScheduleModal()
        await loadSchedules()
      } catch (error) {
        console.error('Error guardando cronograma:', error)
        saveError.value = error.response?.data?.message || 'Error al guardar el cronograma'
      } finally {
        saving.value = false
      }
    }

    const toggleExecuted = async (schedule) => {
      try {
        await scheduleService.markAsExecuted(schedule.id, !schedule.executed, schedule.observation)
        await loadSchedules()
      } catch (error) {
        console.error('Error actualizando estado:', error)
        alert('Error al actualizar el estado de ejecución')
      }
    }

    const deleteSchedule = async (schedule) => {
      if (!confirm('¿Estás seguro de eliminar este cronograma?')) {
        return
      }

      try {
        await scheduleService.delete(schedule.id)
        await loadSchedules()
      } catch (error) {
        console.error('Error eliminando cronograma:', error)
        alert('Error al eliminar el cronograma')
      }
    }

    const goBack = () => {
      router.push({ name: 'TeacherDashboard' })
    }

    // Helpers para mostrar nombres
    const getWeekName = (weekId) => {
      return weeks.value.find(w => w.id === weekId)?.name || `Semana ${weekId}`
    }

    const getTopicName = (topicId) => {
      return gridInfo.value?.topics?.find(t => t.id === topicId)?.name || '-'
    }

    const getComponentName = (componentId) => {
      return gridInfo.value?.components?.find(c => c.id === componentId)?.name || '-'
    }

    const getStandardName = (standardId) => {
      return gridInfo.value?.standards?.find(s => s.id === standardId)?.name || '-'
    }

    const getCompetenceName = (competenceId) => {
      return gridInfo.value?.competences?.find(c => c.id === competenceId)?.description || '-'
    }

    const getSchoolName = (schoolId) => {
      return schools.value.find(s => s.id === schoolId)?.name || '-'
    }

    // Lifecycle
    onMounted(async () => {
      await Promise.all([
        loadGridInfo(),
        loadSchedules(),
        loadWeeks()
      ])
    })

    return {
      loading,
      saving,
      saveError,
      gridInfo,
      schedules,
      weeks,
      showScheduleModal,
      editingSchedule,
      scheduleForm,
      schools,
      executedCount,
      pendingCount,
      progressPercentage,
      loadSchedules,
      openCreateModal,
      editSchedule,
      closeScheduleModal,
      saveSchedule,
      toggleExecuted,
      deleteSchedule,
      goBack,
      getWeekName,
      getTopicName,
      getComponentName,
      getStandardName,
      getCompetenceName,
      getSchoolName
    }
  }
}
</script>

<style scoped>
.schedule-management {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-back {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-back:hover {
  background: #f3f4f6;
}

.header-content h1 {
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

.stat-card.success {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
}

.stat-card.pending {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-card.info {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
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

.controls-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
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

.btn-secondary:hover {
  background: #f3f4f6;
}

.schedules-container {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
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

.schedules-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  white-space: nowrap;
}

tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s;
}

tbody tr:hover {
  background: #f9fafb;
}

tbody tr.executed {
  background: #f0fdf4;
}

td {
  padding: 1rem;
  color: #666;
  font-size: 0.875rem;
}

td.truncate {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #fef3c7;
  color: #92400e;
}

.badge.executed {
  background: #d1fae5;
  color: #065f46;
}

.actions-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-icon.btn-success {
  background: #d1fae5;
  color: #065f46;
}

.btn-icon.btn-success:hover {
  background: #a7f3d0;
}

.btn-icon.btn-primary {
  background: #dbeafe;
  color: #1e40af;
}

.btn-icon.btn-primary:hover {
  background: #bfdbfe;
}

.btn-icon.btn-danger {
  background: #fee2e2;
  color: #991b1b;
}

.btn-icon.btn-danger:hover {
  background: #fecaca;
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
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-content.large {
  max-width: 1000px;
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

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
}

.form-group small {
  color: #666;
  font-size: 0.875rem;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.weeks-selection {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.week-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.week-checkbox input {
  cursor: pointer;
}

.alert-error {
  padding: 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  margin-top: 1rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
