// src/api/schoolService.js
import api from './client'

export const schoolService = {
  // Listar todos los colegios
  getAll: async (page = 1, perPage = 20) => {
    const { data } = await api.get(`/schools?page=${page}&per_page=${perPage}`)
    return data
  },

  // Obtener un colegio por ID
  getById: async (id) => {
    const { data } = await api.get(`/schools/${id}`)
    return data
  },

  // Crear colegio
  create: async (schoolData) => {
    const { data } = await api.post('/schools', schoolData)
    return data
  },

  // Actualizar colegio
  update: async (id, schoolData) => {
    const { data } = await api.put(`/schools/${id}`, schoolData)
    return data
  },

  // Eliminar colegio
  delete: async (id) => {
    await api.delete(`/schools/${id}`)
    return { success: true }
  }
}