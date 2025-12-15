// src/utils/excelService.js
import * as XLSX from 'xlsx'

export const excelService = {
  readExcel: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
            raw: false,
            defval: ''
          })
          resolve(jsonData)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(file)
    })
  },

  downloadTemplate: () => {
    const templateData = [
      {
        'Nombre': 'Juan',
        'Apellido': 'Pérez',
        'Email': 'juan.perez@ejemplo.com',
        'Usuario': 'juanp',
        'Contraseña': 'password123',
        'Rol': 'estudiante'
      },
      {
        'Nombre': 'María',
        'Apellido': 'González',
        'Email': 'maria.gonzalez@ejemplo.com',
        'Usuario': 'mariag',
        'Contraseña': 'password123',
        'Rol': 'profesor'
      }
    ]

    const worksheet = XLSX.utils.json_to_sheet(templateData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios')

    const maxWidth = 20
    const cols = Object.keys(templateData[0]).map(() => ({ wch: maxWidth }))
    worksheet['!cols'] = cols

    XLSX.writeFile(workbook, 'plantilla_usuarios.xlsx')
  },

  // ⭐ ACTUALIZADO: Ahora acepta schoolIds para asignarlos automáticamente
  validateUserData: (data, availableRoles, schoolIds = []) => {
    const errors = []
    const validData = []

    console.log('🔍 Validando datos de Excel')
    console.log('School IDs a asignar:', schoolIds)

    data.forEach((row, index) => {
      const rowNumber = index + 2
      const rowErrors = []

      if (!row.Nombre || row.Nombre.trim() === '') {
        rowErrors.push(`Fila ${rowNumber}: Nombre es requerido`)
      }
      if (!row.Apellido || row.Apellido.trim() === '') {
        rowErrors.push(`Fila ${rowNumber}: Apellido es requerido`)
      }
      if (!row.Email || row.Email.trim() === '') {
        rowErrors.push(`Fila ${rowNumber}: Email es requerido`)
      } else if (!isValidEmail(row.Email)) {
        rowErrors.push(`Fila ${rowNumber}: Email inválido`)
      }
      if (!row.Usuario || row.Usuario.trim() === '') {
        rowErrors.push(`Fila ${rowNumber}: Usuario es requerido`)
      }
      if (!row.Contraseña || row.Contraseña.trim() === '') {
        rowErrors.push(`Fila ${rowNumber}: Contraseña es requerida`)
      }
      if (!row.Rol || row.Rol.trim() === '') {
        rowErrors.push(`Fila ${rowNumber}: Rol es requerido`)
      } else {
        const roleName = row.Rol.toLowerCase().trim()
        const roleExists = availableRoles.some(r => r.name.toLowerCase() === roleName)
        if (!roleExists) {
          rowErrors.push(`Fila ${rowNumber}: Rol "${row.Rol}" no válido. Roles disponibles: ${availableRoles.map(r => r.name).join(', ')}`)
        }
      }

      if (rowErrors.length > 0) {
        errors.push(...rowErrors)
      } else {
        const roleName = row.Rol.toLowerCase().trim()
        const role = availableRoles.find(r => r.name.toLowerCase() === roleName)
        
        const userData = {
          first_name: row.Nombre.trim(),
          last_name: row.Apellido.trim(),
          email: row.Email.trim().toLowerCase(),
          username: row.Usuario.trim().toLowerCase(),
          password: row.Contraseña.trim(),
          roles: role ? [role.id] : [],
          roleName: role ? role.name : ''
        }

        // ⭐ NUEVO: Asignar school_ids si se proporcionan
        if (schoolIds && schoolIds.length > 0) {
          userData.school_ids = schoolIds
          console.log(`Usuario ${userData.email} tendrá school_ids:`, schoolIds)
        }

        validData.push(userData)
      }
    })

    console.log('✅ Validación completada:', {
      totalRows: data.length,
      validRows: validData.length,
      errors: errors.length
    })

    return { validData, errors }
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}