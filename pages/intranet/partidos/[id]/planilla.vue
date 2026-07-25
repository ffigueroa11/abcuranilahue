<template>
  <div class="max-w-7xl mx-auto pb-12">
    <!-- Botón Volver -->
    <div class="mb-6">
      <NuxtLink to="/intranet/fixture" class="text-zinc-500 hover:text-zinc-300 font-bold text-xs uppercase tracking-widest flex items-center gap-1 w-fit transition-colors">
        &larr; Volver al Fixture
      </NuxtLink>
    </div>

    <!-- Carga inicial -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
    </div>

    <div v-else-if="partido">
      <!-- Encabezado del Partido -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
        <div class="text-center mb-6">
          <span class="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1 rounded uppercase tracking-widest">
            {{ partido.categoria.nombre }} — Jornada {{ partido.jornada }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div class="flex flex-col items-center md:items-end text-center md:text-right gap-2">
            <h2 class="text-xl font-black text-white uppercase">{{ partido.local.nombre }}</h2>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-zinc-500 uppercase">Score Global:</span>
              <input v-model.number="form.score_local_input" type="number" placeholder="Auto" class="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center font-black text-amber-500 text-lg focus:outline-none focus:border-amber-500"/>
            </div>
            <span class="text-xs text-zinc-400">Suma del detalle: <strong class="text-white">{{ sumaLocal }} pts</strong></span>
          </div>

          <div class="flex flex-col items-center justify-center gap-3">
            <span class="text-zinc-600 font-black italic text-2xl">VS</span>
            <div class="flex flex-col sm:flex-row gap-2 w-full">
              <button @click="guardarPlanilla(false)" :disabled="guardando" class="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-zinc-700">
                Guardar Progreso
              </button>
              <button @click="guardarPlanilla(true)" :disabled="guardando" class="flex-1 bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2">
                Finalizar Partido
              </button>
            </div>
          </div>

          <div class="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <h2 class="text-xl font-black text-white uppercase">{{ partido.visita.nombre }}</h2>
            <div class="flex items-center gap-2">
              <input v-model.number="form.score_visita_input" type="number" placeholder="Auto" class="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center font-black text-amber-500 text-lg focus:outline-none focus:border-amber-500"/>
              <span class="text-xs font-bold text-zinc-500 uppercase">Score Global:</span>
            </div>
            <span class="text-xs text-zinc-400">Suma del detalle: <strong class="text-white">{{ sumaVisita }} pts</strong></span>
          </div>
        </div>

        <div v-if="errorMensaje" class="mt-6 bg-red-950/50 border border-red-900 text-red-400 text-xs font-bold p-3 rounded-lg text-center">{{ errorMensaje }}</div>
        <div v-if="successMensaje" class="mt-6 bg-green-950/50 border border-green-900 text-green-400 text-xs font-bold p-3 rounded-lg text-center">{{ successMensaje }}</div>
      </div>

      <!-- Tablas Dinámicas de Jugadores en Cancha -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        <!-- PLANILLA LOCAL -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
          <div class="bg-zinc-950/80 px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
            <h3 class="font-black text-white uppercase text-sm tracking-wider">Planilla {{ partido.local.nombre }}</h3>
            <button @click="abrirBuscador('local', partido.local.id)" class="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg">
              + Agregar Jugador
            </button>
          </div>
          
          <div class="overflow-x-auto flex-1 p-2">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                  <th class="px-3 py-2">Jugador</th>
                  <th class="px-2 py-2 w-20 text-center">Pts</th>
                  <th class="px-2 py-2 w-20 text-center">3P</th>
                  <th class="px-2 py-2 w-20 text-center">Fls</th>
                  <th class="px-2 py-2 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-800/40">
                <tr v-if="jugadoresEnPlanillaLocal.length === 0">
                  <td colspan="5" class="text-center py-8 text-zinc-600 text-xs uppercase font-bold tracking-widest">Ningún jugador en planilla</td>
                </tr>
                <tr v-for="jugador in jugadoresEnPlanillaLocal" :key="jugador.id" class="hover:bg-zinc-800/20">
                  <td class="px-3 py-2 font-bold text-zinc-200 uppercase text-xs">
                    <span class="text-amber-500 mr-1">{{ jugador.numero || '-' }}</span> {{ jugador.nombre }}
                  </td>
                  <td class="px-2 py-2 text-center"><input v-if="statsMap[jugador.id]" v-model.number="statsMap[jugador.id].puntos" type="number" min="0" class="w-14 bg-zinc-950 border border-zinc-800 rounded text-center py-1 font-bold text-white text-sm focus:border-amber-500 focus:outline-none" /></td>
                  <td class="px-2 py-2 text-center"><input v-if="statsMap[jugador.id]" v-model.number="statsMap[jugador.id].triples" type="number" min="0" class="w-14 bg-zinc-950 border border-zinc-800 rounded text-center py-1 font-bold text-white text-sm focus:border-amber-500 focus:outline-none" /></td>
                  <td class="px-2 py-2 text-center"><input v-if="statsMap[jugador.id]" v-model.number="statsMap[jugador.id].faltas" type="number" min="0" max="5" class="w-14 bg-zinc-950 border border-zinc-800 rounded text-center py-1 font-bold text-white text-sm focus:border-amber-500 focus:outline-none" /></td>
                  <td class="px-2 py-2 text-center">
                    <button @click="removerDePlanilla('local', jugador.id)" class="text-zinc-600 hover:text-red-500 transition-colors" title="Quitar de la lista">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- PLANILLA VISITA -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
          <div class="bg-zinc-950/80 px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
            <h3 class="font-black text-white uppercase text-sm tracking-wider">Planilla {{ partido.visita.nombre }}</h3>
            <button @click="abrirBuscador('visita', partido.visita.id)" class="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg">
              + Agregar Jugador
            </button>
          </div>
          
          <div class="overflow-x-auto flex-1 p-2">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                  <th class="px-3 py-2">Jugador</th>
                  <th class="px-2 py-2 w-20 text-center">Pts</th>
                  <th class="px-2 py-2 w-20 text-center">3P</th>
                  <th class="px-2 py-2 w-20 text-center">Fls</th>
                  <th class="px-2 py-2 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-800/40">
                <tr v-if="jugadoresEnPlanillaVisita.length === 0">
                  <td colspan="5" class="text-center py-8 text-zinc-600 text-xs uppercase font-bold tracking-widest">Ningún jugador en planilla</td>
                </tr>
                <tr v-for="jugador in jugadoresEnPlanillaVisita" :key="jugador.id" class="hover:bg-zinc-800/20">
                  <td class="px-3 py-2 font-bold text-zinc-200 uppercase text-xs">
                    <span class="text-amber-500 mr-1">{{ jugador.numero || '-' }}</span> {{ jugador.nombre }}
                  </td>
                  <td class="px-2 py-2 text-center"><input v-if="statsMap[jugador.id]" v-model.number="statsMap[jugador.id].puntos" type="number" min="0" class="w-14 bg-zinc-950 border border-zinc-800 rounded text-center py-1 font-bold text-white text-sm focus:border-amber-500 focus:outline-none" /></td>
                  <td class="px-2 py-2 text-center"><input v-if="statsMap[jugador.id]" v-model.number="statsMap[jugador.id].triples" type="number" min="0" class="w-14 bg-zinc-950 border border-zinc-800 rounded text-center py-1 font-bold text-white text-sm focus:border-amber-500 focus:outline-none" /></td>
                  <td class="px-2 py-2 text-center"><input v-if="statsMap[jugador.id]" v-model.number="statsMap[jugador.id].faltas" type="number" min="0" max="5" class="w-14 bg-zinc-950 border border-zinc-800 rounded text-center py-1 font-bold text-white text-sm focus:border-amber-500 focus:outline-none" /></td>
                  <td class="px-2 py-2 text-center">
                    <button @click="removerDePlanilla('visita', jugador.id)" class="text-zinc-600 hover:text-red-500 transition-colors" title="Quitar de la lista">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- MODAL MULTIUSO: BUSCADOR / CREADOR -->
        <div v-if="modal.abierto" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div class="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
            
            <!-- Header Modal -->
            <div class="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 rounded-t-2xl">
              <h2 class="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span class="w-2 h-2 rounded-full" :class="modal.tipo === 'local' ? 'bg-amber-500' : 'bg-blue-500'"></span>
                {{ modal.modo === 'buscar' ? 'Buscar Jugador' : 'Registrar Nuevo Jugador' }}
              </h2>
              <button @click="modal.abierto = false" class="text-zinc-500 hover:text-white p-1"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            
            <!-- CONTENIDO MODO BUSCAR -->
            <div v-if="modal.modo === 'buscar'" class="p-5 flex flex-col gap-4 overflow-hidden">
               <!-- NUEVO: Indicador de Filtro -->
              <div class="flex items-center gap-2 -mb-2">
                <span v-if="esPartidoDamas" class="text-[9px] text-pink-400 font-black uppercase tracking-widest bg-pink-950/50 border border-pink-900 px-2 py-1 rounded-md">
                  Filtro Activo: Rama Femenina
                </span>
                <span v-else class="text-[9px] text-blue-400 font-black uppercase tracking-widest bg-blue-950/50 border border-blue-900 px-2 py-1 rounded-md">
                  Filtro Activo: Rama Masculina
                </span>
              </div>
              <input 
                v-model="modal.busqueda" 
                type="text" 
                placeholder="Escribe un nombre para buscar..." 
                class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition-all shadow-inner"
                autofocus
              />
              
              <div class="overflow-y-auto flex-1 max-h-[300px] bg-zinc-950/30 rounded-xl border border-zinc-800 p-2 space-y-1">
                <div v-if="jugadoresFiltrados.length === 0" class="text-center py-6">
                  <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">No hay coincidencias</p>
                  <button @click="modal.modo = 'crear'" class="text-amber-500 text-xs font-black uppercase hover:underline">
                    Crear "{{ modal.busqueda }}"
                  </button>
                </div>
                
                <button 
                  v-for="jugador in jugadoresFiltrados" :key="jugador.id"
                  @click="agregarJugador(jugador)"
                  class="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 flex justify-between items-center transition-colors group"
                >
                  <span class="font-bold text-zinc-300 text-xs uppercase">{{ jugador.nombre }}</span>
                  <span class="text-[10px] font-black text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Seleccionar</span>
                </button>
              </div>

              <button @click="modal.modo = 'crear'" class="w-full py-3 border border-dashed border-zinc-700 text-zinc-400 hover:text-amber-500 hover:border-amber-500 rounded-xl font-bold text-xs uppercase transition-colors">
                + Crear Jugador Nuevo
              </button>
            </div>
            
            <!-- CONTENIDO MODO CREAR -->
            <div v-if="modal.modo === 'crear'" class="p-5 overflow-y-auto max-h-[70vh]">
              <form @submit.prevent="guardarYAgregarJugador" class="space-y-5">
                
                <!-- Iterador de Jugadores Dinámico -->
                <div>
                  <div class="flex justify-between items-end mb-2">
                    <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Jugadores a Registrar</label>
                  </div>
                  
                  <div class="space-y-2">
                    <div v-for="(jugador, index) in formularioCrear.jugadores" :key="index" class="flex items-center gap-2 animate-fade-in">
                      <input v-model="jugador.nombre" type="text" placeholder="Nombre Completo" required class="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors"/>
                      <input v-model="jugador.numero" type="number" placeholder="Nº" class="w-16 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 text-center transition-colors"/>
                      
                      <!-- Botón Eliminar Fila (Solo si hay más de 1) -->
                      <button v-if="formularioCrear.jugadores.length > 1" @click.prevent="removerFilaJugador(index)" class="p-2.5 text-zinc-600 hover:text-red-500 hover:bg-red-950/30 transition-all bg-zinc-950 rounded-lg border border-zinc-800">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Botón Agregar Fila -->
                  <button @click.prevent="agregarFilaJugador" class="mt-3 text-[10px] font-black text-amber-500 hover:text-amber-400 uppercase tracking-widest flex items-center gap-1.5 transition-colors px-2 py-1 bg-amber-500/10 rounded-md border border-amber-500/20">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    Añadir otro jugador
                  </button>
                </div>

                <!-- Categorías (Se aplican en lote a todos los nuevos) -->
                <div class="pt-2 border-t border-zinc-800/50">
                  <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Categorías Asociadas (En Lote)</label>
                  <div class="grid grid-cols-2 gap-2 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <label v-for="cat in categorias" :key="cat.id" class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" :value="cat.id" v-model="formularioCrear.categorias_ids" class="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-amber-500"/>
                      <span class="text-xs font-bold text-zinc-400 uppercase">{{ cat.nombre }}</span>
                    </label>
                  </div>
                </div>

                <div class="flex gap-3 pt-4 border-t border-zinc-800">
                  <button type="button" @click="modal.modo = 'buscar'" class="flex-1 px-4 py-3 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg font-bold text-xs uppercase transition-colors">Volver</button>
                  <button type="submit" :disabled="modal.guardando" class="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-black text-xs uppercase transition-colors flex justify-center items-center">
                    <span v-if="modal.guardando" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Registrar {{ formularioCrear.jugadores.length > 1 ? 'Jugadores' : 'Jugador' }}
                  </button>
                </div>
              </form>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'intranet', middleware: 'auth' })
