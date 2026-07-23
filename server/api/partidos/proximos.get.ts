import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // Busca los próximos 3 partidos que estén en estado "PROGRAMADO"
  const partidos = await prisma.partido.findMany({
    where: {
      estado: 'PROGRAMADO'
    },
    orderBy: {
      fecha_hora: 'asc'
    },
    take: 3,
    include: {
      local: true,
      visita: true
    }
  })
  
  return partidos
})