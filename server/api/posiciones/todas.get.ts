import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  // Traemos todas las posiciones incluyendo los datos del club y la categoría
  const posiciones = await prisma.tablaPosicion.findMany({
    include: {
      club: true,
      categoria: true
    },
    orderBy: [
      { puntos: 'desc' },
      { dif: 'desc' }
    ]
  })
  
  return posiciones
})