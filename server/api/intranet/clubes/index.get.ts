import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async () => {
  const clubes = await prisma.club.findMany({
    orderBy: {
      nombre: 'asc'
    },
    include: {
      // Usamos _count para saber cuántos jugadores tiene cada equipo sin cargar toda la data
      _count: {
        select: { jugadores: true }
      }
    }
  })
  
  return clubes
})