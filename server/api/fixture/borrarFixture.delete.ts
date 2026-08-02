import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    // Elimina todos los registros de la tabla FixtureBorrador
    const result = await prisma.fixtureBorrador.deleteMany({})

    return { 
      success: true, 
      message: 'Todos los borradores han sido eliminados',
      eliminados: result.count
    }
  } catch (error) {
    console.error('Error al vaciar los borradores:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno al intentar eliminar los borradores.'
    })
  }
})