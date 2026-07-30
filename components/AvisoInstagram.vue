<template>
  <div 
    v-if="esInstagram" 
    class="fixed top-0 left-0 w-full bg-amber-500 text-zinc-950 px-4 py-3 z-[100] flex items-start gap-3 shadow-lg border-b-4 border-amber-700 animate-slide-down"
  >
    <!-- Ícono de Advertencia -->
    <svg class="w-6 h-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>

    <div class="flex-1">
      <p class="text-[11px] font-black uppercase tracking-tight leading-tight">
        Navegador Limitado Detectado
      </p>
      <p class="text-[11px] font-medium mt-1 leading-snug">
        Para ver el contenido sin errores y poder instalar la app, toca los <strong>tres puntos [ ⋮ ] arriba a la derecha ↗</strong> y selecciona <strong>"Abrir en el navegador"</strong> (o Safari).
      </p>
    </div>
    
    <!-- Botón para cerrar el aviso por si el usuario decide quedarse ahí -->
    <button @click="esInstagram = false" class="shrink-0 p-1 hover:bg-amber-600/50 rounded-lg transition-colors">
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const esInstagram = ref(false)

onMounted(() => {
  if (typeof window === 'undefined') return
  
  // Extraemos el User Agent del navegador
  const ua = window.navigator.userAgent || window.navigator.vendor || (window as any).opera
  
  // Buscamos la palabra clave que inyecta Instagram en su visor web
  if (ua.indexOf('Instagram') > -1) {
    esInstagram.value = true
  }
})
</script>

<style scoped>
@keyframes slide-down {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}
.animate-slide-down {
  animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>