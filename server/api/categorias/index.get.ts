import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  // Trae todas las categorías ordenadas por ID
  return await prisma.categoria.findMany({
    orderBy: { id: 'asc' }
  })
})