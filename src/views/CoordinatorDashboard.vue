<template>
  <div class="min-h-screen bg-slate-50">
    <AppNavbar @tab="activeTab = $event" />

    <main class="max-w-5xl mx-auto px-6 sm:px-10 py-8 space-y-6">

      <!-- Banner -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white shadow-lg">
        <div class="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div class="relative z-10">
          <h1 class="text-xl font-bold tracking-tight">Panel del Coordinador</h1>
          <p class="text-white/70 text-sm mt-0.5">Gestión de docentes y asignaciones curriculares</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="card p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ teachers.length }}</p>
            <p class="text-xs text-gray-500">Docentes</p>
          </div>
        </div>
        <div class="card p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ totalAssignments }}</p>
            <p class="text-xs text-gray-500">Asignaciones</p>
          </div>
        </div>
        <div class="card p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/></svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ authStore.user?.schools?.length ?? 0 }}</p>
            <p class="text-xs text-gray-500">Colegios</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
          :class="['flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === tab.key ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100']">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon"/>
          </svg>
          <span class="hidden sm:inline">{{ tab.label }}</span>
        </button>
      </div>

      <!-- ══ TAB: DOCENTES ══ -->
      <div v-if="activeTab === 'teachers'">
        <div class="card">
          <div class="card-header flex items-center justify-between">
            <h2 class="font-semibold text-gray-900">Gestión de Docentes</h2>
            <button @click="openCreateTeacher" class="btn-primary btn-sm flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Nuevo Docente
            </button>
          </div>
          <div class="card-body">
            <!-- Loading -->
            <div v-if="loadingTeachers" class="flex items-center justify-center py-10 text-gray-400">
              <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Cargando docentes...
            </div>

            <!-- Empty -->
            <div v-else-if="teachers.length === 0" class="text-center py-10 text-gray-400">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <p class="text-sm">No hay docentes registrados</p>
              <button @click="openCreateTeacher" class="btn-primary btn-sm mt-3">Crear el primer docente</button>
            </div>

            <!-- List -->
            <div v-else class="space-y-3">
              <div v-for="teacher in teachers" :key="teacher.id"
                class="border border-gray-200 rounded-xl overflow-hidden">
                <!-- Teacher header -->
                <div class="flex items-center gap-3 p-4 bg-white">
                  <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                    {{ (teacher.first_name?.[0] || '') + (teacher.last_name?.[0] || '') }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-900 truncate">{{ teacher.first_name }} {{ teacher.last_name }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ teacher.email }}</p>
                  </div>
                  <span class="text-xs text-gray-400 flex-shrink-0">
                    {{ teacher.subjects?.length ?? 0 }} asignación(es)
                  </span>
                  <button @click="toggleTeacher(teacher.id)"
                    class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all flex-shrink-0">
                    <svg class="w-4 h-4 transition-transform" :class="expandedTeachers.has(teacher.id) ? 'rotate-180' : ''"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                </div>

                <!-- Expanded: assignments -->
                <div v-if="expandedTeachers.has(teacher.id)" class="border-t border-gray-100 bg-slate-50 p-4 space-y-3">
                  <!-- Existing assignments -->
                  <div v-if="teacher.subjects?.length > 0" class="flex flex-wrap gap-2">
                    <div v-for="sub in teacher.subjects" :key="sub.id"
                      class="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-sm shadow-sm">
                      <span class="font-medium text-gray-700">{{ sub.grade_name }}</span>
                      <span class="text-gray-400">·</span>
                      <span class="text-gray-600">{{ sub.subject_name }}</span>
                      <button @click="removeAssignment(teacher, sub)"
                        class="ml-1 text-red-400 hover:text-red-600 transition-colors">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  </div>
                  <p v-else class="text-sm text-gray-400">Sin asignaciones de grado/materia aún.</p>

                  <!-- Add assignment form -->
                  <div v-if="addingFor === teacher.id" class="flex flex-wrap gap-2 items-end">
                    <div>
                      <label class="label text-xs">Grado</label>
                      <select v-model="newAssignment.gradeId" class="input text-sm">
                        <option value="">Seleccionar</option>
                        <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="label text-xs">Materia</label>
                      <select v-model="newAssignment.subjectId" class="input text-sm">
                        <option value="">Seleccionar</option>
                        <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
                      </select>
                    </div>
                    <button @click="saveAssignment(teacher)" :disabled="savingAssignment || !newAssignment.gradeId || !newAssignment.subjectId"
                      class="btn-primary btn-sm">
                      <svg v-if="savingAssignment" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Guardar
                    </button>
                    <button @click="addingFor = null" class="btn-secondary btn-sm">Cancelar</button>
                  </div>
                  <button v-else @click="openAddAssignment(teacher.id)"
                    class="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    Agregar grado / materia
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ TAB: USUARIOS ══ -->
      <div v-if="activeTab === 'users'">
        <UserManagement />
      </div>

      <!-- ══ TAB: ASIGNAR MALLAS ══ -->
      <div v-if="activeTab === 'grids'" class="space-y-4">
        <div class="card">
          <div class="card-header">
            <h2 class="font-semibold text-gray-900">Asignar Mallas Curriculares a Docentes</h2>
          </div>
          <div class="card-body space-y-4">
            <!-- Filters -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="label">Grado</label>
                <select v-model="gridFilter.gradeId" class="input text-sm">
                  <option value="">Todos los grados</option>
                  <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
                </select>
              </div>
              <div>
                <label class="label">Materia</label>
                <select v-model="gridFilter.subjectId" class="input text-sm">
                  <option value="">Todas las materias</option>
                  <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
                </select>
              </div>
              <div>
                <label class="label">Período</label>
                <select v-model="gridFilter.period" class="input text-sm">
                  <option value="">Todos los períodos</option>
                  <option value="1">Período 1</option>
                  <option value="2">Período 2</option>
                  <option value="3">Período 3</option>
                  <option value="4">Período 4</option>
                </select>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="loadingGrids" class="flex items-center justify-center py-8 text-gray-400">
              <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Cargando mallas...
            </div>

            <!-- Mallas agrupadas -->
            <div v-else class="space-y-3">
              <div v-for="malla in groupedGrids" :key="malla.key"
                class="border border-gray-200 rounded-xl overflow-hidden">

                <!-- Cabecera de la malla -->
                <div class="flex items-center gap-3 p-4 bg-white">
                  <!-- Expand toggle -->
                  <button @click="toggleMallaDetail(malla.key)"
                    class="text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0">
                    <svg class="w-4 h-4 transition-transform duration-150"
                      :class="expandedMallas.has(malla.key) ? 'rotate-90' : ''"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="badge-blue text-xs">{{ malla.grade_name }}</span>
                      <span class="badge-purple text-xs">{{ malla.subject_name }}</span>
                      <span v-if="malla.period" class="badge-green text-xs">Período {{ malla.period }}</span>
                    </div>
                    <p class="text-xs text-gray-400 mt-1">
                      {{ malla.tree.length }} unidad(es) ·
                      {{ malla.totalEvidences }} evidencia(s)
                    </p>
                  </div>

                  <span class="text-xs text-gray-400 flex-shrink-0">
                    {{ malla.eligibleTeachers.filter(t => t.isAssigned).length }}/{{ malla.eligibleTeachers.length }} docente(s)
                  </span>
                </div>

                <!-- Docentes elegibles con estado de asignación -->
                <div class="border-t border-gray-100 bg-slate-50 px-4 py-3">
                  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Docentes para {{ malla.grade_name }} · {{ malla.subject_name }}
                  </p>

                  <div v-if="malla.eligibleTeachers.length === 0"
                    class="text-xs text-gray-400 italic py-1">
                    Ningún docente tiene asignado este grado y materia.
                    <span class="text-indigo-500 cursor-pointer hover:underline"
                      @click="activeTab = 'teachers'">
                      Ir a Docentes para asignar
                    </span>
                  </div>

                  <div v-else class="flex flex-wrap gap-2">
                    <div v-for="t in malla.eligibleTeachers" :key="t.id"
                      :class="['flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                        t.isAssigned
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-white border-gray-200 text-gray-700']">
                      <!-- Avatar inicial -->
                      <span :class="['w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                        t.isAssigned ? 'bg-emerald-200 text-emerald-700' : 'bg-gray-100 text-gray-500']">
                        {{ (t.first_name?.[0] || '') + (t.last_name?.[0] || '') }}
                      </span>
                      <span>{{ t.first_name }} {{ t.last_name }}</span>

                      <!-- Asignado: check + botón quitar -->
                      <template v-if="t.isAssigned">
                        <svg class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <button @click="quickUnassign(malla, t)"
                          :disabled="t.toggling"
                          class="text-red-400 hover:text-red-600 transition-colors ml-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </template>

                      <!-- No asignado: botón asignar -->
                      <button v-else @click="quickAssign(malla, t)"
                        :disabled="t.toggling"
                        class="ml-1 flex items-center gap-0.5 text-indigo-600 hover:text-indigo-800 transition-colors">
                        <svg v-if="t.toggling" class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        Asignar
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Árbol de detalle (solo lectura) -->
                <div v-if="expandedMallas.has(malla.key)"
                  class="border-t border-gray-100 bg-slate-50 p-4 space-y-2">
                  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Estructura de la malla</p>

                  <div v-for="topic in malla.tree" :key="topic.id" class="rounded-xl overflow-hidden border border-violet-200">
                    <!-- Nivel 1: Unidad -->
                    <div class="px-3 py-2.5 bg-violet-50 flex items-start gap-2">
                      <span class="w-4 h-4 rounded-full bg-violet-500 flex-shrink-0 mt-0.5"></span>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-semibold text-violet-800">{{ topic.name }}</span>
                          <span class="ml-auto text-xs text-violet-400 flex-shrink-0">Unidad Didáctica</span>
                        </div>
                        <p v-if="topic.description" class="text-xs text-violet-600 mt-0.5">{{ topic.description }}</p>
                      </div>
                    </div>

                    <div class="p-2 space-y-1.5">
                      <div v-for="comp in topic.components" :key="comp.id" class="ml-3 rounded-lg overflow-hidden border border-blue-200">
                        <!-- Nivel 2: Componente -->
                        <div class="px-3 py-1.5 bg-blue-50 flex items-start gap-2">
                          <span class="w-3 h-3 rounded-full bg-blue-400 flex-shrink-0 mt-0.5"></span>
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                              <span class="text-sm font-medium text-blue-800">{{ comp.name }}</span>
                              <span class="ml-auto text-xs text-blue-400 flex-shrink-0">Componente</span>
                            </div>
                            <p v-if="comp.description" class="text-xs text-blue-600 mt-0.5">{{ comp.description }}</p>
                          </div>
                        </div>

                        <div class="p-1.5 space-y-1.5">
                          <div v-for="std in comp.standards" :key="std.id" class="ml-3 rounded-lg overflow-hidden border border-emerald-200">
                            <!-- Nivel 3: Estándar -->
                            <div class="px-3 py-1.5 bg-emerald-50 flex items-start gap-2">
                              <span class="w-3 h-3 rounded-full bg-emerald-400 flex-shrink-0 mt-0.5"></span>
                              <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2">
                                  <span class="text-sm text-emerald-800">{{ std.name }}</span>
                                  <span class="ml-auto text-xs text-emerald-400 flex-shrink-0">Estándar</span>
                                </div>
                                <p v-if="std.description" class="text-xs text-emerald-600 mt-0.5">{{ std.description }}</p>
                              </div>
                            </div>

                            <div class="p-1.5 space-y-1.5">
                              <div v-for="comp2 in std.competences" :key="comp2.id" class="ml-3 rounded-lg overflow-hidden border border-amber-200">
                                <!-- Nivel 4: Competencia -->
                                <div class="px-3 py-1.5 bg-amber-50 flex items-start gap-2">
                                  <span class="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0 mt-0.5"></span>
                                  <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2">
                                      <span class="text-xs font-medium text-amber-800">{{ comp2.name || comp2.description }}</span>
                                      <span class="ml-auto text-xs text-amber-400 flex-shrink-0">Competencia</span>
                                    </div>
                                    <p v-if="comp2.name && comp2.description" class="text-xs text-amber-700 mt-0.5">{{ comp2.description }}</p>
                                  </div>
                                </div>

                                <div class="p-1.5 space-y-1">
                                  <div v-for="aff in comp2.affirmations" :key="aff.id" class="ml-3 rounded-lg overflow-hidden border border-orange-200">
                                    <!-- Nivel 5: Aprendizaje -->
                                    <div class="px-3 py-1.5 bg-orange-50 flex items-start gap-2">
                                      <span class="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0 mt-1"></span>
                                      <div class="flex-1 min-w-0">
                                        <div class="flex items-center gap-2">
                                          <span class="text-xs text-orange-800">{{ aff.name }}</span>
                                          <span class="ml-auto text-xs text-orange-400 flex-shrink-0">DNA/DBA</span>
                                        </div>
                                        <p v-if="aff.description" class="text-xs text-orange-600 mt-0.5">{{ aff.description }}</p>
                                      </div>
                                    </div>

                                    <!-- Nivel 6: Evidencias -->
                                    <div class="p-1.5 space-y-1">
                                      <div v-for="ev in aff.evidences" :key="ev.id"
                                        class="ml-3 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2">
                                        <svg class="w-3 h-3 text-rose-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                                        <div class="flex-1 min-w-0">
                                          <div class="flex items-center gap-2">
                                            <span class="text-xs text-rose-800">{{ ev.name }}</span>
                                            <span class="ml-auto text-xs text-rose-400 flex-shrink-0">Evidencia</span>
                                          </div>
                                          <p v-if="ev.description" class="text-xs text-rose-600 mt-0.5">{{ ev.description }}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p v-if="malla.tree.length === 0" class="text-xs text-gray-400 italic">
                    Esta malla no tiene estructura registrada aún.
                  </p>
                </div>
              </div>

              <p v-if="groupedGrids.length === 0" class="text-center py-8 text-sm text-gray-400">
                No hay mallas con esos filtros
              </p>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- ══ MODAL: Crear Docente ══ -->
    <div v-if="showCreateTeacher" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showCreateTeacher = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h3 class="font-semibold text-gray-900">Nuevo Docente</h3>
          <button @click="showCreateTeacher = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Scrollable body -->
        <div class="p-5 space-y-4 overflow-y-auto flex-1">

          <!-- Datos personales -->
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Datos de la cuenta</p>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Nombre <span class="text-red-500">*</span></label>
                  <input v-model="teacherForm.first_name" class="input w-full text-sm" placeholder="Nombres" />
                </div>
                <div>
                  <label class="label">Apellido <span class="text-red-500">*</span></label>
                  <input v-model="teacherForm.last_name" class="input w-full text-sm" placeholder="Apellidos" />
                </div>
              </div>
              <div>
                <label class="label">Correo electrónico <span class="text-red-500">*</span></label>
                <input v-model="teacherForm.email" type="email" class="input w-full text-sm" placeholder="correo@ejemplo.com" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Usuario <span class="text-red-500">*</span></label>
                  <input v-model="teacherForm.username" class="input w-full text-sm" placeholder="nombre.usuario" />
                </div>
                <div>
                  <label class="label">Contraseña <span class="text-red-500">*</span></label>
                  <input v-model="teacherForm.password" type="password" class="input w-full text-sm" placeholder="Mín. 6 caracteres" />
                </div>
              </div>
            </div>
          </div>

          <!-- Asignaciones grado / materia -->
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Grados y Materias</p>

            <!-- Lista de pares ya agregados -->
            <div v-if="teacherForm.subjects.length > 0" class="flex flex-wrap gap-2 mb-3">
              <div v-for="(pair, idx) in teacherForm.subjects" :key="idx"
                class="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-sm">
                <span class="font-medium text-indigo-700">{{ gradeNameById(pair.gradeId) }}</span>
                <span class="text-indigo-400">·</span>
                <span class="text-indigo-600">{{ subjectNameById(pair.subjectId) }}</span>
                <button @click="teacherForm.subjects.splice(idx, 1)"
                  class="ml-1 text-red-400 hover:text-red-600 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <p v-else class="text-xs text-gray-400 mb-3">Sin asignaciones — puedes agregar una o más abajo.</p>

            <!-- Selector rápido -->
            <div class="flex gap-2 items-end flex-wrap">
              <div class="flex-1 min-w-[120px]">
                <label class="label text-xs">Grado</label>
                <select v-model="formNewPair.gradeId" class="input text-sm">
                  <option value="">Seleccionar</option>
                  <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
                </select>
              </div>
              <div class="flex-1 min-w-[120px]">
                <label class="label text-xs">Materia</label>
                <select v-model="formNewPair.subjectId" class="input text-sm">
                  <option value="">Seleccionar</option>
                  <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
                </select>
              </div>
              <button @click="addFormPair"
                :disabled="!formNewPair.gradeId || !formNewPair.subjectId"
                class="btn-secondary btn-sm flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Agregar
              </button>
            </div>
          </div>

          <p v-if="createError" class="text-sm text-red-500">{{ createError }}</p>
        </div>

        <!-- Footer -->
        <div class="p-5 border-t border-gray-100 flex gap-2 justify-end flex-shrink-0">
          <button @click="showCreateTeacher = false" class="btn-secondary btn-sm">Cancelar</button>
          <button @click="createTeacher" :disabled="creatingTeacher || !canCreateTeacher" class="btn-primary btn-sm flex items-center gap-1.5">
            <svg v-if="creatingTeacher" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Crear Docente
          </button>
        </div>
      </div>
    </div>


      <!-- ══ TAB: ESTADÍSTICAS ══ -->
      <div v-if="activeTab === 'stats'" class="space-y-7">

        <!-- Banner header -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 shadow-xl">
          <div class="absolute -top-10 -right-10 w-52 h-52 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-6 left-20 w-48 h-24 bg-violet-500/30 rounded-full blur-2xl pointer-events-none"></div>
          <div class="relative px-8 py-7 flex items-center justify-between gap-6">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/></svg>
                <span class="text-violet-300 text-[11px] font-bold uppercase tracking-[0.15em]">Panel analítico</span>
              </div>
              <h2 class="text-2xl font-black text-white tracking-tight">Estadísticas del Plantel</h2>
              <p class="text-indigo-200 text-sm mt-1.5">Avance y ejecución del cronograma por docente en tu institución</p>
            </div>
            <button @click="loadStatistics" :disabled="loadingStats"
              class="flex items-center gap-2 px-5 py-3 bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl text-sm font-semibold text-white transition-all backdrop-blur-sm flex-shrink-0 shadow-lg">
              <svg class="w-4 h-4" :class="loadingStats ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              {{ loadingStats ? 'Actualizando…' : 'Actualizar datos' }}
            </button>
          </div>
        </div>

        <!-- Skeleton -->
        <div v-if="loadingStats" class="space-y-4">
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div v-for="i in 5" :key="i" class="h-28 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div class="lg:col-span-2 h-72 rounded-2xl bg-gray-100 animate-pulse"></div>
            <div class="lg:col-span-3 h-72 rounded-2xl bg-gray-100 animate-pulse"></div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="!statsData" class="flex flex-col items-center justify-center py-20 gap-4">
          <div class="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center">
            <svg class="w-9 h-9 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/></svg>
          </div>
          <p class="text-gray-500 font-medium">Haz clic en <strong class="text-indigo-600">Actualizar</strong> para cargar las estadísticas del plantel</p>
        </div>

        <template v-else>

          <!-- ── KPI Cards ── -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <template v-for="kpi in [
              { label:'Docentes',         sub:'Con rol de profesor',       val: statsData.totals.teachers,     from:'from-indigo-500', to:'to-indigo-700', border:'border-indigo-100', txt:'text-indigo-600', icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
              { label:'Planificadas',     sub:'Total semanas con plan',     val: statsData.totals.planned,      from:'from-slate-600',  to:'to-slate-800',  border:'border-slate-200', txt:'text-slate-600',  icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { label:'Ejecutadas',       sub:'Tasa: '+statsData.totals.exec_rate+'%', val: statsData.totals.executed,     from:'from-emerald-500',to:'to-emerald-700',border:'border-emerald-100',txt:'text-emerald-600',icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label:'No ejecutadas',    sub:'Con obs: '+statsData.totals.with_obs,    val: statsData.totals.not_executed, from:'from-rose-500',   to:'to-rose-700',   border:'border-rose-100',  txt:'text-rose-600',   icon:'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label:'Reprogramadas',    sub:'Semanas corridas',           val: statsData.totals.rescheduled,  from:'from-violet-500', to:'to-violet-700', border:'border-violet-100',txt:'text-violet-600', icon:'M13 5l7 7-7 7M5 5l7 7-7 7' },
            ]" :key="kpi.label">
              <div class="rounded-2xl overflow-hidden shadow-sm border" :class="kpi.border">
                <div class="px-5 pt-5 pb-4 bg-gradient-to-br" :class="[kpi.from, kpi.to]">
                  <div class="flex items-center justify-between mb-3">
                    <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="kpi.icon"/></svg>
                    </div>
                    <span class="text-white/60 text-[10px] font-bold uppercase tracking-wider">{{ kpi.label }}</span>
                  </div>
                  <p class="text-5xl font-black text-white leading-none">{{ kpi.val }}</p>
                </div>
                <div class="bg-white px-5 py-3">
                  <p class="text-xs font-semibold" :class="kpi.txt">{{ kpi.sub }}</p>
                </div>
              </div>
            </template>
          </div>

          <!-- Sin datos de cronograma -->
          <div v-if="statsData.totals.planned === 0"
            class="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
            <svg class="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <p class="font-medium">Los docentes aún no han planificado semanas en el cronograma.</p>
            <p class="text-sm mt-1">Los gráficos comparativos aparecerán cuando haya datos.</p>
          </div>

          <template v-else>
            <!-- ── Fila 1: Doughnut + Barra horizontal ── -->
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-5">

              <!-- Doughnut -->
              <div class="bg-white rounded-2xl shadow-md border border-gray-100 lg:col-span-2 flex flex-col overflow-hidden">
                <div class="px-6 pt-6 pb-4 border-b border-gray-50">
                  <div class="flex items-center gap-3">
                    <div class="w-1.5 h-7 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500"></div>
                    <div>
                      <h3 class="text-sm font-bold text-gray-900">Distribución global</h3>
                      <p class="text-[11px] text-gray-400 mt-0.5">Total de semanas del plantel</p>
                    </div>
                  </div>
                </div>
                <div class="flex-1 flex items-center justify-center py-6">
                  <div style="width:200px; height:200px; position:relative">
                    <Doughnut v-if="doughnutChartData" :data="doughnutChartData" :options="doughnutChartOpts" />
                    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p class="text-4xl font-black leading-none" :class="rateColor(statsData.totals.exec_rate)">{{ statsData.totals.exec_rate }}%</p>
                      <p class="text-[11px] text-gray-400 font-semibold mt-1">ejecución</p>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
                  <div class="px-4 py-4 text-center">
                    <p class="text-2xl font-black text-emerald-600">{{ statsData.totals.executed }}</p>
                    <p class="text-[10px] text-emerald-500 font-semibold mt-0.5">Ejecutadas</p>
                  </div>
                  <div class="px-4 py-4 text-center">
                    <p class="text-2xl font-black text-rose-500">{{ statsData.totals.not_executed }}</p>
                    <p class="text-[10px] text-rose-400 font-semibold mt-0.5">No ejec.</p>
                  </div>
                  <div class="px-4 py-4 text-center">
                    <p class="text-2xl font-black text-slate-400">{{ Math.max(0, statsData.totals.planned - statsData.totals.executed - statsData.totals.not_executed) }}</p>
                    <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Sin reg.</p>
                  </div>
                </div>
              </div>

              <!-- Barra horizontal por docente -->
              <div class="bg-white rounded-2xl shadow-md border border-gray-100 lg:col-span-3 flex flex-col overflow-hidden">
                <div class="px-6 pt-6 pb-4 border-b border-gray-50">
                  <div class="flex items-center gap-3">
                    <div class="w-1.5 h-7 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500"></div>
                    <div>
                      <h3 class="text-sm font-bold text-gray-900">Tasa de ejecución por docente</h3>
                      <p class="text-[11px] text-gray-400 mt-0.5">Solo docentes con semanas planificadas · ordenado mayor a menor</p>
                    </div>
                  </div>
                </div>
                <div class="flex-1 px-4 py-5">
                  <div v-if="execRateChartData" style="min-height:220px; max-height:340px; height:100%">
                    <Bar :data="execRateChartData" :options="execRateChartOpts" />
                  </div>
                  <div v-else class="flex items-center justify-center h-48 text-gray-200">
                    <svg class="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── Fila 2: Barras apiladas ── -->
            <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div class="px-6 pt-6 pb-4 border-b border-gray-50">
                <div class="flex items-center gap-3">
                  <div class="w-1.5 h-7 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500"></div>
                  <div>
                    <h3 class="text-sm font-bold text-gray-900">Semanas por docente</h3>
                    <p class="text-[11px] text-gray-400 mt-0.5">Comparativa total: ejecutadas · no ejecutadas · sin registrar</p>
                  </div>
                </div>
              </div>
              <div class="px-5 py-5">
                <div v-if="stackedChartData" style="height:260px">
                  <Bar :data="stackedChartData" :options="stackedChartOpts" />
                </div>
              </div>
            </div>
          </template>

          <!-- ── Ranking ── -->
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-1.5 h-7 rounded-full bg-gradient-to-b from-amber-400 to-orange-500"></div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">Ranking de docentes</h3>
                  <p class="text-[11px] text-gray-400 mt-0.5">Clic en columna para ordenar · {{ statsData.per_teacher.length }} docente(s)</p>
                </div>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="bg-slate-50 text-gray-500 font-semibold border-b border-gray-100">
                    <th class="px-5 py-3 text-left w-10">#</th>
                    <th class="px-5 py-3 text-left">Docente</th>
                    <th class="px-5 py-3 text-center cursor-pointer hover:text-slate-800 select-none transition-colors" @click="toggleSort('planned')">
                      <div class="flex items-center justify-center gap-1">Planif. <span class="text-indigo-400">{{ statsSortKey==='planned' ? (statsSortDir==='desc'?'↓':'↑') : '↕' }}</span></div>
                    </th>
                    <th class="px-5 py-3 text-center cursor-pointer hover:text-emerald-700 select-none transition-colors" @click="toggleSort('executed')">
                      <div class="flex items-center justify-center gap-1 text-emerald-600">Ejec. <span>{{ statsSortKey==='executed' ? (statsSortDir==='desc'?'↓':'↑') : '↕' }}</span></div>
                    </th>
                    <th class="px-5 py-3 text-center cursor-pointer hover:text-rose-700 select-none transition-colors" @click="toggleSort('not_executed')">
                      <div class="flex items-center justify-center gap-1 text-rose-500">No ejec. <span>{{ statsSortKey==='not_executed' ? (statsSortDir==='desc'?'↓':'↑') : '↕' }}</span></div>
                    </th>
                    <th class="px-5 py-3 text-center cursor-pointer hover:text-violet-700 select-none transition-colors" @click="toggleSort('rescheduled')">
                      <div class="flex items-center justify-center gap-1 text-violet-500">Corridas <span>{{ statsSortKey==='rescheduled' ? (statsSortDir==='desc'?'↓':'↑') : '↕' }}</span></div>
                    </th>
                    <th class="px-5 py-3 text-center cursor-pointer hover:text-indigo-700 select-none transition-colors min-w-[160px]" @click="toggleSort('exec_rate')">
                      <div class="flex items-center justify-center gap-1 text-indigo-600">Tasa ejec. <span>{{ statsSortKey==='exec_rate' ? (statsSortDir==='desc'?'↓':'↑') : '↕' }}</span></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="sortedTeachers.length === 0">
                    <td colspan="7" class="px-5 py-10 text-center text-gray-400">No hay datos de cronograma registrados</td>
                  </tr>
                  <tr v-for="(t, i) in sortedTeachers" :key="t.teacher_id"
                    class="border-b border-gray-50 transition-colors"
                    :class="[
                      t.planned === 0 ? 'opacity-40' : 'hover:bg-indigo-50/30',
                      i === 0 ? 'bg-amber-50/40' : i === 1 ? 'bg-slate-50/60' : i === 2 ? 'bg-orange-50/30' : ''
                    ]">
                    <td class="px-5 py-3.5 font-bold text-base">
                      <span v-if="i===0">🥇</span><span v-else-if="i===1">🥈</span><span v-else-if="i===2">🥉</span>
                      <span v-else class="text-gray-400 text-sm">{{ i+1 }}</span>
                    </td>
                    <td class="px-5 py-3.5">
                      <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                          :class="i===0?'bg-amber-400':i===1?'bg-slate-400':i===2?'bg-orange-400':'bg-indigo-400'">
                          {{ t.teacher_name.charAt(0) }}
                        </div>
                        <span class="font-semibold text-gray-800 whitespace-nowrap">{{ t.teacher_name }}</span>
                      </div>
                    </td>
                    <td class="px-5 py-3.5 text-center">
                      <span class="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">{{ t.planned }}</span>
                    </td>
                    <td class="px-5 py-3.5 text-center">
                      <span class="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-bold">{{ t.executed }}</span>
                    </td>
                    <td class="px-5 py-3.5 text-center">
                      <span class="px-2 py-1 rounded-lg font-bold" :class="t.not_executed > 0 ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-400'">{{ t.not_executed }}</span>
                    </td>
                    <td class="px-5 py-3.5 text-center">
                      <span class="px-2 py-1 rounded-lg font-bold" :class="t.rescheduled > 0 ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-400'">{{ t.rescheduled }}</span>
                    </td>
                    <td class="px-5 py-3.5">
                      <div class="flex items-center gap-3">
                        <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div class="h-full rounded-full transition-all shadow-sm"
                            :class="rateBg(t.exec_rate)"
                            :style="{ width: t.exec_rate + '%' }">
                          </div>
                        </div>
                        <span class="font-black text-sm w-12 text-right" :class="rateColor(t.exec_rate)">{{ t.exec_rate }}%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ── Desglose por malla ── -->
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-100">
              <div class="flex flex-wrap items-center gap-4">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div class="w-1.5 h-7 rounded-full bg-gradient-to-b from-indigo-400 to-blue-500"></div>
                  <div>
                    <h3 class="text-sm font-bold text-gray-900">Desglose por malla</h3>
                    <p class="text-[11px] text-gray-400 mt-0.5">Avance individual · {{ filteredMalla.length }} malla(s)</p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-2">
                  <select v-model="statsFilter.grade_id" class="input text-xs py-1.5 w-32">
                    <option value="">Todos los grados</option>
                    <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
                  </select>
                  <select v-model="statsFilter.subject_id" class="input text-xs py-1.5 w-36">
                    <option value="">Todas las materias</option>
                    <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                  <select v-model="statsFilter.period" class="input text-xs py-1.5 w-28">
                    <option value="">Todos los períodos</option>
                    <option value="1">Período 1</option><option value="2">Período 2</option>
                    <option value="3">Período 3</option><option value="4">Período 4</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="bg-slate-50 text-gray-500 font-semibold border-b border-gray-100">
                    <th class="px-5 py-3 text-left">Docente</th>
                    <th class="px-5 py-3 text-left">Grado · Materia</th>
                    <th class="px-5 py-3 text-center">Per.</th>
                    <th class="px-5 py-3 text-center">Plan.</th>
                    <th class="px-5 py-3 text-center text-emerald-600">Ejec.</th>
                    <th class="px-5 py-3 text-center text-rose-500">No ejec.</th>
                    <th class="px-5 py-3 text-left min-w-[200px]">Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredMalla.length === 0">
                    <td colspan="7" class="px-5 py-10 text-center text-gray-400">Sin datos con los filtros actuales</td>
                  </tr>
                  <tr v-for="(m, idx) in filteredMalla" :key="`${m.teacher_id}-${m.grade_id}-${m.subject_id}-${m.period}`"
                    class="border-b border-gray-50 hover:bg-indigo-50/20 transition-colors">
                    <td class="px-5 py-3 font-semibold text-gray-800 whitespace-nowrap">{{ m.teacher_name }}</td>
                    <td class="px-5 py-3 whitespace-nowrap">
                      <span class="text-gray-700 font-medium">{{ m.grade_name }}</span>
                      <span class="text-gray-400 mx-1">·</span>
                      <span class="text-gray-600">{{ m.subject_name }}</span>
                    </td>
                    <td class="px-5 py-3 text-center">
                      <span v-if="m.period" class="px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 font-bold text-[10px]">P{{ m.period }}</span>
                      <span v-else class="text-gray-300">—</span>
                    </td>
                    <td class="px-5 py-3 text-center font-semibold text-slate-600">{{ m.planned }}</td>
                    <td class="px-5 py-3 text-center">
                      <span class="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-bold">{{ m.executed }}</span>
                    </td>
                    <td class="px-5 py-3 text-center">
                      <span class="px-2 py-1 rounded-lg font-bold" :class="m.not_executed > 0 ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-400'">{{ m.not_executed }}</span>
                    </td>
                    <td class="px-5 py-3">
                      <div class="flex items-center gap-2.5">
                        <div class="flex-1 h-3 rounded-full overflow-hidden bg-gray-100 shadow-inner flex">
                          <div class="bg-emerald-500 h-full transition-all" :style="{ width: (m.planned > 0 ? m.executed/m.planned*100 : 0)+'%' }"></div>
                          <div class="bg-rose-400 h-full transition-all" :style="{ width: (m.planned > 0 ? m.not_executed/m.planned*100 : 0)+'%' }"></div>
                        </div>
                        <span class="font-black text-sm w-11 text-right" :class="rateColor(m.exec_rate)">{{ m.exec_rate }}%</span>
                      </div>
                      <div class="flex gap-3 mt-1.5 text-[10px] text-gray-400">
                        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>Ejec.</span>
                        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-rose-400 inline-block"></span>No ejec.</span>
                        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-gray-200 inline-block"></span>Sin reg.</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </template>
      </div>
      <!-- ══ /TAB: ESTADÍSTICAS ══ -->

      <!-- ══ TAB: PLANTEL ══ -->
      <div v-if="activeTab === 'monitor'" class="space-y-5">

        <!-- Selector de docente -->
        <div class="card p-4 flex flex-wrap items-center gap-3">
          <svg class="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <label class="text-sm font-semibold text-gray-700">Seleccionar docente:</label>
          <select class="input text-sm flex-1 max-w-xs" :value="monitorTeacherId" @change="e => loadMonitorTeacher(e.target.value || null)">
            <option value="">-- Elige un docente --</option>
            <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.first_name }} {{ t.last_name }}</option>
          </select>
          <div v-if="loadingMonitor" class="flex items-center gap-1.5 text-xs text-gray-400">
            <svg class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Cargando...
          </div>
          <div v-if="monitorTeacherId && !loadingMonitor" class="ml-auto text-xs text-gray-500">
            <span class="font-semibold text-indigo-600">{{ monitorGroupedMallas.length }}</span> malla(s) asignada(s)
          </div>
        </div>

        <!-- Sin docente seleccionado -->
        <div v-if="!monitorTeacherId" class="card p-12 text-center text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <p class="text-sm">Selecciona un docente para ver su malla personalizada y cronograma</p>
        </div>

        <!-- Mallas del docente seleccionado -->
        <template v-else-if="!loadingMonitor">
          <div v-if="monitorGroupedMallas.length === 0" class="card p-8 text-center text-gray-400 text-sm">
            Este docente no tiene mallas asignadas.
          </div>

          <div v-for="malla in monitorGroupedMallas" :key="malla.key" class="card overflow-hidden">
            <!-- Card header -->
            <div class="px-5 py-3.5 border-b border-gray-100 flex flex-wrap items-center gap-3">
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 text-sm">{{ malla.grade_name }} · {{ malla.subject_name }}</p>
                <p class="text-xs text-gray-500 mt-0.5">
                  <span v-if="malla.period" class="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-medium mr-1.5">Período {{ malla.period }}</span>
                  <span class="text-gray-400">{{ Object.keys(malla.schedMap).length }} elemento(s) con semanas planificadas</span>
                </p>
              </div>
              <!-- Sub-tabs -->
              <div class="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-semibold">
                <button @click="setCardView(malla.key, 'tree')"
                  class="px-3 py-1.5 transition-colors"
                  :class="getCardView(malla.key) === 'tree' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'">
                  Árbol
                </button>
                <button @click="setCardView(malla.key, 'schedule')"
                  class="px-3 py-1.5 border-l border-gray-200 transition-colors"
                  :class="getCardView(malla.key) === 'schedule' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'">
                  Cronograma
                </button>
              </div>
            </div>

            <!-- ─── Vista: Árbol ─── -->
            <div v-if="getCardView(malla.key) === 'tree'" class="p-4 space-y-2 max-h-[60vh] overflow-y-auto bg-slate-50">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Malla personalizada del docente
                <span class="ml-2 font-normal text-amber-600 normal-case">— elementos en ámbar fueron añadidos por el docente</span>
              </p>
              <div v-if="!malla.tree.length" class="text-center py-6 text-gray-400 text-sm">Sin contenido en el árbol.</div>

              <div v-for="topic in malla.tree" :key="topic.id" class="rounded-xl overflow-hidden"
                :class="topic.isExtra ? 'border-2 border-amber-400' : 'border border-indigo-200'">
                <div class="px-4 py-2.5 flex items-start gap-2" :class="topic.isExtra ? 'bg-amber-50' : 'bg-indigo-50'">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-[10px] font-bold uppercase tracking-wide" :class="topic.isExtra ? 'text-amber-600' : 'text-indigo-600'">Unidad Temática</span>
                      <span v-if="topic.isExtra" class="px-1.5 py-0.5 bg-amber-400 text-white text-[10px] font-bold rounded">Añadido por docente</span>
                    </div>
                    <p class="text-sm font-semibold mt-0.5" :class="topic.isExtra ? 'text-amber-900' : 'text-indigo-900'">{{ topic.name }}</p>
                    <p v-if="topic.description" class="text-xs mt-0.5 leading-snug" :class="topic.isExtra ? 'text-amber-700' : 'text-indigo-600'">{{ topic.description }}</p>
                  </div>
                </div>
                <div v-if="topic.components.length" class="p-3 space-y-2">
                  <div v-for="comp in topic.components" :key="comp.id" class="rounded-lg overflow-hidden" :class="comp.isExtra ? 'border-2 border-amber-300' : 'border border-emerald-200'">
                    <div class="px-3 py-1.5" :class="comp.isExtra ? 'bg-amber-50' : 'bg-emerald-50'">
                      <div class="flex items-center gap-1.5"><span class="text-[10px] font-bold uppercase" :class="comp.isExtra?'text-amber-600':'text-emerald-600'">Componente</span><span v-if="comp.isExtra" class="px-1 py-0.5 bg-amber-400 text-white text-[9px] font-bold rounded">+</span></div>
                      <p class="text-xs font-semibold mt-0.5" :class="comp.isExtra?'text-amber-900':'text-emerald-900'">{{ comp.name }}</p>
                      <p v-if="comp.description" class="text-xs mt-0.5 leading-snug" :class="comp.isExtra?'text-amber-700':'text-emerald-700'">{{ comp.description }}</p>
                    </div>
                    <div class="p-2 space-y-1.5">
                      <div v-for="std in comp.standards" :key="std.id" class="rounded-lg overflow-hidden" :class="std.isExtra ? 'border-2 border-amber-300' : 'border border-amber-200'">
                        <div class="px-3 py-1.5" :class="std.isExtra?'bg-amber-50':'bg-amber-50'">
                          <div class="flex items-center gap-1.5"><span class="text-[10px] font-bold uppercase" :class="std.isExtra?'text-amber-700':'text-amber-600'">Estándar</span><span v-if="std.isExtra" class="px-1 py-0.5 bg-amber-400 text-white text-[9px] font-bold rounded">+</span></div>
                          <p class="text-xs mt-0.5" :class="std.isExtra?'text-amber-900 font-semibold':'text-amber-900'">{{ std.name }}</p>
                          <p v-if="std.description" class="text-xs mt-0.5 text-amber-700 leading-snug">{{ std.description }}</p>
                        </div>
                        <div class="p-1.5 space-y-1.5">
                          <div v-for="comp2 in std.competences" :key="comp2.id" class="rounded-lg overflow-hidden" :class="comp2.isExtra?'border-2 border-amber-300':'border border-violet-200'">
                            <div class="px-3 py-1.5" :class="comp2.isExtra?'bg-amber-50':'bg-violet-50'">
                              <div class="flex items-center gap-1.5"><span class="text-[10px] font-bold uppercase" :class="comp2.isExtra?'text-amber-600':'text-violet-600'">Competencia</span><span v-if="comp2.isExtra" class="px-1 py-0.5 bg-amber-400 text-white text-[9px] font-bold rounded">+</span></div>
                              <p v-if="comp2.name" class="text-xs font-semibold mt-0.5" :class="comp2.isExtra?'text-amber-900':'text-violet-900'">{{ comp2.name }}</p>
                              <p class="text-xs mt-0.5 leading-snug" :class="comp2.isExtra?'text-amber-800':'text-violet-800'">{{ comp2.description }}</p>
                            </div>
                            <div class="p-1.5 space-y-1.5">
                              <div v-for="aff in comp2.affirmations" :key="aff.id" class="rounded-lg overflow-hidden" :class="aff.isExtra?'border-2 border-amber-300':'border border-pink-200'">
                                <div class="px-3 py-1.5" :class="aff.isExtra?'bg-amber-50':'bg-pink-50'">
                                  <div class="flex items-center gap-1.5"><span class="text-[10px] font-bold uppercase" :class="aff.isExtra?'text-amber-600':'text-pink-600'">DBA/DNA</span><span v-if="aff.isExtra" class="px-1 py-0.5 bg-amber-400 text-white text-[9px] font-bold rounded">+</span></div>
                                  <p class="text-xs font-semibold mt-0.5" :class="aff.isExtra?'text-amber-900':'text-pink-900'">{{ aff.name }}</p>
                                  <p v-if="aff.description" class="text-xs mt-0.5 leading-snug" :class="aff.isExtra?'text-amber-700':'text-pink-700'">{{ aff.description }}</p>
                                </div>
                                <div class="p-1.5 space-y-1">
                                  <div v-for="ev in aff.evidences" :key="ev.id"
                                    class="px-3 py-1.5 rounded-lg flex items-start gap-2"
                                    :class="ev.isExtra?'bg-amber-50 border-2 border-amber-300':'bg-gray-50 border border-gray-200'">
                                    <svg class="w-3 h-3 flex-shrink-0 mt-0.5" :class="ev.isExtra?'text-amber-400':'text-rose-400'" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                                    <div>
                                      <div class="flex items-center gap-1"><span class="text-[10px] font-bold uppercase" :class="ev.isExtra?'text-amber-600':'text-rose-500'">Evidencia</span><span v-if="ev.isExtra" class="px-1 py-0.5 bg-amber-400 text-white text-[9px] font-bold rounded">+</span></div>
                                      <p class="text-xs mt-0.5" :class="ev.isExtra?'text-amber-900':'text-gray-800'">{{ ev.name }}</p>
                                      <p v-if="ev.description" class="text-xs mt-0.5" :class="ev.isExtra?'text-amber-700':'text-gray-500'">{{ ev.description }}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ─── Vista: Cronograma (Gantt read-only) ─── -->
            <div v-else-if="getCardView(malla.key) === 'schedule'" class="overflow-auto max-h-[60vh]">
              <div v-if="Object.keys(malla.schedMap).length === 0" class="p-8 text-center text-gray-400 text-sm">
                Este docente no ha planificado semanas para esta malla.
              </div>
              <table v-else class="border-collapse" style="min-width: max-content">
                <thead class="sticky top-0 z-10 bg-slate-100">
                  <tr>
                    <th class="sticky left-0 z-20 bg-slate-100 border-b border-r-2 border-gray-300 px-4 py-2 text-left min-w-[13rem] text-xs font-semibold text-gray-500">Elemento</th>
                    <template v-for="blk in Math.ceil(Math.max(...Object.values(malla.schedMap).flat(), 4) / 4)" :key="blk">
                      <th :colspan="4" class="border-b border-r-2 border-gray-300 text-center py-1.5">
                        <span class="text-[10px] font-semibold text-gray-500">Bloque {{ blk }}</span>
                      </th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="node in flattenTree(malla.tree)" :key="`${node.type}:${node.id}`">
                    <tr v-if="malla.schedMap[`${node.type}:${node.id}`]?.length" class="border-b border-gray-100 hover:bg-slate-50/60">
                      <td class="sticky left-0 bg-white border-r-2 border-gray-200 z-10 py-2"
                        :style="{ paddingLeft: `${node.depth * 14 + 12}px`, paddingRight: '12px' }">
                        <div class="flex items-center gap-2" style="max-width: 190px">
                          <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :class="monNodeDotClass(node)"></span>
                          <div class="min-w-0">
                            <p class="text-xs font-medium truncate" :class="node.isExtra ? 'text-amber-800' : 'text-gray-800'">
                              {{ node.name }}<span v-if="node.isExtra" class="text-[9px] text-amber-500 ml-0.5">+</span>
                            </p>
                            <p class="text-[10px] leading-none mt-0.5" :class="node.isExtra ? 'text-amber-500' : 'text-gray-400'">{{ nodeTypeNames[node.type] }}</p>
                          </div>
                        </div>
                      </td>
                      <template v-for="blk in Math.ceil(Math.max(...Object.values(malla.schedMap).flat(), 4) / 4)" :key="blk">
                        <td v-for="w in 4" :key="w"
                          class="border-r border-slate-100 p-0"
                          :class="(blk - 1) * 4 + w === Math.max(...Object.values(malla.schedMap).flat(), 4) || w === 4 ? 'border-r-2 border-r-slate-200' : ''"
                          style="width: 1.875rem; min-width: 1.875rem; height: 2.25rem">
                          <div class="w-full h-full flex items-center justify-center">
                            <div v-if="malla.schedMap[`${node.type}:${node.id}`]?.includes((blk - 1) * 4 + w)"
                              class="rounded-sm" :class="monCellClass(node)" style="width: 1.25rem; height: 1.25rem"></div>
                            <div v-else class="rounded-sm bg-slate-100" style="width: 1.25rem; height: 1.25rem"></div>
                          </div>
                        </td>
                      </template>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <!-- ── Observaciones del Plantel ── -->
        <div class="card overflow-hidden">
          <div class="px-5 py-3.5 border-b border-gray-100 flex flex-wrap items-center gap-3">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 text-sm">Observaciones del Plantel</h3>
              <p class="text-xs text-gray-500 mt-0.5">Justificaciones y seguimiento de todos los docentes del colegio</p>
            </div>
            <button @click="loadSchoolObservations" class="btn-secondary btn-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Actualizar
            </button>
          </div>

          <!-- Filters -->
          <div class="px-5 py-3 bg-slate-50 border-b border-gray-100 flex flex-wrap gap-2">
            <select v-model="obsFilter.teacher_id" class="input text-xs py-1.5 w-40">
              <option value="">Todos los docentes</option>
              <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.first_name }} {{ t.last_name }}</option>
            </select>
            <select v-model="obsFilter.grade_id" class="input text-xs py-1.5 w-36">
              <option value="">Todos los grados</option>
              <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
            <select v-model="obsFilter.subject_id" class="input text-xs py-1.5 w-40">
              <option value="">Todas las materias</option>
              <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
            <select v-model="obsFilter.period" class="input text-xs py-1.5 w-28">
              <option value="">Todos los períodos</option>
              <option value="1">Período 1</option>
              <option value="2">Período 2</option>
              <option value="3">Período 3</option>
              <option value="4">Período 4</option>
            </select>
            <select v-model="obsFilter.executed" class="input text-xs py-1.5 w-36">
              <option value="">Todas</option>
              <option value="false">No ejecutadas</option>
              <option value="true">Ejecutadas</option>
            </select>
            <span class="ml-auto text-xs text-gray-400 self-center">{{ filteredObs.length }} registro(s)</span>
          </div>

          <!-- Loading -->
          <div v-if="loadingObs" class="p-8 text-center">
            <svg class="animate-spin w-5 h-5 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          </div>

          <!-- Empty state (not loaded yet) -->
          <div v-else-if="monitorObs.length === 0" class="p-8 text-center text-gray-400 text-sm">
            <svg class="w-10 h-10 mx-auto mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Haz clic en <strong>Actualizar</strong> para cargar las observaciones del plantel.
          </div>

          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead class="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th class="px-3 py-2 text-left font-semibold text-gray-500">Docente</th>
                  <th class="px-3 py-2 text-left font-semibold text-gray-500">Grado · Materia</th>
                  <th class="px-3 py-2 text-center font-semibold text-gray-500">Per.</th>
                  <th class="px-3 py-2 text-left font-semibold text-gray-500">Tipo</th>
                  <th class="px-3 py-2 text-center font-semibold text-gray-500">Sem.</th>
                  <th class="px-3 py-2 text-center font-semibold text-gray-500">Estado</th>
                  <th class="px-3 py-2 text-left font-semibold text-gray-500">Observación / Justificación</th>
                  <th class="px-3 py-2 text-center font-semibold text-gray-500">Corrida a</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-if="filteredObs.length === 0">
                  <td colspan="8" class="px-4 py-6 text-center text-gray-400">Sin resultados con los filtros actuales</td>
                </tr>
                <tr v-for="obs in filteredObs" :key="obs.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-3 py-2.5 font-medium text-gray-800 whitespace-nowrap">{{ obs.teacher_name }}</td>
                  <td class="px-3 py-2.5 text-gray-600 whitespace-nowrap">{{ obs.grade_name }} · {{ obs.subject_name }}</td>
                  <td class="px-3 py-2.5 text-center text-gray-500">{{ obs.period ?? '—' }}</td>
                  <td class="px-3 py-2.5 text-gray-600">{{ nodeTypeNames[obs.node_type] || obs.node_type }}</td>
                  <td class="px-3 py-2.5 text-center">
                    <span class="px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-600">S{{ obs.week }}</span>
                  </td>
                  <td class="px-3 py-2.5 text-center">
                    <span v-if="obs.executed" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                      Ejecutada
                    </span>
                    <span v-else class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 font-semibold">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                      No ejecutada
                    </span>
                  </td>
                  <td class="px-3 py-2.5 text-gray-700 max-w-[260px]">
                    <p v-if="obs.observation" class="leading-snug line-clamp-2" :title="obs.observation">{{ obs.observation }}</p>
                    <p v-else class="text-gray-400 italic">—</p>
                  </td>
                  <td class="px-3 py-2.5 text-center">
                    <span v-if="obs.rescheduled_week" class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                      S{{ obs.rescheduled_week }}
                    </span>
                    <span v-else class="text-gray-400">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <!-- ══ /TAB: PLANTEL ══ -->

    <!-- Toast -->
    <div v-if="toast.show" :class="['fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all',
      toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500']">
      {{ toast.message }}
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppNavbar from '@/components/AppNavbar.vue'
import UserManagement from '@/views/UserManagement.vue'
import { teacherSubjectService } from '@/api/teacherSubjectService'
import { userService, roleService } from '@/api/userService'
import { curriculumGridService } from '@/api/curriculumGridService'
import { gradeService, subjectService } from '@/api/curriculumService'
import { coordinatorMonitorService } from '@/api/coordinatorMonitorService'
import api from '@/api/api'

