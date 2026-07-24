<template>
  <div class="min-h-screen bg-zinc-950 pb-20">
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
        <div v-if="partidosProximos && partidosProximos.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="partido in partidosProximos" :key="partido.id" class="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 hover:border-zinc-700 transition-colors shadow-lg relative overflow-hidden group">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-blue-900"></div>
            
            <div class="flex justify-between items-start mb-6 border-b border-zinc-800/50 pb-4">
              <div>
                <span class="text-[10px] text-blue-500 font-black tracking-widest uppercase block mb-1">
                  {{ partido.categoria?.nombre || 'Categoría' }}
                </span>
                <span class="text-zinc-300 font-bold text-sm">
                  {{ formatFecha(partido.fecha_hora) }}
                </span>
              </div>
              <div class="bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-md text-amber-500 font-black text-sm tracking-wider">
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
        <div v-else class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
          <svg class="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <h3 class="text-zinc-300 font-bold text-lg mb-2">No hay partidos programados</h3>
          <p class="text-zinc-500 text-sm max-w-md mx-auto">Actualmente no existen encuentros pendientes en el calendario.</p>
        </div>
      </div>

      <!-- PESTAÑA: RESULTADOS (FINALIZADOS) -->
      <div v-else-if="activeTab === 'resultados'">
        <div v-if="partidosFinalizados && partidosFinalizados.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="partido in partidosFinalizados" :key="partido.id" class="bg-zinc-950/50 border border-zinc-800 rounded-lg p-5 relative overflow-hidden group hover:border-zinc-700 transition-colors shadow-lg">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-800 via-zinc-800 to-blue-700 opacity-50"></div>
            
            <div class="flex justify-between items-center mb-4 border-b border-zinc-800/50 pb-3">
              <span class="text-[10px] text-zinc-400 font-black tracking-widest uppercase">
                {{ partido.categoria?.nombre || 'Categoría' }}
              </span>
              <span class="text-[10px] text-zinc-500 font-bold tracking-widest uppercase bg-zinc-900 px-2 py-1 rounded">
                {{ formatFechaCorta(partido.fecha_hora) }}
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
        
        <div v-else class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
          <svg class="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
          <h3 class="text-zinc-300 font-bold text-lg mb-2">Sin resultados registrados</h3>
          <p class="text-zinc-500 text-sm max-w-md mx-auto">Aún no hay encuentros finalizados para mostrar en el historial.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Estado para controlar la pestaña activa ('proximos' o 'resultados')
const activeTab = ref('proximos')

// Consumimos las dos APIs: Calendario (Próximos) y Últimos (Resultados)
const { data: partidosProximos, pending: pendingProximos } = useFetch('/api/partidos/calendario')
const { data: partidosFinalizados, pending: pendingResultados } = useFetch('/api/partidos/resultados')

// Función para extraer la hora exacta
const formatHora = (fecha: string | Date) => {
  if (!fecha) return '';
  const fechaStr = new Date(fecha).toISOString().split('T')[1];
  return fechaStr.substring(0, 5); 
}

// Función para extraer la fecha completa (Para próximos partidos)
const formatFecha = (fecha: string | Date) => {
  if (!fecha) return '';
  const dateObj = new Date(fecha);
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return `${dias[dateObj.getUTCDay()]} ${dateObj.getUTCDate()} de ${meses[dateObj.getUTCMonth()]}`;
}

// Función para formato de fecha corta (Para resultados)
const formatFechaCorta = (fecha: string | Date) => {
  if (!fecha) return '';
  const dateObj = new Date(fecha);
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${dateObj.getUTCDate()} ${meses[dateObj.getUTCMonth()]}, ${dateObj.getUTCFullYear()}`;
}
</script>