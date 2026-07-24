import { prisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID de partido inválido' })

  const partido = await prisma.partido.findUnique({
    where: { id },
    include: {
      local: {
        include: { jugadores: { orderBy: { nombre: 'asc' } } }
      },
      visita: {
        include: { jugadores: { orderBy: { nombre: 'asc' } } }
      },
      categoria: true,
      estadisticas: true // Para precargar los datos si ya se guardaron antes
    }
  })

  if (!partido) throw createError({ statusCode: 404, statusMessage: 'Partido no encontrado' })

  return partido
})