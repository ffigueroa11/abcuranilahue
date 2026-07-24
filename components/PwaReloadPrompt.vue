<template>
  <div
    v-if="$pwa.needRefresh"
    class="fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-xl bg-zinc-800 border border-zinc-700 flex items-center gap-4 animate-fade-in-up"
  >
    <div class="text-zinc-200 text-sm font-medium">
      <span>Hay una nueva versión disponible.</span>
    </div>
    <div class="flex gap-2">
      <button
        @click="$pwa.updateServiceWorker()"
        class="px-4 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
      >
        Recargar
      </button>
      <button
        @click="$pwa.cancelPrompt()"
        class="px-3 py-1.5 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-bold transition-colors"
      >
        Cerrar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// El módulo @vite-pwa/nuxt inyecta el objeto $pwa globalmente.
// No es necesario importar nada aquí.
// - $pwa.needRefresh: Es un booleano reactivo (ref) que se vuelve `true` cuando hay una actualización.
// - $pwa.updateServiceWorker(): Función para aceptar la actualización y recargar la página.
// - $pwa.cancelPrompt(): Oculta el prompt temporalmente.
</script>

<style>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out forwards;
}
</style>