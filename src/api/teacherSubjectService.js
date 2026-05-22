import api from '@/api/api'

export const teacherSubjectService = {
  getTeachers: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.school_id) params.append('school_id', filters.school_id)
    const { data } = await api.get(`/teachers?${params}`)
    return data
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.teacher_id) params.append('teacher_id', filters.teacher_id)
    if (filters.school_id)  params.append('school_id', filters.school_id)
    if (filters.grade_id)   params.append('grade_id', filters.grade_id)
    const { data } = await api.get(`/teacher-subjects?${params}`)
    return data
  },

  assign: async (payload) => {
    const { data } = await api.post('/teacher-subjects', payload)
    return data
  },

  remove: async (id) => {
    await api.delete(`/teacher-subjects/${id}`)
  },
}
