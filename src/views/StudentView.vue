<template>
  <div class="min-h-screen bg-slate-100">

    <!-- ── Topbar ── -->
    <header class="topbar-gradient sticky top-0 z-40 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">

        <!-- Logo -->
        <div class="flex items-center gap-2.5 flex-shrink-0">
          <div class="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <span class="font-bold text-white tracking-tight text-sm hidden sm:block">GestiónAcadémica</span>
        </div>

        <!-- Tabs de navegación interna -->
        <nav class="flex items-center gap-0.5 overflow-x-auto flex-1 justify-center">
          <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
            :class="activeTab === tab.key
              ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/30 font-semibold'
              : 'text-white/70 hover:text-white hover:bg-white/10'">
            <component :is="'svg'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon"/>
            </component>
            <span>{{ tab.label }}</span>
          </button>
        </nav>

        <!-- Usuario -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <div class="text-right hidden lg:block max-w-[120px]">
            <p class="text-xs font-semibold text-white leading-none truncate">{{ authStore.user?.first_name }} {{ authStore.user?.last_name }}</p>
            <p class="text-[10px] text-white/60 mt-0.5 capitalize truncate">Estudiante</p>
          </div>
          <div class="w-7 h-7 rounded-full bg-emerald-400/30 border border-emerald-400/50 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {{ (authStore.user?.first_name?.[0] || '') + (authStore.user?.last_name?.[0] || '') }}
          </div>
          <button @click="handleLogout"
            class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span class="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ── Contenido ── -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">

      <!-- ══ TAB: INICIO ══ -->
      <div v-if="activeTab === 'home'">
        <!-- Banner de bienvenida -->
        <div class="welcome-gradient rounded-2xl p-6 mb-6 text-white flex items-center justify-between">
          <div>
            <p class="text-white/70 text-sm mb-1">Bienvenido de vuelta</p>
            <h1 class="text-2xl font-bold">{{ authStore.user?.first_name }} {{ authStore.user?.last_name }}</h1>
            <p class="text-white/80 text-sm mt-1">{{ authStore.user?.schools?.[0]?.name || 'Portal Académico' }}</p>
          </div>
          <div class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold text-white hidden sm:flex">
            {{ (authStore.user?.first_name?.[0] || '') + (authStore.user?.last_name?.[0] || '') }}
          </div>
        </div>

        <!-- Stats rápidas -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="stat-card border-l-4 border-indigo-500">
            <div class="stat-icon bg-indigo-100">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/>
              </svg>
            </div>
            <div>
              <div class="stat-value">{{ subjects.length }}</div>
              <div class="stat-label">Materias</div>
            </div>
          </div>
          <div class="stat-card border-l-4 border-amber-500">
            <div class="stat-icon bg-amber-100">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div>
              <div class="stat-value">{{ materials.length }}</div>
              <div class="stat-label">Actividades</div>
            </div>
          </div>
          <div class="stat-card border-l-4 border-emerald-500">
            <div class="stat-icon bg-emerald-100">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <div class="stat-value">{{ stats?.general_average || '—' }}</div>
              <div class="stat-label">Promedio</div>
            </div>
          </div>
          <div class="stat-card border-l-4 border-violet-500">
            <div class="stat-icon bg-violet-100">
              <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <div class="stat-value">{{ stats?.school_year || new Date().getFullYear() }}</div>
              <div class="stat-label">Año escolar</div>
            </div>
          </div>
        </div>

        <!-- Actividades recientes -->
        <div class="card border-t-4 border-amber-500">
          <div class="card-header flex items-center justify-between">
            <h3 class="font-semibold text-gray-800">Actividades Recientes</h3>
            <button @click="activeTab = 'activities'" class="text-xs text-indigo-600 hover:underline">Ver todas</button>
          </div>
          <div class="card-body">
            <div v-if="materials.slice(0,3).length === 0" class="text-center py-6 text-gray-400 text-sm">
              No hay actividades recientes
            </div>
            <div v-for="m in materials.slice(0,3)" :key="m.id"
              class="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="typeColor(m.type).bg">
                <svg class="w-4 h-4" :class="typeColor(m.type).text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="typeIcon(m.type)"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 truncate">{{ m.title }}</p>
                <p class="text-xs text-gray-500">{{ m.subject_name }} · {{ formatDate(m.created_at) }}</p>
              </div>
              <span class="badge flex-shrink-0" :class="typeColor(m.type).badge">{{ m.type }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ TAB: MIS MATERIAS ══ -->
      <div v-else-if="activeTab === 'subjects'">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h2 class="page-title">Mis Materias</h2>
            <p class="page-subtitle">Asignaturas del año escolar {{ new Date().getFullYear() }}</p>
          </div>
        </div>

        <div v-if="loadingSubjects" class="card p-12 text-center">
          <div class="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-gray-500 text-sm">Cargando materias...</p>
        </div>

        <div v-else-if="subjects.length === 0" class="card p-12 text-center">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/>
          </svg>
          <p class="text-gray-500">No tienes materias asignadas aún</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div v-for="(subj, i) in subjects" :key="subj.id || i"
            class="card hover:shadow-md transition-shadow"
            :class="`border-t-4 ${subjectAccents[i % subjectAccents.length]}`">
            <div class="card-body">
              <div class="flex items-start gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  :class="subjectBgColors[i % subjectBgColors.length]">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 text-sm">{{ subj.subject_name || subj.name }}</h3>
                  <p class="text-xs text-gray-500 mt-0.5">{{ subj.grade_name || subj.grade }} · {{ subj.teacher_name || 'Docente asignado' }}</p>
                </div>
              </div>

              <!-- Malla curricular vinculada -->
              <div v-if="subj.curriculum_grid" class="bg-indigo-50 rounded-lg p-3 mb-3">
                <p class="text-xs font-semibold text-indigo-700 mb-1">Malla Curricular</p>
                <div class="grid grid-cols-2 gap-1 text-xs text-indigo-600">
                  <span>{{ subj.curriculum_grid.topics_count || 0 }} ejes temáticos</span>
                  <span>{{ subj.curriculum_grid.components_count || 0 }} componentes</span>
                  <span>{{ subj.curriculum_grid.standards_count || 0 }} estándares</span>
                  <span>{{ subj.curriculum_grid.competences_count || 0 }} competencias</span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <span class="badge-green text-xs">Activa</span>
                <button @click="viewSubjectMalla(subj)"
                  class="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                  Ver malla
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ TAB: ACTIVIDADES Y MATERIAL ══ -->
      <div v-else-if="activeTab === 'activities'">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h2 class="page-title">Actividades y Material</h2>
            <p class="page-subtitle">Contenido publicado por tus profesores</p>
          </div>
          <!-- Filtro por tipo -->
          <div class="flex items-center gap-2">
            <select v-model="filterType" class="input text-xs py-1.5 w-36">
              <option value="">Todos</option>
              <option value="Tarea">Tareas</option>
              <option value="Actividad">Actividades</option>
              <option value="Material">Material</option>
              <option value="Video">Videos</option>
              <option value="Documento">Documentos</option>
            </select>
          </div>
        </div>

        <div v-if="loadingMaterials" class="card p-12 text-center">
          <div class="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-gray-500 text-sm">Cargando actividades...</p>
        </div>

        <div v-else-if="filteredMaterials.length === 0" class="card p-12 text-center">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p class="text-gray-500">No hay actividades disponibles</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="m in filteredMaterials" :key="m.id"
            class="card hover:shadow-md transition-shadow">
            <div class="card-body">
              <div class="flex items-start gap-4">
                <!-- Icono tipo -->
                <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                  :class="m.activity_type === 'quiz' ? 'bg-violet-100' : m.activity_type === 'entrega' ? 'bg-amber-100' : typeColor(m.type).bg">
                  <span v-if="m.activity_type === 'quiz'">✅</span>
                  <span v-else-if="m.activity_type === 'entrega'">📎</span>
                  <svg v-else class="w-5 h-5" :class="typeColor(m.type).text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="typeIcon(m.type)"/>
                  </svg>
                </div>

                <div class="flex-1 min-w-0">
                  <!-- Header -->
                  <div class="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 class="font-semibold text-gray-900 text-sm">{{ m.title }}</h3>
                      <p class="text-xs text-gray-500 mt-0.5">
                        {{ m.subject_name }} · Sem. {{ m.week || '?' }}
                      </p>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                      <span v-if="m.activity_type === 'quiz'" class="badge-purple text-xs">Quiz</span>
                      <span v-else-if="m.activity_type === 'entrega'" class="badge-yellow text-xs">Entrega</span>
                      <span v-else class="badge" :class="typeColor(m.type).badge">{{ m.type }}</span>
                      <span v-if="m.percentage" class="text-xs text-violet-600 font-semibold">{{ m.percentage }}%</span>
                      <span v-if="m.due_date" class="badge-yellow text-xs">📅 {{ formatDate(m.due_date) }}</span>
                    </div>
                  </div>

                  <p v-if="m.description" class="text-sm text-gray-600 mt-2 leading-relaxed">{{ m.description }}</p>

                  <!-- Contenido informativo -->
                  <div v-if="m.activity_type === 'informativo' || !m.activity_type">
                    <div v-if="m.content" class="mt-3 bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200">
                      {{ m.content }}
                    </div>
                    <a v-if="m.file_url" :href="m.file_url" target="_blank" class="btn-secondary btn-sm mt-3 inline-flex">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      Descargar archivo
                    </a>
                  </div>

                  <!-- ── QUIZ ── -->
                  <div v-else-if="m.activity_type === 'quiz'" class="mt-3">
                    <!-- Ya respondido -->
                    <div v-if="submissions[m.id]" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <div class="flex items-center gap-2 mb-3">
                        <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                        <p class="font-semibold text-emerald-700 text-sm">Quiz completado</p>
                      </div>
                      <p class="text-emerald-700 text-sm font-semibold">
                        {{ submissions[m.id].correct_count }} / {{ m.questions?.length }} correctas
                        <span class="ml-2 text-lg font-bold">{{ ((submissions[m.id].correct_count / m.questions?.length) * 5).toFixed(1) }} / 5.0</span>
                      </p>
                      <!-- Revisión de respuestas -->
                      <div class="mt-3 space-y-3">
                        <div v-for="(q, qi) in m.questions" :key="q.id" class="text-xs">
                          <p class="font-medium text-gray-700 mb-1">{{ qi + 1 }}. {{ q.text }}</p>
                          <div class="space-y-1">
                            <div v-for="(opt, oi) in q.options" :key="oi"
                              class="flex items-center gap-2 px-2 py-1 rounded-lg"
                              :class="{
                                'bg-emerald-100 text-emerald-800': oi === q.correct,
                                'bg-red-100 text-red-700': oi === submissions[m.id].answers?.[qi] && oi !== q.correct,
                                'text-gray-500': oi !== q.correct && oi !== submissions[m.id].answers?.[qi]
                              }">
                              <span class="font-bold w-4">{{ String.fromCharCode(65 + oi) }}.</span>
                              <span>{{ opt }}</span>
                              <span v-if="oi === q.correct" class="ml-auto">✓</span>
                              <span v-else-if="oi === submissions[m.id].answers?.[qi]" class="ml-auto">✗</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Formulario de quiz -->
                    <div v-else>
                      <button v-if="activeQuiz !== m.id"
                        @click="activeQuiz = m.id"
                        class="btn-primary btn-sm">
                        Responder Quiz
                      </button>

                      <div v-else class="border-2 border-violet-200 rounded-xl p-4 bg-violet-50/30 space-y-4">
                        <div v-for="(q, qi) in m.questions" :key="q.id">
                          <p class="text-sm font-semibold text-gray-800 mb-2">{{ qi + 1 }}. {{ q.text }}</p>
                          <div class="space-y-1.5">
                            <label v-for="(opt, oi) in q.options" :key="oi"
                              class="flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm"
                              :class="(quizAnswers[m.id] ?? {})[qi] === oi
                                ? 'border-violet-500 bg-violet-100 text-violet-800 font-medium'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-violet-300'">
                              <input type="radio" :name="`q-${m.id}-${qi}`"
                                :checked="(quizAnswers[m.id] ?? {})[qi] === oi"
                                @change="setAnswer(m.id, qi, oi)"
                                class="accent-violet-600"/>
                              <span class="font-semibold text-violet-400 w-5">{{ String.fromCharCode(65 + oi) }}.</span>
                              {{ opt }}
                            </label>
                          </div>
                        </div>

                        <div class="flex gap-2 pt-2">
                          <button @click="submitQuiz(m)"
                            :disabled="!allQuestionsAnswered(m) || submitting[m.id]"
                            class="btn-primary flex-1">
                            {{ submitting[m.id] ? 'Enviando...' : 'Enviar respuestas' }}
                          </button>
                          <button @click="activeQuiz = null" class="btn-secondary">Cancelar</button>
                        </div>
                        <p v-if="!allQuestionsAnswered(m)" class="text-xs text-amber-600">
                          Responde todas las preguntas para enviar
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- ── ENTREGA (archivo) ── -->
                  <div v-else-if="m.activity_type === 'entrega'" class="mt-3">
                    <!-- Ya entregado -->
                    <div v-if="submissions[m.id]" class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-3">
                      <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                      <div>
                        <p class="text-sm font-semibold text-emerald-700">Archivo entregado</p>
                        <p class="text-xs text-emerald-600">{{ submissions[m.id].file_name }}</p>
                      </div>
                    </div>

                    <!-- Upload form -->
                    <div v-else>
                      <div v-if="activeUpload !== m.id">
                        <button @click="activeUpload = m.id" class="btn-primary btn-sm">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12"/></svg>
                          Subir archivo
                        </button>
                      </div>

                      <div v-else class="border-2 border-amber-200 rounded-xl p-4 bg-amber-50/30 space-y-3">
                        <label class="block">
                          <p class="label mb-1">Selecciona tu archivo</p>
                          <input type="file" @change="onFileSelected(m.id, $event)"
                            class="block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 cursor-pointer"/>
                        </label>
                        <p v-if="selectedFiles[m.id]" class="text-xs text-gray-600">
                          📄 {{ selectedFiles[m.id].name }}
                          ({{ (selectedFiles[m.id].size / 1024).toFixed(1) }} KB)
                        </p>
                        <div class="flex gap-2">
                          <button @click="submitFile(m)" :disabled="!selectedFiles[m.id] || submitting[m.id]"
                            class="btn-primary flex-1">
                            {{ submitting[m.id] ? 'Subiendo...' : 'Enviar entrega' }}
                          </button>
                          <button @click="activeUpload = null" class="btn-secondary">Cancelar</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p class="text-xs text-gray-400 mt-3">{{ formatDate(m.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ TAB: MIS NOTAS ══ -->
      <div v-else-if="activeTab === 'grades'">
        <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 class="page-title">Mis Notas</h2>
            <p class="page-subtitle">Calificaciones del año escolar {{ new Date().getFullYear() }}</p>
          </div>
          <div class="flex items-center gap-2">
            <select v-model="selectedPeriod" @change="loadGrades" class="input text-xs py-1.5 w-36">
              <option value="">Todos los períodos</option>
              <option value="1">Período 1</option>
              <option value="2">Período 2</option>
              <option value="3">Período 3</option>
              <option value="4">Período 4</option>
            </select>
            <button @click="downloadBoletín"
              class="btn-primary btn-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Descargar Boletín
            </button>
          </div>
        </div>

        <!-- Stats de notas -->
        <div v-if="gradesData" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="stat-card border-l-4 border-indigo-500">
            <div class="stat-icon bg-indigo-100">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
            </div>
            <div>
              <div class="stat-value">{{ gradesData.general_average }}</div>
              <div class="stat-label">Promedio general</div>
            </div>
          </div>
          <div class="stat-card border-l-4 border-emerald-500">
            <div class="stat-icon bg-emerald-100">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/></svg>
            </div>
            <div>
              <div class="stat-value">{{ gradesData.total_grades }}</div>
              <div class="stat-label">Total calificaciones</div>
            </div>
          </div>
          <div class="stat-card border-l-4 border-violet-500">
            <div class="stat-icon bg-violet-100">
              <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13"/></svg>
            </div>
            <div>
              <div class="stat-value">{{ gradesData.subjects?.length || 0 }}</div>
              <div class="stat-label">Materias</div>
            </div>
          </div>
          <div class="stat-card border-l-4 border-amber-500">
            <div class="stat-icon bg-amber-100">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/></svg>
            </div>
            <div>
              <div class="stat-value">{{ gradesData.group_name || '—' }}</div>
              <div class="stat-label">Grupo</div>
            </div>
          </div>
        </div>

        <div v-if="loadingGrades" class="card p-12 text-center">
          <div class="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-gray-500 text-sm">Cargando calificaciones...</p>
        </div>

        <div v-else-if="!gradesData || !gradesData.subjects?.length" class="card p-12 text-center">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          <p class="text-gray-500">Aún no tienes calificaciones registradas</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="subject in gradesData.subjects" :key="subject.subject_name" class="card overflow-hidden">
            <!-- Header materia -->
            <div class="card-header flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              @click="toggleSubject(subject.subject_name)">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13"/></svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 text-sm">{{ subject.subject_name }}</h3>
                  <p class="text-xs text-gray-500">{{ subject.activities?.length || 0 }} actividad(es)</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="text-right">
                  <p class="text-xs text-gray-500">Promedio pond.</p>
                  <p class="font-bold text-lg" :class="gradeColor(subject.weighted_average)">
                    {{ subject.weighted_average }}
                  </p>
                </div>
                <svg class="w-4 h-4 text-gray-400 transition-transform"
                  :class="expandedSubjects.includes(subject.subject_name) ? 'rotate-180' : ''"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>

            <!-- Tabla de actividades y notas -->
            <div v-show="expandedSubjects.includes(subject.subject_name)" class="card-body pt-0">
              <div class="table-wrapper">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Semana</th>
                      <th>Actividad</th>
                      <th class="text-center">%</th>
                      <th class="text-center">Nota</th>
                      <th>Nivel</th>
                      <th>Observación</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="act in subject.activities" :key="act.id">
                      <td class="text-center">
                        <span v-if="act.week" class="badge-blue text-xs">Sem. {{ act.week }}</span>
                        <span v-else class="text-gray-300 text-xs">—</span>
                      </td>
                      <td>
                        <p class="font-medium text-gray-900 text-xs">{{ act.title }}</p>
                      </td>
                      <td class="text-center">
                        <span class="text-xs font-semibold text-violet-600">{{ act.percentage }}%</span>
                      </td>
                      <td class="text-center">
                        <span class="text-lg font-bold" :class="gradeColor(act.numeric_grade)">
                          {{ act.numeric_grade }}
                        </span>
                        <!-- Aporte ponderado -->
                        <p class="text-[10px] text-gray-400">
                          aporte: {{ ((act.numeric_grade * act.percentage) / 100).toFixed(2) }}
                        </p>
                      </td>
                      <td>
                        <span class="badge" :class="letterBadge(act.letter_grade)">
                          {{ act.letter_grade || '—' }}
                        </span>
                      </td>
                      <td class="max-w-[150px]">
                        <span class="text-xs italic text-gray-600">{{ act.observation || '—' }}</span>
                      </td>
                      <td class="text-xs text-gray-400 whitespace-nowrap">{{ formatDate(act.created_at) }}</td>
                    </tr>
                  </tbody>
                  <!-- Fila de totales -->
                  <tfoot>
                    <tr class="bg-violet-50">
                      <td colspan="2" class="text-right text-xs font-semibold text-gray-600">Totales</td>
                      <td class="text-center text-xs font-semibold text-violet-600">
                        {{ subject.activities.reduce((s,a) => s + Number(a.percentage||0), 0) }}%
                      </td>
                      <td class="text-center">
                        <span class="font-bold text-sm" :class="gradeColor(subject.weighted_average)">
                          {{ subject.weighted_average }}
                        </span>
                        <p class="text-[10px] text-gray-400">ponderado</p>
                      </td>
                      <td colspan="3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /main content -->

    <!-- Modal malla curricular de una materia -->
    <div v-if="showMallaModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm" @click.self="showMallaModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 class="font-bold text-gray-900">Malla Curricular</h2>
            <p class="text-xs text-gray-500 mt-0.5">{{ selectedSubjectMalla?.subject_name || selectedSubjectMalla?.name }}</p>
          </div>
          <button @click="showMallaModal = false" class="btn-ghost btn-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="overflow-y-auto p-5 space-y-4">
          <div v-if="!selectedSubjectMalla?.curriculum_grid" class="text-center py-8 text-gray-400">
            No hay malla curricular vinculada a esta materia
          </div>
          <div v-else>
            <div v-for="section in mallaSections" :key="section.key" class="mb-3">
              <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{{ section.label }}</h4>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="item in (selectedSubjectMalla.curriculum_grid[section.key] || [])" :key="item.id"
                  class="badge-gray text-xs">{{ item.name || item.description }}</span>
                <span v-if="!(selectedSubjectMalla.curriculum_grid[section.key] || []).length"
                  class="text-xs text-gray-400 italic">Sin definir</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { materialService, teacherGradesService } from '@/api/materialService'
import { submissionService } from '@/api/submissionService'

const router = useRouter()
const authStore = useAuthStore()

// ── Estado ──
const activeTab = ref('home')
const subjects = ref([])
const materials = ref([])
const gradesData = ref(null)
const stats = ref(null)
const loadingSubjects = ref(false)
const loadingMaterials = ref(false)
const loadingGrades = ref(false)
const filterType = ref('')
const selectedPeriod = ref('')
const expandedSubjects = ref([])
const showMallaModal = ref(false)
const selectedSubjectMalla = ref(null)

// ── Submissions (quiz / entrega) ──
const submissions   = ref({})   // { [materialId]: submission }
const quizAnswers   = ref({})   // { [materialId]: { [questionIdx]: optionIdx } }
const selectedFiles = ref({})   // { [materialId]: File }
const activeQuiz    = ref(null) // materialId currently expanded
const activeUpload  = ref(null) // materialId currently expanded
const submitting    = ref({})   // { [materialId]: boolean }

// ── Tabs ──
const tabs = [
  { key: 'home',       label: 'Inicio',      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'subjects',   label: 'Mis Materias', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { key: 'activities', label: 'Actividades',  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { key: 'grades',     label: 'Mis Notas',   icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
]

const subjectAccents = ['border-indigo-500','border-violet-500','border-emerald-500','border-amber-500','border-rose-500','border-sky-500']
const subjectBgColors = ['bg-indigo-500','bg-violet-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-sky-500']

const mallaSections = [
  { key: 'topics',      label: 'Ejes Temáticos' },
  { key: 'components',  label: 'Componentes' },
  { key: 'standards',   label: 'Estándares' },
  { key: 'competences', label: 'Competencias' },
  { key: 'affirmations',label: 'Afirmaciones DBA' },
  { key: 'evidences',   label: 'Evidencias DBA' },
]

// ── Computed ──
const filteredMaterials = computed(() => {
  if (!filterType.value) return materials.value
  return materials.value.filter(m => m.type === filterType.value)
})

// ── Helpers visuales ──
const typeColor = (type) => {
  const map = {
    Tarea:      { bg: 'bg-amber-100',   text: 'text-amber-600',   badge: 'badge-yellow' },
    Actividad:  { bg: 'bg-indigo-100',  text: 'text-indigo-600',  badge: 'badge-blue'   },
    Material:   { bg: 'bg-emerald-100', text: 'text-emerald-600', badge: 'badge-green'  },
    Video:      { bg: 'bg-violet-100',  text: 'text-violet-600',  badge: 'badge-purple' },
    Documento:  { bg: 'bg-gray-100',    text: 'text-gray-600',    badge: 'badge-gray'   },
  }
  return map[type] || { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'badge-gray' }
}

const typeIcon = (type) => {
  const map = {
    Tarea:     'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    Video:     'M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    Documento: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  }
  return map[type] || 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
}

const gradeColor = (grade) => {
  const n = parseFloat(grade)
  if (n >= 4.5) return 'text-emerald-600'
  if (n >= 3.5) return 'text-indigo-600'
  if (n >= 3.0) return 'text-amber-600'
  return 'text-red-600'
}

const letterBadge = (letter) => {
  const map = {
    'Superior': 'badge-green',
    'Alto':     'badge-blue',
    'Básico':   'badge-yellow',
    'Bajo':     'badge-red',
    'E': 'badge-green', 'S': 'badge-blue', 'A': 'badge-yellow', 'B': 'badge-red',
  }
  return map[letter] || 'badge-gray'
}


const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ── Acciones ──
const toggleSubject = (name) => {
  const i = expandedSubjects.value.indexOf(name)
  if (i > -1) expandedSubjects.value.splice(i, 1)
  else expandedSubjects.value.push(name)
}

const viewSubjectMalla = (subj) => {
  selectedSubjectMalla.value = subj
  showMallaModal.value = true
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const downloadBoletín = async () => {
  try {
    const resp = await teacherGradesService.downloadMyReport({
      school_year: new Date().getFullYear(),
      ...(selectedPeriod.value && { period: selectedPeriod.value })
    })
    const url = URL.createObjectURL(new Blob([resp.data], { type: 'application/pdf' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `boletin-${authStore.user?.first_name}-${new Date().getFullYear()}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    alert('No se pudo generar el boletín. Consulta con tu institución.')
  }
}

// ── Carga de datos ──
const loadSubjects = async () => {
  loadingSubjects.value = true
  try {
    const resp = await materialService.getMySubjects()
    subjects.value = resp.data?.data || resp.data || []
  } catch {
    subjects.value = []
  } finally {
    loadingSubjects.value = false
  }
}

const loadMaterials = async () => {
  loadingMaterials.value = true
  try {
    const resp = await materialService.getMyMaterials()
    materials.value = resp.data?.data || resp.data || []
    // Load all submissions for these materials
    await loadSubmissions()
  } catch {
    materials.value = []
  } finally {
    loadingMaterials.value = false
  }
}

const loadSubmissions = async () => {
  const user = authStore.user
  if (!user) return
  const result = {}
  await Promise.all(
    materials.value.map(async (m) => {
      if (m.activity_type === 'quiz' || m.activity_type === 'entrega') {
        const resp = await submissionService.getMine(m.id, user.id)
        if (resp.data) result[m.id] = resp.data
      }
    })
  )
  submissions.value = result
}

// Quiz helpers
const setAnswer = (materialId, questionIdx, optionIdx) => {
  if (!quizAnswers.value[materialId]) quizAnswers.value[materialId] = {}
  quizAnswers.value[materialId] = { ...quizAnswers.value[materialId], [questionIdx]: optionIdx }
}

const allQuestionsAnswered = (m) => {
  if (!m.questions?.length) return false
  const ans = quizAnswers.value[m.id] || {}
  return m.questions.every((_, i) => ans[i] !== undefined)
}

const submitQuiz = async (m) => {
  if (!allQuestionsAnswered(m)) return
  submitting.value = { ...submitting.value, [m.id]: true }
  try {
    const answers = quizAnswers.value[m.id]
    const correct_count = m.questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)
    await submissionService.submit({
      material_id:   m.id,
      student_id:    authStore.user.id,
      type:          'quiz',
      answers,
      correct_count,
      total:         m.questions.length,
      submitted_at:  new Date().toISOString(),
    })
    submissions.value = { ...submissions.value, [m.id]: { answers, correct_count, total: m.questions.length } }
    activeQuiz.value = null
  } finally {
    submitting.value = { ...submitting.value, [m.id]: false }
  }
}

// File upload helpers
const onFileSelected = (materialId, event) => {
  selectedFiles.value = { ...selectedFiles.value, [materialId]: event.target.files[0] }
}

const submitFile = async (m) => {
  const file = selectedFiles.value[m.id]
  if (!file) return
  submitting.value = { ...submitting.value, [m.id]: true }
  try {
    const reader = new FileReader()
    reader.onload = async (e) => {
      await submissionService.submit({
        material_id:  m.id,
        student_id:   authStore.user.id,
        type:         'entrega',
        file_name:    file.name,
        file_data:    e.target.result, // base64
        file_type:    file.type,
        submitted_at: new Date().toISOString(),
      })
      submissions.value = { ...submissions.value, [m.id]: { file_name: file.name, file_type: file.type } }
      activeUpload.value = null
      selectedFiles.value = { ...selectedFiles.value, [m.id]: null }
      submitting.value = { ...submitting.value, [m.id]: false }
    }
    reader.readAsDataURL(file)
  } catch {
    submitting.value = { ...submitting.value, [m.id]: false }
  }
}

const loadGrades = async () => {
  loadingGrades.value = true
  try {
    const params = { school_year: new Date().getFullYear() }
    if (selectedPeriod.value) params.period = selectedPeriod.value
    const resp = await teacherGradesService.getMyGrades(params)
    gradesData.value = resp.data || resp
    if (gradesData.value?.subjects) {
      expandedSubjects.value = gradesData.value.subjects.map(s => s.subject_name)
    }
  } catch {
    gradesData.value = null
  } finally {
    loadingGrades.value = false
  }
}

const loadStats = async () => {
  try {
    const resp = await teacherGradesService.getMyStats()
    stats.value = resp.data || resp
  } catch {
    stats.value = null
  }
}

onMounted(() => {
  loadSubjects()
  loadMaterials()
  loadGrades()
  loadStats()
})
</script>
