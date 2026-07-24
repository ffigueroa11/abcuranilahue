import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categoriaId = query.categoria_id ? Number(query.categoria_id) : null

  // 1. Obtenemos todas las categorías para el selector
  const categorias = await prisma.categoria.findMany({ 
    orderBy: { id: 'asc' } 
  })

  const activeCatId = categoriaId || (categorias[0]?.id ?? 1)

  // 2. Buscamos todas las estadísticas de partidos FINALIZADOS de esta categoría
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

  // 3. Agrupamos y sumamos en memoria por jugador
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
    if (stat.puntos > 0 || stat.triples > 0 || stat.faltas > 0) {
      current.partidosJugados += 1
    }
  }

  const rankingList = Array.from(playerMap.values())

  // 4. Ordenamos para Goleadores (Más puntos, desempate por triples)
  const goleadores = [...rankingList].sort((a, b) => b.puntos - a.puntos || b.triples - a.triples)
  
  // 5. Ordenamos para Líderes en Triples (Más triples, desempate por puntos)
  const triplesLeaders = [...rankingList].sort((a, b) => b.triples - a.triples || b.puntos - b.puntos)

  return {
    categorias,
    selectedCategoriaId: activeCatId,
    goleadores,
    triples: triplesLeaders
  }
})