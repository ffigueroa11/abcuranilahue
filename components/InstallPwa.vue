<template>
  <div v-if="canInstall" class="fixed bottom-4 right-4 z-50">
    <button 
      @click="installPwa"
      class="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase px-5 py-3 rounded-xl shadow-[0_4px_20px_rgba(245,158,11,0.4)] flex items-center gap-2 transition-all transform hover:scale-105"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
      Instalar Aplicación
    </button>
  </div>
</template>

<script setup lang="ts">
const canInstall = ref(false)
let deferredPrompt: any = null

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    canInstall.value = true
  })
})

const installPwa = async () => {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  if (outcome === 'accepted') {
    canInstall.value = false
  }
  deferredPrompt = null
}
</script>