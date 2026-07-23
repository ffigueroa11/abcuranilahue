<template>
  <div class="min-h-screen bg-zinc-950 pb-20">
    <!-- Header de la página -->
    <div class="bg-zinc-900 border-b border-zinc-800 pt-24 pb-12 px-4 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-blue-900/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div class="max-w-[1000px] mx-auto relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-600/30 bg-blue-900/10 text-blue-500 text-xs font-black tracking-widest uppercase mb-4">
          <span class="w-2 h-2 rounded-full bg-blue-500"></span> Fixture Oficial
        </div>
        <h1 class="text-4xl md:text-5xl font-black uppercase text-zinc-100 tracking-tighter">
          Próximos <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">Partidos</span>
        </h1>
        <p class="text-zinc-400 mt-4 font-medium max-w-lg">
          Revisa la programación completa de las próximas fechas del Campeonato Promesas.
        </p>
      </div>
    </div>

    <!-- Lista de Partidos -->
    <div class="max-w-[1000px] mx-auto px-4 py-12">
      <div v-if="pending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="partidos && partidos.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="partido in partidos" :key="partido.id" class="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 hover:border-zinc-700 transition-colors shadow-lg relative overflow-hidden group">
          <!-- Decoración lateral según estado -->
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-blue-900"></div>
          
          <div class="flex justify-between items-start mb-6 border-b border-zinc-800/50 pb-4">
            <div>
              <span class="text-[10px] text-blue-500 font-black tracking-widest uppercase block mb-1">
                {{ partido.categoria.nombre }}
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
            <!-- Equipo Local -->
            <div class="flex flex-col items-center gap-3 w-2/5">
              <div class="w-14 h-14 bg-zinc-950 rounded-full flex items-center justify-center border border-zinc-700 shadow-inner overflow-hidden group-hover:border-blue-500/50 transition-colors">
                <img v-if="partido.local.logo_url" :src="partido.local.logo_url" :alt="partido.local.nombre" class="w-full h-full object-cover p-1.5" />
                <span v-else class="text-lg font-black text-zinc-400">{{ partido.local.nombre.charAt(0) }}</span>
              </div>
              <span class="text-xs font-bold text-zinc-300 text-center uppercase tracking-wide">{{ partido.local.nombre }}</span>
            </div>
            
            <div class="w-1/5 flex flex-col items-center justify-center">
              <span class="text-zinc-600 font-black text-lg">VS</span>
            </div>
            
            <!-- Equipo Visita -->
            <div class="flex flex-col items-center gap-3 w-2/5">
              <div class="w-14 h-14 bg-zinc-950 rounded-full flex items-center justify-center border border-zinc-700 shadow-inner overflow-hidden group-hover:border-blue-500/50 transition-colors">
                <img v-if="partido.visita.logo_url" :src="partido.visita.logo_url" :alt="partido.visita.nombre" class="w-full h-full object-cover p-1.5" />
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
        <p class="text-zinc-500 text-sm max-w-md mx-auto">Actualmente no existen encuentros pendientes en el calendario. Vuelve más tarde cuando la asociación publique la próxima fecha.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Consumimos la nueva API de calendario
const { data: partidos, pending } = useFetch('/api/partidos/calendario')

// Función para extraer la hora exacta sin conversiones
const formatHora = (fecha: string | Date) => {
  // Si viene como '2026-07-24T19:00:00' toma solo la parte de la hora
  const fechaStr = new Date(fecha).toISOString().split('T')[1];
  return fechaStr.substring(0, 5); // Retorna "19:00"
}

// Función para extraer la fecha exacta sin conversiones
const formatFecha = (fecha: string | Date) => {
  const dateObj = new Date(fecha);
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  // getUTC methods evitan que el navegador aplique su propia zona horaria local
  return `${dias[dateObj.getUTCDay()]} ${dateObj.getUTCDate()} de ${meses[dateObj.getUTCMonth()]}`;
}
</script>