const route = useRoute()
const partidoId = route.params.id

// Fetch de Categorías (Seguro)
const { data: categorias } = useFetch('/api/intranet/categorias', {
  default: () => []
})

// Fetch Base del Partido (Seguro anti-caché)
const { data: partido, pending } = useFetch(`/api/intranet/partidos/${partidoId}/planilla`, {
  key: `planilla-${partidoId}`,
  getCachedData: () => undefined
})

// Variables del Roster Completo del Club
const rosterLocal = ref<any[]>([])
const rosterVisita = ref<any[]>([])

// Variables de los Jugadores "En Cancha" 
const jugadoresEnPlanillaLocal = ref<any[]>([])
const jugadoresEnPlanillaVisita = ref<any[]>([])

// Contenedor de Inputs
const statsMap = ref<Record<number, { puntos: number, triples: number, faltas: number }>>({})

const form = ref({ score_local_input: null as number | null, score_visita_input: null as number | null })
const errorMensaje = ref('')
const successMensaje = ref('')
const guardando = ref(false)

// Estado del Modal Inteligente
const modal = ref({
  abierto: false,
  modo: 'buscar' as 'buscar' | 'crear',
  tipo: 'local' as 'local' | 'visita',
  equipoId: 0,
  busqueda: '',
  guardando: false
})

