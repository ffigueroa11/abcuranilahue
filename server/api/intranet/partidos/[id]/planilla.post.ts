import { prisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody(event)
  const { score_local_input, score_visita_input, estadisticas, finalizar } = body 

  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' })

  const partido = await prisma.partido.findUnique({
    where: { id },
    include: { 
      local: { include: { jugadores: true } }, 
      visita: { include: { jugadores: true } } 
    }
  })

  if (!partido) throw createError({ statusCode: 404, statusMessage: 'Partido no encontrado' })

  let sumLocal = 0
  let sumVisita = 0

  const localPlayerIds = new Set(partido.local.jugadores.map(j => j.id))
  const visitaPlayerIds = new Set(partido.visita.jugadores.map(j => j.id))

  for (const stat of estadisticas) {
    const puntos = Number(stat.puntos) || 0
    if (localPlayerIds.has(Number(stat.jugador_id))) {
      sumLocal += puntos
    } else if (visitaPlayerIds.has(Number(stat.jugador_id))) {
      sumVisita += puntos
    }
  }

  let finalScoreLocal = sumLocal
  let finalScoreVisita = sumVisita

  if (finalizar) {
    if (score_local_input !== undefined && score_local_input !== null && score_local_input !== '') {
      const parsedLocal = Number(score_local_input)
      if (parsedLocal !== sumLocal) {
        throw createError({ 
          statusCode: 400, 
          statusMessage: `Error Local: El marcador global ingresado (${parsedLocal}) no coincide con la suma de puntos de los jugadores (${sumLocal}).` 
        })
      }
      finalScoreLocal = parsedLocal
    }

    if (score_visita_input !== undefined && score_visita_input !== null && score_visita_input !== '') {
      const parsedVisita = Number(score_visita_input)
      if (parsedVisita !== sumVisita) {
        throw createError({ 
          statusCode: 400, 
          statusMessage: `Error Visita: El marcador global ingresado (${parsedVisita}) no coincide con la suma de puntos de los jugadores (${sumVisita}).` 
        })
      }
      finalScoreVisita = parsedVisita
    }
  } else {
    if (score_local_input !== undefined && score_local_input !== null && score_local_input !== '') {
      finalScoreLocal = Number(score_local_input)
    }
    if (score_visita_input !== undefined && score_visita_input !== null && score_visita_input !== '') {
      finalScoreVisita = Number(score_visita_input)
    }
  }

  // Guardado en transacción optimizado con Promise.all
  await prisma.$transaction(async (tx) => {
    // Mapeamos todas las promesas de upsert para ejecutarlas en paralelo
    const estadisticasPromises = estadisticas.map((stat: any) => {
      const puntos = Number(stat.puntos) || 0
      const triples = Number(stat.triples) || 0
      const faltas = Number(stat.faltas) || 0

      return tx.estadisticaPartido.upsert({
        where: {
          partido_id_jugador_id: {
            partido_id: id,
            jugador_id: Number(stat.jugador_id)
          }
        },
        update: { puntos, triples, faltas },
        create: {
          partido_id: id,
          jugador_id: Number(stat.jugador_id),
          puntos,
          triples,
          faltas
        }
      })
    })

    // Esperamos a que todas las estadísticas se guarden simultáneamente
    await Promise.all(estadisticasPromises)

    // Actualizamos el partido
    await tx.partido.update({
      where: { id },
      data: {
        score_local: finalScoreLocal,
        score_visita: finalScoreVisita,
        ...(finalizar ? { estado: 'FINALIZADO' } : {})
      }
    })
    
  }, 
  {
    // AQUÍ ESTÁ LA SOLUCIÓN:
    maxWait: 5000,  // 5 segundos máximo para intentar conectar con la BD
    timeout: 20000  // 20 segundos máximo para terminar toda la operación (por defecto eran 5)
  })

  return { success: true, score_local: finalScoreLocal, score_visita: finalScoreVisita }
})