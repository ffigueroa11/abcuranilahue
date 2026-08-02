<template>
  <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg relative overflow-hidden group">
    <!-- Efecto visual de fondo -->
    <div class="absolute -right-4 -top-4 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-colors"></div>

    <div class="relative z-10">
      <h3 class="text-zinc-100 font-black uppercase tracking-wider mb-2 flex items-center gap-2">
        <!-- Ícono de Recargar -->
        <svg class="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Sincronizar Tabla de Posiciones
      </h3>
      
      <p class="text-xs text-zinc-400 font-medium mb-6 leading-relaxed max-w-md">
        Esta acción leerá todos los partidos finalizados y volverá a generar la tabla de posiciones desde cero aplicando los criterios FIBA. Úsalo si notas alguna inconsistencia en los puntajes o diferencias de goles.
      </p>

      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          @click="handleRecalcularClick"
          :disabled="pending"
          :class="[
            'w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shrink-0',
            wantsToConfirm ? 'bg-red-600 hover:bg-red-500 text-white border-red-500' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
          ]"
        >
          <svg v-if="pending" class="animate-spin w-4 h-4 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="pending">Recalculando...</span>
          <span v-else-if="wantsToConfirm">Confirmar Recálculo</span>
          <span v-else>Ejecutar Recálculo</span>
        </button>

        <!-- Mensajes de Estado Mejorados -->
        <div 
          v-if="statusMessage" 
          class="text-xs font-bold transition-opacity leading-snug" 
          :class="{
            'text-green-400': statusMessage.type === 'success',
            'text-red-400': statusMessage.type === 'error',
            'text-blue-400 animate-pulse': statusMessage.type === 'info'
          }"
        >
          {{ statusMessage.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pending = ref(false)
const wantsToConfirm = ref(false)
const statusMessage = ref<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
let confirmTimeout: NodeJS.Timeout | null = null

const handleRecalcularClick = async () => {
  // Limpiar timeout si existe para evitar conflictos al confirmar rápido
  if (confirmTimeout) {
    clearTimeout(confirmTimeout)
    confirmTimeout = null
  }

  // PRIMER CLIC: Pedir confirmación
  if (!wantsToConfirm.value) {
    statusMessage.value = null
    wantsToConfirm.value = true
    
    // Si no confirma en 5 segundos, se resetea el botón
    confirmTimeout = setTimeout(() => {
      wantsToConfirm.value = false
    }, 5000)
    return
  }

  // SEGUNDO CLIC: El usuario confirmó
  pending.value = true
  wantsToConfirm.value = false
  
  // Mensaje visual de paciencia (útil para procesos largos)
  statusMessage.value = { 
    type: 'info', 
    text: 'Procesando el historial de partidos. Por favor, no cierres esta ventana...' 
  }

  try {
    // Nota: Corregí a 'POST' basándome en tu comentario original. Si tu endpoint falla, regrésalo a 'GET'.
    await $fetch('/api/posiciones/recalcular', {
      method: 'POST',
      timeout: 60000 // Forzamos al navegador a esperar hasta 60 segundos antes de rendirse
    })

    statusMessage.value = { type: 'success', text: '¡Tabla de posiciones recalculada con éxito!' }

  } catch (error: any) {
    console.error('Error al recalcular la tabla:', error)
    
    // Mejoramos el manejo de errores para detectar Timeouts
    const isTimeout = error.message?.includes('timeout') || error.response?.status === 504
    
    statusMessage.value = { 
      type: 'error', 
      text: isTimeout 
        ? 'El proceso tardó demasiado (Timeout). Revisa la tabla pública, es posible que se haya actualizado en segundo plano.' 
        : 'Ocurrió un error en el servidor al recalcular la tabla.' 
    }
  } finally {
    pending.value = false
    
    // El mensaje final desaparece después de 10 segundos
    setTimeout(() => {
      statusMessage.value = null
    }, 10000)
  }
}
</script>