const formularioCrear = ref({ 
  jugadores: [{ nombre: '', numero: '' }], 
  club_id: 0 as number, 
  categorias_ids: [] as number[] 
})

// Funciones para manipular las filas dinámicas
const agregarFilaJugador = () => {
  formularioCrear.value.jugadores.push({ nombre: '', numero: '' })
}

const removerFilaJugador = (index: number) => {
  formularioCrear.value.jugadores.splice(index, 1)
}
// ----------------------------------------------------
// 1. INICIALIZACIÓN ULTRASSEGURA
// ----------------------------------------------------
watch(() => partido.value, (newVal: any) => {
  if (newVal) {
    // 1. Extraemos los jugadores con protección anti-undefined
    rosterLocal.value = newVal.local?.jugadores ? [...newVal.local.jugadores] : []
    rosterVisita.value = newVal.visita?.jugadores ? [...newVal.visita.jugadores] : []

    // 2. Extraemos las estadísticas previas asegurando que sea un Array
    const statsPrevias = newVal.estadisticas || []

    // 3. Filtramos: Solo pasamos a la tabla a los que YA tengan historial
    jugadoresEnPlanillaLocal.value = rosterLocal.value.filter(j => statsPrevias.some((e:any) => e.jugador_id === j.id))
    jugadoresEnPlanillaVisita.value = rosterVisita.value.filter(j => statsPrevias.some((e:any) => e.jugador_id === j.id))

    // 4. Cargar score si ya existe
    if (form.value.score_local_input === null && newVal.score_local > 0) form.value.score_local_input = newVal.score_local
    if (form.value.score_visita_input === null && newVal.score_visita > 0) form.value.score_visita_input = newVal.score_visita

    // 5. Inicializar inputs
    const procesarStats = (j: any) => {
      if (!statsMap.value[j.id]) {
        const stat = statsPrevias.find((e: any) => e.jugador_id === j.id)
        statsMap.value[j.id] = { 
          puntos: stat?.puntos || 0, 
          triples: stat?.triples || 0, 
          faltas: stat?.faltas || 0 
        }
      }
    }
    
    jugadoresEnPlanillaLocal.value.forEach(procesarStats)
    jugadoresEnPlanillaVisita.value.forEach(procesarStats)
  }
}, { immediate: true })

