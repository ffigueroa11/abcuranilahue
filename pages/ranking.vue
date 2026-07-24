<template>
  <div class="min-h-screen bg-zinc-950 pb-20">
    <!-- Header -->
    <div class="bg-zinc-900 border-b border-zinc-800 pt-24 pb-12 px-4 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-amber-900/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div class="max-w-5xl mx-auto relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-600/30 bg-amber-900/10 text-amber-500 text-xs font-black tracking-widest uppercase mb-4">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span> Ranking Oficial
        </div>
        <h1 class="text-4xl md:text-5xl font-black uppercase text-zinc-100 tracking-tighter">
          Líderes en <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">Estadísticas</span>
        </h1>
        <p class="text-zinc-400 mt-4 font-medium max-w-lg">
          Consulta el Top 10 de los mejores anotadores y triplistas del campeonato por categoría.
        </p>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-5xl mx-auto px-4 py-12">
      
      <!-- Selector de Categoría alineado a la derecha -->
      <div class="flex justify-end mb-8">
        <div class="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl w-full md:w-auto">
          <span class="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-3">Serie:</span>
          <select 
            :value="data?.selectedCategoriaId"
            @change="cambiarCategoria"
            class="w-full md:w-auto bg-zinc-950 text-zinc-200 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg border border-zinc-800 focus:outline-none focus:border-amber-500"
          >
            <option v-for="cat in data?.categorias" :key="cat.id" :value="cat.id">
              {{ cat.nombre }}
            </option>
          </select>
        </div>
      </div>

      <!-- Pestañas de Navegación -->
      <div class="flex border-b border-zinc-800 mb-8 gap-8">
        <button 
          @click="pestanaActiva = 'goleadores'"
          class="pb-3 text-sm font-black uppercase tracking-widest transition-colors border-b-2 -mb-px flex items-center gap-2.5"
          :class="pestanaActiva === 'goleadores' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          Top 10 Goleadores
        </button>
        <button 
          @click="pestanaActiva = 'triples'"
          class="pb-3 text-sm font-black uppercase tracking-widest transition-colors border-b-2 -mb-px flex items-center gap-2.5"
          :class="pestanaActiva === 'triples' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
          Top 10 Triples
        </button>
      </div>

      <!-- Estado de Carga (Ocurrirá solo cuando cambies de categoría client-side) -->
      <div v-if="pending" class="flex justify-center py-24">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>

      <!-- Tabla de Goleadores -->
      <div v-else-if="pestanaActiva === 'goleadores'">
        <div v-if="data?.goleadores && data.goleadores.length > 0" class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-zinc-950/80 border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                  <th class="px-6 py-4 w-20 text-center">#</th>
                  <th class="px-6 py-4">Jugador</th>
                  <th class="px-6 py-4">Club</th>
                  <th class="px-6 py-4 text-center">Partidos</th>
                  <th class="px-6 py-4 text-center">Promedio</th>
                  <th class="px-6 py-4 text-right pr-8">Puntos</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(item, index) in data.goleadores" 
                  :key="item.jugadorId"
                  class="border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors"
                >
                  <td class="px-6 py-4 text-center font-black">
                    <span 
                      class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black shadow-inner"
                      :class="{
                        'bg-amber-500 text-zinc-950 shadow-amber-500/30': index === 0,
                        'bg-zinc-300 text-zinc-950': index === 1,
                        'bg-amber-700 text-white': index === 2,
                        'bg-zinc-950 text-zinc-400 border border-zinc-800': index > 2
                      }"
                    >
                      {{ index + 1 }}
                    </span>
                  </td>
                  <td class="px-6 py-4 font-bold text-white uppercase text-sm">
                    {{ item.nombre }}
                  </td>
                  <td class="px-6 py-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    {{ item.clubNombre }}
                  </td>
                  <td class="px-6 py-4 text-center text-zinc-400 text-xs font-bold">
                    {{ item.partidosJugados }}
                  </td>
                  <td class="px-6 py-4 text-center text-zinc-400 text-xs font-bold">
                    {{ item.partidosJugados > 0 ? (item.puntos / item.partidosJugados).toFixed(1) : '0.0' }}
                  </td>
                  <td class="px-6 py-4 text-right pr-8 font-black text-amber-500 text-xl">
                    {{ item.puntos }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-16 text-center">
          <h3 class="text-zinc-300 font-bold text-lg mb-2">Sin anotadores registrados</h3>
          <p class="text-zinc-500 text-sm">Aún no hay partidos finalizados con estadísticas en esta categoría.</p>
        </div>
      </div>

      <!-- Tabla de Triples -->
      <div v-else-if="pestanaActiva === 'triples'">
        <div v-if="data?.triples && data.triples.length > 0" class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-zinc-950/80 border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                  <th class="px-6 py-4 w-20 text-center">#</th>
                  <th class="px-6 py-4">Jugador</th>
                  <th class="px-6 py-4">Club</th>
                  <th class="px-6 py-4 text-center">Partidos</th>
                  <th class="px-6 py-4 text-center">Puntos Totales</th>
                  <th class="px-6 py-4 text-right pr-8">Triples</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(item, index) in data.triples" 
                  :key="item.jugadorId"
                  class="border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors"
                >
                  <td class="px-6 py-4 text-center font-black">
                    <span 
                      class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black shadow-inner"
                      :class="{
                        'bg-amber-500 text-zinc-950 shadow-amber-500/30': index === 0,
                        'bg-zinc-300 text-zinc-950': index === 1,
                        'bg-amber-700 text-white': index === 2,
                        'bg-zinc-950 text-zinc-400 border border-zinc-800': index > 2
                      }"
                    >
                      {{ index + 1 }}
                    </span>
                  </td>
                  <td class="px-6 py-4 font-bold text-white uppercase text-sm">
                    {{ item.nombre }}
                  </td>
                  <td class="px-6 py-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    {{ item.clubNombre }}
                  </td>
                  <td class="px-6 py-4 text-center text-zinc-400 text-xs font-bold">
                    {{ item.partidosJugados }}
                  </td>
                  <td class="px-6 py-4 text-center text-zinc-400 text-xs font-bold">
                    {{ item.puntos }}
                  </td>
                  <td class="px-6 py-4 text-right pr-8 font-black text-amber-500 text-xl">
                    {{ item.triples }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-16 text-center">
          <h3 class="text-zinc-300 font-bold text-lg mb-2">Sin triples registrados</h3>
          <p class="text-zinc-500 text-sm">Aún no hay tiros de 3 puntos registrados en esta categoría.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()

// Estado de la pestaña activa
const pestanaActiva = ref<'goleadores' | 'triples'>('goleadores')

// Flujo de datos limpio: Se activa automáticamente al detectar cambios en la query
const { data, pending } = await useAsyncData(
  'public-ranking-data',
  () => $fetch('/api/ranking', {
    params: { categoria_id: route.query.categoria_id }
  }),
  {
    watch: [() => route.query.categoria_id]
  }
)

// Actualiza la URL para que Nuxt haga el fetch automáticamente
const cambiarCategoria = (event: Event) => {
  const newId = (event.target as HTMLSelectElement).value
  router.push({ query: { categoria_id: newId } })
}
</script>