<template>
  <div class="malla-container">
    <!-- Header mejorado -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <span class="title-icon">📚</span>
          <div>
            <h1 class="page-title">Malla Curricular</h1>
            <p class="page-subtitle">Relaciona grados y asignaturas con la estructura curricular (Selección Múltiple)</p>
          </div>
        </div>
        <div class="header-actions">
          <button @click="exportData" class="btn-export" :disabled="!curriculumData.length">
            <span class="btn-icon">📤</span>
            Exportar
          </button>
        </div>
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
          <select 
            v-model="selectedGrade" 
            @change="onGradeChange" 
            class="filter-select"
            :disabled="isLoading"
          >
            <option value="">Seleccionar grado</option>
            <option v-for="grade in grades" :key="grade.id" :value="grade.id">
              {{ grade.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Asignatura: <span class="required">*</span></label>
          <select 
            v-model="selectedSubject" 
            @change="loadCurriculumData" 
            class="filter-select"
            :disabled="isLoading || !selectedGrade"
          >
            <option value="">Seleccionar asignatura</option>
            <option v-for="subject in filteredSubjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Buscar:</label>
          <div class="search-input-wrapper">
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="Buscar en la malla..." 
              class="search-input"
              :disabled="!curriculumData.length"
            >
            <span class="search-icon">🔍</span>
          </div>
        </div>
      </div>

      <div class="filter-info" v-if="hasValidSelection">
        <div class="info-badge">
          <span class="badge-label">Malla para:</span>
          <span class="badge-value">{{ currentGrade.name }} - {{ currentSubject.name }}</span>
          <span class="badge-count">{{ filteredCurriculumData.length }} elementos</span>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="action-section">
      <button 
        @click="openCreateModal" 
        class="btn-add"
        :disabled="!hasValidSelection || isLoading"
      >
        <span class="btn-icon">➕</span>
        {{ isLoading ? 'Cargando...' : 'Agregar Elemento a la Malla' }}
      </button>
      
      <div class="action-buttons">
        <button 
          @click="clearFilters" 
          class="btn-secondary"
          :disabled="isLoading"
        >
          <span class="btn-icon">🔄</span>
          Limpiar
        </button>
      </div>
      
      <p class="action-hint" v-if="!hasValidSelection">
        * Selecciona grado y asignatura para agregar elementos
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner-large"></div>
      <p class="loading-text">Cargando malla curricular...</p>
    </div>

    <!-- Tabla mejorada -->
    <div v-else-if="filteredCurriculumData.length > 0" class="table-container">
      <div class="table-header">
        <div class="table-info">
          <span class="table-count">
            Mostrando <strong>{{ paginatedData.length }}</strong> de 
            <strong>{{ filteredCurriculumData.length }}</strong> elementos
          </span>
          <div class="table-actions">
            <select v-model="itemsPerPage" class="page-select">
              <option value="10">10 por página</option>
              <option value="25">25 por página</option>
              <option value="50">50 por página</option>
              <option value="100">100 por página</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="curriculum-table">
          <thead>
            <tr>
              <th class="th-id" @click="sortBy('id')">
                ID
                <span class="sort-icon" :class="getSortIcon('id')"></span>
              </th>
              <th class="th-main" @click="sortBy('topic_id')">
                Ejes Temáticos
                <span class="sort-icon" :class="getSortIcon('topic_id')"></span>
              </th>
              <th class="th-main" @click="sortBy('component_id')">
                Componentes
                <span class="sort-icon" :class="getSortIcon('component_id')"></span>
              </th>
              <th class="th-main" @click="sortBy('standard_id')">
                Estándares
                <span class="sort-icon" :class="getSortIcon('standard_id')"></span>
              </th>
              <th class="th-main" @click="sortBy('competency_id')">
                Competencias
                <span class="sort-icon" :class="getSortIcon('competency_id')"></span>
              </th>
              <th class="th-main" @click="sortBy('claim_id')">
                Afirmaciones
                <span class="sort-icon" :class="getSortIcon('claim_id')"></span>
              </th>
              <th class="th-main" @click="sortBy('evidence_id')">
                Evidencias
                <span class="sort-icon" :class="getSortIcon('evidence_id')"></span>
              </th>
              <th class="th-status">Estado</th>
              <th class="th-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in paginatedData" 
              :key="item.id" 
              :class="{
                'row-even': index % 2 === 0, 
                'row-odd': index % 2 !== 0,
                'row-inactive': !item.is_active
              }"
            >
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
              <td class="td-status">
                <span class="status-badge" :class="item.is_active ? 'status-active' : 'status-inactive'">
                  {{ item.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="td-actions">
                <div class="action-buttons">
                  <button @click="editItem(item)" class="btn-action btn-edit" title="Editar">
                    <span>✏️</span>
                  </button>
                  <button 
                    @click="toggleItemStatus(item)" 
                    :class="['btn-action', item.is_active ? 'btn-deactivate' : 'btn-activate']" 
                    :title="item.is_active ? 'Desactivar' : 'Activar'"
                  >
                    <span>{{ item.is_active ? '⏸️' : '▶️' }}</span>
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
      
      <!-- Paginación -->
      <div class="pagination-container" v-if="totalPages > 1">
        <div class="pagination">
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            ‹
          </button>
          
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="changePage(page)"
            :class="['pagination-btn', { 'pagination-active': currentPage === page }]"
          >
            {{ page }}
          </button>
          
          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            ›
          </button>
        </div>
        
        <div class="pagination-info">
          Página {{ currentPage }} de {{ totalPages }}
        </div>
      </div>
    </div>

    <!-- Empty state mejorado -->
    <div v-else-if="hasValidSelection && !isLoading" class="empty-state">
      <div class="empty-icon">📋</div>
      <h3 class="empty-title">No hay elementos en esta malla</h3>
      <p class="empty-description">
        Comienza agregando elementos para {{ currentGrade.name }} - {{ currentSubject.name }}
      </p>
      <button @click="openCreateModal" class="btn-add-empty">
        ➕ Agregar Primer Elemento
      </button>
    </div>

    <!-- Placeholder cuando no hay filtros -->
    <div v-else-if="!isLoading" class="placeholder-state">
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
            <span class="info-value">{{ currentGrade.name }} - {{ currentSubject.name }}</span>
          </div>

          <form @submit.prevent="saveItem" class="modal-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">🎯</span>
                  Eje Temático <span class="required">*</span>
                </label>
                <select 
                  v-model="formData.topic_id" 
                  required 
                  class="form-select"
                  :class="{ 'form-error': formErrors.topic_id }"
                >
                  <option value="">Seleccionar</option>
                  <option v-for="topic in topics" :key="topic.id" :value="topic.id">
                    {{ topic.name }}
                  </option>
                </select>
                <span v-if="formErrors.topic_id" class="error-message">{{ formErrors.topic_id }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">🧩</span>
                  Componente <span class="required">*</span>
                </label>
                <select 
                  v-model="formData.component_id" 
                  required 
                  class="form-select"
                  :class="{ 'form-error': formErrors.component_id }"
                >
                  <option value="">Seleccionar</option>
                  <option v-for="component in components" :key="component.id" :value="component.id">
                    {{ component.name }}
                  </option>
                </select>
                <span v-if="formErrors.component_id" class="error-message">{{ formErrors.component_id }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">📋</span>
                  Estándar <span class="required">*</span>
                </label>
                <select 
                  v-model="formData.standard_id" 
                  required 
                  class="form-select"
                  :class="{ 'form-error': formErrors.standard_id }"
                >
                  <option value="">Seleccionar</option>
                  <option v-for="standard in standards" :key="standard.id" :value="standard.id">
                    {{ standard.name }}
                  </option>
                </select>
                <span v-if="formErrors.standard_id" class="error-message">{{ formErrors.standard_id }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">💪</span>
                  Competencia <span class="required">*</span>
                </label>
                <select 
                  v-model="formData.competency_id" 
                  required 
                  class="form-select"
                  :class="{ 'form-error': formErrors.competency_id }"
                >
                  <option value="">Seleccionar</option>
                  <option v-for="competency in competencies" :key="competency.id" :value="competency.id">
                    {{ competency.name }}
                  </option>
                </select>
                <span v-if="formErrors.competency_id" class="error-message">{{ formErrors.competency_id }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">✅</span>
                  Afirmación DBA <span class="required">*</span>
                </label>
                <select 
                  v-model="formData.claim_id" 
                  required 
                  class="form-select"
                  :class="{ 'form-error': formErrors.claim_id }"
                >
                  <option value="">Seleccionar</option>
                  <option v-for="claim in claims" :key="claim.id" :value="claim.id">
                    {{ claim.name }}
                  </option>
                </select>
                <span v-if="formErrors.claim_id" class="error-message">{{ formErrors.claim_id }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">🔍</span>
                  Evidencia DBA <span class="required">*</span>
                </label>
                <select 
                  v-model="formData.evidence_id" 
                  required 
                  class="form-select"
                  :class="{ 'form-error': formErrors.evidence_id }"
                >
                  <option value="">Seleccionar</option>
                  <option v-for="evidence in evidences" :key="evidence.id" :value="evidence.id">
                    {{ evidence.name }}
                  </option>
                </select>
                <span v-if="formErrors.evidence_id" class="error-message">{{ formErrors.evidence_id }}</span>
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
          <button @click="closeModal" type="button" class="btn-modal-cancel" :disabled="isSubmitting">
            Cancelar
          </button>
          <button @click="saveItem" class="btn-modal-save" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="loading-spinner"></span>
            <span v-else class="btn-icon">💾</span>
            {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Notificación mejorada -->
    <Notification 
      :show="notification.show"
      :message="notification.message"
      :type="notification.type"
      @close="notification.show = false"
    />
  </div>
</template>

<script>
import api from '@/api/api';

// Componente de notificación reutilizable
const Notification = {
  props: ['show', 'message', 'type', 'duration'],
  emits: ['close'],
  template: `
    <transition name="notification">
      <div v-if="show" :class="['notification', \`notification-\${type}\`]">
        <span class="notification-icon">{{ type === 'success' ? '✓' : type === 'warning' ? '⚠️' : '✗' }}</span>
        <span class="notification-text">{{ message }}</span>
        <button @click="$emit('close')" class="notification-close">×</button>
      </div>
    </transition>
  `
};

export default {
  name: 'MallaCurricular',
  components: {
    Notification
  },
  data() {
    return {
      // Datos principales
      curriculumData: [],
      selectedGrade: '',
      selectedSubject: '',
      
      // Listas de opciones
      grades: [],
      subjects: [],
      topics: [],
      components: [],
      standards: [],
      competencies: [],
      claims: [],
      evidences: [],
      
      // Estado UI
      showModal: false,
      isEditing: false,
      isLoading: false,
      isSubmitting: false,
      
      // Búsqueda y paginación
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 10,
      sortField: 'id',
      sortDirection: 'asc',
      
      // Formulario
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
      formErrors: {},
      
      // Notificación
      notification: {
        show: false,
        message: '',
        type: 'success'
      },
      
      // Cache para optimización
      cache: {
        grades: new Map(),
        subjects: new Map(),
        topics: new Map(),
        components: new Map(),
        standards: new Map(),
        competencies: new Map(),
        claims: new Map(),
        evidences: new Map()
      }
    };
  },
  
  computed: {
    // Computed properties optimizados
    currentGrade() {
      return this.grades.find(g => g.id === this.selectedGrade) || {};
    },
    
    currentSubject() {
      return this.subjects.find(s => s.id === this.selectedSubject) || {};
    },
    
    hasValidSelection() {
      return this.selectedGrade && this.selectedSubject;
    },
    
    filteredSubjects() {
      if (!this.selectedGrade) return this.subjects;
      // Aquí podrías filtrar asignaturas por grado si es necesario
      return this.subjects;
    },
    
    filteredCurriculumData() {
      let filtered = this.curriculumData;
      
      // Aplicar búsqueda
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
          this.getTopicName(item.topic_id).toLowerCase().includes(term) ||
          this.getComponentName(item.component_id).toLowerCase().includes(term) ||
          this.getStandardName(item.standard_id).toLowerCase().includes(term) ||
          this.getCompetencyName(item.competency_id).toLowerCase().includes(term) ||
          this.getClaimName(item.claim_id).toLowerCase().includes(term) ||
          this.getEvidenceName(item.evidence_id).toLowerCase().includes(term)
        );
      }
      
      // Aplicar ordenamiento
      if (this.sortField) {
        filtered.sort((a, b) => {
          let aValue = a[this.sortField];
          let bValue = b[this.sortField];
          
          // Para campos relacionales, usar el nombre en lugar del ID
          if (this.sortField.includes('_id')) {
            aValue = this.getNameFromCache(this.sortField.replace('_id', ''), aValue);
            bValue = this.getNameFromCache(this.sortField.replace('_id', ''), bValue);
          }
          
          if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
          if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }
      
      return filtered;
    },
    
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + parseInt(this.itemsPerPage);
      return this.filteredCurriculumData.slice(start, end);
    },
    
    totalPages() {
      return Math.ceil(this.filteredCurriculumData.length / this.itemsPerPage);
    },
    
    visiblePages() {
      const pages = [];
      const total = this.totalPages;
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(total, start + 4);
      
      if (end - start < 4) {
        start = Math.max(1, end - 4);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  
  watch: {
    itemsPerPage() {
      this.currentPage = 1;
    },
    
    searchTerm() {
      this.currentPage = 1;
    },
    
    selectedGrade(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectedSubject = '';
      }
    }
  },
  
  async mounted() {
    await this.loadAllData();
  },
  
  methods: {
    // Carga de datos
    async loadAllData() {
      this.isLoading = true;
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
        this.showNotification('Error al cargar los datos iniciales', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    
    async loadGrades() {
      try {
        const response = await api.get('/grades');
        this.grades = response.data;
      } catch (error) {
        throw new Error('Error cargando grados');
      }
    },
    
    async loadSubjects() {
      try {
        const response = await api.get('/subjects');
        this.subjects = response.data;
      } catch (error) {
        throw new Error('Error cargando asignaturas');
      }
    },
    
    async loadTopics() {
      try {
        const response = await api.get('/thematic-topics');
        this.topics = response.data;
      } catch (error) {
        throw new Error('Error cargando ejes temáticos');
      }
    },
    
    async loadComponents() {
      try {
        const response = await api.get('/components');
        this.components = response.data;
      } catch (error) {
        throw new Error('Error cargando componentes');
      }
    },
    
    async loadStandards() {
      try {
        const response = await api.get('/standards');
        this.standards = response.data;
      } catch (error) {
        throw new Error('Error cargando estándares');
      }
    },
    
    async loadCompetencies() {
      try {
        const response = await api.get('/competencies');
        this.competencies = response.data;
      } catch (error) {
        throw new Error('Error cargando competencias');
      }
    },
    
    async loadClaims() {
      try {
        const response = await api.get('/claims');
        this.claims = response.data;
      } catch (error) {
        throw new Error('Error cargando afirmaciones');
      }
    },
    
    async loadEvidences() {
      try {
        const response = await api.get('/evidences');
        this.evidences = response.data;
      } catch (error) {
        throw new Error('Error cargando evidencias');
      }
    },
    
    async loadCurriculumData() {
      if (!this.hasValidSelection) {
        this.curriculumData = [];
        return;
      }
      
      this.isLoading = true;
      try {
        const url = `/curriculum-grid?grade_id=${this.selectedGrade}&subject_id=${this.selectedSubject}`;
        const response = await api.get(url);
        this.curriculumData = response.data;
        this.currentPage = 1; // Resetear a primera página
      } catch (error) {
        this.showNotification(
          error.response?.data?.message || 'Error al cargar la malla curricular', 
          'error'
        );
        this.curriculumData = [];
      } finally {
        this.isLoading = false;
      }
    },
    
    // Métodos del formulario
    openCreateModal() {
      if (!this.hasValidSelection) {
        this.showNotification('Selecciona grado y asignatura primero', 'error');
        return;
      }
      
      this.isEditing = false;
      this.formErrors = {};
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
      this.formErrors = {};
      this.formData = { ...item };
      this.showModal = true;
    },
    
    validateForm() {
      this.formErrors = {};
      let isValid = true;
      
      const requiredFields = [
        'topic_id', 'component_id', 'standard_id', 
        'competency_id', 'claim_id', 'evidence_id'
      ];
      
      requiredFields.forEach(field => {
        if (!this.formData[field]) {
          this.formErrors[field] = 'Este campo es requerido';
          isValid = false;
        }
      });
      
      return isValid;
    },
    
    async saveItem() {
      if (this.isSubmitting) return;
      
      if (!this.validateForm()) {
        this.showNotification('Por favor, completa todos los campos requeridos', 'error');
        return;
      }
      
      this.isSubmitting = true;
      
      try {
        if (this.isEditing) {
          await api.put(`/curriculum-grid/${this.formData.id}`, this.formData);
          this.showNotification('Elemento actualizado correctamente', 'success');
        } else {
          await api.post('/curriculum-grid', this.formData);
          this.showNotification('Elemento creado correctamente', 'success');
        }
        
        this.closeModal();
        await this.loadCurriculumData();
      } catch (error) {
        const message = error.response?.data?.message || 
          `Error al ${this.isEditing ? 'actualizar' : 'crear'} el elemento`;
        this.showNotification(message, 'error');
      } finally {
        this.isSubmitting = false;
      }
    },
    
    async toggleItemStatus(item) {
      try {
        const newStatus = !item.is_active;
        await api.patch(`/curriculum-grid/${item.id}`, { is_active: newStatus });
        
        this.showNotification(
          `Elemento ${newStatus ? 'activado' : 'desactivado'} correctamente`,
          'success'
        );
        
        await this.loadCurriculumData();
      } catch (error) {
        this.showNotification('Error al cambiar el estado del elemento', 'error');
      }
    },
    
    async deleteItem(id) {
      if (!confirm('¿Estás seguro de eliminar este elemento? Esta acción no se puede deshacer.')) {
        return;
      }
      
      try {
        await api.delete(`/curriculum-grid/${id}`);
        this.showNotification('Elemento eliminado correctamente', 'success');
        await this.loadCurriculumData();
      } catch (error) {
        this.showNotification('Error al eliminar el elemento', 'error');
      }
    },
    
    closeModal() {
      if (this.isSubmitting) return;
      
      this.showModal = false;
      this.isEditing = false;
      this.formErrors = {};
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
    
    // Métodos de UI
    onGradeChange() {
      this.selectedSubject = '';
      this.curriculumData = [];
    },
    
    clearFilters() {
      this.selectedGrade = '';
      this.selectedSubject = '';
      this.searchTerm = '';
      this.curriculumData = [];
      this.currentPage = 1;
    },
    
    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'asc';
      }
    },
    
    getSortIcon(field) {
      if (this.sortField !== field) return 'sort-none';
      return this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    
    async exportData() {
      if (!this.curriculumData.length) return;
      
      try {
        // Simular exportación
        this.showNotification('Preparando exportación...', 'success');
        // Aquí implementarías la lógica real de exportación
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.showNotification('Datos exportados correctamente', 'success');
      } catch (error) {
        this.showNotification('Error al exportar los datos', 'error');
      }
    },
    
    // Métodos de utilidad con cache
    getNameFromCache(type, id) {
      const cache = this.cache[type];
      if (cache.has(id)) {
        return cache.get(id);
      }
      
      const collection = this[type];
      const item = collection.find(item => item.id === id);
      const name = item ? item.name : 'N/A';
      
      cache.set(id, name);
      return name;
    },
    
    getTopicName(id) {
      return this.getNameFromCache('topics', id);
    },
    
    getComponentName(id) {
      return this.getNameFromCache('components', id);
    },
    
    getStandardName(id) {
      return this.getNameFromCache('standards', id);
    },
    
    getCompetencyName(id) {
      return this.getNameFromCache('competencies', id);
    },
    
    getClaimName(id) {
      return this.getNameFromCache('claims', id);
    },
    
    getEvidenceName(id) {
      return this.getNameFromCache('evidences', id);
    },
    
    // Notificaciones
    showNotification(message, type = 'success') {
      this.notification = { show: true, message, type };
    }
  }
};
</script>