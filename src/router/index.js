// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/views/Login.vue'
import MallaCurricular from '@/views/MallaCurricular.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/malla-curricular',
    name: 'MallaCurricular',
    component: MallaCurricular,
    meta: { requiresAuth: true }
  },
  
  // ═══════════════════════════════════════════════════════════════════
  // ⭐ RUTAS DEL COORDINADOR (SOLO ESENCIALES)
  // ═══════════════════════════════════════════════════════════════════
  {
    path: '/coordinator',
    name: 'CoordinatorDashboard',
    component: () => import('@/views/CoordinatorDashboard.vue'),
    meta: { 
      requiresAuth: true,
      requiresRole: 'coordinador'
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════
  // ⭐ RUTAS DEL PROFESOR (SOLO ESENCIALES)
  // ═══════════════════════════════════════════════════════════════════
  {
    path: '/teacher',
    name: 'TeacherDashboard',
    component: () => import('@/views/TeacherDashboard.vue'),
    meta: { 
      requiresAuth: true,
      requiresRole: 'profesor'
    }
  },
  {
    path: '/teacher/schedule/:gradeId/:subjectId/:gridId',
    name: 'ScheduleManagement',
    component: () => import('@/views/ScheduleManagement.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: 'profesor'
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // ⭐ RUTAS DEL ESTUDIANTE
  // ═══════════════════════════════════════════════════════════════════
  {
    path: '/student',
    name: 'StudentPortal',
    component: () => import('@/views/StudentView.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: 'estudiante'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación mejorado
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Verificar autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // Redirigir desde /dashboard solo para roles con portal propio
  if (to.path === '/dashboard' && authStore.isAuthenticated) {
    if (authStore.isStudent)     { next('/student');      return }
    if (authStore.isTeacher)     { next('/teacher');      return }
    if (authStore.isCoordinator) { next('/coordinator');  return }
    // Admins permanecen en /dashboard
  }
  
  // Redirigir usuarios autenticados fuera de login
  if (to.meta.guest && authStore.isAuthenticated) {
    if (authStore.isStudent)          next('/student')
    else if (authStore.isTeacher)     next('/teacher')
    else if (authStore.isCoordinator) next('/coordinator')
    else                              next('/dashboard')
    return
  }

  // Verificar roles específicos
  if (to.meta.requiresRole) {
    const requiredRole = to.meta.requiresRole
    
    let hasRole = false
    switch (requiredRole) {
      case 'admin':
        hasRole = authStore.isAdmin
        break
      case 'coordinador':
        hasRole = authStore.isCoordinator || authStore.isAdmin
        break
      case 'profesor':
        hasRole = authStore.isTeacher || authStore.isAdmin
        break
      case 'estudiante':
        hasRole = authStore.isStudent
        break
    }

    if (!hasRole) {
      // Redirigir al dashboard apropiado según el rol
      if (authStore.isAdmin) {
        next('/dashboard')
      } else if (authStore.isCoordinator) {
        next('/coordinator')
      } else if (authStore.isTeacher) {
        next('/teacher')
      } else if (authStore.isStudent) {
        next('/student')
      } else {
        next('/dashboard')
      }
      return
    }
  }
  
  next()
})

export default router