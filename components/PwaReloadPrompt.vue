<template>
  <div v-if="needRefresh" class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-amber-500 text-zinc-950 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-amber-400">
    <span class="text-xs font-black uppercase">¡Nueva versión disponible!</span>
    <button 
      @click="updateServiceWorker()" 
      class="bg-zinc-950 text-amber-500 hover:bg-zinc-900 text-xs font-black uppercase px-3 py-1.5 rounded-lg transition-colors"
    >
      Actualizar
    </button>
  </div>
</template>

<script setup lang="ts">
// El módulo @vite-pwa/nuxt inyecta este composable automáticamente
import { useRegisterSW } from 'virtual:pwa-register/vue'

const { needRefresh, updateServiceWorker } = useRegisterSW()
</script>