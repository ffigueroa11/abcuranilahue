import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const equipoId = Number(event.context.params?.id)
  const query = getQuery(event)
  const categoriaId = Number(query.categoria_id)
  
  if (!equipoId || !categoriaId) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan parámetros requeridos' })
  }

  // Buscamos todos los partidos FINALIZADOS donde el equipo sea Local o Visita, dentro de la categoría
  const partidos = await prisma.partido.findMany({
    where: {
      categoria_id: categoriaId,
      estado: 'FINALIZADO',
      OR: [
        { local_id: equipoId },
        { visita_id: equipoId }
      ]
    },
    include: {
      local: { select: { id: true, nombre: true, logo_url: true } },
      visita: { select: { id: true, nombre: true, logo_url: true } }
    },
    orderBy: {
      fecha_hora: 'desc' // Los más recientes primero
    }
  })

  return partidos
})