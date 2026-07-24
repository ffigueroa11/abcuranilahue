import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  // Consultamos en paralelo los contadores principales
  const [totalClubes, totalJugadores, partidosRestantes] = await Promise.all([
    prisma.club.count(),
    prisma.jugador.count({ where: { activo: true } }),
    prisma.partido.count({
      where: {
        estado: {
          not: 'FINALIZADO' // Cuenta todo lo que esté PROGRAMADO o EN_CURSO
        }
      }
    })
  ])

  return {
    totalClubes,
    totalJugadores,
    partidosRestantes
  }
})