// composables/useAuth.ts

import type { Usuario } from '@prisma/client'

// Definimos un tipo para el usuario, excluyendo el password_hash
type UserSession = Omit<Usuario, 'password_hash'>

export const useAuth = () => {
  // `useState` es el composable de Nuxt para gestionar estado compartido entre componentes y SSR.
  const user = useState<UserSession | null>('user', () => null)

  /**
   * Obtiene los datos del usuario desde el servidor.
   * El servidor leerá la cookie HttpOnly y devolverá los datos del usuario si es válida.
   */
  const fetchUser = async () => {
    try {
      // `useFetch` es seguro para llamar en el servidor y cliente.
      // Le damos una clave única para poder invalidar su caché más tarde.
      const { data } = await useFetch<UserSession>('/api/auth/user', { key: 'user-session' })
      user.value = data.value
    } catch (error) {
      // Si hay un error (ej. token inválido), nos aseguramos de que el usuario sea nulo.
      user.value = null
    }
  }

  /**
   * Cierra la sesión del usuario.
   */
  const logout = async () => {
    // Llama al endpoint de logout para que el servidor borre la cookie.
    await $fetch('/api/auth/logout', { method: 'POST' })
    // Limpia el estado del usuario en el cliente.
    user.value = null

    // Invalida la caché de la petición del usuario para asegurar que no se usen datos viejos.
    await clearNuxtData('user-session')

    // Redirige a la página de login para una experiencia de usuario clara.
    await navigateTo('/intranet/login')
  }

  return {
    user,
    fetchUser,
    logout
  }
}