// Chart.js
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement)

const authStore = useAuthStore()

const tabs = [
  { key: 'teachers', label: 'Docentes',      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { key: 'users',    label: 'Usuarios',       icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { key: 'grids',    label: 'Asignar Mallas', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { key: 'monitor',  label: 'Plantel',        icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { key: 'stats',    label: 'Estadísticas',   icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' },
]

const activeTab = ref('teachers')

// ── Data ──────────────────────────────────────────────────────────────
const teachers       = ref([])
const grades         = ref([])
const subjects       = ref([])
const grids          = ref([])
const gridTeachers   = ref({})
const loadingTeachers = ref(false)
const loadingGrids   = ref(false)

const totalAssignments = computed(() => teachers.value.reduce((acc, t) => acc + (t.subjects?.length ?? 0), 0))

// ── Teacher expand ─────────────────────────────────────────────────────
const expandedTeachers = ref(new Set())
const toggleTeacher = (id) => {
  if (expandedTeachers.value.has(id)) expandedTeachers.value.delete(id)
  else expandedTeachers.value.add(id)
}

// ── Add assignment ─────────────────────────────────────────────────────
const addingFor      = ref(null)
const savingAssignment = ref(false)
const newAssignment  = ref({ gradeId: '', subjectId: '' })

function openAddAssignment(teacherId) {
  addingFor.value = teacherId
  newAssignment.value = { gradeId: '', subjectId: '' }
}

async function saveAssignment(teacher) {
  if (!newAssignment.value.gradeId || !newAssignment.value.subjectId) return
  savingAssignment.value = true
  try {
    const schoolId = authStore.user?.schools?.[0]?.id ?? null
    const res = await teacherSubjectService.assign({
      teacher_id: teacher.id,
      grade_id:   newAssignment.value.gradeId,
      subject_id: newAssignment.value.subjectId,
      school_id:  schoolId,
    })
    // Actualizar reactivamente el docente en la lista
    const idx = teachers.value.findIndex(t => t.id === teacher.id)
    if (idx !== -1) {
      teachers.value[idx].subjects = [
        ...(teachers.value[idx].subjects ?? []),
        { id: res.id, grade_id: res.grade_id, subject_id: res.subject_id,
          grade_name: res.grade_name, subject_name: res.subject_name },
      ]
    }
    addingFor.value = null
    showToast('Asignación guardada')
  } catch (e) {
    showToast(e?.response?.data?.message || 'Error al guardar', 'error')
  } finally {
    savingAssignment.value = false
  }
}

async function removeAssignment(teacher, sub) {
  if (!confirm(`¿Quitar ${sub.grade_name} · ${sub.subject_name} de este docente?`)) return
  try {
    await teacherSubjectService.remove(sub.id)
    const idx = teachers.value.findIndex(t => t.id === teacher.id)
    if (idx !== -1) {
      teachers.value[idx].subjects = teachers.value[idx].subjects.filter(s => s.id !== sub.id)
    }
    showToast('Asignación eliminada')
  } catch {
    showToast('Error al eliminar', 'error')
  }
}

// ── Create teacher ─────────────────────────────────────────────────────
const showCreateTeacher = ref(false)
const creatingTeacher   = ref(false)
const createError       = ref('')

const emptyTeacherForm = () => ({
  first_name: '', last_name: '', email: '', username: '', password: '', subjects: []
})
const teacherForm = ref(emptyTeacherForm())

const canCreateTeacher = computed(() =>
  teacherForm.value.first_name && teacherForm.value.last_name &&
  teacherForm.value.email && teacherForm.value.username && teacherForm.value.password.length >= 6
)

// Pair being built in the modal
const formNewPair = ref({ gradeId: '', subjectId: '' })

function gradeNameById(id)   { return grades.value.find(g => g.id == id)?.name ?? id }
function subjectNameById(id) { return subjects.value.find(s => s.id == id)?.name ?? id }

function addFormPair() {
  const { gradeId, subjectId } = formNewPair.value
  if (!gradeId || !subjectId) return
  const already = teacherForm.value.subjects.some(p => p.gradeId == gradeId && p.subjectId == subjectId)
  if (!already) teacherForm.value.subjects.push({ gradeId, subjectId })
  formNewPair.value = { gradeId: '', subjectId: '' }
}

function openCreateTeacher() {
  teacherForm.value = emptyTeacherForm()
  formNewPair.value = { gradeId: '', subjectId: '' }
  createError.value = ''
  showCreateTeacher.value = true
}

async function createTeacher() {
  creatingTeacher.value = true
  createError.value = ''
  try {
    const allRoles = await roleService.getAll()
    const rolesList = Array.isArray(allRoles?.data) ? allRoles.data : (allRoles?.data?.data ?? allRoles ?? [])
    const profesorRole = rolesList.find(r => r.name === 'profesor')
    if (!profesorRole) throw new Error('Rol profesor no encontrado')

    const schoolIds = authStore.user?.schools?.map(s => s.id) ?? []
    const { subjects: pairs, ...accountData } = teacherForm.value
    const newUser = await userService.create({
      ...accountData,
      roles:      [profesorRole.id],
      school_ids: schoolIds,
    })
    const u = newUser?.data ?? newUser

    // Save grade/subject assignments
    const schoolId = schoolIds[0] ?? null
    const savedPairs = []
    for (const pair of pairs) {
      try {
        const res = await teacherSubjectService.assign({
          teacher_id: u.id,
          grade_id:   pair.gradeId,
          subject_id: pair.subjectId,
          school_id:  schoolId,
        })
        savedPairs.push({
          id: res.id, grade_id: res.grade_id, subject_id: res.subject_id,
          grade_name: res.grade_name, subject_name: res.subject_name,
        })
      } catch { /* skip duplicate or error */ }
    }

    teachers.value.push({
      id: u.id, first_name: u.first_name, last_name: u.last_name,
      email: u.email, username: u.username,
      subjects: savedPairs,
    })
    showCreateTeacher.value = false
    showToast('Docente creado correctamente')
  } catch (e) {
    createError.value = e?.response?.data?.message || e.message || 'Error al crear docente'
  } finally {
    creatingTeacher.value = false
  }
}

// ── Grid assign ────────────────────────────────────────────────────────
const gridFilter = ref({ gradeId: '', subjectId: '', period: '' })

const filteredGrids = computed(() => grids.value.filter(g => {
  if (gridFilter.value.gradeId   && String(g.grade_id)   !== String(gridFilter.value.gradeId))   return false
  if (gridFilter.value.subjectId && String(g.subject_id) !== String(gridFilter.value.subjectId)) return false
  if (gridFilter.value.period    && String(g.period)     !== String(gridFilter.value.period))    return false
  return true
}))

// Reconstruye árbol jerárquico desde los registros planos de una malla
function buildMallaTree(records) {
  const topicMap = new Map()
  for (const rec of records) {
    for (const topic of (rec.topics || [])) {
      if (!topicMap.has(topic.id)) topicMap.set(topic.id, { ...topic, components: [] })
      const tNode = topicMap.get(topic.id)

      for (const comp of (rec.components || [])) {
        let cNode = tNode.components.find(c => c.id === comp.id)
        if (!cNode) { cNode = { ...comp, standards: [] }; tNode.components.push(cNode) }

        for (const std of (rec.standards || [])) {
          let sNode = cNode.standards.find(s => s.id === std.id)
          if (!sNode) { sNode = { ...std, competences: [] }; cNode.standards.push(sNode) }

          for (const competence of (rec.competences || [])) {
            let cpNode = sNode.competences.find(c => c.id === competence.id)
            if (!cpNode) { cpNode = { ...competence, affirmations: [] }; sNode.competences.push(cpNode) }

            for (const aff of (rec.affirmations || [])) {
              let aNode = cpNode.affirmations.find(a => a.id === aff.id)
              if (!aNode) { aNode = { ...aff, evidences: [] }; cpNode.affirmations.push(aNode) }

              for (const ev of (rec.evidences || [])) {
                if (!aNode.evidences.some(e => e.id === ev.id)) aNode.evidences.push(ev)
              }
            }
          }
        }
      }
    }
  }
  return [...topicMap.values()]
}

// Agrupa las mallas por grade+subject+period y cruza con docentes elegibles
const groupedGrids = computed(() => {
  const groups = new Map()
  for (const g of filteredGrids.value) {
    const key = `${g.grade_id}-${g.subject_id}-${g.period ?? 'null'}`
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        grade_id: g.grade_id, subject_id: g.subject_id, period: g.period,
        grade_name: g.grade_name, subject_name: g.subject_name,
        records: [],
      })
    }
    groups.get(key).records.push(g)
  }

  return [...groups.values()].map(group => {
    // Docentes asignados (de todos los registros del grupo, deduplicados)
    const assignedMap = new Map(
      group.records.flatMap(r => (gridTeachers.value[r.id] ?? []).map(t => [t.user_id, t]))
    )

    // Docentes elegibles: tienen este grado+materia en teacher_subject
    const eligible = teachers.value
      .filter(t => t.subjects?.some(s =>
        String(s.grade_id)   === String(group.grade_id) &&
        String(s.subject_id) === String(group.subject_id)
      ))
      .map(t => ({
        ...t,
        isAssigned: assignedMap.has(t.id),
        toggling:   false,
      }))

    return {
      ...group,
      tree:             buildMallaTree(group.records),
      totalEvidences:   group.records.reduce((acc, r) => acc + (r.evidences?.length ?? 0), 0),
      eligibleTeachers: eligible,
    }
  })
})

const expandedMallas = ref(new Set())
function toggleMallaDetail(key) {
  if (expandedMallas.value.has(key)) expandedMallas.value.delete(key)
  else expandedMallas.value.add(key)
}

// Asignar docente a todos los registros del grupo (un clic)
async function quickAssign(malla, teacher) {
  teacher.toggling = true
  try {
    const schoolId = authStore.user?.schools?.[0]?.id ?? null
    for (const rec of malla.records) {
      await api.post(`/curriculum-grid/${rec.id}/assign`, {
        teacher_ids: [teacher.id],
        school_id:   schoolId,
      })
      if (!gridTeachers.value[rec.id]) gridTeachers.value[rec.id] = []
      if (!gridTeachers.value[rec.id].some(t => t.user_id === teacher.id)) {
        gridTeachers.value[rec.id].push({
          user_id:      teacher.id,
          teacher_name: `${teacher.first_name} ${teacher.last_name}`,
        })
      }
    }
    teacher.isAssigned = true
    showToast(`${teacher.first_name} ${teacher.last_name} asignado a la malla`)
  } catch (e) {
    showToast(e?.response?.data?.message || 'Error al asignar', 'error')
  } finally {
    teacher.toggling = false
  }
}

// Quitar docente de todos los registros del grupo
async function quickUnassign(malla, teacher) {
  if (!confirm(`¿Quitar a ${teacher.first_name} ${teacher.last_name} de esta malla?`)) return
  teacher.toggling = true
  try {
    for (const rec of malla.records) {
      await api.delete(`/curriculum-grid/${rec.id}/unassign/${teacher.id}`)
      if (gridTeachers.value[rec.id]) {
        gridTeachers.value[rec.id] = gridTeachers.value[rec.id].filter(t => t.user_id !== teacher.id)
      }
    }
    teacher.isAssigned = false
    showToast('Docente desasignado de la malla')
  } catch {
    showToast('Error al desasignar', 'error')
  } finally {
    teacher.toggling = false
  }
}


async function loadGridTeachers(gridId) {
  try {
    const res = await api.get(`/curriculum-grid/${gridId}/teachers`)
    gridTeachers.value[gridId] = res.data?.teachers ?? []
  } catch { /* ignore */ }
}


// ── Toast ──────────────────────────────────────────────────────────────
const toast = ref({ show: false, message: '', type: 'success' })
function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

// ── Load ───────────────────────────────────────────────────────────────
async function loadTeachers() {
  loadingTeachers.value = true
  try {
    const schoolId = authStore.user?.schools?.[0]?.id ?? null
    const data = await teacherSubjectService.getTeachers(schoolId ? { school_id: schoolId } : {})
    teachers.value = (Array.isArray(data) ? data : []).map(t => ({
      ...t,
      subjects: Array.isArray(t.subjects) ? t.subjects : [],
    }))
  } catch (e) {
    console.error('loadTeachers:', e)
    teachers.value = []
  } finally {
    loadingTeachers.value = false
  }
}

async function loadGradesSubjects() {
  try {
    const [gRes, sRes] = await Promise.all([gradeService.getAll(), subjectService.getAll()])
    const norm = (r) => {
      const d = r?.data
      return Array.isArray(d) ? d : (Array.isArray(d?.data) ? d.data : [])
    }
    grades.value   = norm(gRes)
    subjects.value = norm(sRes)
  } catch { /* ignore */ }
}

async function loadGrids() {
  loadingGrids.value = true
  try {
    const res = await curriculumGridService.getAll(1, 500)
    const list = Array.isArray(res?.data) ? res.data : []
    grids.value = list
    // Cargar docentes asignados a cada malla en paralelo
    await Promise.all(list.map(g => loadGridTeachers(g.id)))
  } catch { grids.value = [] }
  finally { loadingGrids.value = false }
}

// ── watcher: auto-carga estadísticas al entrar al tab ──
watch(activeTab, (tab) => {
  if (tab === 'stats' && !statsData.value && !loadingStats.value) loadStatistics()
})

onMounted(() => {
  loadTeachers()
  loadGradesSubjects()
  loadGrids()
})

// ════════════════════════════════════════════
// ── ESTADÍSTICAS ──
// ════════════════════════════════════════════

const statsData    = ref(null)
const loadingStats = ref(false)
const statsSortKey = ref('exec_rate')
const statsSortDir = ref('desc')
const statsFilter  = ref({ grade_id: '', subject_id: '', period: '' })

async function loadStatistics() {
  loadingStats.value = true
  try {
    const schoolId = authStore.user?.schools?.[0]?.id
    statsData.value = await coordinatorMonitorService.getStatistics(schoolId ? { school_id: schoolId } : {})
  } catch {
    showToast('Error al cargar estadísticas', 'error')
  } finally {
    loadingStats.value = false
  }
}

// Colores de Chart.js
const COLORS = {
  executed:    'rgba(16,185,129,0.85)',
  notExecuted: 'rgba(244,63,94,0.85)',
  pending:     'rgba(148,163,184,0.6)',
  rescheduled: 'rgba(99,102,241,0.85)',
  border: {
    executed:    'rgb(5,150,105)',
    notExecuted: 'rgb(225,29,72)',
    pending:     'rgb(100,116,139)',
    rescheduled: 'rgb(79,70,229)',
  }
}

function rateColor(rate) {
  if (rate >= 75) return 'text-emerald-600'
  if (rate >= 50) return 'text-amber-500'
  return 'text-rose-500'
}
function rateBg(rate) {
  if (rate >= 75) return 'bg-emerald-500'
  if (rate >= 50) return 'bg-amber-400'
  return 'bg-rose-500'
}

// ── Sorted teacher ranking ──
const sortedTeachers = computed(() => {
  if (!statsData.value?.per_teacher) return []
  return [...statsData.value.per_teacher].sort((a, b) => {
    const va = a[statsSortKey.value] ?? 0
    const vb = b[statsSortKey.value] ?? 0
    return statsSortDir.value === 'desc' ? vb - va : va - vb
  })
})

function toggleSort(key) {
  if (statsSortKey.value === key) statsSortDir.value = statsSortDir.value === 'desc' ? 'asc' : 'desc'
  else { statsSortKey.value = key; statsSortDir.value = 'desc' }
}

// ── Filtered per-malla ──
const filteredMalla = computed(() => {
  if (!statsData.value?.per_malla) return []
  let r = statsData.value.per_malla
  if (statsFilter.value.grade_id)   r = r.filter(m => String(m.grade_id)   === String(statsFilter.value.grade_id))
  if (statsFilter.value.subject_id) r = r.filter(m => String(m.subject_id) === String(statsFilter.value.subject_id))
  if (statsFilter.value.period)     r = r.filter(m => String(m.period)     === String(statsFilter.value.period))
  return [...r].sort((a, b) => b.exec_rate - a.exec_rate)
})

// Solo docentes que tienen al menos 1 semana planificada
const activeTeachers = computed(() =>
  (statsData.value?.per_teacher ?? []).filter(t => t.planned > 0)
)

// ── Chart: Tasa de ejecución (horizontal bar) ──
const execRateChartData = computed(() => {
  const src = [...activeTeachers.value].sort((a, b) => b.exec_rate - a.exec_rate)
  if (!src.length) return null
  return {
    labels: src.map(t => t.teacher_name.split(' ').slice(0, 2).join(' ')),
    datasets: [{
      label: '% Ejecución',
      data:  src.map(t => t.exec_rate),
      backgroundColor: src.map(t =>
        t.exec_rate >= 75 ? COLORS.executed :
        t.exec_rate >= 50 ? 'rgba(245,158,11,0.85)' : COLORS.notExecuted
      ),
      borderColor: src.map(t =>
        t.exec_rate >= 75 ? COLORS.border.executed :
        t.exec_rate >= 50 ? 'rgb(217,119,6)' : COLORS.border.notExecuted
      ),
      borderWidth: 1.5, borderRadius: 4,
    }]
  }
})
const execRateChartOpts = {
  indexAxis: 'y', responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.raw}%` } } },
  scales: {
    x: { min: 0, max: 100, ticks: { callback: v => v + '%', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
    y: { ticks: { font: { size: 11 } } }
  }
}

// ── Chart: Semanas apiladas por docente ──
const stackedChartData = computed(() => {
  const src = [...activeTeachers.value].sort((a, b) => b.planned - a.planned)
  if (!src.length) return null
  return {
    labels: src.map(t => t.teacher_name.split(' ').slice(0, 2).join(' ')),
    datasets: [
      { label: 'Ejecutadas',   data: src.map(t => t.executed),    backgroundColor: COLORS.executed,    borderWidth: 1, stack: 'w' },
      { label: 'No ejecutadas', data: src.map(t => t.not_executed), backgroundColor: COLORS.notExecuted, borderWidth: 1, stack: 'w' },
      { label: 'Sin registrar', data: src.map(t => Math.max(0, t.planned - t.executed - t.not_executed)), backgroundColor: COLORS.pending, borderWidth: 1, stack: 'w' },
    ]
  }
})
const stackedChartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 12, padding: 10 } },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { stacked: true, ticks: { font: { size: 11 } } },
    y: { stacked: true, ticks: { font: { size: 11 } }, title: { display: true, text: 'Semanas', font: { size: 10 } } }
  }
}

// ── Chart: Doughnut general del plantel ──
const doughnutChartData = computed(() => {
  if (!statsData.value?.totals) return null
  const t = statsData.value.totals
  if (t.planned === 0) return null
  const sinReg = Math.max(0, t.planned - t.executed - t.not_executed)
  return {
    labels: ['Ejecutadas', 'No ejecutadas', 'Sin registrar'],
    datasets: [{
      data: [t.executed, t.not_executed, sinReg],
      backgroundColor: [COLORS.executed, COLORS.notExecuted, COLORS.pending],
      borderColor:     ['#fff', '#fff', '#fff'],
      borderWidth: 3,
      hoverOffset: 8,
    }]
  }
})
const doughnutChartOpts = {
  responsive: true, maintainAspectRatio: false, cutout: '65%',
  plugins: {
    legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 10, boxWidth: 12 } },
    tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} sem.` } }
  }
}

