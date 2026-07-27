<template>
  <div v-if="showInstallButton" class="fixed bottom-4 left-4 z-50 animate-fade-in-up">
    <button
      @click="installPWA"
      class="flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl bg-gradient-to-r from-blue-700 to-blue-600 border border-blue-500 text-white hover:scale-105 transition-all transform"
      title="Instalar la aplicación en tu dispositivo"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span class="text-sm font-black uppercase tracking-wider">Instalar App</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// `useNuxtApp` es la forma correcta de acceder a los plugins de Nuxt en <script setup>
const { $pwa } = useNuxtApp()

// El botón se muestra si el prompt de instalación está disponible Y la app no está ya instalada.
const showInstallButton = computed(() => {
  return $pwa?.showInstallPrompt && !$pwa.isPWAInstalled
})

const installPWA = () => {
  // Llama a la función de instalación que provee el módulo PWA.
  // Esta función mostrará el diálogo nativo del navegador.
  $pwa?.install()
}
</script>