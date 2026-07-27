import { enviarNotificacionMasiva } from '../../utils/push'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validaciones básicas
  if (!body.url || !body.partido) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan datos para la alerta' })
  }

  try {
    // Reutilizamos tu función maestra de Push
    await enviarNotificacionMasiva(
      '🔴 ¡Estamos en VIVO!', 
      `${body.partido}. Únete a la transmisión ahora.`,
      body.url // Al hacer clic en la notificación, el celular abrirá este link directamente
    )
    
    return { success: true, message: 'Alerta de transmisión enviada' }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})