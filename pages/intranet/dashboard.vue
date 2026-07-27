<template>
  <div>
    <!-- Encabezado -->
    <div class="mb-8">
      <h1 class="text-3xl font-black text-white uppercase tracking-tight mb-1">Resumen General</h1>
      <p class="text-zinc-400 text-sm">Bienvenido al panel de administración del campeonato.</p>
    </div>
    
    <!-- Estado de Carga -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
    </div>

    <!-- Métricas del Campeonato -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Equipos Inscritos -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition-colors">
        <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg class="w-16 h-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </div>
        <h3 class="text-zinc-500 font-black text-xs uppercase tracking-widest mb-2">Equipos Inscritos</h3>
        <p class="text-4xl font-black text-amber-500">{{ stats?.totalClubes || 0 }}</p>
        <p class="text-zinc-500 text-xs mt-3">Clubes participando en la temporada</p>
      </div>

      <!-- Jugadores Activos -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition-colors">
        <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg class="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </div>
        <h3 class="text-zinc-500 font-black text-xs uppercase tracking-widest mb-2">Jugadores Activos</h3>
        <p class="text-4xl font-black text-red-500">{{ stats?.totalJugadores || 0 }}</p>
        <p class="text-zinc-500 text-xs mt-3">Inscritos en las plantillas</p>
      </div>

      <!-- Partidos Restantes -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition-colors">
        <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg class="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <h3 class="text-zinc-500 font-black text-xs uppercase tracking-widest mb-2">Partidos por Jugar</h3>
        <p class="text-4xl font-black text-blue-500">{{ stats?.partidosRestantes || 0 }}</p>
        <p class="text-zinc-500 text-xs mt-3">Encuentros pendientes en el fixture</p>
      </div>

    </div>
  </div>

    <!-- Panel de Notificación de Transmisión -->
  <section class="mt-12">
    <h2 class="text-2xl font-black text-white uppercase tracking-tight mb-4">Notificación de Transmisión</h2>
    <p class="text-zinc-400 text-sm mb-6">Envía una alerta a todos los dispositivos suscritos para informar sobre un partido en vivo.</p>
    <div class="flex flex-col md:flex-row gap-6">
      <div class="flex-1">
        <NotificacionVivo />
      </div>
    </div>
  </section>

</template>


<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'auth'
})

// Solicitamos los datos dinámicos sin caché estática para que refleje cambios al instante
const { data: stats, pending } = useFetch('/api/intranet/dashboard', {
  key: 'dashboard-stats',
  getCachedData: () => undefined
})

import { ref, computed } from 'vue'

const formVivo = ref({
  partido: '',
  url: ''
})

const pendingNotified = ref(false)

// Validación simple para no enviar alertas en blanco
const formIncompleto = computed(() => {
  return formVivo.value.partido.trim() === '' || formVivo.value.url.trim() === ''
})

const notificarVivo = async () => {
  if (formIncompleto.value) return

  // Confirmación por seguridad (para evitar clicks accidentales)
  if (!confirm(`¿Estás seguro de enviar la notificación a todos los dispositivos?\n\nMensaje: ${formVivo.value.partido}`)) {
    return
  }

  pendingNotified.value = true

  try {
    await $fetch('/api/notificaciones/enviar-vivo', {
      method: 'POST',
      body: formVivo.value
    })
    
    alert('¡Alerta de transmisión enviada con éxito!')
    
    // Limpiamos el formulario después de enviar
    formVivo.value.partido = ''
    formVivo.value.url = ''
  } catch (error) {
    console.error('Error al notificar:', error)
    alert('Ocurrió un error al intentar enviar la alerta.')
  } finally {
    pendingNotified.value = false
  }
}
</script>