// ----------------------------------------------------
// 2. LÓGICA DEL BUSCADOR / MODAL (Con protección de strings nulos)
// ----------------------------------------------------
const abrirBuscador = (tipo: 'local' | 'visita', equipoId: number) => {
  modal.value = { abierto: true, modo: 'buscar', tipo, equipoId, busqueda: '', guardando: false }
  
  // Reseteamos siempre con 1 fila vacía
  formularioCrear.value = { 
    jugadores: [{ nombre: '', numero: '' }], 
    club_id: equipoId, 
    categorias_ids: partido.value?.categoria_id ? [partido.value.categoria_id] : [] 
  }
}

// --- NUEVO: Detectar si el partido actual es de rama Femenina ---
const esPartidoDamas = computed(() => {
  const nombreCat = partido.value?.categoria?.nombre?.toUpperCase() || ''
  return nombreCat.includes('DAMA') || nombreCat.includes('FEM')
})

const jugadoresFiltrados = computed(() => {
  const roster = modal.value.tipo === 'local' ? rosterLocal.value : rosterVisita.value
  const activos = modal.value.tipo === 'local' ? jugadoresEnPlanillaLocal.value : jugadoresEnPlanillaVisita.value
  const idsActivos = activos.map(a => a.id)
  
  return roster.filter(j => {
    // 1. Excluir si ya está anotado en la planilla
    if (idsActivos.includes(j.id)) return false
    
    // 2. Filtro de búsqueda por texto
    if (!(j.nombre || '').toLowerCase().includes((modal.value.busqueda || '').toLowerCase())) return false

    // 3. FILTRO DE RAMA (Damas vs Varones)
    const categoriasJugador = j.categorias || []
    
    // Solo aplicamos la restricción si el jugador tiene categorías asignadas previamente
    if (categoriasJugador.length > 0) {
      const esJugadora = categoriasJugador.some((c: any) => 
        c.nombre.toUpperCase().includes('DAMA') || c.nombre.toUpperCase().includes('FEM')
      )

      // Si el partido es de damas, ocultamos a los varones
      if (esPartidoDamas.value && !esJugadora) return false
      
      // Si el partido es de varones, ocultamos a las damas
      if (!esPartidoDamas.value && esJugadora) return false
    }

    return true // Pasa todas las pruebas, se muestra en el modal
  })
})

