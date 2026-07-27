// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth()

  // Obtenemos el usuario. `fetchUser` solo se ejecutará una vez gracias a `useState`.
  await fetchUser()

  const isLoggedIn = !!user.value

  // Rutas de la intranet
  if (to.path.startsWith('/intranet') && to.path !== '/intranet/login') {
    if (!isLoggedIn) {
      // Si no está logueado y quiere entrar a la intranet, lo mandamos al login.
      return navigateTo('/intranet/login')
    }
  }

  // Página de login
  if (to.path === '/intranet/login' && isLoggedIn) {
    // Si ya está logueado y va al login, lo mandamos al dashboard.
    return navigateTo('/intranet/dashboard')
  }
})