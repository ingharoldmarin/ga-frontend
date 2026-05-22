<template>
  <div class="min-h-screen bg-slate-100">

    <!-- Topbar -->
    <header class="topbar-gradient sticky top-0 z-30 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        <!-- Logo + nombre -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <span class="font-bold text-white tracking-tight hidden sm:block">GestiónAcadémica</span>
        </div>

        <!-- Nav tabs -->
        <nav class="flex items-center gap-1 overflow-x-auto flex-1 justify-center">
          <button @click="navTo('/dashboard')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap text-white/70 hover:text-white hover:bg-white/10">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span class="hidden sm:inline">Inicio</span>
          </button>

          <button v-if="authStore.isAdmin" @click="navTo('/dashboard')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap text-white/70 hover:text-white hover:bg-white/10">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            <span class="hidden sm:inline">Colegios</span>
          </button>

          <button v-if="authStore.isAdmin || authStore.isCoordinator" @click="navTo('/dashboard')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap text-white/70 hover:text-white hover:bg-white/10">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span class="hidden sm:inline">Usuarios</span>
          </button>

          <button v-if="authStore.isAdmin" @click="navTo('/dashboard')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap text-white/70 hover:text-white hover:bg-white/10">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            <span class="hidden sm:inline">Curricular</span>
          </button>

          <!-- ACTIVO: Mallas -->
          <button v-if="authStore.isAdmin"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap bg-white/20 text-white shadow-sm">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            <span class="hidden sm:inline">Mallas</span>
          </button>

          <button v-if="authStore.isCoordinator" @click="navTo('/dashboard')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap text-white/70 hover:text-white hover:bg-white/10">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            <span class="hidden sm:inline">Asignar Mallas</span>
          </button>

          <button v-if="authStore.isTeacher" @click="navTo('/dashboard')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap text-white/70 hover:text-white hover:bg-white/10">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            <span class="hidden sm:inline">Mis Mallas</span>
          </button>

          <button v-if="authStore.isTeacher" @click="navTo('/dashboard')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap text-white/70 hover:text-white hover:bg-white/10">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span class="hidden sm:inline">Cronogramas</span>
          </button>
        </nav>

        <!-- Usuario + logout -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-white leading-none">{{ authStore.user?.first_name }} {{ authStore.user?.last_name }}</p>
            <p class="text-xs text-white/60 mt-0.5 capitalize">{{ authStore.user?.roles?.[0]?.name }}</p>
          </div>
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ring-2 ring-white/30">
            {{ (authStore.user?.first_name?.[0] || '') + (authStore.user?.last_name?.[0] || '') }}
          </div>
          <button @click="handleLogout"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span class="hidden md:inline">Salir</span>
          </button>
        </div>

      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

      <!-- Banner de cabecera -->
      <div class="relative overflow-hidden rounded-2xl welcome-gradient p-5 text-white shadow-lg">
        <div class="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div class="relative z-10 flex items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-bold tracking-tight">Malla Curricular</h1>
            <p class="text-white/70 text-sm mt-0.5">Relaciona grados y asignaturas con la estructura curricular</p>
          </div>
          <div v-if="hasValidSelection" class="hidden sm:flex items-center gap-2 flex-shrink-0">
            <span class="px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium">
              {{ currentGrade.name }} — {{ currentSubject.name }}
            </span>
            <span class="px-2.5 py-1 bg-white/20 rounded-full text-xs font-semibold">
              {{ filteredCurriculumData.length }} filas
            </span>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card border-t-4 border-brand-400">
        <div class="card-header flex items-center justify-between">
          <h2 class="font-semibold text-gray-900">Filtros de búsqueda</h2>
          <button @click="clearFilters" :disabled="isLoading" class="btn-ghost btn-sm">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Limpiar
          </button>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="label">Grado <span class="text-red-500">*</span></label>
              <select v-model="selectedGrade" @change="onGradeChange" class="input" :disabled="isLoading">
                <option value="">Seleccionar grado</option>
                <option v-for="grade in grades" :key="grade.id" :value="grade.id">{{ grade.name }}</option>
              </select>
            </div>
            <div>
              <label class="label">Asignatura <span class="text-red-500">*</span></label>
              <select v-model="selectedSubject" @change="loadCurriculumData" class="input" :disabled="isLoading || !selectedGrade">
                <option value="">Seleccionar asignatura</option>
                <option v-for="subject in filteredSubjects" :key="subject.id" :value="subject.id">{{ subject.name }}</option>
              </select>
            </div>
            <div>
              <label class="label">Buscar</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/></svg>
                </div>
                <input v-model="searchTerm" type="text" placeholder="Buscar en la malla..." class="input input-icon" :disabled="!curriculumData.length"/>
              </div>
            </div>
          </div>

          <div v-if="!hasValidSelection" class="mt-4 alert-info">
            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            <span>Selecciona un grado y una asignatura para ver y gestionar la malla curricular.</span>
          </div>
        </div>
      </div>

      <!-- Barra de acciones -->
      <div class="flex items-center justify-between gap-3">
        <button @click="openCreateModal" :disabled="!hasValidSelection || isLoading" class="btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Agregar a la Malla
        </button>
        <div v-if="filteredCurriculumData.length > 0" class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Filas por página:</span>
          <select v-model="itemsPerPage" class="input" style="width:auto">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="card">
        <div class="card-body py-16 text-center">
          <svg class="animate-spin w-8 h-8 text-brand-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p class="text-gray-500 text-sm">Cargando malla curricular...</p>
        </div>
      </div>

      <!-- Tabla -->
      <div v-else-if="filteredCurriculumData.length > 0" class="card border-t-4 border-violet-500">
        <div class="card-header flex items-center justify-between">
          <p class="text-sm text-gray-600">
            Mostrando <strong class="text-gray-900">{{ paginatedData.length }}</strong> de
            <strong class="text-gray-900">{{ filteredCurriculumData.length }}</strong> elementos
          </p>
        </div>
        <div class="table-wrapper" style="border-radius:0; border:none; box-shadow:none;">
          <table class="table">
            <thead>
              <tr>
                <th @click="sortBy('id')" class="cursor-pointer select-none">
                  <span class="flex items-center gap-1">ID
                    <svg class="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
                  </span>
                </th>
                <th @click="sortBy('topic_id')" class="cursor-pointer select-none">Eje Temático</th>
                <th @click="sortBy('component_id')" class="cursor-pointer select-none">Componente</th>
                <th @click="sortBy('standard_id')" class="cursor-pointer select-none">Estándar</th>
                <th @click="sortBy('competency_id')" class="cursor-pointer select-none">Competencia</th>
                <th @click="sortBy('claim_id')" class="cursor-pointer select-none">Afirmación</th>
                <th @click="sortBy('evidence_id')" class="cursor-pointer select-none">Evidencia</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginatedData" :key="item.id" :class="{ 'opacity-50': !item.is_active }">
                <td><span class="badge-gray">{{ item.id }}</span></td>
                <td>
                  <span class="inline-flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0"></span>
                    <span class="text-gray-800">{{ getTopicName(item.topic_id) }}</span>
                  </span>
                </td>
                <td>
                  <span class="inline-flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0"></span>
                    <span class="text-gray-800">{{ getComponentName(item.component_id) }}</span>
                  </span>
                </td>
                <td>
                  <span class="inline-flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                    <span class="text-gray-800">{{ getStandardName(item.standard_id) }}</span>
                  </span>
                </td>
                <td>
                  <span class="inline-flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></span>
                    <span class="text-gray-800">{{ getCompetencyName(item.competency_id) }}</span>
                  </span>
                </td>
                <td class="text-gray-700">{{ getClaimName(item.claim_id) }}</td>
                <td class="text-gray-700">{{ getEvidenceName(item.evidence_id) }}</td>
                <td>
                  <span :class="item.is_active ? 'badge-green' : 'badge-red'">
                    {{ item.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center gap-1">
                    <button @click="editItem(item)" class="btn-ghost btn-sm" title="Editar">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button @click="toggleItemStatus(item)"
                      :class="item.is_active ? 'btn-ghost btn-sm text-amber-600 hover:bg-amber-50' : 'btn-ghost btn-sm text-emerald-600 hover:bg-emerald-50'"
                      :title="item.is_active ? 'Desactivar' : 'Activar'">
                      <svg v-if="item.is_active" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </button>
                    <button @click="deleteItem(item.id)" class="btn-ghost btn-sm text-red-500 hover:bg-red-50" title="Eliminar">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="card-body border-t border-gray-100 flex items-center justify-between gap-4">
          <p class="text-sm text-gray-500">Página {{ currentPage }} de {{ totalPages }}</p>
          <div class="flex items-center gap-1">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="btn-secondary btn-sm px-2">‹</button>
            <button v-for="page in visiblePages" :key="page" @click="changePage(page)"
              :class="['btn-sm px-3', currentPage === page ? 'btn-primary' : 'btn-secondary']">
              {{ page }}
            </button>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="btn-secondary btn-sm px-2">›</button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="hasValidSelection && !isLoading" class="card">
        <div class="card-body py-16 text-center">
          <div class="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <p class="font-semibold text-gray-800">No hay elementos en esta malla</p>
          <p class="text-sm text-gray-500 mt-1 mb-5">Comienza agregando el primer elemento para <strong>{{ currentGrade.name }} — {{ currentSubject.name }}</strong></p>
          <button @click="openCreateModal" class="btn-primary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Agregar Primer Elemento
          </button>
        </div>
      </div>

      <!-- Placeholder -->
      <div v-else-if="!isLoading" class="card">
        <div class="card-body py-16 text-center">
          <div class="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
          </div>
          <p class="font-semibold text-gray-800">Selecciona Grado y Asignatura</p>
          <p class="text-sm text-gray-500 mt-1">Usa los filtros de arriba para cargar la malla curricular</p>
        </div>
      </div>

    </main>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="bg-white rounded-2xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="page-title">{{ isEditing ? 'Editar Elemento' : 'Nuevo Elemento' }}</h2>
            <p class="page-subtitle" v-if="hasValidSelection">{{ currentGrade.name }} — {{ currentSubject.name }}</p>
          </div>
          <button @click="closeModal" class="btn-ghost btn-sm w-8 h-8 p-0 rounded-lg">&times;</button>
        </div>

        <div class="p-6">
          <form @submit.prevent="saveItem" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="label">Eje Temático <span class="text-red-500">*</span></label>
                <select v-model="formData.topic_id" required class="input" :class="{ 'ring-2 ring-red-400 border-red-300': formErrors.topic_id }">
                  <option value="">Seleccionar</option>
                  <option v-for="topic in topics" :key="topic.id" :value="topic.id">{{ topic.name }}</option>
                </select>
                <p v-if="formErrors.topic_id" class="text-xs text-red-500 mt-1">{{ formErrors.topic_id }}</p>
              </div>
              <div>
                <label class="label">Componente <span class="text-red-500">*</span></label>
                <select v-model="formData.component_id" required class="input" :class="{ 'ring-2 ring-red-400 border-red-300': formErrors.component_id }">
                  <option value="">Seleccionar</option>
                  <option v-for="component in components" :key="component.id" :value="component.id">{{ component.name }}</option>
                </select>
                <p v-if="formErrors.component_id" class="text-xs text-red-500 mt-1">{{ formErrors.component_id }}</p>
              </div>
              <div>
                <label class="label">Estándar <span class="text-red-500">*</span></label>
                <select v-model="formData.standard_id" required class="input" :class="{ 'ring-2 ring-red-400 border-red-300': formErrors.standard_id }">
                  <option value="">Seleccionar</option>
                  <option v-for="standard in standards" :key="standard.id" :value="standard.id">{{ standard.name }}</option>
                </select>
                <p v-if="formErrors.standard_id" class="text-xs text-red-500 mt-1">{{ formErrors.standard_id }}</p>
              </div>
              <div>
                <label class="label">Competencia <span class="text-red-500">*</span></label>
                <select v-model="formData.competency_id" required class="input" :class="{ 'ring-2 ring-red-400 border-red-300': formErrors.competency_id }">
                  <option value="">Seleccionar</option>
                  <option v-for="competency in competencies" :key="competency.id" :value="competency.id">{{ competency.name }}</option>
                </select>
                <p v-if="formErrors.competency_id" class="text-xs text-red-500 mt-1">{{ formErrors.competency_id }}</p>
              </div>
              <div>
                <label class="label">Afirmación DBA <span class="text-red-500">*</span></label>
                <select v-model="formData.claim_id" required class="input" :class="{ 'ring-2 ring-red-400 border-red-300': formErrors.claim_id }">
                  <option value="">Seleccionar</option>
                  <option v-for="claim in claims" :key="claim.id" :value="claim.id">{{ claim.name }}</option>
                </select>
                <p v-if="formErrors.claim_id" class="text-xs text-red-500 mt-1">{{ formErrors.claim_id }}</p>
              </div>
              <div>
                <label class="label">Evidencia DBA <span class="text-red-500">*</span></label>
                <select v-model="formData.evidence_id" required class="input" :class="{ 'ring-2 ring-red-400 border-red-300': formErrors.evidence_id }">
                  <option value="">Seleccionar</option>
                  <option v-for="evidence in evidences" :key="evidence.id" :value="evidence.id">{{ evidence.name }}</option>
                </select>
                <p v-if="formErrors.evidence_id" class="text-xs text-red-500 mt-1">{{ formErrors.evidence_id }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 pt-1">
              <label class="label mb-0">Estado</label>
              <button type="button" @click="formData.is_active = !formData.is_active"
                :class="['relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1',
                  formData.is_active ? 'bg-emerald-500' : 'bg-gray-300']">
                <span :class="['inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform',
                  formData.is_active ? 'translate-x-4.5' : 'translate-x-0.5']"></span>
              </button>
              <span class="text-sm" :class="formData.is_active ? 'text-emerald-600 font-medium' : 'text-gray-500'">
                {{ formData.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </form>
        </div>

        <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button @click="closeModal" type="button" :disabled="isSubmitting" class="btn-secondary">Cancelar</button>
          <button @click="saveItem" :disabled="isSubmitting" class="btn-primary">
            <svg v-if="isSubmitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Notificación -->
    <Transition name="slide-up">
      <div v-if="notification.show"
        :class="['fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-modal text-sm font-medium max-w-sm',
          notification.type === 'success' ? 'bg-emerald-600 text-white' :
          notification.type === 'warning' ? 'bg-amber-500 text-white' : 'bg-red-600 text-white']">
        <svg v-if="notification.type === 'success'" class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
        <svg v-else class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
        <span>{{ notification.message }}</span>
        <button @click="notification.show = false" class="ml-2 opacity-70 hover:opacity-100 text-lg leading-none">&times;</button>
      </div>
    </Transition>

  </div>
</template>

<script>
import api from '@/api/api';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'MallaCurricular',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const handleLogout = async () => {
      await authStore.logout();
      router.push('/login');
    };
    const navTo = (path) => router.push(path);
    return { authStore, router, handleLogout, navTo };
  },
  data() {
    return {
      // Datos principales
      curriculumData: [],
      selectedGrade: '',
      selectedSubject: '',
      
      // Listas de opciones
      grades: [],
      subjects: [],
      topics: [],
      components: [],
      standards: [],
      competencies: [],
      claims: [],
      evidences: [],
      
      // Estado UI
      showModal: false,
      isEditing: false,
      isLoading: false,
      isSubmitting: false,
      
      // Búsqueda y paginación
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 10,
      sortField: 'id',
      sortDirection: 'asc',
      
      // Formulario
      formData: {
        grade_id: '',
        subject_id: '',
        topic_id: '',
        component_id: '',
        standard_id: '',
        competency_id: '',
        claim_id: '',
        evidence_id: '',
        is_active: true
      },
      formErrors: {},
      
      // Notificación
      notification: {
        show: false,
        message: '',
        type: 'success'
      },
      
      // Cache para optimización
      cache: {
        grades: new Map(),
        subjects: new Map(),
        topics: new Map(),
        components: new Map(),
        standards: new Map(),
        competencies: new Map(),
        claims: new Map(),
        evidences: new Map()
      }
    };
  },
  
  computed: {
    // Computed properties optimizados
    currentGrade() {
      return this.grades.find(g => g.id === this.selectedGrade) || {};
    },
    
    currentSubject() {
      return this.subjects.find(s => s.id === this.selectedSubject) || {};
    },
    
    hasValidSelection() {
      return this.selectedGrade && this.selectedSubject;
    },
    
    filteredSubjects() {
      if (!this.selectedGrade) return this.subjects;
      // Aquí podrías filtrar asignaturas por grado si es necesario
      return this.subjects;
    },
    
    filteredCurriculumData() {
      let filtered = this.curriculumData;
      
      // Aplicar búsqueda
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
          this.getTopicName(item.topic_id).toLowerCase().includes(term) ||
          this.getComponentName(item.component_id).toLowerCase().includes(term) ||
          this.getStandardName(item.standard_id).toLowerCase().includes(term) ||
          this.getCompetencyName(item.competency_id).toLowerCase().includes(term) ||
          this.getClaimName(item.claim_id).toLowerCase().includes(term) ||
          this.getEvidenceName(item.evidence_id).toLowerCase().includes(term)
        );
      }
      
      // Aplicar ordenamiento
      if (this.sortField) {
        filtered.sort((a, b) => {
          let aValue = a[this.sortField];
          let bValue = b[this.sortField];
          
          // Para campos relacionales, usar el nombre en lugar del ID
          if (this.sortField.includes('_id')) {
            aValue = this.getNameFromCache(this.sortField.replace('_id', ''), aValue);
            bValue = this.getNameFromCache(this.sortField.replace('_id', ''), bValue);
          }
          
          if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
          if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }
      
      return filtered;
    },
    
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + parseInt(this.itemsPerPage);
      return this.filteredCurriculumData.slice(start, end);
    },
    
    totalPages() {
      return Math.ceil(this.filteredCurriculumData.length / this.itemsPerPage);
    },
    
    visiblePages() {
      const pages = [];
      const total = this.totalPages;
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(total, start + 4);
      
      if (end - start < 4) {
        start = Math.max(1, end - 4);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  
  watch: {
    itemsPerPage() {
      this.currentPage = 1;
    },
    
    searchTerm() {
      this.currentPage = 1;
    },
    
    selectedGrade(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectedSubject = '';
      }
    }
  },
  
  async mounted() {
    await this.loadAllData();
  },
  
  methods: {
    // Carga de datos
    async loadAllData() {
      this.isLoading = true;
      try {
        await Promise.all([
          this.loadGrades(),
          this.loadSubjects(),
          this.loadTopics(),
          this.loadComponents(),
          this.loadStandards(),
          this.loadCompetencies(),
          this.loadClaims(),
          this.loadEvidences()
        ]);
      } catch (error) {
        this.showNotification('Error al cargar los datos iniciales', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    
    async loadGrades() {
      try {
        const response = await api.get('/grades');
        this.grades = response.data;
      } catch (error) {
        throw new Error('Error cargando grados');
      }
    },
    
    async loadSubjects() {
      try {
        const response = await api.get('/subjects');
        this.subjects = response.data;
      } catch (error) {
        throw new Error('Error cargando asignaturas');
      }
    },
    
    async loadTopics() {
      try {
        const response = await api.get('/thematic-topics');
        this.topics = response.data;
      } catch (error) {
        throw new Error('Error cargando ejes temáticos');
      }
    },
    
    async loadComponents() {
      try {
        const response = await api.get('/components');
        this.components = response.data;
      } catch (error) {
        throw new Error('Error cargando componentes');
      }
    },
    
    async loadStandards() {
      try {
        const response = await api.get('/standards');
        this.standards = response.data;
      } catch (error) {
        throw new Error('Error cargando estándares');
      }
    },
    
    async loadCompetencies() {
      try {
        const response = await api.get('/competencies');
        this.competencies = response.data;
      } catch (error) {
        throw new Error('Error cargando competencias');
      }
    },
    
    async loadClaims() {
      try {
        const response = await api.get('/claims');
        this.claims = response.data;
      } catch (error) {
        throw new Error('Error cargando afirmaciones');
      }
    },
    
    async loadEvidences() {
      try {
        const response = await api.get('/evidences');
        this.evidences = response.data;
      } catch (error) {
        throw new Error('Error cargando evidencias');
      }
    },
    
    async loadCurriculumData() {
      if (!this.hasValidSelection) {
        this.curriculumData = [];
        return;
      }
      
      this.isLoading = true;
      try {
        const url = `/curriculum-grid?grade_id=${this.selectedGrade}&subject_id=${this.selectedSubject}`;
        const response = await api.get(url);
        this.curriculumData = response.data;
        this.currentPage = 1; // Resetear a primera página
      } catch (error) {
        this.showNotification(
          error.response?.data?.message || 'Error al cargar la malla curricular', 
          'error'
        );
        this.curriculumData = [];
      } finally {
        this.isLoading = false;
      }
    },
    
    // Métodos del formulario
    openCreateModal() {
      if (!this.hasValidSelection) {
        this.showNotification('Selecciona grado y asignatura primero', 'error');
        return;
      }
      
      this.isEditing = false;
      this.formErrors = {};
      this.formData = {
        grade_id: this.selectedGrade,
        subject_id: this.selectedSubject,
        topic_id: '',
        component_id: '',
        standard_id: '',
        competency_id: '',
        claim_id: '',
        evidence_id: '',
        is_active: true
      };
      this.showModal = true;
    },
    
    editItem(item) {
      this.isEditing = true;
      this.formErrors = {};
      this.formData = { ...item };
      this.showModal = true;
    },
    
    validateForm() {
      this.formErrors = {};
      let isValid = true;
      
      const requiredFields = [
        'topic_id', 'component_id', 'standard_id', 
        'competency_id', 'claim_id', 'evidence_id'
      ];
      
      requiredFields.forEach(field => {
        if (!this.formData[field]) {
          this.formErrors[field] = 'Este campo es requerido';
          isValid = false;
        }
      });
      
      return isValid;
    },
    
    async saveItem() {
      if (this.isSubmitting) return;
      
      if (!this.validateForm()) {
        this.showNotification('Por favor, completa todos los campos requeridos', 'error');
        return;
      }
      
      this.isSubmitting = true;
      
      try {
        if (this.isEditing) {
          await api.put(`/curriculum-grid/${this.formData.id}`, this.formData);
          this.showNotification('Elemento actualizado correctamente', 'success');
        } else {
          await api.post('/curriculum-grid', this.formData);
          this.showNotification('Elemento creado correctamente', 'success');
        }
        
        this.closeModal();
        await this.loadCurriculumData();
      } catch (error) {
        const message = error.response?.data?.message || 
          `Error al ${this.isEditing ? 'actualizar' : 'crear'} el elemento`;
        this.showNotification(message, 'error');
      } finally {
        this.isSubmitting = false;
      }
    },
    
    async toggleItemStatus(item) {
      try {
        const newStatus = !item.is_active;
        await api.patch(`/curriculum-grid/${item.id}`, { is_active: newStatus });
        
        this.showNotification(
          `Elemento ${newStatus ? 'activado' : 'desactivado'} correctamente`,
          'success'
        );
        
        await this.loadCurriculumData();
      } catch (error) {
        this.showNotification('Error al cambiar el estado del elemento', 'error');
      }
    },
    
    async deleteItem(id) {
      if (!confirm('¿Estás seguro de eliminar este elemento? Esta acción no se puede deshacer.')) {
        return;
      }
      
      try {
        await api.delete(`/curriculum-grid/${id}`);
        this.showNotification('Elemento eliminado correctamente', 'success');
        await this.loadCurriculumData();
      } catch (error) {
        this.showNotification('Error al eliminar el elemento', 'error');
      }
    },
    
    closeModal() {
      if (this.isSubmitting) return;
      
      this.showModal = false;
      this.isEditing = false;
      this.formErrors = {};
      this.formData = {
        grade_id: '',
        subject_id: '',
        topic_id: '',
        component_id: '',
        standard_id: '',
        competency_id: '',
        claim_id: '',
        evidence_id: '',
        is_active: true
      };
    },
    
    // Métodos de UI
    onGradeChange() {
      this.selectedSubject = '';
      this.curriculumData = [];
    },
    
    clearFilters() {
      this.selectedGrade = '';
      this.selectedSubject = '';
      this.searchTerm = '';
      this.curriculumData = [];
      this.currentPage = 1;
    },
    
    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'asc';
      }
    },
    
    getSortIcon(field) {
      if (this.sortField !== field) return 'sort-none';
      return this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    
    async exportData() {
      if (!this.curriculumData.length) return;
      
      try {
        // Simular exportación
        this.showNotification('Preparando exportación...', 'success');
        // Aquí implementarías la lógica real de exportación
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.showNotification('Datos exportados correctamente', 'success');
      } catch (error) {
        this.showNotification('Error al exportar los datos', 'error');
      }
    },
    
    // Métodos de utilidad con cache
    getNameFromCache(type, id) {
      const cache = this.cache[type];
      if (cache.has(id)) {
        return cache.get(id);
      }
      
      const collection = this[type];
      const item = collection.find(item => item.id === id);
      const name = item ? item.name : 'N/A';
      
      cache.set(id, name);
      return name;
    },
    
    getTopicName(id) {
      return this.getNameFromCache('topics', id);
    },
    
    getComponentName(id) {
      return this.getNameFromCache('components', id);
    },
    
    getStandardName(id) {
      return this.getNameFromCache('standards', id);
    },
    
    getCompetencyName(id) {
      return this.getNameFromCache('competencies', id);
    },
    
    getClaimName(id) {
      return this.getNameFromCache('claims', id);
    },
    
    getEvidenceName(id) {
      return this.getNameFromCache('evidences', id);
    },
    
    // Notificaciones
    showNotification(message, type = 'success') {
      this.notification = { show: true, message, type };
    }
  }
};
</script>