const agregarJugador = (jugador: any) => {
  if (modal.value.tipo === 'local') {
    jugadoresEnPlanillaLocal.value.push(jugador)
  } else {
    jugadoresEnPlanillaVisita.value.push(jugador)
  }
  
  if (!statsMap.value[jugador.id]) {
    statsMap.value[jugador.id] = { puntos: 0, triples: 0, faltas: 0 }
  }
  modal.value.abierto = false
}

const removerDePlanilla = (tipo: 'local' | 'visita', id: number) => {
  if (tipo === 'local') {
    jugadoresEnPlanillaLocal.value = jugadoresEnPlanillaLocal.value.filter(j => j.id !== id)
  } else {
    jugadoresEnPlanillaVisita.value = jugadoresEnPlanillaVisita.value.filter(j => j.id !== id)
  }
}

// ----------------------------------------------------
// 3. CREACIÓN Y GUARDADO POST-PARTIDO
// ----------------------------------------------------
const guardarYAgregarJugador = async () => {
  modal.value.guardando = true
  try {
    // Si veníamos del buscador y la primera fila está vacía, le pasamos el texto buscado
    if (!formularioCrear.value.jugadores[0].nombre && modal.value.busqueda) {
      formularioCrear.value.jugadores[0].nombre = modal.value.busqueda
    }

    const jugadoresCreados = []

    // 1. Iteramos sobre la lista de jugadores y ejecutamos la creación en el backend
    for (const jugador of formularioCrear.value.jugadores) {
      if (!jugador.nombre.trim()) continue // Ignoramos filas que hayan quedado en blanco

      const payload = {
        nombre: jugador.nombre,
        numero: jugador.numero,
        club_id: formularioCrear.value.club_id,
        categorias_ids: formularioCrear.value.categorias_ids
      }

      const nuevoJugador: any = await $fetch('/api/intranet/jugadores/quick', {
        method: 'POST',
        body: payload
      })
      
      jugadoresCreados.push(nuevoJugador)
    }

    // 2. Rompemos caché y refrescamos el Roster en segundo plano
    const timestamp = Date.now()
    const datosFrescos: any = await $fetch(`/api/intranet/partidos/${partidoId}/planilla?t=${timestamp}`)
    
    if (datosFrescos) {
       rosterLocal.value = datosFrescos.local?.jugadores ? [...datosFrescos.local.jugadores] : []
       rosterVisita.value = datosFrescos.visita?.jugadores ? [...datosFrescos.visita.jugadores] : []
    }

    // 3. Inyectamos a todos los nuevos jugadores a la tabla de la planilla visualmente
    jugadoresCreados.forEach(j => agregarJugador(j))

  } catch (e: any) {
    alert(e.data?.statusMessage || 'Error al guardar los jugadores. Revisa si alguno ya existía o si hay un error de conexión.')
  } finally {
    modal.value.guardando = false
  }
}

