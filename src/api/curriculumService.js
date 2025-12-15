// src/api/curriculumService.js
import axios from 'axios'

// Configuración de axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Servicio para gestión de elementos curriculares
 * Solo admin tiene permisos para crear, editar y eliminar
 */

// ============================================
// EJE TEMÁTICO (antes Didactic Unit)
// ============================================
export const topicService = {
  getAll: async (page = 1, perPage = 50) => {
    const { data } = await api.get('/topics', {
      params: { page, per_page: perPage }
    })
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/topics/${id}`)
    return data
  },

  create: async (topicData) => {
    const { data } = await api.post('/topics', topicData)
    return data
  },

  update: async (id, topicData) => {
    const { data } = await api.put(`/topics/${id}`, topicData)
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/topics/${id}`)
    return data
  }
}

// ============================================
// COMPONENTE
// ============================================
export const componentService = {
  getAll: async (page = 1, perPage = 50) => {
    const { data } = await api.get('/components', {
      params: { page, per_page: perPage }
    })
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/components/${id}`)
    return data
  },

  create: async (componentData) => {
    const { data } = await api.post('/components', componentData)
    return data
  },

  update: async (id, componentData) => {
    const { data } = await api.put(`/components/${id}`, componentData)
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/components/${id}`)
    return data
  }
}

// ============================================
// ESTÁNDAR
// ============================================
export const standardService = {
  getAll: async (page = 1, perPage = 50) => {
    const { data } = await api.get('/standards', {
      params: { page, per_page: perPage }
    })
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/standards/${id}`)
    return data
  },

  create: async (standardData) => {
    const { data } = await api.post('/standards', standardData)
    return data
  },

  update: async (id, standardData) => {
    const { data } = await api.put(`/standards/${id}`, standardData)
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/standards/${id}`)
    return data
  }
}

// ============================================
// TIPO DE COMPETENCIA
// ============================================
export const tipeCompetenceService = {
  getAll: async (page = 1, perPage = 50) => {
    const { data } = await api.get('/tipe-competences', {
      params: { page, per_page: perPage }
    })
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/tipe-competences/${id}`)
    return data
  },

  create: async (tipeCompetenceData) => {
    const { data } = await api.post('/tipe-competences', tipeCompetenceData)
    return data
  },

  update: async (id, tipeCompetenceData) => {
    const { data } = await api.put(`/tipe-competences/${id}`, tipeCompetenceData)
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/tipe-competences/${id}`)
    return data
  }
}

// ============================================
// COMPETENCIA
// ============================================
export const competenceService = {
  getAll: async (page = 1, perPage = 50) => {
    const { data } = await api.get('/competences', {
      params: { page, per_page: perPage }
    })
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/competences/${id}`)
    return data
  },

  create: async (competenceData) => {
    const { data } = await api.post('/competences', competenceData)
    return data
  },

  update: async (id, competenceData) => {
    const { data } = await api.put(`/competences/${id}`, competenceData)
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/competences/${id}`)
    return data
  }
}

// ============================================
// AFIRMACIÓN DNA/DBA
// ============================================
export const affirmationService = {
  getAll: async (page = 1, perPage = 50) => {
    const { data } = await api.get('/affirmations-dna-dba', {
      params: { page, per_page: perPage }
    })
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/affirmations-dna-dba/${id}`)
    return data
  },

  create: async (affirmationData) => {
    const { data } = await api.post('/affirmations-dna-dba', affirmationData)
    return data
  },

  update: async (id, affirmationData) => {
    const { data } = await api.put(`/affirmations-dna-dba/${id}`, affirmationData)
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/affirmations-dna-dba/${id}`)
    return data
  }
}

// ============================================
// EVIDENCIA DNA/DBA
// ============================================
export const evidenceService = {
  getAll: async (page = 1, perPage = 50) => {
    const { data } = await api.get('/evidences-dna-dba', {
      params: { page, per_page: perPage }
    })
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/evidences-dna-dba/${id}`)
    return data
  },

  create: async (evidenceData) => {
    const { data } = await api.post('/evidences-dna-dba', evidenceData)
    return data
  },

  update: async (id, evidenceData) => {
    const { data } = await api.put(`/evidences-dna-dba/${id}`, evidenceData)
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/evidences-dna-dba/${id}`)
    return data
  }
  
}
export const gradeService = {
  getAll: (page = 1, limit = 100) => api.get(`/grades?page=${page}&limit=${limit}`),
  create: (data) => api.post(`/grades`, data),
  update: (id, data) => api.put(`/grades/${id}`, data),
  delete: (id) => api.delete(`/grades/${id}`)
}

export const subjectService = {
  getAll: (page = 1, limit = 100) => api.get(`/subjects?page=${page}&limit=${limit}`),
  create: (data) => api.post(`/subjects`, data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`)
}
