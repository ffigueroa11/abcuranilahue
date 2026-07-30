import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  // 1. Obtenemos todas las tablas base pre-ordenadas general
  const tablaBase = await prisma.tablaPosicion.findMany({
    include: {
      club: true,
      categoria: true
    },
    orderBy: [
      { categoria_id: 'asc' }, // Primero ordenamos por categoría
      { puntos: 'desc' },
      { dif: 'desc' }
    ]
  })

  // 2. Obtenemos TODOS los partidos finalizados para calcular duelos directos
  const partidos = await prisma.partido.findMany({
    where: { estado: 'FINALIZADO' },
    select: {
      categoria_id: true,
      local_id: true,
      visita_id: true,
      score_local: true,
      score_visita: true
    }
  })

  // 3. Agrupar los equipos por categoría para no mezclar peras con manzanas
  const categoriasMap = new Map<number, typeof tablaBase>()
  for (const equipo of tablaBase) {
    if (!categoriasMap.has(equipo.categoria_id)) categoriasMap.set(equipo.categoria_id, [])
    categoriasMap.get(equipo.categoria_id)!.push(equipo)
  }

  const tablaFinal = []

  // 4. Procesar los empates FIBA de cada categoría de forma independiente
  for (const [categoriaId, equiposCategoria] of categoriasMap.entries()) {
    const gruposPuntos = new Map<number, typeof equiposCategoria>()
    
    // Agrupamos por puntaje dentro de la categoría
    for (const equipo of equiposCategoria) {
      if (!gruposPuntos.has(equipo.puntos)) gruposPuntos.set(equipo.puntos, [])
      gruposPuntos.get(equipo.puntos)!.push(equipo)
    }

    // Ordenamos los puntajes de mayor a menor
    const puntajesOrdenados = Array.from(gruposPuntos.keys()).sort((a, b) => b - a)

    for (const pts of puntajesOrdenados) {
      const empatados = gruposPuntos.get(pts)!

      // Si no hay empate en este puntaje, pasa directo
      if (empatados.length === 1) {
        tablaFinal.push(empatados[0])
        continue
      }

      // SI HAY EMPATE: Aplicamos FIBA (Mini-tabla)
      const idsEmpatados = empatados.map(e => e.club.id)
      
      // Filtramos los partidos directos SOLO de esta categoría y entre estos equipos
      const partidosDirectos = partidos.filter(p => 
        p.categoria_id === categoriaId &&
        idsEmpatados.includes(p.local_id) && 
        idsEmpatados.includes(p.visita_id)
      )

      const miniTabla = empatados.map(equipo => {
        let ptsH2H = 0
        let difH2H = 0

        partidosDirectos.forEach(p => {
          if (p.local_id === equipo.club.id) {
            if (p.score_local > p.score_visita) ptsH2H += 2
            else if (p.score_local < p.score_visita) ptsH2H += 1
            difH2H += (p.score_local - p.score_visita)
          } else if (p.visita_id === equipo.club.id) {
            if (p.score_visita > p.score_local) ptsH2H += 2
            else if (p.score_visita < p.score_local) ptsH2H += 1
            difH2H += (p.score_visita - p.score_local)
          }
        })

        return { ...equipo, ptsH2H, difH2H }
      })

      // Orden final según reglamento FIBA
      miniTabla.sort((a, b) => {
        if (b.ptsH2H !== a.ptsH2H) return b.ptsH2H - a.ptsH2H
        if (b.difH2H !== a.difH2H) return b.difH2H - a.difH2H
        if (b.dif !== a.dif) return b.dif - a.dif
        return 0
      })

      // Mantenemos las variables H2H para que el Modal del frontend funcione
      miniTabla.forEach(e => {
        tablaFinal.push(e) 
      })
    }
  }

  return tablaFinal
})