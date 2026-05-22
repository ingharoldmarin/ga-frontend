import api from './api'

const STORAGE_KEY = 'ga_enrollments'

const ls = {
  get:    () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } },
  set:    (d) => localStorage.setItem(STORAGE_KEY, JSON.stringify(d)),
  nextId: () => Date.now() + Math.floor(Math.random() * 1000),
}

export const enrollmentService = {
  // Listar matrículas (filtrables por grade_id, subject_id, school_id)
  getAll: async (params) => {
    try {
      const res = await api.get('/enrollments', { params })
      return res.data?.data || res.data || []
    } catch {
      const all = ls.get()
      return all.filter(e =>
        (!params?.grade_id   || e.grade_id   === params.grade_id) &&
        (!params?.subject_id || e.subject_id === params.subject_id) &&
        (!params?.school_id  || e.school_id  === params.school_id)
      )
    }
  },

  // Crear matrícula
  create: async (data) => {
    try {
      const res = await api.post('/enrollments', data)
      return res.data?.data || res.data
    } catch {
      const all = ls.get()
      // Evitar duplicados
      const dup = all.find(e =>
        e.student_id === data.student_id &&
        e.grade_id   === data.grade_id   &&
        e.subject_id === data.subject_id
      )
      if (dup) throw new Error('El estudiante ya está matriculado en esta materia')
      const item = { ...data, id: ls.nextId(), created_at: new Date().toISOString() }
      all.push(item)
      ls.set(all)
      return item
    }
  },

  // Eliminar matrícula
  delete: async (id) => {
    try {
      await api.delete(`/enrollments/${id}`)
    } catch {
      ls.set(ls.get().filter(e => e.id !== id))
    }
  },

  // Obtener estudiantes disponibles (rol 'estudiante')
  getStudents: async (params) => {
    try {
      const res = await api.get('/users', { params: { role: 'estudiante', per_page: 200, ...params } })
      return res.data?.data || res.data || []
    } catch {
      return []
    }
  },
}
