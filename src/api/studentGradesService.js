// studentGradesService.js
import api from './api'

export const studentGradesService = {
  /**
   * Obtener mis calificaciones como estudiante
   */
  async getMyGrades(params = {}) {
    const response = await api.get('/student/grades', { params })
    return response.data
  },

  /**
   * Obtener mis estadísticas
   */
  async getMyStats(params = {}) {
    const response = await api.get('/student/stats', { params })
    return response.data
  },

  /**
   * Obtener boletín de calificaciones
   */
  async getReportCard(period, schoolYear) {
    const response = await api.get('/student/report-card', {
      params: { period, school_year: schoolYear }
    })
    return response.data
  }
}
