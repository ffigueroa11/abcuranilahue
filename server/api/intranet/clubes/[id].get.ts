import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  // Extraemos el ID de la URL
  const clubId = Number(event.context.params?.id)

  if (!clubId) {
    throw createError({ statusCode: 400, statusMessage: 'ID de club inválido' })
  }

  // Buscamos el club e incluimos todos sus jugadores ordenados por número de camiseta
  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: {
      jugadores: {
        include: { categorias: true }, // <--- INCLUIMOS LAS CATEGORÍAS
        orderBy: { nombre: 'asc' }     // <--- ORDENAMOS POR NOMBRE
      }
    }
  })
  
  return club
})