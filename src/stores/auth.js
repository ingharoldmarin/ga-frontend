// src/stores/auth.js
import { defineStore } from 'pinia'
import { authService } from '@/api/client'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => {
      const result = state.user?.roles?.some(role => role.name === 'admin')
      return result
    },
    isCoordinator: (state) => {
      const result = state.user?.roles?.some(role => role.name === 'coordinador')
      return result
    },
    isTeacher: (state) => state.user?.roles?.some(role => role.name === 'profesor'),
    isStudent: (state) => state.user?.roles?.some(role => role.name === 'estudiante'),
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authService.login(email, password)
        
        this.token = response.token
        this.user = response.user
        
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al iniciar sesión'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await authService.logout()
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      } finally {
        this.user = null
        this.token = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },

    async getUser() {
      try {
        const response = await authService.getMe()
        this.user = response.user
        localStorage.setItem('user', JSON.stringify(response.user))
        return response
      } catch (error) {
        this.logout()
        throw error
      }
    },

    // ⭐ NUEVO MÉTODO: Actualizar usuario con datos completos
    updateUser(userData) {
      console.log('📝 Actualizando usuario en authStore:', userData)
      this.user = { ...this.user, ...userData }
      localStorage.setItem('user', JSON.stringify(this.user))
      console.log('✅ Usuario actualizado en authStore y localStorage')
    },

    // ⭐ NUEVO MÉTODO: Actualizar solo los colegios del usuario
    updateUserSchools(schools) {
      console.log('🏫 Actualizando colegios del usuario:', schools)
      if (this.user) {
        this.user.schools = schools
        localStorage.setItem('user', JSON.stringify(this.user))
        console.log('✅ Colegios actualizados en authStore')
      }
    }
  }
})