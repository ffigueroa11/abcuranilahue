<template>
  <div class="min-h-[100dvh] bg-zinc-950 pb-20">
    <!-- Header -->
    <div class="bg-zinc-900 border-b border-zinc-800 pt-24 pb-12 px-4 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-red-900/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div class="max-w-[1200px] mx-auto relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-600/30 bg-red-900/10 text-red-500 text-xs font-black tracking-widest uppercase mb-4">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Archivo Histórico
        </div>
        <h1 class="text-4xl md:text-5xl font-black uppercase text-zinc-100 tracking-tighter">
          Transmisiones <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Anteriores</span>
        </h1>
        <p class="text-zinc-400 mt-2 font-medium max-w-lg text-sm md:text-base">
          Revive los mejores encuentros, partidos definitorios y streaming oficiales del campeonato.
        </p>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div v-if="pending" class="flex justify-center items-center py-40">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>

    <div v-else-if="data" class="max-w-[1200px] mx-auto px-4 py-12">
      
      <!-- Video Principal / Destacado -->
      <div class="mb-16">
        <h2 class="text-lg font-black uppercase mb-6 tracking-tight flex items-center gap-2">
          <span class="w-2 h-6 bg-red-800 rounded-sm"></span>
          Última Transmisión Destacada
        </h2>
        
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-2 sm:p-4 shadow-2xl relative overflow-hidden">
          <div class="relative w-full overflow-hidden rounded-xl bg-black border border-zinc-900" style="padding-top: 56.25%;">
            <iframe 
              class="absolute top-0 left-0 w-full h-full" 
              :src="`https://www.youtube.com/embed/${data.videoDestacadoId}?rel=0`" 
              frameborder="0" 
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>

      <!-- Grilla de Partidos Grabados -->
      <div>
        <h2 class="text-lg font-black uppercase mb-6 tracking-tight flex items-center gap-2">
          <span class="w-2 h-6 bg-amber-600 rounded-sm"></span>
          Partidos Anteriores
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="video in data.listaVideos" 
            :key="video.id" 
            class="bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden hover:border-zinc-700 transition-all shadow-lg flex flex-col group"
          >
            <!-- Thumbnail / Reproductor mini -->
            <div class="relative w-full bg-black" style="padding-top: 56.25%;">
              <iframe 
                class="absolute top-0 left-0 w-full h-full" 
                :src="`https://www.youtube.com/embed/${video.youtubeId}?rel=0`" 
                frameborder="0" 
                allowfullscreen
              ></iframe>
            </div>

            <!-- Información del Video -->
            <div class="p-5 flex flex-col justify-between flex-grow">
              <div>
                <span class="text-[10px] text-amber-500 font-black tracking-widest uppercase block mb-1">
                  {{ video.categoria }}
                </span>
                <h3 class="text-zinc-100 font-bold text-base leading-snug group-hover:text-amber-400 transition-colors">
                  {{ video.titulo }}
                </h3>
              </div>
              <div class="mt-4 pt-4 border-t border-zinc-800/60 flex justify-between items-center text-xs text-zinc-500 font-medium">
                <span>{{ video.fecha }}</span>
                <span class="text-zinc-400 font-bold">A.B.C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
// --- MEJORA: Carga de datos dinámica ---
// En lugar de tener los videos hardcodeados en el componente, es una mejor práctica
// cargarlos desde una API. Esto permite actualizar el contenido sin necesidad de
// redesplegar todo el sitio web.
//
// Aquí usamos `useAsyncData` que es ideal para fetching en Nuxt 3. En una aplicación real,
// el handler haría una llamada como `await $fetch('/api/transmisiones')`.

const { data, pending } = await useAsyncData('transmisiones', async () => {
  // En un caso real: return await $fetch('/api/transmisiones')
  // Por ahora, devolvemos data de ejemplo para demostrar el patrón:
  const videoDestacadoId = 'EntfkucfcUg' // ID del video principal
  const listaVideos = [
    {
      id: 1,
      titulo: 'HUILLINES versus COLICO SUR',
      categoria: 'Categoría Senior',
      fecha: '17 de Julio, 2024',
      youtubeId: 'yLrsLY7rSHI'
    },
    {
      id: 2,
      titulo: 'C.D. NAVIDAD versus HUILLINES',
      categoria: 'Categoría Todo Competidor',
      fecha: '11 de Julio, 2024',
      youtubeId: 'HYpdnOggD8U'
    },
    {
      id: 3,
      titulo: 'SAN PATRICIO versus C.D. NAVIDAD',
      categoria: 'Categoría Senior',
      fecha: '05 de Julio, 2024',
      youtubeId: 'LyKNFcFESpg'
    }
  ]
  return { videoDestacadoId, listaVideos }
}, { server: true }) // `server: true` es el default, pero es bueno ser explícito.

// NOTA DE RENDIMIENTO:
// Cargar múltiples iframes de YouTube a la vez puede ralentizar la página.
// Considera usar una técnica de "lazy loading" donde se muestra una imagen
// del video y el iframe solo se carga cuando el usuario hace clic en "play".
// Existen librerías como 'lite-youtube-embed' que facilitan esto.
</script>