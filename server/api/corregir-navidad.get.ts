import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  // 1. Identificar ambos clubes
  const clubCorrecto = await prisma.club.findFirst({ where: { nombre: 'C.D. Navidad' } })
  const clubErroneo = await prisma.club.findFirst({ where: { nombre: 'Navidad' } })

  if (!clubCorrecto || !clubErroneo) {
    return { status: 'error', message: 'No se encontraron ambos clubes. Quizás ya lo corregiste.' }
  }

  // 2. Transferir todos los partidos donde el club erróneo jugó de LOCAL
  const partidosLocal = await prisma.partido.updateMany({
    where: { local_id: clubErroneo.id },
    data: { local_id: clubCorrecto.id }
  })

  // 3. Transferir todos los partidos donde el club erróneo jugó de VISITA
  const partidosVisita = await prisma.partido.updateMany({
    where: { visita_id: clubErroneo.id },
    data: { visita_id: clubCorrecto.id }
  })

  // 4. Ahora que el club erróneo ya no tiene partidos, lo eliminamos con seguridad
  await prisma.club.delete({
    where: { id: clubErroneo.id }
  })

  return { 
    status: 'success', 
    message: `¡Listo! Se traspasaron ${partidosLocal.count} partidos de local y ${partidosVisita.count} de visita a C.D. NAVIDAD. El club duplicado fue eliminado.` 
  }
})