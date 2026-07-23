import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // Busca un partido que tenga ID de YouTube y esté programado o en juego
  const partidoEnVivo = await prisma.partido.findFirst({
    where: {
      youtube_live_id: { not: null },
      estado: { in: ['PROGRAMADO', 'JUGANDO'] }
    },
    include: {
      local: true,
      visita: true
    }
  })
  
  return partidoEnVivo
})