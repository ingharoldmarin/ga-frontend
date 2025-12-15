<template>
  <div class="malla-curricular min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-0 w-full">
    <!-- Barra de herramientas mejorada -->
    <div class="toolbar no-print flex items-center justify-between bg-white w-full shadow-xl px-6 py-4 border-b border-gray-200 sticky top-0 z-40">
      <div class="toolbar-left flex items-center gap-4">
        <!-- Botón para volver al Dashboard -->
        <button
          @click="goToDashboard"
          class="btn-tool inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span class="text-lg">🏠</span>
          Dashboard
        </button>

        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
            <span class="text-white text-xl">📚</span>
          </div>
          <div>
            <h1 class="toolbar-title text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
              Malla Curricular
            </h1>
            <p class="toolbar-subtitle text-sm text-gray-600 hidden md:block">
              Sistema integral de gestión curricular académica
            </p>
          </div>
        </div>
      </div>

      <div class="toolbar-right flex items-center gap-3">
        <!-- Botón de vista detallada -->
        <button
          v-if="filteredMallaItems.length > 0"
          @click="toggleDetailedView"
          class="btn-tool inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span class="text-lg">{{ isDetailedView ? '📋' : '🔍' }}</span>
          {{ isDetailedView ? 'Vista Normal' : 'Vista Detallada' }}
        </button>

        <button
          v-if="filteredMallaItems.length > 0"
          @click="printDocument"
          class="btn-tool inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-gray-950 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span class="text-lg">🖨️</span>
          Exportar PDF
        </button>

        <button
          v-if="selectedGrade && selectedSubject"
          @click="openCreateModal"
          class="btn-tool inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span class="text-lg">✨</span>
          Nuevo Elemento
        </button>
      </div>
    </div>

    <!-- Sistema de notificaciones mejorado -->
    <div class="no-print px-6 py-3">
      <transition
        enter-active-class="transform transition-all duration-500 ease-out"
        enter-from-class="opacity-0 -translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transform transition-all duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-2 scale-95"
      >
        <div
          v-if="successMessage"
          class="mb-4 rounded-2xl px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 flex items-center gap-4 shadow-lg"
        >
          <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
            <span class="text-white text-sm">✓</span>
          </div>
          <span class="font-semibold flex-1">{{ successMessage }}</span>
          <button @click="successMessage = ''" class="text-green-600 hover:text-green-800 transition-colors">
            <span class="text-lg">✕</span>
          </button>
        </div>
      </transition>

      <transition
        enter-active-class="transform transition-all duration-500 ease-out"
        enter-from-class="opacity-0 -translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transform transition-all duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-2 scale-95"
      >
        <div
          v-if="errorMessage"
          class="mb-4 rounded-2xl px-5 py-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-800 flex items-center gap-4 shadow-lg"
        >
          <div class="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
            <span class="text-white text-sm">⚠️</span>
          </div>
          <span class="font-semibold flex-1">{{ errorMessage }}</span>
          <button @click="errorMessage = ''" class="text-red-600 hover:text-red-800 transition-colors">
            <span class="text-lg">✕</span>
          </button>
        </div>
      </transition>
    </div>

    <!-- Panel de filtros mejorado -->
    <div class="no-print mb-8 w-full px-6">
      <div class="bg-white w-full rounded-2xl shadow-xl border border-gray-200 p-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <span class="text-white text-sm">🔍</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">Configuración de la Malla</h3>
            <p class="text-sm text-gray-600">Selecciona el grado y asignatura para visualizar la estructura curricular</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-700">
              <span class="flex items-center gap-2">
                <span>🎓</span>
                Grado Académico <span class="text-red-500">*</span>
              </span>
            </label>
            <select
              v-model="selectedGrade"
              @change="onGradeChange"
              :disabled="loading"
              class="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300"
            >
              <option :value="null" class="text-gray-400">Seleccionar grado...</option>
              <option 
                v-for="grade in grades" 
                :key="grade.id" 
                :value="grade.id"
                class="py-3"
              >
                {{ grade.name }}
              </option>
            </select>
          </div>

          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-700">
              <span class="flex items-center gap-2">
                <span>📖</span>
                Asignatura <span class="text-red-500">*</span>
              </span>
            </label>
            <select
              v-model="selectedSubject"
              @change="loadMalla"
              :disabled="loading || !selectedGrade"
              class="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300"
            >
              <option :value="null" class="text-gray-400">Seleccionar asignatura...</option>
              <option 
                v-for="subject in filteredSubjects" 
                :key="subject.id" 
                :value="subject.id"
                class="py-3"
              >
                {{ subject.name }}
              </option>
            </select>
          </div>

          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-700">
              <span class="flex items-center gap-2">
                <span>🔎</span>
                Buscar en contenido
              </span>
            </label>
            <div class="relative">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Buscar en elementos de la malla..."
                :disabled="!mallaItems.length"
                class="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 pl-12 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300"
              >
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="text-gray-400 text-lg">🔍</span>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-700">
              <span class="flex items-center gap-2">
                <span>📊</span>
                Elementos por página
              </span>
            </label>
            <select
              v-model="itemsPerPage"
              class="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300"
            >
              <option value="6">6 elementos</option>
              <option value="12">12 elementos</option>
              <option value="18">18 elementos</option>
              <option value="24">24 elementos</option>
            </select>
          </div>
        </div>

        <!-- Información de selección actual -->
        <div v-if="selectedGrade && selectedSubject" class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-md">
                <span class="text-white text-sm">📋</span>
              </div>
              <div>
                <h4 class="font-bold text-gray-900 text-lg">{{ gradeName }} - {{ subjectName }}</h4>
                <p class="text-sm text-gray-600">
                  <span class="font-semibold text-blue-600">{{ filteredMallaItems.length }}</span> elemento(s) en la malla
                  <span v-if="searchTerm" class="text-purple-600 font-medium"> • Filtrado: "{{ searchTerm }}"</span>
                </p>
              </div>
            </div>
            <button
              @click="clearFilters"
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <span class="text-lg">🔄</span>
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal - Vista de Tarjetas -->
    <div v-if="loading" class="w-full bg-white rounded-2xl shadow-xl border border-gray-200 mx-6 p-16 text-center">
      <div class="flex flex-col items-center justify-center">
        <div class="relative">
          <div class="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-blue-600 text-2xl">📚</span>
          </div>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">Cargando Malla Curricular</h3>
        <p class="text-gray-600 max-w-md">Estamos organizando los elementos curriculares para una visualización óptima...</p>
      </div>
    </div>

    <!-- Vista de Tarjetas de la Malla -->
    <div v-else-if="selectedGrade && selectedSubject && filteredMallaItems.length > 0" 
         class="document-container w-full px-6 mb-8">
      
      <!-- Vista Detallada -->
      <div v-if="isDetailedView" class="detailed-view">
        <!-- Encabezado de la vista detallada -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-md">
                <span class="text-white text-sm">📊</span>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Vista Detallada de la Malla Curricular</h2>
                <p class="text-gray-600">{{ gradeName }} - {{ subjectName }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-indigo-600">{{ filteredMallaItems.length }}</div>
              <div class="text-sm text-gray-500">Elementos totales</div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-indigo-50 rounded-xl">
              <div class="text-xl font-bold text-indigo-700">{{ activeItemsCount }}</div>
              <div class="text-sm text-gray-600">Activos</div>
            </div>
            <div class="text-center p-4 bg-blue-50 rounded-xl">
              <div class="text-xl font-bold text-blue-700">{{ totalStandards }}</div>
              <div class="text-sm text-gray-600">Estándares</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-xl">
              <div class="text-xl font-bold text-green-700">{{ totalCompetences }}</div>
              <div class="text-sm text-gray-600">Competencias</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-xl">
              <div class="text-xl font-bold text-purple-700">{{ totalTopics }}</div>
              <div class="text-sm text-gray-600">Ejes Temáticos</div>
            </div>
          </div>
        </div>

        <!-- Lista detallada de elementos -->
        <div class="space-y-6">
          <div 
            v-for="(item, index) in filteredMallaItems" 
            :key="item.id"
            class="bg-white rounded-2xl shadow-xl border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300"
            :class="{'opacity-75': !item.active}"
          >
            <!-- Header de la tarjeta detallada -->
            <div class="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-t-2xl p-6 border-b border-gray-200">
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <div class="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                      <span class="text-white font-bold text-lg">{{ index + 1 }}</span>
                    </div>
                    <div class="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-md">
                      <span class="text-white text-xs font-bold">{{ item.id }}</span>
                    </div>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 text-lg">Elemento Curricular {{ index + 1 }}</h3>
                    <p class="text-sm text-gray-600">Orden: {{ item.order || 'No definido' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="status-badge" :class="item.active ? 'status-active' : 'status-inactive'">
                    {{ item.active ? '🟢 Activo' : '⚫ Inactivo' }}
                  </span>
                </div>
              </div>

              <!-- Acciones Rápidas -->
              <div class="flex justify-end gap-2">
                <button @click="openEditModal(item)" class="btn-action btn-edit" title="Editar elemento">
                  <span class="text-sm">✏️ Editar</span>
                </button>
                <button 
                  @click="toggleItemStatus(item)" 
                  :class="['btn-action', item.active ? 'btn-deactivate' : 'btn-activate']" 
                  :title="item.active ? 'Desactivar elemento' : 'Activar elemento'"
                >
                  <span class="text-sm">{{ item.active ? '⏸️ Pausar' : '▶️ Activar' }}</span>
                </button>
                <button @click="confirmDelete(item)" class="btn-action btn-delete" title="Eliminar elemento">
                  <span class="text-sm">🗑️ Eliminar</span>
                </button>
              </div>
            </div>

            <!-- Contenido detallado -->
            <div class="p-6 space-y-6">
              <!-- Ejes Temáticos -->
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
                    <span class="text-white text-sm">🎯</span>
                  </div>
                  <h4 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Ejes Temáticos</h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div 
                    v-for="topic in item.topics" 
                    :key="topic.id"
                    class="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-r-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h5 class="font-semibold text-gray-800 mb-1">{{ topic.name }}</h5>
                    <p v-if="topic.description" class="text-xs text-gray-600">{{ topic.description }}</p>
                  </div>
                  <div v-if="!item.topics.length" class="text-gray-400 text-sm italic p-3 bg-gray-50 rounded-lg col-span-full">
                    No se han definido ejes temáticos
                  </div>
                </div>
              </div>

              <!-- Componentes -->
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                    <span class="text-white text-sm">🧩</span>
                  </div>
                  <h4 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Componentes</h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div 
                    v-for="component in item.components" 
                    :key="component.id"
                    class="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-r-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h5 class="font-semibold text-gray-800 mb-1">{{ component.name }}</h5>
                    <p v-if="component.description" class="text-xs text-gray-600">{{ component.description }}</p>
                  </div>
                  <div v-if="!item.components.length" class="text-gray-400 text-sm italic p-3 bg-gray-50 rounded-lg col-span-full">
                    No se han definido componentes
                  </div>
                </div>
              </div>

              <!-- Estándares -->
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                    <span class="text-white text-sm">📋</span>
                  </div>
                  <h4 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Estándares</h4>
                </div>
                <div class="space-y-2">
                  <div 
                    v-for="standard in item.standards" 
                    :key="standard.id"
                    class="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <h5 class="font-semibold text-gray-800 mb-1">{{ standard.name }}</h5>
                    <p v-if="standard.description" class="text-xs text-gray-600">{{ standard.description }}</p>
                  </div>
                  <div v-if="!item.standards.length" class="text-gray-400 text-sm italic p-3 bg-gray-50 rounded-lg">
                    No se han definido estándares
                  </div>
                </div>
              </div>

              <!-- Competencias -->
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                    <span class="text-white text-sm">💪</span>
                  </div>
                  <h4 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Competencias</h4>
                </div>
                <div class="space-y-2">
                  <div 
                    v-for="competence in item.competences" 
                    :key="competence.id"
                    class="bg-purple-50 border-l-4 border-purple-500 rounded-r-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <h5 class="font-semibold text-gray-800 mb-1">{{ competence.name || 'Competencia' }}</h5>
                    <p class="text-sm text-gray-700">{{ competence.description }}</p>
                    <p v-if="competence.level" class="text-xs text-purple-600 mt-1">Nivel: {{ competence.level }}</p>
                  </div>
                  <div v-if="!item.competences.length" class="text-gray-400 text-sm italic p-3 bg-gray-50 rounded-lg">
                    No se han definido competencias
                  </div>
                </div>
              </div>

              <!-- Afirmaciones -->
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                    <span class="text-white text-sm">✅</span>
                  </div>
                  <h4 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Afirmaciones</h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div 
                    v-for="affirmation in item.affirmations" 
                    :key="affirmation.id"
                    class="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <h5 class="font-semibold text-gray-800 mb-1">{{ affirmation.name }}</h5>
                    <p v-if="affirmation.description" class="text-xs text-gray-600">{{ affirmation.description }}</p>
                  </div>
                  <div v-if="!item.affirmations.length" class="text-gray-400 text-sm italic p-3 bg-gray-50 rounded-lg col-span-full">
                    No se han definido afirmaciones
                  </div>
                </div>
              </div>

              <!-- Evidencias -->
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center shadow-md">
                    <span class="text-white text-sm">🔍</span>
                  </div>
                  <h4 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Evidencias</h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div 
                    v-for="evidence in item.evidences" 
                    :key="evidence.id"
                    class="bg-teal-50 border-l-4 border-teal-500 rounded-r-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <h5 class="font-semibold text-gray-800 mb-1">{{ evidence.name }}</h5>
                    <p v-if="evidence.description" class="text-xs text-gray-600">{{ evidence.description }}</p>
                    <p v-if="evidence.type" class="text-xs text-teal-600 mt-1">Tipo: {{ evidence.type }}</p>
                  </div>
                  <div v-if="!item.evidences.length" class="text-gray-400 text-sm italic p-3 bg-gray-50 rounded-lg col-span-full">
                    No se han definido evidencias
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <div v-if="item.description" class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
                    <span class="text-white text-sm">💡</span>
                  </div>
                  <h4 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Observaciones</h4>
                </div>
                <div class="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 rounded-r-lg p-4">
                  <p class="text-sm text-gray-700 leading-relaxed">{{ item.description }}</p>
                </div>
              </div>

              <!-- Metadata -->
              <div class="pt-4 border-t border-gray-200">
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>Actualizado: {{ formatDate(item.updated_at) }}</span>
                  <span>Orden: {{ item.order || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Normal (existente) -->
      <div v-else>
        <!-- Estadísticas Rápidas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 text-center transform hover:scale-105 transition-transform duration-300">
            <div class="text-3xl font-bold text-blue-600 mb-2">{{ filteredMallaItems.length }}</div>
            <div class="text-sm font-semibold text-gray-700">Total Elementos</div>
            <div class="text-xs text-gray-500 mt-1">En la malla actual</div>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 text-center transform hover:scale-105 transition-transform duration-300">
            <div class="text-3xl font-bold text-green-600 mb-2">{{ activeItemsCount }}</div>
            <div class="text-sm font-semibold text-gray-700">Elementos Activos</div>
            <div class="text-xs text-gray-500 mt-1">Disponibles</div>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 text-center transform hover:scale-105 transition-transform duration-300">
            <div class="text-3xl font-bold text-purple-600 mb-2">{{ gradeName.split(' ')[0] }}</div>
            <div class="text-sm font-semibold text-gray-700">Grado</div>
            <div class="text-xs text-gray-500 mt-1">Nivel académico</div>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 text-center transform hover:scale-105 transition-transform duration-300">
            <div class="text-2xl font-bold text-orange-600 mb-2 truncate">{{ subjectName.split(' ')[0] }}</div>
            <div class="text-sm font-semibold text-gray-700">Asignatura</div>
            <div class="text-xs text-gray-500 mt-1">Área de estudio</div>
          </div>
        </div>

        <!-- Grid de Tarjetas -->
        <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
          <div 
            v-for="(item, index) in paginatedItems" 
            :key="item.id"
            class="bg-white rounded-2xl shadow-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            :class="{'opacity-75': !item.active}"
          >
            <!-- Header de la Tarjeta -->
            <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-2xl p-6 border-b border-gray-200">
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <div class="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                      <span class="text-white font-bold text-lg">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</span>
                    </div>
                    <div class="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                      <span class="text-white text-xs font-bold">{{ item.id }}</span>
                    </div>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 text-lg">Elemento Curricular</h3>
                    <p class="text-sm text-gray-600">Orden: {{ item.order || 'No definido' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="status-badge" :class="item.active ? 'status-active' : 'status-inactive'">
                    {{ item.active ? '🟢 Activo' : '⚫ Inactivo' }}
                  </span>
                </div>
              </div>

              <!-- Acciones Rápidas -->
              <div class="flex justify-end gap-2">
                <button @click="openEditModal(item)" class="btn-action btn-edit" title="Editar elemento">
                  <span class="text-sm">✏️ Editar</span>
                </button>
                <button 
                  @click="toggleItemStatus(item)" 
                  :class="['btn-action', item.active ? 'btn-deactivate' : 'btn-activate']" 
                  :title="item.active ? 'Desactivar elemento' : 'Activar elemento'"
                >
                  <span class="text-sm">{{ item.active ? '⏸️ Pausar' : '▶️ Activar' }}</span>
                </button>
                <button @click="confirmDelete(item)" class="btn-action btn-delete" title="Eliminar elemento">
                  <span class="text-sm">🗑️ Eliminar</span>
                </button>
              </div>
            </div>

            <!-- Contenido de la Tarjeta -->
            <div class="p-6 space-y-6">
              <!-- Ejes Temáticos -->
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
                    <span class="text-white text-sm">🎯</span>
                  </div>
                  <h4 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Ejes Temáticos</h4>
                </div>
                <div class="grid grid-cols-1 gap-2">
                  <div 
                    v-for="topic in item.topics" 
                    :key="topic.id"
                    class="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-r-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <span class="text-sm font-medium text-gray-800">{{ topic.name }}</span>
                  </div>
                  <div v-if="!item.topics.length" class="text-gray-400 text-sm italic p-3 bg-gray-50 rounded-lg">
                    No se han definido ejes temáticos
                  </div>
                </div>
              </div>

              <!-- Componentes -->
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                    <span class="text-white text-sm">🧩</span>
                  </div>
                  <h4 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Componentes</h4>
                </div>
                <div class="grid grid-cols-1 gap-2">
                  <div 
                    v-for="component in item.components" 
                    :key="component.id"
                    class="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-r-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <span class="text-sm font-medium text-gray-800">{{ component.name }}</span>
                  </div>
                  <div v-if="!item.components.length" class="text-gray-400 text-sm italic p-3 bg-gray-50 rounded-lg">
                    No se han definido componentes
                  </div>
                </div>
              </div>

              <!-- Estándares y Competencias en una fila -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Estándares -->
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                      <span class="text-white text-xs">📋</span>
                    </div>
                    <h4 class="font-bold text-gray-800 text-xs uppercase tracking-wide">Estándares</h4>
                  </div>
                  <div class="space-y-1">
                    <div 
                      v-for="standard in item.standards.slice(0, 3)" 
                      :key="standard.id"
                      class="bg-blue-50 border-l-2 border-blue-400 rounded-r px-2 py-1"
                    >
                      <span class="text-xs text-gray-700 line-clamp-2">{{ standard.name }}</span>
                    </div>
                    <div v-if="item.standards.length > 3" class="text-blue-600 text-xs font-medium px-2">
                      +{{ item.standards.length - 3 }} más...
                    </div>
                    <div v-if="!item.standards.length" class="text-gray-400 text-xs italic px-2">
                      Sin estándares
                    </div>
                  </div>
                </div>

                <!-- Competencias -->
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                      <span class="text-white text-xs">💪</span>
                    </div>
                    <h4 class="font-bold text-gray-800 text-xs uppercase tracking-wide">Competencias</h4>
                  </div>
                  <div class="space-y-1">
                    <div 
                      v-for="competence in item.competences.slice(0, 3)" 
                      :key="competence.id"
                      class="bg-purple-50 border-l-2 border-purple-400 rounded-r px-2 py-1"
                    >
                      <span class="text-xs text-gray-700 line-clamp-2">{{ competence.description }}</span>
                    </div>
                    <div v-if="item.competences.length > 3" class="text-purple-600 text-xs font-medium px-2">
                      +{{ item.competences.length - 3 }} más...
                    </div>
                    <div v-if="!item.competences.length" class="text-gray-400 text-xs italic px-2">
                      Sin competencias
                    </div>
                  </div>
                </div>
              </div>

              <!-- Afirmaciones y Evidencias en una fila -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Afirmaciones -->
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                      <span class="text-white text-xs">✅</span>
                    </div>
                    <h4 class="font-bold text-gray-800 text-xs uppercase tracking-wide">Afirmaciones</h4>
                  </div>
                  <div class="space-y-1">
                    <div 
                      v-for="affirmation in item.affirmations.slice(0, 2)" 
                      :key="affirmation.id"
                      class="bg-indigo-50 border-l-2 border-indigo-400 rounded-r px-2 py-1"
                    >
                      <span class="text-xs text-gray-700 line-clamp-2">{{ affirmation.name }}</span>
                    </div>
                    <div v-if="item.affirmations.length > 2" class="text-indigo-600 text-xs font-medium px-2">
                      +{{ item.affirmations.length - 2 }} más...
                    </div>
                    <div v-if="!item.affirmations.length" class="text-gray-400 text-xs italic px-2">
                      Sin afirmaciones
                    </div>
                  </div>
                </div>

                <!-- Evidencias -->
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center shadow-md">
                      <span class="text-white text-xs">🔍</span>
                    </div>
                    <h4 class="font-bold text-gray-800 text-xs uppercase tracking-wide">Evidencias</h4>
                  </div>
                  <div class="space-y-1">
                    <div 
                      v-for="evidence in item.evidences.slice(0, 2)" 
                      :key="evidence.id"
                      class="bg-teal-50 border-l-2 border-teal-400 rounded-r px-2 py-1"
                    >
                      <span class="text-xs text-gray-700 line-clamp-2">{{ evidence.name }}</span>
                    </div>
                    <div v-if="item.evidences.length > 2" class="text-teal-600 text-xs font-medium px-2">
                      +{{ item.evidences.length - 2 }} más...
                    </div>
                    <div v-if="!item.evidences.length" class="text-gray-400 text-xs italic px-2">
                      Sin evidencias
                    </div>
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <div v-if="item.description" class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
                    <span class="text-white text-sm">💡</span>
                  </div>
                  <h4 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Observaciones</h4>
                </div>
                <div class="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 rounded-r-lg p-4">
                  <p class="text-sm text-gray-700 leading-relaxed">{{ item.description }}</p>
                </div>
              </div>

              <!-- Metadata -->
              <div class="pt-4 border-t border-gray-200">
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>Actualizado: {{ formatDate(item.updated_at) }}</span>
                  <span>Orden: {{ item.order || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginación Mejorada -->
        <div v-if="totalPages > 1" class="mt-12 bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div class="text-sm text-gray-600">
              <span class="font-semibold text-blue-600">{{ paginatedItems.length }}</span> de 
              <span class="font-semibold text-gray-800">{{ filteredMallaItems.length }}</span> elementos mostrados
              <span v-if="searchTerm" class="text-purple-600 font-medium"> • Filtrado activo</span>
            </div>
            
            <div class="flex items-center gap-3">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:border-blue-500 hover:shadow-lg"
              >
                <span class="text-lg">‹</span>
              </button>
              
              <div class="flex items-center gap-2">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="changePage(page)"
                  :class="[
                    'w-12 h-12 flex items-center justify-center rounded-xl border-2 font-semibold transition-all duration-300',
                    currentPage === page
                      ? 'border-blue-600 bg-blue-600 text-white shadow-lg scale-110'
                      : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:border-blue-300 hover:shadow-md'
                  ]"
                >
                  {{ page }}
                </button>
              </div>
              
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:border-blue-500 hover:shadow-lg"
              >
                <span class="text-lg">›</span>
              </button>
            </div>

            <div class="text-sm text-gray-600">
              Página <span class="font-semibold text-blue-600">{{ currentPage }}</span> de 
              <span class="font-semibold text-gray-800">{{ totalPages }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estados Vacíos -->
    <div v-else-if="selectedGrade && selectedSubject" class="w-full bg-white rounded-2xl shadow-xl border border-gray-200 mx-6 mb-8 p-16 text-center">
      <div class="max-w-2xl mx-auto">
        <div class="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <span class="text-5xl text-blue-600">📋</span>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-4">Malla Curricular Vacía</h3>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed">
          No hay elementos configurados para <span class="font-semibold text-blue-600">{{ gradeName }}</span> en 
          <span class="font-semibold text-purple-600">{{ subjectName }}</span>. 
          Comienza creando el primer elemento curricular para esta combinación.
        </p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
        >
          <span class="text-2xl">✨</span>
          <span class="text-lg">Crear Primer Elemento</span>
        </button>
      </div>
    </div>

    <!-- Estado Inicial -->
    <div v-else class="w-full bg-white rounded-2xl shadow-xl border border-gray-200 mx-6 mb-8 p-16 text-center">
      <div class="max-w-2xl mx-auto">
        <div class="w-32 h-32 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <span class="text-5xl text-gray-600">🔍</span>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-4">Explorar Malla Curricular</h3>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed">
          Para comenzar a visualizar y gestionar la malla curricular, selecciona un grado académico 
          y una asignatura utilizando los filtros en la parte superior de la página.
        </p>
        <div class="flex items-center justify-center gap-3 text-gray-500">
          <span class="text-2xl">↑</span>
          <span class="text-lg font-medium">Utiliza los filtros superiores para configurar tu búsqueda</span>
        </div>
      </div>
    </div>

    <!-- Modal de creación/edición -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 no-print backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white">
              {{ isEditing ? 'Editar Elemento Curricular' : 'Nuevo Elemento Curricular' }}
            </h2>
            <button @click="closeModal" class="text-white hover:text-gray-200 text-2xl">
              ✕
            </button>
          </div>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form @submit.prevent="saveItem" class="space-y-6">
            <!-- Campos del formulario existentes -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-3">
                <label class="block text-sm font-semibold text-gray-700">
                  Ejes Temáticos <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.topic_ids"
                  multiple
                  class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                  :class="{ 'border-red-500': formErrors.topic_ids }"
                >
                  <option v-for="topic in catalogos.topics" :key="topic.id" :value="topic.id">
                    {{ topic.name }}
                  </option>
                </select>
                <p v-if="formErrors.topic_ids" class="text-red-500 text-sm">{{ formErrors.topic_ids[0] }}</p>
              </div>

              <div class="space-y-3">
                <label class="block text-sm font-semibold text-gray-700">
                  Componentes <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.component_ids"
                  multiple
                  class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                  :class="{ 'border-red-500': formErrors.component_ids }"
                >
                  <option v-for="component in catalogos.components" :key="component.id" :value="component.id">
                    {{ component.name }}
                  </option>
                </select>
                <p v-if="formErrors.component_ids" class="text-red-500 text-sm">{{ formErrors.component_ids[0] }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-3">
                <label class="block text-sm font-semibold text-gray-700">Estándares</label>
                <select
                  v-model="formData.standard_ids"
                  multiple
                  class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                >
                  <option v-for="standard in catalogos.standards" :key="standard.id" :value="standard.id">
                    {{ standard.name }}
                  </option>
                </select>
              </div>

              <div class="space-y-3">
                <label class="block text-sm font-semibold text-gray-700">Competencias</label>
                <select
                  v-model="formData.competence_ids"
                  multiple
                  class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                >
                  <option v-for="competence in catalogos.competences" :key="competence.id" :value="competence.id">
                    {{ competence.description }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-3">
                <label class="block text-sm font-semibold text-gray-700">Afirmaciones</label>
                <select
                  v-model="formData.affirmation_ids"
                  multiple
                  class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                >
                  <option v-for="affirmation in catalogos.affirmations" :key="affirmation.id" :value="affirmation.id">
                    {{ affirmation.name }}
                  </option>
                </select>
              </div>

              <div class="space-y-3">
                <label class="block text-sm font-semibold text-gray-700">Evidencias</label>
                <select
                  v-model="formData.evidence_ids"
                  multiple
                  class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                >
                  <option v-for="evidence in catalogos.evidences" :key="evidence.id" :value="evidence.id">
                    {{ evidence.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="space-y-3">
              <label class="block text-sm font-semibold text-gray-700">Descripción/Observaciones</label>
              <textarea
                v-model="formData.description"
                rows="4"
                class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                placeholder="Agrega observaciones o descripción adicional..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-3">
                <label class="block text-sm font-semibold text-gray-700">Orden</label>
                <input
                  v-model.number="formData.order"
                  type="number"
                  min="0"
                  class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                >
              </div>

              <div class="space-y-3">
                <label class="block text-sm font-semibold text-gray-700">Estado</label>
                <div class="flex items-center gap-3 mt-2">
                  <input
                    v-model="formData.active"
                    type="checkbox"
                    id="active"
                    class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  >
                  <label for="active" class="text-sm font-medium text-gray-700">Activo</label>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="closeModal"
                class="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold disabled:opacity-50"
              >
                <span v-if="saving">Guardando...</span>
                <span v-else>{{ isEditing ? 'Actualizar' : 'Crear' }} Elemento</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 no-print backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span class="text-white text-2xl">⚠️</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Confirmar Eliminación</h3>
          <p class="text-gray-600 mb-8">
            ¿Estás seguro de que deseas eliminar este elemento curricular? Esta acción no se puede deshacer.
          </p>
          <div class="flex justify-center gap-4">
            <button
              @click="showDeleteModal = false"
              class="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 font-semibold"
            >
              Cancelar
            </button>
            <button
              @click="deleteItem"
              class="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 transition-all duration-300 font-semibold"
            >
              Sí, Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import html2pdf from 'html2pdf.js'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/api'

// Obtener instancia del router
const router = useRouter()

// Datos reactivos
const grades = ref([])
const subjects = ref([])
const mallaItems = ref([])
const selectedGrade = ref(null)
const selectedSubject = ref(null)
const loading = ref(false)
const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(6)
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const itemToDelete = ref(null)
const currentEditingItem = ref(null)

// Nuevo estado para vista detallada
const isDetailedView = ref(false)

// Catálogos para el formulario
const catalogos = ref({
  topics: [],
  components: [],
  standards: [],
  competences: [],
  affirmations: [],
  evidences: []
})

// Datos del formulario
const formData = ref({
  topic_ids: [],
  component_ids: [],
  standard_ids: [],
  competence_ids: [],
  affirmation_ids: [],
  evidence_ids: [],
  description: '',
  order: 0,
  active: true
})

// Errores del formulario
const formErrors = ref({})

// Computed properties
const gradeName = computed(() => grades.value.find(g => g.id === selectedGrade.value)?.name || '')
const subjectName = computed(() => subjects.value.find(s => s.id === selectedSubject.value)?.name || '')

const filteredSubjects = computed(() => {
  if (!selectedGrade.value) return subjects.value
  return subjects.value
})

const filteredMallaItems = computed(() => {
  if (!searchTerm.value) return mallaItems.value
  
  const term = searchTerm.value.toLowerCase()
  return mallaItems.value.filter(item => {
    const searchableText = [
      ...item.topics.map(t => t.name),
      ...item.components.map(c => c.name),
      ...item.standards.map(s => s.name),
      ...item.competences.map(c => c.description),
      ...item.affirmations.map(a => a.name),
      ...item.evidences.map(e => e.name),
      item.description || ''
    ].join(' ').toLowerCase()
    
    return searchableText.includes(term)
  })
})

const activeItemsCount = computed(() => {
  return filteredMallaItems.value.filter(item => item.active).length
})

// Nuevas propiedades computadas para estadísticas
const totalStandards = computed(() => {
  return filteredMallaItems.value.reduce((total, item) => total + item.standards.length, 0)
})

const totalCompetences = computed(() => {
  return filteredMallaItems.value.reduce((total, item) => total + item.competences.length, 0)
})

const totalTopics = computed(() => {
  return filteredMallaItems.value.reduce((total, item) => total + item.topics.length, 0)
})

const totalPages = computed(() => 
  Math.ceil(filteredMallaItems.value.length / itemsPerPage.value)
)

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + parseInt(itemsPerPage.value)
  return filteredMallaItems.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(total, start + 4)
  
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Métodos
const loadCatalogos = async () => {
  try {
    loading.value = true
    const [g, s] = await Promise.all([
      api.get('/grades?per_page=100'),
      api.get('/subjects?per_page=100')
    ])
    grades.value = g.data.data || g.data
    subjects.value = s.data.data || s.data
  } catch (error) {
    console.error('Error loading catalogs:', error)
    showError('Error al cargar los catálogos de grados y asignaturas')
  } finally {
    loading.value = false
  }
}

const loadModalCatalogos = async () => {
  try {
    const endpoints = [
      { key: 'topics', url: '/topics?per_page=100' },
      { key: 'components', url: '/components?per_page=100' },
      { key: 'standards', url: '/standards?per_page=100' },
      { key: 'competences', url: '/competences?per_page=100' },
      { key: 'affirmations', url: '/affirmations-dna-dba?per_page=100' },
      { key: 'evidences', url: '/evidences-dna-dba?per_page=100' }
    ]

    const requests = endpoints.map(endpoint => 
      api.get(endpoint.url).then(response => ({
        key: endpoint.key,
        data: response.data.data || response.data
      }))
    )

    const results = await Promise.all(requests)
    
    results.forEach(result => {
      catalogos.value[result.key] = result.data
    })
  } catch (error) {
    console.error('Error loading modal catalogs:', error)
    showError('Error al cargar los catálogos del formulario')
  }
}

const loadMalla = async () => {
  if (!selectedGrade.value || !selectedSubject.value) {
    mallaItems.value = []
    return
  }
  
  loading.value = true
  try {
    const { data } = await api.get('/curriculum-grid', {
      params: { 
        grade_id: selectedGrade.value, 
        subject_id: selectedSubject.value, 
        per_page: 100 
      }
    })
    mallaItems.value = data.data || data || []
    currentPage.value = 1
    if (mallaItems.value.length > 0) {
      showSuccess(`Malla curricular cargada con ${mallaItems.value.length} elementos`)
    }
  } catch (error) {
    console.error('Error loading curriculum:', error)
    showError('Error al cargar la malla curricular')
    mallaItems.value = []
  } finally {
    loading.value = false
  }
}

const onGradeChange = () => {
  selectedSubject.value = null
  mallaItems.value = []
}

const clearFilters = () => {
  selectedGrade.value = null
  selectedSubject.value = null
  searchTerm.value = ''
  mallaItems.value = []
  isDetailedView.value = false
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const printDocument = () => {
  const element = document.querySelector('.document-container')
  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: `malla-curricular-${gradeName.value}-${subjectName.value}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }
  
  html2pdf().set(opt).from(element).save()
}

const validateForm = () => {
  formErrors.value = {}
  
  if (!formData.value.topic_ids.length) {
    formErrors.value.topic_ids = ['Debe seleccionar al menos un eje temático']
  }
  
  if (!formData.value.component_ids.length) {
    formErrors.value.component_ids = ['Debe seleccionar al menos un componente']
  }
  
  return Object.keys(formErrors.value).length === 0
}

const openCreateModal = async () => {
  isEditing.value = false
  currentEditingItem.value = null
  formData.value = {
    topic_ids: [],
    component_ids: [],
    standard_ids: [],
    competence_ids: [],
    affirmation_ids: [],
    evidence_ids: [],
    description: '',
    order: mallaItems.value.length + 1,
    active: true
  }
  formErrors.value = {}
  
  await loadModalCatalogos()
  showModal.value = true
}

const openEditModal = async (item) => {
  isEditing.value = true
  currentEditingItem.value = item
  formData.value = {
    topic_ids: item.topics.map(t => t.id),
    component_ids: item.components.map(c => c.id),
    standard_ids: item.standards.map(s => s.id),
    competence_ids: item.competences.map(c => c.id),
    affirmation_ids: item.affirmations.map(a => a.id),
    evidence_ids: item.evidences.map(e => e.id),
    description: item.description || '',
    order: item.order || 0,
    active: item.active
  }
  formErrors.value = {}
  
  await loadModalCatalogos()
  showModal.value = true
}

const saveItem = async () => {
  if (!validateForm()) return
  
  saving.value = true
  try {
    const payload = {
      ...formData.value,
      grade_id: selectedGrade.value,
      subject_id: selectedSubject.value
    }
    
    if (isEditing.value) {
      await api.put(`/curriculum-grid/${currentEditingItem.value.id}`, payload)
      showSuccess('Elemento curricular actualizado exitosamente')
    } else {
      await api.post('/curriculum-grid', payload)
      showSuccess('Elemento curricular creado exitosamente')
    }
    
    closeModal()
    await loadMalla()
  } catch (error) {
    console.error('Error saving item:', error)
    showError(`Error al ${isEditing.value ? 'actualizar' : 'crear'} el elemento curricular`)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const deleteItem = async () => {
  if (!itemToDelete.value) return
  
  try {
    await api.delete(`/curriculum-grid/${itemToDelete.value.id}`)
    showSuccess('Elemento curricular eliminado exitosamente')
    showDeleteModal.value = false
    itemToDelete.value = null
    await loadMalla()
  } catch (error) {
    console.error('Error deleting item:', error)
    showError('Error al eliminar el elemento curricular')
  }
}

const toggleItemStatus = async (item) => {
  try {
    const newStatus = !item.active
    await api.put(`/curriculum-grid/${item.id}`, {
      ...item,
      active: newStatus
    })
    
    showSuccess(`Elemento ${newStatus ? 'activado' : 'desactivado'} exitosamente`)
    await loadMalla()
  } catch (error) {
    console.error('Error toggling item status:', error)
    showError('Error al cambiar el estado del elemento')
  }
}

// Nuevo método para alternar vista detallada
const toggleDetailedView = () => {
  isDetailedView.value = !isDetailedView.value
}

// Nuevo método para ir al dashboard
const goToDashboard = () => {
  router.push('/dashboard')
}

const closeModal = () => {
  showModal.value = false
  formErrors.value = {}
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const showSuccess = (message) => {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

const showError = (message) => {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 5000)
}

// Watchers
watch([selectedGrade, selectedSubject], () => {
  if (selectedGrade.value && selectedSubject.value) {
    loadMalla()
  }
})

watch(searchTerm, () => {
  currentPage.value = 1
})

watch(itemsPerPage, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  loadCatalogos()
})
</script>

<style scoped>
/* Estilos mejorados para la visualización de tarjetas */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Status badges mejorados */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-active {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: 2px solid #10b981;
}

.status-inactive {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
  border: 2px solid #6b7280;
}

/* Botones de acción mejorados */
.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-edit {
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
  border-color: #3b82f6;
  color: #1e40af;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.btn-activate {
  background: linear-gradient(135deg, #d1fae5, #ecfdf5);
  border-color: #10b981;
  color: #047857;
}

.btn-activate:hover {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.btn-deactivate {
  background: linear-gradient(135deg, #fef3c7, #fffbeb);
  border-color: #f59e0b;
  color: #d97706;
}

.btn-deactivate:hover {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.btn-delete {
  background: linear-gradient(135deg, #fee2e2, #fef2f2);
  border-color: #ef4444;
  color: #dc2626;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

/* Efectos de hover para tarjetas */
.document-container .bg-white {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.document-container .bg-white:hover {
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Animaciones suaves */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.document-container > * {
  animation: fadeInUp 0.6s ease-out;
}

/* Scrollbar personalizado */
.document-container::-webkit-scrollbar {
  width: 8px;
}

.document-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.document-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border-radius: 4px;
}

.document-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
}

/* Estilos para la vista detallada */
.detailed-view .bg-white {
  transition: all 0.3s ease;
}

.detailed-view .bg-white:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Mejoras de impresión */
@media print {
  .no-print {
    display: none !important;
  }
  
  .document-container {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: none !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
  
  body {
    margin: 0;
    padding: 0;
    background: white !important;
  }
  
  .bg-gradient-to-r {
    background: #f8fafc !important;
  }
  
  .shadow-xl, .shadow-2xl, .shadow-lg {
    box-shadow: none !important;
  }
  
  .border-2 {
    border-width: 1px !important;
  }
  
  .detailed-view .bg-white {
    break-inside: avoid;
    margin-bottom: 1rem;
  }
}

/* Responsive improvements */
@media (max-width: 768px) {
  .grid.grid-cols-1.xl\:grid-cols-2.\32xl\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  .toolbar-title {
    font-size: 1.5rem;
  }
  
  .btn-action span:not(.text-sm) {
    display: none;
  }
  
  .btn-action {
    padding: 0.5rem;
  }
}

/* Loading animation mejorada */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Efectos de glassmorphism para modales */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
</style>