// ════════════════════════════════════════════
// ── PLANTEL: monitor de docentes ──
// ════════════════════════════════════════════

// Construir árbol personalizado del docente (base + extras)
function buildPersonalizedTree(records, allExtras = {}) {
  const extraTopics      = allExtras.topic       || []
  const extraComponents  = allExtras.component   || []
  const extraStandards   = allExtras.standard    || []
  const extraCompetences = allExtras.competence  || []
  const extraAffirms     = allExtras.affirmation || []
  const extraEvidences   = allExtras.evidence    || []
  const topicMap = new Map()
  for (const rec of records) {
    for (const topic of (rec.topics || [])) {
      if (!topicMap.has(topic.id)) topicMap.set(topic.id, { ...topic, isExtra: false, components: new Map() })
      const tNode = topicMap.get(topic.id)
      for (const comp of (rec.components || [])) {
        if (!tNode.components.has(comp.id)) tNode.components.set(comp.id, { ...comp, isExtra: false, standards: new Map() })
        const cNode = tNode.components.get(comp.id)
        for (const std of (rec.standards || [])) {
          if (!cNode.standards.has(std.id)) cNode.standards.set(std.id, { ...std, isExtra: false, competences: new Map() })
          const sNode = cNode.standards.get(std.id)
          for (const k of (rec.competences || [])) {
            if (!sNode.competences.has(k.id)) sNode.competences.set(k.id, { ...k, isExtra: false, affirmations: new Map() })
            const kNode = sNode.competences.get(k.id)
            for (const aff of (rec.affirmations || [])) {
              if (!kNode.affirmations.has(aff.id)) kNode.affirmations.set(aff.id, { ...aff, isExtra: false, evidences: new Map() })
              const aNode = kNode.affirmations.get(aff.id)
              for (const ev of (rec.evidences || [])) {
                if (!aNode.evidences.has(ev.id)) aNode.evidences.set(ev.id, { ...ev, isExtra: false })
              }
            }
          }
        }
      }
    }
  }
  for (const e of extraTopics) {
    const k = 'x-topic-' + e.item_id
    if (!topicMap.has(k)) topicMap.set(k, { id: k, name: e.item_name, description: e.item_description ?? null, isExtra: true, components: new Map() })
  }
  const injectLevel = (parentMap, childKey, extras, childChildKey) => {
    for (const pNode of parentMap.values()) {
      for (const e of extras) {
        const k = `x-${childKey}-${e.item_id}`
        if (!pNode[childKey + 's']?.has(k)) {
          const node = { id: k, name: e.item_name, description: e.item_description ?? null, isExtra: true }
          node[childChildKey + 's'] = new Map()
          pNode[childKey + 's'].set(k, node)
        }
      }
    }
  }
  for (const t of topicMap.values()) {
    for (const e of extraComponents) { const k = 'x-comp-'+e.item_id; if (!t.components.has(k)) t.components.set(k, {id:k,name:e.item_name,description:e.item_description??null,isExtra:true,standards:new Map()}) }
  }
  for (const t of topicMap.values()) for (const c of t.components.values()) {
    for (const e of extraStandards) { const k = 'x-std-'+e.item_id; if (!c.standards.has(k)) c.standards.set(k, {id:k,name:e.item_name,description:e.item_description??null,isExtra:true,competences:new Map()}) }
  }
  for (const t of topicMap.values()) for (const c of t.components.values()) for (const s of c.standards.values()) {
    for (const e of extraCompetences) { const k = 'x-comp2-'+e.item_id; if (!s.competences.has(k)) s.competences.set(k, {id:k,name:e.item_name,description:e.item_description??null,isExtra:true,affirmations:new Map()}) }
  }
  for (const t of topicMap.values()) for (const c of t.components.values()) for (const s of c.standards.values()) for (const k2 of s.competences.values()) {
    for (const e of extraAffirms) { const k = 'x-aff-'+e.item_id; if (!k2.affirmations.has(k)) k2.affirmations.set(k, {id:k,name:e.item_name,description:e.item_description??null,isExtra:true,evidences:new Map()}) }
  }
  for (const t of topicMap.values()) for (const c of t.components.values()) for (const s of c.standards.values()) for (const k2 of s.competences.values()) for (const a of k2.affirmations.values()) {
    for (const e of extraEvidences) { const k = 'x-ev-'+e.item_id; if (!a.evidences.has(k)) a.evidences.set(k, {id:k,name:e.item_name,description:e.item_description??null,isExtra:true}) }
  }
  return [...topicMap.values()].map(t => ({
    ...t,
    components: [...t.components.values()].map(c => ({ ...c,
      standards: [...c.standards.values()].map(s => ({ ...s,
        competences: [...s.competences.values()].map(k => ({ ...k,
          affirmations: [...k.affirmations.values()].map(a => ({ ...a,
            evidences: [...a.evidences.values()]
          }))
        }))
      }))
    }))
  }))
}

