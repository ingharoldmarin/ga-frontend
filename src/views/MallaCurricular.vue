<template>
  <div class="min-h-screen bg-slate-50">

    <AppNavbar />

    <main class="max-w-5xl mx-auto px-4 py-6 space-y-5">

      <!-- Banner -->
      <div class="relative overflow-hidden rounded-2xl welcome-gradient p-5 text-white shadow-lg">
        <div class="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div class="relative z-10">
          <h1 class="text-xl font-bold tracking-tight">Construcción de Malla Curricular</h1>
          <p class="text-white/70 text-sm mt-0.5">Crea la estructura curricular de forma jerárquica por grado, área y período</p>
        </div>
      </div>

      <!-- ══════ Paso 1: Contexto ══════ -->
      <div class="card border-t-4 border-brand-400">
        <div class="card-header">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
            <h2 class="font-semibold text-gray-900">Configurar contexto</h2>
          </div>
        </div>
        <div class="card-body space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="label">Grado <span class="text-red-500">*</span></label>
              <select v-model="ctx.gradeId" class="input" :disabled="treeActive || loadingCtx">
                <option value="">Seleccionar grado</option>
                <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
              </select>
            </div>
            <div>
              <label class="label">Área / Materia <span class="text-red-500">*</span></label>
              <select v-model="ctx.subjectId" class="input" :disabled="treeActive || loadingCtx">
                <option value="">Seleccionar materia</option>
                <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div>
              <label class="label">Período <span class="text-red-500">*</span></label>
              <select v-model="ctx.period" class="input" :disabled="treeActive">
                <option value="">Seleccionar período</option>
                <option value="1">Período 1</option>
                <option value="2">Período 2</option>
                <option value="3">Período 3</option>
                <option value="4">Período 4</option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button @click="startTree" :disabled="!ctxComplete || treeActive || loadingCtx" class="btn-primary flex items-center gap-2">
              <svg v-if="loadingCtx" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ loadingCtx ? 'Cargando...' : treeActive ? 'Malla activa' : 'Cargar / Iniciar Malla' }}
            </button>
            <button v-if="treeActive" @click="resetTree" class="btn-secondary">Cambiar contexto</button>
          </div>
        </div>
      </div>

      <!-- ══════ Árbol jerárquico ══════ -->
      <template v-if="treeActive">

        <!-- Barra de contexto activo -->
        <div class="flex flex-wrap items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
          <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          <span class="badge-blue">{{ gradeName }}</span>
          <svg class="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="badge-purple">{{ subjectName }}</span>
          <svg class="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="badge-green">Período {{ ctx.period }}</span>

          <!-- Indicador de malla existente vs nueva -->
          <span v-if="isExistingMalla"
            class="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            Editando malla existente
          </span>
          <span v-else
            class="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Malla nueva
          </span>

          <span class="ml-auto text-sm text-gray-500">
            <strong class="text-gray-900">{{ totalGrids }}</strong> elemento(s) en malla
          </span>
        </div>

        <!-- ── Nivel 1: Unidades Didácticas ── -->
        <div class="card border-t-4 border-violet-500">
          <div class="card-header flex items-center justify-between">
            <h3 class="font-semibold text-gray-900 flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">1</span>
              Unidades Didácticas
            </h3>
            <span class="text-sm text-gray-500">{{ tree.length }} unidad(es)</span>
          </div>
          <div class="card-body space-y-3">

            <div v-for="topic in tree" :key="topic._key" class="border border-violet-200 rounded-xl overflow-hidden">

              <!-- Topic header -->
              <div class="flex items-center gap-3 px-4 py-3 bg-violet-50">
                <button type="button" @click="topic.expanded = !topic.expanded" class="text-violet-400 hover:text-violet-600 transition-colors flex-shrink-0">
                  <svg class="w-4 h-4 transition-transform duration-150" :class="topic.expanded ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-violet-800 text-sm truncate">{{ topic.name }}</p>
                  <p v-if="topic.description" class="text-xs text-violet-500 truncate">{{ topic.description }}</p>
                </div>
                <span class="text-xs text-violet-500 hidden sm:block flex-shrink-0">{{ topic.components.length }} comp.</span>
                <button type="button" @click="removeNode(tree, topic._key, topic)" title="Eliminar" class="text-red-400 hover:text-red-600 transition-colors p-1 rounded flex-shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>

              <!-- ── Nivel 2: Componentes ── -->
              <div v-if="topic.expanded" class="px-4 py-3 bg-white space-y-2.5">
                <p v-if="topic.components.length === 0 && !topic.addingChild" class="ml-4 text-xs text-gray-400 italic">Sin componentes — agrega el primero.</p>

                <div v-for="cmpNode in topic.components" :key="cmpNode._key" class="ml-4">
                  <div class="border border-blue-200 rounded-lg overflow-hidden">

                    <div class="flex items-center gap-3 px-3 py-2.5 bg-blue-50">
                      <button type="button" @click="cmpNode.expanded = !cmpNode.expanded" class="text-blue-400 hover:text-blue-600 transition-colors flex-shrink-0">
                        <svg class="w-3.5 h-3.5 transition-transform duration-150" :class="cmpNode.expanded ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                      <div class="flex-1 min-w-0">
                        <p class="font-medium text-blue-800 text-sm truncate">{{ cmpNode.name }}</p>
                        <p v-if="cmpNode.description" class="text-xs text-blue-500 truncate">{{ cmpNode.description }}</p>
                      </div>
                      <span class="text-xs text-blue-500 hidden sm:block flex-shrink-0">{{ cmpNode.standards.length }} est.</span>
                      <button type="button" @click="removeNode(topic.components, cmpNode._key, cmpNode)" class="text-red-400 hover:text-red-600 transition-colors p-1 rounded flex-shrink-0">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>

                    <!-- ── Nivel 3: Estándares ── -->
                    <div v-if="cmpNode.expanded" class="px-3 py-2.5 bg-white space-y-2">
                      <p v-if="cmpNode.standards.length === 0 && !cmpNode.addingChild" class="ml-4 text-xs text-gray-400 italic">Sin estándares — agrega el primero.</p>

                      <div v-for="stdNode in cmpNode.standards" :key="stdNode._key" class="ml-4">
                        <div class="border border-emerald-200 rounded-lg overflow-hidden">

                          <div class="flex items-center gap-3 px-3 py-2 bg-emerald-50">
                            <button type="button" @click="stdNode.expanded = !stdNode.expanded" class="text-emerald-400 hover:text-emerald-600 transition-colors flex-shrink-0">
                              <svg class="w-3.5 h-3.5 transition-transform duration-150" :class="stdNode.expanded ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                              </svg>
                            </button>
                            <div class="flex-1 min-w-0">
                              <p class="font-medium text-emerald-800 text-sm truncate">{{ stdNode.name }}</p>
                              <p v-if="stdNode.description" class="text-xs text-emerald-500 truncate">{{ stdNode.description }}</p>
                            </div>
                            <button type="button" @click="removeNode(cmpNode.standards, stdNode._key, stdNode)" class="text-red-400 hover:text-red-600 transition-colors p-1 rounded flex-shrink-0">
                              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          </div>

                          <!-- ── Nivel 4: Competencias ── -->
                          <div v-if="stdNode.expanded" class="px-3 py-2 bg-white space-y-1.5">
                            <p v-if="stdNode.competencies.length === 0 && !stdNode.addingChild" class="ml-4 text-xs text-gray-400 italic">Sin competencias — agrega la primera.</p>

                            <div v-for="comptNode in stdNode.competencies" :key="comptNode._key" class="ml-4">
                              <div class="border border-amber-200 rounded-lg overflow-hidden">

                                <div class="flex items-center gap-2 px-3 py-2 bg-amber-50">
                                  <button type="button" @click="comptNode.expanded = !comptNode.expanded" class="text-amber-400 hover:text-amber-600 transition-colors flex-shrink-0">
                                    <svg class="w-3 h-3 transition-transform duration-150" :class="comptNode.expanded ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                  </button>
                                  <div class="flex-1 min-w-0">
                                    <p class="font-medium text-amber-800 text-xs truncate">{{ comptNode.name }}</p>
                                    <p v-if="comptNode.description" class="text-xs text-amber-500 truncate">{{ comptNode.description }}</p>
                                  </div>
                                  <button type="button" @click="removeNode(stdNode.competencies, comptNode._key, comptNode)" class="text-red-400 hover:text-red-600 transition-colors p-0.5 rounded flex-shrink-0">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                  </button>
                                </div>

                                <!-- ── Nivel 5: Aprendizajes DNA/DBA ── -->
                                <div v-if="comptNode.expanded" class="px-3 py-1.5 bg-white space-y-1.5">
                                  <p v-if="comptNode.affirmations.length === 0 && !comptNode.addingChild" class="ml-4 text-xs text-gray-400 italic">Sin aprendizajes — agrega el primero.</p>

                                  <div v-for="affNode in comptNode.affirmations" :key="affNode._key" class="ml-4">
                                    <div class="border border-orange-200 rounded-lg overflow-hidden">

                                      <div class="flex items-center gap-2 px-2.5 py-1.5 bg-orange-50">
                                        <button type="button" @click="affNode.expanded = !affNode.expanded" class="text-orange-400 hover:text-orange-600 transition-colors flex-shrink-0">
                                          <svg class="w-3 h-3 transition-transform duration-150" :class="affNode.expanded ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                          </svg>
                                        </button>
                                        <div class="flex-1 min-w-0">
                                          <p class="font-medium text-orange-800 text-xs truncate">{{ affNode.name }}</p>
                                          <p v-if="affNode.description" class="text-xs text-orange-500 truncate">{{ affNode.description }}</p>
                                        </div>
                                        <button type="button" @click="removeNode(comptNode.affirmations, affNode._key, affNode)" class="text-red-400 hover:text-red-600 transition-colors p-0.5 rounded flex-shrink-0">
                                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                        </button>
                                      </div>

                                      <!-- ── Nivel 6: Evidencias de Aprendizaje ── -->
                                      <div v-if="affNode.expanded" class="px-2.5 py-1.5 bg-white space-y-1">
                                        <p v-if="affNode.evidences.length === 0 && !affNode.addingChild" class="ml-4 text-xs text-gray-400 italic">Sin evidencias — agrega la primera.</p>

                                        <div v-for="evNode in affNode.evidences" :key="evNode._key"
                                          class="ml-4 flex items-center gap-2 px-2.5 py-1.5 bg-rose-50 border border-rose-200 rounded-lg">
                                          <span class="w-1.5 h-1.5 bg-rose-400 rounded-full flex-shrink-0"></span>
                                          <p class="flex-1 text-rose-800 text-xs truncate">{{ evNode.name }}</p>
                                          <span v-if="evNode.gridId" class="text-emerald-600 text-xs font-semibold flex-shrink-0" title="Elemento guardado en malla">✓</span>
                                          <button type="button" @click="removeEvidence(affNode, evNode._key, evNode.gridId)" class="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                          </button>
                                        </div>

                                        <!-- Agregar evidencia -->
                                        <InlineEntityForm v-if="affNode.addingChild"
                                          title="Evidencia de Aprendizaje DNA/DBA"
                                          :catalog="catalogues.evidences"
                                          colorName="rose"
                                          :saving="affNode.saving"
                                          class="ml-4"
                                          @save="saveEvidence(topic, cmpNode, stdNode, comptNode, affNode, $event)"
                                          @cancel="affNode.addingChild = false"
                                        />
                                        <button v-else type="button" @click="affNode.addingChild = true"
                                          class="ml-4 flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 transition-colors py-1">
                                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                                          Agregar Evidencia DNA/DBA
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <!-- Agregar aprendizaje -->
                                  <InlineEntityForm v-if="comptNode.addingChild"
                                    title="Aprendizaje DNA/DBA"
                                    :catalog="catalogues.affirmations"
                                    colorName="orange"
                                    :saving="comptNode.saving"
                                    class="ml-4"
                                    @save="saveAffirmation(comptNode, $event)"
                                    @cancel="comptNode.addingChild = false"
                                  />
                                  <button v-else type="button" @click="comptNode.addingChild = true"
                                    class="ml-4 flex items-center gap-1 text-xs text-orange-500 hover:text-orange-700 transition-colors py-1">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                                    Agregar Aprendizaje DNA/DBA
                                  </button>
                                </div>
                              </div>
                            </div>

                            <!-- Agregar competencia -->
                            <InlineEntityForm v-if="stdNode.addingChild"
                              title="Competencia"
                              :catalog="catalogues.competencies"
                              displayField="description"
                              :typeOptions="catalogues.tipeCompetences"
                              typeLabel="Tipo de Competencia"
                              colorName="amber"
                              :saving="stdNode.saving"
                              class="ml-4"
                              @save="saveCompetency(stdNode, $event)"
                              @cancel="stdNode.addingChild = false"
                            />
                            <button v-else type="button" @click="stdNode.addingChild = true"
                              class="ml-4 flex items-center gap-1 text-xs text-amber-500 hover:text-amber-700 transition-colors py-1">
                              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                              Agregar Competencia
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Agregar estándar -->
                      <InlineEntityForm v-if="cmpNode.addingChild"
                        title="Estándar"
                        :catalog="catalogues.standards"
                        colorName="emerald"
                        :saving="cmpNode.saving"
                        class="ml-4"
                        @save="saveStandard(cmpNode, $event)"
                        @cancel="cmpNode.addingChild = false"
                      />
                      <button v-else type="button" @click="cmpNode.addingChild = true"
                        class="ml-4 flex items-center gap-1 text-xs text-emerald-500 hover:text-emerald-700 transition-colors py-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        Agregar Estándar
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Agregar componente -->
                <InlineEntityForm v-if="topic.addingChild"
                  title="Componente"
                  :catalog="catalogues.components"
                  colorName="blue"
                  :saving="topic.saving"
                  class="ml-4"
                  @save="saveComponent(topic, $event)"
                  @cancel="topic.addingChild = false"
                />
                <button v-else type="button" @click="topic.addingChild = true"
                  class="ml-4 flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 transition-colors py-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  Agregar Componente
                </button>
              </div>
            </div>

            <!-- Agregar unidad didáctica -->
            <InlineEntityForm v-if="addingTopic"
              title="Unidad Didáctica"
              :catalog="catalogues.topics"
              colorName="violet"
              :saving="savingTopic"
              @save="saveTopic($event)"
              @cancel="addingTopic = false"
            />
            <button v-else type="button" @click="addingTopic = true"
              class="flex items-center gap-2 w-full px-4 py-2.5 border-2 border-dashed border-violet-300 rounded-xl text-violet-600 hover:border-violet-400 hover:bg-violet-50 transition-all text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Agregar Unidad Didáctica
            </button>

          </div>
        </div>

      </template>

    </main>

    <!-- Toast -->
    <Transition name="slide-up">
      <div v-if="toast.show"
        :class="['fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm',
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white']">
        <svg v-if="toast.type === 'success'" class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
        <svg v-else class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
        {{ toast.message }}
        <button @click="toast.show = false" class="ml-auto opacity-70 hover:opacity-100 text-lg leading-none">&times;</button>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  topicService,
  componentService,
  standardService,
  competenceService,
  tipeCompetenceService,
  affirmationService,
  evidenceService,
  gradeService,
  subjectService,
} from '@/api/curriculumService'
import { curriculumGridService } from '@/api/curriculumGridService'
import InlineEntityForm from '@/components/InlineEntityForm.vue'
import AppNavbar from '@/components/AppNavbar.vue'

