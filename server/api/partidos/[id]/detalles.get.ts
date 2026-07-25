import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID de partido no válido' })
  }

  // Consultamos el partido y sus estadísticas completas
  const partido = await prisma.partido.findUnique({
    where: { id },
    include: {
      local: true,
      visita: true,
      estadisticas: {
        include: {
          jugador: {
            select: { id: true, nombre: true, numero: true, club_id: true } // Solo datos ligeros
          }
        },
        orderBy: { puntos: 'desc' } // El backend hace el trabajo de ordenar a los goleadores
      }
    }
  })

  if (!partido) {
    throw createError({ statusCode: 404, statusMessage: 'Partido no encontrado' })
  }

  // Pre-procesamos la data para que el frontend no tenga que pensar
  const statsLocal = partido.estadisticas.filter(e => e.jugador.club_id === partido.local_id)
  const statsVisita = partido.estadisticas.filter(e => e.jugador.club_id === partido.visita_id)

  // Eliminamos el array original crudo para ahorrar peso en la red
  delete (partido as any).estadisticas

  return {
    ...partido,
    statsLocal,
    statsVisita
  }
})