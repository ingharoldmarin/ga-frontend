import api from './api'

const KEY = 'ga_submissions'

const ls = {
  get:    ()  => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } },
  set:    (d) => localStorage.setItem(KEY, JSON.stringify(d)),
  nextId: ()  => Date.now() + Math.floor(Math.random() * 1000),
}

export const submissionService = {
  // Estudiante: enviar respuestas (quiz) o archivo (upload)
  submit: async (data) => {
    try {
      return await api.post('/submissions', data)
    } catch {
      const all = ls.get()
      const idx = all.findIndex(
        s => s.material_id === data.material_id && Number(s.student_id) === Number(data.student_id)
      )
      if (idx > -1) {
        all[idx] = { ...all[idx], ...data, updated_at: new Date().toISOString() }
        ls.set(all)
        return { data: all[idx] }
      }
      const item = { ...data, id: ls.nextId(), submitted_at: new Date().toISOString() }
      all.push(item)
      ls.set(all)
      return { data: item }
    }
  },

  // Estudiante: ver su propia entrega para una actividad
  getMine: async (materialId, studentId) => {
    try {
      return await api.get(`/submissions/my/${materialId}`)
    } catch {
      const found = ls.get().find(
        s => s.material_id === materialId && Number(s.student_id) === Number(studentId)
      )
      return { data: found || null }
    }
  },

  // Profesor: todas las entregas de una actividad
  getByMaterial: async (materialId) => {
    try {
      return await api.get('/submissions', { params: { material_id: materialId } })
    } catch {
      return { data: ls.get().filter(s => s.material_id === materialId) }
    }
  },
}
