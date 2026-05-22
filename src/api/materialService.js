import api from './api'

const KEYS = {
  materials: 'ga_materials',
  grades:    'ga_teacher_grades',
}

const ls = {
  get:    (key) => { try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] } },
  set:    (key, data) => localStorage.setItem(key, JSON.stringify(data)),
  nextId: () => Date.now() + Math.floor(Math.random() * 1000),
}

// ── materialService ────────────────────────────────────────────────────
export const materialService = {

  getAll: async (params) => {
    try {
      const res = await api.get('/materials', { params })
      return res
    } catch {
      let items = ls.get(KEYS.materials)
      if (params?.curriculum_grid_id) {
        items = items.filter(m => m.curriculum_grid_id === params.curriculum_grid_id)
      }
      return { data: items }
    }
  },

  create: async (data) => {
    try {
      return await api.post('/materials', data)
    } catch {
      const items = ls.get(KEYS.materials)
      const item = { ...data, id: ls.nextId(), created_at: new Date().toISOString() }
      items.unshift(item)
      ls.set(KEYS.materials, items)
      return { data: item }
    }
  },

  update: async (id, data) => {
    try {
      return await api.put(`/materials/${id}`, data)
    } catch {
      const items = ls.get(KEYS.materials)
      const idx = items.findIndex(i => i.id === id)
      if (idx > -1) { items[idx] = { ...items[idx], ...data }; ls.set(KEYS.materials, items) }
      return { data: items[idx] ?? data }
    }
  },

  delete: async (id) => {
    try {
      return await api.delete(`/materials/${id}`)
    } catch {
      ls.set(KEYS.materials, ls.get(KEYS.materials).filter(i => i.id !== id))
      return { data: { success: true } }
    }
  },

  // Student: materiales publicados para sus materias
  getMyMaterials: async (params) => {
    try {
      return await api.get('/student/materials', { params })
    } catch {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      const allMaterials = ls.get(KEYS.materials)
      if (!user) return { data: allMaterials }

      const enrollments = JSON.parse(localStorage.getItem('ga_enrollments') || '[]')
      const mySubjectIds = new Set(
        enrollments
          .filter(e => Number(e.student_id) === Number(user.id))
          .map(e => e.subject_id)
      )
      const mine = mySubjectIds.size
        ? allMaterials.filter(m => !m.subject_id || mySubjectIds.has(m.subject_id))
        : allMaterials
      return { data: mine }
    }
  },

  // Student: materias matriculadas
  getMySubjects: async () => {
    try {
      return await api.get('/student/subjects')
    } catch {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      if (!user) return { data: [] }

      const enrollments = JSON.parse(localStorage.getItem('ga_enrollments') || '[]')
      const mine = enrollments.filter(e => Number(e.student_id) === Number(user.id))

      const seen = new Set()
      const subjects = []
      for (const e of mine) {
        const key = `${e.grade_id}-${e.subject_id}`
        if (!seen.has(key)) {
          seen.add(key)
          subjects.push({
            id:              key,
            subject_name:    e.subject_name,
            grade_name:      e.grade_name,
            grade_id:        e.grade_id,
            subject_id:      e.subject_id,
            teacher_name:    e.teacher_name   || null,
            curriculum_grid: e.curriculum_grid || null,
          })
        }
      }
      return { data: subjects }
    }
  },
}