const authStore = useAuthStore()

// ── Context ───────────────────────────────────────────────────────────
const ctx         = ref({ gradeId: '', subjectId: '', period: '' })
const ctxComplete = computed(() => ctx.value.gradeId && ctx.value.subjectId && ctx.value.period)
const treeActive  = ref(false)
const loadingCtx  = ref(false)

const grades   = ref([])
const subjects = ref([])

const gradeName   = computed(() => grades.value.find(g => g.id === ctx.value.gradeId)?.name || '')
const subjectName = computed(() => subjects.value.find(s => s.id === ctx.value.subjectId)?.name || '')

// ── Catalogues (for "select existing" dropdowns) ──────────────────────
const catalogues = ref({
  topics: [], components: [], standards: [], competencies: [], affirmations: [], evidences: [],
  tipeCompetences: []
})

// ── Tree state ────────────────────────────────────────────────────────
let _keyCounter = 0
const nextKey = () => ++_keyCounter

const tree           = ref([])
const addingTopic    = ref(false)
const savingTopic    = ref(false)
const totalGrids     = ref(0)
const isExistingMalla = ref(false)
const toast          = ref({ show: false, message: '', type: 'success' })

// ── Node factories ────────────────────────────────────────────────────
const makeTopic       = (id, name, desc = '') => ({ _key: nextKey(), id, name, description: desc, expanded: true, addingChild: false, saving: false, components: [] })
const makeComponent   = (id, name, desc = '') => ({ _key: nextKey(), id, name, description: desc, expanded: true, addingChild: false, saving: false, standards: [] })
const makeStandard    = (id, name, desc = '') => ({ _key: nextKey(), id, name, description: desc, expanded: true, addingChild: false, saving: false, competencies: [] })
const makeCompetency  = (id, name, desc = '') => ({ _key: nextKey(), id, name, description: desc, expanded: true, addingChild: false, saving: false, affirmations: [] })
const makeAffirmation = (id, name, desc = '') => ({ _key: nextKey(), id, name, description: desc, expanded: true, addingChild: false, saving: false, evidences: [] })
const makeEvidence    = (id, name, gridId = null) => ({ _key: nextKey(), id, name, gridId })

