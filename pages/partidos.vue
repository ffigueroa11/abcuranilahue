<template>
  <div class="min-h-[100dvh] bg-zinc-950 pb-20">
    <!-- Header de la página -->
    <div class="bg-zinc-900 border-b border-zinc-800 pt-24 pb-12 px-4 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-blue-900/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div class="max-w-[1000px] mx-auto relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-xs font-black tracking-widest uppercase mb-4">
          <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Centro de Partidos
        </div>
        <h1 class="text-4xl md:text-5xl font-black uppercase text-zinc-100 tracking-tighter">
          Fixture y <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">Resultados</span>
        </h1>
        <p class="text-zinc-400 mt-4 font-medium max-w-lg">
          Revisa la programación completa de las próximas fechas y el historial de resultados del Campeonato 2026.
        </p>
      </div>
    </div>

    <!-- Contenedor Principal -->
    <div class="max-w-[1000px] mx-auto px-4 py-8">
      
      <!-- Navegación de Pestañas (Tabs) -->
      <div class="flex justify-center md:justify-start mb-10">
        <div class="bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl inline-flex gap-2 w-full md:w-auto shadow-inner">
          <button 
            @click="activeTab = 'proximos'"
            :class="[
              'flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider transition-all',
              activeTab === 'proximos' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
            ]"
          >
            Próximos
          </button>
          <button 
            @click="activeTab = 'resultados'"
            :class="[
              'flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider transition-all',
              activeTab === 'resultados' ? 'bg-red-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
            ]"
          >
            Finalizados
          </button>
        </div>
      </div>

      <!-- ESTADO: CARGANDO -->
      <div v-if="(activeTab === 'proximos' && pendingProximos) || (activeTab === 'resultados' && pendingResultados)" class="flex justify-center py-20">
        <div :class="['animate-spin rounded-full h-10 w-10 border-b-2', activeTab === 'proximos' ? 'border-blue-600' : 'border-red-800']"></div>
      </div>

      <!-- PESTAÑA: PRÓXIMOS PARTIDOS -->
      <div v-else-if="activeTab === 'proximos'">
        <div v-if="proximosAgrupados && proximosAgrupados.length > 0" class="space-y-12">
          
          <!-- Iteración de Grupos (Fechas) -->
          <div v-for="grupo in proximosAgrupados" :key="grupo.fechaKey" class="relative">
            
            <!-- Encabezado de la Fecha -->
            <div class="mb-5 bg-zinc-900/40 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800/80 backdrop-blur-sm shadow-md">
              <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <h3 class="text-zinc-100 font-black uppercase tracking-tight text-lg">{{ grupo.titulo }}</h3>
            </div>
            <!-- <button 
              @click="abrirFlyerInstagram(grupo, activeTab === 'resultados')"
              class="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Generar Flyer Instagram
            </button> -->

            <!-- Grilla de partidos del día -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2 sm:pl-4 border-l-2 border-zinc-800 ml-2">
              <div v-for="partido in grupo.partidos" :key="partido.id" class="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 hover:border-zinc-700 transition-colors shadow-lg relative overflow-hidden group">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-blue-900"></div>
                
                <div class="flex justify-between items-center mb-6 border-b border-zinc-800/50 pb-4">
                  <span class="text-[10px] text-blue-500 font-black tracking-widest uppercase block bg-blue-500/10 px-2 py-1 rounded">
                    {{ partido.categoria?.nombre || 'Categoría' }}
                  </span>
                  <div class="bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-md text-amber-500 font-black text-sm tracking-wider flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {{ formatHora(partido.fecha_hora) }} HRS
                  </div>
                </div>
                
                <div class="flex justify-between items-center px-2">
                  <div class="flex flex-col items-center gap-3 w-2/5">
                    <div class="w-14 h-14 bg-zinc-950 rounded-full flex items-center justify-center border border-zinc-700 shadow-inner overflow-hidden group-hover:border-blue-500/50 transition-colors">
                      <img v-if="partido.local.logo_url" :src="partido.local.logo_url" class="w-full h-full object-cover p-1.5" />
                      <span v-else class="text-lg font-black text-zinc-400">{{ partido.local.nombre.charAt(0) }}</span>
                    </div>
                    <span class="text-xs font-bold text-zinc-300 text-center uppercase tracking-wide">{{ partido.local.nombre }}</span>
                  </div>
                  <div class="w-1/5 flex flex-col items-center justify-center">
                    <span class="text-zinc-600 font-black text-lg">VS</span>
                  </div>
                  <div class="flex flex-col items-center gap-3 w-2/5">
                    <div class="w-14 h-14 bg-zinc-950 rounded-full flex items-center justify-center border border-zinc-700 shadow-inner overflow-hidden group-hover:border-blue-500/50 transition-colors">
                      <img v-if="partido.visita.logo_url" :src="partido.visita.logo_url" class="w-full h-full object-cover p-1.5" />
                      <span v-else class="text-lg font-black text-zinc-400">{{ partido.visita.nombre.charAt(0) }}</span>
                    </div>
                    <span class="text-xs font-bold text-zinc-300 text-center uppercase tracking-wide">{{ partido.visita.nombre }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
          <svg class="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <h3 class="text-zinc-300 font-bold text-lg mb-2">No hay partidos programados</h3>
          <p class="text-zinc-500 text-sm max-w-md mx-auto">Actualmente no existen encuentros pendientes en el calendario.</p>
        </div>
      </div>

      <!-- PESTAÑA: RESULTADOS (FINALIZADOS) -->
      <div v-else-if="activeTab === 'resultados'">
        <div v-if="finalizadosAgrupados && finalizadosAgrupados.length > 0" class="space-y-12">
          
          <div v-for="grupo in finalizadosAgrupados" :key="grupo.fechaKey" class="relative">
            <!-- Encabezado de la Fecha -->
            <div class="mb-5 bg-zinc-900/40 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800/80 backdrop-blur-sm shadow-md">
              <svg class="w-5 h-5 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              <h3 class="text-zinc-100 font-black uppercase tracking-tight text-lg">{{ grupo.titulo }}</h3>
            </div>

            <!-- Grilla de Resultados del día -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2 sm:pl-4 border-l-2 border-zinc-800 ml-2">
              <div 
                v-for="partido in grupo.partidos" 
                :key="partido.id" 
                @click="abrirDetallePartido(partido.id)"
                class="bg-zinc-950/50 border border-zinc-800 rounded-lg p-5 relative overflow-hidden group hover:border-amber-500/50 hover:bg-zinc-900 transition-all shadow-lg cursor-pointer"
              >
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-800 via-zinc-800 to-blue-700 opacity-50"></div>
                
                <div class="absolute top-0 right-0 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase px-3 py-1.5 rounded-bl-lg shadow-sm z-10 flex items-center gap-1.5 border-b border-l border-amber-500/20">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Ver Estadísticas
                </div>
                
                <div class="flex justify-between items-center mb-4 border-b border-zinc-800/50 pb-3">
                  <span class="text-[10px] text-zinc-400 font-black tracking-widest uppercase">
                    {{ partido.categoria?.nombre || 'Categoría' }}
                  </span>
                  <span class="text-[10px] text-zinc-500 font-bold tracking-widest uppercase flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {{ formatHora(partido.fecha_hora) }} HRS
                  </span>
                </div>
                
                <!-- Estructura responsiva de marcador -->
                <div class="flex items-center justify-between gap-2">
                  <div class="flex flex-col items-center text-center flex-1">
                    <div class="w-12 h-12 bg-zinc-800 border-2 border-red-900/60 rounded-full flex items-center justify-center overflow-hidden shadow-md mb-2 flex-shrink-0">
                      <img v-if="partido.local.logo_url" :src="partido.local.logo_url" class="w-full h-full object-cover p-0.5" />
                      <span v-else class="text-xs font-bold text-zinc-400">{{ partido.local.nombre.charAt(0) }}</span>
                    </div>
                    <span class="text-zinc-300 font-bold text-[10px] sm:text-xs uppercase w-full line-clamp-2">
                      {{ partido.local.nombre }}
                    </span>
                  </div>
                  
                  <div class="flex items-center gap-1.5 sm:gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl flex-shrink-0 shadow-inner">
                    <span class="text-xl sm:text-2xl font-black text-amber-500">{{ partido.score_local }}</span>
                    <span class="text-zinc-600 font-bold">-</span>
                    <span class="text-xl sm:text-2xl font-black text-zinc-100">{{ partido.score_visita }}</span>
                  </div>
                  
                  <div class="flex flex-col items-center text-center flex-1">
                    <div class="w-12 h-12 bg-zinc-800 border-2 border-blue-800/60 rounded-full flex items-center justify-center overflow-hidden shadow-md mb-2 flex-shrink-0">
                      <img v-if="partido.visita.logo_url" :src="partido.visita.logo_url" class="w-full h-full object-cover p-0.5" />
                      <span v-else class="text-xs font-bold text-zinc-400">{{ partido.visita.nombre.charAt(0) }}</span>
                    </div>
                    <span class="text-zinc-300 font-bold text-[10px] sm:text-xs uppercase w-full line-clamp-2">
                      {{ partido.visita.nombre }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
          <svg class="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
          <h3 class="text-zinc-300 font-bold text-lg mb-2">Sin resultados registrados</h3>
          <p class="text-zinc-500 text-sm max-w-md mx-auto">Aún no hay encuentros finalizados para mostrar en el historial.</p>
        </div>
      </div>

    </div>
  </div>

  <!-- MODAL: DETALLE DEL PARTIDO -->
  <div v-if="modalPartido.abierto" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative">
      
      <!-- Botón Cerrar -->
      <button @click="modalPartido.abierto = false" class="absolute top-4 right-4 z-10 text-zinc-400 hover:text-white bg-zinc-950/50 p-2 rounded-xl border border-zinc-800 transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <div v-if="modalPartido.pending" class="flex items-center justify-center py-32">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>

      <div v-else-if="modalPartido.data" class="flex flex-col h-full overflow-hidden">
        
        <!-- Encabezado del Marcador (Sticky) -->
        <div class="bg-zinc-950 border-b border-zinc-800 p-6 flex-shrink-0">
          <div class="text-center mb-4">
            <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-900/20 px-3 py-1 rounded-full border border-amber-500/30">
              Finalizado
            </span>
          </div>
          <div class="flex items-center justify-center gap-4 sm:gap-10">
            <div class="flex flex-col items-center flex-1">
              <img v-if="modalPartido.data.local.logo_url" :src="modalPartido.data.local.logo_url" class="w-12 h-12 sm:w-16 sm:h-16 object-contain mb-2" />
              <span class="text-zinc-100 font-black text-sm sm:text-base uppercase text-center leading-tight">{{ modalPartido.data.local.nombre }}</span>
            </div>
            <div class="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl shadow-inner">
              <span class="text-3xl sm:text-4xl font-black text-amber-500">{{ modalPartido.data.score_local }}</span>
              <span class="text-zinc-600 font-bold">-</span>
              <span class="text-3xl sm:text-4xl font-black text-white">{{ modalPartido.data.score_visita }}</span>
            </div>
            <div class="flex flex-col items-center flex-1">
              <img v-if="modalPartido.data.visita.logo_url" :src="modalPartido.data.visita.logo_url" class="w-12 h-12 sm:w-16 sm:h-16 object-contain mb-2" />
              <span class="text-zinc-100 font-black text-sm sm:text-base uppercase text-center leading-tight">{{ modalPartido.data.visita.nombre }}</span>
            </div>
          </div>
        </div>

        <!-- Cuerpo: Listas de Jugadores (Scrollable) -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-900/50">
          <div v-if="modalPartido.data.statsLocal.length === 0 && modalPartido.data.statsVisita.length === 0" class="text-center py-12">
            <p class="text-zinc-500 font-bold uppercase tracking-widest text-xs">Aún no hay desglose estadístico cargado para este partido.</p>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            <!-- Planilla Local -->
            <div>
              <h3 class="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3 flex items-center justify-between border-b border-zinc-800 pb-2">
                <span>{{ modalPartido.data.local.nombre }}</span>
                <span class="text-[9px] text-zinc-500">Puntos</span>
              </h3>
              <div class="space-y-1.5">
                <div v-for="stat in modalPartido.data.statsLocal" :key="stat.id" class="flex items-center justify-between bg-zinc-950/50 border border-zinc-800/50 px-3 py-2 rounded-lg hover:border-zinc-700 transition-colors">
                  <div class="flex items-center gap-3">
                    <span class="text-[10px] font-black text-amber-500 w-4 text-right">{{ stat.jugador.numero || '-' }}</span>
                    <span class="text-xs font-bold text-zinc-200 uppercase truncate max-w-[150px]">{{ stat.jugador.nombre }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span v-if="stat.triples > 0" class="text-[9px] font-bold text-zinc-500" title="Triples anotados">{{ stat.triples }} 3P</span>
                    <span class="text-sm font-black text-amber-500 w-6 text-right">{{ stat.puntos }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Planilla Visita -->
            <div>
              <h3 class="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3 flex items-center justify-between border-b border-zinc-800 pb-2">
                <span>{{ modalPartido.data.visita.nombre }}</span>
                <span class="text-[9px] text-zinc-500">Puntos</span>
              </h3>
              <div class="space-y-1.5">
                <div v-for="stat in modalPartido.data.statsVisita" :key="stat.id" class="flex items-center justify-between bg-zinc-950/50 border border-zinc-800/50 px-3 py-2 rounded-lg hover:border-zinc-700 transition-colors">
                  <div class="flex items-center gap-3">
                    <span class="text-[10px] font-black text-amber-500 w-4 text-right">{{ stat.jugador.numero || '-' }}</span>
                    <span class="text-xs font-bold text-zinc-200 uppercase truncate max-w-[150px]">{{ stat.jugador.nombre }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span v-if="stat.triples > 0" class="text-[9px] font-bold text-zinc-500" title="Triples anotados">{{ stat.triples }} 3P</span>
                    <span class="text-sm font-black text-white w-6 text-right">{{ stat.puntos }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>

  <ModalFlyerInstagram 
    v-model="modalFlyer.abierto"
    :grupo="modalFlyer.grupo"
    :es-resultados="modalFlyer.esResultados"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Estado para controlar la pestaña activa ('proximos' o 'resultados')
const activeTab = ref('proximos')

// Consumimos las dos APIs: Calendario (Próximos) y Últimos (Resultados)
const { data: partidosProximos, pending: pendingProximos } = useFetch('/api/partidos/calendario')
const { data: partidosFinalizados, pending: pendingResultados } = useFetch('/api/partidos/resultados')

// ==========================================
// FUNCIONES DE FORMATO BASE
// ==========================================
const formatHora = (fecha: string | Date) => {
  if (!fecha) return '';
  const fechaStr = new Date(fecha).toISOString().split('T')[1];
  return fechaStr.substring(0, 5); 
}

const formatFecha = (fecha: string | Date) => {
  if (!fecha) return '';
  const dateObj = new Date(fecha);
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return `${dias[dateObj.getUTCDay()]} ${dateObj.getUTCDate()} de ${meses[dateObj.getUTCMonth()]}`;
}

// ==========================================
// LÓGICA DE AGRUPACIÓN POR FECHA
// ==========================================
const agruparPorFecha = (partidos: any[], orden: 'asc' | 'desc') => {
  if (!partidos || partidos.length === 0) return []
  
  const gruposMap = new Map<string, any>()

  partidos.forEach((partido: any) => {
    const dateObj = new Date(partido.fecha_hora)
    // Llave única para agrupar (YYYY-MM-DD)
    const dateKey = `${dateObj.getUTCFullYear()}-${(dateObj.getUTCMonth() + 1).toString().padStart(2, '0')}-${dateObj.getUTCDate().toString().padStart(2, '0')}`

    if (!gruposMap.has(dateKey)) {
      gruposMap.set(dateKey, {
        fechaKey: dateKey,
        fechaObj: dateObj,
        titulo: formatFecha(partido.fecha_hora), // El título del grupo será la fecha formateada
        partidos: []
      })
    }
    gruposMap.get(dateKey).partidos.push(partido)
  })

  // Convertir a Arreglo y Ordenar
  const grupos = Array.from(gruposMap.values())
  grupos.sort((a, b) => {
    return orden === 'asc' 
      ? a.fechaObj.getTime() - b.fechaObj.getTime() 
      : b.fechaObj.getTime() - a.fechaObj.getTime()
  })

  return grupos
}

// Propiedades computadas para renderizar en el template
const proximosAgrupados = computed(() => agruparPorFecha(partidosProximos.value, 'asc'))
const finalizadosAgrupados = computed(() => agruparPorFecha(partidosFinalizados.value, 'desc'))

// ==========================================
// MODAL DETALLE DE PARTIDO PÚBLICO
// ==========================================
const modalPartido = ref({
  abierto: false,
  pending: false,
  data: null as any
})

const abrirDetallePartido = async (id: number) => {
  modalPartido.value.abierto = true
  modalPartido.value.pending = true
  modalPartido.value.data = null

  try {
    const data = await $fetch(`/api/partidos/${id}/detalles`)
    modalPartido.value.data = data
  } catch (error) {
    console.error('Error al cargar el detalle del partido', error)
    modalPartido.value.abierto = false
  } finally {
    modalPartido.value.pending = false
  }
}

// Estado para controlar el Modal de Instagram
const modalFlyer = ref({
  abierto: false,
  grupo: null as any,
  esResultados: false
})

const abrirFlyerInstagram = (grupo: any, esResultados: boolean = false) => {
  modalFlyer.value.grupo = grupo
  modalFlyer.value.esResultados = esResultados
  modalFlyer.value.abierto = true
}
</script>