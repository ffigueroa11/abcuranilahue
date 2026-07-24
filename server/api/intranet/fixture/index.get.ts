import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async () => {
  const partidos = await prisma.partido.findMany({
    orderBy: [
      { estado: 'asc' }, // Primero los PROGRAMADOS, luego los FINALIZADOS
      { fecha_hora: 'asc' }
    ],
    include: {
      local: true,
      visita: true,
      categoria: true,
      // AGREGADO: Traemos las estadísticas mínimas necesarias para calcular
      estadisticas: {
        select: { 
          puntos: true,
          jugador: { select: { club_id: true } }
        }
      }
    }
  })
  
  // Procesamos la sumatoria antes de enviar al cliente
  const partidosConEstado = partidos.map((p: any) => {
    let sumaLocal = 0
    let sumaVisita = 0

    p.estadisticas.forEach((e: any) => {
      if (e.jugador.club_id === p.local_id) sumaLocal += Number(e.puntos || 0)
      if (e.jugador.club_id === p.visita_id) sumaVisita += Number(e.puntos || 0)
    })

    // La planilla está cuadrada si está finalizado y la suma coincide EXACTAMENTE con el score global
    const estaCuadrada = p.estado === 'FINALIZADO' && 
                         p.score_local === sumaLocal && 
                         p.score_visita === sumaVisita

    // Eliminamos el array de estadísticas para que la red no se sobrecargue con datos que la vista no usará
    delete p.estadisticas

    return {
      ...p,
      planilla_cuadrada: estaCuadrada
    }
  })

  return partidosConEstado
})