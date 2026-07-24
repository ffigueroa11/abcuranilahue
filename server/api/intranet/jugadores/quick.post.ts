import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, nombre, numero, club_id, categorias_ids } = body

  if (!nombre || !club_id) {
    throw createError({ statusCode: 400, statusMessage: 'El nombre y el club son obligatorios.' })
  }

  // Mapeamos el array de IDs al formato que espera Prisma: [{ id: 1 }, { id: 2 }]
  const mappedCategorias = categorias_ids && categorias_ids.length > 0
    ? categorias_ids.map((cId: number) => ({ id: Number(cId) }))
    : []

  if (id) {
    // ACTUALIZACIÓN: Si existe el ID, usamos 'set' para reemplazar las relaciones
    const jugadorActualizado = await prisma.jugador.update({
      where: { id: Number(id) },
      data: {
        nombre: nombre.toUpperCase(),
        numero: numero ? Number(numero) : null,
        club_id: Number(club_id),
        categorias: {
          set: mappedCategorias
        }
      },
      include: { categorias: true }
    })
    return jugadorActualizado
  } else {
    // CREACIÓN: Si es nuevo, usamos 'connect' para enlazarlo con las categorías
    const nuevoJugador = await prisma.jugador.create({
      data: {
        nombre: nombre.toUpperCase(),
        numero: numero ? Number(numero) : null,
        club_id: Number(club_id),
        activo: true,
        categorias: {
          connect: mappedCategorias
        }
      },
      include: { categorias: true }
    })
    return nuevoJugador
  }
})