// ── Estado del monitor ──
const monitorTeacherId    = ref(null)
const monitorData         = ref(null)    // { assignments, extras }
const monitorSchedule     = ref([])      // week schedule rows
const monitorObs          = ref([])      // all school observations
const loadingMonitor      = ref(false)
const loadingObs          = ref(false)
const monitorCardView     = ref({})      // teacherKey → 'tree'|'schedule'|'obs'

// Filters for observations table
const obsFilter = ref({ teacher_id: '', grade_id: '', subject_id: '', period: '', executed: '' })

// Computed: mallas agrupadas del docente seleccionado (base + extras)
const monitorGroupedMallas = computed(() => {
  if (!monitorData.value) return []
  const { assignments, extras } = monitorData.value
  const groups = new Map()
  for (const a of assignments) {
    const key = `${a.grade_id}-${a.subject_id}-${a.period ?? 'null'}`
    if (!groups.has(key)) groups.set(key, { key, grade_id: a.grade_id, grade_name: a.grade_name, subject_id: a.subject_id, subject_name: a.subject_name, period: a.period ?? null, records: [] })
    groups.get(key).records.push(a)
  }
  return [...groups.values()].map(g => {
    const mallaExtras = {}
    const cats = ['topic','component','standard','competence','affirmation','evidence']
    cats.forEach(cat => {
      mallaExtras[cat] = extras.filter(e =>
        e.category === cat &&
        String(e.grade_id) === String(g.grade_id) &&
        String(e.subject_id) === String(g.subject_id) &&
        String(e.period ?? '') === String(g.period ?? '')
      )
    })
    const scheduleKey = (n) => `${n.node_type}:${n.node_id}`
    const schedMap = {}
    monitorSchedule.value
      .filter(s => String(s.grade_id) === String(g.grade_id) && String(s.subject_id) === String(g.subject_id) && String(s.period ?? '') === String(g.period ?? ''))
      .forEach(s => { schedMap[scheduleKey(s)] = [...(s.weeks || [])].sort((a, b) => a - b) })
    return {
      ...g,
      tree: buildPersonalizedTree(g.records, mallaExtras),
      schedMap,
    }
  })
})

