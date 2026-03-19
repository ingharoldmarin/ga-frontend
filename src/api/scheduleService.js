// src/api/scheduleService.js
import api from './client'

export const scheduleService = {
  /**
   * Obtener todos los cronogramas con filtros opcionales
   * @param {Object} filters - Filtros de búsqueda
   * @param {number} page - Número de página
   * @param {number} perPage - Elementos por página
   */
  getAll: async (filters = {}, page = 1, perPage = 50) => {
    const params = {
      page,
      per_page: perPage,
      ...filters
    }
    const { data } = await api.get('/schedule', { params })
    return data
  },

  /**
   * Obtener un cronograma por ID
   * @param {number} id - ID del cronograma
   */
  getById: async (id) => {
    const { data } = await api.get(`/schedule/${id}`)
    return data
  },

  /**
   * Crear un cronograma individual
   * @param {Object} scheduleData - Datos del cronograma
   */
  create: async (scheduleData) => {
    const { data } = await api.post('/schedule', scheduleData)
    return data
  },

  /**
   * Crear múltiples cronogramas en batch (para múltiples semanas)
   * @param {Object} scheduleData - Datos base del cronograma
   * @param {number[]} weekIds - Array de IDs de semanas
   */
  createBatch: async (scheduleData, weekIds) => {
    const payload = {
      ...scheduleData,
      week_ids: weekIds
    }
    const { data } = await api.post('/schedule/batch', payload)
    return data
  },

  /**
   * Actualizar un cronograma
   * @param {number} id - ID del cronograma
   * @param {Object} scheduleData - Datos actualizados
   */
  update: async (id, scheduleData) => {
    const { data } = await api.put(`/schedule/${id}`, scheduleData)
    return data
  },

  /**
   * Marcar un cronograma como ejecutado
   * @param {number} id - ID del cronograma
   * @param {boolean} executed - Estado de ejecución
   * @param {string} observation - Observación opcional
   */
  markAsExecuted: async (id, executed = true, observation = null) => {
    const { data } = await api.put(`/schedule/${id}`, {
      executed,
      observation
    })
    return data
  },

  /**
   * Eliminar un cronograma
   * @param {number} id - ID del cronograma
   */
  delete: async (id) => {
    await api.delete(`/schedule/${id}`)
    return { success: true }
  },

  /**
   * Obtener cronogramas por malla curricular
   * Requiere que el schedule tenga grade_id y subject_id de la malla
   * @param {number} gradeId - ID del grado
   * @param {number} subjectId - ID de la materia
   */
  getByGrid: async (gradeId, subjectId, page = 1, perPage = 100) => {
    const { data } = await api.get('/schedule', {
      params: {
        grade_id: gradeId,
        subject_id: subjectId,
        page,
        per_page: perPage
      }
    })
    return data
  }
}

/**
 * Servicio para gestión de semanas
 */
export const weekService = {
  getAll: async (page = 1, perPage = 100) => {
    const { data } = await api.get('/weeks', {
      params: { page, per_page: perPage }
    })
    return data
  },

  create: async (weekData) => {
    const { data } = await api.post('/weeks', weekData)
    return data
  },

  update: async (id, weekData) => {
    const { data } = await api.put(`/weeks/${id}`, weekData)
    return data
  },

  delete: async (id) => {
    await api.delete(`/weeks/${id}`)
    return { success: true }
  }
}
