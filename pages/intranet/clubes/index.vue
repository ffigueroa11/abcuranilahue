<template>
  <div>
    <!-- Encabezado y Acciones -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black text-white uppercase tracking-tight mb-1">Gestión de Clubes</h1>
        <p class="text-zinc-400 text-sm">Administra los equipos y sus respectivas plantillas de jugadores.</p>
      </div>
      
      <button 
        @click="modalAbierto = true"
        class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Nuevo Club
      </button>
    </div>

    <!-- Estado de Carga -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <!-- Grilla de Clubes -->
    <div v-else-if="clubes && clubes.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div 
        v-for="club in clubes" 
        :key="club.id" 
        class="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors rounded-xl p-6 flex flex-col items-center group cursor-pointer"
        @click="gestionarRoster(club.id)"
      >
        <div class="w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center overflow-hidden mb-4 shadow-inner">
          <img v-if="club.logo_url" :src="club.logo_url" class="w-full h-full object-cover p-2" />
          <span v-else class="text-3xl font-black text-zinc-600">{{ club.nombre.charAt(0) }}</span>
        </div>
        <h3 class="text-zinc-100 font-black text-lg uppercase text-center mb-1">{{ club.nombre }}</h3>
        <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
          {{ club._count.jugadores }} Jugadores
        </p>
        
        <div class="w-full mt-6 pt-4 border-t border-zinc-800/50 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span class="text-blue-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            Ver Plantilla &rarr;
          </span>
        </div>
      </div>
    </div>

    <div v-else class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
      <h3 class="text-zinc-300 font-bold text-lg mb-2">No hay clubes registrados</h3>
      <p class="text-zinc-500 text-sm">Comienza agregando el primer equipo de la asociación.</p>
    </div>

    <!-- Modal Nuevo Club (Simplificado) -->
    <div v-if="modalAbierto" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 class="text-xl font-black text-white uppercase tracking-wider mb-6 border-b border-zinc-800 pb-4">Registrar Equipo</h2>
        
        <form @submit.prevent="guardarClub" class="space-y-4">
          <div>
            <label class="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Nombre del Club</label>
            <input 
              v-model="formulario.nombre" 
              type="text" 
              required
              class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all"
            />
          </div>
          <div>
            <label class="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">URL del Logo (Opcional)</label>
            <input 
              v-model="formulario.logo_url" 
              type="url" 
              class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all"
              placeholder="https://ejemplo.com/logo.png"
            />
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" @click="modalAbierto = false" class="flex-1 px-4 py-3 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg font-bold text-sm uppercase transition-colors">Cancelar</button>
            <button type="submit" :disabled="guardando" class="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-bold text-sm uppercase transition-colors flex items-center justify-center">
              <span v-if="guardando" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'intranet',
  middleware: 'auth'
})

// Estado
const modalAbierto = ref(false)
const guardando = ref(false)
const formulario = ref({ nombre: '', logo_url: '' })

// Cargar Clubes
const { data: clubes, pending, refresh } = useFetch('/api/intranet/clubes')

// Guardar Club
const guardarClub = async () => {
  guardando.value = true
  try {
    await $fetch('/api/intranet/clubes', {
      method: 'POST',
      body: formulario.value
    })
    
    modalAbierto.value = false
    formulario.value = { nombre: '', logo_url: '' }
    await refresh() // Recarga la grilla automáticamente
  } catch (error) {
    alert('Error al guardar el club')
  } finally {
    guardando.value = false
  }
}

// Navegar a la plantilla (Lo construiremos a continuación)
const gestionarRoster = (clubId: number) => {
  navigateTo(`/intranet/clubes/${clubId}`)
}
</script>