import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categoriaId = Number(query.categoriaId)

  if (!categoriaId) return []

  const partidos = await prisma.partido.findMany({
    where: {
      estado: 'FINALIZADO',
      categoria_id: categoriaId
    },
    orderBy: { fecha_hora: 'desc' }, // 'desc' para que el partido más reciente salga primero
    take: 3,
    include: { local: true, visita: true }
  })
  
  return partidos
})