// ── Helpers ───────────────────────────────────────────────────────────
const extractItem = (res) => res?.data ?? res

function collectGridIds(node) {
  const ids = []
  ;(node.components || node.standards || node.competencies || node.affirmations || [])
    .forEach(child => ids.push(...collectGridIds(child)))
  ;(node.evidences || []).forEach(e => { if (e.gridId) ids.push(e.gridId) })
  return ids
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3500)
}

const normalizeList = (r) => {
  const d = r?.data
  return Array.isArray(d) ? d : (Array.isArray(d?.data) ? d.data : [])
}

// ── Load data ─────────────────────────────────────────────────────────
async function loadBaseData() {
  loadingCtx.value = true
  try {
    const [grRes, subRes] = await Promise.all([gradeService.getAll(), subjectService.getAll()])
    grades.value   = normalizeList(grRes)
    subjects.value = normalizeList(subRes)
  } finally {
    loadingCtx.value = false
  }
}

async function loadCatalogues() {
  try {
    const [tRes, cRes, sRes, compRes, affRes, evRes, tcRes] = await Promise.all([
      topicService.getAll(1, 200),
      componentService.getAll(1, 200),
      standardService.getAll(1, 200),
      competenceService.getAll(1, 200),
      affirmationService.getAll(1, 200),
      evidenceService.getAll(1, 200),
      tipeCompetenceService.getAll(1, 200),
    ])
    catalogues.value = {
      topics:          normalizeList(tRes),
      components:      normalizeList(cRes),
      standards:       normalizeList(sRes),
      competencies:    normalizeList(compRes),
      affirmations:    normalizeList(affRes),
      evidences:       normalizeList(evRes),
      tipeCompetences: normalizeList(tcRes),
    }
  } catch { /* empty catalogues = user creates new */ }
}

