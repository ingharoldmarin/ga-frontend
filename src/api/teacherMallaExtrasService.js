import api from './api'

export const teacherMallaExtrasService = {
  getExtras(params = {}) {
    return api.get('/teacher/malla-extras', { params }).then(r => r.data)
  },

  addItems(payload) {
    // payload: { grade_id, subject_id, period, category, item_ids: [] }
    return api.post('/teacher/malla-extras', payload).then(r => r.data)
  },

  removeItem(id) {
    return api.delete(`/teacher/malla-extras/${id}`)
  },

  getCatalog(category) {
    return api.get('/teacher/malla-catalog', { params: { category } }).then(r => r.data)
  },
}
