import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  // 1. Borramos la tabla de posiciones actual para recalcular todo en limpio
  await prisma.tablaPosicion.deleteMany()

  // 2. Traemos todos los partidos finalizados
  const partidos = await prisma.partido.findMany({
    where: { estado: 'FINALIZADO' }
  })

  const stats: Record<string, any> = {}

  const initClub = (clubId: number, categoriaId: number) => {
    const key = `${clubId}-${categoriaId}`
    if (!stats[key]) {
      stats[key] = {
        club_id: clubId,
        categoria_id: categoriaId,
        pj: 0, pg: 0, pp: 0, wo: 0, puntos: 0, pf: 0, pc: 0, dif: 0
      }
    }
    return key
  }

  // 3. Procesar la matemática de cada partido
  partidos.forEach(p => {
    const keyLocal = initClub(p.local_id, p.categoria_id)
    const keyVisita = initClub(p.visita_id, p.categoria_id)

    stats[keyLocal].pj++
    stats[keyVisita].pj++

    stats[keyLocal].pf += p.score_local
    stats[keyLocal].pc += p.score_visita
    
    stats[keyVisita].pf += p.score_visita
    stats[keyVisita].pc += p.score_local

    // NUEVO: Detección inteligente de W.O. leyendo directamente el marcador
    const perdedorLocalPorWO = p.score_local === 0 && p.score_visita === 20
    const perdedorVisitaPorWO = p.score_local === 20 && p.score_visita === 0

    if (p.score_local > p.score_visita) {
      // Local gana
      stats[keyLocal].pg++
      stats[keyLocal].puntos += 3

      // Visita pierde
      stats[keyVisita].pp++
      if (perdedorVisitaPorWO) {
        stats[keyVisita].wo++
        // Castigo por no presentación: 0 puntos
      } else {
        stats[keyVisita].puntos += 1 // Derrota normal: 1 punto
      }
      
    } else if (p.score_visita > p.score_local) {
      // Visita gana
      stats[keyVisita].pg++
      stats[keyVisita].puntos += 3

      // Local pierde
      stats[keyLocal].pp++
      if (perdedorLocalPorWO) {
        stats[keyLocal].wo++
        // Castigo por no presentación: 0 puntos
      } else {
        stats[keyLocal].puntos += 1 // Derrota normal: 1 punto
      }
    }
  })

  // 4. Calcular la diferencia final de puntos e insertar en la base de datos
  const recordsToInsert = Object.values(stats).map(s => {
    s.dif = s.pf - s.pc
    return s
  })

  for (const record of recordsToInsert) {
    await prisma.tablaPosicion.create({ data: record })
  }

  return {
    status: 'success',
    message: `Tabla de posiciones recalculada con éxito. Se detectaron W.O. automáticamente y se castigó con 0 puntos.`
  }
})