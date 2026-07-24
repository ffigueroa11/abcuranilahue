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
      <!-- Encabezado del Partido y Marcadores Globales Opcionales -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
        <div class="text-center mb-6">
          <span class="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1 rounded uppercase tracking-widest">
            {{ partido.categoria.nombre }} — Jornada {{ partido.jornada }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <!-- Local Info -->
          <div class="flex flex-col items-center md:items-end text-center md:text-right gap-2">
            <h2 class="text-xl font-black text-white uppercase">{{ partido.local.nombre }}</h2>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-zinc-500 uppercase">Score Global (Opcional):</span>
              <input 
                v-model.number="form.score_local_input" 
                type="number" 
                placeholder="Auto" 
                class="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center font-black text-amber-500 text-lg focus:outline-none focus:border-amber-500"
              />
            </div>
            <span class="text-xs text-zinc-400">Suma del detalle: <strong class="text-white">{{ sumaLocal }} pts</strong></span>
          </div>

          <!-- VS Central y Botones de Acción -->
          <div class="flex flex-col items-center justify-center gap-3">
            <span class="text-zinc-600 font-black italic text-2xl">VS</span>
            
            <div class="flex flex-col sm:flex-row gap-2 w-full">
              <!-- Botón Guardar Progreso Parcial -->
              <button 
                @click="guardarPlanilla(false)" 
                :disabled="guardando"
                class="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-zinc-700"
              >
                Guardar Progreso
              </button>

              <!-- Botón Finalizar Partido (Con validación) -->
              <button 
                @click="guardarPlanilla(true)" 
                :disabled="guardando"
                class="flex-1 bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Finalizar Partido
              </button>
            </div>
          </div>

          <!-- Visita Info -->
          <div class="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <h2 class="text-xl font-black text-white uppercase">{{ partido.visita.nombre }}</h2>
            <div class="flex items-center gap-2">
              <input 
                v-model.number="form.score_visita_input" 
                type="number" 
                placeholder="Auto" 
                class="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center font-black text-amber-500 text-lg focus:outline-none focus:border-amber-500"
              />
              <span class="text-xs font-bold text-zinc-500 uppercase">Score Global (Opcional):</span>
            </div>
            <span class="text-xs text-zinc-400">Suma del detalle: <strong class="text-white">{{ sumaVisita }} pts</strong></span>
          </div>
        </div>

        <div v-if="errorMensaje" class="mt-6 bg-red-950/50 border border-red-900 text-red-400 text-xs font-bold p-3 rounded-lg text-center">
          {{ errorMensaje }}
        </div>
        <div v-if="successMensaje" class="mt-6 bg-green-950/50 border border-green-900 text-green-400 text-xs font-bold p-3 rounded-lg text-center">
          {{ successMensaje }}
        </div>
      </div>

      <!-- Tablas de Jugadores (Local y Visita) -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        <!-- Tabla Local -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
          <div class="bg-zinc-950/80 px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
            <h3 class="font-black text-white uppercase text-sm tracking-wider">Plantilla {{ partido.local.nombre }}</h3>
            <span class="text-xs font-bold text-zinc-500 uppercase">Total: {{ sumaLocal }} Pts</span>
          </div>
          
          <div class="overflow-x-auto flex-1">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 font-black bg-zinc-950/30">
                  <th class="px-4 py-3 w-16 text-center">Nº</th>
                  <th class="px-4 py-3">Jugador</th>
                  <th class="px-4 py-3 w-24 text-center">Puntos</th>
                  <th class="px-4 py-3 w-24 text-center">Triples</th>
                  <th class="px-4 py-3 w-24 text-center">Faltas</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="jugador in partido.local.jugadores" :key="jugador.id" class="border-b border-zinc-800/40 hover:bg-zinc-800/20">
                  <td class="px-4 py-3 text-center font-bold text-amber-500 text-sm">
                    {{ jugador.numero || '--' }}
                  </td>
                  <td class="px-4 py-3 font-bold text-zinc-200 uppercase text-xs">
                    {{ jugador.nombre }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <input v-model.number="getStat(jugador.id).puntos" type="number" min="0" class="w-16 bg-zinc-950 border border-zinc-800 rounded text-center py-1 font-bold text-white text-sm focus:border-amber-500 focus:outline-none" />
                  </td>
                  <td class="px-4 py-3 text-center">
                    <input v-model.number="getStat(jugador.id).triples" type="number" min="0" class="w-16 bg-zinc-950 border border-zinc-800 rounded text-center py-1 font-bold text-white text-sm focus:border-amber-500 focus:outline-none" />
                  </td>
                  <td class="px-4 py-3 text-center">
                    <input v-model.number="getStat(jugador.id).faltas" type="number" min="0" max="5" class="w-16 bg-zinc-950 border border-zinc-800 rounded text-center py-1 font-bold text-white text-sm focus:border-amber-500 focus:outline-none" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tabla Visita -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
          <div class="bg-zinc-950/80 px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
            <h3 class="font-black text-white uppercase text-sm tracking-wider">Plantilla {{ partido.visita.nombre }}</h3>
            <span class="text-xs font-bold text-zinc-500 uppercase">Total: {{ sumaVisita }} Pts</span>
          </div>
          
          <div class="overflow-x-auto flex-1">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 font-black bg-zinc-950/30">
                  <th class="px-4 py-3 w-16 text-center">Nº</th>
                  <th class="px-4 py-3">Jugador</th>
                  <th class="px-4 py-3 w-24 text-center">Puntos</th>
                  <th class="px-4 py-3 w-24 text-center">Triples</th>
                  <th class="px-4 py-3 w-24 text-center">Faltas</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="jugador in partido.visita.jugadores" :key="jugador.id" class="border-b border-zinc-800/40 hover:bg-zinc-800/20">
                  <td class="px-4 py-3 text-center font-bold text-amber-500 text-sm">
                    {{ jugador.numero || '--' }}
                  </td>
                  <td class="px-4 py-3 font-bold text-zinc-200 uppercase text-xs">
                    {{ jugador.nombre }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <input v-model.number="getStat(jugador.id).puntos" type="number" min="0" class="w-16 bg-zinc-950 border border-zinc-800 rounded text-center py-1 font-bold text-white text-sm focus:border-amber-500 focus:outline-none" />
                  </td>
                  <td class="px-4 py-3 text-center">
                    <input v-model.number="getStat(jugador.id).triples" type="number" min="0" class="w-16 bg-zinc-950 border border-zinc-800 rounded text-center py-1 font-bold text-white text-sm focus:border-amber-500 focus:outline-none" />
                  </td>
                  <td class="px-4 py-3 text-center">
                    <input v-model.number="getStat(jugador.id).faltas" type="number" min="0" max="5" class="w-16 bg-zinc-950 border border-zinc-800 rounded text-center py-1 font-bold text-white text-sm focus:border-amber-500 focus:outline-none" />
                  </td>
                </tr>
              </tbody>
            </table>
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

const { data: partido, pending, refresh } = useFetch(`/api/intranet/partidos/${partidoId}/planilla`, {
  key: `planilla-${partidoId}`,
  getCachedData: () => undefined // Esto le indica a Nuxt que no use caché y consulte siempre la BD
})

// Formulario global y contenedor de estadísticas por jugador
const form = ref({
  score_local_input: null as number | null,
  score_visita_input: null as number | null,
})

const errorMensaje = ref('')
const successMensaje = ref('')
const guardando = ref(false)

// Diccionario reactivo para almacenar las stats de cada jugador mapeadas por su ID
const statsMap = ref<Record<number, { puntos: number, triples: number, faltas: number }>>({})

// Función auxiliar para inicializar o recuperar las stats de un jugador
const getStat = (jugadorId: number) => {
  if (!statsMap.value[jugadorId]) {
    // Buscamos si ya existen estadísticas guardadas previamente en la BD
    const existente = partido.value?.estadisticas.find((e: any) => e.jugador_id === jugadorId)
    statsMap.value[jugadorId] = {
      puntos: existente ? existente.puntos : 0,
      triples: existente ? existente.triples : 0,
      faltas: existente ? existente.faltas : 0
    }
  }
  return statsMap.value[jugadorId]
}

// Si el partido ya tenía scores previos guardados, los precargamos en el input opcional
watchEffect(() => {
  if (partido.value) {
    if (form.value.score_local_input === null && partido.value.score_local > 0) {
      form.value.score_local_input = partido.value.score_local
    }
    if (form.value.score_visita_input === null && partido.value.score_visita > 0) {
      form.value.score_visita_input = partido.value.score_visita
    }
  }
})

// Sumatorias en tiempo real basadas en los inputs de los jugadores
const sumaLocal = computed(() => {
  if (!partido.value) return 0
  let suma = 0
  for (const j of partido.value.local.jugadores) {
    suma += Number(statsMap.value[j.id]?.puntos || 0)
  }
  return suma
})

const sumaVisita = computed(() => {
  if (!partido.value) return 0
  let suma = 0
  for (const j of partido.value.visita.jugadores) {
    suma += Number(statsMap.value[j.id]?.puntos || 0)
  }
  return suma
})

// Enviar datos al backend
const guardarPlanilla = async (finalizar: boolean) => {
  errorMensaje.value = ''
  successMensaje.value = ''
  guardando.value = true

  const estadisticasArray = Object.keys(statsMap.value).map(jugadorId => ({
    jugador_id: Number(jugadorId),
    ...statsMap.value[Number(jugadorId)]
  }))

  try {
    await $fetch(`/api/intranet/partidos/${partidoId}/planilla`, {
      method: 'POST',
      body: {
        score_local_input: form.value.score_local_input,
        score_visita_input: form.value.score_visita_input,
        estadisticas: estadisticasArray,
        finalizar // <--- Enviamos la bandera al backend
      }
    })

    if (finalizar) {
      successMensaje.value = '¡Partido finalizado y guardado con éxito!'
      
    } else {
      successMensaje.value = '¡Progreso guardado correctamente!'
      setTimeout(() => successMensaje.value = '', 3000)
    }

  } catch (e: any) {
    errorMensaje.value = e.data?.statusMessage || 'Error al guardar la planilla'
  } finally {
    guardando.value = false
  }
}
</script>