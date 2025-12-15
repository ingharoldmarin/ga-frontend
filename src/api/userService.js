// src/api/userService.js
import api from './client'

export const userService = {
  // Listar todos los usuarios
  getAll: async (page = 1, perPage = 50) => {
    const { data } = await api.get(`/users?page=${page}&per_page=${perPage}`)
    return data
  },

  // Obtener un usuario por ID
  getById: async (id) => {
    const { data } = await api.get(`/users/${id}`)
    return data
  },

  // Crear usuario con roles y colegios
  create: async (userData) => {
    const { data } = await api.post('/users', {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      roles: userData.roles,
      school_ids: userData.school_ids  // ⭐ AGREGADO
    })
    return data
  },

  // ⭐ NUEVO: Crear múltiples usuarios en batch (para carga masiva eficiente)
  bulkCreate: async (usersData) => {
    const { data } = await api.post('/users/bulk', {
      users: usersData
    })
    return data
  },

  // Actualizar usuario
  update: async (id, userData) => {
    const { data } = await api.put(`/users/${id}`, userData)
    return data
  },

  // Eliminar usuario
  delete: async (id) => {
    await api.delete(`/users/${id}`)
    return { success: true }
  },

  // Asignar colegios a usuario (reemplaza los existentes)
  syncSchools: async (userId, schoolIds) => {
    const { data } = await api.post(`/users/${userId}/schools/sync`, { 
      schools: schoolIds 
    })
    return data
  },

  // Agregar un colegio adicional
  attachSchool: async (userId, schoolId) => {
    const { data } = await api.post(`/users/${userId}/schools/attach`, { 
      school_id: schoolId 
    })
    return data
  },

  // Quitar un colegio específico
  detachSchool: async (userId, schoolId) => {
    await api.delete(`/users/${userId}/schools/${schoolId}`)
    return { success: true }
  },

  // Sincronizar roles (reemplaza todos los roles del usuario)
  syncRoles: async (userId, roleIds) => {
    const { data } = await api.post(`/users/${userId}/roles/sync`, { 
      roles: roleIds 
    })
    return data
  },

  // Agregar un rol adicional
  attachRole: async (userId, roleId) => {
    const { data } = await api.post(`/users/${userId}/roles/attach`, { 
      role_id: roleId 
    })
    return data
  },

  // Quitar un rol específico
  detachRole: async (userId, roleId) => {
    await api.delete(`/users/${userId}/roles/${roleId}`)
    return { success: true }
  }
}

export const roleService = {
  // Listar todos los roles
  getAll: async () => {
    const { data } = await api.get('/roles')
    return data
  },

  // Obtener un rol por ID
  getById: async (id) => {
    const { data } = await api.get(`/roles/${id}`)
    return data
  },

  // Crear rol
  create: async (roleData) => {
    const { data } = await api.post('/roles', roleData)
    return data
  },

  // Actualizar rol
  update: async (id, roleData) => {
    const { data } = await api.put(`/roles/${id}`, roleData)
    return data
  },

  // Eliminar rol
  delete: async (id) => {
    await api.delete(`/roles/${id}`)
    return { success: true }
  }
}