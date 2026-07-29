import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categoriaId = Number(query.categoriaId)
  
  if (!categoriaId) return []

  // 1. Obtenemos la tabla base pre-ordenada por los criterios generales 
  // (FIBA Criterio 1: Puntos totales, FIBA Criterio 3: Diferencia general)
  const tablaBase = await prisma.tablaPosicion.findMany({
    where: { categoria_id: categoriaId },
    include: { club: true },
    orderBy: [
      { puntos: 'desc' },
      { dif: 'desc' }
    ]
  })

  // 2. Obtenemos los partidos finalizados para resolver los enfrentamientos directos
  const partidos = await prisma.partido.findMany({
    where: {
      categoria_id: categoriaId,
      estado: 'FINALIZADO'
    },
    select: {
      local_id: true,
      visita_id: true,
      score_local: true,
      score_visita: true
    }
  })

  // 3. Agrupamos a los equipos según su puntaje general
  const grupos = new Map<number, typeof tablaBase>()
  for (const equipo of tablaBase) {
    if (!grupos.has(equipo.puntos)) grupos.set(equipo.puntos, [])
    grupos.get(equipo.puntos)!.push(equipo)
  }

  const tablaFinal = []

  // Ordenamos los puntajes de mayor a menor para procesar la tabla desde el primer lugar hacia abajo
  const puntajesOrdenados = Array.from(grupos.keys()).sort((a, b) => b - a)

  for (const pts of puntajesOrdenados) {
    const empatados = grupos.get(pts)!

    // Si no hay empate en este puntaje, pasa directo a la tabla final
    if (empatados.length === 1) {
      tablaFinal.push(empatados[0])
      continue
    }

    // SI HAY EMPATE: Aplicamos criterios FIBA (Mini-tabla de enfrentamientos directos)
    const idsEmpatados = empatados.map(e => e.club.id)
    
    // Filtramos SOLO los partidos jugados ENTRE los equipos que están empatados
    const partidosDirectos = partidos.filter(p => 
      idsEmpatados.includes(p.local_id) && idsEmpatados.includes(p.visita_id)
    )

    // Calculamos las estadísticas de la mini-tabla para cada equipo empatado
    const miniTabla = empatados.map(equipo => {
      let ptsH2H = 0 // Puntos ganados en los duelos directos
      let difH2H = 0 // Diferencia de goles en los duelos directos

      partidosDirectos.forEach(p => {
        if (p.local_id === equipo.club.id) {
          if (p.score_local > p.score_visita) ptsH2H += 2 // Victoria
          else if (p.score_local < p.score_visita) ptsH2H += 1 // Derrota
          difH2H += (p.score_local - p.score_visita)
        } else if (p.visita_id === equipo.club.id) {
          if (p.score_visita > p.score_local) ptsH2H += 2 // Victoria
          else if (p.score_visita < p.score_local) ptsH2H += 1 // Derrota
          difH2H += (p.score_visita - p.score_local)
        }
      })

      return { ...equipo, ptsH2H, difH2H }
    })

    // Ordenamos el grupo empatado rigurosamente según el reglamento FIBA
    miniTabla.sort((a, b) => {
      // FIBA 1: Mayor cantidad de puntos (clasificación) en los partidos entre ellos
      if (b.ptsH2H !== a.ptsH2H) return b.ptsH2H - a.ptsH2H
      
      // FIBA 2: Mayor diferencia de puntos anotados y recibidos en los partidos entre ellos
      if (b.difH2H !== a.difH2H) return b.difH2H - a.difH2H
      
      // FIBA 3: Si siguen empatados (ej: triple empate idéntico), se usa la diferencia de puntos de TODOS los partidos jugados en el campeonato
      if (b.dif !== a.dif) return b.dif - a.dif
      
      return 0
    })

    // Limpiamos las variables temporales (H2H) para que el frontend reciba un objeto limpio y lo agregamos a la tabla final
    miniTabla.forEach(e => {
      const { ptsH2H, difH2H, ...original } = e
      tablaFinal.push(original)
    })
  }

  return tablaFinal
})