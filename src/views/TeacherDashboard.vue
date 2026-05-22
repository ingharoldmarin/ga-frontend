<template>
  <div class="min-h-screen bg-slate-100">

    <!-- ── Topbar ── -->
    <header class="topbar-gradient sticky top-0 z-40 shadow-lg">
      <!-- Fila 1 -->
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

        <!-- Tabs del profesor (nav principal) -->
        <nav class="flex items-center gap-0.5 overflow-x-auto flex-1 justify-center">
          <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
            :class="activeTab === tab.key
              ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/30 font-semibold'
              : 'text-white/70 hover:text-white hover:bg-white/10'">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon"/>
            </svg>
            {{ tab.label }}
          </button>
        </nav>

        <!-- Usuario + logout -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <div class="text-right hidden lg:block max-w-[120px]">
            <p class="text-xs font-semibold text-white leading-none truncate">{{ authStore.user?.first_name }} {{ authStore.user?.last_name }}</p>
            <p class="text-[10px] text-white/60 mt-0.5 truncate">Docente</p>
          </div>
          <div class="w-7 h-7 rounded-full bg-amber-400/30 border border-amber-400/50 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
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

      <!-- ══ TAB: MIS MALLAS ══ -->
      <div v-if="activeTab === 'assignments'">

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="stat-card border-l-4 border-indigo-500">
            <div class="stat-icon bg-indigo-100"><svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13"/></svg></div>
            <div><div class="stat-value">{{ groupedMallas.length }}</div><div class="stat-label">Mallas asignadas</div></div>
          </div>
          <div class="stat-card border-l-4 border-amber-500">
            <div class="stat-icon bg-amber-100"><svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
            <div><div class="stat-value">{{ totalSchedules }}</div><div class="stat-label">Cronogramas</div></div>
          </div>
          <div class="stat-card border-l-4 border-emerald-500">
            <div class="stat-icon bg-emerald-100"><svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            <div><div class="stat-value">{{ executedSchedules }}</div><div class="stat-label">Clases ejecutadas</div></div>
          </div>
          <div class="stat-card border-l-4 border-violet-500">
            <div class="stat-icon bg-violet-100"><svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg></div>
            <div><div class="stat-value">{{ completionPercentage }}%</div><div class="stat-label">Progreso</div></div>
          </div>
        </div>

        <!-- Filtros -->
        <div class="card mb-5">
          <div class="card-body flex flex-wrap gap-3 items-center">
            <select v-model="filterGrade" class="input text-xs py-1.5 w-40">
              <option :value="null">Todos los grados</option>
              <option v-for="g in uniqueGrades" :key="g" :value="g">{{ g }}</option>
            </select>
            <select v-model="filterSubject" class="input text-xs py-1.5 w-44">
              <option :value="null">Todas las materias</option>
              <option v-for="s in uniqueSubjects" :key="s" :value="s">{{ s }}</option>
            </select>
            <button @click="loadAssignments" class="btn-secondary btn-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Actualizar
            </button>
          </div>
        </div>

        <div v-if="loadingAssignments" class="card p-12 text-center">
          <div class="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-gray-500 text-sm">Cargando mallas asignadas...</p>
        </div>

        <div v-else-if="filteredGroupedMallas.length === 0" class="card p-12 text-center">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13"/></svg>
          <p class="text-gray-500 font-medium">No tienes mallas asignadas</p>
          <p class="text-gray-400 text-sm mt-1">Espera a que tu coordinador te asigne mallas curriculares</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div v-for="m in filteredGroupedMallas" :key="m.key"
            class="card hover:shadow-md transition-shadow border-t-4 border-indigo-500">
            <div class="card-body">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h3 class="font-semibold text-gray-900 text-sm">{{ m.grade_name }}</h3>
                  <p class="text-xs text-indigo-600 font-medium mt-0.5">{{ m.subject_name }}</p>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <span v-if="m.period" class="badge-blue text-xs">Período {{ m.period }}</span>
                  <span v-else class="badge-gray text-xs">Sin período</span>
                </div>
              </div>

              <p v-if="m.school_name" class="text-xs text-gray-400 mb-3">{{ m.school_name }}</p>

              <!-- Conteo de elementos únicos -->
              <div class="grid grid-cols-3 gap-1.5 mb-4">
                <div class="text-center bg-indigo-50 rounded-lg py-2">
                  <p class="font-bold text-sm text-indigo-700">{{ countUnique(m.records, 'topics') }}</p>
                  <p class="text-[10px] text-gray-500">Unidades</p>
                </div>
                <div class="text-center bg-emerald-50 rounded-lg py-2">
                  <p class="font-bold text-sm text-emerald-700">{{ countUnique(m.records, 'standards') }}</p>
                  <p class="text-[10px] text-gray-500">Estándares</p>
                </div>
                <div class="text-center bg-violet-50 rounded-lg py-2">
                  <p class="font-bold text-sm text-violet-700">{{ m.totalEvidences }}</p>
                  <p class="text-[10px] text-gray-500">Evidencias</p>
                </div>
              </div>

              <div class="flex gap-2 flex-wrap">
                <button @click="viewMallaDetails(m)" class="btn-secondary btn-sm flex-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  Ver árbol
                </button>
                <button @click="openEditExtras(m)" class="btn-ghost btn-sm flex-1 border border-amber-300 text-amber-700 hover:bg-amber-50">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  Personalizar
                </button>
                <button @click="openWeekSchedule(m)" class="btn-primary btn-sm w-full">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Planificar semanas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ TAB: MATERIALES Y ACTIVIDADES ══ -->
      <div v-else-if="activeTab === 'materials'">

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Formulario de subida -->
          <div class="lg:col-span-1">
            <div class="card border-t-4 border-amber-500 sticky top-20">
              <div class="card-header">
                <h3 class="font-semibold text-gray-800 text-sm">
                  {{ editingMaterial ? 'Editar material' : 'Publicar nuevo material' }}
                </h3>
              </div>
              <div class="card-body overflow-y-auto max-h-[calc(100vh-10rem)]">
                <form @submit.prevent="saveMaterial" class="space-y-3">

                  <div>
                    <label class="label">Título <span class="text-red-500">*</span></label>
                    <input v-model="matForm.title" type="text" class="input" placeholder="Título del material" required/>
                  </div>

                  <!-- Tipo de entrega -->
                  <div>
                    <label class="label">Tipo de actividad</label>
                    <div class="grid grid-cols-3 gap-1.5">
                      <label v-for="opt in activityTypeOpts" :key="opt.value"
                        class="flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border-2 cursor-pointer text-center transition-all"
                        :class="matForm.activity_type === opt.value
                          ? 'border-violet-500 bg-violet-50 text-violet-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'">
                        <input type="radio" v-model="matForm.activity_type" :value="opt.value" class="sr-only"/>
                        <span class="text-lg">{{ opt.icon }}</span>
                        <span class="text-[10px] font-medium leading-tight">{{ opt.label }}</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label class="label">Categoría</label>
                    <select v-model="matForm.type" class="input">
                      <option value="Tarea">Tarea</option>
                      <option value="Actividad">Actividad</option>
                      <option value="Material">Material de estudio</option>
                      <option value="Video">Video</option>
                      <option value="Documento">Documento</option>
                    </select>
                  </div>

                  <div>
                    <label class="label">Malla / Materia</label>
                    <select v-model="matForm.curriculum_grid_id" class="input">
                      <option :value="null">Seleccionar...</option>
                      <option v-for="a in assignments" :key="a.curriculum_grid_id" :value="a.curriculum_grid_id">
                        {{ a.grade_name }} - {{ a.subject_name }}
                      </option>
                    </select>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="label">Semana <span class="text-red-500">*</span></label>
                      <input v-model.number="matForm.week" type="number" min="1" max="40" class="input" placeholder="Ej: 3" required/>
                    </div>
                    <div>
                      <label class="label">Porcentaje % <span class="text-red-500">*</span></label>
                      <input v-model.number="matForm.percentage" type="number" min="1" max="100" class="input" placeholder="Ej: 25" required/>
                    </div>
                  </div>

                  <div>
                    <label class="label">Descripción / Instrucciones</label>
                    <textarea v-model="matForm.description" class="input resize-none" rows="2" placeholder="Instrucciones para los estudiantes..."></textarea>
                  </div>

                  <!-- Informativo: contenido/enlace -->
                  <div v-if="matForm.activity_type === 'informativo'">
                    <label class="label">Contenido / Enlace</label>
                    <textarea v-model="matForm.content" class="input resize-none" rows="2" placeholder="URL, texto o enlace al recurso..."></textarea>
                  </div>

                  <div>
                    <label class="label">Fecha de entrega</label>
                    <input v-model="matForm.due_date" type="date" class="input"/>
                  </div>

                  <!-- ── QUIZ BUILDER ── -->
                  <div v-if="matForm.activity_type === 'quiz'" class="border-2 border-violet-200 rounded-xl p-3 bg-violet-50/40">
                    <div class="flex items-center justify-between mb-3">
                      <p class="text-xs font-semibold text-violet-700">Preguntas del quiz</p>
                      <button type="button" @click="addQuestion"
                        class="btn-primary btn-sm text-xs">
                        + Pregunta
                      </button>
                    </div>

                    <div v-if="!matForm.questions.length" class="text-center py-4 text-xs text-gray-400">
                      Agrega al menos una pregunta
                    </div>

                    <div v-for="(q, qi) in matForm.questions" :key="q.id"
                      class="bg-white rounded-lg p-3 mb-2 border border-violet-100 space-y-2">
                      <div class="flex items-start gap-2">
                        <span class="text-xs font-bold text-violet-600 mt-2 flex-shrink-0">{{ qi + 1 }}.</span>
                        <input v-model="q.text" type="text" class="input flex-1 text-xs"
                          :placeholder="`Enunciado de la pregunta ${qi + 1}`"/>
                        <button type="button" @click="removeQuestion(qi)"
                          class="text-red-400 hover:text-red-600 mt-2 flex-shrink-0 text-sm leading-none">✕</button>
                      </div>
                      <div class="ml-5 space-y-1.5">
                        <div v-for="(_, oi) in q.options" :key="oi" class="flex items-center gap-2">
                          <input type="radio" :name="`correct-${q.id}`" :checked="q.correct === oi"
                            @change="q.correct = oi"
                            class="flex-shrink-0 accent-emerald-500"/>
                          <input v-model="q.options[oi]" type="text" class="input flex-1 text-xs py-1"
                            :placeholder="`Opción ${String.fromCharCode(65 + oi)}`"/>
                        </div>
                        <p class="text-[10px] text-gray-400">Selecciona el radio ✓ de la respuesta correcta</p>
                      </div>
                    </div>
                  </div>

                  <!-- ── ENTREGA info ── -->
                  <div v-if="matForm.activity_type === 'entrega'"
                    class="border-2 border-amber-200 rounded-xl p-3 bg-amber-50/40 text-xs text-amber-700 space-y-1">
                    <p class="font-semibold">📎 Actividad de subida de archivo</p>
                    <p class="text-amber-600">Los estudiantes podrán adjuntar un archivo como entrega. Puedes calificarlos desde el libro de calificaciones.</p>
                  </div>

                  <div class="flex gap-2 pt-2">
                    <button type="submit" :disabled="savingMaterial" class="btn-primary flex-1">
                      <svg v-if="savingMaterial" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      {{ savingMaterial ? 'Guardando...' : (editingMaterial ? 'Actualizar' : 'Publicar') }}
                    </button>
                    <button v-if="editingMaterial" type="button" @click="cancelEditMaterial" class="btn-secondary">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Lista de materiales publicados -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-800">Materiales publicados</h3>
              <button @click="loadMyMaterials" class="btn-ghost btn-sm">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Recargar
              </button>
            </div>

            <div v-if="loadingMaterials" class="card p-10 text-center">
              <div class="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p class="text-gray-400 text-sm">Cargando...</p>
            </div>

            <div v-else-if="myMaterials.length === 0" class="card p-10 text-center">
              <p class="text-gray-400 text-sm">Aún no has publicado materiales</p>
            </div>

            <div v-else v-for="m in myMaterials" :key="m.id" class="card hover:shadow-sm transition-shadow">
              <div class="card-body">
                <div class="flex items-start gap-3">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="typeColor(m.type).bg">
                    <svg class="w-4 h-4" :class="typeColor(m.type).text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="typeIcon(m.type)"/>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h4 class="font-medium text-gray-900 text-sm">{{ m.title }}</h4>
                        <p class="text-xs text-gray-500 mt-0.5">{{ m.subject_name || 'Sin materia' }} · {{ formatDate(m.created_at) }}</p>
                      </div>
                      <div class="flex items-center gap-1.5 flex-wrap justify-end">
                        <span class="badge" :class="typeColor(m.type).badge">{{ m.type }}</span>
                        <span v-if="m.week" class="badge-blue text-xs">Sem. {{ m.week }}</span>
                        <span v-if="m.percentage" class="badge-purple text-xs">{{ m.percentage }}%</span>
                        <span v-if="m.due_date" class="badge-yellow text-xs">{{ formatDate(m.due_date) }}</span>
                      </div>
                    </div>
                    <p v-if="m.description" class="text-xs text-gray-600 mt-1.5 line-clamp-2">{{ m.description }}</p>
                    <div class="flex items-center gap-2 mt-2">
                      <button @click="startEditMaterial(m)" class="btn-ghost btn-sm text-xs">Editar</button>
                      <button @click="deleteMaterialItem(m.id)" class="btn-ghost btn-sm text-xs text-red-500 hover:text-red-700">Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ TAB: CALIFICACIONES ══ -->
      <div v-else-if="activeTab === 'grades'">

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Panel de selección -->
          <div class="lg:col-span-1">
            <div class="card border-t-4 border-violet-500 sticky top-20">
              <div class="card-header">
                <h3 class="font-semibold text-gray-800 text-sm">Libro de calificaciones</h3>
              </div>
              <div class="card-body space-y-3">

                <!-- 1. Seleccionar malla -->
                <div>
                  <label class="label">Malla / Materia</label>
                  <select v-model="gradeForm.assignment" @change="onAssignmentChange" class="input">
                    <option :value="null">Seleccionar...</option>
                    <option v-for="a in assignments" :key="a.curriculum_grid_id" :value="a">
                      {{ a.grade_name }} - {{ a.subject_name }}
                    </option>
                  </select>
                </div>

                <!-- 2. Actividades de esa malla -->
                <div v-if="gradeForm.assignment">
                  <label class="label">Actividad / Evaluación</label>
                  <div v-if="gridActivities.length === 0" class="text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
                    No hay actividades publicadas para esta malla. Publícalas en la pestaña "Material y Actividades".
                  </div>
                  <select v-else v-model="gradeForm.activity" @change="onActivityChange" class="input">
                    <option :value="null">Seleccionar actividad...</option>
                    <option v-for="act in gridActivities" :key="act.id" :value="act">
                      Sem.{{ act.week || '?' }} · {{ act.title }} ({{ act.percentage || 0 }}%)
                    </option>
                  </select>
                </div>

                <!-- Info de la actividad seleccionada -->
                <div v-if="gradeForm.activity" class="bg-violet-50 rounded-lg p-3 text-xs space-y-1">
                  <div class="flex justify-between"><span class="text-gray-500">Semana</span><span class="font-semibold text-violet-700">{{ gradeForm.activity.week || '—' }}</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Porcentaje</span><span class="font-semibold text-violet-700">{{ gradeForm.activity.percentage || 0 }}%</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Tipo</span><span class="font-semibold text-violet-700">{{ gradeForm.activity.type }}</span></div>
                  <div v-if="gradeForm.activity.due_date" class="flex justify-between"><span class="text-gray-500">Entrega</span><span class="font-semibold text-violet-700">{{ formatDate(gradeForm.activity.due_date) }}</span></div>
                </div>

                <!-- 3. Cargar estudiantes -->
                <button @click="loadStudents" :disabled="!gradeForm.assignment || !gradeForm.activity" class="btn-primary w-full">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  Cargar estudiantes
                </button>

                <!-- 4. Formulario calificar -->
                <div v-if="selectedStudent" class="border-t border-gray-100 pt-3 space-y-2">
                  <p class="text-xs font-semibold text-gray-700">Calificar: {{ selectedStudent.first_name }} {{ selectedStudent.last_name }}</p>
                  <div>
                    <label class="label">Nota (1.0 - 5.0)</label>
                    <input v-model.number="gradeInput.numeric_grade" @input="autoLevel" type="number" min="1" max="5" step="0.1" class="input" placeholder="Ej: 4.5"/>
                  </div>
                  <div>
                    <label class="label">Nivel</label>
                    <select v-model="gradeInput.letter_grade" class="input">
                      <option value="">Sin nivel</option>
                      <option value="Superior">Superior (4.6 - 5.0)</option>
                      <option value="Alto">Alto (4.0 - 4.5)</option>
                      <option value="Básico">Básico (3.0 - 3.9)</option>
                      <option value="Bajo">Bajo (1.0 - 2.9)</option>
                    </select>
                  </div>
                  <div>
                    <label class="label">Observación</label>
                    <textarea v-model="gradeInput.observation" class="input resize-none" rows="2" placeholder="Comentario opcional..."></textarea>
                  </div>
                  <div class="flex gap-2">
                    <button @click="saveGrade" :disabled="savingGrade" class="btn-primary btn-sm flex-1">
                      {{ savingGrade ? 'Guardando...' : 'Guardar nota' }}
                    </button>
                    <button @click="selectedStudent = null" class="btn-secondary btn-sm">Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Panel derecho: tabla + promedios ponderados -->
          <div class="lg:col-span-2 space-y-5">

            <div v-if="!gradeForm.assignment" class="card p-12 text-center">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <p class="text-gray-400 text-sm">Selecciona una materia para empezar</p>
            </div>

            <template v-else>
              <!-- Tabla de notas por actividad seleccionada -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-semibold text-gray-800 text-sm">
                    {{ gradeForm.assignment?.grade_name }} · {{ gradeForm.assignment?.subject_name }}
                    <span v-if="gradeForm.activity" class="text-gray-400 font-normal ml-1">— {{ gradeForm.activity.title }}</span>
                  </h3>
                  <span class="badge-blue">{{ students.length }} estudiantes</span>
                </div>

                <div v-if="loadingStudents" class="card p-10 text-center">
                  <div class="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p class="text-gray-400 text-sm">Cargando...</p>
                </div>

                <div v-else-if="!gradeForm.activity" class="card p-8 text-center">
                  <p class="text-gray-400 text-sm">Selecciona una actividad para calificar</p>
                </div>

                <div v-else-if="students.length === 0 && gradeForm.activity" class="card p-8 text-center">
                  <p class="text-gray-400 text-sm">No hay estudiantes matriculados en esta combinación</p>
                </div>

                <div v-else-if="students.length > 0" class="card overflow-hidden">
                  <div class="table-wrapper">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Estudiante</th>
                          <!-- Entrega/Quiz: submission status -->
                          <th v-if="gradeForm.activity?.activity_type === 'quiz' || gradeForm.activity?.activity_type === 'entrega'">
                            Entrega
                          </th>
                          <th>Nota <span class="text-violet-500">({{ gradeForm.activity?.percentage || 0 }}%)</span></th>
                          <th>Nivel</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(student, idx) in students" :key="student.id"
                          :class="selectedStudent?.id === student.id ? 'bg-violet-50' : ''">
                          <td class="text-gray-400">{{ idx + 1 }}</td>
                          <td>
                            <div class="flex items-center gap-2">
                              <div class="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs">
                                {{ (student.first_name?.[0] || '') + (student.last_name?.[0] || '') }}
                              </div>
                              <div>
                                <p class="font-medium text-gray-900 text-xs">{{ student.first_name }} {{ student.last_name }}</p>
                                <p class="text-[10px] text-gray-400">{{ student.email }}</p>
                              </div>
                            </div>
                          </td>

                          <!-- Submission status -->
                          <td v-if="gradeForm.activity?.activity_type === 'quiz' || gradeForm.activity?.activity_type === 'entrega'">
                            <div v-if="getSubmission(student.id)">
                              <!-- Quiz submission -->
                              <div v-if="gradeForm.activity.activity_type === 'quiz'" class="space-y-1">
                                <span class="badge-green text-xs">Enviado</span>
                                <p class="text-[10px] text-emerald-700 font-semibold">
                                  {{ getSubmission(student.id).correct_count }}/{{ gradeForm.activity.questions?.length }} correctas
                                  ({{ quizAutoScore(student.id) }}/5.0)
                                </p>
                              </div>
                              <!-- File submission -->
                              <div v-else class="space-y-1">
                                <span class="badge-green text-xs">Entregado</span>
                                <button @click="downloadSubmissionFile(getSubmission(student.id))"
                                  class="flex items-center gap-1 text-[10px] text-indigo-600 hover:underline">
                                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                  {{ getSubmission(student.id).file_name }}
                                </button>
                              </div>
                            </div>
                            <span v-else class="text-gray-300 text-xs">Sin entrega</span>
                          </td>

                          <td>
                            <span v-if="getStudentGrade(student.id)"
                              class="font-bold text-sm" :class="gradeColor(getStudentGrade(student.id)?.numeric_grade)">
                              {{ getStudentGrade(student.id)?.numeric_grade }}
                            </span>
                            <span v-else class="text-gray-300 text-xs">Sin nota</span>
                          </td>
                          <td>
                            <span v-if="getStudentGrade(student.id)" class="badge"
                              :class="letterBadge(getStudentGrade(student.id)?.letter_grade)">
                              {{ getStudentGrade(student.id)?.letter_grade || '—' }}
                            </span>
                          </td>
                          <td>
                            <div class="flex items-center gap-1">
                              <button @click="startGrading(student)" class="btn-primary btn-sm text-xs">
                                {{ getStudentGrade(student.id) ? 'Editar' : 'Calificar' }}
                              </button>
                              <button @click="downloadStudentReport(student)" class="btn-ghost btn-sm" title="Descargar boletín">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Tabla de promedios ponderados por estudiante -->
              <div v-if="students.length > 0 && allGridGrades.length > 0" class="card overflow-hidden">
                <div class="card-header flex items-center justify-between">
                  <h4 class="font-semibold text-gray-800 text-sm">Promedio ponderado por estudiante</h4>
                  <span class="text-xs text-gray-400">{{ gridActivities.length }} actividades · {{ totalPct }}% total</span>
                </div>
                <div class="table-wrapper">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Estudiante</th>
                        <th v-for="act in gridActivities" :key="act.id" class="text-center">
                          <span class="block truncate max-w-[80px]" :title="act.title">{{ act.title }}</span>
                          <span class="block text-[10px] text-violet-500 font-normal">Sem.{{ act.week || '?' }} · {{ act.percentage }}%</span>
                        </th>
                        <th class="text-center">Promedio</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="student in students" :key="'avg-' + student.id">
                        <td>
                          <p class="font-medium text-gray-900 text-xs">{{ student.first_name }} {{ student.last_name }}</p>
                        </td>
                        <td v-for="act in gridActivities" :key="act.id" class="text-center">
                          <span v-if="getGradeForStudentActivity(student.id, act.id)"
                            class="font-semibold text-xs" :class="gradeColor(getGradeForStudentActivity(student.id, act.id)?.numeric_grade)">
                            {{ getGradeForStudentActivity(student.id, act.id)?.numeric_grade }}
                          </span>
                          <span v-else class="text-gray-300 text-xs">—</span>
                        </td>
                        <td class="text-center">
                          <span class="font-bold text-sm" :class="gradeColor(weightedAverage(student.id))">
                            {{ weightedAverage(student.id) }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

    </div><!-- /main content -->

    <!-- Modal árbol malla -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm" @click.self="closeDetailsModal">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div class="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 class="font-bold text-gray-900">Árbol Curricular</h2>
            <p class="text-xs text-gray-500 mt-0.5" v-if="selectedMalla">
              {{ selectedMalla.grade_name }} · {{ selectedMalla.subject_name }}
              <span v-if="selectedMalla.period" class="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-medium">Período {{ selectedMalla.period }}</span>
            </p>
          </div>
          <button @click="closeDetailsModal" class="btn-ghost btn-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="overflow-y-auto p-5 space-y-3" v-if="selectedMalla">
          <div v-if="!selectedMalla.tree || selectedMalla.tree.length === 0" class="text-center py-8 text-gray-400 text-sm">
            Sin contenido en esta malla
          </div>

          <!-- Nivel 1: Unidades Temáticas (base + extras de topic inyectados) -->
          <div v-for="topic in selectedMalla.tree" :key="topic.id"
            class="rounded-xl overflow-hidden"
            :class="topic.isExtra ? 'border-2 border-amber-400 ring-1 ring-amber-200' : 'border border-indigo-200'">

            <!-- Header topic -->
            <div class="px-4 py-2.5 flex items-start gap-2"
              :class="topic.isExtra ? 'bg-amber-50' : 'bg-indigo-50'">
              <svg class="w-3.5 h-3.5 flex-shrink-0 mt-0.5" :class="topic.isExtra ? 'text-amber-500' : 'text-indigo-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13"/></svg>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-[10px] font-bold uppercase tracking-wide" :class="topic.isExtra ? 'text-amber-600' : 'text-indigo-600'">Unidad Temática</span>
                  <span v-if="topic.isExtra" class="px-1.5 py-0.5 bg-amber-400 text-white text-[10px] font-bold rounded">Añadido por ti</span>
                </div>
                <p class="text-sm font-semibold mt-0.5" :class="topic.isExtra ? 'text-amber-900' : 'text-indigo-900'">{{ topic.name }}</p>
                <p v-if="topic.description" class="text-xs mt-0.5 leading-snug" :class="topic.isExtra ? 'text-amber-700' : 'text-indigo-600'">{{ topic.description }}</p>
              </div>
            </div>

            <!-- Nivel 2: Componentes -->
            <div v-if="topic.components.length" class="p-3 space-y-2">
              <div v-for="comp in topic.components" :key="comp.id"
                class="rounded-lg overflow-hidden"
                :class="comp.isExtra ? 'border-2 border-amber-300' : 'border border-emerald-200'">
                <div class="px-3 py-2 flex items-start gap-2"
                  :class="comp.isExtra ? 'bg-amber-50' : 'bg-emerald-50'">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="text-[10px] font-bold uppercase tracking-wide" :class="comp.isExtra ? 'text-amber-600' : 'text-emerald-600'">Componente</span>
                      <span v-if="comp.isExtra" class="px-1.5 py-0.5 bg-amber-400 text-white text-[10px] font-bold rounded">Añadido por ti</span>
                    </div>
                    <p class="text-xs font-semibold mt-0.5" :class="comp.isExtra ? 'text-amber-900' : 'text-emerald-900'">{{ comp.name }}</p>
                    <p v-if="comp.description" class="text-xs mt-0.5 leading-snug" :class="comp.isExtra ? 'text-amber-700' : 'text-emerald-700'">{{ comp.description }}</p>
                  </div>
                </div>

                <!-- Nivel 3: Estándares -->
                <div class="p-2 space-y-2">
                  <div v-for="std in comp.standards" :key="std.id"
                    class="rounded-lg overflow-hidden"
                    :class="std.isExtra ? 'border-2 border-amber-300' : 'border border-amber-200'">
                    <div class="px-3 py-1.5" :class="std.isExtra ? 'bg-amber-50' : 'bg-amber-50'">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="text-[10px] font-bold uppercase tracking-wide" :class="std.isExtra ? 'text-amber-700' : 'text-amber-600'">Estándar</span>
                        <span v-if="std.isExtra" class="px-1.5 py-0.5 bg-amber-400 text-white text-[10px] font-bold rounded">Añadido por ti</span>
                      </div>
                      <p class="text-xs mt-0.5 leading-snug" :class="std.isExtra ? 'text-amber-900 font-semibold' : 'text-amber-900'">{{ std.name }}</p>
                      <p v-if="std.description" class="text-xs mt-0.5 leading-snug text-amber-700">{{ std.description }}</p>
                    </div>

                    <!-- Nivel 4: Competencias -->
                    <div class="p-2 space-y-2">
                      <div v-for="comp2 in std.competences" :key="comp2.id"
                        class="rounded-lg overflow-hidden"
                        :class="comp2.isExtra ? 'border-2 border-amber-300' : 'border border-violet-200'">
                        <div class="px-3 py-1.5" :class="comp2.isExtra ? 'bg-amber-50' : 'bg-violet-50'">
                          <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="text-[10px] font-bold uppercase tracking-wide" :class="comp2.isExtra ? 'text-amber-600' : 'text-violet-600'">Competencia</span>
                            <span v-if="comp2.isExtra" class="px-1.5 py-0.5 bg-amber-400 text-white text-[10px] font-bold rounded">Añadido por ti</span>
                          </div>
                          <p v-if="comp2.name" class="text-xs font-semibold mt-0.5" :class="comp2.isExtra ? 'text-amber-900' : 'text-violet-900'">{{ comp2.name }}</p>
                          <p class="text-xs mt-0.5 leading-snug" :class="comp2.isExtra ? 'text-amber-800' : 'text-violet-800'">{{ comp2.description }}</p>
                        </div>

                        <!-- Nivel 5: DNA/DBA -->
                        <div class="p-2 space-y-1.5">
                          <div v-for="aff in comp2.affirmations" :key="aff.id"
                            class="rounded-lg overflow-hidden"
                            :class="aff.isExtra ? 'border-2 border-amber-300' : 'border border-pink-200'">
                            <div class="px-3 py-1.5" :class="aff.isExtra ? 'bg-amber-50' : 'bg-pink-50'">
                              <div class="flex items-center gap-1.5 flex-wrap">
                                <span class="text-[10px] font-bold uppercase tracking-wide" :class="aff.isExtra ? 'text-amber-600' : 'text-pink-600'">DBA / DNA</span>
                                <span v-if="aff.isExtra" class="px-1.5 py-0.5 bg-amber-400 text-white text-[10px] font-bold rounded">Añadido por ti</span>
                              </div>
                              <p class="text-xs font-semibold mt-0.5" :class="aff.isExtra ? 'text-amber-900' : 'text-pink-900'">{{ aff.name }}</p>
                              <p v-if="aff.description" class="text-xs mt-0.5 leading-snug" :class="aff.isExtra ? 'text-amber-700' : 'text-pink-700'">{{ aff.description }}</p>
                            </div>

                            <!-- Nivel 6: Evidencias -->
                            <div class="p-2 space-y-1">
                              <div v-for="ev in aff.evidences" :key="ev.id"
                                class="px-3 py-1.5 rounded-lg"
                                :class="ev.isExtra ? 'bg-amber-50 border-2 border-amber-300' : 'bg-gray-50 border border-gray-200'">
                                <div class="flex items-center gap-1.5 flex-wrap">
                                  <svg class="w-3 h-3 flex-shrink-0" :class="ev.isExtra ? 'text-amber-400' : 'text-rose-400'" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                                  <span class="text-[10px] font-bold uppercase tracking-wide" :class="ev.isExtra ? 'text-amber-600' : 'text-rose-500'">Evidencia</span>
                                  <span v-if="ev.isExtra" class="px-1.5 py-0.5 bg-amber-400 text-white text-[10px] font-bold rounded">Añadido por ti</span>
                                </div>
                                <p class="text-xs mt-0.5 leading-snug" :class="ev.isExtra ? 'text-amber-900' : 'text-gray-800'">{{ ev.name }}</p>
                                <p v-if="ev.description" class="text-xs mt-0.5 leading-snug" :class="ev.isExtra ? 'text-amber-700' : 'text-gray-500'">{{ ev.description }}</p>
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

          <div class="pt-3 border-t border-gray-100 flex justify-end gap-2">
            <button @click="switchToExtras" class="btn-ghost btn-sm border border-amber-300 text-amber-700">
              Personalizar
            </button>
            <button @click="() => { closeDetailsModal(); openWeekSchedule(selectedMalla) }" class="btn-primary btn-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Planificar semanas
            </button>
            <button @click="closeDetailsModal" class="btn-secondary btn-sm">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Modal: Personalizar malla (extras del docente) ── -->
    <div v-if="showExtrasModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm" @click.self="closeExtrasModal">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        <!-- Header -->
        <div class="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 class="font-bold text-gray-900">Personalizar malla</h2>
            <p class="text-xs text-gray-500 mt-0.5" v-if="editingMallaGroup">
              {{ editingMallaGroup.grade_name }} · {{ editingMallaGroup.subject_name }}
              <span v-if="editingMallaGroup.period" class="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-semibold">P{{ editingMallaGroup.period }}</span>
              <span class="ml-2 text-amber-600 font-medium">· Solo visible para ti</span>
            </p>
          </div>
          <button @click="closeExtrasModal" class="btn-ghost btn-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Category tabs -->
        <div class="flex gap-0 border-b border-gray-100 overflow-x-auto flex-shrink-0 px-2 pt-2">
          <button v-for="cat in extraCategories" :key="cat.key"
            @click="selectExtraCategory(cat.key)"
            class="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-all whitespace-nowrap"
            :class="activeExtraCategory === cat.key
              ? 'border-amber-500 text-amber-700 bg-amber-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'">
            {{ cat.label }}
            <span v-if="extrasForCategory(cat.key).length"
              class="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold">
              +{{ extrasForCategory(cat.key).length }}
            </span>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-5">

          <!-- Loading catalog -->
          <div v-if="loadingCatalog" class="flex items-center justify-center py-8">
            <div class="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span class="text-sm text-gray-500">Cargando elementos disponibles...</span>
          </div>

          <div v-else class="space-y-4">

            <!-- Elementos ya añadidos por el docente -->
            <div v-if="extrasForCategory(activeExtraCategory).length">
              <h4 class="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">Elementos que añadiste</h4>
              <div class="space-y-1">
                <div v-for="extra in extrasForCategory(activeExtraCategory)" :key="extra.id"
                  class="flex items-center justify-between gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <span class="text-xs text-amber-900 flex-1">{{ extra.item_name }}</span>
                  <button @click="removeExtra(extra)" class="text-red-400 hover:text-red-600 flex-shrink-0 text-sm leading-none p-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div v-if="extrasForCategory(activeExtraCategory).length" class="border-t border-gray-200"></div>

            <!-- Elementos disponibles del catálogo -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-xs font-bold text-gray-600 uppercase tracking-wide">Disponibles para agregar</h4>
                <input v-model="catalogSearch" type="text" placeholder="Buscar..." class="input text-xs py-1 w-44"/>
              </div>

              <div v-if="filteredCatalog.length === 0" class="text-center py-6 text-gray-400 text-sm">
                {{ catalogSearch ? 'Sin resultados para "' + catalogSearch + '"' : 'Todos ya están en tu malla' }}
              </div>

              <div class="space-y-1 max-h-60 overflow-y-auto pr-1">
                <div v-for="item in filteredCatalog" :key="item.id"
                  class="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
                  <span class="text-xs text-gray-800 flex-1">{{ item.name }}</span>
                  <button @click="addExtra(item)" :disabled="addingExtra === item.id"
                    class="flex items-center gap-1 px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors flex-shrink-0 disabled:opacity-60">
                    <svg v-if="addingExtra !== item.id" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    <svg v-else class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-100 flex-shrink-0 flex justify-end gap-2">
          <button @click="closeExtrasModal" class="btn-secondary btn-sm">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="slide-up">
      <div v-if="toastMsg" class="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white flex items-center gap-2"
        :class="toastType === 'success' ? 'bg-emerald-600' : 'bg-red-600'">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path v-if="toastType === 'success'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        {{ toastMsg }}
      </div>
    </Transition>

    <!-- ══ MODAL: Cronograma por Semanas ══ -->
    <div v-if="showWeekScheduleModal"
      class="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-[96vw] my-4 flex flex-col"
        style="max-height: calc(100vh - 2rem)">

        <!-- ── Header ── -->
        <div class="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
          <div class="flex-1 min-w-0">
            <h2 class="font-bold text-gray-900 text-base">Cronograma por Semanas</h2>
            <p class="text-xs text-gray-500 mt-0.5 truncate" v-if="weekScheduleMalla">
              {{ weekScheduleMalla.grade_name }} · {{ weekScheduleMalla.subject_name }}
              <span v-if="weekScheduleMalla.period" class="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-medium">Período {{ weekScheduleMalla.period }}</span>
            </p>
          </div>

          <!-- Tabs -->
          <div class="flex rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
            <button @click="scheduleView = 'plan'"
              class="px-3 py-1.5 text-xs font-semibold transition-colors"
              :class="scheduleView === 'plan' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'">
              <svg class="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Planificación
            </button>
            <button @click="scheduleView = 'track'"
              class="px-3 py-1.5 text-xs font-semibold transition-colors border-l border-gray-200"
              :class="scheduleView === 'track' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'">
              <svg class="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Seguimiento
            </button>
          </div>

          <!-- Semanas (only in plan mode) -->
          <div v-if="scheduleView === 'plan'" class="flex items-center gap-2 flex-shrink-0">
            <label class="text-xs text-gray-500 font-medium hidden sm:block">Semanas:</label>
            <input v-model.number="totalWeeks" type="number" min="4" max="52" step="4"
              class="input w-14 text-xs py-1 text-center font-semibold">
          </div>

          <button @click="closeWeekSchedule" class="btn-ghost btn-sm flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- ══════════════ VISTA: PLANIFICACIÓN ══════════════ -->
        <template v-if="scheduleView === 'plan'">

          <!-- Legend -->
          <div class="flex items-center gap-x-4 gap-y-1 px-5 py-2 bg-slate-50 border-b border-gray-100 flex-shrink-0 flex-wrap">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Referencias</span>
            <div v-for="(cfg, type) in nodeTypeConfig" :key="type" class="flex items-center gap-1">
              <span class="w-2.5 h-2.5 rounded-sm flex-shrink-0" :class="cfg.cell"></span>
              <span class="text-[11px] text-gray-600">{{ cfg.name }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="w-2.5 h-2.5 rounded-sm bg-amber-400 flex-shrink-0"></span>
              <span class="text-[11px] text-amber-700 font-medium">Añadido por ti</span>
            </div>
            <span class="ml-auto text-[11px] text-gray-400 hidden sm:block">Clic en celda para asignar/quitar semana</span>
          </div>

          <!-- Gantt -->
          <div class="overflow-auto flex-1" style="min-height: 200px">
            <div v-if="flatScheduleNodes.length === 0" class="py-16 text-center text-gray-400 text-sm">
              Esta malla no tiene contenido en el árbol curricular.
            </div>
            <table v-else class="border-collapse" style="min-width: max-content">
              <thead class="sticky top-0 z-20">
                <tr class="bg-slate-100">
                  <th class="sticky left-0 z-30 bg-slate-100 border-b border-r-2 border-gray-300 px-4 py-1.5 text-left min-w-[14rem] w-56">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Elemento</span>
                  </th>
                  <template v-for="blk in Math.ceil(totalWeeks / 4)" :key="blk">
                    <th :colspan="Math.min(4, totalWeeks - (blk - 1) * 4)"
                      class="border-b border-r-2 border-gray-300 text-center py-1">
                      <span class="text-[10px] font-semibold text-gray-500">Bloque {{ blk }}</span>
                    </th>
                  </template>
                </tr>
                <tr class="bg-slate-50">
                  <th class="sticky left-0 z-30 bg-slate-50 border-b border-r-2 border-gray-300 px-4 py-1 min-w-[14rem] w-56"></th>
                  <th v-for="w in totalWeeks" :key="w"
                    class="border-b border-gray-200 py-1 text-center"
                    :class="w % 4 === 0 ? 'border-r-2 border-r-slate-300' : 'border-r border-r-slate-100'"
                    style="width: 1.875rem; min-width: 1.875rem">
                    <span class="text-[10px] font-medium" :class="w % 4 === 0 ? 'text-slate-500' : 'text-slate-400'">{{ w }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="node in flatScheduleNodes" :key="`${node.type}:${node.id}`"
                  class="border-b border-gray-100 group hover:bg-slate-50/60 transition-colors">
                  <td class="sticky left-0 bg-white group-hover:bg-slate-50/80 border-r-2 border-gray-200 z-10 py-2 transition-colors"
                    :style="{ paddingLeft: `${node.depth * 14 + 12}px`, paddingRight: '12px' }">
                    <div class="flex items-start gap-2" style="max-width: 200px">
                      <span class="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5" :class="nodeDotClass(node)"></span>
                      <div class="min-w-0 flex-1">
                        <p class="text-xs font-medium leading-tight truncate" :class="node.isExtra ? 'text-amber-800' : 'text-gray-800'">
                          {{ node.name }}<span v-if="node.isExtra" class="text-[9px] text-amber-500 font-bold ml-0.5">+</span>
                        </p>
                        <p class="text-[10px] leading-none mt-0.5" :class="node.isExtra ? 'text-amber-500' : 'text-gray-400'">{{ nodeLabel(node) }}</p>
                      </div>
                    </div>
                  </td>
                  <td v-for="w in totalWeeks" :key="w"
                    class="p-0 cursor-pointer transition-colors"
                    :class="[w % 4 === 0 ? 'border-r-2 border-r-slate-200' : 'border-r border-r-slate-100', !isWeekAssigned(node, w) ? 'hover:bg-indigo-50' : '']"
                    style="width: 1.875rem; min-width: 1.875rem; height: 2.25rem"
                    @click="toggleWeek(node, w)">
                    <div class="w-full h-full flex items-center justify-center">
                      <div v-if="isWeekAssigned(node, w)" class="rounded-sm" :class="cellFillClass(node)" style="width: 1.25rem; height: 1.25rem"></div>
                      <div v-else class="rounded-sm bg-slate-100 group-hover:bg-slate-200 transition-colors" style="width: 1.25rem; height: 1.25rem"></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Correr cronograma panel -->
          <div class="px-5 py-2.5 bg-slate-50 border-t border-gray-100 flex-shrink-0">
            <button v-if="!showShiftPanel" @click="showShiftPanel = true"
              class="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
              Correr cronograma (desplazar semanas)
            </button>
            <div v-else class="flex flex-wrap items-center gap-3">
              <span class="text-xs font-semibold text-slate-700">Desplazar semanas</span>
              <div class="flex items-center gap-1.5 text-xs text-slate-600">
                <span>desde sem.</span>
                <input v-model.number="shiftFromWeek" type="number" min="1" :max="totalWeeks" class="input w-14 text-xs py-1 text-center">
              </div>
              <div class="flex items-center gap-1.5 text-xs text-slate-600">
                <span>→ adelantar</span>
                <input v-model.number="shiftByWeeks" type="number" min="1" max="20" class="input w-14 text-xs py-1 text-center">
                <span>sem.</span>
              </div>
              <button @click="applyShift"
                class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors">
                Aplicar
              </button>
              <button @click="showShiftPanel = false" class="text-xs text-gray-400 hover:text-gray-600">Cancelar</button>
              <span class="text-[10px] text-gray-400 hidden sm:block">Las semanas planificadas a partir de la semana indicada se desplazarán hacia adelante.</span>
            </div>
          </div>

          <!-- Footer Planificación -->
          <div class="px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-3 flex-shrink-0">
            <p class="text-xs text-gray-400">
              <span class="font-semibold text-gray-600">{{ scheduledCount }}</span> elemento{{ scheduledCount !== 1 ? 's' : '' }} con semanas asignadas
            </p>
            <div class="flex gap-2">
              <button @click="closeWeekSchedule" class="btn-secondary btn-sm">Cancelar</button>
              <button @click="saveWeekSchedule" :disabled="savingWeekSchedule" class="btn-primary btn-sm">
                <svg v-if="savingWeekSchedule" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                {{ savingWeekSchedule ? 'Guardando...' : 'Guardar planificación' }}
              </button>
            </div>
          </div>

        </template>

        <!-- ══════════════ VISTA: SEGUIMIENTO ══════════════ -->
        <template v-else-if="scheduleView === 'track'">

          <!-- Stats bar -->
          <div class="flex items-center gap-4 px-5 py-2.5 bg-emerald-50 border-b border-emerald-100 flex-shrink-0 flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span class="text-xs text-emerald-700 font-medium">{{ obsStats.done }} ejecutadas</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span class="text-xs text-rose-600 font-medium">{{ obsStats.pending }} pendientes / no ejecutadas</span>
            </div>
            <span class="text-xs text-gray-500">de {{ obsStats.total }} semanas planificadas</span>
            <span class="ml-auto text-[11px] text-gray-400">Marca cada semana como ejecutada y agrega observaciones si aplica</span>
          </div>

          <!-- Tracking list -->
          <div class="overflow-y-auto flex-1 p-4 space-y-3">

            <div v-if="nodesWithWeeks.length === 0" class="py-12 text-center text-gray-400 text-sm">
              <svg class="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              No hay semanas planificadas. Ve a <strong>Planificación</strong> y asigna semanas primero.
            </div>

            <div v-for="node in nodesWithWeeks" :key="`track-${node.type}:${node.id}`"
              class="rounded-xl border overflow-hidden"
              :class="node.isExtra ? 'border-amber-200' : 'border-gray-200'">

              <!-- Node header -->
              <div class="flex items-center gap-2 px-4 py-2.5"
                :class="node.isExtra ? 'bg-amber-50' : 'bg-slate-50'">
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :class="nodeDotClass(node)"></span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold truncate" :class="node.isExtra ? 'text-amber-900' : 'text-gray-800'">
                    {{ node.name }}
                    <span v-if="node.isExtra" class="text-[10px] text-amber-500 font-bold ml-1">+</span>
                  </p>
                  <p class="text-[10px]" :class="node.isExtra ? 'text-amber-600' : 'text-gray-400'">{{ nodeLabel(node) }}</p>
                </div>
                <!-- mini week chips -->
                <div class="flex flex-wrap gap-1">
                  <span v-for="w in node.weeks" :key="w"
                    class="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                    :class="getObs(node, w).executed
                      ? 'bg-emerald-100 text-emerald-700'
                      : (getObs(node, w).observation ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-500')">
                    S{{ w }}
                  </span>
                </div>
              </div>

              <!-- Weeks tracking rows -->
              <div class="divide-y divide-gray-100">
                <div v-for="w in node.weeks" :key="`w-${w}`"
                  class="px-4 py-3 flex flex-wrap gap-3 items-start"
                  :class="getObs(node, w).executed ? 'bg-emerald-50/40' : ''">

                  <!-- Week + toggle -->
                  <div class="flex items-center gap-3 flex-shrink-0 w-44">
                    <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm"
                      :class="getObs(node, w).executed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'">
                      {{ w }}
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-gray-700">Semana {{ w }}</p>
                      <label class="flex items-center gap-1.5 cursor-pointer mt-0.5">
                        <input type="checkbox" :checked="getObs(node, w).executed"
                          @change="e => { getObs(node, w).executed = e.target.checked; if (e.target.checked) { getObs(node, w).observation = ''; getObs(node, w).rescheduled_week = null } }"
                          class="w-3.5 h-3.5 rounded accent-emerald-600">
                        <span class="text-[11px]" :class="getObs(node, w).executed ? 'text-emerald-700 font-semibold' : 'text-gray-500'">
                          {{ getObs(node, w).executed ? 'Ejecutada' : 'No ejecutada' }}
                        </span>
                      </label>
                    </div>
                  </div>

                  <!-- Observation + reschedule (solo si no ejecutada) -->
                  <div v-if="!getObs(node, w).executed" class="flex-1 flex flex-wrap gap-3 min-w-0">
                    <div class="flex-1 min-w-[180px]">
                      <label class="text-[10px] font-semibold text-rose-500 uppercase tracking-wide">Justificación / Observación</label>
                      <textarea v-model="getObs(node, w).observation" rows="2"
                        placeholder="Ej: festivo, actividad institucional, grupo sin asistencia..."
                        class="input w-full text-xs mt-1 resize-none leading-snug py-1.5">
                      </textarea>
                    </div>
                    <div class="w-40 flex-shrink-0">
                      <label class="text-[10px] font-semibold text-indigo-500 uppercase tracking-wide">Correr a semana</label>
                      <div class="flex items-center gap-2 mt-1">
                        <input v-model.number="getObs(node, w).rescheduled_week" type="number" min="1" max="52"
                          placeholder="Sem. #"
                          class="input w-full text-xs py-1.5 text-center">
                        <span v-if="getObs(node, w).rescheduled_week"
                          class="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded font-medium whitespace-nowrap flex-shrink-0">
                          → S{{ getObs(node, w).rescheduled_week }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Ejecutada: muestra resumen -->
                  <div v-else class="flex items-center gap-2 text-xs text-emerald-600">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    <span class="font-medium">Semana ejecutada según lo planificado</span>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <!-- Footer Seguimiento -->
          <div class="px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-3 flex-shrink-0">
            <p class="text-xs text-gray-400">
              <span class="font-semibold text-emerald-600">{{ obsStats.done }}</span>/{{ obsStats.total }} semanas ejecutadas ·
              <span class="font-semibold text-rose-500">{{ obsStats.pending }}</span> pendientes
            </p>
            <div class="flex gap-2">
              <button @click="closeWeekSchedule" class="btn-secondary btn-sm">Cancelar</button>
              <button @click="saveObservations" :disabled="savingObs" class="btn-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors px-4">
                <svg v-if="savingObs" class="animate-spin w-3.5 h-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                {{ savingObs ? 'Guardando...' : 'Guardar seguimiento' }}
              </button>
            </div>
          </div>

        </template>

      </div>
    </div>
    <!-- ══ /MODAL: Cronograma por Semanas ══ -->

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { curriculumAssignmentService } from '@/api/curriculumAssignmentService'
import { scheduleService } from '@/api/scheduleService'
import { materialService, teacherGradesService } from '@/api/materialService'
import { submissionService } from '@/api/submissionService'
import { teacherMallaExtrasService } from '@/api/teacherMallaExtrasService'
import { teacherWeekScheduleService, teacherScheduleObservationService } from '@/api/teacherWeekScheduleService'

const router = useRouter()
const authStore = useAuthStore()

// ── Estado general ──
const activeTab = ref('assignments')
const toastMsg = ref('')
const toastType = ref('success')

const tabs = [
  { key: 'assignments', label: 'Mis Mallas',           icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { key: 'materials',   label: 'Material y Actividades', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { key: 'grades',      label: 'Calificaciones',        icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
]

// ── Mallas ──
const assignments = ref([])
const schedules = ref([])
const loadingAssignments = ref(false)
const filterGrade = ref(null)
const filterSubject = ref(null)
const showDetailsModal = ref(false)
const selectedMallaKey = ref(null)

function buildMallaTree(records, allExtras = {}) {
  const extraTopics      = allExtras.topic       || []
  const extraComponents  = allExtras.component   || []
  const extraStandards   = allExtras.standard    || []
  const extraCompetences = allExtras.competence  || []
  const extraAffirms     = allExtras.affirmation || []
  const extraEvidences   = allExtras.evidence    || []

  const topicMap = new Map()

  // ── Build base tree from curriculum_grid records ──
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

  // ── Inject extra topics as standalone root nodes ──
  for (const extra of extraTopics) {
    const key = 'x-topic-' + extra.item_id
    if (!topicMap.has(key)) {
      topicMap.set(key, {
        id: key, name: extra.item_name, description: extra.item_description ?? null,
        isExtra: true, components: new Map(),
      })
    }
  }

  // ── Inject extra components under every topic ──
  for (const tNode of topicMap.values()) {
    for (const extra of extraComponents) {
      const key = 'x-comp-' + extra.item_id
      if (!tNode.components.has(key)) {
        tNode.components.set(key, {
          id: key, name: extra.item_name, description: extra.item_description ?? null,
          isExtra: true, standards: new Map(),
        })
      }
    }
  }

  // ── Inject extra standards under every component ──
  for (const tNode of topicMap.values()) {
    for (const cNode of tNode.components.values()) {
      for (const extra of extraStandards) {
        const key = 'x-std-' + extra.item_id
        if (!cNode.standards.has(key)) {
          cNode.standards.set(key, {
            id: key, name: extra.item_name, description: extra.item_description ?? null,
            isExtra: true, competences: new Map(),
          })
        }
      }
    }
  }

  // ── Inject extra competences under every standard ──
  for (const tNode of topicMap.values()) {
    for (const cNode of tNode.components.values()) {
      for (const sNode of cNode.standards.values()) {
        for (const extra of extraCompetences) {
          const key = 'x-comp2-' + extra.item_id
          if (!sNode.competences.has(key)) {
            sNode.competences.set(key, {
              id: key, name: extra.item_name, description: extra.item_description ?? null,
              isExtra: true, affirmations: new Map(),
            })
          }
        }
      }
    }
  }

  // ── Inject extra affirmations under every competence ──
  for (const tNode of topicMap.values()) {
    for (const cNode of tNode.components.values()) {
      for (const sNode of cNode.standards.values()) {
        for (const kNode of sNode.competences.values()) {
          for (const extra of extraAffirms) {
            const key = 'x-aff-' + extra.item_id
            if (!kNode.affirmations.has(key)) {
              kNode.affirmations.set(key, {
                id: key, name: extra.item_name, description: extra.item_description ?? null,
                isExtra: true, evidences: new Map(),
              })
            }
          }
        }
      }
    }
  }

  // ── Inject extra evidences under every affirmation ──
  for (const tNode of topicMap.values()) {
    for (const cNode of tNode.components.values()) {
      for (const sNode of cNode.standards.values()) {
        for (const kNode of sNode.competences.values()) {
          for (const aNode of kNode.affirmations.values()) {
            for (const extra of extraEvidences) {
              const key = 'x-ev-' + extra.item_id
              if (!aNode.evidences.has(key)) {
                aNode.evidences.set(key, {
                  id: key, name: extra.item_name, description: extra.item_description ?? null,
                  isExtra: true,
                })
              }
            }
          }
        }
      }
    }
  }

  return [...topicMap.values()].map(t => ({
    ...t,
    components: [...t.components.values()].map(c => ({
      ...c,
      standards: [...c.standards.values()].map(s => ({
        ...s,
        competences: [...s.competences.values()].map(k => ({
          ...k,
          affirmations: [...k.affirmations.values()].map(a => ({
            ...a,
            evidences: [...a.evidences.values()]
          }))
        }))
      }))
    }))
  }))
}

const countUnique = (records, field) =>
  new Set(records.flatMap(r => (r[field] || []).map(x => x.id))).size

// ── Extras del docente ──
const allExtras = ref([])
const showExtrasModal = ref(false)
const editingMallaGroup = ref(null)
const activeExtraCategory = ref('topic')
const catalogItems = ref([])
const loadingCatalog = ref(false)
const catalogSearch = ref('')
const addingExtra = ref(null)

const extraCategories = [
  { key: 'topic',       label: 'Unidades' },
  { key: 'component',   label: 'Componentes' },
  { key: 'standard',    label: 'Estándares' },
  { key: 'competence',  label: 'Competencias' },
  { key: 'affirmation', label: 'DNA/DBA' },
  { key: 'evidence',    label: 'Evidencias' },
]

const extrasForCategory = (cat) => {
  if (!editingMallaGroup.value) return []
  const g = editingMallaGroup.value
  return allExtras.value.filter(e =>
    e.category === cat &&
    String(e.grade_id) === String(g.grade_id) &&
    String(e.subject_id) === String(g.subject_id) &&
    String(e.period ?? '') === String(g.period ?? '')
  )
}

const catFieldMap = { topic: 'topics', component: 'components', standard: 'standards', competence: 'competences', affirmation: 'affirmations', evidence: 'evidences' }

const filteredCatalog = computed(() => {
  if (!editingMallaGroup.value) return []
  const field = catFieldMap[activeExtraCategory.value]
  const baseIds = new Set(editingMallaGroup.value.records.flatMap(r => (r[field] || []).map(x => x.id)))
  const extraIds = new Set(extrasForCategory(activeExtraCategory.value).map(e => e.item_id))
  const search = catalogSearch.value.toLowerCase()
  return catalogItems.value.filter(item =>
    !baseIds.has(item.id) &&
    !extraIds.has(item.id) &&
    (!search || item.name.toLowerCase().includes(search))
  )
})

const groupedMallas = computed(() => {
  const groups = new Map()
  for (const a of assignments.value) {
    const key = `${a.grade_id}-${a.subject_id}-${a.period ?? 'null'}`
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        grade_id: a.grade_id,
        grade_name: a.grade_name,
        subject_id: a.subject_id,
        subject_name: a.subject_name,
        period: a.period ?? null,
        school_name: a.school_name,
        records: [],
      })
    }
    groups.get(key).records.push(a)
  }
  return [...groups.values()].map(g => {
    // Gather extras for this malla group, organized by category
    const mallaExtras = {}
    for (const cat of extraCategories) {
      mallaExtras[cat.key] = allExtras.value.filter(e =>
        e.category === cat.key &&
        String(e.grade_id) === String(g.grade_id) &&
        String(e.subject_id) === String(g.subject_id) &&
        String(e.period ?? '') === String(g.period ?? '')
      )
    }
    return {
      ...g,
      tree: buildMallaTree(g.records, mallaExtras),
      totalEvidences: new Set(g.records.flatMap(r => (r.evidences || []).map(e => e.id))).size,
      extras: mallaExtras,
    }
  })
})

const selectedMalla = computed(() =>
  groupedMallas.value.find(m => m.key === selectedMallaKey.value) ?? null
)
const uniqueGrades = computed(() => [...new Set(groupedMallas.value.map(g => g.grade_name))].sort())
const uniqueSubjects = computed(() => [...new Set(groupedMallas.value.map(g => g.subject_name))].sort())
const filteredGroupedMallas = computed(() => {
  let r = groupedMallas.value
  if (filterGrade.value) r = r.filter(g => g.grade_name === filterGrade.value)
  if (filterSubject.value) r = r.filter(g => g.subject_name === filterSubject.value)
  return r
})
const totalSchedules = computed(() => schedules.value.length)
const executedSchedules = computed(() => schedules.value.filter(s => s.executed).length)
const completionPercentage = computed(() => {
  if (!totalSchedules.value) return 0
  return Math.round((executedSchedules.value / totalSchedules.value) * 100)
})

// ── Materiales ──
const myMaterials = ref([])
const loadingMaterials = ref(false)
const savingMaterial = ref(false)
const editingMaterial = ref(null)
const matForm = ref({ title: '', type: 'Actividad', activity_type: 'informativo', curriculum_grid_id: null, week: null, percentage: null, description: '', content: '', due_date: '', questions: [] })

const activityTypeOpts = [
  { value: 'informativo', label: 'Informativo', icon: '📄' },
  { value: 'quiz',        label: 'Quiz',        icon: '✅' },
  { value: 'entrega',     label: 'Entrega',     icon: '📎' },
]

const addQuestion = () => {
  matForm.value.questions.push({
    id: Date.now(),
    text: '',
    options: ['', '', '', ''],
    correct: 0
  })
}
const removeQuestion = (idx) => matForm.value.questions.splice(idx, 1)

// ── Calificaciones ──
const students = ref([])
const savedGrades = ref([])
const allGridGrades = ref([])
const gridActivities = ref([])
const activitySubmissions = ref([]) // submissions for selected activity
const loadingStudents = ref(false)
const savingGrade = ref(false)
const selectedStudent = ref(null)
const gradeForm = ref({ assignment: null, activity: null })
const gradeInput = ref({ numeric_grade: '', letter_grade: '', observation: '' })

const totalPct = computed(() =>
  gridActivities.value.reduce((s, a) => s + Number(a.percentage || 0), 0)
)

// ── Helpers visuales ──
const typeColor = (type) => {
  const m = {
    Tarea:     { bg: 'bg-amber-100',   text: 'text-amber-600',   badge: 'badge-yellow' },
    Actividad: { bg: 'bg-indigo-100',  text: 'text-indigo-600',  badge: 'badge-blue'   },
    Material:  { bg: 'bg-emerald-100', text: 'text-emerald-600', badge: 'badge-green'  },
    Video:     { bg: 'bg-violet-100',  text: 'text-violet-600',  badge: 'badge-purple' },
    Documento: { bg: 'bg-gray-100',    text: 'text-gray-600',    badge: 'badge-gray'   },
  }
  return m[type] || { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'badge-gray' }
}

const typeIcon = (type) => {
  const m = {
    Tarea:     'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    Video:     'M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    Documento: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  }
  return m[type] || 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
}

const gradeColor = (g) => {
  const n = parseFloat(g)
  if (n >= 4.5) return 'text-emerald-600'
  if (n >= 3.5) return 'text-indigo-600'
  if (n >= 3.0) return 'text-amber-600'
  return 'text-red-600'
}

const letterBadge = (l) => {
  const m = { Superior: 'badge-green', Alto: 'badge-blue', Básico: 'badge-yellow', Bajo: 'badge-red' }
  return m[l] || 'badge-gray'
}

const getStudentGrade = (studentId) =>
  savedGrades.value.find(g => Number(g.student_id) === Number(studentId))

const getGradeForStudentActivity = (studentId, activityId) =>
  allGridGrades.value.find(g => Number(g.student_id) === Number(studentId) && g.material_id === activityId)

const weightedAverage = (studentId) => {
  let sumW = 0, sumP = 0
  for (const act of gridActivities.value) {
    const g = getGradeForStudentActivity(studentId, act.id)
    if (g) {
      const pct = Number(act.percentage || 0)
      sumW += Number(g.numeric_grade) * pct
      sumP += pct
    }
  }
  if (!sumP) return '—'
  return (sumW / sumP).toFixed(2)
}

const autoLevel = () => {
  const n = gradeInput.value.numeric_grade
  if (!n) return
  if (n >= 4.6) gradeInput.value.letter_grade = 'Superior'
  else if (n >= 4.0) gradeInput.value.letter_grade = 'Alto'
  else if (n >= 3.0) gradeInput.value.letter_grade = 'Básico'
  else gradeInput.value.letter_grade = 'Bajo'
}

const getSubmission = (studentId) =>
  activitySubmissions.value.find(s => Number(s.student_id) === Number(studentId))

const quizAutoScore = (studentId) => {
  const sub = getSubmission(studentId)
  if (!sub || !gradeForm.value.activity?.questions?.length) return '0.0'
  const score = (sub.correct_count / gradeForm.value.activity.questions.length) * 5
  return score.toFixed(1)
}

const downloadSubmissionFile = (sub) => {
  if (!sub?.file_data) return
  const a = document.createElement('a')
  a.href = sub.file_data
  a.download = sub.file_name || 'entrega'
  a.click()
}

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const showToast = (msg, type = 'success') => {
  toastMsg.value = msg
  toastType.value = type
  setTimeout(() => { toastMsg.value = '' }, 3500)
}

// ── Acciones: Mallas ──
const loadAssignments = async () => {
  loadingAssignments.value = true
  try {
    assignments.value = await curriculumAssignmentService.getMyAssignments()
  } catch {
    showToast('Error al cargar mallas asignadas', 'error')
  } finally {
    loadingAssignments.value = false
  }
}

const loadSchedules = async () => {
  try {
    const resp = await scheduleService.getAll({}, 1, 1000)
    schedules.value = resp.data || resp
  } catch { /* silencioso */ }
}

const closeDetailsModal = () => { showDetailsModal.value = false }
const closeExtrasModal  = () => { showExtrasModal.value  = false }

const viewMallaDetails = (malla) => {
  selectedMallaKey.value = malla.key
  showDetailsModal.value = true
}

const switchToExtras = () => {
  if (selectedMalla.value) openEditExtras(selectedMalla.value)
  showDetailsModal.value = false
}

// ── Cronograma por semanas ──
const showWeekScheduleModal = ref(false)
const weekScheduleMalla     = ref(null)
const totalWeeks            = ref(40)
const savingWeekSchedule    = ref(false)
const weekScheduleData      = reactive({}) // key: 'type:id' → number[]

const nodeTypeConfig = {
  topic:       { name: 'Unidad Temática', dot: 'bg-indigo-500',  cell: 'bg-indigo-500'  },
  component:   { name: 'Componente',      dot: 'bg-emerald-500', cell: 'bg-emerald-500' },
  standard:    { name: 'Estándar',        dot: 'bg-amber-500',   cell: 'bg-amber-500'   },
  competence:  { name: 'Competencia',     dot: 'bg-violet-500',  cell: 'bg-violet-500'  },
  affirmation: { name: 'DBA / DNA',       dot: 'bg-pink-500',    cell: 'bg-pink-500'    },
  evidence:    { name: 'Evidencia',       dot: 'bg-rose-500',    cell: 'bg-rose-500'    },
}

function flattenForSchedule(tree) {
  const seen  = new Set()
  const nodes = []
  function visit(item, type, depth) {
    const key = `${type}:${item.id}`
    if (seen.has(key)) return
    seen.add(key)
    nodes.push({ type, id: String(item.id), name: item.name || item.description || '', isExtra: item.isExtra ?? false, depth })
  }
  for (const topic of tree) {
    visit(topic, 'topic', 0)
    for (const comp of (topic.components || [])) {
      visit(comp, 'component', 1)
      for (const std of (comp.standards || [])) {
        visit(std, 'standard', 2)
        for (const k of (std.competences || [])) {
          visit(k, 'competence', 3)
          for (const aff of (k.affirmations || [])) {
            visit(aff, 'affirmation', 4)
            for (const ev of (aff.evidences || [])) {
              visit(ev, 'evidence', 5)
            }
          }
        }
      }
    }
  }
  return nodes
}

const flatScheduleNodes = computed(() =>
  weekScheduleMalla.value ? flattenForSchedule(weekScheduleMalla.value.tree) : []
)

const scheduledCount = computed(() =>
  Object.keys(weekScheduleData).filter(k => (weekScheduleData[k]?.length ?? 0) > 0).length
)

function isWeekAssigned(node, week) {
  return weekScheduleData[`${node.type}:${node.id}`]?.includes(week) ?? false
}

function toggleWeek(node, week) {
  const key = `${node.type}:${node.id}`
  if (!weekScheduleData[key]) weekScheduleData[key] = []
  const idx = weekScheduleData[key].indexOf(week)
  if (idx >= 0) weekScheduleData[key].splice(idx, 1)
  else           weekScheduleData[key].push(week)
}

function nodeLabel(node)    { return nodeTypeConfig[node.type]?.name    ?? node.type }
function nodeDotClass(node) { return node.isExtra ? 'bg-amber-400' : (nodeTypeConfig[node.type]?.dot ?? 'bg-gray-400') }
function cellFillClass(node){ return node.isExtra ? 'bg-amber-400' : (nodeTypeConfig[node.type]?.cell ?? 'bg-indigo-500') }

// ── Vista activa del modal (plan | track) ──
const scheduleView      = ref('plan')   // 'plan' | 'track'
const obsData           = reactive({}) // key: 'type:id:week' → { executed, observation, rescheduled_week }
const savingObs         = ref(false)

// Correr cronograma
const shiftFromWeek     = ref(1)
const shiftByWeeks      = ref(1)
const showShiftPanel    = ref(false)

function obsKey(node, week) { return `${node.type}:${node.id}:${week}` }

function getObs(node, week) {
  const k = obsKey(node, week)
  if (!obsData[k]) obsData[k] = { executed: false, observation: '', rescheduled_week: null }
  return obsData[k]
}

// Nodos que tienen al menos una semana planificada (para la vista Seguimiento)
const nodesWithWeeks = computed(() => {
  if (!weekScheduleMalla.value) return []
  return flatScheduleNodes.value.filter(n => {
    const weeks = weekScheduleData[`${n.type}:${n.id}`]
    return weeks && weeks.length > 0
  }).map(n => ({
    ...n,
    weeks: [...(weekScheduleData[`${n.type}:${n.id}`] || [])].sort((a, b) => a - b),
  }))
})

// Estadísticas rápidas para el footer de Seguimiento
const obsStats = computed(() => {
  let total = 0, done = 0, pending = 0
  for (const node of nodesWithWeeks.value) {
    for (const w of node.weeks) {
      total++
      const o = obsData[obsKey(node, w)]
      if (o?.executed) done++
      else pending++
    }
  }
  return { total, done, pending }
})

async function openWeekSchedule(malla) {
  weekScheduleMalla.value = malla
  scheduleView.value      = 'plan'
  showShiftPanel.value    = false
  // Clear previous data
  Object.keys(weekScheduleData).forEach(k => delete weekScheduleData[k])
  Object.keys(obsData).forEach(k => delete obsData[k])
  showWeekScheduleModal.value = true

  // Load schedule and observations in parallel
  try {
    const [schedItems, obsItems] = await Promise.all([
      teacherWeekScheduleService.getSchedule({
        grade_id:   malla.grade_id,
        subject_id: malla.subject_id,
        period:     malla.period ?? '',
      }),
      teacherScheduleObservationService.getObservations({
        grade_id:   malla.grade_id,
        subject_id: malla.subject_id,
        period:     malla.period ?? '',
      }),
    ])
    schedItems.forEach(item => {
      weekScheduleData[`${item.node_type}:${item.node_id}`] = [...(item.weeks || [])]
    })
    obsItems.forEach(item => {
      const k = `${item.node_type}:${item.node_id}:${item.week}`
      obsData[k] = {
        executed:         item.executed,
        observation:      item.observation || '',
        rescheduled_week: item.rescheduled_week,
      }
    })
  } catch {
    showToast('Error al cargar el cronograma', 'error')
  }
}

function closeWeekSchedule() {
  showWeekScheduleModal.value = false
  weekScheduleMalla.value     = null
  showShiftPanel.value        = false
}

async function saveWeekSchedule() {
  if (!weekScheduleMalla.value) return
  savingWeekSchedule.value = true
  try {
    const g     = weekScheduleMalla.value
    const nodes = flatScheduleNodes.value.map(n => ({
      node_type: n.type,
      node_id:   n.id,
      weeks:     weekScheduleData[`${n.type}:${n.id}`] || [],
    }))
    await teacherWeekScheduleService.batchSave({
      grade_id:   g.grade_id,
      subject_id: g.subject_id,
      period:     g.period ?? null,
      nodes,
    })
    showToast('Cronograma guardado exitosamente')
    closeWeekSchedule()
  } catch {
    showToast('Error al guardar el cronograma', 'error')
  } finally {
    savingWeekSchedule.value = false
  }
}

async function saveObservations() {
  if (!weekScheduleMalla.value) return
  savingObs.value = true
  try {
    const g     = weekScheduleMalla.value
    const items = []
    for (const node of nodesWithWeeks.value) {
      for (const week of node.weeks) {
        const o = obsData[obsKey(node, week)] || {}
        items.push({
          node_type:        node.type,
          node_id:          node.id,
          week,
          executed:         o.executed ? true : false,
          observation:      o.observation || null,
          rescheduled_week: o.rescheduled_week || null,
        })
      }
    }
    await teacherScheduleObservationService.batchSave({
      grade_id:   g.grade_id,
      subject_id: g.subject_id,
      period:     g.period ?? null,
      items,
    })
    showToast('Seguimiento guardado exitosamente')
    closeWeekSchedule()
  } catch {
    showToast('Error al guardar el seguimiento', 'error')
  } finally {
    savingObs.value = false
  }
}

// Correr el cronograma: desplaza semanas planificadas >= fromWeek hacia adelante por N semanas
function applyShift() {
  const from  = Number(shiftFromWeek.value)
  const delta = Number(shiftByWeeks.value)
  if (!from || !delta || delta < 1) return
  for (const node of flatScheduleNodes.value) {
    const key   = `${node.type}:${node.id}`
    const weeks = weekScheduleData[key]
    if (!weeks || !weeks.length) continue
    weekScheduleData[key] = weeks
      .map(w => w >= from ? Math.min(w + delta, 52) : w)
      .filter((w, i, arr) => arr.indexOf(w) === i) // dedup
      .sort((a, b) => a - b)
  }
  showShiftPanel.value = false
  showToast(`Semanas desde la ${from} desplazadas +${delta}`)
}

const manageSchedule = (a) => {
  router.push({ name: 'ScheduleManagement', params: { gradeId: a.grade_id, subjectId: a.subject_id, gridId: a.curriculum_grid_id } })
}

// ── Acciones: Materiales ──
const loadMyMaterials = async () => {
  loadingMaterials.value = true
  try {
    const resp = await materialService.getAll()
    myMaterials.value = resp.data?.data || resp.data || []
  } catch {
    myMaterials.value = []
  } finally {
    loadingMaterials.value = false
  }
}

const saveMaterial = async () => {
  if (!matForm.value.title) return
  savingMaterial.value = true
  try {
    if (editingMaterial.value) {
      await materialService.update(editingMaterial.value.id, matForm.value)
      showToast('Material actualizado')
    } else {
      await materialService.create(matForm.value)
      showToast('Material publicado')
    }
    cancelEditMaterial()
    loadMyMaterials()
  } catch {
    showToast('Error al guardar el material', 'error')
  } finally {
    savingMaterial.value = false
  }
}

const startEditMaterial = (m) => {
  editingMaterial.value = m
  matForm.value = {
    title: m.title, type: m.type, activity_type: m.activity_type || 'informativo',
    curriculum_grid_id: m.curriculum_grid_id, week: m.week || null, percentage: m.percentage || null,
    description: m.description || '', content: m.content || '', due_date: m.due_date || '',
    questions: m.questions ? JSON.parse(JSON.stringify(m.questions)) : []
  }
}

const cancelEditMaterial = () => {
  editingMaterial.value = null
  matForm.value = { title: '', type: 'Actividad', activity_type: 'informativo', curriculum_grid_id: null, week: null, percentage: null, description: '', content: '', due_date: '', questions: [] }
}

const deleteMaterialItem = async (id) => {
  if (!confirm('¿Eliminar este material?')) return
  try {
    await materialService.delete(id)
    showToast('Material eliminado')
    loadMyMaterials()
  } catch {
    showToast('Error al eliminar', 'error')
  }
}

// ── Acciones: Calificaciones ──
const onAssignmentChange = async () => {
  students.value = []
  savedGrades.value = []
  allGridGrades.value = []
  selectedStudent.value = null
  gradeForm.value.activity = null

  if (!gradeForm.value.assignment) { gridActivities.value = []; return }

  // Cargar actividades publicadas para esta malla
  try {
    const resp = await materialService.getAll({ curriculum_grid_id: gradeForm.value.assignment.curriculum_grid_id })
    gridActivities.value = (resp.data?.data || resp.data || []).filter(m => m.week && m.percentage)
  } catch {
    gridActivities.value = []
  }
}

const onActivityChange = () => {
  savedGrades.value = []
  selectedStudent.value = null
}

const loadStudents = async () => {
  if (!gradeForm.value.assignment || !gradeForm.value.activity) return
  loadingStudents.value = true
  try {
    const a = gradeForm.value.assignment
    const act = gradeForm.value.activity

    const [stuResp, gradesResp, allGradesResp, subResp] = await Promise.all([
      teacherGradesService.getStudents({ grade_id: a.grade_id, subject_id: a.subject_id }),
      teacherGradesService.getGrades({ material_id: act.id }),
      teacherGradesService.getGrades({ grid_id: a.curriculum_grid_id }),
      submissionService.getByMaterial(act.id),
    ])
    students.value          = stuResp.data?.data       || stuResp.data       || []
    savedGrades.value       = gradesResp.data?.data    || gradesResp.data    || []
    allGridGrades.value     = allGradesResp.data?.data || allGradesResp.data || []
    activitySubmissions.value = subResp.data?.data     || subResp.data       || []
  } catch {
    students.value = []
    showToast('Error al cargar estudiantes', 'error')
  } finally {
    loadingStudents.value = false
  }
}

const startGrading = (student) => {
  selectedStudent.value = student
  const existing = getStudentGrade(student.id)
  // Pre-fill with auto-score if quiz and not yet graded
  const autoScore = (!existing && gradeForm.value.activity?.activity_type === 'quiz')
    ? quizAutoScore(student.id)
    : ''
  gradeInput.value = {
    numeric_grade: existing?.numeric_grade || (autoScore !== '0.0' ? parseFloat(autoScore) : ''),
    letter_grade:  existing?.letter_grade  || '',
    observation:   existing?.observation   || ''
  }
  if (!existing && autoScore && parseFloat(autoScore) > 0) autoLevel()
}

const saveGrade = async () => {
  if (!selectedStudent.value || !gradeInput.value.numeric_grade) return
  savingGrade.value = true
  try {
    const a   = gradeForm.value.assignment
    const act = gradeForm.value.activity
    const payload = {
      student_id:         selectedStudent.value.id,
      material_id:        act.id,
      material_title:     act.title,
      curriculum_grid_id: a.curriculum_grid_id,
      grade_id:           a.grade_id,
      subject_id:         a.subject_id,
      subject_name:       a.subject_name,
      week:               act.week,
      percentage:         act.percentage,
      ...gradeInput.value
    }
    const existing = getStudentGrade(selectedStudent.value.id)
    if (existing?.id) {
      await teacherGradesService.updateGrade(existing.id, payload)
    } else {
      await teacherGradesService.createGrade(payload)
    }
    showToast('Calificación guardada')
    selectedStudent.value = null
    await loadStudents()
  } catch {
    showToast('Error al guardar la calificación', 'error')
  } finally {
    savingGrade.value = false
  }
}

const downloadStudentReport = async (student) => {
  try {
    const resp = await teacherGradesService.downloadReport(student.id, {
      school_year: new Date().getFullYear()
    })
    const url = URL.createObjectURL(new Blob([resp.data], { type: 'application/pdf' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `boletin-${student.first_name}-${student.last_name}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    showToast('No se pudo generar el boletín', 'error')
  }
}

// ── Acciones: Extras ──
const loadExtras = async () => {
  try {
    allExtras.value = await teacherMallaExtrasService.getExtras()
  } catch {
    allExtras.value = []
  }
}

const openEditExtras = async (malla) => {
  editingMallaGroup.value = malla
  activeExtraCategory.value = 'topic'
  catalogSearch.value = ''
  catalogItems.value = []
  showExtrasModal.value = true
  await loadCatalogForCategory('topic')
}

const selectExtraCategory = async (cat) => {
  activeExtraCategory.value = cat
  catalogSearch.value = ''
  await loadCatalogForCategory(cat)
}

const loadCatalogForCategory = async (cat) => {
  loadingCatalog.value = true
  try {
    catalogItems.value = await teacherMallaExtrasService.getCatalog(cat)
  } catch {
    catalogItems.value = []
  } finally {
    loadingCatalog.value = false
  }
}

const addExtra = async (item) => {
  if (!editingMallaGroup.value) return
  addingExtra.value = item.id
  try {
    const g = editingMallaGroup.value
    await teacherMallaExtrasService.addItems({
      grade_id:   g.grade_id,
      subject_id: g.subject_id,
      period:     g.period ?? null,
      category:   activeExtraCategory.value,
      item_ids:   [item.id],
    })
    await loadExtras()
    showToast('Elemento agregado a tu malla')
  } catch {
    showToast('Error al agregar elemento', 'error')
  } finally {
    addingExtra.value = null
  }
}

const removeExtra = async (extra) => {
  try {
    await teacherMallaExtrasService.removeItem(extra.id)
    await loadExtras()
    showToast('Elemento eliminado')
  } catch {
    showToast('Error al eliminar elemento', 'error')
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  await Promise.all([loadAssignments(), loadExtras(), loadSchedules(), loadMyMaterials()])
})
</script>
