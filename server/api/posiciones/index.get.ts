import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categoriaId = Number(query.categoriaId)
  
  if (!categoriaId) return []

  return await prisma.tablaPosicion.findMany({
    where: { categoria_id: categoriaId },
    include: { club: true },
    orderBy: [
      { puntos: 'desc' }, // Primero ordena por mayor cantidad de puntos
      { dif: 'desc' }     // Si hay empate, desempata por diferencia de puntos
    ]
  })
})