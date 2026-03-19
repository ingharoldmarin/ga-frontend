<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-800">📚 Mis Calificaciones</h2>
      <div class="flex items-center gap-4">
        <!-- Selector de período -->
        <select 
          v-model="selectedPeriod" 
          @change="loadGrades"
          class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Todos los períodos</option>
          <option value="1">Período 1</option>
          <option value="2">Período 2</option>
          <option value="3">Período 3</option>
          <option value="4">Período 4</option>
        </select>

        <!-- Botón actualizar -->
        <button 
          @click="loadGrades" 
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          :disabled="loading"
        >
          {{ loading ? '🔄 Cargando...' : '🔄 Actualizar' }}
        </button>
      </div>
    </div>

    <!-- Estadísticas Generales -->
    <div v-if="gradesData" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
        <div class="text-sm opacity-90">Grupo</div>
        <div class="text-2xl font-bold mt-2">{{ gradesData.group_name }}</div>
      </div>
      
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
        <div class="text-sm opacity-90">Promedio General</div>
        <div class="text-3xl font-bold mt-2">{{ gradesData.general_average }}</div>
      </div>
      
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <div class="text-sm opacity-90">Total Calificaciones</div>
        <div class="text-3xl font-bold mt-2">{{ gradesData.total_grades }}</div>
      </div>
      
      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
        <div class="text-sm opacity-90">Año Escolar</div>
        <div class="text-2xl font-bold mt-2">{{ gradesData.school_year }}</div>
      </div>
    </div>

    <!-- Calificaciones por Materia -->
    <div v-if="gradesData && gradesData.subjects.length > 0" class="space-y-4">
      <div 
        v-for="subject in gradesData.subjects" 
        :key="subject.subject_name"
        class="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <!-- Header de la materia -->
        <div 
          class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 cursor-pointer"
          @click="toggleSubject(subject.subject_name)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">📖</span>
              <div>
                <h3 class="text-xl font-bold">{{ subject.subject_name }}</h3>
                <p class="text-sm opacity-90">
                  {{ Object.keys(subject.periods).length }} período(s)
                </p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm opacity-90">Promedio</div>
              <div class="text-2xl font-bold">
                {{ calculateSubjectAverage(subject) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Contenido de la materia (expandible) -->
        <div 
          v-show="expandedSubjects.includes(subject.subject_name)"
          class="p-6 space-y-6"
        >
          <!-- Períodos -->
          <div 
            v-for="(period, periodNum) in subject.periods" 
            :key="periodNum"
            class="border-l-4 border-purple-500 pl-4"
          >
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-lg font-bold text-gray-800">
                Período {{ period.period }}
              </h4>
              <div class="text-right">
                <span class="text-sm text-gray-600">Promedio: </span>
                <span class="text-xl font-bold" :class="getGradeColor(period.average)">
                  {{ period.average }}
                </span>
              </div>
            </div>

            <!-- Calificaciones del período -->
            <div class="space-y-2">
              <div 
                v-for="grade in period.grades" 
                :key="grade.id"
                class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-2xl font-bold" :class="getGradeColor(grade.numeric_grade)">
                        {{ grade.numeric_grade }}
                      </span>
                      <span 
                        v-if="grade.letter_grade"
                        class="px-3 py-1 rounded-full text-sm font-medium"
                        :class="getLetterGradeBadge(grade.letter_grade)"
                      >
                        {{ grade.letter_grade }}
                      </span>
                    </div>
                    
                    <div class="text-sm text-gray-600 space-y-1">
                      <p v-if="grade.topic_name">
                        <strong>Tema:</strong> {{ grade.topic_name }}
                      </p>
                      <p v-if="grade.component_name">
                        <strong>Componente:</strong> {{ grade.component_name }}
                      </p>
                      <p v-if="grade.competence_description">
                        <strong>Competencia:</strong> {{ grade.competence_description }}
                      </p>
                      <p v-if="grade.observation" class="italic text-gray-700 mt-2">
                        "{{ grade.observation }}"
                      </p>
                    </div>
                  </div>
                  
                  <div class="text-right text-sm text-gray-500">
                    <p>{{ grade.teacher_name }}</p>
                    <p>{{ formatDate(grade.created_at) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sin calificaciones -->
    <div v-else-if="!loading" class="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
      <p class="text-yellow-800 text-lg">
        📋 Aún no tienes calificaciones registradas para este período.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { studentGradesService } from '@/api/studentGradesService'

const gradesData = ref(null)
const loading = ref(false)
const selectedPeriod = ref('')
const expandedSubjects = ref([])

const loadGrades = async () => {
  loading.value = true
  try {
    const params = {
      school_year: new Date().getFullYear()
    }
    
    if (selectedPeriod.value) {
      params.period = selectedPeriod.value
    }

    const data = await studentGradesService.getMyGrades(params)
    gradesData.value = data
    
    // Expandir todas las materias por defecto
    expandedSubjects.value = data.subjects.map(s => s.subject_name)
  } catch (error) {
    console.error('Error cargando calificaciones:', error)
    alert('❌ Error al cargar las calificaciones')
  } finally {
    loading.value = false
  }
}

const toggleSubject = (subjectName) => {
  const index = expandedSubjects.value.indexOf(subjectName)
  if (index > -1) {
    expandedSubjects.value.splice(index, 1)
  } else {
    expandedSubjects.value.push(subjectName)
  }
}

const calculateSubjectAverage = (subject) => {
  const allGrades = []
  Object.values(subject.periods).forEach(period => {
    period.grades.forEach(grade => {
      allGrades.push(grade.numeric_grade)
    })
  })
  
  if (allGrades.length === 0) return '0.00'
  
  const sum = allGrades.reduce((a, b) => a + b, 0)
  return (sum / allGrades.length).toFixed(2)
}

const getGradeColor = (grade) => {
  if (grade >= 4.5) return 'text-green-600'
  if (grade >= 3.5) return 'text-blue-600'
  if (grade >= 3.0) return 'text-orange-600'
  return 'text-red-600'
}

const getLetterGradeBadge = (letter) => {
  const badges = {
    'E': 'bg-green-100 text-green-800',
    'S': 'bg-blue-100 text-blue-800',
    'A': 'bg-yellow-100 text-yellow-800',
    'B': 'bg-orange-100 text-orange-800',
    'Superior': 'bg-green-100 text-green-800',
    'Alto': 'bg-blue-100 text-blue-800',
    'Básico': 'bg-yellow-100 text-yellow-800',
    'Bajo': 'bg-red-100 text-red-800',
  }
  return badges[letter] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

onMounted(() => {
  loadGrades()
})
</script>

<style scoped>
/* Animaciones suaves */
.transition-colors {
  transition: background-color 0.3s ease;
}
</style>
