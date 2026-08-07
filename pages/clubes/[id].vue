<template>
  <div class="min-h-[100dvh] bg-zinc-950 pb-20 pt-24 px-4 relative overflow-hidden">
    <!-- Decoración de fondo acorde al diseño principal -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-amber-900/10 blur-[100px] rounded-full pointer-events-none"></div>

    <div class="max-w-[1000px] mx-auto relative z-10">
      
      <!-- Estado de Carga -->
      <div v-if="pending" class="flex justify-center py-32">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>

      <div v-else-if="equipo" class="space-y-10">
        
        <!-- ENCABEZADO DEL EQUIPO -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-600 to-amber-400"></div>
          
          <div class="w-32 h-32 md:w-44 md:h-44 bg-zinc-950 rounded-full flex items-center justify-center border-4 border-zinc-800 shadow-inner shrink-0 p-4 relative z-10">
            <img v-if="equipo.logo_url" :src="equipo.logo_url" :alt="equipo.nombre" class="w-full h-full object-contain drop-shadow-xl" />
            <span v-else class="text-6xl font-black text-zinc-600">{{ equipo.nombre.charAt(0) }}</span>
          </div>

          <div class="text-center md:text-left flex-1 relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-600/30 bg-amber-900/10 text-amber-500 text-xs font-black tracking-widest uppercase mb-4">
              Club Oficial Afiliado
            </div>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-zinc-100 tracking-tighter mb-2 leading-none">
              {{ equipo.nombre }}
            </h1>
            <p class="text-zinc-400 text-sm font-bold uppercase tracking-widest mt-4">
              Temporada 2026
            </p>
          </div>
        </div>

        <!-- CATEGORÍAS DEL CLUB -->
        <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm">
          <h3 class="text-zinc-500 text-xs font-black tracking-widest uppercase mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Categorías Inscritas
          </h3>
          <div v-if="equipo.categorias && equipo.categorias.length > 0" class="flex flex-wrap gap-3">
            <span v-for="cat in equipo.categorias" :key="cat.id" class="px-4 py-2 bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm">
              {{ cat.nombre }}
            </span>
          </div>
          <div v-else class="text-xs text-zinc-600 font-bold uppercase tracking-widest">
            No hay categorías registradas
          </div>
        </div>

        <!-- NÓMINA DE JUGADORES -->
        <div class="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm overflow-hidden flex flex-col">
          <div class="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 gap-2">
            <h2 class="text-lg font-black uppercase tracking-tight flex items-baseline gap-2">
              <span class="w-2 h-6 bg-amber-600 rounded-sm"></span>
              <span>Plantel Oficial</span>
              <span class="text-xs text-zinc-500 font-medium normal-case">({{ equipo.jugadores?.length || 0 }} jugadores)</span>
            </h2>
          </div>

          <div v-if="equipo.jugadores && equipo.jugadores.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="jugador in equipo.jugadores" :key="jugador.id" class="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 flex flex-col items-center text-center group hover:border-amber-500/50 transition-all">
              <!-- Imagen y Dorsal -->
              <div class="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center mb-4 border-2 border-zinc-700 relative group-hover:border-amber-500/30 transition-colors">
                <!-- <span class="absolute -top-1 -right-1 bg-amber-500 text-zinc-900 text-xs font-black w-8 h-8 rounded-full flex items-center justify-center border-2 border-zinc-950 group-hover:bg-amber-400 transition-colors">{{ jugador.numero || '-' }}</span> -->
                <svg class="w-12 h-12 text-zinc-600 group-hover:text-zinc-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              <!-- Nombre -->
              <h4 class="text-sm font-bold uppercase tracking-wider text-zinc-100 group-hover:text-amber-400 transition-colors mb-2">{{ jugador.nombre }}</h4>

              <!-- Categorías -->
              <div class="flex flex-wrap justify-center gap-1.5">
                <span v-if="jugador.categorias.length === 0" class="text-[9px] text-zinc-600 font-bold uppercase">Sin categoría</span>
                <span 
                  v-for="catJugador in jugador.categorias" 
                  :key="catJugador.id" 
                  class="px-2 py-1 bg-amber-900/20 text-amber-500 border border-amber-900/50 text-[9px] font-black uppercase tracking-widest rounded"
                >
                  {{ catJugador.nombre }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-12 text-zinc-600 text-xs font-bold uppercase tracking-widest">
            Aún no hay jugadores registrados en este club
          </div>
        </div>

      </div>

      <!-- Error / 404 -->
      <div v-else class="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800 mt-10">
        <svg class="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <h2 class="text-2xl font-black text-zinc-400 uppercase tracking-tight">Club no encontrado</h2>
        <button @click="$router.back()" class="text-amber-500 font-bold text-xs uppercase tracking-widest mt-6 inline-flex items-center gap-2 hover:text-amber-400 border border-amber-500/30 px-6 py-3 rounded-xl bg-amber-900/10">
          &larr; Volver Atrás
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const equipoId = route.params.id

// Consulta al backend para traer la información consolidada
const { data: equipo, pending } = useFetch(`/api/equipos/${equipoId}/perfil`)
</script>