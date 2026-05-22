<template>
  <div class="mt-2 p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm space-y-3">

    <!-- Mode toggle (only when catalog has items) -->
    <div v-if="catalog.length > 0" class="flex gap-2">
      <button type="button" @click="mode = 'create'"
        :class="['px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
          mode === 'create' ? activeClass : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100']">
        Crear nuevo
      </button>
      <button type="button" @click="mode = 'select'"
        :class="['px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
          mode === 'select' ? activeClass : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100']">
        Seleccionar existente
      </button>
    </div>

    <!-- Create new -->
    <div v-if="mode === 'create'" class="space-y-2">
      <!-- Extra type selector (e.g. Tipo de Competencia) -->
      <div v-if="typeOptions.length > 0">
        <label class="label text-xs">{{ typeLabel }} <span class="text-red-500">*</span></label>
        <select v-model="form.typeId" class="input w-full text-sm">
          <option value="">Seleccionar {{ typeLabel }}</option>
          <option v-for="opt in typeOptions" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
        </select>
      </div>
      <input v-model="form.name" :placeholder="`Nombre de ${title}`"
        class="input w-full text-sm" @keydown.enter.prevent="handleSave" />
      <textarea v-model="form.description" placeholder="Descripción (opcional)"
        class="input w-full text-sm resize-none" rows="2"></textarea>
    </div>

    <!-- Select existing -->
    <div v-else class="space-y-2">
      <select v-model="form.selectedId" class="input w-full text-sm">
        <option value="">-- Seleccionar {{ title }} --</option>
        <option v-for="item in catalog" :key="item.id" :value="item.id">
          {{ item[displayField] || item.name || item.description }}
        </option>
      </select>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <button type="button" @click="handleSave" :disabled="saving || !canSave"
        class="btn-primary btn-sm flex items-center gap-1.5">
        <svg v-if="saving" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Guardar
      </button>
      <button type="button" @click="$emit('cancel')" :disabled="saving" class="btn-secondary btn-sm">
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title:        { type: String,  default: 'elemento' },
  catalog:      { type: Array,   default: () => [] },
  colorName:    { type: String,  default: 'violet' },
  saving:       { type: Boolean, default: false },
  displayField: { type: String,  default: 'name' },
  typeOptions:  { type: Array,   default: () => [] },
  typeLabel:    { type: String,  default: 'Tipo' },
})

const emit = defineEmits(['save', 'cancel'])

const mode = ref('create')
const form = ref({ name: '', description: '', typeId: '', selectedId: '' })

const COLOR_ACTIVE = {
  violet:  'bg-violet-100 text-violet-700 border-violet-300',
  blue:    'bg-blue-100 text-blue-700 border-blue-300',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  amber:   'bg-amber-100 text-amber-700 border-amber-300',
  orange:  'bg-orange-100 text-orange-700 border-orange-300',
  rose:    'bg-rose-100 text-rose-700 border-rose-300',
}

const activeClass = computed(() => COLOR_ACTIVE[props.colorName] || COLOR_ACTIVE.violet)

const canSave = computed(() => {
  if (mode.value === 'create') {
    const nameOk = form.value.name.trim().length > 0
    const typeOk = props.typeOptions.length === 0 || !!form.value.typeId
    return nameOk && typeOk
  }
  return !!form.value.selectedId
})

function handleSave() {
  if (!canSave.value || props.saving) return
  if (mode.value === 'create') {
    emit('save', {
      mode: 'create',
      id: null,
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      typeId: form.value.typeId || null,
    })
  } else {
    const item = props.catalog.find(c => c.id == form.value.selectedId)
    emit('save', {
      mode: 'select',
      id: Number(form.value.selectedId),
      name: item?.[props.displayField] || item?.name || item?.description || '',
      description: item?.description || '',
      typeId: item?.tipe_competence_id || null,
    })
  }
  form.value = { name: '', description: '', typeId: '', selectedId: '' }
}
</script>