// Computed: school observations with filters
const filteredObs = computed(() => {
  let r = monitorObs.value
  if (obsFilter.value.teacher_id) r = r.filter(o => String(o.teacher_id) === String(obsFilter.value.teacher_id))
  if (obsFilter.value.grade_id)   r = r.filter(o => String(o.grade_id)   === String(obsFilter.value.grade_id))
  if (obsFilter.value.subject_id) r = r.filter(o => String(o.subject_id) === String(obsFilter.value.subject_id))
  if (obsFilter.value.period)     r = r.filter(o => String(o.period)     === String(obsFilter.value.period))
  if (obsFilter.value.executed !== '') r = r.filter(o => o.executed === (obsFilter.value.executed === 'true'))
  return r
})

const nodeTypeNames = { topic: 'Unidad Temática', component: 'Componente', standard: 'Estándar', competence: 'Competencia', affirmation: 'DBA/DNA', evidence: 'Evidencia' }

async function loadMonitorTeacher(teacherId) {
  monitorTeacherId.value = teacherId
  if (!teacherId) { monitorData.value = null; monitorSchedule.value = []; return }
  loadingMonitor.value = true
  try {
    const [malla, sched] = await Promise.all([
      coordinatorMonitorService.getTeacherMalla(teacherId),
      coordinatorMonitorService.getTeacherSchedule(teacherId),
    ])
    monitorData.value    = malla
    monitorSchedule.value = sched
  } catch {
    showToast('Error al cargar datos del docente', 'error')
  } finally {
    loadingMonitor.value = false
  }
}

