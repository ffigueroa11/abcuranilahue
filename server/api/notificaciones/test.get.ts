import { enviarNotificacionMasiva } from '../../utils/push'

export default defineEventHandler(async () => {
  try {
    await enviarNotificacionMasiva(
      '¡Prueba Exitosa!', 
      'Las notificaciones locales de la Asociación están funcionando.',
      '/'
    )
    return { success: true, message: 'Notificación enviada' }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})