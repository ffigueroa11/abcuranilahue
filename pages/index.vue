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

          <!-- REEMPLAZA DESDE AQUÍ EL BUCLE DE RESULTADOS -->
          <div v-else-if="ultimosPartidos && ultimosPartidos.length > 0" class="space-y-4">
            <div v-for="partido in ultimosPartidos" :key="partido.id" class="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4 sm:p-5 relative overflow-hidden group hover:border-zinc-700 transition-colors">
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-800 via-zinc-800 to-blue-700 opacity-50"></div>
              
              <div class="text-[10px] text-zinc-500 font-black tracking-widest text-center uppercase mb-3">
                Finalizado • {{ formatFechaCorta(partido.fecha_hora) }}
              </div>
              
              <!-- Estructura con nombre bajo el ícono y marcador al centro -->
              <div class="flex items-center justify-between gap-2">
                
                <!-- Equipo Local (Icono arriba, nombre abajo) -->
                <div class="flex flex-col items-center text-center flex-1">
                  <div class="w-12 h-12 bg-zinc-800 border-2 border-red-900/60 rounded-full flex items-center justify-center overflow-hidden shadow-md mb-1.5 flex-shrink-0">
                    <img v-if="partido.local.logo_url" :src="partido.local.logo_url" class="w-full h-full object-cover p-0.5" />
                    <span v-else class="text-xs font-bold text-zinc-400">{{ partido.local.nombre.charAt(0) }}</span>
                  </div>
                  <span class="text-zinc-300 font-bold text-[11px] sm:text-xs uppercase truncate w-full max-w-[110px]">
                    {{ partido.local.nombre }}
                  </span>
                </div>
                
                <!-- Marcador Central Estilo Tablero -->
                <div class="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl flex-shrink-0 shadow-inner">
                  <span class="text-lg sm:text-xl font-black text-amber-500">
                    {{ partido.score_local }}
                  </span>
                  <span class="text-zinc-600 font-bold">-</span>
                  <span class="text-lg sm:text-xl font-black text-zinc-100">
                    {{ partido.score_visita }}
                  </span>
                </div>
                
                <!-- Equipo Visitante (Icono arriba, nombre abajo) -->
                <div class="flex flex-col items-center text-center flex-1">
                  <div class="w-12 h-12 bg-zinc-800 border-2 border-blue-800/60 rounded-full flex items-center justify-center overflow-hidden shadow-md mb-1.5 flex-shrink-0">
                    <img v-if="partido.visita.logo_url" :src="partido.visita.logo_url" class="w-full h-full object-cover p-0.5" />
                    <span v-else class="text-xs font-bold text-zinc-400">{{ partido.visita.nombre.charAt(0) }}</span>
                  </div>
                  <span class="text-zinc-300 font-bold text-[11px] sm:text-xs uppercase truncate w-full max-w-[110px]">
                    {{ partido.visita.nombre }}
                  </span>
                </div>

              </div>
            </div>
          </div>
          <!-- HASTA AQUÍ -->

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
                <span class="text-amber-500">{{ formatHora(partido.fecha_hora) }} HRS</span>
                <span class="text-zinc-600">{{ formatFecha(partido.fecha_hora) }}</span>
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

    <!-- Sección de Últimos Videos / Transmisiones -->
    <section class="max-w-[1400px] mx-auto px-4 py-16 border-t border-zinc-900">
      <div class="flex justify-between items-end mb-8">
        <div>
          <span class="text-[10px] text-red-500 font-black tracking-widest uppercase block mb-1">Streaming & Multimedia</span>
          <h2 class="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-100 flex items-center gap-2">
            <span class="w-2 h-6 bg-red-800 rounded-sm"></span>
            Partidos y Reseñas en Video
          </h2>
        </div>
        <NuxtLink to="/transmisiones" class="text-xs font-black uppercase tracking-wider text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1">
          Ver todos los videos &rarr;
        </NuxtLink>
      </div>

      <!-- Grilla de 3 Videos -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="video in videosHome" 
          :key="video.id" 
          class="bg-zinc-950 border border-zinc-800/80 rounded-xl overflow-hidden hover:border-zinc-700 transition-all shadow-lg flex flex-col group"
        >
          <!-- Reproductor Mini de YouTube -->
          <div class="relative w-full bg-black" style="padding-top: 56.25%;">
            <iframe 
              class="absolute top-0 left-0 w-full h-full" 
              :src="`https://www.youtube.com/embed/${video.youtubeId}?rel=0`" 
              frameborder="0" 
              allowfullscreen
            ></iframe>
          </div>

          <!-- Información del video -->
          <div class="p-5 flex flex-col justify-between flex-grow">
            <div>
              <span class="text-[10px] text-amber-500 font-black tracking-widest uppercase block mb-1">
                {{ video.categoria }}
              </span>
              <h3 class="text-zinc-100 font-bold text-sm sm:text-base leading-snug group-hover:text-amber-400 transition-colors">
                {{ video.titulo }}
              </h3>
            </div>
            <div class="mt-4 pt-4 border-t border-zinc-900 flex justify-between items-center text-xs text-zinc-500 font-medium">
              <span>{{ video.fecha }}</span>
              <span class="text-zinc-400 font-bold">YouTube</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 1. Cargar Clubes y Partido en Vivo (No bloqueantes)
