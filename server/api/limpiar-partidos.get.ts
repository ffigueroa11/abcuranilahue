import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  // 1. Borramos la tabla de posiciones actual
  await prisma.tablaPosicion.deleteMany()
  
  // 2. Borramos todos los partidos (incluyendo los de prueba)
  await prisma.partido.deleteMany()

  return { 
    status: 'success', 
    message: '¡Partidos de prueba eliminados! Tu base de datos está en blanco y lista para recibir solo la data oficial.' 
  }
})