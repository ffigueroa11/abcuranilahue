<template>
  <div 
    v-if="mostrarBanner" 
    class="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-2xl p-4 z-50 flex items-start gap-4 transition-all transform"
  >
    <div class="bg-blue-600/20 p-2.5 rounded-xl text-blue-500 flex-shrink-0 mt-0.5">
      <svg class="w-6 h-6 origin-top animate-[wiggle_1s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    </div>
    
    <div class="flex-1">
      <h4 class="text-zinc-100 font-black text-sm uppercase tracking-wide">Alertas del Campeonato</h4>
      
      <!-- Mensaje Condicional: Si es iOS en navegador normal -->
      <p v-if="esIosNoInstalado" class="text-zinc-400 text-xs mt-1 leading-relaxed">
        Para recibir notificaciones en tu iPhone, primero debes agregar esta app a tu pantalla de inicio tocando <strong>Compartir</strong> y luego <strong>"Agregar a inicio"</strong>.
      </p>
      <!-- Mensaje Normal -->
      <p v-else class="text-zinc-400 text-xs mt-1 leading-relaxed">
        Activa las notificaciones para enterarte al instante de resultados, partidos en vivo y cambios en el fixture.
      </p>
      
      <div class="flex gap-2 mt-4">
        <!-- Si es iOS normal, no mostramos el botón de activar porque fallará, solo un botón para cerrar -->
        <button 
          v-if="esIosNoInstalado"
          @click="ocultarTemporalmente" 
          class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors shadow-lg flex-1 h-9"
        >
          Entendido
        </button>
        
        <!-- Botones normales para el resto de plataformas -->
        <template v-else>
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
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const mostrarBanner = ref(false)
const pending = ref(false)
const esIosNoInstalado = ref(false)

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

onMounted(() => {
  // Detección de dispositivos Apple
  const userAgent = window.navigator.userAgent.toLowerCase()
  const isIOS = /iphone|ipad|ipod/.test(userAgent) || (window.navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in window.navigator && window.navigator.standalone === true)

  // Respetar si el usuario le dio a "Ahora no"
  const bannerOculto = localStorage.getItem('push_banner_dismissed')
  if (bannerOculto) {
    const diasPasados = (new Date().getTime() - new Date(bannerOculto).getTime()) / (1000 * 3600 * 24)
    if (diasPasados < 7) return 
  }

  if (isIOS && !isStandalone) {
    // Es iPhone pero está en Safari normal: Le mostramos las instrucciones
    esIosNoInstalado.value = true
    mostrarBanner.value = true
    return
  }

  // Si no es iOS o ya está instalado, verificamos si soporta notificaciones
  if (!('Notification' in window) || Notification.permission !== 'default') return

  mostrarBanner.value = true
})

const ocultarTemporalmente = () => {
  localStorage.setItem('push_banner_dismissed', new Date().toISOString())
  mostrarBanner.value = false
}

const solicitarPermiso = async () => {
  pending.value = true
  
  try {
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

      mostrarBanner.value = false
    } else {
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
@keyframes wiggle {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}
</style>