// Sumatorias Automáticas seguras
const sumaLocal = computed(() => jugadoresEnPlanillaLocal.value.reduce((s, j) => s + Number(statsMap.value[j.id]?.puntos || 0), 0))
const sumaVisita = computed(() => jugadoresEnPlanillaVisita.value.reduce((s, j) => s + Number(statsMap.value[j.id]?.puntos || 0), 0))

// Guardado del Partido
const guardarPlanilla = async (finalizar: boolean) => {
  errorMensaje.value = ''
  successMensaje.value = ''
  guardando.value = true

  const statsLocal = jugadoresEnPlanillaLocal.value.map(j => ({ jugador_id: j.id, ...(statsMap.value[j.id] || { puntos:0, triples:0, faltas:0 }) }))
  const statsVisita = jugadoresEnPlanillaVisita.value.map(j => ({ jugador_id: j.id, ...(statsMap.value[j.id] || { puntos:0, triples:0, faltas:0 }) }))
  const estadisticasArray = [...statsLocal, ...statsVisita]

  try {
    await $fetch(`/api/intranet/partidos/${partidoId}/planilla`, {
      method: 'POST',
      body: {
        score_local_input: form.value.score_local_input,
        score_visita_input: form.value.score_visita_input,
        estadisticas: estadisticasArray,
        finalizar
      }
    })

    successMensaje.value = finalizar ? '¡Partido finalizado con éxito!' : '¡Progreso guardado!'
    if (!finalizar) setTimeout(() => successMensaje.value = '', 3000)
  } catch (e: any) {
    errorMensaje.value = e.data?.statusMessage || 'Error al guardar'
  } finally {
    guardando.value = false
  }
}
</script>