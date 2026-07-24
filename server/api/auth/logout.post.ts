export default defineEventHandler((event) => {
  // Borramos la cookie estableciendo su tiempo de vida en 0
  deleteCookie(event, 'auth_token', {
    httpOnly: false,
    path: '/'
  })
  
  return { success: true, message: 'Sesión cerrada correctamente' }
})