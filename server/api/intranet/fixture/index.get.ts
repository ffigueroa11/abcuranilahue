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
      categoria: true
    }
  })
  
  return partidos
})