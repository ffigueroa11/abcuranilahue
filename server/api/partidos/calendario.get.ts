import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  // Traemos todos los partidos futuros, ordenados del más próximo al más lejano
  const partidos = await prisma.partido.findMany({
    where: {
      estado: 'PROGRAMADO'
    },
    orderBy: {
      fecha_hora: 'asc'
    },
    include: {
      local: true,
      visita: true,
      categoria: true
    }
  })
  
  return partidos
})