// ── Tree lifecycle ────────────────────────────────────────────────────
async function loadExistingTree() {
  const filters = {
    grade_id:   ctx.value.gradeId,
    subject_id: ctx.value.subjectId,
  }
  if (ctx.value.period) filters.period = ctx.value.period
  const res = await curriculumGridService.getAll(1, 500, filters)
  const grids = Array.isArray(res?.data) ? res.data : []
  if (grids.length === 0) { isExistingMalla.value = false; return }
  isExistingMalla.value = true

  const topicMap = new Map()

  for (const grid of grids) {
    for (const topic of (grid.topics || [])) {
      if (!topicMap.has(topic.id)) topicMap.set(topic.id, makeTopic(topic.id, topic.name))
      const topicNode = topicMap.get(topic.id)

      for (const comp of (grid.components || [])) {
        let compNode = topicNode.components.find(c => c.id === comp.id)
        if (!compNode) { compNode = makeComponent(comp.id, comp.name); topicNode.components.push(compNode) }

        for (const std of (grid.standards || [])) {
          let stdNode = compNode.standards.find(s => s.id === std.id)
          if (!stdNode) { stdNode = makeStandard(std.id, std.name); compNode.standards.push(stdNode) }

          for (const competence of (grid.competences || [])) {
            let comptNode = stdNode.competencies.find(c => c.id === competence.id)
            if (!comptNode) { comptNode = makeCompetency(competence.id, competence.description); stdNode.competencies.push(comptNode) }

            for (const aff of (grid.affirmations || [])) {
              let affNode = comptNode.affirmations.find(a => a.id === aff.id)
              if (!affNode) { affNode = makeAffirmation(aff.id, aff.name); comptNode.affirmations.push(affNode) }

              for (const ev of (grid.evidences || [])) {
                if (!affNode.evidences.some(e => e.id === ev.id && e.gridId === grid.id)) {
                  affNode.evidences.push(makeEvidence(ev.id, ev.name, grid.id))
                  totalGrids.value++
                }
              }
            }
          }
        }
      }
    }
  }

  tree.value = [...topicMap.values()]
}

