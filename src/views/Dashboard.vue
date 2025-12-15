<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserManagement from './UserManagement.vue'
import SchoolManagement from './SchoolManagement.vue'
import CurriculumManagement from './CurriculumManagement.vue'

const router = useRouter()
const authStore = useAuthStore()
const activeTab = ref('home')

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const setActiveTab = (tab) => {
  activeTab.value = tab
}

// ⭐ NUEVA FUNCIÓN: Navegar a Malla Curricular
const goToMallaCurricular = () => {
  router.push('/malla-curricular')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Sistema de Gestión Académica</h1>
        <div class="flex items-center gap-4">
          <div class="text-sm text-gray-600">
            <p class="font-medium">{{ authStore.user?.first_name }} {{ authStore.user?.last_name }}</p>
            <p class="text-xs">{{ authStore.user?.email }}</p>
          </div>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex space-x-4">
          <button
            @click="setActiveTab('home')"
            :class="[
              'px-4 py-3 font-medium text-sm transition-colors',
              activeTab === 'home' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            🏠 Inicio
          </button>
          <button
            v-if="authStore.isAdmin"
            @click="setActiveTab('schools')"
            :class="[
              'px-4 py-3 font-medium text-sm transition-colors',
              activeTab === 'schools' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            🏫 Colegios
          </button>
          <button
            v-if="authStore.isAdmin || authStore.isCoordinator"
            @click="setActiveTab('users')"
            :class="[
              'px-4 py-3 font-medium text-sm transition-colors',
              activeTab === 'users' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            👥 Gestión de Usuarios
          </button>
          <!-- Estructura Curricular (Solo Admin) -->
          <button
            v-if="authStore.isAdmin"
            @click="setActiveTab('curriculum')"
            :class="[
              'px-4 py-3 font-medium text-sm transition-colors',
              activeTab === 'curriculum' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            📚 Estructura Curricular
          </button>
          <!-- ⭐ NUEVO: Malla Curricular (Solo Admin) -->
          <button
            v-if="authStore.isAdmin"
            @click="goToMallaCurricular"
            class="px-4 py-3 font-medium text-sm transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          >
            📊 Malla Curricular
          </button>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Home Tab -->
      <div v-if="activeTab === 'home'" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Bienvenido al Sistema de Gestión Académica</h2>
        
        <div class="space-y-2">
          <p><strong>Usuario:</strong> {{ authStore.user?.username }}</p>
          <p><strong>Email:</strong> {{ authStore.user?.email }}</p>
          <p><strong>Roles:</strong> 
            <span v-for="role in authStore.user?.roles" :key="role.id" class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {{ role.name }}
            </span>
          </p>
        </div>

        <!-- Permisos del usuario -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-semibold mb-2">Permisos:</h3>
          <ul class="list-disc list-inside text-sm text-gray-700">
            <li v-if="authStore.isAdmin">✅ Acceso total a la API (Admin)</li>
            <li v-if="authStore.isCoordinator">✅ Ver información, registrar usuarios (Estudiantes y Profesores), crear cronograma (Coordinador)</li>
            <li v-if="authStore.isTeacher">✅ Crear cronograma y ver información (Profesor)</li>
            <li v-if="authStore.isStudent">✅ Solo ver información (Estudiante)</li>
          </ul>
        </div>

        <!-- ⭐ NUEVO: Acceso rápido a Malla Curricular -->
        <div v-if="authStore.isAdmin" class="mt-6">
          <h3 class="font-semibold mb-3">Acceso Rápido:</h3>
          <div class="grid grid-cols-2 gap-4">
            <button
              @click="setActiveTab('curriculum')"
              class="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
            >
              <div class="text-3xl mb-2">📚</div>
              <div class="font-semibold">Estructura Curricular</div>
              <div class="text-sm text-gray-600">Gestiona elementos individuales</div>
            </button>
            
            <button
              @click="goToMallaCurricular"
              class="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-left"
            >
              <div class="text-3xl mb-2">📊</div>
              <div class="font-semibold">Malla Curricular</div>
              <div class="text-sm text-gray-600">Relaciona Grado + Asignatura</div>
            </button>
          </div>
        </div>
      </div>

      <!-- Schools Tab (Solo Admin) -->
      <div v-if="activeTab === 'schools' && authStore.isAdmin" class="bg-white rounded-lg shadow">
        <SchoolManagement />
      </div>

      <!-- User Management Tab (Admin y Coordinador) -->
      <div v-if="activeTab === 'users' && (authStore.isAdmin || authStore.isCoordinator)" class="bg-white rounded-lg shadow">
        <UserManagement />
      </div>

      <!-- Curriculum Management Tab (Solo Admin) -->
      <div v-if="activeTab === 'curriculum' && authStore.isAdmin">
        <CurriculumManagement />
      </div>
    </main>
  </div>
</template>