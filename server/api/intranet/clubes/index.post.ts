import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { nombre, logo_url } = body

  if (!nombre) {
    throw createError({ statusCode: 400, statusMessage: 'El nombre del club es obligatorio' })
  }

  const nuevoClub = await prisma.club.create({
    data: {
      nombre,
      logo_url
    }
  })
  
  return nuevoClub
})