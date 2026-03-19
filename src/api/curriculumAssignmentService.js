// src/api/curriculumAssignmentService.js
import api from './client'

export const curriculumAssignmentService = {
  /**
   * Asignar una malla a uno o varios profesores
   * @param {number} curriculumGridId - ID de la malla curricular
   * @param {number[]} teacherIds - Array de IDs de profesores
   * @param {number|null} schoolId - ID del colegio (opcional)
   */
  assignToTeachers: async (curriculumGridId, teacherIds, schoolId = null) => {
    const { data } = await api.post(`/curriculum-grid/${curriculumGridId}/assign`, {
      teacher_ids: teacherIds,
      school_id: schoolId
    })
    return data
  },

  /**
   * Desasignar una malla de un profesor
   * @param {number} curriculumGridId - ID de la malla curricular
   * @param {number} userId - ID del profesor
   */
  unassignFromTeacher: async (curriculumGridId, userId) => {
    const { data } = await api.delete(`/curriculum-grid/${curriculumGridId}/unassign/${userId}`)
    return data
  },

  /**
   * Obtener todas las mallas asignadas al profesor autenticado
   */
  getMyAssignments: async () => {
    const { data } = await api.get('/curriculum-grid/assigned')
    return data
  },

  /**
   * Obtener todas las mallas asignadas a un profesor específico (para coordinadores)
   * @param {number} userId - ID del profesor
   */
  getTeacherAssignments: async (userId) => {
    const { data } = await api.get(`/users/${userId}/curriculum-grids`)
    return data
  },

  /**
   * Obtener todos los profesores que tienen una malla asignada
   * @param {number} curriculumGridId - ID de la malla curricular
   */
  getGridAssignments: async (curriculumGridId) => {
    const { data } = await api.get(`/curriculum-grid/${curriculumGridId}/teachers`)
    return data
  },

  /**
   * Obtener profesores disponibles para asignar (opcionalmente filtrados por colegio)
   * @param {number|null} schoolId - ID del colegio (opcional)
   */
  getAvailableTeachers: async (schoolId = null) => {
    const params = schoolId ? { school_id: schoolId } : {}
    const { data } = await api.get('/teachers/available', { params })
    return data
  }
}
