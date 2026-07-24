<template>
  <div class="max-w-7xl mx-auto pb-12">
    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black text-white uppercase tracking-tight mb-1">Ranking y Estadísticas</h1>
        <p class="text-zinc-400 text-sm">Líderes individuales en anotaciones y tiros de larga distancia por categoría.</p>
      </div>

      <!-- Selector de Categoría -->
      <div class="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl">
        <span class="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-3">Categoría:</span>
        <select 
          v-model="categoriaSeleccionada" 
          @change="cambiarCategoria"
          class="bg-zinc-950 text-zinc-200 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-amber-500"
        >
          <option v-for="cat in data?.categorias" :key="cat.id" :value="cat.id">
            {{ cat.nombre }}
          </option>
        </select>
      </div>
    </div>

    <!-- Pestañas de Navegación (Goleadores vs Triples) -->
    <div class="flex border-b border-zinc-800 mb-6 gap-6">
      <button 
        @click="pestanaActiva = 'goleadores'"
        class="pb-3 text-xs font-black uppercase tracking-widest transition-colors border-b-2 -mb-px flex items-center gap-2"
        :class="pestanaActiva === 'goleadores' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
        Top Goleadores (Puntos)
      </button>
      <button 
        @click="pestanaActiva = 'triples'"
        class="pb-3 text-xs font-black uppercase tracking-widest transition-colors border-b-2 -mb-px flex items-center gap-2"
        :class="pestanaActiva === 'triples' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
        Líderes en Triples
      </button>
    </div>

    <!-- Estado de Carga -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
    </div>

    <!-- Contenido: Goleadores -->
    <div v-else-if="pestanaActiva === 'goleadores'">
      <div v-if="data?.goleadores && data.goleadores.length > 0" class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-zinc-950/50 border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                <th class="px-6 py-4 w-20 text-center">Pos</th>
                <th class="px-6 py-4">Jugador</th>
                <th class="px-6 py-4">Club</th>
                <th class="px-6 py-4 text-center">Partidos</th>
                <th class="px-6 py-4 text-center">Triples</th>
                <th class="px-6 py-4 text-center">Promedio</th>
                <th class="px-6 py-4 text-right pr-8">Total Puntos</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(item, index) in data.goleadores" 
                :key="item.jugadorId"
                class="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors"
              >
                <!-- Posición con diseño especial para el podio -->
                <td class="px-6 py-4 text-center font-black">
                  <span 
                    class="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs"
                    :class="{
                      'bg-amber-500/20 text-amber-400 border border-amber-500/50': index === 0,
                      'bg-zinc-300/10 text-zinc-300 border border-zinc-400/30': index === 1,
                      'bg-amber-700/20 text-amber-600 border border-amber-700/40': index === 2,
                      'text-zinc-500': index > 2
                    }"
                  >
                    {{ index + 1 }}
                  </span>
                </td>

                <!-- Nombre -->
                <td class="px-6 py-4 font-bold text-zinc-100 uppercase text-sm">
                  {{ item.nombre }}
                </td>

                <!-- Club -->
                <td class="px-6 py-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  {{ item.clubNombre }}
                </td>

                <!-- Partidos Jugados -->
                <td class="px-6 py-4 text-center text-zinc-400 text-xs font-bold">
                  {{ item.partidosJugados }}
                </td>

                <!-- Triples -->
                <td class="px-6 py-4 text-center text-zinc-400 text-xs font-bold">
                  {{ item.triples }}
                </td>

                <!-- Promedio -->
                <td class="px-6 py-4 text-center text-zinc-400 text-xs font-bold">
                  {{ item.partidosJugados > 0 ? (item.puntos / item.partidosJugados).toFixed(1) : '0.0' }}
                </td>

                <!-- Puntos Totales -->
                <td class="px-6 py-4 text-right pr-8 font-black text-amber-500 text-lg">
                  {{ item.puntos }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
        <h3 class="text-zinc-300 font-bold text-lg mb-2">Sin registros en esta categoría</h3>
        <p class="text-zinc-500 text-sm">Aún no hay partidos finalizados con estadísticas registradas.</p>
      </div>
    </div>

    <!-- Contenido: Triples -->
    <div v-else-if="pestanaActiva === 'triples'">
      <div v-if="data?.triples && data.triples.length > 0" class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-zinc-950/50 border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                <th class="px-6 py-4 w-20 text-center">Pos</th>
                <th class="px-6 py-4">Jugador</th>
                <th class="px-6 py-4">Club</th>
                <th class="px-6 py-4 text-center">Partidos</th>
                <th class="px-6 py-4 text-center">Puntos Totales</th>
                <th class="px-6 py-4 text-right pr-8">Total Triples</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(item, index) in data.triples" 
                :key="item.jugadorId"
                class="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors"
              >
                <!-- Posición -->
                <td class="px-6 py-4 text-center font-black">
                  <span 
                    class="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs"
                    :class="{
                      'bg-amber-500/20 text-amber-400 border border-amber-500/50': index === 0,
                      'bg-zinc-300/10 text-zinc-300 border border-zinc-400/30': index === 1,
                      'bg-amber-700/20 text-amber-600 border border-amber-700/40': index === 2,
                      'text-zinc-500': index > 2
                    }"
                  >
                    {{ index + 1 }}
                  </span>
                </td>

                <!-- Nombre -->
                <td class="px-6 py-4 font-bold text-zinc-100 uppercase text-sm">
                  {{ item.nombre }}
                </td>

                <!-- Club -->
                <td class="px-6 py-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  {{ item.clubNombre }}
                </td>

                <!-- Partidos -->
                <td class="px-6 py-4 text-center text-zinc-400 text-xs font-bold">
                  {{ item.partidosJugados }}
                </td>

                <!-- Puntos -->
                <td class="px-6 py-4 text-center text-zinc-400 text-xs font-bold">
                  {{ item.puntos }}
                </td>

                <!-- Total Triples -->
                <td class="px-6 py-4 text-right pr-8 font-black text-amber-500 text-lg">
                  {{ item.triples }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
        <h3 class="text-zinc-300 font-bold text-lg mb-2">Sin registros en esta categoría</h3>
        <p class="text-zinc-500 text-sm">Aún no hay triples registrados en los partidos finalizados.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: 'intranet', middleware: 'auth' })

const router = useRouter()
const route = useRoute()

const pestanaActiva = ref<'goleadores' | 'triples'>('goleadores')
const categoriaSeleccionada = ref(route.query.categoria_id ? Number(route.query.categoria_id) : undefined)

// Consultamos los datos con la categoría actual en la query URL
const { data, pending, refresh } = useFetch(() => `/api/intranet/ranking?categoria_id=${categoriaSeleccionada.value || ''}`, {
  key: 'ranking-data',
  getCachedData: () => undefined
})

// Sincronizar el select con la primera categoría al cargar si viene vacío
watchEffect(() => {
  if (data.value && !categoriaSeleccionada.value) {
    categoriaSeleccionada.value = data.value.selectedCategoriaId
  }
})

const cambiarCategoria = () => {
  router.push({ query: { categoria_id: categoriaSeleccionada.value } })
  refresh()
}
</script>