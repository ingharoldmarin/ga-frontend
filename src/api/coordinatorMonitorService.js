import api from './api'

export const coordinatorMonitorService = {
  getTeacherMalla(userId) {
    return api.get(`/coordinator/monitor/teacher/${userId}/malla`).then(r => r.data)
  },
  getTeacherSchedule(userId, params = {}) {
    return api.get(`/coordinator/monitor/teacher/${userId}/schedule`, { params }).then(r => r.data)
  },
  getSchoolObservations(params = {}) {
    return api.get('/coordinator/monitor/observations', { params }).then(r => r.data)
  },
  getStatistics(params = {}) {
    return api.get('/coordinator/monitor/statistics', { params }).then(r => r.data)
  },
}
