// server/api/auth/logout.post.ts
export default defineEventHandler(async (event) => {
  // Borra la cookie de autenticación
  deleteCookie(event, 'auth_token')

  // Retorna un mensaje de éxito
  return { message: 'Sesión cerrada' }
})