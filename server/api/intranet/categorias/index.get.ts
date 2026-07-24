import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async () => {
  return await prisma.categoria.findMany({
    orderBy: { id: 'asc' } // O por nombre si lo prefieres
  })
})