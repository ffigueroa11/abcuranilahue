<template>
  <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-xl max-w-md shadow-2xl relative overflow-hidden group">
    <!-- Efecto visual de "En Vivo" -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-red-600/20 transition-colors"></div>

    <h3 class="text-red-500 font-black uppercase text-sm mb-5 flex items-center gap-2 relative z-10">
      <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
      Lanzar Alerta de Transmisión
    </h3>
    
    <div class="space-y-4 relative z-10">
      <!-- Input del Encuentro -->
      <div>
        <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Encuentro / Categoría</label>
        <input 
          v-model="formVivo.partido" 
          type="text" 
          placeholder="Ej: Final Sub-17: Universitarios vs Curanilahue" 
          class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 text-sm mt-1 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all placeholder:text-zinc-700" 
        />
      </div>
      
      <!-- Input del Link -->
      <div>
        <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Enlace de YouTube / Plataforma</label>
        <input 
          v-model="formVivo.url" 
          type="text" 
          placeholder="https://youtube.com/live/..." 
          class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 text-sm mt-1 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all placeholder:text-zinc-700" 
        />
      </div>

      <!-- Botón de Disparo -->
      <button 
        @click="notificarVivo" 
        :disabled="pending" 
        :class="[
          'w-full font-black uppercase text-xs py-3.5 rounded-lg transition-all flex justify-center items-center gap-2 mt-2 shadow-lg',
          pending || formIncompleto ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-red-700 hover:bg-red-600 text-white shadow-red-900/20 active:scale-[0.98]'
        ]"
      >
        <span v-if="pending" class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
        <span v-else>🔴 Enviar Notificación a Todos</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const formVivo = ref({
  partido: '',
  url: ''
})

const pending = ref(false)

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

  pending.value = true

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
    pending.value = false
  }
}
</script>