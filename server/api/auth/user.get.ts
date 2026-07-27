// server/api/auth/user.get.ts
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // Obtenemos el token de la cookie HttpOnly
  const token = getCookie(event, 'auth_token')

  // IMPORTANTE: Prevenir que el navegador guarde en caché esta respuesta.
  // Esto asegura que siempre se verifique el estado de la sesión contra el servidor.
  setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
  setHeader(event, 'Pragma', 'no-cache') // Compatibilidad con HTTP/1.0
  setHeader(event, 'Expires', '0') // Compatibilidad con proxies

  if (!token) {
    // Si no hay token, no hay usuario.
    return null
  }

  const secret = process.env.JWT_SECRET || 'clave_secreta_temporal_muy_segura_abc'

  try {
    // Verificamos y decodificamos el token
    const user = jwt.verify(token, secret)
    return user
  } catch (error) {
    // Si el token es inválido o ha expirado, no hay usuario.
    return null
  }
})