async function startTree() {
  if (!ctxComplete.value) return
  loadingCtx.value = true
  try {
    await loadCatalogues()
    tree.value = []; addingTopic.value = false; totalGrids.value = 0
    await loadExistingTree()
    treeActive.value = true
  } finally {
    loadingCtx.value = false
  }
}

function resetTree() {
  treeActive.value = false; tree.value = []; addingTopic.value = false
  totalGrids.value = 0; isExistingMalla.value = false
  ctx.value = { gradeId: '', subjectId: '', period: '' }
}

// ── Generic node saver (L2–L5) ────────────────────────────────────────
async function saveGenericNode(parentNode, childrenKey, makeNodeFn, service, catalogKey, evt) {
  parentNode.saving = true
  try {
    let nodeId, nodeName, nodeDesc = evt.description
    if (evt.mode === 'create') {
      const res  = await service.create({ name: evt.name, description: evt.description })
      const item = extractItem(res)
      nodeId   = item?.id
      nodeName = item?.name ?? evt.name
      catalogues.value[catalogKey].push({ id: nodeId, name: nodeName, description: nodeDesc })
    } else {
      nodeId   = evt.id
      nodeName = evt.name
      nodeDesc = catalogues.value[catalogKey]?.find(x => x.id === evt.id)?.description || ''
    }
    parentNode[childrenKey].push(makeNodeFn(nodeId, nodeName, nodeDesc))
    parentNode.addingChild = false
    showToast('Guardado correctamente')
  } catch {
    showToast('Error al guardar', 'error')
  } finally {
    parentNode.saving = false
  }
}