// ── teacherGradesService ───────────────────────────────────────────────
export const teacherGradesService = {

  // Estudiantes matriculados en grado+materia
  getStudents: async (params) => {
    try {
      return await api.get('/teacher/students', { params })
    } catch {
      const enrollments = JSON.parse(localStorage.getItem('ga_enrollments') || '[]')
      const filtered = enrollments.filter(e =>
        (!params?.grade_id   || Number(e.grade_id)   === Number(params.grade_id)) &&
        (!params?.subject_id || Number(e.subject_id) === Number(params.subject_id))
      )
      const seen = new Set()
      const students = []
      for (const e of filtered) {
        if (!seen.has(e.student_id)) {
          seen.add(e.student_id)
          students.push(e.student || {
            id:         e.student_id,
            first_name: (e.student_name || '').split(' ')[0] || 'Estudiante',
            last_name:  (e.student_name || '').split(' ').slice(1).join(' ') || '',
            email:      e.student_email || '',
          })
        }
      }
      return { data: students }
    }
  },

  // Calificaciones guardadas — filtrables por material_id y/o grid_id
  getGrades: async (params) => {
    try {
      return await api.get('/teacher/grades', { params })
    } catch {
      const all = ls.get(KEYS.grades)
      const filtered = all.filter(g =>
        (!params?.grid_id     || g.curriculum_grid_id === params.grid_id) &&
        (!params?.material_id || g.material_id        === params.material_id)
      )
      return { data: filtered }
    }
  },

  // Guardar calificación (incluye material_id, week, percentage)
  createGrade: async (data) => {
    try {
      return await api.post('/teacher/grades', data)
    } catch {
      const items = ls.get(KEYS.grades)
      const grade = { ...data, id: ls.nextId(), created_at: new Date().toISOString() }
      items.push(grade)
      ls.set(KEYS.grades, items)
      return { data: grade }
    }
  },

  updateGrade: async (id, data) => {
    try {
      return await api.put(`/teacher/grades/${id}`, data)
    } catch {
      const items = ls.get(KEYS.grades)
      const idx = items.findIndex(i => i.id === id)
      if (idx > -1) { items[idx] = { ...items[idx], ...data }; ls.set(KEYS.grades, items) }
      return { data: items[idx] ?? data }
    }
  },

  deleteGrade: async (id) => {
    try {
      return await api.delete(`/teacher/grades/${id}`)
    } catch {
      ls.set(KEYS.grades, ls.get(KEYS.grades).filter(i => i.id !== id))
      return { data: { success: true } }
    }
  },

  // Boletín PDF por estudiante (solo con backend)
  downloadReport: async (studentId, params) => {
    return api.get(`/teacher/report-card/${studentId}`, { params, responseType: 'blob' })
  },

  downloadMyReport: async (params) => {
    return api.get('/student/report-card', { params, responseType: 'blob' })
  },

  getMyStats: async () => {
    try { return await api.get('/student/stats') }
    catch { return { data: null } }
  },

  // Calificaciones del estudiante — agrupa por materia con actividades y promedio ponderado
  getMyGrades: async (params) => {
    try { return await api.get('/student/grades', { params }) }
    catch {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      if (!user) return { data: null }

      const allGrades   = ls.get(KEYS.grades).filter(g => Number(g.student_id) === Number(user.id))
      const allMaterials = ls.get(KEYS.materials)

      // Agrupar por subject_id
      const subjectMap = {}
      for (const grade of allGrades) {
        const material = allMaterials.find(m => m.id === grade.material_id)
        const subjectId   = grade.subject_id   || material?.subject_id   || grade.curriculum_grid_id
        const subjectName = grade.subject_name || material?.subject_name || 'Sin materia'

        if (!subjectMap[subjectId]) {
          subjectMap[subjectId] = { subject_name: subjectName, subject_id: subjectId, activities: [] }
        }
        subjectMap[subjectId].activities.push({
          id:            grade.id,
          material_id:   grade.material_id,
          title:         grade.material_title || material?.title || 'Actividad',
          week:          grade.week           || material?.week  || null,
          percentage:    Number(grade.percentage || material?.percentage || 0),
          numeric_grade: Number(grade.numeric_grade),
          letter_grade:  grade.letter_grade,
          observation:   grade.observation || '',
          created_at:    grade.created_at,
        })
      }

      const subjects = Object.values(subjectMap).map(s => {
        // Promedio ponderado: Σ(nota * %) / Σ(%)
        let sumW = 0, sumP = 0
        s.activities.forEach(a => { sumW += a.numeric_grade * a.percentage; sumP += a.percentage })
        const weighted_average = sumP > 0
          ? (sumW / sumP).toFixed(2)
          : s.activities.length
            ? (s.activities.reduce((acc, a) => acc + a.numeric_grade, 0) / s.activities.length).toFixed(2)
            : '0.00'
        return { ...s, weighted_average }
      })

      const allNums = allGrades.map(g => Number(g.numeric_grade)).filter(n => n > 0)
      const general_average = allNums.length
        ? (allNums.reduce((a, b) => a + b, 0) / allNums.length).toFixed(2)
        : '0.00'

      return { data: { subjects, general_average, total_grades: allGrades.length } }
    }
  },
}
