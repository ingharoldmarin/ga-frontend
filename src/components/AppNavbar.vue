<template>
  <header class="topbar-gradient sticky top-0 z-30 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

      <!-- Logo -->
      <div class="flex items-center gap-2.5 flex-shrink-0">
        <div class="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <span class="font-bold text-white tracking-tight hidden lg:block text-sm">GestiónAcadémica</span>
      </div>

      <!-- Nav -->
      <nav class="flex items-center gap-0.5 flex-1 justify-center min-w-0">

        <!-- Inicio — cada rol va a su propia página -->
        <button @click="goHome()" :class="cls('home')" title="Inicio">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="hidden md:inline">Inicio</span>
        </button>

        <!-- ── ADMIN ── -->
        <button v-if="auth.isAdmin" @click="dashTab('schools')" :class="cls('schools')" title="Colegios">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <span class="hidden md:inline">Colegios</span>
        </button>

        <button v-if="auth.isAdmin" @click="dashTab('users')" :class="cls('users')" title="Usuarios">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="hidden md:inline">Usuarios</span>
        </button>

        <button v-if="auth.isAdmin" @click="dashTab('curriculum')" :class="cls('curriculum')" title="Curricular">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <span class="hidden md:inline">Curricular</span>
        </button>

        <button v-if="auth.isAdmin" @click="dashTab('grades-subjects')" :class="cls('grades-subjects')" title="Grados y Materias">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          <span class="hidden md:inline">Grados y Materias</span>
        </button>

        <button v-if="auth.isAdmin" @click="router.push('/malla-curricular')" :class="cls('mallas')" title="Mallas Curriculares">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
          <span class="hidden md:inline">Mallas</span>
        </button>

        <button v-if="auth.isAdmin" @click="dashTab('enrollment')" :class="cls('enrollment')" title="Matrícula">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="hidden md:inline">Matrícula</span>
        </button>

        <!-- ── COORDINADOR ── -->
        <button v-if="auth.isCoordinator" @click="dashTab('teachers')" :class="cls('teachers')" title="Docentes">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="hidden md:inline">Docentes</span>
        </button>

        <button v-if="auth.isCoordinator" @click="dashTab('users')" :class="cls('users')" title="Usuarios">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="hidden md:inline">Usuarios</span>
        </button>

        <button v-if="auth.isCoordinator" @click="dashTab('grids')" :class="cls('grids')" title="Asignar Mallas">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
          <span class="hidden md:inline">Asignar Mallas</span>
        </button>

        <!-- ── PROFESOR ── -->
        <button v-if="auth.isTeacher" @click="router.push('/teacher')" :class="cls('teacher')" title="Mis Mallas">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <span class="hidden md:inline">Mis Mallas</span>
        </button>

      </nav>

      <!-- Usuario + logout -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <div class="text-right hidden lg:block">
          <p class="text-sm font-medium text-white leading-none">{{ auth.user?.first_name }} {{ auth.user?.last_name }}</p>
          <p class="text-xs text-white/60 mt-0.5 capitalize">{{ auth.user?.roles?.[0]?.name }}</p>
        </div>
        <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ring-2 ring-white/30">
          {{ initials }}
        </div>
        <button @click="logout" title="Cerrar sesión"
          class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span class="hidden lg:inline">Salir</span>
        </button>
      </div>

    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const emit   = defineEmits(['tab'])
const router = useRouter()
const route  = useRoute()
const auth   = useAuthStore()

const initials = computed(() =>
  (auth.user?.first_name?.[0] || '') + (auth.user?.last_name?.[0] || '')
)

// Ruta "home" según el rol
function goHome() {
  const home = auth.isCoordinator ? '/coordinator' : auth.isTeacher ? '/teacher' : '/dashboard'
  if (route.path !== home) router.push(home)
}

// Tabs del Dashboard (solo admin) o del Coordinator
function dashTab(tab) {
  if (route.path === '/dashboard') {
    emit('tab', tab)
  } else if (route.path === '/coordinator') {
    emit('tab', tab)          // CoordinatorDashboard también escucha @tab
  } else {
    router.push({ path: '/dashboard', query: { tab } })
  }
}

// Qué ítem está activo según la ruta actual
const activeKey = computed(() => {
  const p = route.path
  if (p === '/malla-curricular') return 'mallas'
  if (p === '/coordinator')      return route.query.tab || 'home'
  if (p === '/teacher')          return 'home'
  if (p === '/dashboard')        return route.query.tab || 'home'
  return 'home'
})

const cls = (key) => [
  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
  activeKey.value === key
    ? 'bg-white/20 text-white shadow-sm'
    : 'text-white/70 hover:text-white hover:bg-white/10',
]

async function logout() {
  await auth.logout()
  router.push('/login')
}
</script>
