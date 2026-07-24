import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // Recibimos un arreglo con los IDs de las categorías seleccionadas
  const { nombre, numero, posicion, club_id, categoriasIds } = body

  if (!nombre || !club_id) {
    throw createError({ statusCode: 400, statusMessage: 'El nombre es obligatorio' })
  }

  // Preparamos los datos base
  const dataToSave: any = {
    nombre,
    club_id: Number(club_id),
    numero: numero ? Number(numero) : null,
    posicion: posicion || null,
  }

  // Si enviaron categorías, usamos 'connect' de Prisma para enlazarlas
  if (categoriasIds && Array.isArray(categoriasIds) && categoriasIds.length > 0) {
    dataToSave.categorias = {
      connect: categoriasIds.map((id: number) => ({ id: Number(id) }))
    }
  }

  const nuevoJugador = await prisma.jugador.create({
    data: dataToSave,
    include: { categorias: true } // Devolvemos el jugador con sus categorías para el frontend
  })
  
  return nuevoJugador
})