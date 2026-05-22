<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const showPassword = ref(false)

const features = [
  'Gestión de colegios y usuarios por roles',
  'Mallas curriculares con asignación a profesores',
  'Cronogramas académicos semanales',
  'Seguimiento de calificaciones estudiantiles',
]

const handleLogin = async () => {
  errorMessage.value = ''
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor completa todos los campos'
    return
  }
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Credenciales incorrectas'
  }
}
</script>

<template>
  <div class="min-h-screen flex">

    <!-- ── Panel izquierdo (visible solo en lg+) ── -->
    <div class="hidden lg:flex lg:w-[52%] login-panel-gradient relative overflow-hidden flex-col p-12">

      <!-- Patrón de fondo -->
      <div class="absolute inset-0 opacity-[0.06]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
      </div>

      <!-- Círculos decorativos -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-violet-500 opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-80 h-80 bg-brand-400 opacity-10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      <!-- Logo -->
      <div class="relative z-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <span class="text-white font-semibold text-lg tracking-tight">GestiónAcadémica</span>
        </div>
      </div>

      <!-- Contenido central -->
      <div class="relative z-10 flex-1 flex flex-col justify-center mt-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white/80 text-xs font-medium rounded-full w-fit mb-6">
          <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          Sistema académico v2.0
        </div>

        <h1 class="text-4xl font-bold text-white leading-tight mb-4">
          Gestiona tus<br/>
          <span class="text-violet-300">mallas curriculares</span><br/>
          con facilidad
        </h1>

        <p class="text-brand-200 text-base leading-relaxed mb-10 max-w-sm">
          Plataforma integral para la administración académica de colegios, asignación de mallas y seguimiento de cronogramas.
        </p>

        <div class="space-y-3.5">
          <div v-for="feature in features" :key="feature" class="flex items-center gap-3">
            <div class="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="text-brand-200 text-sm">{{ feature }}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="relative z-10">
        <p class="text-brand-400 text-xs">© 2025 GestiónAcadémica · Todos los derechos reservados</p>
      </div>
    </div>

    <!-- ── Panel derecho - Formulario ── -->
    <div class="w-full lg:w-[48%] flex items-center justify-center px-6 py-12 bg-slate-50">
      <div class="w-full max-w-sm">

        <!-- Logo móvil -->
        <div class="lg:hidden flex items-center gap-2 mb-10">
          <div class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <span class="font-semibold text-gray-800 tracking-tight">GestiónAcadémica</span>
        </div>

        <!-- Encabezado -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Bienvenido de vuelta</h2>
          <p class="text-gray-500 text-sm mt-1">Ingresa tus credenciales para acceder</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">

          <!-- Email -->
          <div>
            <label class="label">Correo electrónico</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <input
                v-model="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                class="input input-icon"
                :disabled="authStore.loading"
              />
            </div>
          </div>

          <!-- Contraseña -->
          <div>
            <label class="label">Contraseña</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="input input-icon pr-10"
                :disabled="authStore.loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <Transition name="slide-up">
            <div v-if="errorMessage" class="alert-error">
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          </Transition>

          <!-- Botón -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn-primary btn-lg w-full"
          >
            <svg v-if="authStore.loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ authStore.loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          </button>
        </form>
      </div>
    </div>

  </div>
</template>
