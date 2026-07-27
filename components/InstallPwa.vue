<template>
  <div v-if="showInstallPromptUI" class="fixed bottom-4 left-4 z-50 animate-fade-in-up">
    <div v-if="isIOS" class="bg-zinc-800 border border-zinc-700 text-zinc-200 p-4 rounded-lg shadow-xl max-w-xs">
      <p class="text-sm font-medium mb-2">
        Para instalar esta aplicación, haz clic en el botón
        <svg class="inline-block w-5 h-5 mx-1 align-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        (Compartir) en la barra de navegación de Safari, y luego selecciona "Añadir a pantalla de inicio".
      </p>
      <button
        @click="dismissIOSPrompt"
        class="mt-3 w-full px-3 py-1.5 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-bold transition-colors"
      >
        Entendido
      </button>
    </div>
    <button
      v-else
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
import { computed, ref, onMounted } from 'vue'

// `useNuxtApp` es la forma correcta de acceder a los plugins de Nuxt en <script setup>
const { $pwa } = useNuxtApp()

// Detectar si es iOS
const isIOS = computed(() => {
  if (typeof window === 'undefined') return false; // Evitar errores en SSR
  const userAgent = window.navigator.userAgent;
  // La comprobación de MSStream es una forma heredada de excluir IE11 en Windows Phone.
  // Hacemos un "cast" de `window` a `any` para satisfacer a TypeScript, ya que `MSStream` no es una propiedad estándar.
  return /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
});

// Controlar si el prompt de iOS ha sido descartado por el usuario en la sesión actual
const iosPromptDismissed = ref(false);

// La UI de instalación se muestra si:
// 1. Es iOS Y no ha sido descartado el prompt de iOS.
// 2. NO es iOS Y el prompt de instalación estándar está disponible Y la app no está ya instalada.
const showInstallPromptUI = computed(() => {
  if (isIOS.value) {
    return !iosPromptDismissed.value;
  } else {
    return $pwa?.showInstallPrompt && !$pwa.isPWAInstalled;
  }
});

// Función para descartar el prompt de iOS
const dismissIOSPrompt = () => {
  iosPromptDismissed.value = true
  // Guardamos la preferencia del usuario en localStorage para que no se le vuelva a mostrar.
  localStorage.setItem('ios-install-prompt-dismissed', 'true')
}

// Al montar el componente en el cliente, verificamos si el usuario ya ha descartado el prompt anteriormente.
onMounted(() => {
  if (isIOS.value) {
    const dismissed = localStorage.getItem('ios-install-prompt-dismissed')
    if (dismissed === 'true') {
      iosPromptDismissed.value = true
    }
  }
})

const installPWA = () => {
  // Llama a la función de instalación que provee el módulo PWA.
  // Esta función mostrará el diálogo nativo del navegador.
  $pwa?.install()
}
</script>