// ── L1: Unidad Didáctica ──────────────────────────────────────────────
async function saveTopic(evt) {
  savingTopic.value = true
  try {
    let nodeId, nodeName, nodeDesc = evt.description
    if (evt.mode === 'create') {
      const res  = await topicService.create({ name: evt.name, description: evt.description })
      const item = extractItem(res)
      nodeId   = item?.id
      nodeName = item?.name ?? evt.name
      catalogues.value.topics.push({ id: nodeId, name: nodeName, description: nodeDesc })
    } else {
      nodeId   = evt.id
      nodeName = evt.name
      nodeDesc = catalogues.value.topics.find(t => t.id === evt.id)?.description || ''
    }
    tree.value.push(makeTopic(nodeId, nodeName, nodeDesc))
    addingTopic.value = false
    showToast('Unidad Didáctica guardada')
  } catch {
    showToast('Error al guardar la Unidad Didáctica', 'error')
  } finally {
    savingTopic.value = false
  }
}

// ── L2–L5 savers ─────────────────────────────────────────────────────
const saveComponent   = (topic, evt)     => saveGenericNode(topic,     'components',   makeComponent,   componentService,  'components',   evt)
const saveStandard    = (cmpNode, evt)   => saveGenericNode(cmpNode,   'standards',    makeStandard,    standardService,   'standards',    evt)
async function saveCompetency(stdNode, evt) {
  stdNode.saving = true
  try {
    let nodeId, nodeName, nodeDesc
    if (evt.mode === 'create') {
      const res  = await competenceService.create({ description: evt.name, tipe_competence_id: evt.typeId })
      const item = extractItem(res)
      nodeId   = item?.id
      nodeName = evt.name
      nodeDesc = evt.description
      catalogues.value.competencies.push({ id: nodeId, description: nodeName })
    } else {
      nodeId   = evt.id
      nodeName = evt.name  // already the description field value
      nodeDesc = evt.description
    }
    stdNode.competencies.push(makeCompetency(nodeId, nodeName, nodeDesc))
    stdNode.addingChild = false
    showToast('Competencia guardada')
  } catch {
    showToast('Error al guardar la competencia', 'error')
  } finally {
    stdNode.saving = false
  }
}
const saveAffirmation = (comptNode, evt) => saveGenericNode(comptNode, 'affirmations', makeAffirmation, affirmationService,'affirmations', evt)

