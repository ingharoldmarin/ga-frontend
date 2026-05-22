// src/api/curriculumGridService.js
import api from '@/api/api'

// ============================================
// CURRICULUM GRID SERVICE
// ============================================
export const curriculumGridService = {
  getAll: async (page = 1, perPage = 25, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString()
    })

    if (filters.grade_id) params.append('grade_id', filters.grade_id)
    if (filters.subject_id) params.append('subject_id', filters.subject_id)
    if (filters.period) params.append('period', filters.period)
    if (filters.active !== undefined) params.append('active', filters.active)

    const { data } = await api.get(`/curriculum-grid?${params.toString()}`)
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/curriculum-grid/${id}`)
    return data
  },

  create: async (gridData) => {
    const { data } = await api.post('/curriculum-grid', gridData)
    return data
  },

  update: async (id, gridData) => {
    const { data } = await api.put(`/curriculum-grid/${id}`, gridData)
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/curriculum-grid/${id}`)
    return data
  },

  getSummary: async () => {
    const { data } = await api.get('/curriculum-grid/summary')
    return data
  },

  toggleActive: async (id, active) => {
    const { data } = await api.put(`/curriculum-grid/${id}`, { active })
    return data
  }
}

// ============================================
// GRADE SERVICE
// ============================================
export const gradeService = {
  getAll: async (page = 1, perPage = 100) => {
    const { data } = await api.get(`/grades?page=${page}&per_page=${perPage}`)
    return data
  }
}

// ============================================
// SUBJECT SERVICE
// ============================================
export const subjectService = {
  getAll: async (page = 1, perPage = 100) => {
    const { data } = await api.get(`/subjects?page=${page}&per_page=${perPage}`)
    return data
  }
}