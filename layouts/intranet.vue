<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden font-sans selection:bg-amber-600 selection:text-white">
    
    <!-- Sidebar Desktop & Mobile -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo y Título -->
      <div class="h-20 flex items-center justify-center border-b border-zinc-800 px-6">
        <h2 class="text-xl font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2">
          <span class="w-2 h-6 bg-red-800 rounded-sm"></span>
          Intranet <span class="text-amber-500">ABC</span>
        </h2>
      </div>

      <!-- Enlaces de Navegación -->
      <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <NuxtLink 
          to="/intranet/dashboard" 
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold tracking-wide transition-all"
          active-class="bg-red-900/20 text-red-500 border border-red-900/50"
          inactive-class="text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
          @click="isSidebarOpen = false"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          Dashboard
        </NuxtLink>

        <NuxtLink 
          to="/intranet/clubes" 
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold tracking-wide transition-all"
          active-class="bg-amber-900/20 text-amber-500 border border-amber-900/50"
          inactive-class="text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
          @click="isSidebarOpen = false"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          Clubes y Jugadores
        </NuxtLink>

        <NuxtLink 
          to="/intranet/fixture" 
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold tracking-wide transition-all"
          active-class="bg-blue-900/20 text-blue-500 border border-blue-900/50"
          inactive-class="text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
          @click="isSidebarOpen = false"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          Fixture
        </NuxtLink>

        <NuxtLink 
          to="/intranet/ranking" 
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold tracking-wide transition-all"
          active-class="bg-amber-900/20 text-amber-500 border border-amber-900/50"
          inactive-class="text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
          @click="isSidebarOpen = false"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          Ranking y Goleadores
        </NuxtLink>
      </nav>

      <!-- Botón de Cerrar Sesión -->
      <div class="p-4 border-t border-zinc-800">
        <button 
          @click="handleLogout"
          :disabled="cargando"
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-950 border border-zinc-800 hover:border-red-500/50 text-zinc-400 hover:text-red-500 rounded-lg text-sm font-bold tracking-wide transition-all disabled:opacity-50"
        >
          <svg v-if="!cargando" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          <span v-if="cargando" class="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></span>
          {{ cargando ? 'Saliendo...' : 'Cerrar Sesión' }}
        </button>
      </div>
    </aside>

    <!-- Overlay para móviles (Cierra el sidebar al hacer clic fuera) -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false" 
      class="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
    ></div>

    <!-- Área Principal de Contenido -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden bg-zinc-950 relative">
      <!-- Decoración de fondo suave -->
      <div class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-zinc-900/50 to-transparent pointer-events-none z-0"></div>
      
      <!-- Topbar (Solo visible en móviles para abrir menú) -->
      <header class="h-20 flex items-center justify-between px-4 md:px-8 border-b border-zinc-800/50 relative z-10 lg:hidden">
        <h1 class="text-lg font-black tracking-widest uppercase text-zinc-200">
          Panel de <span class="text-amber-500">Control</span>
        </h1>
        <button @click="isSidebarOpen = true" class="text-zinc-400 hover:text-white">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </header>

      <!-- Slot para renderizar las páginas -->
      <div class="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 scrollbar-hide">
        <slot />
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isSidebarOpen = ref(false)
const cargando = ref(false)

const handleLogout = async () => {
  cargando.value = true
  try {
    await useFetch('/api/auth/logout', { method: 'POST' })
    // Al limpiar la cookie, redirigimos al login
    navigateTo('/intranet/login')
  } catch (error) {
    console.error('Error al cerrar sesión', error)
  } finally {
    cargando.value = false
  }
}
</script>