// ── L6: Evidencia (also creates curriculum_grid record) ───────────────
async function saveEvidence(topic, cmpNode, stdNode, comptNode, affNode, evt) {
  affNode.saving = true
  try {
    let evId, evName
    if (evt.mode === 'create') {
      const res  = await evidenceService.create({ name: evt.name, description: evt.description })
      const item = extractItem(res)
      evId   = item?.id
      evName = item?.name ?? evt.name
      catalogues.value.evidences.push({ id: evId, name: evName })
    } else {
      evId   = evt.id
      evName = evt.name
    }

    // Bloquear duplicado local (misma evidencia ya en este nodo)
    if (affNode.evidences.some(e => e.id === evId)) {
      showToast('Esta evidencia ya está en este aprendizaje', 'error')
      affNode.saving = false
      return
    }

    const gridPayload = {
      grade_id:        ctx.value.gradeId,
      subject_id:      ctx.value.subjectId,
      period:          ctx.value.period ? Number(ctx.value.period) : null,
      topic_ids:       [topic.id],
      component_ids:   [cmpNode.id],
      standard_ids:    [stdNode.id],
      competence_ids:  [comptNode.id],
      affirmation_ids: [affNode.id],
      evidence_ids:    [evId],
      active:          true,
    }
    const gridRes  = await curriculumGridService.create(gridPayload)
    const gridItem = extractItem(gridRes)
    const gridId   = gridItem?.id ?? null

    affNode.evidences.push(makeEvidence(evId, evName, gridId))
    affNode.addingChild = false
    totalGrids.value++
    isExistingMalla.value = true
    showToast('Evidencia y elemento de malla guardados')
  } catch {
    showToast('Error al guardar la evidencia', 'error')
  } finally {
    affNode.saving = false
  }
}

// ── Remove handlers ───────────────────────────────────────────────────
async function removeNode(arr, key, node) {
  const gridIds = collectGridIds(node)
  const msg = gridIds.length > 0
    ? `¿Eliminar? Esto borrará ${gridIds.length} elemento(s) de la malla curricular.`
    : '¿Eliminar este elemento?'
  if (!confirm(msg)) return
  try {
    if (gridIds.length > 0) {
      await Promise.all(gridIds.map(id => curriculumGridService.delete(id).catch(() => {})))
      totalGrids.value = Math.max(0, totalGrids.value - gridIds.length)
    }
    const idx = arr.findIndex(n => n._key === key)
    if (idx > -1) arr.splice(idx, 1)
  } catch {
    showToast('Error al eliminar', 'error')
  }
}

async function removeEvidence(affNode, key, gridId) {
  if (!confirm('¿Eliminar esta evidencia y su registro de malla?')) return
  try {
    if (gridId) await curriculumGridService.delete(gridId).catch(() => {})
    const idx = affNode.evidences.findIndex(e => e._key === key)
    if (idx > -1) affNode.evidences.splice(idx, 1)
    totalGrids.value = Math.max(0, totalGrids.value - 1)
    showToast('Evidencia eliminada')
  } catch {
    showToast('Error al eliminar la evidencia', 'error')
  }
}

onMounted(loadBaseData)
</script>
