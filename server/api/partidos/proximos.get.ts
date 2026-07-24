import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categoriaId = Number(query.categoriaId)

  if (!categoriaId) return []

  const partidos = await prisma.partido.findMany({
    where: {
      estado: 'PROGRAMADO',
      categoria_id: categoriaId
    },
    orderBy: { fecha_hora: 'asc' },
    take: 3,
    include: { 
      local: true, 
      visita: true,
      categoria: true 
    }
  })
  
  return partidos
})