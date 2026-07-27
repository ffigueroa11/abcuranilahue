<template>
  <!-- El banner flotará en la parte inferior de la pantalla -->
  <div 
    v-if="mostrarBanner" 
    class="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-2xl p-4 z-50 flex items-start gap-4 transition-all transform"
  >
    <!-- Ícono de Campana Animado -->
    <div class="bg-blue-600/20 p-2.5 rounded-xl text-blue-500 flex-shrink-0 mt-0.5">
      <svg class="w-6 h-6 origin-top animate-[wiggle_1s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    </div>
    
    <!-- Contenido -->
    <div class="flex-1">
      <h4 class="text-zinc-100 font-black text-sm uppercase tracking-wide">Alertas del Campeonato</h4>
      <p class="text-zinc-400 text-xs mt-1 leading-relaxed">
        Activa las notificaciones para enterarte al instante de resultados, partidos en vivo y cambios en el fixture.
      </p>
      
      <!-- Botones de Acción -->
      <div class="flex gap-2 mt-4">
        <button 
          @click="solicitarPermiso" 
          :disabled="pending"
          class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors shadow-lg flex-1 flex justify-center items-center h-9"
        >
          <span v-if="pending" class="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
          <span v-else>Activar</span>
        </button>
        <button 
          @click="ocultarTemporalmente" 
          class="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-bold transition-colors flex-1 h-9"
        >
          Ahora no
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const mostrarBanner = ref(false)
const pending = ref(false)

// Función utilitaria VAPID
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Lógica de visibilidad al cargar la app
onMounted(() => {
  // 1. Verificamos si el navegador soporta notificaciones
  if (!('Notification' in window)) return

  // 2. Si el usuario ya aceptó (granted) o bloqueó permanentemente (denied), no mostramos nada.
  // 'default' significa que aún no se le ha preguntado.
  if (Notification.permission !== 'default') return

  // 3. Verificamos si el usuario le dio a "Ahora no" recientemente (guardado en LocalStorage)
  const bannerOculto = localStorage.getItem('push_banner_dismissed')
  if (bannerOculto) {
    const fechaOculto = new Date(bannerOculto).getTime()
    const hoy = new Date().getTime()
    const diasPasados = (hoy - fechaOculto) / (1000 * 3600 * 24)
    
    // Si han pasado menos de 7 días desde que dijo "Ahora no", respetamos su decisión
    if (diasPasados < 7) return 
  }

  // Si pasa todas las validaciones, mostramos el banner
  mostrarBanner.value = true
})

const ocultarTemporalmente = () => {
  localStorage.setItem('push_banner_dismissed', new Date().toISOString())
  mostrarBanner.value = false
}

const solicitarPermiso = async () => {
  pending.value = true
  
  try {
    // Al hacer clic aquí, recién disparamos el pop-up nativo del navegador
    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.ready
      const applicationServerKey = urlBase64ToUint8Array(config.public.vapidPublicKey as string)
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      })

      await $fetch('/api/notificaciones/suscribir', {
        method: 'POST',
        body: subscription.toJSON()
      })

      // Éxito: Ocultamos el banner para siempre
      mostrarBanner.value = false
    } else {
      // Si el usuario bloquea el permiso nativo en ese momento, ocultamos el banner
      mostrarBanner.value = false
    }
  } catch (error) {
    console.error('Error suscribiendo:', error)
  } finally {
    pending.value = false
  }
}
</script>

<style scoped>
/* Pequeña animación extra para la campanita */
@keyframes wiggle {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}
</style>