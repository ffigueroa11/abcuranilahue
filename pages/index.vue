<template>
  <div>
    <!-- Hero Section -->
    <section class="relative max-w-[1400px] mx-auto px-4 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-red-900/20 blur-[120px] rounded-full"></div>
        <div class="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full"></div>
      </div>

      <div class="space-y-8 relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-600/30 bg-amber-900/10 text-amber-500 text-xs font-black tracking-widest uppercase">
          <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Temporada 2026
        </div>
        <h1 class="text-5xl md:text-7xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-600 leading-[0.95] tracking-tighter drop-shadow-sm">
          El baloncesto<br>que mueve a<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">Curanilahue</span>
        </h1>
        <p class="text-zinc-400 text-lg max-w-md font-medium leading-relaxed">
          Plataforma oficial de la asociación. Fixture, estadísticas en vivo y gestión deportiva integral.
        </p>
      </div>

      <!-- Grilla de Equipos -->
      <div class="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-8 border border-zinc-800/80 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative">
        <h3 class="text-zinc-500 text-xs font-black tracking-widest uppercase mb-6 text-center">Clubes Afiliados</h3>
        
        <div v-if="pendingClubes" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
        
        <div v-else-if="clubes && clubes.length > 0" class="grid grid-cols-3 sm:grid-cols-4 gap-4 relative z-10">
          <div v-for="club in clubes" :key="club.id" class="flex flex-col items-center justify-center group cursor-pointer p-2 rounded-xl hover:bg-zinc-800/50 transition-all">
            <div class="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-700 shadow-inner group-hover:border-amber-600 transition-all mb-3 overflow-hidden">
              <img v-if="club.logo_url" :src="club.logo_url" :alt="club.nombre" class="w-full h-full object-cover p-1" />
              <span v-else class="text-xl font-black text-zinc-300">{{ club.nombre.charAt(0) }}</span>
            </div>
            <span class="text-[10px] text-center text-zinc-400 font-bold uppercase truncate w-full group-hover:text-zinc-200 transition-colors">{{ club.nombre }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Transmisión En Vivo -->
    <section v-if="partidoEnVivo" class="max-w-[1000px] mx-auto px-4 py-8 relative z-20 -mt-12 lg:-mt-24">
      <div class="bg-zinc-950 border border-zinc-800 rounded-2xl p-2 sm:p-4 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-600 to-red-900 animate-pulse"></div>
        <div class="flex justify-between items-center mb-4 px-2 pt-2">
          <div class="flex items-center gap-3">
            <span class="flex h-3 w-3 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <h2 class="text-white font-black uppercase tracking-widest text-sm sm:text-base">Transmisión Oficial</h2>
          </div>
          <div class="bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full flex items-center gap-2">
            <span class="text-zinc-300 font-bold text-xs uppercase">{{ partidoEnVivo.local.nombre }} vs {{ partidoEnVivo.visita.nombre }}</span>
          </div>
        </div>
        <div class="relative w-full overflow-hidden rounded-xl bg-black border border-zinc-900" style="padding-top: 56.25%;">
          <iframe class="absolute top-0 left-0 w-full h-full" :src="`https://www.youtube.com/embed/${partidoEnVivo.youtube_live_id}?autoplay=0&rel=0`" frameborder="0" allowfullscreen></iframe>
        </div>
      </div>
    </section>

    <!-- Match Center Dinámico -->
    <section class="max-w-[1400px] mx-auto px-4 py-16">
      
      <!-- Pestañas de Categorías -->
      <div v-if="categorias && categorias.length > 0" class="flex gap-3 mb-8 border-b border-zinc-800 pb-4 overflow-x-auto scrollbar-hide">
        <button 
          v-for="cat in categorias" :key="cat.id"
          @click="selectedCategoriaId = Number(cat.id)"
          :class="['px-6 py-2 rounded text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap', {
            'bg-zinc-800 text-zinc-100 border-l-2 border-amber-500 shadow-md': selectedCategoriaId === Number(cat.id),
            'bg-transparent hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300': selectedCategoriaId !== Number(cat.id)
          }]"
        >
          {{ cat.nombre }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Tabla de Posiciones Dinámica -->
        <div class="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 shadow-xl backdrop-blur-sm col-span-1 lg:col-span-1 overflow-hidden flex flex-col">
          <h2 class="text-lg font-black uppercase mb-6 tracking-tight flex items-center gap-2">
            <span class="w-2 h-6 bg-amber-600 rounded-sm"></span>
            Posiciones
          </h2>
          
          <div v-if="pendingPos" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
          </div>

          <div v-else-if="posiciones && posiciones.length > 0" class="overflow-x-auto scrollbar-hide -mx-2 px-2">
            <table class="w-full text-sm min-w-[400px]">
              <thead class="text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                <tr>
                  <th class="text-left font-black pb-3 w-8">POS</th>
                  <th class="text-left font-black pb-3">EQUIPO</th>
                  <th class="text-center font-black pb-3 w-8">PJ</th>
                  <th class="text-center font-black pb-3 w-8">PG</th>
                  <th class="text-center font-black pb-3 w-8">PP</th>
                  <th class="text-center font-black pb-3 w-10">DIF</th>
                  <th class="text-center font-black pb-3 text-amber-500 w-10">PTS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-800/50">
                <tr v-for="(pos, index) in posiciones" :key="pos.id" class="hover:bg-zinc-800/30 transition-colors group">
                  <td :class="['py-3 font-black', index === 0 ? 'text-amber-500' : 'text-zinc-500']">{{ index + 1 }}</td>
                  <td class="py-3 font-bold flex items-center gap-2 pr-4">
                    <div class="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden border border-zinc-700 flex-shrink-0">
                       <img v-if="pos.club.logo_url" :src="pos.club.logo_url" class="w-full h-full object-cover p-0.5" />
                       <span v-else class="text-[9px] text-zinc-400">{{ pos.club.nombre.charAt(0) }}</span>
                    </div> 
                    <span :class="['truncate', index === 0 ? 'text-zinc-200' : 'text-zinc-300']" style="max-width: 120px;">{{ pos.club.nombre }}</span>
                  </td>
                  <td class="py-3 text-center text-zinc-400 text-xs">{{ pos.pj }}</td>
                  <td class="py-3 text-center text-zinc-400 text-xs">{{ pos.pg }}</td>
                  <td class="py-3 text-center text-zinc-400 text-xs">{{ pos.pp }}</td>
                  <td :class="['py-3 text-center text-xs font-medium', pos.dif > 0 ? 'text-green-500/80' : (pos.dif < 0 ? 'text-red-500/80' : 'text-zinc-500')]">
                    {{ pos.dif > 0 ? '+' + pos.dif : pos.dif }}
                  </td>
                  <td :class="['py-3 text-center font-black text-sm', index === 0 ? 'text-zinc-100' : 'text-zinc-300']">{{ pos.puntos }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-else class="text-center py-8 text-zinc-600 text-xs font-bold uppercase tracking-widest">
            Sin equipos inscritos
          </div>
        </div>

        <!-- Últimos Resultados -->
        <div class="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 shadow-xl backdrop-blur-sm">
          <h2 class="text-lg font-black uppercase mb-6 tracking-tight flex items-center gap-2">
            <span class="w-2 h-6 bg-red-800 rounded-sm"></span>
            Resultados
          </h2>

          <div v-if="pendingUltimos" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-red-800"></div>
          </div>

          <div v-else-if="ultimosPartidos && ultimosPartidos.length > 0" class="space-y-4">
            <div v-for="partido in ultimosPartidos" :key="partido.id" class="bg-zinc-950/50 border border-zinc-800 rounded-lg p-5 relative overflow-hidden group hover:border-zinc-700 transition-colors">
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-800 via-zinc-800 to-blue-700 opacity-50"></div>
              
              <div class="text-[10px] text-zinc-500 font-black tracking-widest text-center uppercase mb-4">
                Finalizado • {{ new Date(partido.fecha_hora).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) }}
              </div>
              
              <div class="flex justify-between items-center mb-1">
                <div class="flex flex-col items-center gap-2 w-1/3">
                  <div class="w-10 h-10 bg-zinc-800 border-2 border-red-900/50 rounded-full flex items-center justify-center overflow-hidden">
                    <img v-if="partido.local.logo_url" :src="partido.local.logo_url" class="w-full h-full object-cover p-1" />
                    <span v-else class="text-xs font-bold text-zinc-500">{{ partido.local.nombre.charAt(0) }}</span>
                  </div>
                  <span class="font-bold text-xs text-zinc-300 text-center truncate w-full">{{ partido.local.nombre }}</span>
                </div>
                
                <div class="flex flex-col items-center w-1/3">
                  <div class="text-3xl font-black tracking-tighter text-zinc-100">
                    {{ partido.score_local }} <span class="text-zinc-700">-</span> {{ partido.score_visita }}
                  </div>
                </div>
                
                <div class="flex flex-col items-center gap-2 w-1/3">
                  <div class="w-10 h-10 bg-zinc-800 border-2 border-blue-800/50 rounded-full flex items-center justify-center overflow-hidden">
                    <img v-if="partido.visita.logo_url" :src="partido.visita.logo_url" class="w-full h-full object-cover p-1" />
                    <span v-else class="text-xs font-bold text-zinc-500">{{ partido.visita.nombre.charAt(0) }}</span>
                  </div>
                  <span class="font-bold text-xs text-zinc-300 text-center truncate w-full">{{ partido.visita.nombre }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-zinc-600 text-xs font-bold uppercase tracking-widest">
            Sin resultados aún
          </div>
        </div>

        <!-- Próximos Partidos -->
        <div class="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 shadow-xl backdrop-blur-sm">
          <h2 class="text-lg font-black uppercase mb-6 tracking-tight flex items-center gap-2">
            <span class="w-2 h-6 bg-blue-700 rounded-sm"></span>
            Próxima Fecha
          </h2>
          
          <div v-if="pendingPartidos" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
          </div>

          <div v-else-if="proximosPartidos && proximosPartidos.length > 0" class="space-y-4">
            <div v-for="partido in proximosPartidos" :key="partido.id" class="bg-zinc-950/50 border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-colors">
              <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-4">
                <span class="text-amber-500">{{ new Date(partido.fecha_hora).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) }} HRS</span>
                <span class="text-zinc-600">{{ new Date(partido.fecha_hora).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' }) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3 w-2/5">
                  <div class="w-8 h-8 bg-zinc-800 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border border-zinc-700">
                    <img v-if="partido.local.logo_url" :src="partido.local.logo_url" class="w-full h-full object-cover p-1" />
                    <span v-else class="text-xs font-bold text-zinc-500">{{ partido.local.nombre.charAt(0) }}</span>
                  </div>
                  <span class="font-bold text-xs text-zinc-300 truncate">{{ partido.local.nombre }}</span>
                </div>
                <span class="text-zinc-700 font-black text-sm w-1/5 text-center">VS</span>
                <div class="flex items-center gap-3 w-2/5 justify-end">
                  <span class="font-bold text-xs text-zinc-300 truncate text-right">{{ partido.visita.nombre }}</span>
                  <div class="w-8 h-8 bg-zinc-800 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border border-zinc-700">
                    <img v-if="partido.visita.logo_url" :src="partido.visita.logo_url" class="w-full h-full object-cover p-1" />
                    <span v-else class="text-xs font-bold text-zinc-500">{{ partido.visita.nombre.charAt(0) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-zinc-600 text-xs font-bold uppercase tracking-widest">
            Sin partidos programados
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Variables de estado
const selectedCategoriaId = ref<number | null>(null)

// 1. Cargar Clubes y Partido en Vivo
const { data: clubes, pending: pendingClubes } = useFetch('/api/clubes')
const { data: partidoEnVivo } = useFetch('/api/partidos/en-vivo')

// 2. Cargar Categorías
const { data: categorias } = useFetch('/api/categorias')

// Al terminar de cargar las categorías, buscamos "TODO COMPETIDOR" por defecto
watch(categorias, (nuevasCategorias) => {
  if (nuevasCategorias && nuevasCategorias.length > 0 && !selectedCategoriaId.value) {
    // Busca la categoría exacta (ignorando mayúsculas por seguridad)
    const categoriaDefault = nuevasCategorias.find(c => c.nombre.toUpperCase() === 'TODO COMPETIDOR')
    
    // Si la encuentra, selecciona su ID. Si por algún motivo no existe, selecciona la primera.
    selectedCategoriaId.value = categoriaDefault ? categoriaDefault.id : nuevasCategorias[0].id
  }
}, { immediate: true })

// 3. Cargas Reactivas (Se vuelven a ejecutar solas al cambiar selectedCategoriaId)
const { data: posiciones, pending: pendingPos } = useFetch('/api/posiciones', {
  query: { categoriaId: selectedCategoriaId }
})

const { data: proximosPartidos, pending: pendingPartidos } = useFetch('/api/partidos/proximos', {
  query: { categoriaId: selectedCategoriaId }
})

const { data: ultimosPartidos, pending: pendingUltimos } = useFetch('/api/partidos/ultimos', {
  query: { categoriaId: selectedCategoriaId }
})
</script>