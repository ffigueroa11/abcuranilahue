<template>
  <div class="min-h-screen bg-zinc-950 pb-20">
    <!-- Header -->
    <div class="bg-zinc-900 border-b border-zinc-800 pt-24 pb-12 px-4 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-zinc-800/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div class="max-w-[1200px] mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-xs font-black tracking-widest uppercase mb-4">
            <span class="w-2 h-2 rounded-full bg-zinc-400"></span> Equipos
          </div>
          <h1 class="text-4xl md:text-5xl font-black uppercase text-zinc-100 tracking-tighter">
            Clubes <span class="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">Afiliados</span>
          </h1>
          <p class="text-zinc-400 mt-2 font-medium max-w-lg text-sm md:text-base">
            Conoce a todas las instituciones que dan vida y pasión al básquetbol de la Asociación de Curanilahue.
          </p>
        </div>

        <!-- Buscador Rápido -->
        <div class="w-full md:w-72">
          <input 
            v-model="busqueda" 
            type="text" 
            placeholder="Buscar club..." 
            class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
      </div>
    </div>

    <!-- Grilla de Equipos -->
    <div class="max-w-[1200px] mx-auto px-4 py-12">
      <div v-if="pending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-400"></div>
      </div>

      <div v-else-if="equiposFiltrados && equiposFiltrados.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="club in equiposFiltrados" 
          :key="club.id" 
          class="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-zinc-600 transition-all shadow-lg backdrop-blur-sm"
        >
          <!-- Efecto sutil al pasar el mouse -->
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900/40 pointer-events-none"></div>

          <!-- Logo del Club -->
          <div class="w-24 h-24 bg-zinc-950 rounded-full flex items-center justify-center border-2 border-zinc-800 shadow-inner group-hover:border-amber-500/50 transition-all mb-4 overflow-hidden relative z-10">
            <img v-if="club.logo_url" :src="club.logo_url" :alt="club.nombre" class="w-full h-full object-cover p-2" />
            <span v-else class="text-3xl font-black text-zinc-500">{{ club.nombre.charAt(0) }}</span>
          </div>

          <!-- Nombre del Club -->
          <h3 class="text-zinc-100 font-black text-base uppercase tracking-wide relative z-10 mb-1 group-hover:text-amber-500 transition-colors">
            {{ club.nombre }}
          </h3>
          
          <span class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest relative z-10">
            Club Oficial
          </span>
        </div>
      </div>

      <div v-else class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
        <h3 class="text-zinc-300 font-bold text-lg mb-1">No se encontraron clubes</h3>
        <p class="text-zinc-500 text-sm">Prueba con otro término de búsqueda.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const busqueda = ref('')

// Cargar la lista de equipos desde la API (puedes apuntar a '/api/equipos' o '/api/clubes' según prefieras)
const { data: equipos, pending } = useFetch('/api/clubes')

// Filtrar en tiempo real según lo que escriba el usuario
const equiposFiltrados = computed(() => {
  if (!equipos.value) return []
  if (!busqueda.value) return equipos.value
  
  return equipos.value.filter((club: any) => 
    club.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})
</script>