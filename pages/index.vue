<template>
  <div>
    <!-- Hero Section -->
    <section class="relative max-w-[1400px] mx-auto px-4 py-20 lg:py-22 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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

    <section class="max-w-[1400px] mx-auto px-2 py-4">
    <!-- Banner Próxima Fecha -->
      <div v-if="calendarioGeneral && calendarioGeneral.length > 0" class="max-w-[1200px] mx-auto mb-12">
        <div class="bg-gradient-to-r from-blue-900/80 via-blue-800/80 to-blue-700/80 backdrop-blur-lg border border-blue-600/50 rounded-2xl p-8 shadow-[0_10px_40px_rgba(29,78,216,0.3)]">
          <div class="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div class="flex items-center gap-4">
              <div class="hidden md:block bg-blue-500/20 p-3 rounded-full border-2 border-blue-500/50">
                <svg class="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <h3 class="text-xl font-black uppercase text-white tracking-wider">¡Hay Partidos Programados!</h3>
                <p class="text-blue-200 font-medium">La próxima fecha del campeonato ya está disponible. Revisa el fixture completo.</p>
              </div>
            </div>
            <NuxtLink 
              to="/partidos" 
              class="bg-white text-blue-900 font-black text-sm uppercase px-8 py-3 rounded-lg shadow-lg hover:bg-blue-100 transition-all transform hover:scale-105 flex-shrink-0"
            >
              Ver Fixture
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Match Center Dinámico -->
    <section class="max-w-[1400px] mx-auto px-4 py-8">
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

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Tabla de Posiciones Dinámica -->
        <div class="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 shadow-xl backdrop-blur-sm col-span-1 lg:col-span-1 overflow-hidden flex flex-col">
          <!-- Encabezado con leyenda para móviles -->
          <div class="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 gap-2">
            <h2 class="text-lg font-black uppercase tracking-tight flex items-baseline gap-2">
              <span class="w-2 h-6 bg-amber-600 rounded-sm"></span>
              <span>Posiciones</span>
              <span v-if="selectedCategoriaNombre" class="text-xs text-zinc-500 font-medium normal-case">
                {{ selectedCategoriaNombre }}
              </span>
            </h2>
            
            <!-- Mensaje visible SOLO en móviles -->
            <span class="text-[9px] text-amber-500/80 uppercase tracking-widest flex items-center gap-1 sm:hidden">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/></svg>
              Toca un equipo para ver historial
            </span>
          </div>
          
          <div v-if="pendingPos" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
          </div>

          <div v-else-if="posiciones && posiciones.length > 0" class="overflow-x-auto scrollbar-hide -mx-2 px-2">
            <table class="w-full text-sm">
              <thead class="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                <tr>
                  <th class="text-left font-black pb-3 w-6 sm:w-8">POS</th>
                  <th class="text-left font-black pb-3">EQUIPO</th>
                  <th class="text-center font-black pb-3 w-6 sm:w-8">PJ</th>
                  <th class="text-center font-black pb-3 w-8 hidden sm:table-cell">PG</th>
                  <th class="text-center font-black pb-3 w-8 hidden sm:table-cell">PP</th>
                  <th class="text-center font-black pb-3 w-10">DIF</th>
                  <th class="text-center font-black pb-3 text-amber-500 w-8 sm:w-10">PTS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-800/50">
                <tr 
                  v-for="(pos, index) in posiciones" 
                  :key="pos.id" 
                  @click="abrirDetalleEquipo(pos.club.id, pos.club.nombre)"
                  class="hover:bg-amber-900/20 active:bg-amber-900/40 transition-colors group cursor-pointer"
                  title="Haz clic para ver los partidos jugados"
                >
                  <td :class="['py-2 sm:py-3 font-black text-xs sm:text-sm', index === 0 ? 'text-amber-500' : 'text-zinc-500']">{{ index + 1 }}</td>
                  
                  <!-- Columna de Equipo Modificada -->
                  <td class="py-2 sm:py-3 font-bold flex items-center gap-2 pr-2 sm:pr-4">
                    <div class="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden border border-zinc-700 flex-shrink-0 group-hover:border-amber-500 transition-colors">
                       <img v-if="pos.club.logo_url" :src="pos.club.logo_url" class="w-full h-full object-cover p-0.5" />
                       <span v-else class="text-[9px] text-zinc-400">{{ pos.club.nombre.charAt(0) }}</span>
                    </div> 
                    
                    <span :class="['truncate text-xs sm:text-sm transition-colors', index === 0 ? 'text-zinc-200' : 'text-zinc-300', 'group-hover:text-amber-400']" style="max-width: 120px;">
                      {{ pos.club.nombre }}
                    </span>
                    
                    <!-- Ícono Chevron (Flecha) visible SOLO en móviles -->
                    <svg class="w-3 h-3 text-zinc-600 sm:hidden flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </td>

                  <td class="py-2 sm:py-3 text-center text-zinc-400 text-xs">{{ pos.pj }}</td>
                  
                  <td class="py-2 sm:py-3 text-center text-zinc-400 text-xs hidden sm:table-cell">{{ pos.pg }}</td>
                  <td class="py-2 sm:py-3 text-center text-zinc-400 text-xs hidden sm:table-cell">{{ pos.pp }}</td>
                  <td :class="['py-2 sm:py-3 text-center text-xs font-medium', pos.dif > 0 ? 'text-green-500/80' : (pos.dif < 0 ? 'text-red-500/80' : 'text-zinc-500')]">
                    {{ pos.dif > 0 ? '+' + pos.dif : pos.dif }}
                  </td>
                  
                  <td :class="['py-2 sm:py-3 text-center font-black text-xs sm:text-sm', index === 0 ? 'text-zinc-100' : 'text-zinc-300']">{{ pos.puntos }}</td>
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
          <h2 class="text-lg font-black uppercase mb-6 tracking-tight flex items-baseline gap-2">
            <span class="w-2 h-6 bg-red-800 rounded-sm"></span>
            <span>Resultados</span>
            <span v-if="selectedCategoriaNombre" class="text-xs text-zinc-500 font-medium normal-case">
              {{ selectedCategoriaNombre }}
            </span>
          </h2>

          <div v-if="pendingUltimos" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-red-800"></div>
          </div>

          <div v-else-if="ultimosPartidos && ultimosPartidos.length > 0" class="space-y-4">
            <div v-for="partido in ultimosPartidos" @click="abrirDetallePartido(partido.id)" :key="partido.id" class="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/50 hover:bg-zinc-900 transition-all cursor-pointer">
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-800 via-zinc-800 to-blue-700 opacity-50"></div>
              <div class="absolute top-0 right-0 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase px-3 py-1.5 rounded-bl-lg shadow-sm z-10 flex items-center gap-1.5 border-b border-l border-amber-500/20">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Ver Estadísticas
            </div>
              <div class="text-[10px] text-zinc-500 font-black tracking-widest text-center uppercase mb-3">
                Finalizado • {{ formatFechaCorta(partido.fecha_hora) }}
              </div>
              
              <div class="flex items-center justify-between gap-2">
                
                <!-- Equipo Local -->
                <div class="flex flex-col items-center text-center flex-1">
                  <div class="w-12 h-12 bg-zinc-800 border-2 border-red-900/60 rounded-full flex items-center justify-center overflow-hidden shadow-md mb-1.5 flex-shrink-0">
                    <img v-if="partido.local.logo_url" :src="partido.local.logo_url" class="w-full h-full object-cover p-0.5" />
                    <span v-else class="text-xs font-bold text-zinc-400">{{ partido.local.nombre.charAt(0) }}</span>
                  </div>
                  <span class="text-zinc-300 font-bold text-[10px] sm:text-xs uppercase truncate w-full max-w-[100px] sm:max-w-[130px]">
                    {{ partido.local.nombre }}
                  </span>
                </div>
                
                <!-- Marcador Central Estilo Tablero -->
                <div class="flex items-center gap-1.5 sm:gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl flex-shrink-0 shadow-inner">
                  <span class="text-base sm:text-xl font-black text-amber-500">
                    {{ partido.score_local }}
                  </span>
                  <span class="text-zinc-600 font-bold">-</span>
                  <span class="text-base sm:text-xl font-black text-zinc-100">
                    {{ partido.score_visita }}
                  </span>
                </div>
                
                <!-- Equipo Visitante -->
                <div class="flex flex-col items-center text-center flex-1">
                  <div class="w-12 h-12 bg-zinc-800 border-2 border-blue-800/60 rounded-full flex items-center justify-center overflow-hidden shadow-md mb-1.5 flex-shrink-0">
                    <img v-if="partido.visita.logo_url" :src="partido.visita.logo_url" class="w-full h-full object-cover p-0.5" />
                    <span v-else class="text-xs font-bold text-zinc-400">{{ partido.visita.nombre.charAt(0) }}</span>
                  </div>
                  <span class="text-zinc-300 font-bold text-[10px] sm:text-xs uppercase truncate w-full max-w-[100px] sm:max-w-[130px]">
                    {{ partido.visita.nombre }}
                  </span>
                </div>

              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-zinc-600 text-xs font-bold uppercase tracking-widest">
            Sin resultados aún
          </div>
        </div>

        <!-- Próximos Partidos -->
        <div class="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 shadow-xl backdrop-blur-sm">
          <h2 class="text-lg font-black uppercase mb-6 tracking-tight flex items-baseline gap-2">
            <span class="w-2 h-6 bg-blue-700 rounded-sm"></span>
            <span>Próxima Fecha</span>
            <span v-if="selectedCategoriaNombre" class="text-xs text-zinc-500 font-medium normal-case">
              {{ selectedCategoriaNombre }}
            </span>
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

    <!-- SECCIÓN NUEVA: PREVIEW DE RANKING -->
    <section class="max-w-[1400px] mx-auto px-4 py-16 border-t border-zinc-900 relative overflow-hidden">
      <!-- Decoración de fondo -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-900/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div class="relative z-10">
        <!-- Encabezado de Sección -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-600/30 bg-amber-900/10 text-amber-500 text-xs font-black tracking-widest uppercase mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Rendimiento Individual
            </div>
            <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">Líderes de la Temporada</h2>
          </div>

          <!-- Selector de Categoría (Versión Mini) -->
          <div class="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
            <span class="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-3">Serie:</span>
            <select 
              v-model="categoriaRanking" 
              class="bg-zinc-950 text-amber-500 text-xs font-black uppercase tracking-wider px-3 py-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-amber-500"
            >
              <option v-for="cat in rankingPreview?.categorias" :key="cat.id" :value="cat.id">
                {{ cat.nombre }}
              </option>
            </select>
          </div>
        </div>

        <!-- Cargador -->
        <div v-if="pendingRanking" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
        </div>

        <!-- Grid de Top 5 -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Columna: Top Anotadores -->
          <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
            <div class="mb-5">
              <h3 class="text-white font-black uppercase tracking-wider flex items-center gap-2 mb-1">
                <svg class="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                Top 5 Goleadores
              </h3>
              <p class="text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/></svg>
                Haz clic en un jugador para ver su detalle por equipo
              </p>
            </div>
            
            <div v-if="rankingPreview?.goleadores && rankingPreview.goleadores.length > 0" class="flex flex-col gap-3">
              <button 
                v-for="(item, index) in rankingPreview.goleadores.slice(0, 5)" 
                :key="'gol-'+item.jugadorId"
                @click="abrirDetalleJugador(item, 'puntos')"
                class="w-full flex items-center justify-between bg-zinc-950/50 border border-zinc-800/50 p-3 rounded-xl hover:border-amber-500/50 hover:bg-zinc-900 transition-all text-left group cursor-pointer"
              >
                <div class="flex items-center gap-4">
                  <span class="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black shrink-0" :class="index === 0 ? 'bg-amber-500 text-zinc-900' : index === 1 ? 'bg-zinc-300 text-zinc-900' : index === 2 ? 'bg-amber-700 text-white' : 'bg-zinc-900 text-zinc-500'">
                    {{ index + 1 }}
                  </span>
                  <div>
                    <p class="text-zinc-100 font-bold text-sm uppercase group-hover:text-amber-500 transition-colors">{{ item.nombre }}</p>
                    <p class="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{{ item.clubNombre }}</p>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <span class="block text-xl font-black text-amber-500">{{ item.puntos }}</span>
                  <span class="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Puntos</span>
                </div>
              </button>
            </div>
            <div v-else class="text-center py-8 text-zinc-600 text-xs font-bold uppercase tracking-widest flex-1 flex items-center justify-center">
              Sin datos registrados
            </div>
          </div>

          <!-- Columna: Top Triples -->
          <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
            <div class="mb-5">
              <h3 class="text-white font-black uppercase tracking-wider flex items-center gap-2 mb-1">
                <svg class="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
                Top 5 Triples
              </h3>
              <p class="text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/></svg>
                Haz clic en un jugador para ver su detalle por equipo
              </p>
            </div>
            
            <div v-if="rankingPreview?.triples && rankingPreview.triples.length > 0" class="flex flex-col gap-3">
              <button 
                v-for="(item, index) in rankingPreview.triples.slice(0, 5)" 
                :key="'trip-'+item.jugadorId"
                @click="abrirDetalleJugador(item, 'triples')"
                class="w-full flex items-center justify-between bg-zinc-950/50 border border-zinc-800/50 p-3 rounded-xl hover:border-amber-500/50 hover:bg-zinc-900 transition-all text-left group cursor-pointer"
              >
                <div class="flex items-center gap-4">
                  <span class="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black shrink-0" :class="index === 0 ? 'bg-amber-500 text-zinc-900' : index === 1 ? 'bg-zinc-300 text-zinc-900' : index === 2 ? 'bg-amber-700 text-white' : 'bg-zinc-900 text-zinc-500'">
                    {{ index + 1 }}
                  </span>
                  <div>
                    <p class="text-zinc-100 font-bold text-sm uppercase group-hover:text-amber-500 transition-colors">{{ item.nombre }}</p>
                    <p class="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{{ item.clubNombre }}</p>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <span class="block text-xl font-black text-amber-500">{{ item.triples }}</span>
                  <span class="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Triples</span>
                </div>
              </button>
            </div>
            <div v-else class="text-center py-8 text-zinc-600 text-xs font-bold uppercase tracking-widest flex-1 flex items-center justify-center">
              Sin datos registrados
            </div>
          </div>

        </div>     
        
        <!-- MODAL DETALLE DE JUGADOR -->
        <div v-if="modalDetalle.abierto" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div class="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            
            <!-- Cabecera del Modal -->
            <div class="p-5 border-b border-zinc-800 bg-zinc-950/80 relative">
              <button @click="modalDetalle.abierto = false" class="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors bg-zinc-900 p-1.5 rounded-lg border border-zinc-700">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 block">
                Detalle de {{ modalDetalle.tipo === 'puntos' ? 'Puntos' : 'Triples' }} por Equipo
              </span>
              <h3 class="text-lg font-black text-white uppercase pr-8 leading-tight">{{ modalDetalle.jugador?.nombre }}</h3>
              <p class="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">{{ modalDetalle.jugador?.clubNombre }}</p>
            </div>

            <!-- Contenido / Lista de Rivales -->
            <div class="p-4 overflow-y-auto flex-1 bg-zinc-900/50">
              <div v-if="pendingDetalle" class="flex justify-center py-10">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              </div>
              
              <div v-else-if="modalDetalle.estadisticas.length > 0" class="space-y-2">
                <div 
                  v-for="(stat, idx) in modalDetalle.estadisticas" 
                  :key="idx" 
                  class="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-3 rounded-xl"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-[10px] font-black text-zinc-600 w-4 text-right">vs</span>
                    <!-- Logo del Rival -->
                    <div class="w-8 h-8 sm:w-10 sm:h-10 bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden border border-zinc-700 shrink-0 shadow-inner">
                      <img v-if="stat.rivalLogo" :src="stat.rivalLogo" class="w-full h-full object-cover p-1" />
                      <span v-else class="text-xs font-black text-zinc-500">{{ stat.rivalNombre.charAt(0) }}</span>
                    </div>
                    <!-- Nombre Rival: Visible solo en SM en adelante (oculto en móviles) -->
                    <span class="block text-xs font-bold text-zinc-200 uppercase truncate max-w-[120px]">{{ stat.rivalNombre }}</span>
                  </div>
                  
                  <div class="text-right">
                    <span class="text-lg sm:text-xl font-black text-amber-500 block leading-none">{{ stat.cantidad }}</span>
                    <span class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{{ modalDetalle.tipo === 'puntos' ? 'PTS' : '3P' }}</span>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-10 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                No hay detalles disponibles
              </div>
            </div>
          </div>
        </div>
          
        

        <!-- Botón Ver Todo (Puente a ranking.vue con categoría seleccionada) -->
        <div class="mt-10 flex justify-center">
          <NuxtLink 
            :to="`/ranking?categoria_id=${categoriaRanking}`" 
            class="group relative inline-flex items-center justify-center px-8 py-4 font-black text-sm text-white uppercase tracking-widest transition-all duration-200 bg-zinc-900 border border-zinc-700 rounded-xl hover:border-amber-500 hover:bg-zinc-800 overflow-hidden"
          >
            <div class="absolute inset-0 w-full h-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-amber-500/10 to-transparent"></div>
            
            <span class="relative flex items-center gap-3">
              Ver Ranking Completo
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </span>
          </NuxtLink>
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
  </div>
  <!-- MODAL: HISTORIAL DE PARTIDOS DEL EQUIPO -->
    <div v-if="modalEquipo.abierto" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative">
        
        <!-- Header del Modal -->
        <div class="p-5 border-b border-zinc-800 bg-zinc-950/80 relative flex-shrink-0">
          <button @click="modalEquipo.abierto = false" class="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors bg-zinc-900 p-1.5 rounded-lg border border-zinc-700">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 block">
            Desglose de Partidos
          </span>
          <h3 class="text-lg font-black text-white uppercase pr-8 leading-tight">{{ modalEquipo.nombreEquipo }}</h3>
          <p class="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">{{ selectedCategoriaNombre }}</p>
        </div>

        <!-- Contenido (Scrollable) -->
        <div class="p-4 overflow-y-auto flex-1 bg-zinc-900/50">
          <div v-if="modalEquipo.pending" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
          
          <div v-else-if="modalEquipo.partidos.length > 0" class="space-y-3">
            <div 
              v-for="partido in modalEquipo.partidos" 
              :key="partido.id" 
              class="bg-zinc-950 border border-zinc-800 p-4 rounded-xl relative overflow-hidden"
            >
              <!-- Indicador visual si ganó o perdió (opcional, calculando según el score) -->
              <div 
                class="absolute left-0 top-0 bottom-0 w-1"
                :class="{
                  'bg-green-500': (partido.local_id === modalEquipo.equipoId && partido.score_local > partido.score_visita) || (partido.visita_id === modalEquipo.equipoId && partido.score_visita > partido.score_local),
                  'bg-red-500': (partido.local_id === modalEquipo.equipoId && partido.score_local < partido.score_visita) || (partido.visita_id === modalEquipo.equipoId && partido.score_visita < partido.score_local),
                  'bg-zinc-500': partido.score_local === partido.score_visita
                }"
              ></div>

              <div class="text-[9px] text-zinc-500 font-black tracking-widest uppercase mb-3 text-center">
                {{ formatFechaCorta(partido.fecha_hora) }}
              </div>

              <!-- Marcador Miniatura -->
              <div class="flex items-center justify-between gap-2">
                <!-- Local -->
                <div class="flex flex-col items-center flex-1">
                  <span class="text-xs font-bold uppercase truncate max-w-[90px]" :class="partido.local_id === modalEquipo.equipoId ? 'text-amber-500' : 'text-zinc-400'">
                    {{ partido.local.nombre }}
                  </span>
                </div>
                
                <!-- Score -->
                <div class="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg flex-shrink-0">
                  <span class="text-sm font-black" :class="partido.local_id === modalEquipo.equipoId ? 'text-amber-500' : 'text-zinc-100'">{{ partido.score_local }}</span>
                  <span class="text-zinc-600 font-bold">-</span>
                  <span class="text-sm font-black" :class="partido.visita_id === modalEquipo.equipoId ? 'text-amber-500' : 'text-zinc-100'">{{ partido.score_visita }}</span>
                </div>

                <!-- Visita -->
                <div class="flex flex-col items-center flex-1">
                  <span class="text-xs font-bold uppercase truncate max-w-[90px]" :class="partido.visita_id === modalEquipo.equipoId ? 'text-amber-500' : 'text-zinc-400'">
                    {{ partido.visita.nombre }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest">No hay partidos registrados</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
// 1. Cargar Clubes y Partido en Vivo
const { data: clubes, pending: pendingClubes } = useFetch('/api/clubes')
const { data: partidoEnVivo } = useFetch('/api/partidos/en-vivo')
const { data: calendarioGeneral } = useFetch('/api/partidos/calendario')

// 2. Cargar Categorías
const { data: categorias } = await useFetch('/api/categorias')

const categoriaDefault = categorias.value?.find(c => c.nombre.toUpperCase() === 'TODO COMPETIDOR')
const selectedCategoriaId = ref<number | null>(categoriaDefault ? categoriaDefault.id : (categorias.value?.[0]?.id || null))

const selectedCategoriaNombre = computed(() => {
  if (!categorias.value || !selectedCategoriaId.value) return '';
  const categoria = categorias.value.find(c => c.id === selectedCategoriaId.value);
  return categoria ? categoria.nombre : '';
});

// 3. Cargas Reactivas Match Center
const { data: posiciones, pending: pendingPos } = useFetch('/api/posiciones', {
  query: { categoriaId: selectedCategoriaId }
})

const { data: proximosPartidos, pending: pendingPartidos } = useFetch('/api/partidos/proximos', {
  query: { categoriaId: selectedCategoriaId }
})

const { data: ultimosPartidos, pending: pendingUltimos } = useFetch('/api/partidos/ultimos', {
  query: { categoriaId: selectedCategoriaId }
})

// ==========================================
// RANKING PREVIEW (Corregido sin valores nulos iniciales)
// ==========================================

// 1. Buscamos la categoría por defecto igual que en el Match Center
const catDefaultRanking = categorias.value?.find(c => c.nombre.toUpperCase() === 'TODO COMPETIDOR')
const categoriaRanking = ref<number | null>(catDefaultRanking ? catDefaultRanking.id : (categorias.value?.[0]?.id || null))

// 2. Consultamos directamente con un ID válido desde el SSR
const { data: rankingPreview, pending: pendingRanking } = await useAsyncData<any>(
  'home-ranking-preview',
  () => {
    const timestamp = Date.now()
    return $fetch('/api/ranking', {
      params: { 
        categoria_id: categoriaRanking.value,
        t: timestamp 
      }
    })
  },
  { 
    watch: [categoriaRanking] 
  }
)

// Autoseleccionamos la primera categoría si está vacía
watchEffect(() => {
  if (rankingPreview.value?.selectedCategoriaId && !categoriaRanking.value) {
    categoriaRanking.value = rankingPreview.value.selectedCategoriaId
  }
})
// ==========================================

// Funciones de formato de fecha
const formatHora = (fecha: string | Date) => {
  const fechaStr = new Date(fecha).toISOString().split('T')[1];
  return fechaStr.substring(0, 5); 
}

const formatFecha = (fecha: string | Date) => {
  const dateObj = new Date(fecha);
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return `${dias[dateObj.getUTCDay()]} ${dateObj.getUTCDate()} de ${meses[dateObj.getUTCMonth()]}`;
}

const formatFechaCorta = (fecha: string | Date) => {
  const dateObj = new Date(fecha);
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${dateObj.getUTCDate()} ${meses[dateObj.getUTCMonth()]}, ${dateObj.getUTCFullYear()}`;
}

const videosHome = ref([
  {
    id: 1,
    titulo: 'HUILLINES versus COLICO SUR',
    categoria: 'Categoría Senior',
    fecha: '17 de Julio, 2026',
    youtubeId: 'yLrsLY7rSHI' 
  },
  {
    id: 2,
    titulo: 'C.D. NAVIDAD versus HUILLINES',
    categoria: 'Categoría Todo Competidor',
    fecha: '11 de Julio, 2026',
    youtubeId: 'HYpdnOggD8U' 
  },
  {
    id: 3,
    titulo: 'SAN PATRICIO versus C.D. NAVIDAD',
    categoria: 'Categoría Senior',
    fecha: '17 de Julio, 2026',
    youtubeId: 'LyKNFcFESpg' 
  }
])

// ==========================================
// MODAL DETALLE DE JUGADOR (RANKING)
// ==========================================
const modalDetalle = ref({
  abierto: false,
  tipo: 'puntos' as 'puntos' | 'triples',
  jugador: null as any,
  estadisticas: [] as any[]
})

const pendingDetalle = ref(false)

const abrirDetalleJugador = async (jugador: any, tipo: 'puntos' | 'triples') => {
  // Preparamos el modal
  modalDetalle.value.jugador = jugador
  modalDetalle.value.tipo = tipo
  modalDetalle.value.abierto = true
  pendingDetalle.value = true
  modalDetalle.value.estadisticas = [] // Limpiamos caché anterior

  try {
    // LLAMADA A LA API: Este endpoint debe recibir el ID del jugador, categoría y el tipo de dato requerido.
    // Retorna un arreglo ej: [{ rivalNombre: 'Navidad', rivalLogo: 'url...', cantidad: 14 }, ...]
    const data: any = await $fetch('/api/ranking/jugador-detalles', {
      params: {
        jugador_id: jugador.jugadorId,
        categoria_id: categoriaRanking.value,
        tipo: tipo
      }
    })
    
    // Si tienes los datos ordenados del backend excelente, si no, puedes ordenar aquí de mayor a menor
    modalDetalle.value.estadisticas = data.sort((a: any, b: any) => b.cantidad - a.cantidad)
  } catch (error) {
    console.error('Error al cargar detalle de jugador:', error)
    // En caso de que el endpoint aún no exista o falle
    modalDetalle.value.estadisticas = [] 
  } finally {
    pendingDetalle.value = false
  }
}

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
// ==========================================
// MODAL HISTORIAL DE PARTIDOS DEL EQUIPO
// ==========================================
const modalEquipo = ref({
  abierto: false,
  pending: false,
  equipoId: 0,
  nombreEquipo: '',
  partidos: [] as any[]
})

const abrirDetalleEquipo = async (equipoId: number, nombreEquipo: string) => {
  if (!selectedCategoriaId.value) return

  modalEquipo.value.abierto = true
  modalEquipo.value.pending = true
  modalEquipo.value.equipoId = equipoId
  modalEquipo.value.nombreEquipo = nombreEquipo
  modalEquipo.value.partidos = []

  try {
    const data: any = await $fetch(`/api/equipos/${equipoId}/partidos-categoria`, {
      query: { categoria_id: selectedCategoriaId.value }
    })
    modalEquipo.value.partidos = data
  } catch (error) {
    console.error('Error al cargar historial del equipo:', error)
  } finally {
    modalEquipo.value.pending = false
  }
}

const config = useRuntimeConfig()

// 1. Transformar la llave VAPID (Obligatorio para que el navegador acepte la suscripción)
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}


</script>

<style>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>