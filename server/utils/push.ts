import webpush from 'web-push'
import { prisma } from './prisma'

export const enviarNotificacionMasiva = async (titulo: string, mensaje: string, urlDestino: string = '/') => {
  const config = useRuntimeConfig()
  
  webpush.setVapidDetails(
    config.vapidSubject,
    config.public.vapidPublicKey,
    config.vapidPrivateKey
  )

  const payload = JSON.stringify({
    title: titulo,
    body: mensaje,
    url: urlDestino
  })

  // Obtener todos los dispositivos suscritos
  const suscripciones = await prisma.suscripcionPush.findMany()

  // Enviar a todos en paralelo
  const promesas = suscripciones.map(async (sub) => {
    try {
      await webpush.sendNotification({
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth }
      }, payload)
    } catch (error: any) {
      // 410 (Gone) significa que el usuario desinstaló la PWA o revocó el permiso.
      // Debemos limpiar la base de datos para no enviar "basura" la próxima vez.
      if (error.statusCode === 410 || error.statusCode === 404) {
        await prisma.suscripcionPush.delete({ where: { id: sub.id } })
      } else {
        console.error('Error enviando push:', error)
      }
    }
  })

  await Promise.all(promesas)
}