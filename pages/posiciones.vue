<template>
  <div class="min-h-screen bg-zinc-950 pb-20">
    <!-- Header -->
    <div class="bg-zinc-900 border-b border-zinc-800 pt-24 pb-12 px-4 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-amber-900/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div class="max-w-[1000px] mx-auto relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-600/30 bg-amber-900/10 text-amber-500 text-xs font-black tracking-widest uppercase mb-4">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span> Tabla Oficial
        </div>
        <h1 class="text-4xl md:text-5xl font-black uppercase text-zinc-100 tracking-tighter">
          Tablas de <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">Posiciones</span>
        </h1>
        <p class="text-zinc-400 mt-4 font-medium max-w-lg">
          Consulta el rendimiento actual de los clubes en cada una de las categorías del campeonato.
        </p>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-[1000px] mx-auto px-4 py-12">
      
      <!-- Pestañas de Categorías -->
      <div v-if="categorias && categorias.length > 0" class="flex gap-3 mb-8 border-b border-zinc-800 pb-4 overflow-x-auto scrollbar-hide">
        <button 
          v-for="cat in categorias" :key="cat.id"
          @click="selectedCategoriaId = cat.id"
          :class="[
            'px-6 py-2 rounded text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap',
            selectedCategoriaId === cat.id 
              ? 'bg-zinc-800 text-zinc-100 border-l-2 border-amber-500 shadow-md' 
              : 'bg-transparent hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300'
          ]"
        >
          {{ cat.nombre }}
        </button>
      </div>

      <!-- Tabla de Clasificación -->
      <div class="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 shadow-xl backdrop-blur-sm overflow-hidden">
        <div v-if="pendingPos" class="flex justify-center py-16">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>

        <div v-else-if="posicionesFiltradas && posicionesFiltradas.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm min-w-[500px]">
            <thead class="text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
              <tr>
                <th class="text-left font-black pb-3 w-10">POS</th>
                <th class="text-left font-black pb-3">EQUIPO</th>
                <th class="text-center font-black pb-3 w-12">PJ</th>
                <th class="text-center font-black pb-3 w-12">PG</th>
                <th class="text-center font-black pb-3 w-12">PP</th>
                <th class="text-center font-black pb-3 w-14">DIF</th>
                <th class="text-center font-black pb-3 text-amber-500 w-16">PTS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-800/50">
              <tr v-for="(pos, index) in posicionesFiltradas" :key="pos.id" class="hover:bg-zinc-800/30 transition-colors">
                <td :class="['py-4 font-black', index === 0 ? 'text-amber-500' : 'text-zinc-500']">{{ index + 1 }}</td>
                <td class="py-4 font-bold flex items-center gap-3">
                  <div class="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden border border-zinc-700 flex-shrink-0">
                     <img v-if="pos.club.logo_url" :src="pos.club.logo_url" class="w-full h-full object-cover p-0.5" />
                     <span v-else class="text-[10px] text-zinc-400">{{ pos.club.nombre.charAt(0) }}</span>
                  </div> 
                  <span :class="['truncate', index === 0 ? 'text-zinc-100 font-black' : 'text-zinc-300']">{{ pos.club.nombre }}</span>
                </td>
                <td class="py-4 text-center text-zinc-400 text-xs">{{ pos.pj }}</td>
                <td class="py-4 text-center text-zinc-400 text-xs">{{ pos.pg }}</td>
                <td class="py-4 text-center text-zinc-400 text-xs">{{ pos.pp }}</td>
                <td :class="['py-4 text-center text-xs font-medium', pos.dif > 0 ? 'text-green-500/80' : (pos.dif < 0 ? 'text-red-500/80' : 'text-zinc-500')]">
                  {{ pos.dif > 0 ? '+' + pos.dif : pos.dif }}
                </td>
                <td :class="['py-4 text-center font-black text-base', index === 0 ? 'text-amber-500' : 'text-zinc-100']">{{ pos.puntos }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="text-center py-16 text-zinc-600 text-xs font-bold uppercase tracking-widest">
          No hay registros en esta categoría
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedCategoriaId = ref<number | null>(null)

// 1. Cargar Categorías
const { data: categorias } = await useFetch('/api/categorias')

// Seleccionar "Todo Competidor" o la primera por defecto
const catDefault = categorias.value?.find(c => c.nombre.toUpperCase() === 'TODO COMPETIDOR')
selectedCategoriaId.value = catDefault ? catDefault.id : (categorias.value?.[0]?.id || null)

// 2. Cargar todas las posiciones
const { data: todasPosiciones, pending: pendingPos } = useFetch('/api/posiciones/todas')

// 3. Filtrar de forma reactiva según la categoría seleccionada
const posicionesFiltradas = computed(() => {
  if (!todasPosiciones.value) return []
  return todasPosiciones.value.filter(p => p.categoria_id === selectedCategoriaId.value)
})
</script>