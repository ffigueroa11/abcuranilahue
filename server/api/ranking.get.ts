import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categoriaId = query.categoria_id ? Number(query.categoria_id) : null

  // 1. Obtenemos las categorías para el selector público
  const categorias = await prisma.categoria.findMany({ 
    orderBy: { id: 'asc' } 
  })

  // Retoque de seguridad: Si no hay categorías en la BD, retornamos todo vacío para que no explote
  const activeCatId = categoriaId || categorias[0]?.id
  if (!activeCatId) {
    return { categorias: [], selectedCategoriaId: null, goleadores: [], triples: [] }
  }

  // 2. Buscamos estadísticas de partidos FINALIZADOS de la categoría
  const estadisticas = await prisma.estadisticaPartido.findMany({
    where: {
      partido: {
        categoria_id: activeCatId,
        estado: 'FINALIZADO'
      }
    },
    include: {
      jugador: {
        include: {
          club: true
        }
      }
    }
  })

  // 3. Agrupamos y sumamos por jugador
  const playerMap = new Map<number, { 
    jugadorId: number, 
    nombre: string, 
    numero: number | null, 
    clubNombre: string, 
    clubLogo: string | null, 
    puntos: number, 
    triples: number, 
    partidosJugados: number 
  }>()

  for (const stat of estadisticas) {
    const jId = stat.jugador_id
    if (!playerMap.has(jId)) {
      playerMap.set(jId, {
        jugadorId: jId,
        nombre: stat.jugador.nombre,
        numero: stat.jugador.numero,
        clubNombre: stat.jugador.club?.nombre || 'Sin Club',
        clubLogo: stat.jugador.club?.logo_url || null,
        puntos: 0,
        triples: 0,
        partidosJugados: 0
      })
    }
    const current = playerMap.get(jId)!
    current.puntos += stat.puntos
    current.triples += stat.triples
    
    // Si anotó, tiró triples o cometió faltas, asumimos que jugó el partido
    if (stat.puntos > 0 || stat.triples > 0 || stat.faltas > 0) {
      current.partidosJugados += 1
    }
  }

  const rankingList = Array.from(playerMap.values())

  // 4. Ordenamos y limitamos estrictamente al Top 10
  const goleadores = [...rankingList]
    .sort((a, b) => b.puntos - a.puntos || b.triples - a.triples)
    .slice(0, 10)
  
  const triplesLeaders = [...rankingList]
    .sort((a, b) => b.triples - a.triples || b.puntos - a.puntos)
    .slice(0, 10)

  return {
    categorias,
    selectedCategoriaId: activeCatId,
    goleadores,
    triples: triplesLeaders
  }
})