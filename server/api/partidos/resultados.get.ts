import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  // Trae TODOS los partidos finalizados sin importar la categoría ni la cantidad
  const partidos = await prisma.partido.findMany({
    where: {
      estado: 'FINALIZADO'
    },
    orderBy: { 
      fecha_hora: 'desc' 
    },
    include: { 
      local: true, 
      visita: true,
      categoria: true 
    }
  })
  
  return partidos
})