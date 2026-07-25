<template>
  <div class="max-w-[1400px] mx-auto px-4 py-12 lg:py-20">
    
    <!-- Encabezado -->
    <div class="mb-12 text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-600/30 bg-amber-900/10 text-amber-500 text-xs font-black tracking-widest uppercase mb-4">
        <span class="w-2 h-2 rounded-full bg-amber-500"></span> Multimedia
      </div>
      <h1 class="text-4xl md:text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-600 tracking-tight">
        Galería del Campeonato
      </h1>
      <p class="text-zinc-400 mt-4 text-sm max-w-xl mx-auto">
        Revive los mejores momentos, jugadas y celebraciones de la temporada.
      </p>
    </div>

    <!-- Cargador -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
    </div>

    <!-- Grilla de Imágenes (Estilo Masonry/Grid) -->
    <div v-else-if="imagenes && imagenes.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div 
        v-for="(imagen, index) in imagenes" 
        :key="imagen.id"
        @click="abrirImagen(imagen.url)"
        class="group relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer border border-zinc-800/80 hover:border-amber-500/50 transition-all shadow-lg"
      >
        <img 
          :src="imagen.url" 
          :alt="imagen.nombre" 
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <!-- Overlay al hacer hover -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <svg class="w-6 h-6 text-amber-500 mb-2 self-end drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
          <span class="text-[10px] text-zinc-300 font-bold uppercase tracking-widest truncate">
            {{ formatFecha(imagen.fecha) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Estado Vacío -->
    <div v-else class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-16 text-center">
      <svg class="w-12 h-12 text-zinc-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      <h3 class="text-zinc-300 font-black text-lg uppercase tracking-wider mb-2">Galería Vacía</h3>
      <p class="text-zinc-500 text-sm">Aún no se han subido imágenes al servidor.</p>
    </div>

    <!-- Modal Lightbox (Visor de Imagen a pantalla completa) -->
    <div v-if="visor.abierto" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      <button 
        @click="visor.abierto = false" 
        class="absolute top-6 right-6 text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 p-2 rounded-xl transition-colors border border-zinc-700/50"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
      
      <img 
        :src="visor.urlActual" 
        class="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-zinc-800/50"
        alt="Visor ampliado"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 1. Fetch a nuestro nuevo endpoint
const { data: imagenes, pending } = useFetch('/api/galeria')

// 2. Estado del Visor de imágenes (Lightbox)
const visor = ref({
  abierto: false,
  urlActual: ''
})

const abrirImagen = (url: string) => {
  visor.value.urlActual = url
  visor.value.abierto = true
}

// 3. Formato de fecha legible
const formatFecha = (fechaString: string) => {
  const dateObj = new Date(fechaString)
  return dateObj.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Permitir cerrar el visor presionando la tecla "Escape"
if (import.meta.client) {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && visor.value.abierto) {
      visor.value.abierto = false
    }
  })
}
</script>