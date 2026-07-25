import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // 1. Obtener parámetros de la URL
  const query = getQuery(event)
  const jugadorId = Number(query.jugador_id)
  const categoriaId = Number(query.categoria_id)
  const tipo = String(query.tipo) // 'puntos' o 'triples'

  // Validaciones de seguridad
  if (!jugadorId || !categoriaId || !['puntos', 'triples'].includes(tipo)) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan parámetros requeridos o son inválidos' })
  }

  // 2. Buscamos al jugador para saber a qué club pertenece (vital para determinar el rival)
  const jugador = await prisma.jugador.findUnique({
    where: { id: jugadorId },
    select: { club_id: true }
  })

  if (!jugador) {
    throw createError({ statusCode: 404, statusMessage: 'Jugador no encontrado' })
  }

  // 3. Consultamos sus estadísticas en partidos finalizados de esta categoría
  const estadisticas = await prisma.estadisticaPartido.findMany({
    where: {
      jugador_id: jugadorId,
      partido: {
        categoria_id: categoriaId,
        estado: 'FINALIZADO'
      },
      // Solo traemos partidos donde realmente anotó (puntos o triples mayor a 0)
      ...(tipo === 'puntos' ? { puntos: { gt: 0 } } : { triples: { gt: 0 } })
    },
    include: {
      partido: {
        include: {
          local: true,
          visita: true
        }
      }
    }
  })

  // 4. Mapear datos para extraer al equipo rival
  const detalles = estadisticas.map(est => {
    const partido = est.partido
    
    // Si el club del jugador es el equipo local, entonces el rival es la visita (y viceversa)
    const esLocal = partido.local_id === jugador.club_id
    const rival = esLocal ? partido.visita : partido.local

    return {
      rivalNombre: rival.nombre,
      rivalLogo: rival.logo_url,
      cantidad: tipo === 'puntos' ? est.puntos : est.triples
    }
  })

  // 5. Agrupar resultados (Por si han jugado contra el mismo equipo más de una vez en la temporada)
  const agrupados = detalles.reduce((acc: any[], current) => {
    const existente = acc.find(item => item.rivalNombre === current.rivalNombre)
    if (existente) {
      existente.cantidad += current.cantidad
    } else {
      acc.push({ ...current })
    }
    return acc
  }, [])

  // 6. Ordenar de mayor a menor cantidad
  agrupados.sort((a, b) => b.cantidad - a.cantidad)

  return agrupados
})