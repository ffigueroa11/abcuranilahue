import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  const borradores = await prisma.fixtureBorrador.findMany({
    include: {
      categoria: true,
      local: true,
      visita: true
    },
    orderBy: [
      { codigo_lote: 'desc' }, // Agrupa por lote más reciente
      { fecha_hora: 'asc' }    // Ordena los partidos cronológicamente
    ]
  })

  // Agrupamos los datos por código de lote en el backend para facilitar el trabajo del frontend
  const lotesMap = new Map<string, any>()
  
  for (const partido of borradores) {
    if (!lotesMap.has(partido.codigo_lote)) {
      lotesMap.set(partido.codigo_lote, {
        codigo: partido.codigo_lote,
        categoria: partido.categoria.nombre,
        fechaCreacion: partido.createdAt,
        partidos: []
      })
    }
    lotesMap.get(partido.codigo_lote).partidos.push(partido)
  }

  return Array.from(lotesMap.values())
})