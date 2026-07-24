export default defineNuxtRouteMiddleware((to, from) => {
  // Leemos la cookie del token
  const token = useCookie('auth_token')

  // Si no hay token y la ruta no es el login, lo pateamos al login
  if (!token.value && to.path !== '/intranet/login') {
    return navigateTo('/intranet/login')
  }

  // Si ya tiene token y trata de entrar al login, lo enviamos al panel
  if (token.value && to.path === '/intranet/login') {
    return navigateTo('/intranet/dashboard')
  }
})