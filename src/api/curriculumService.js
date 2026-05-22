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
// ── localStorage helpers ───────────────────────────────────────────────
const lsItem = (key) => ({
  get:    ()     => { try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] } },
  set:    (d)    => localStorage.setItem(key, JSON.stringify(d)),
  nextId: ()     => Date.now() + Math.floor(Math.random() * 1000),
})

// ── gradeService ───────────────────────────────────────────────────────
const lsGrades = lsItem('ga_grades')

// Normaliza la respuesta del API a un array plano
const normalize = (res) => {
  const d = res?.data
  if (Array.isArray(d)) return d
  if (Array.isArray(d?.data)) return d.data
  return []
}

// Solo los campos que existen en la tabla grade/subject de la BD
const gradeFields  = (d) => ({ name: d.name, description: d.description || '' })
const subjectFields = (d) => ({ name: d.name, description: d.description || '' })

export const gradeService = {
  getAll: async (page = 1) => {
    try {
      const res = await api.get('/grades', { params: { page, per_page: 100 } })
      const items = normalize(res)
      if (items.length) { lsGrades.set(items); return { data: items } }
      return { data: lsGrades.get() }
    } catch {
      return { data: lsGrades.get() }
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/grades', gradeFields(data))
      const item = res.data?.data ?? res.data
      const all = lsGrades.get(); all.push(item); lsGrades.set(all)
      return { data: item }
    } catch {
      const all = lsGrades.get()
      const item = { ...gradeFields(data), id: lsGrades.nextId(), created_at: new Date().toISOString() }
      all.push(item); lsGrades.set(all)
      return { data: item }
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.put(`/grades/${id}`, gradeFields(data))
      const updated = res.data?.data ?? res.data ?? data
      lsGrades.set(lsGrades.get().map(g => g.id === id ? { ...g, ...updated } : g))
      return { data: updated }
    } catch {
      const all = lsGrades.get()
      const idx = all.findIndex(g => g.id === id)
      if (idx > -1) { all[idx] = { ...all[idx], ...gradeFields(data) }; lsGrades.set(all) }
      return { data: all[idx] ?? data }
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/grades/${id}`)
    } finally {
      lsGrades.set(lsGrades.get().filter(g => g.id !== id))
    }
    return { data: { success: true } }
  },
}

// ── subjectService ─────────────────────────────────────────────────────
const lsSubjects = lsItem('ga_subjects')

export const subjectService = {
  getAll: async (page = 1) => {
    try {
      const res = await api.get('/subjects', { params: { page, per_page: 100 } })
      const items = normalize(res)
      if (items.length) { lsSubjects.set(items); return { data: items } }
      return { data: lsSubjects.get() }
    } catch {
      return { data: lsSubjects.get() }
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/subjects', subjectFields(data))
      const item = res.data?.data ?? res.data
      const all = lsSubjects.get(); all.push(item); lsSubjects.set(all)
      return { data: item }
    } catch {
      const all = lsSubjects.get()
      const item = { ...subjectFields(data), id: lsSubjects.nextId(), created_at: new Date().toISOString() }
      all.push(item); lsSubjects.set(all)
      return { data: item }
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.put(`/subjects/${id}`, subjectFields(data))
      const updated = res.data?.data ?? res.data ?? data
      lsSubjects.set(lsSubjects.get().map(s => s.id === id ? { ...s, ...updated } : s))
      return { data: updated }
    } catch {
      const all = lsSubjects.get()
      const idx = all.findIndex(s => s.id === id)
      if (idx > -1) { all[idx] = { ...all[idx], ...subjectFields(data) }; lsSubjects.set(all) }
      return { data: all[idx] ?? data }
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/subjects/${id}`)
    } finally {
      lsSubjects.set(lsSubjects.get().filter(s => s.id !== id))
    }
    return { data: { success: true } }
  },
}