const { data: clubes, pending: pendingClubes } = useFetch('/api/clubes')
const { data: partidoEnVivo } = useFetch('/api/partidos/en-vivo')

// 2. Cargar Categorías (Usamos await para que la página espere a tener la lista antes de dibujarse)
const { data: categorias } = await useFetch('/api/categorias')

// 3. Inicializamos el ID seleccionado directamente (Adiós al watch)
const categoriaDefault = categorias.value?.find(c => c.nombre.toUpperCase() === 'TODO COMPETIDOR')
const selectedCategoriaId = ref<number | null>(categoriaDefault ? categoriaDefault.id : (categorias.value?.[0]?.id || null))

// 4. Cargas Reactivas (Nuxt 3 detecta automáticamente si selectedCategoriaId cambia y vuelve a llamar a la API)
const { data: posiciones, pending: pendingPos } = useFetch('/api/posiciones', {
  query: { categoriaId: selectedCategoriaId }
})

const { data: proximosPartidos, pending: pendingPartidos } = useFetch('/api/partidos/proximos', {
  query: { categoriaId: selectedCategoriaId }
})

const { data: ultimosPartidos, pending: pendingUltimos } = useFetch('/api/partidos/ultimos', {
  query: { categoriaId: selectedCategoriaId }
})

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

// Función para formato de fecha corta, consistente en SSR y cliente
const formatFechaCorta = (fecha: string | Date) => {
  const dateObj = new Date(fecha);
  // Nombres de meses cortos en español para consistencia
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  // Usar métodos UTC para evitar inconsistencias de zona horaria
  return `${dateObj.getUTCDate()} ${meses[dateObj.getUTCMonth()]}, ${dateObj.getUTCFullYear()}`;
}

// Lista de los 3 videos destacados para la página principal
const videosHome = ref([
  {
    id: 1,
    titulo: 'HUILLINES versus COLICO SUR',
    categoria: 'Categoría Senior',
    fecha: '17 de Julio, 2026',
    youtubeId: 'yLrsLY7rSHI' // Reemplaza con el ID del video de YouTube
  },
  {
    id: 2,
    titulo: 'C.D. NAVIDAD versus HUILLINES',
    categoria: 'Categoría Todo Competidor',
    fecha: '11 de Julio, 2026',
    youtubeId: 'HYpdnOggD8U' // Reemplaza con el ID del video de YouTube
  },
  {
    id: 3,
    titulo: 'SAN PATRICIO versus C.D. NAVIDAD',
    categoria: 'Categoría Senior',
    fecha: '17 de Julio, 2026',
    youtubeId: 'LyKNFcFESpg' // Reemplaza con el ID del video de YouTube
  }
])
</script>