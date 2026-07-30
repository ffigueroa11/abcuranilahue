<template>
  <div class="min-h-[100dvh] bg-zinc-950 pb-20">
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
      <div v-if="categorias && categorias.length > 0" class="mb-8">
        <!-- Dropdown para Móviles (visible hasta el breakpoint 'sm') -->
        <div class="sm:hidden relative">
          <select 
            v-model="selectedCategoriaId"
            class="w-full appearance-none bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm font-bold uppercase tracking-wider rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500"
          >
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
              {{ cat.nombre }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>

        <!-- Pestañas para Desktop (oculto hasta el breakpoint 'sm') -->
        <div class="hidden sm:flex gap-3 border-b border-zinc-800 pb-4 overflow-x-auto scrollbar-hide">
          <button 
            v-for="cat in categorias" :key="cat.id"
            @click="selectedCategoriaId = cat.id"
            :class="[
              'px-6 py-2 rounded text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap',
              selectedCategoriaId === cat.id 
                ? 'bg-zinc-800 text-zinc-100 border-l-2 border-amber-500 shadow-md' 
                : 'bg-transparent hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            ]"
          >{{ cat.nombre }}</button>
        </div>
      </div>

      <!-- Tabla de Clasificación -->
      <div class="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        <div v-if="pendingPos" class="flex justify-center py-16">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>

        <div v-else-if="posicionesFiltradas && posicionesFiltradas.length > 0">
          
          <!-- CONTENEDOR SCROLLEABLE (SOLO PARA LA TABLA) -->
          <div class="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <table class="w-full text-sm min-w-[500px]">
              <thead class="text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                <tr>
                  <!-- Columna POSición Fija -->
                  <th class="sticky left-0 bg-zinc-900 z-10 text-left font-black pb-3 pl-2 w-10">POS</th>
                  <!-- Columna EQUIPO Fija (Le damos sombra a la derecha para separar visualmente) -->
                  <th class="sticky left-10 bg-zinc-900 z-10 text-left font-black pb-3 shadow-[10px_0_15px_-5px_rgba(0,0,0,0.5)]">EQUIPO</th>
                  
                  <th class="text-center font-black pb-3 w-12">PJ</th>
                  <th class="text-center font-black pb-3 w-12">PG</th>
                  <th class="text-center font-black pb-3 w-12">PP</th>
                  <th class="text-center font-black pb-3 w-14">DIF</th>
                  <th class="text-center font-black pb-3 text-amber-500 w-16">PTS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-800/50">
                <tr v-for="(pos, index) in posicionesFiltradas" :key="pos.id" class="group">
                  
                  <!-- Celda POS Fija -->
                  <td :class="['sticky left-0 bg-zinc-900 group-hover:bg-zinc-800 z-10 py-4 font-black pl-2 transition-colors', index === 0 ? 'text-amber-500' : 'text-zinc-500']">{{ index + 1 }}</td>
                  
                  <!-- Celda EQUIPO Fija con sombra -->
                  <td class="sticky left-10 bg-zinc-900 group-hover:bg-zinc-800 z-10 py-4 font-bold flex items-center gap-3 shadow-[10px_0_15px_-5px_rgba(0,0,0,0.5)] pr-2 transition-colors">
                    <div class="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden border border-zinc-700 flex-shrink-0">
                      <img v-if="pos.club.logo_url" :src="pos.club.logo_url" class="w-full h-full object-cover p-0.5" />
                      <span v-else class="text-[10px] text-zinc-400">{{ pos.club.nombre.charAt(0) }}</span>
                    </div> 
                    <span :class="['truncate', index === 0 ? 'text-zinc-100 font-black' : 'text-zinc-300']">{{ pos.club.nombre }}</span>
                  </td>
                  
                  <!-- El resto de las columnas normales -->
                  <td class="py-4 text-center text-zinc-400 text-xs group-hover:bg-zinc-800 transition-colors">{{ pos.pj }}</td>
                  <td class="py-4 text-center text-zinc-400 text-xs group-hover:bg-zinc-800 transition-colors">{{ pos.pg }}</td>
                  <td class="py-4 text-center text-zinc-400 text-xs group-hover:bg-zinc-800 transition-colors">{{ pos.pp }}</td>
                  <td :class="['py-4 text-center text-xs font-medium group-hover:bg-zinc-800 transition-colors', pos.dif > 0 ? 'text-green-500/80' : (pos.dif < 0 ? 'text-red-500/80' : 'text-zinc-500')]">
                    {{ pos.dif > 0 ? '+' + pos.dif : pos.dif }}
                  </td>
                  <td :class="['py-4 text-center font-black text-base group-hover:bg-zinc-800 transition-colors', index === 0 ? 'text-amber-500' : 'text-zinc-100']">
                    {{ pos.puntos }}
                    <span v-if="esEmpate(index)" class="text-amber-500 text-[10px] sm:text-xs ml-0.5 align-top" title="Desempate por Criterio FIBA">*</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- LEYENDA FIBA Y BOTÓN (FUERA DEL SCROLL PARA VISIBILIDAD MÓVIL 100%) -->
          <div v-if="hayEmpates" class="mt-4 sm:mt-6 border-t border-zinc-800/50 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500">
            <div class="flex items-start gap-2">
              <span class="text-amber-500 font-black text-sm mt-0.5">*</span>
              <p class="leading-tight">
                El orden de los equipos empatados en puntos (PTS) se define por el <strong class="text-zinc-400">Reglamento FIBA</strong>.
              </p>
            </div>
            
            <button 
              @click="abrirModalFiba = true"
              class="flex items-center justify-center w-full sm:w-auto gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-5 py-3 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-sm border border-zinc-700 active:scale-[0.98]"
            >
              <svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Ver Detalle Desempate
            </button>
          </div>

        </div>

        <div v-else class="text-center py-16 text-zinc-600 text-xs font-bold uppercase tracking-widest">
          No hay registros en esta categoría
        </div>
      </div>
    </div>

    <!-- MODAL: DETALLE DESEMPATE FIBA -->
    <div v-if="abrirModalFiba" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative">
        <!-- Header -->
        <div class="p-5 border-b border-zinc-800 bg-zinc-950/80 relative flex-shrink-0">
          <button @click="abrirModalFiba = false" class="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors bg-zinc-900 p-1.5 rounded-lg border border-zinc-700">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 block">
            Criterios FIBA
          </span>
          <h3 class="text-lg font-black text-white uppercase pr-8 leading-tight">Resolución de Empates</h3>
          <p class="text-[10px] sm:text-xs text-zinc-400 font-bold mt-1">
            Rendimiento exclusivo en enfrentamientos directos entre equipos con el mismo puntaje.
          </p>
        </div>

        <!-- Contenido (Scrollable) -->
        <div class="p-4 sm:p-6 overflow-y-auto flex-1 bg-zinc-900/50">
          <div v-if="gruposEmpatados.length === 0" class="text-center py-8 text-zinc-500 text-xs uppercase font-bold tracking-widest">
            No hay información detallada.
          </div>
          
          <div v-else class="space-y-6">
            <div v-for="grupo in gruposEmpatados" :key="grupo.puntos" class="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
              <div class="bg-zinc-900 border-b border-zinc-800 px-4 py-2.5">
                <h4 class="text-xs font-black text-amber-500 uppercase tracking-widest">Empate a {{ grupo.puntos }} Puntos</h4>
              </div>
              <div class="overflow-x-auto scrollbar-hide">
                <table class="w-full text-left text-[10px] sm:text-xs text-zinc-300">
                  <thead class="bg-zinc-950/50 text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                    <tr>
                      <th class="px-3 sm:px-4 py-3 font-black">Equipo</th>
                      <th class="px-2 py-3 font-black text-center" title="Puntos en Partidos Directos">PTS (H2H)</th>
                      <th class="px-2 py-3 font-black text-center" title="Diferencia de Puntos en Partidos Directos">DIF (H2H)</th>
                      <th class="px-3 sm:px-4 py-3 font-black text-center" title="Diferencia General en el Campeonato">DIF (Gen)</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-zinc-800/50">
                    <tr v-for="equipo in grupo.equipos" :key="equipo.id" class="hover:bg-zinc-900/50 transition-colors">
                      <td class="px-3 sm:px-4 py-3 font-bold flex items-center gap-2">
                         <div class="w-5 h-5 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-zinc-700">
                           <img v-if="equipo.club.logo_url" :src="equipo.club.logo_url" class="w-full h-full object-cover p-0.5" />
                           <span v-else class="text-[8px]">{{ equipo.club.nombre.charAt(0) }}</span>
                         </div>
                         <span class="truncate max-w-[100px] sm:max-w-[150px] uppercase text-zinc-200">{{ equipo.club.nombre }}</span>
                      </td>
                      <td class="px-2 py-3 text-center font-black text-white">{{ equipo.ptsH2H ?? '-' }}</td>
                      <td class="px-2 py-3 text-center font-bold" :class="equipo.difH2H > 0 ? 'text-green-500' : (equipo.difH2H < 0 ? 'text-red-500' : 'text-zinc-500')">
                        {{ equipo.difH2H > 0 ? '+'+equipo.difH2H : (equipo.difH2H ?? '-') }}
                      </td>
                      <td class="px-3 sm:px-4 py-3 text-center font-medium">{{ equipo.dif > 0 ? '+'+equipo.dif : equipo.dif }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div class="mt-8 text-[9px] sm:text-[10px] text-zinc-400 bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl leading-relaxed">
            <strong class="text-zinc-200 block mb-2 uppercase tracking-widest text-xs">Glosario de Desempate:</strong>
            <ul class="list-disc pl-4 space-y-1.5">
              <li><strong class="text-amber-500">PTS (H2H):</strong> Puntos obtenidos <span class="underline">exclusivamente</span> en los partidos jugados contra los otros equipos empatados (Criterio 1).</li>
              <li><strong class="text-amber-500">DIF (H2H):</strong> Diferencia de puntos a favor y en contra solo en los duelos entre los equipos empatados (Criterio 2).</li>
              <li><strong class="text-amber-500">DIF (Gen):</strong> Diferencia de puntos general de todo el campeonato (Criterio 3).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedCategoriaId = ref<number | null>(null)

// 1. Cargar Categorías
const { data: categorias } = await useFetch('/api/categorias')

// Seleccionar "Todo Competidor" o la primera por defecto
const catDefault = categorias.value?.find((c: any) => c.nombre.toUpperCase() === 'TODO COMPETIDOR')
selectedCategoriaId.value = catDefault ? catDefault.id : (categorias.value?.[0]?.id || null)

// 2. Cargar todas las posiciones
const { data: todasPosiciones, pending: pendingPos } = useFetch('/api/posiciones/todas')

// 3. Filtrar de forma reactiva según la categoría seleccionada
const posicionesFiltradas = computed(() => {
  if (!todasPosiciones.value) return []
  return todasPosiciones.value.filter((p: any) => p.categoria_id === selectedCategoriaId.value)
})

// ==========================================
// LÓGICA DE DETECCIÓN DE EMPATES FIBA
// ==========================================
const hayEmpates = computed(() => {
  if (!posicionesFiltradas.value || posicionesFiltradas.value.length === 0) return false
  const puntosArray = posicionesFiltradas.value.map((p: any) => p.puntos)
  const setPuntos = new Set(puntosArray)
  return setPuntos.size !== puntosArray.length 
})

const esEmpate = (index: number) => {
  if (!posicionesFiltradas.value || posicionesFiltradas.value.length === 0) return false
  const ptsActual = posicionesFiltradas.value[index].puntos
  const ptsAnterior = index > 0 ? posicionesFiltradas.value[index - 1].puntos : null
  const ptsSiguiente = index < posicionesFiltradas.value.length - 1 ? posicionesFiltradas.value[index + 1].puntos : null
  
  return ptsActual === ptsAnterior || ptsActual === ptsSiguiente
}

// Control del modal y agrupación
const abrirModalFiba = ref(false)

const gruposEmpatados = computed(() => {
  if (!posicionesFiltradas.value || posicionesFiltradas.value.length === 0) return []
  
  // Agrupar equipos filtrados por puntaje
  const grupos = {} as Record<number, any[]>
  posicionesFiltradas.value.forEach((pos: any) => {
    if (!grupos[pos.puntos]) grupos[pos.puntos] = []
    grupos[pos.puntos].push(pos)
  })
  
  // Filtrar grupos con empates
  const resultado = []
  for (const pts in grupos) {
    if (grupos[pts].length > 1) {
      resultado.push({
        puntos: Number(pts),
        equipos: grupos[pts]
      })
    }
  }
  
  // Ordenar para mostrar los líderes empatados primero
  return resultado.sort((a, b) => b.puntos - a.puntos)
})
</script>