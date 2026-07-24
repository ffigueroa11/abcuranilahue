import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { jornada, fecha_hora, local_id, visita_id, categoria_id } = body

  // Validaciones básicas
  if (!jornada || !fecha_hora || !local_id || !visita_id || !categoria_id) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan datos para programar el partido' })
  }

  if (local_id === visita_id) {
    throw createError({ statusCode: 400, statusMessage: 'Un equipo no puede jugar contra sí mismo' })
  }

  const nuevoPartido = await prisma.partido.create({
    data: {
      jornada: Number(jornada),
      // Transformamos el string del input datetime-local a un objeto Date real para PostgreSQL
      fecha_hora: new Date(fecha_hora), 
      local_id: Number(local_id),
      visita_id: Number(visita_id),
      categoria_id: Number(categoria_id),
      estado: 'PROGRAMADO'
    },
    include: {
      local: true,
      visita: true,
      categoria: true
    }
  })
  
  return nuevoPartido
})