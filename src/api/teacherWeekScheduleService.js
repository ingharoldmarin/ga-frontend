import api from './api'

export const teacherWeekScheduleService = {
  getSchedule(params = {}) {
    return api.get('/teacher/week-schedule', { params }).then(r => r.data)
  },
  batchSave(payload) {
    return api.post('/teacher/week-schedule/batch', payload).then(r => r.data)
  },
}

export const teacherScheduleObservationService = {
  getObservations(params = {}) {
    return api.get('/teacher/schedule-observations', { params }).then(r => r.data)
  },
  batchSave(payload) {
    // payload: { grade_id, subject_id, period?, items:[{node_type,node_id,week,executed,observation?,rescheduled_week?}] }
    return api.post('/teacher/schedule-observations/batch', payload).then(r => r.data)
  },
}
