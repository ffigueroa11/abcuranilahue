<template>
  <div>
    <h1 class="text-3xl font-black text-white uppercase tracking-tight mb-2">Resumen General</h1>
    <p class="text-zinc-400 text-sm mb-8">Bienvenido al panel de administración del campeonato.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
        <h3 class="text-zinc-500 font-black text-xs uppercase tracking-widest mb-1">Equipos Inscritos</h3>
        <p class="text-3xl font-black text-amber-500">0</p>
      </div>
      <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
        <h3 class="text-zinc-500 font-black text-xs uppercase tracking-widest mb-1">Jugadores Activos</h3>
        <p class="text-3xl font-black text-red-500">0</p>
      </div>
      <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
        <h3 class="text-zinc-500 font-black text-xs uppercase tracking-widest mb-1">Partidos Restantes</h3>
        <p class="text-3xl font-black text-blue-500">0</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'intranet', // Aplicamos el nuevo layout
  middleware: 'auth'  // Protegemos la ruta
})
</script>