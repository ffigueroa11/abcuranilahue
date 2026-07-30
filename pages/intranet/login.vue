<template>
  <div class="min-h-[100dvh] bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Fondos decorativos -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-900/10 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="w-full max-w-md bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
      
      <div class="text-center mb-8">
        <h1 class="text-2xl font-black uppercase tracking-tight text-zinc-100 flex items-center justify-center gap-2">
          <span class="w-2 h-6 bg-amber-600 rounded-sm"></span>
          Intranet ABC
        </h1>
        <p class="text-zinc-400 text-sm mt-2 font-medium">Acceso exclusivo para administración y clubes</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Correo Electrónico</label>
          <input 
            v-model="formulario.email"
            type="email" 
            required
            class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
            placeholder="admin@abcuranilahue.cl"
          />
        </div>

        <div>
          <label class="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Contraseña</label>
          <input 
            v-model="formulario.password"
            type="password" 
            required
            class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
            placeholder="••••••••"
          />
        </div>

        <div v-if="errorMensaje" class="bg-red-950/50 border border-red-900/50 text-red-500 text-xs font-bold p-3 rounded-lg text-center">
          {{ errorMensaje }}
        </div>

        <button 
          type="submit" 
          :disabled="cargando"
          class="w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed border border-red-700 text-white px-6 py-3.5 rounded-lg shadow-[0_0_15px_rgba(139,0,0,0.4)] font-black text-sm uppercase transition-all flex justify-center items-center gap-2 mt-4"
        >
          <span v-if="cargando" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          {{ cargando ? 'Verificando...' : 'Ingresar al Sistema' }}
        </button>
      </form>
      
      <div class="mt-8 text-center">
        <NuxtLink to="/" class="text-xs text-zinc-500 hover:text-amber-500 font-bold uppercase tracking-widest transition-colors">
          &larr; Volver al sitio público
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Desactivamos el layout principal (el que tiene navbar y footer) para la vista de login
definePageMeta({
  layout: false,
  middleware: 'auth' // Activamos el guardián
})

const formulario = ref({
  email: '',
  password: ''
})

const errorMensaje = ref('')
const cargando = ref(false)

// Usamos nuestro composable de autenticación
const { user } = useAuth()

const handleLogin = async () => {
  errorMensaje.value = ''
  cargando.value = true

  try {
    const loggedInUser = await $fetch('/api/auth/login', {
      method: 'POST',
      body: formulario.value
    })

    // Actualizamos manualmente el estado de usuario compartido con la respuesta de la API.
    user.value = loggedInUser

    // y forzamos la redirección usando await
    await navigateTo('/intranet/dashboard')
    
  } catch (e: any) {
    // $fetch lanza un error automáticamente si la API falla (ej. 401)
    errorMensaje.value = e.data?.statusMessage || 'Error al iniciar sesión'
  } finally {
    cargando.value = false
  }
}
</script>