async function loadSchoolObservations() {
  loadingObs.value = true
  try {
    const schoolId = authStore.user?.schools?.[0]?.id
    monitorObs.value = await coordinatorMonitorService.getSchoolObservations(schoolId ? { school_id: schoolId } : {})
  } catch {
    showToast('Error al cargar observaciones', 'error')
  } finally {
    loadingObs.value = false
  }
}

function getCardView(key) { return monitorCardView.value[key] || 'tree' }
function setCardView(key, view) { monitorCardView.value = { ...monitorCardView.value, [key]: view } }

// Flatten tree for read-only schedule display
function flattenTree(tree) {
  const seen = new Set(); const nodes = []
  function visit(item, type, depth) {
    const k = `${type}:${item.id}`; if (seen.has(k)) return; seen.add(k)
    nodes.push({ type, id: String(item.id), name: item.name || item.description || '', isExtra: item.isExtra ?? false, depth })
  }
  for (const t of tree) {
    visit(t, 'topic', 0)
    for (const c of (t.components || [])) { visit(c, 'component', 1); for (const s of (c.standards || [])) { visit(s, 'standard', 2); for (const k of (s.competences || [])) { visit(k, 'competence', 3); for (const a of (k.affirmations || [])) { visit(a, 'affirmation', 4); for (const e of (a.evidences || [])) visit(e, 'evidence', 5) } } } }
  }
  return nodes
}

const monNodeDotClass = (node) => {
  if (node.isExtra) return 'bg-amber-400'
  const m = { topic:'bg-indigo-500', component:'bg-emerald-500', standard:'bg-amber-500', competence:'bg-violet-500', affirmation:'bg-pink-500', evidence:'bg-rose-500' }
  return m[node.type] || 'bg-gray-400'
}
const monCellClass = (node) => {
  if (node.isExtra) return 'bg-amber-400'
  const m = { topic:'bg-indigo-500', component:'bg-emerald-500', standard:'bg-amber-500', competence:'bg-violet-500', affirmation:'bg-pink-500', evidence:'bg-rose-500' }
  return m[node.type] || 'bg-gray-400'
}
</script>
