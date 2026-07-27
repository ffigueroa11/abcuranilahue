import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Guardamos o actualizamos (por si el endpoint ya existe)
  const suscripcion = await prisma.suscripcionPush.upsert({
    where: { endpoint: body.endpoint },
    update: {
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
    },
    create: {
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
    }
  })

  return { success: true }
})