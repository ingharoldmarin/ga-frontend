<template>
  <div class="malla-container">
    <!-- Header mejorado -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <span class="title-icon">📚</span>
          <h1 class="page-title">Malla Curricular</h1>
        </div>
        <p class="page-subtitle">Relaciona grados y asignaturas con la estructura curricular (Selección Múltiple)</p>
      </div>
    </div>

    <!-- Sección de filtros mejorada -->
    <div class="filter-section">
      <div class="filter-header">
        <span class="filter-icon">🔍</span>
        <h2 class="filter-title">Selecciona Grado y Asignatura</h2>
      </div>
      
      <div class="filter-grid">
        <div class="filter-group">
          <label class="filter-label">Grado: <span class="required">*</span></label>
          <select v-model="selectedGrade" @change="loadCurriculumData" class="filter-select">
            <option value="">Seleccionar grado</option>
            <option v-for="grade in grades" :key="grade.id" :value="grade.id">
              {{ grade.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Asignatura: <span class="required">*</span></label>
          <select v-model="selectedSubject" @change="loadCurriculumData" class="filter-select">
            <option value="">Seleccionar asignatura</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="filter-info" v-if="selectedGrade && selectedSubject">
        <div class="info-badge">
          <span class="badge-label">Malla para:</span>
          <span class="badge-value">{{ getGradeName(selectedGrade) }} - {{ getSubjectName(selectedSubject) }}</span>
        </div>
      </div>
    </div>

    <!-- Botón agregar -->
    <div class="action-section">
      <button 
        @click="openCreateModal" 
        class="btn-add"
        :disabled="!selectedGrade || !selectedSubject"
      >
        <span class="btn-icon">➕</span>
        Agregar Elemento a la Malla
      </button>
      <p class="action-hint" v-if="!selectedGrade || !selectedSubject">
        * Selecciona grado y asignatura para agregar elementos
      </p>
    </div>

    <!-- Tabla mejorada -->
    <div class="table-container" v-if="curriculumData.length > 0">
      <div class="table-wrapper">
        <table class="curriculum-table">
          <thead>
            <tr>
              <th class="th-id">ID</th>
              <th class="th-main">Ejes Temáticos</th>
              <th class="th-main">Componentes</th>
              <th class="th-main">Estándares</th>
              <th class="th-main">Competencias</th>
              <th class="th-main">Afirmaciones</th>
              <th class="th-main">Evidencias</th>
              <th class="th-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in curriculumData" :key="item.id" :class="{'row-even': index % 2 === 0, 'row-odd': index % 2 !== 0}">
              <td class="td-id">
                <span class="id-badge">{{ item.id }}</span>
              </td>
              <td class="td-content">
                <div class="cell-content">
                  <span class="cell-icon">🎯</span>
                  <span class="cell-text">{{ getTopicName(item.topic_id) }}</span>
                </div>
              </td>
              <td class="td-content">
                <div class="cell-content">
                  <span class="cell-icon">🧩</span>
                  <span class="cell-text">{{ getComponentName(item.component_id) }}</span>
                </div>
              </td>
              <td class="td-content">
                <div class="cell-content">
                  <span class="cell-icon">📋</span>
                  <span class="cell-text">{{ getStandardName(item.standard_id) }}</span>
                </div>
              </td>
              <td class="td-content">
                <div class="cell-content">
                  <span class="cell-icon">💪</span>
                  <span class="cell-text">{{ getCompetencyName(item.competency_id) }}</span>
                </div>
              </td>
              <td class="td-content">
                <div class="cell-content">
                  <span class="cell-icon">✅</span>
                  <span class="cell-text">{{ getClaimName(item.claim_id) }}</span>
                </div>
              </td>
              <td class="td-content">
                <div class="cell-content">
                  <span class="cell-icon">🔍</span>
                  <span class="cell-text">{{ getEvidenceName(item.evidence_id) }}</span>
                </div>
              </td>
              <td class="td-actions">
                <div class="action-buttons">
                  <button @click="editItem(item)" class="btn-action btn-edit" title="Editar">
                    <span>✏️</span>
                  </button>
                  <button @click="deleteItem(item.id)" class="btn-action btn-delete" title="Eliminar">
                    <span>🗑️</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="table-footer">
        <span class="table-count">
          <strong>{{ curriculumData.length }}</strong> elemento(s) en la malla
        </span>
      </div>
    </div>

    <!-- Empty state mejorado -->
    <div v-else-if="selectedGrade && selectedSubject" class="empty-state">
      <div class="empty-icon">📋</div>
      <h3 class="empty-title">No hay elementos en esta malla</h3>
      <p class="empty-description">
        Comienza agregando elementos para {{ getGradeName(selectedGrade) }} - {{ getSubjectName(selectedSubject) }}
      </p>
      <button @click="openCreateModal" class="btn-add-empty">
        ➕ Agregar Primer Elemento
      </button>
    </div>

    <!-- Placeholder cuando no hay filtros -->
    <div v-else class="placeholder-state">
      <div class="placeholder-icon">🔍</div>
      <h3 class="placeholder-title">Selecciona Grado y Asignatura</h3>
      <p class="placeholder-description">
        Para comenzar, selecciona un grado y una asignatura en los filtros de arriba
      </p>
    </div>

    <!-- Modal mejorado -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">
            <span class="modal-icon">{{ isEditing ? '✏️' : '➕' }}</span>
            {{ isEditing ? 'Editar Elemento' : 'Nuevo Elemento' }}
          </h2>
          <button @click="closeModal" class="btn-modal-close">✕</button>
        </div>

        <div class="modal-body">
          <div class="modal-info">
            <span class="info-label">Para:</span>
            <span class="info-value">{{ getGradeName(formData.grade_id) }} - {{ getSubjectName(formData.subject_id) }}</span>
          </div>

          <form @submit.prevent="saveItem" class="modal-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">🎯</span>
                  Eje Temático <span class="required">*</span>
                </label>
                <select v-model="formData.topic_id" required class="form-select">
                  <option value="">Seleccionar</option>
                  <option v-for="topic in topics" :key="topic.id" :value="topic.id">
                    {{ topic.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">🧩</span>
                  Componente <span class="required">*</span>
                </label>
                <select v-model="formData.component_id" required class="form-select">
                  <option value="">Seleccionar</option>
                  <option v-for="component in components" :key="component.id" :value="component.id">
                    {{ component.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">📋</span>
                  Estándar <span class="required">*</span>
                </label>
                <select v-model="formData.standard_id" required class="form-select">
                  <option value="">Seleccionar</option>
                  <option v-for="standard in standards" :key="standard.id" :value="standard.id">
                    {{ standard.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">💪</span>
                  Competencia <span class="required">*</span>
                </label>
                <select v-model="formData.competency_id" required class="form-select">
                  <option value="">Seleccionar</option>
                  <option v-for="competency in competencies" :key="competency.id" :value="competency.id">
                    {{ competency.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">✅</span>
                  Afirmación DBA <span class="required">*</span>
                </label>
                <select v-model="formData.claim_id" required class="form-select">
                  <option value="">Seleccionar</option>
                  <option v-for="claim in claims" :key="claim.id" :value="claim.id">
                    {{ claim.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">🔍</span>
                  Evidencia DBA <span class="required">*</span>
                </label>
                <select v-model="formData.evidence_id" required class="form-select">
                  <option value="">Seleccionar</option>
                  <option v-for="evidence in evidences" :key="evidence.id" :value="evidence.id">
                    {{ evidence.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group-full">
                <label class="form-label">Estado</label>
                <div class="toggle-wrapper">
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="formData.is_active">
                    <span class="toggle-slider"></span>
                  </label>
                  <span class="toggle-text">{{ formData.is_active ? 'Activo' : 'Inactivo' }}</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" type="button" class="btn-modal-cancel">
            Cancelar
          </button>
          <button @click="saveItem" class="btn-modal-save">
            <span class="btn-icon">💾</span>
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Notificación -->
    <transition name="notification">
      <div v-if="notification.show" :class="['notification', `notification-${notification.type}`]">
        <span class="notification-icon">{{ notification.type === 'success' ? '✓' : '✗' }}</span>
        <span class="notification-text">{{ notification.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import api from '@/api/api';

export default {
  name: 'MallaCurricular',
  data() {
    return {
      curriculumData: [],
      selectedGrade: '',
      selectedSubject: '',
      grades: [],
      subjects: [],
      topics: [],
      components: [],
      standards: [],
      competencies: [],
      claims: [],
      evidences: [],
      showModal: false,
      isEditing: false,
      formData: {
        grade_id: '',
        subject_id: '',
        topic_id: '',
        component_id: '',
        standard_id: '',
        competency_id: '',
        claim_id: '',
        evidence_id: '',
        is_active: true
      },
      notification: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },
  
  mounted() {
    this.loadAllData();
  },
  
  methods: {
    async loadAllData() {
      try {
        await Promise.all([
          this.loadGrades(),
          this.loadSubjects(),
          this.loadTopics(),
          this.loadComponents(),
          this.loadStandards(),
          this.loadCompetencies(),
          this.loadClaims(),
          this.loadEvidences()
        ]);
      } catch (error) {
        this.showNotification('Error al cargar los datos', 'error');
      }
    },
    
    async loadGrades() {
      const response = await api.get('/grades');
      this.grades = response.data;
    },
    
    async loadSubjects() {
      const response = await api.get('/subjects');
      this.subjects = response.data;
    },
    
    async loadTopics() {
      const response = await api.get('/thematic-topics');
      this.topics = response.data;
    },
    
    async loadComponents() {
      const response = await api.get('/components');
      this.components = response.data;
    },
    
    async loadStandards() {
      const response = await api.get('/standards');
      this.standards = response.data;
    },
    
    async loadCompetencies() {
      const response = await api.get('/competencies');
      this.competencies = response.data;
    },
    
    async loadClaims() {
      const response = await api.get('/claims');
      this.claims = response.data;
    },
    
    async loadEvidences() {
      const response = await api.get('/evidences');
      this.evidences = response.data;
    },
    
    async loadCurriculumData() {
      if (!this.selectedGrade || !this.selectedSubject) {
        this.curriculumData = [];
        return;
      }
      
      try {
        const url = `/curriculum-grid?grade_id=${this.selectedGrade}&subject_id=${this.selectedSubject}`;
        const response = await api.get(url);
        this.curriculumData = response.data;
      } catch (error) {
        this.showNotification('Error al cargar la malla curricular', 'error');
      }
    },
    
    openCreateModal() {
      if (!this.selectedGrade || !this.selectedSubject) {
        this.showNotification('Selecciona grado y asignatura primero', 'error');
        return;
      }
      
      this.isEditing = false;
      this.formData = {
        grade_id: this.selectedGrade,
        subject_id: this.selectedSubject,
        topic_id: '',
        component_id: '',
        standard_id: '',
        competency_id: '',
        claim_id: '',
        evidence_id: '',
        is_active: true
      };
      this.showModal = true;
    },
    
    editItem(item) {
      this.isEditing = true;
      this.formData = { ...item };
      this.showModal = true;
    },
    
    async saveItem() {
      try {
        if (this.isEditing) {
          await api.put(`/curriculum-grid/${this.formData.id}`, this.formData);
          this.showNotification('Elemento actualizado correctamente', 'success');
        } else {
          await api.post('/curriculum-grid', this.formData);
          this.showNotification('Elemento creado correctamente', 'success');
        }
        
        this.closeModal();
        this.loadCurriculumData();
      } catch (error) {
        this.showNotification('Error al guardar el elemento', 'error');
      }
    },
    
    async deleteItem(id) {
      if (!confirm('¿Estás seguro de eliminar este elemento?')) return;
      
      try {
        await api.delete(`/curriculum-grid/${id}`);
        this.showNotification('Elemento eliminado correctamente', 'success');
        this.loadCurriculumData();
      } catch (error) {
        this.showNotification('Error al eliminar el elemento', 'error');
      }
    },
    
    closeModal() {
      this.showModal = false;
      this.formData = {
        grade_id: '',
        subject_id: '',
        topic_id: '',
        component_id: '',
        standard_id: '',
        competency_id: '',
        claim_id: '',
        evidence_id: '',
        is_active: true
      };
    },
    
    showNotification(message, type = 'success') {
      this.notification = { show: true, message, type };
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },
    
    getGradeName(id) {
      const grade = this.grades.find(g => g.id === id);
      return grade ? grade.name : '';
    },
    
    getSubjectName(id) {
      const subject = this.subjects.find(s => s.id === id);
      return subject ? subject.name : '';
    },
    
    getTopicName(id) {
      const topic = this.topics.find(t => t.id === id);
      return topic ? topic.name : 'N/A';
    },
    
    getComponentName(id) {
      const component = this.components.find(c => c.id === id);
      return component ? component.name : 'N/A';
    },
    
    getStandardName(id) {
      const standard = this.standards.find(s => s.id === id);
      return standard ? standard.name : 'N/A';
    },
    
    getCompetencyName(id) {
      const competency = this.competencies.find(c => c.id === id);
      return competency ? competency.name : 'N/A';
    },
    
    getClaimName(id) {
      const claim = this.claims.find(c => c.id === id);
      return claim ? claim.name : 'N/A';
    },
    
    getEvidenceName(id) {
      const evidence = this.evidences.find(e => e.id === id);
      return evidence ? evidence.name : 'N/A';
    }
  }
};
</script>

<style scoped>
/* Variables */
:root {
  --primary: #2563eb;
  --primary-dark: #1e40af;
  --primary-light: #3b82f6;
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --border-radius: 10px;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Container */
.malla-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--gray-50);
  min-height: 100vh;
}

/* Header */
.header-section {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.title-icon {
  font-size: 2.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--gray-600);
  margin: 0;
  margin-left: 3.5rem;
}

/* Filters */
.filter-section {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
  border-left: 4px solid var(--primary);
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.filter-icon {
  font-size: 1.5rem;
}

.filter-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.95rem;
}

.required {
  color: var(--danger);
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--gray-300);
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: var(--gray-900);
  transition: all 0.2s;
  cursor: pointer;
}

.filter-select:hover {
  border-color: var(--primary-light);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.filter-info {
  padding-top: 1rem;
  border-top: 1px solid var(--gray-200);
}

.info-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.95rem;
}

.badge-label {
  font-weight: 600;
}

.badge-value {
  font-weight: 500;
}

/* Action Section */
.action-section {
  text-align: center;
  margin-bottom: 1.5rem;
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: var(--shadow-md);
}

.btn-add:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-add:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-icon {
  font-size: 1.2rem;
}

.action-hint {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--gray-500);
  font-style: italic;
}

/* Table */
.table-container {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.curriculum-table {
  width: 100%;
  border-collapse: collapse;
}

.curriculum-table thead {
  background: linear-gradient(135deg, var(--gray-800) 0%, var(--gray-700) 100%);
  color: white;
}

.curriculum-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.th-id {
  width: 60px;
  text-align: center;
}

.th-actions {
  width: 120px;
  text-align: center;
}

.curriculum-table tbody tr {
  transition: all 0.2s;
}

.row-even {
  background: white;
}

.row-odd {
  background: var(--gray-50);
}

.curriculum-table tbody tr:hover {
  background: #e0f2fe;
  transform: scale(1.01);
  box-shadow: var(--shadow-md);
}

.curriculum-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--gray-200);
}

.td-id {
  text-align: center;
}

.id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.85rem;
}

.cell-content {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.cell-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.cell-text {
  color: var(--gray-800);
  line-height: 1.5;
}

.td-actions {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-action {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-edit {
  background: #dbeafe;
  color: var(--primary);
}

.btn-edit:hover {
  background: var(--primary);
  color: white;
  transform: scale(1.1);
}

.btn-delete {
  background: #fee2e2;
  color: var(--danger);
}

.btn-delete:hover {
  background: var(--danger);
  color: white;
  transform: scale(1.1);
}

.table-footer {
  padding: 1rem 1.5rem;
  background: var(--gray-50);
  border-top: 2px solid var(--gray-200);
  text-align: right;
}

.table-count {
  color: var(--gray-600);
  font-size: 0.95rem;
}

.table-count strong {
  color: var(--primary);
  font-size: 1.1rem;
}

/* Empty States */
.empty-state,
.placeholder-state {
  background: white;
  border-radius: var(--border-radius);
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: var(--shadow);
}

.empty-icon,
.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-title,
.placeholder-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 0.5rem;
}

.empty-description,
.placeholder-description {
  color: var(--gray-600);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.btn-add-empty {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-empty:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid var(--gray-200);
  background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
}

.modal-icon {
  font-size: 1.75rem;
}

.btn-modal-close {
  width: 40px;
  height: 40px;
  border: none;
  background: var(--gray-200);
  color: var(--gray-600);
  border-radius: 8px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-modal-close:hover {
  background: var(--gray-300);
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
}

.modal-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #dbeafe;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.info-label {
  font-weight: 600;
  color: var(--primary-dark);
}

.info-value {
  font-weight: 500;
  color: var(--primary);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group,
.form-group-full {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group-full {
  grid-column: 1 / -1;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.95rem;
}

.label-icon {
  font-size: 1.1rem;
}

.form-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--gray-300);
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: var(--gray-900);
  transition: all 0.2s;
  cursor: pointer;
}

.form-select:hover {
  border-color: var(--primary-light);
}

.form-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 32px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray-300);
  transition: 0.4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--success);
}

input:checked + .toggle-slider:before {
  transform: translateX(28px);
}

.toggle-text {
  font-weight: 600;
  color: var(--gray-700);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 2px solid var(--gray-200);
  background: var(--gray-50);
}

.btn-modal-cancel {
  padding: 0.75rem 1.5rem;
  background: white;
  color: var(--gray-700);
  border: 2px solid var(--gray-300);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-modal-cancel:hover {
  background: var(--gray-100);
  border-color: var(--gray-400);
}

.btn-modal-save {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-modal-save:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Notification */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  z-index: 2000;
  min-width: 300px;
}

.notification-success {
  border-left: 4px solid var(--success);
}

.notification-error {
  border-left: 4px solid var(--danger);
}

.notification-icon {
  font-size: 1.5rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.notification-success .notification-icon {
  background: #d1fae5;
  color: var(--success);
}

.notification-error .notification-icon {
  background: #fee2e2;
  color: var(--danger);
}

.notification-text {
  font-weight: 500;
  color: var(--gray-800);
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .malla-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .title-icon {
    font-size: 2rem;
  }
  
  .filter-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .table-wrapper {
    overflow-x: scroll;
  }
  
  .curriculum-table {
    min-width: 1000px;
  }
  
  .modal-container {
    width: 95%;
  }
}
</style>